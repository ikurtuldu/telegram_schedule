export class NotificationService {
  private static hasPermission = false;

  static async requestPermission(): Promise<boolean> {
    if (!('Notification' in window)) {
      console.log('Bu tarayıcı bildirimleri desteklemiyor');
      return false;
    }

    if (Notification.permission === 'granted') {
      this.hasPermission = true;
      return true;
    }

    if (Notification.permission !== 'denied') {
      const permission = await Notification.requestPermission();
      this.hasPermission = permission === 'granted';
      return this.hasPermission;
    }

    return false;
  }

  static showNotification(title: string, body: string, icon?: string): void {
    if (!this.hasPermission || Notification.permission !== 'granted') {
      return;
    }

    try {
      const notification = new Notification(title, {
        body,
        icon: icon || '📱',
        badge: '📱',
        tag: 'telegram-scheduler',
        requireInteraction: false,
      });

      // 5 saniye sonra otomatik kapat
      setTimeout(() => notification.close(), 5000);
    } catch (error) {
      console.error('Bildirim gönderilemedi:', error);
    }
  }

  static isSupported(): boolean {
    return 'Notification' in window;
  }

  static getPermissionStatus(): NotificationPermission {
    if (!this.isSupported()) {
      return 'denied';
    }
    return Notification.permission;
  }
}
