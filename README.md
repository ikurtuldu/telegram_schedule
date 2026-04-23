# 📱 Telegram Zamanlanmış Mesaj Gönderici

İleri tarihli Telegram mesajlarınızı planlayın ve otomatik olarak gönderin!

---

## 🚨 HEMEN BAŞLA

### Backend server'ı başlatmayı unutmayın!

**Terminal 1:**
```bash
cd server
npm install
npm start
```

**Terminal 2:**
```bash
npm install
npm run dev
```

**Tarayıcıda:** `http://localhost:5173`

✅ Detaylı talimatlar için → [BASLAT.md](BASLAT.md)

---

> 🎯 **YENİ: BACKEND + VERİTABANI DESTEĞİ!**
> - ✅ **SQLite Veritabanı**: Mesajlar kalıcı olarak saklanır
> - ✅ **Node.js Backend**: Sayfa kapalı olsa bile çalışır
> - ✅ **Cron Job**: Her dakika otomatik kontrol ve gönderim
> - ✅ **REST API**: Tam entegre backend sistemi
> - ✅ **Tarayıcı Bağımsız**: Server çalıştığı sürece mesajlar gönderilir

## ✨ Özellikler

- ⏰ **Zamanlanmış Mesajlar**: İstediğiniz gün ve saatte mesaj gönderin
- 📊 **Log Kayıtları**: Tüm gönderim kayıtlarını takip edin
- 💾 **Yerel Veritabanı**: Verileriniz tarayıcınızda güvenle saklanır
- 🔄 **Otomatik Kontrol**: Mesajlar her 10 saniyede kontrol edilir
- 🎨 **Modern Arayüz**: Kullanıcı dostu ve responsive tasarım
- ✅ **Durum Takibi**: Bekleyen, gönderilen ve başarısız mesajları görün

## ⚡ HIZLI BAŞLANGIÇ

### 🎯 İki Kullanım Modu

#### ✅ Mod 1: SADECE FRONTEND (Test için)
Backend olmadan kullanabilirsiniz! LocalStorage + tarayıcı scheduler ile çalışır.

```bash
npm install
npm run dev
```

**NOT:** Bu modda sayfa açık kalmalı!

---

#### ✅ Mod 2: BACKEND + FRONTEND (Önerilen - Production)
Backend ile mesajlar sayfa kapalı olsa bile gönderilir.

**Seçenek A: Otomatik Başlatma**
```bash
chmod +x start.sh
./start.sh
```

**Seçenek B: Manuel Başlatma**

Terminal 1 - Backend:
```bash
cd server
npm install
npm start
```

Terminal 2 - Frontend:
```bash
npm install
npm run dev
```

---

### 3. Telegram Bot Kurulumu

