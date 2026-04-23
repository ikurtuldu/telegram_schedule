import { ScheduledMessage, MessageLog } from '../types';

const MESSAGES_KEY = 'scheduledMessages';
const LOGS_KEY = 'messageLogs';

export class StorageService {
  // Zamanlanmış mesajlar
  static getScheduledMessages(): ScheduledMessage[] {
    const data = localStorage.getItem(MESSAGES_KEY);
    return data ? JSON.parse(data) : [];
  }

  static saveScheduledMessage(message: ScheduledMessage): void {
    const messages = this.getScheduledMessages();
    messages.push(message);
    localStorage.setItem(MESSAGES_KEY, JSON.stringify(messages));
  }

  static updateScheduledMessage(id: string, updates: Partial<ScheduledMessage>): void {
    const messages = this.getScheduledMessages();
    const index = messages.findIndex(m => m.id === id);
    if (index !== -1) {
      messages[index] = { ...messages[index], ...updates };
      localStorage.setItem(MESSAGES_KEY, JSON.stringify(messages));
    }
  }

  static deleteScheduledMessage(id: string): void {
    const messages = this.getScheduledMessages();
    const filtered = messages.filter(m => m.id !== id);
    localStorage.setItem(MESSAGES_KEY, JSON.stringify(filtered));
  }

  // Log kayıtları
  static getMessageLogs(): MessageLog[] {
    const data = localStorage.getItem(LOGS_KEY);
    return data ? JSON.parse(data) : [];
  }

  static addMessageLog(log: MessageLog): void {
    const logs = this.getMessageLogs();
    logs.unshift(log); // En yeni loglar başta
    // Son 100 logu tut
    const trimmedLogs = logs.slice(0, 100);
    localStorage.setItem(LOGS_KEY, JSON.stringify(trimmedLogs));
  }

  static clearLogs(): void {
    localStorage.setItem(LOGS_KEY, JSON.stringify([]));
  }

  static clearAll(): void {
    localStorage.removeItem(MESSAGES_KEY);
    localStorage.removeItem(LOGS_KEY);
  }
}
