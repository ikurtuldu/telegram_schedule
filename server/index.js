import express from 'express';
import cors from 'cors';
import db from './database.js';
import { testTelegramConnection } from './telegramService.js';
import { startScheduler } from './scheduler.js';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server çalışıyor' });
});

// ============= TELEGRAM CONFIG =============

// Config kaydet
app.post('/api/config', (req, res) => {
  try {
    const { botToken, defaultChatId } = req.body;

    if (!botToken || !defaultChatId) {
      return res.status(400).json({ error: 'Bot token ve chat ID gerekli' });
    }

    // Mevcut config'i sil
    db.prepare('DELETE FROM telegram_config').run();

    // Yeni config ekle
    db.prepare(`
      INSERT INTO telegram_config (bot_token, default_chat_id)
      VALUES (?, ?)
    `).run(botToken, defaultChatId);

    res.json({ success: true, message: 'Yapılandırma kaydedildi' });
  } catch (error) {
    console.error('Config kaydetme hatası:', error);
    res.status(500).json({ error: error.message });
  }
});

// Config getir
app.get('/api/config', (req, res) => {
  try {
    const config = db.prepare('SELECT * FROM telegram_config ORDER BY id DESC LIMIT 1').get();
    
    if (!config) {
      return res.json(null);
    }

    res.json({
      botToken: config.bot_token,
      defaultChatId: config.default_chat_id,
    });
  } catch (error) {
    console.error('Config getirme hatası:', error);
    res.status(500).json({ error: error.message });
  }
});

// Config test et
app.post('/api/config/test', async (req, res) => {
  try {
    const { botToken, chatId } = req.body;

    if (!botToken || !chatId) {
      return res.status(400).json({ error: 'Bot token ve chat ID gerekli' });
    }

    const result = await testTelegramConnection(botToken, chatId);
    
    if (result.success) {
      res.json({ success: true, message: 'Bağlantı başarılı!' });
    } else {
      res.status(400).json({ success: false, error: result.error });
    }
  } catch (error) {
    console.error('Test hatası:', error);
    res.status(500).json({ error: error.message });
  }
});

// ============= SCHEDULED MESSAGES =============

// Tüm mesajları getir
app.get('/api/messages', (req, res) => {
  try {
    const messages = db.prepare(`
      SELECT * FROM scheduled_messages 
      ORDER BY scheduled_time ASC
    `).all();

    const formatted = messages.map(msg => ({
      id: msg.id,
      chatId: msg.chat_id,
      message: msg.message,
      scheduledTime: msg.scheduled_time,
      status: msg.status,
      createdAt: msg.created_at,
    }));

    res.json(formatted);
  } catch (error) {
    console.error('Mesaj listesi hatası:', error);
    res.status(500).json({ error: error.message });
  }
});

// Yeni mesaj ekle
app.post('/api/messages', (req, res) => {
  try {
    const { id, chatId, message, scheduledTime } = req.body;

    if (!id || !chatId || !message || !scheduledTime) {
      return res.status(400).json({ error: 'Tüm alanlar gerekli' });
    }

    db.prepare(`
      INSERT INTO scheduled_messages (id, chat_id, message, scheduled_time, status)
      VALUES (?, ?, ?, ?, 'pending')
    `).run(id, chatId, message, scheduledTime);

    res.json({ success: true, message: 'Mesaj zamanlandı' });
  } catch (error) {
    console.error('Mesaj ekleme hatası:', error);
    res.status(500).json({ error: error.message });
  }
});

// Mesaj sil
app.delete('/api/messages/:id', (req, res) => {
  try {
    const { id } = req.params;

    db.prepare('DELETE FROM scheduled_messages WHERE id = ?').run(id);

    res.json({ success: true, message: 'Mesaj silindi' });
  } catch (error) {
    console.error('Mesaj silme hatası:', error);
    res.status(500).json({ error: error.message });
  }
});

// ============= LOGS =============

// Tüm logları getir
app.get('/api/logs', (req, res) => {
  try {
    const logs = db.prepare(`
      SELECT * FROM message_logs 
      ORDER BY created_at DESC 
      LIMIT 100
    `).all();

    const formatted = logs.map(log => ({
      id: log.id,
      messageId: log.message_id,
      chatId: log.chat_id,
      message: log.message,
      scheduledTime: log.scheduled_time,
      sentTime: log.sent_time,
      status: log.status,
      error: log.error,
    }));

    res.json(formatted);
  } catch (error) {
    console.error('Log listesi hatası:', error);
    res.status(500).json({ error: error.message });
  }
});

// Logları temizle
app.delete('/api/logs', (req, res) => {
  try {
    db.prepare('DELETE FROM message_logs').run();
    res.json({ success: true, message: 'Loglar temizlendi' });
  } catch (error) {
    console.error('Log temizleme hatası:', error);
    res.status(500).json({ error: error.message });
  }
});

// Tümünü temizle
app.delete('/api/clear-all', (req, res) => {
  try {
    db.prepare('DELETE FROM scheduled_messages').run();
    db.prepare('DELETE FROM message_logs').run();
    res.json({ success: true, message: 'Tüm veriler temizlendi' });
  } catch (error) {
    console.error('Temizleme hatası:', error);
    res.status(500).json({ error: error.message });
  }
});

// Server'ı başlat
app.listen(PORT, () => {
  console.log(`🚀 Server çalışıyor: http://localhost:${PORT}`);
  console.log(`📡 API endpoint: http://localhost:${PORT}/api`);
  
  // Scheduler'ı başlat
  startScheduler();
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Server kapatılıyor...');
  db.close();
  process.exit(0);
});