1. Telegram'da [@BotFather](https://t.me/BotFather) → `/newbot` → Token'ı kopyalayın
2. [@userinfobot](https://t.me/userinfobot) → `/start` → Chat ID'nizi kopyalayın  
3. **ÖNEMLİ:** Oluşturduğunuz botunuza `/start` gönderin!
4. Uygulamada "Ayarlar" → Token ve ID'yi yapıştırın → "Test Et"

✅ **Test başarılı olursa kullanıma hazırsınız!**

## 🚀 Kurulum ve Kullanım

### 1. Telegram Bot Oluşturma

1. Telegram'da [@BotFather](https://t.me/BotFather) botunu açın
2. `/newbot` komutunu gönderin
3. Bot için bir isim ve kullanıcı adı seçin
4. Size verilen **Bot Token**'ı kopyalayın (örnek: `1234567890:ABCdefGHIjklMNOpqrsTUVwxyz`)

### 2. Chat ID Alma

#### Kişisel Mesaj İçin:
1. [@userinfobot](https://t.me/userinfobot) botuna `/start` gönderin
2. Size verilen **ID**'yi kopyalayın (örnek: `123456789`)

#### Grup İçin:
1. Botunuzu gruba ekleyin ve admin yapın
2. [@RawDataBot](https://t.me/RawDataBot) botunu gruba ekleyin
3. Bot size grup bilgilerini gönderecek, **chat id** değerini kopyalayın (örnek: `-1001234567890`)

### 3. Uygulamayı Yapılandırma

1. Uygulamayı açın
2. Sağ üstteki **"Ayarlar"** butonuna tıklayın
3. **Bot Token** ve **Chat ID** bilgilerinizi girin
4. **"Bağlantıyı Test Et"** ile kontrol edin
5. **"Kaydet"** butonuna tıklayın

### 4. Mesaj Gönderme

1. **"Yeni Zamanlanmış Mesaj"** formunu doldurun:
   - **Chat ID** (opsiyonel - boş bırakırsanız varsayılan kullanılır)
   - **Mesaj** (HTML formatı desteklenir)
   - **Tarih** ve **Saat** seçin
2. **"Mesajı Zamanla"** butonuna tıklayın
3. Mesajınız otomatik olarak belirtilen zamanda gönderilecek!

## 📝 HTML Formatı

Mesajlarınızda HTML kullanabilirsiniz:

- `<b>kalın</b>` → **kalın**
- `<i>italik</i>` → *italik*
- `<code>kod</code>` → `kod`
- `<a href="url">link</a>` → [link](url)

## ⚙️ Teknik Detaylar

### Teknolojiler
- **React 18** - UI framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Vite** - Build tool
- **LocalStorage** - Data persistence

### Veri Saklama
- Tüm veriler tarayıcınızın localStorage'ında saklanır
- Maksimum 100 log kaydı tutulur
- Veriler cihazınızdan asla dışarı çıkmaz

### Zamanlanmış Görevler
- Mesajlar her 10 saniyede bir kontrol edilir
- Zamanı gelen mesajlar otomatik gönderilir
- Gönderim sonuçları log kayıtlarına eklenir

## ⚠️ Önemli Notlar - ARTIK TARAYICI KAPALI OLSA BİLE ÇALIŞIR!

### ✅ BACKEND SAYESINDE YENİ ÖZELLİKLER:
- ✅ **Tarayıcıyı kapatabilirsiniz** - Backend server çalışmaya devam eder
- ✅ **Bilgisayarı kapatabilirsiniz** - Server VPS/Cloud'da çalışıyorsa
- ✅ **Hiçbir şey açık tutmanıza gerek yok** - Server otomatik çalışır
- ✅ **Mesajlar veritabanında güvenle saklanır**
- ✅ **Cron job her dakika kontrol eder ve gönderir**

### 📋 Gereksinimler:
1. **Backend Server Çalışmalı**: `cd server && npm start`
2. **Server 24/7 Erişilebilir Olmalı**: VPS/Cloud ya da sürekli açık bilgisayar
3. **İnternet Bağlantısı**: Server'ın internete erişimi olmalı

### 🚀 Production Deployment

#### Seçenek 1: VPS/Cloud Server (Önerilen)
```bash
# SSH ile sunucunuza bağlanın
ssh user@your-server.com

# Projeyi klonlayın
git clone https://github.com/your-repo/telegram-scheduler.git
cd telegram-scheduler/server

# Bağımlılıkları yükleyin
npm install

# PM2 ile çalıştırın (otomatik yeniden başlatma)
npm install -g pm2
pm2 start index.js --name telegram-scheduler
pm2 save
pm2 startup
```

#### Seçenek 2: Docker
```bash
cd server
docker build -t telegram-scheduler .
docker run -d -p 3001:3001 --name scheduler telegram-scheduler
```

#### Seçenek 3: Yerel Bilgisayar (Test için)
- Bilgisayarınızı açık tutun
- Server sürekli çalışsın
- `npm start` ile başlatın

### 🎯 Artık Endişelenmeyin!
- Mesajlarınızı ekleyin
- Server otomatik gönderir
- Tarayıcıyı kapatabilirsiniz
- Frontend sadece yönetim için gerekli

## 🔒 Güvenlik

- Bot token'ınız sadece tarayıcınızda saklanır
- Veriler asla üçüncü şahıslarla paylaşılmaz
- Tüm işlemler doğrudan Telegram API ile yapılır

## 🐛 Sorun Giderme

### Test Mesajı Başarısız Oluyor?

**1. "Unauthorized" / Yetkisiz Hatası**
```
✓ Bot Token'ınızı doğru kopyaladığınızdan emin olun
✓ Token başında veya sonunda boşluk olmamalı
✓ @BotFather'dan yeni token aldıysanız eski geçersiz olur
```

**2. "Chat not found" / Chat Bulunamadı**
```
✓ Önce Telegram'da botunuza /start gönderin
✓ Bot size en az bir kere mesaj göndermiş olmalı
✓ Kişisel mesaj için botu mutlaka başlatın
```

**3. "Bad Request" / Geçersiz İstek**
```
✓ Chat ID formatını kontrol edin
✓ Kişisel: Pozitif sayı (örn: 123456789)
✓ Grup: Negatif sayı (örn: -1001234567890)
✓ Süper grup: -100 ile başlamalı
```

**4. "Bot was blocked" / Bot Engellendi**
```
✓ Telegram'da botu engel listesinden çıkarın
✓ Botu yeniden başlatın (/start)
```

**5. İnternet/Bağlantı Hatası**
```
✓ İnternet bağlantınızı kontrol edin
✓ Firewall/Proxy ayarlarını kontrol edin
✓ VPN kullanıyorsanız kapatmayı deneyin
✓ api.telegram.org adresine erişebildiğinizi kontrol edin
```

### Mesaj Gönderilmiyor
- Bot token ve chat ID'yi kontrol edin
- Bot'un mesaj gönderme iznini kontrol edin
- İnternet bağlantınızı kontrol edin
- Konsol (F12) hatalarını inceleyin

### Grup İçin Özel İpuçları
- Botu gruba admin olarak ekleyin
- "Mesaj Gönderme" iznini verin
- Chat ID'nin negatif sayı olduğundan emin olun
- @RawDataBot ile doğru grup ID'sini alın

## 📞 Destek

Sorunlarınız için Telegram API dokümantasyonunu inceleyin:
- [Telegram Bot API](https://core.telegram.org/bots/api)
- [BotFather Dokümantasyonu](https://core.telegram.org/bots#botfather)

## 📄 Lisans

Bu proje açık kaynak kodludur ve özgürce kullanılabilir.
