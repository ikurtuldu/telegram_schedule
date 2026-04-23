# 📖 Kullanım Kılavuzu

## 🚀 İlk Başlatma

### Backend OLMADAN (Hızlı Test)

```bash
npm install
npm run dev
```

✅ Tarayıcıda `http://localhost:5173` açılacak
⚠️ Bu modda sayfa açık kalmalı!

### Backend İLE (Önerilen)

```bash
# Otomatik
chmod +x start.sh
./start.sh

# VEYA Manuel
# Terminal 1
cd server && npm install && npm start

# Terminal 2  
npm install && npm run dev
```

✅ Backend: `http://localhost:3001`
✅ Frontend: `http://localhost:5173`
✅ Sayfa kapalı olsa bile mesajlar gönderilir!

---

## ⚙️ İlk Kurulum

### 1. Telegram Bot Oluştur

1. Telegram'da [@BotFather](https://t.me/BotFather) ara
2. `/newbot` komutunu gönder
3. Bot ismi ve kullanıcı adı belirle
4. **Bot Token**'ı kopyala
   ```
   Örnek: 5234567890:AAHdqTcvCH1vGWJxfSeofSAs0K5PALDsaw
   ```

### 2. Chat ID'ni Öğren

**Kişisel mesaj için:**
1. [@userinfobot](https://t.me/userinfobot) ara
2. `/start` gönder
3. **Chat ID**'ni kopyala
   ```
   Örnek: 987654321
   ```

**Grup için:**
1. Botunu gruba ekle ve admin yap
2. [@RawDataBot](https://t.me/RawDataBot) gruba ekle
3. **Grup ID**'sini kopyala
   ```
   Örnek: -1001234567890
   ```

### 3. Uygulamada Ayarla

1. **"Ayarlar"** butonuna tıkla
2. **Bot Token** ve **Chat ID** yapıştır
3. **"Bağlantıyı Test Et"** - Test mesajı gönderir
4. **"Kaydet"** butonuna tıkla

✅ Ayarlar kaydedildi!

---

## 📝 Mesaj Zamanla

### Adımlar:

1. **Chat ID** (opsiyonel - boş bırakırsan varsayılan kullanılır)
2. **Mesaj** yaz
   - Düz metin
   - HTML formatı: `<b>kalın</b>`, `<i>italik</i>`, `<code>kod</code>`
3. **Tarih** ve **Saat** seç (gelecek bir zaman)
4. **"Mesajı Zamanla"** butonuna tıkla

✅ Mesaj veritabanına eklendi!

### Örnek Mesajlar:

**Düz metin:**
```
Merhaba! Bu zamanlanmış bir mesajdır.
```

**HTML formatı:**
```html
<b>Önemli Hatırlatma!</b>

Bugün saat <i>15:00</i>'te toplantı var.

Katılım linki: <code>https://zoom.us/j/123456</code>
```

---

## 📊 Mesaj Durumları

### 🔸 Bekleyen (Pending)
- Henüz zamanı gelmedi
- Backend/scheduler kontrol ediyor
- Silebilir veya düzenleyebilirsin

### ✅ Gönderildi (Sent)
- Başarıyla Telegram'a gönderildi
- Log kayıtlarında görülebilir
- Silinebilir (ama Telegram'dan silinmez)

### ❌ Başarısız (Failed)
- Gönderim hatası oluştu
- Log kayıtlarında hata mesajı var
- Yeniden zamanlanabilir

---

## 🔍 Durum Kontrolü

### Header'daki Göstergeler:

**🟢 Server Aktif**
- Backend çalışıyor
- Mesajlar otomatik gönderilecek
- Sayfa kapatılabilir

**🟡 LocalStorage**
- Backend çalışmıyor
- LocalStorage kullanılıyor
- Sayfa açık kalmalı

**⚪ Kontrol ediliyor...**
- İlk yükleme
- Bağlantı kontrol ediliyor

---

## ⏰ Zamanlama Nasıl Çalışır?

### Backend Varsa (Önerilen):
- ✅ Cron job her dakika kontrol eder
- ✅ Zamanı gelen mesajları gönderir
- ✅ Sayfa kapalı olsa bile çalışır
- ✅ Server 24/7 çalışmalı

### Backend Yoksa (LocalStorage):
- ⚠️ Tarayıcı her 10 saniyede kontrol eder
- ⚠️ Sayfa açık kalmalı
- ⚠️ Sekme minimize edilebilir
- ⚠️ Tarayıcı kapatılırsa mesajlar gönderilemez

---

## 🗑️ Veri Yönetimi

### Mesaj Sil
- Bekleyen mesajın yanındaki çöp kutusu ikonuna tıkla
- Onay ver

### Logları Temizle
- "Loglar" sekmesine git
- "Logları Temizle" butonuna tıkla

### Tümünü Sil
- Header'daki "🗑️ Tümünü Sil" butonuna tıkla
- **UYARI:** Tüm mesajlar ve loglar silinir!

---

## ❓ Sık Sorulan Sorular

### Backend'i nasıl başlatırım?
```bash
cd server
npm install
npm start
```

### Backend çalışıyor mu nasıl anlarım?
- Header'da "🟢 Server Aktif" yazıyor
- `http://localhost:3001/api/health` adresine git
- `{"status":"OK"}` görmelisin

### Mesaj gönderilmiyor, ne yapmalıyım?

1. **Bot token doğru mu?** → Ayarlar'dan kontrol et
2. **Chat ID doğru mu?** → Sayısal olmalı
3. **Bota /start gönderdin mi?** → Telegram'da bota git, /start yaz
4. **Backend çalışıyor mu?** → Terminal loglarını kontrol et
5. **Logları incele** → Hata mesajını oku

### Mesajlar gecikmeli gönderiliyor?

- **Backend varsa:** Her dakika kontrol edilir (normal)
- **LocalStorage:** Her 10 saniye kontrol edilir
- 1-2 dakika gecikme normal

### Veritabanı nerede?

- **Backend:** `server/database.sqlite`
- **LocalStorage:** Tarayıcının localStorage'ı

### Yedekleme nasıl yapılır?

**Backend:**
```bash
cp server/database.sqlite server/backup.sqlite
```

**LocalStorage:**
- Tarayıcı Developer Tools → Application → Local Storage
- Export yapabilirsin

---

## 🎯 İpuçları

1. ✅ **Backend kullan** - Daha güvenilir
2. ✅ **Test mesajı gönder** - Ayarları kontrol et
3. ✅ **Logları incele** - Sorun varsa görebilirsin
4. ✅ **HTML kullan** - Mesajları güzelleştir
5. ✅ **Düzenli yedekle** - Database'i kaybet
6. ⚠️ **Grup için bot admin olmalı** - Mesaj gönderme izni ver
7. ⚠️ **Server 24/7 çalışmalı** - VPS kullan

---

## 🆘 Yardım

- README.md → Genel bilgiler
- SETUP.md → Detaylı kurulum
- server/README.md → Backend detayları
- Uygulamada "Yardım" butonu → Canlı yardım

Sorun mu var? Console'u aç (F12) ve hataları kontrol et!
