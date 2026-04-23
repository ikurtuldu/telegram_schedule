import { ScheduledMessage, MessageLog } from '../types';
import { StorageService } from './storageService';
import { TelegramService } from './telegramService';
import { NotificationService } from './notificationService';

export class SchedulerService {
  private checkInterval: number | null = null;
  private telegramService: TelegramService | null = null;

  constructor(botToken?: string) {
    if (botToken) {
      this.telegramService = new TelegramService(botToken);
    }
  }

  setBotToken(botToken: string) {
    this.telegramService = new TelegramService(botToken);
  }

  start(onUpdate?: () => void): void {
    if (this.checkInterval !== null) {
      return; // Zaten çalışıyor
    }

    // Her 10 saniyede bir kontrol et
    this.checkInterval = window.setInterval(() => {
      this.checkAndSendMessages(onUpdate);
    }, 10000);

    // İlk kontrolü hemen yap
    this.checkAndSendMessages(onUpdate);

    // Visibility API - Sekme görünür olduğunda kontrol et
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        console.log('Sekme aktif hale geldi, mesajlar kontrol ediliyor...');
        this.checkAndSendMessages(onUpdate);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
  }

  stop(): void {
    if (this.checkInterval !== null) {
      clearInterval(this.checkInterval);
      this.checkInterval = null;
    }
  }

  private async checkAndSendMessages(onUpdate?: () => void): Promise<void> {
    const messages = StorageService.getScheduledMessages();
    const now = new Date();

    for (const message of messages) {
      if (message.status !== 'pending') {
        continue;
      }

      const scheduledTime = new Date(message.scheduledTime);

      // Zamanı gelmiş mi?
      if (scheduledTime <= now) {
        await this.sendScheduledMessage(message);
        onUpdate?.();
      }
    }
  }

  private async sendScheduledMessage(message: ScheduledMessage): Promise<void> {
    if (!this.telegramService) {
      console.error('Telegram servisi başlatılmamış');
      return;
    }

    const log: MessageLog = {
      id: Date.now().toString(),
      messageId: message.id,
      chatId: message.chatId,
      message: message.message,
      scheduledTime: message.scheduledTime,
      sentTime: new Date().toISOString(),
      status: 'sent',
    };

    try {
      await this.telegramService.sendMessage(message.chatId, message.message);

      // Başarılı
      StorageService.updateScheduledMessage(message.id, { status: 'sent' });
      log.status = 'sent';
      StorageService.addMessageLog(log);
      
      // Bildirim gönder
      NotificationService.showNotification(
        '✅ Mesaj Gönderildi',
        `Telegram mesajınız başarıyla gönderildi: ${message.message.substring(0, 50)}...`
      );
      
      console.log(`✅ Mesaj gönderildi: ${message.id}`);
    } catch (error) {
      // Başarısız
      const errorMessage = error instanceof Error ? error.message : 'Bilinmeyen hata';
      StorageService.updateScheduledMessage(message.id, { status: 'failed' });
      log.status = 'failed';
      log.error = errorMessage;
      StorageService.addMessageLog(log);

      // Hata bildirimi
      NotificationService.showNotification(
        '❌ Mesaj Gönderilemedi',
        `Hata: ${errorMessage}`
      );

      console.error(`❌ Mesaj gönderilemedi: ${message.id}`, error);
    }
  }
}
