import { TelegramConfig } from '../types';

export class TelegramService {
  private botToken: string;

  constructor(botToken: string) {
    this.botToken = botToken;
  }

  async sendMessage(chatId: string, message: string): Promise<boolean> {
    if (!this.botToken) {
      throw new Error('Bot token bulunamadı');
    }

    const url = `https://api.telegram.org/bot${this.botToken}/sendMessage`;

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: chatId,
          text: message,
          parse_mode: 'HTML',
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.ok) {
        // Telegram API'den gelen hata mesajlarını Türkçeleştir
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
        
        throw new Error(errorMsg);
      }

      return true;
    } catch (error: any) {
      console.error('Telegram API hatası:', error);
      
      // Network hataları için özel mesaj
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error('İnternet bağlantısı hatası. Lütfen bağlantınızı kontrol edin.');
      }
      
      throw error;
    }
  }

  async testConnection(chatId: string): Promise<boolean> {
    try {
      await this.sendMessage(chatId, '✅ Test mesajı - Bağlantı başarılı!');
      return true;
    } catch (error) {
      console.error('Bağlantı testi başarısız:', error);
      return false;
    }
  }
}

export function getTelegramConfig(): TelegramConfig | null {
  const config = localStorage.getItem('telegramConfig');
  return config ? JSON.parse(config) : null;
}

export function saveTelegramConfig(config: TelegramConfig): void {
  localStorage.setItem('telegramConfig', JSON.stringify(config));
}
