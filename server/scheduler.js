import cron from 'node-cron';
import db from './database.js';
import { sendTelegramMessage } from './telegramService.js';

let cronJob = null;

export function startScheduler() {
  if (cronJob) {
    console.log('⚠️ Scheduler zaten çalışıyor');
    return;
  }

  // Her dakika çalış
  cronJob = cron.schedule('* * * * *', async () => {
    console.log('🔍 Zamanı gelen mesajlar kontrol ediliyor...');
    await checkAndSendMessages();
  });

  console.log('✅ Scheduler başlatıldı - Her dakika kontrol edilecek');
  
  // İlk kontrolü hemen yap
  checkAndSendMessages();
}

export function stopScheduler() {
  if (cronJob) {
    cronJob.stop();
    cronJob = null;
    console.log('🛑 Scheduler durduruldu');
  }
}

async function checkAndSendMessages() {
  try {
    // Bot config'i al
    const config = db.prepare('SELECT * FROM telegram_config ORDER BY id DESC LIMIT 1').get();
    
    if (!config) {
      console.log('⚠️ Telegram yapılandırması bulunamadı');
      return;
    }

    // Zamanı gelen bekleyen mesajları al
    const now = new Date().toISOString();
    const messages = db.prepare(`
      SELECT * FROM scheduled_messages 
      WHERE status = 'pending' 
      AND scheduled_time <= ?
      ORDER BY scheduled_time ASC
    `).all(now);

    if (messages.length === 0) {
      return;
    }

    console.log(`📨 ${messages.length} mesaj gönderilecek...`);

    for (const message of messages) {
      await sendScheduledMessage(config.bot_token, message);
    }
  } catch (error) {
    console.error('❌ Scheduler hatası:', error);
  }
}

async function sendScheduledMessage(botToken, message) {
  const logId = `log_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  const log = {
    id: logId,
    message_id: message.id,
    chat_id: message.chat_id,
    message: message.message,
    scheduled_time: message.scheduled_time,
    sent_time: new Date().toISOString(),
    status: 'sent',
    error: null,
  };

  try {
    await sendTelegramMessage(botToken, message.chat_id, message.message);

    // Mesajı gönderildi olarak işaretle
    db.prepare(`
      UPDATE scheduled_messages 
      SET status = 'sent', updated_at = CURRENT_TIMESTAMP 
      WHERE id = ?
    `).run(message.id);

    log.status = 'sent';
    console.log(`✅ Mesaj gönderildi: ${message.id}`);
  } catch (error) {
    // Başarısız olarak işaretle
    db.prepare(`
      UPDATE scheduled_messages 
      SET status = 'failed', updated_at = CURRENT_TIMESTAMP 
      WHERE id = ?
    `).run(message.id);

    log.status = 'failed';
    log.error = error.message;
    console.error(`❌ Mesaj gönderilemedi: ${message.id}`, error.message);
  }

  // Log kaydet
  db.prepare(`
    INSERT INTO message_logs (id, message_id, chat_id, message, scheduled_time, sent_time, status, error)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `).run(log.id, log.message_id, log.chat_id, log.message, log.scheduled_time, log.sent_time, log.status, log.error);
}
