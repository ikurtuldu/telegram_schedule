# ⚡ HIZLI BAŞLATMA

## 🎯 Backend'i Başlat (2 Dakika)

### Adım 1: Server klasörüne git ve başlat

**Terminal 1'de:**
```bash
cd server
npm install
npm start
```

✅ Şu çıktıyı görmelisiniz:
```
🚀 Server çalışıyor: http://localhost:3001
📡 API endpoint: http://localhost:3001/api
✅ Scheduler başlatıldı - Her dakika kontrol edilecek
```

### Adım 2: Frontend'i başlat

**Terminal 2'de (yeni terminal):**
```bash
npm install
npm run dev
```

✅ Şu çıktıyı görmelisiniz:
```
VITE v7.x.x  ready in xxx ms

➜  Local:   http://localhost:5173/
```

### Adım 3: Tarayıcıda aç

`http://localhost:5173` adresine git

✅ Üstte "🟢 Server Aktif" göreceksiniz!

---

## ❌ Sorun mu var?

### "Backend server'a bağlanılamıyor" hatası

**Çözüm 1: Server çalışıyor mu kontrol edin**
```bash
curl http://localhost:3001/api/health
```

Beklenen yanıt: `{"status":"OK","message":"Server çalışıyor"}`

**Çözüm 2: Port kullanımda mı?**
```bash
# Port 3001'i kullanan uygulamayı bul
lsof -i :3001

# Kapatmak için (Mac/Linux)
kill -9 <PID>
```

**Çözüm 3: Node.js yüklü mü?**
```bash
node --version
# v18.x.x veya üzeri olmalı
```

**Çözüm 4: Server klasöründe package.json var mı?**
```bash
ls server/package.json
```

---

## 🔧 Alternatif: Sadece LocalStorage Kullan

Backend istemiyorsanız:

```bash
npm install
npm run dev
```

⚠️ **DİKKAT:** Bu modda sayfa açık kalmalı!

---

## 📞 Hâlâ Sorun mu var?

1. **Terminal'deki hata mesajını kopyala**
2. **Tarayıcı Console'u aç (F12)**
3. **Kırmızı hataları kontrol et**
4. **Ekran görüntüsü al ve paylaş**
