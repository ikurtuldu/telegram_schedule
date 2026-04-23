# 🚀 NASIL BAŞLATILIR?

## ✅ YÖNTEMİ 1: Otomatik (Önerilen)

### Mac/Linux:
```bash
chmod +x start.sh
./start.sh
```

### Windows (Git Bash):
```bash
bash start.sh
```

---

## ✅ YÖNTEM 2: Manuel (İki Terminal)

### Terminal 1 - Backend:
```bash
cd server
npm install
npm start
```

**Beklenen çıktı:**
```
🚀 Server çalışıyor: http://localhost:3001
📡 API endpoint: http://localhost:3001/api
✅ Scheduler başlatıldı - Her dakika kontrol edilecek
```

### Terminal 2 - Frontend:
```bash
npm install
npm run dev
```

**Beklenen çıktı:**
```
VITE v7.x.x  ready in xxx ms
➜  Local:   http://localhost:5173/
```

---

## ✅ YÖNTEM 3: Sadece Frontend (Backend'siz)

```bash
npm install
npm run dev
```

⚠️ **Not:** Bu modda sayfa açık kalmalı!

---

## 🎯 Tarayıcıda Aç

`http://localhost:5173` adresine git

### Backend çalışıyorsa:
- ✅ Üstte "🟢 Server Aktif" göreceksiniz
- ✅ Mesajlar sayfa kapalı olsa bile gönderilir

### Backend çalışmıyorsa:
- ⚠️ Üstte "🟡 LocalStorage" göreceksiniz
- ⚠️ Sayfa açık kalmalı

---

## ❌ Hata Alıyorsanız

### "Backend server'a bağlanılamıyor"

**1. Backend çalışıyor mu kontrol edin:**
```bash
curl http://localhost:3001/api/health
```

**2. Port kullanımda mı kontrol edin:**
```bash
# Mac/Linux
lsof -i :3001

# Windows
netstat -ano | findstr :3001
```

**3. Node.js yüklü mü?**
```bash
node --version
npm --version
```

Node.js 16+ gerekli. Yoksa [nodejs.org](https://nodejs.org) adresinden indirin.

### "Port already in use" (Port kullanımda)

**Port 3001 kullanımda. Değiştirin:**

`server/index.js` dosyasında:
```javascript
const PORT = process.env.PORT || 3002; // 3001 yerine 3002
```

VEYA çalışan uygulamayı kapatın:
```bash
# Mac/Linux
lsof -ti:3001 | xargs kill -9

# Windows
# Task Manager'dan kapatın
```

### "npm: command not found"

Node.js kurulu değil. [nodejs.org](https://nodejs.org) adresinden indirin.

---

## 📱 Telegram Bot Kurulumu

1. [@BotFather](https://t.me/BotFather) → `/newbot`
2. Bot token'ı kopyala
3. [@userinfobot](https://t.me/userinfobot) → Chat ID al
4. Botuna `/start` gönder (önemli!)
5. Uygulamada Ayarlar → Token ve ID gir
6. "Bağlantıyı Test Et" → Başarılı!

---

## 🎉 Başarılı!

Artık kullanıma hazırsınız. İyi kullanımlar! 🚀
