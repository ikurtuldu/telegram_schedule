// Hybrid Storage: API varsa kullan, yoksa localStorage'a fallback yap

import * as apiService from './apiService';
import { StorageService } from './storageService';
import { ScheduledMessage, MessageLog, TelegramConfig } from '../types';

let useAPI = true;

// API'nin çalışıp çalışmadığını kontrol et
async function checkAPI(): Promise<boolean> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 saniye timeout
    
    const response = await fetch('http://localhost:3001/api/health', {
      method: 'GET',
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);
    
    console.log('Backend durumu:', response.ok ? '✅ Çalışıyor' : '❌ Hata');
    return response.ok;
  } catch (error: any) {
    console.warn('Backend bağlantı hatası:', error.message);
    console.warn('💡 Backend başlatmak için: cd server && npm start');
    return false;
  }
}

// Config
export async function saveConfig(botToken: string, defaultChatId: string): Promise<void> {
  const apiAvailable = await checkAPI();
  
  if (apiAvailable && useAPI) {
    try {
      await apiService.saveConfig(botToken, defaultChatId);
      return;
    } catch (error) {
      console.warn('API kullanılamıyor, localStorage kullanılıyor:', error);
      useAPI = false;
    }
  }
  
  // Fallback to localStorage
  localStorage.setItem('telegramConfig', JSON.stringify({ botToken, defaultChatId }));
}

export async function getConfig(): Promise<TelegramConfig | null> {
  if (useAPI) {
    try {
      const config = await apiService.getConfig();
      return config;
    } catch (error) {
      console.warn('API kullanılamıyor, localStorage kullanılıyor:', error);
      useAPI = false;
    }
  }
  
  // Fallback to localStorage
  const config = localStorage.getItem('telegramConfig');
  return config ? JSON.parse(config) : null;
}

export async function testConfig(botToken: string, chatId: string): Promise<{ success: boolean; error?: string }> {
  if (useAPI) {
    try {
      return await apiService.testConfig(botToken, chatId);
    } catch (error) {
      console.warn('API kullanılamıyor, doğrudan Telegram API kullanılıyor:', error);
      useAPI = false;
    }
  }
  
  // Fallback: Doğrudan Telegram API'yi test et
  const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: '✅ Test mesajı - Bağlantı başarılı!',
        parse_mode: 'HTML',
      }),
    });

    const data = await response.json();

    if (!response.ok || !data.ok) {
      let errorMsg = data.description || 'Mesaj gönderilemedi';
      
      if (errorMsg.includes('bot was blocked')) {
        errorMsg = 'Bot kullanıcı tarafından engellenmiş';
      } else if (errorMsg.includes('chat not found')) {
        errorMsg = 'Chat ID bulunamadı. Lütfen bota önce bir mesaj gönderin.';
      } else if (errorMsg.includes('Unauthorized')) {
        errorMsg = 'Bot token geçersiz. Lütfen doğru token girin.';
      } else if (errorMsg.includes('Bad Request')) {
        errorMsg = 'Geçersiz istek. Chat ID formatını kontrol edin.';
      }
      
      return { success: false, error: errorMsg };
    }

    return { success: true };
  } catch (error: any) {
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      return { success: false, error: 'İnternet bağlantısı hatası.' };
    }
    return { success: false, error: error.message };
  }
}

// Messages
export async function getMessages(): Promise<ScheduledMessage[]> {
  if (useAPI) {
    try {
      return await apiService.getMessages();
    } catch (error) {
      console.warn('API kullanılamıyor, localStorage kullanılıyor:', error);
      useAPI = false;
    }
  }
  
  // Fallback to localStorage
  return StorageService.getScheduledMessages();
}

export async function addMessage(message: {
  id: string;
  chatId: string;
  message: string;
  scheduledTime: string;
}): Promise<void> {
  if (useAPI) {
    try {
      await apiService.addMessage(message);
      return;
    } catch (error) {
      console.warn('API kullanılamıyor, localStorage kullanılıyor:', error);
      useAPI = false;
    }
  }
  
  // Fallback to localStorage
  StorageService.saveScheduledMessage({
    id: message.id,
    chatId: message.chatId,
    message: message.message,
    scheduledTime: message.scheduledTime,
    status: 'pending',
    createdAt: new Date().toISOString(),
  });
}

export async function deleteMessage(id: string): Promise<void> {
  if (useAPI) {
    try {
      await apiService.deleteMessage(id);
      return;
    } catch (error) {
      console.warn('API kullanılamıyor, localStorage kullanılıyor:', error);
      useAPI = false;
    }
  }
  
  // Fallback to localStorage
  StorageService.deleteScheduledMessage(id);
}

// Logs
export async function getLogs(): Promise<MessageLog[]> {
  if (useAPI) {
    try {
      return await apiService.getLogs();
    } catch (error) {
      console.warn('API kullanılamıyor, localStorage kullanılıyor:', error);
      useAPI = false;
    }
  }
  
  // Fallback to localStorage
  return StorageService.getMessageLogs();
}

export async function clearLogs(): Promise<void> {
  if (useAPI) {
    try {
      await apiService.clearLogs();
      return;
    } catch (error) {
      console.warn('API kullanılamıyor, localStorage kullanılıyor:', error);
      useAPI = false;
    }
  }
  
  // Fallback to localStorage
  StorageService.clearLogs();
}

export async function clearAll(): Promise<void> {
  if (useAPI) {
    try {
      await apiService.clearAll();
      return;
    } catch (error) {
      console.warn('API kullanılamıyor, localStorage kullanılıyor:', error);
      useAPI = false;
    }
  }
  
  // Fallback to localStorage
  StorageService.clearAll();
}

// API durumunu kontrol et
export async function isAPIAvailable(): Promise<boolean> {
  const available = await checkAPI();
  useAPI = available;
  return available;
}
