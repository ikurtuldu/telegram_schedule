# 🚀 Kurulum Rehberi

## Hızlı Başlangıç (Lokal Test)

### 1. Depoyu Klonlayın veya İndirin

```bash
git clone <repo-url>
cd telegram-scheduler
```

### 2. Backend Server'ı Kurun ve Başlatın

```bash
# Server klasörüne gidin
cd server

# Bağımlılıkları yükleyin
npm install

# Server'ı başlatın
npm start
```

✅ Çıktı göreceksiniz:
```
🚀 Server çalışıyor: http://localhost:3001
📡 API endpoint: http://localhost:3001/api
✅ Scheduler başlatıldı - Her dakika kontrol edilecek
```

### 3. Frontend'i Kurun ve Başlatın (Başka bir terminal)

```bash
# Ana klasöre dönün
cd ..

# Bağımlılıkları yükleyin (eğer yoksa)
npm install

# Development server'ı başlatın
npm run dev
```

### 4. Tarayıcıda Açın

`http://localhost:5173` adresine gidin.

### 5. Telegram Bot Ayarları

1. **"Ayarlar"** butonuna tıklayın
2. **Bot Token** ve **Chat ID** girin
3. **"Bağlantıyı Test Et"** ile kontrol edin
4. **"Kaydet"** butonuna tıklayın

---

## 🌐 Production Deployment (VPS/Cloud)

### Seçenek 1: DigitalOcean / Linode / AWS EC2

#### 1. Sunucu Hazırlığı

```bash
# SSH ile bağlanın
ssh root@your-server-ip

# Node.js yükleyin (Ubuntu/Debian)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# PM2 yükleyin
npm install -g pm2
```

#### 2. Projeyi Deploy Edin

```bash
# Projeyi klonlayın
git clone <repo-url>
cd telegram-scheduler

# Backend'i başlatın
cd server
npm install
pm2 start index.js --name telegram-scheduler
pm2 save
pm2 startup

# Frontend'i build edin
cd ..
npm install
npm run build
```

#### 3. Nginx ile Frontend Serve Edin

```bash
# Nginx yükleyin
sudo apt install nginx

# Config dosyası oluşturun
sudo nano /etc/nginx/sites-available/telegram-scheduler
```

Config içeriği:
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        root /path/to/telegram-scheduler/dist;
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# Siteyi aktif edin
sudo ln -s /etc/nginx/sites-available/telegram-scheduler /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

#### 4. SSL Sertifikası (Opsiyonel ama önerilen)

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

---

### Seçenek 2: Docker Deployment

#### 1. Backend Dockerfile

`server/Dockerfile`:
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
EXPOSE 3001
CMD ["node", "index.js"]
```

#### 2. Docker Compose

`docker-compose.yml`:
```yaml
version: '3.8'
services:
  backend:
    build: ./server
    ports:
      - "3001:3001"
    volumes:
      - ./server/database.sqlite:/app/database.sqlite
    restart: always
    environment:
      - PORT=3001
      - DATABASE_PATH=/app/database.sqlite
```

#### 3. Çalıştırın

```bash
docker-compose up -d
```

---

### Seçenek 3: Vercel/Netlify (Sadece Frontend)

**NOT:** Backend için ayrı bir sunucu gereklidir!

```bash
# Frontend'i build edin
npm run build

# Vercel'e deploy edin
npm install -g vercel
vercel --prod
```

Environment variables ekleyin:
- `VITE_API_URL`: Backend API URL'niz

---

## 📊 Server Yönetimi

### PM2 Komutları

```bash
# Status kontrol
pm2 status

# Logları görüntüle
pm2 logs telegram-scheduler

# Restart
pm2 restart telegram-scheduler

# Stop
pm2 stop telegram-scheduler

# Delete
pm2 delete telegram-scheduler
```

### Database Yedekleme

```bash
# Database'i yedekle
cp server/database.sqlite server/database.backup.sqlite

# Geri yükle
cp server/database.backup.sqlite server/database.sqlite
```

---

## 🔧 Sorun Giderme

### Backend'e Bağlanamıyor

1. Server çalışıyor mu kontrol edin:
```bash
curl http://localhost:3001/api/health
```

2. Port açık mı kontrol edin:
```bash
netstat -tuln | grep 3001
```

3. Firewall kurallarını kontrol edin:
```bash
sudo ufw status
sudo ufw allow 3001
```

### Mesajlar Gönderilmiyor

1. Server loglarını kontrol edin:
```bash
pm2 logs telegram-scheduler
```

2. Database'i kontrol edin:
```bash
sqlite3 server/database.sqlite
SELECT * FROM scheduled_messages WHERE status='pending';
.quit
```

3. Telegram config'i kontrol edin:
```bash
curl http://localhost:3001/api/config
```

---

## 📝 Güncelleme

```bash
# Kodu çekin
git pull

# Backend'i güncelle
cd server
npm install
pm2 restart telegram-scheduler

# Frontend'i güncelle
cd ..
npm install
npm run build
```

---

## 🎯 Başarı Kontrolü

✅ Backend server `http://localhost:3001` çalışıyor
✅ Frontend `http://localhost:5173` veya domain'de çalışıyor  
✅ Telegram config kaydedildi
✅ Test mesajı başarıyla gönderildi
✅ Zamanlanmış mesaj eklendi
✅ Scheduler her dakika çalışıyor

Tebrikler! Sisteminiz çalışıyor! 🎉
