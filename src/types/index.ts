export interface ScheduledMessage {
  id: string;
  chatId: string;
  message: string;
  scheduledTime: string; // ISO string
  status: 'pending' | 'sent' | 'failed';
  createdAt: string;
}

export interface TelegramConfig {
  botToken: string;
  defaultChatId: string;
}

export interface MessageLog {
  id: string;
  messageId: string;
  chatId: string;
  message: string;
  scheduledTime: string;
  sentTime?: string;
  status: 'sent' | 'failed';
  error?: string;
}
