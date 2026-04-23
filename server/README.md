# Telegram Scheduler - Backend Server

Backend server for Telegram message scheduler with database support.

## Features

- ✅ **SQLite Database**: Persistent storage for messages and logs
- ✅ **Cron Jobs**: Automatic message sending every minute
- ✅ **REST API**: Full API for frontend integration
- ✅ **No Browser Required**: Works independently

## Installation

```bash
cd server
npm install
```

## Running the Server

```bash
npm start
```

Server will start on `http://localhost:3001`

## API Endpoints

### Config
- `POST /api/config` - Save Telegram configuration
- `GET /api/config` - Get current configuration
- `POST /api/config/test` - Test Telegram connection

### Messages
- `GET /api/messages` - Get all scheduled messages
- `POST /api/messages` - Add new scheduled message
- `DELETE /api/messages/:id` - Delete a message

### Logs
- `GET /api/logs` - Get all logs (last 100)
- `DELETE /api/logs` - Clear all logs

### Utility
- `DELETE /api/clear-all` - Clear all messages and logs
- `GET /api/health` - Health check

## Database

SQLite database file: `server/database.sqlite`

### Tables

1. **telegram_config** - Bot token and default chat ID
2. **scheduled_messages** - Pending and sent messages
3. **message_logs** - Send history and errors

## Cron Schedule

- Checks every minute: `* * * * *`
- Sends messages whose `scheduled_time <= now()`
- Updates message status automatically
- Logs all send attempts

## Environment Variables

Create `.env` file:

```
PORT=3001
DATABASE_PATH=./database.sqlite
```

## Production Deployment

### Option 1: VPS/Server
```bash
# Install dependencies
cd server
npm install

# Use PM2 for process management
npm install -g pm2
pm2 start index.js --name telegram-scheduler
pm2 save
pm2 startup
```

### Option 2: Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3001
CMD ["node", "index.js"]
```

## Notes

- Server must be running 24/7 for automatic message sending
- Database file persists data even after restarts
- No external services required
- Lightweight and fast
