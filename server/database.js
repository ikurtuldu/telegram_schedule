import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const db = new Database(join(__dirname, 'database.sqlite'));

// Tabloları oluştur
db.exec(`
  CREATE TABLE IF NOT EXISTS telegram_config (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    bot_token TEXT NOT NULL,
    default_chat_id TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS scheduled_messages (
    id TEXT PRIMARY KEY,
    chat_id TEXT NOT NULL,
    message TEXT NOT NULL,
    scheduled_time DATETIME NOT NULL,
    status TEXT DEFAULT 'pending',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS message_logs (
    id TEXT PRIMARY KEY,
    message_id TEXT NOT NULL,
    chat_id TEXT NOT NULL,
    message TEXT NOT NULL,
    scheduled_time DATETIME NOT NULL,
    sent_time DATETIME,
    status TEXT NOT NULL,
    error TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE INDEX IF NOT EXISTS idx_scheduled_messages_status 
    ON scheduled_messages(status);
  
  CREATE INDEX IF NOT EXISTS idx_scheduled_messages_time 
    ON scheduled_messages(scheduled_time);
`);

export default db;
