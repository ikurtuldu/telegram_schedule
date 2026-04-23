import { useState, useEffect } from 'react';
import Settings from './components/Settings';
import MessageForm from './components/MessageForm';
import MessageList from './components/MessageList';
import MessageLogs from './components/MessageLogs';
import HelpModal from './components/HelpModal';
import { getMessages, getLogs, clearAll as clearAllData, isAPIAvailable, getConfig } from './services/hybridStorage';
import { ScheduledMessage, MessageLog, TelegramConfig } from './types';
import { SchedulerService } from './services/schedulerService';

export default function App() {
  const [messages, setMessages] = useState<ScheduledMessage[]>([]);
  const [logs, setLogs] = useState<MessageLog[]>([]);
  const [activeTab, setActiveTab] = useState<'messages' | 'logs'>('messages');
  const [loading, setLoading] = useState(true);
  const [apiStatus, setApiStatus] = useState<boolean | null>(null);
  const [localScheduler, setLocalScheduler] = useState<SchedulerService | null>(null);

  // Verileri yükle
  const loadData = async () => {
    try {
      const [messagesData, logsData] = await Promise.all([
        getMessages(),
        getLogs()
      ]);
      setMessages(messagesData);
      setLogs(logsData);
    } catch (error) {
      console.error('Veri yükleme hatası:', error);
    } finally {
      setLoading(false);
    }
  };

  // Sayfa yüklendiğinde
  useEffect(() => {
    const init = async () => {
      const apiAvailable = await isAPIAvailable();
      setApiStatus(apiAvailable);
      
      // Eğer API yoksa, local scheduler başlat
      if (!apiAvailable) {
        const config = await getConfig();
        if (config && config.botToken) {
          const scheduler = new SchedulerService(config.botToken);
          scheduler.start(() => loadData());
          setLocalScheduler(scheduler);
        }
      }
      
      await loadData();
    };
    init();

    // Her 30 saniyede bir verileri yenile
    const interval = setInterval(loadData, 30000);

    return () => {
      clearInterval(interval);
      if (localScheduler) {
        localScheduler.stop();
      }
    };
  }, []);

  const handleConfigUpdate = (config: TelegramConfig) => {
    console.log('Config güncellendi:', config);
  };

  const handleClearAll = async () => {
    if (window.confirm('TÜM mesajları ve logları silmek istediğinizden emin misiniz? Bu işlem geri alınamaz!')) {
      try {
        await clearAllData();
        await loadData();
        alert('Tüm veriler temizlendi! ✅');
      } catch (error: any) {
        alert('Temizleme hatası: ' + error.message);
      }
    }
  };

  const pendingCount = messages.filter(m => m.status === 'pending').length;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">⏳</div>
          <p className="text-xl text-gray-600">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Backend Durum Bildirimi */}
      {apiStatus === true && (
        <div className="bg-green-50 border-b border-green-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
            <div className="flex items-center justify-center gap-2 text-sm">
              <span className="text-green-600">🟢</span>
              <span className="text-green-800 font-medium">
                Backend server çalışıyor - Mesajlar sayfa kapalı olsa bile otomatik gönderilecek!
              </span>
            </div>
          </div>
        </div>
      )}

      {apiStatus === false && (
        <div className="bg-yellow-50 border-b border-yellow-300">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <div className="flex flex-col items-center gap-2">
              <div className="flex items-center gap-2 text-sm">
                <span className="text-yellow-600 text-2xl">⚠️</span>
                <span className="text-yellow-900 font-bold">
                  Backend server'a bağlanılamıyor!
                </span>
              </div>
              <div className="text-center">
                <p className="text-yellow-800 text-sm mb-2">
                  LocalStorage kullanılıyor - Sayfa açık kalmalı! Backend başlatmak için:
                </p>
                <code className="bg-yellow-100 px-4 py-2 rounded text-yellow-900 text-xs inline-block">
                  cd server && npm install && npm start
                </code>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="bg-white shadow-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="text-4xl">📱</div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Telegram Zamanlanmış Mesaj Gönderici
                </h1>
                <p className="text-sm text-gray-600">
                  Veritabanı destekli - Mesajlar otomatik gönderilir
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Durum Göstergesi */}
              <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                apiStatus === true 
                  ? 'bg-green-100' 
                  : apiStatus === false 
                  ? 'bg-yellow-100' 
                  : 'bg-gray-100'
              }`}>
                <div className={`w-3 h-3 rounded-full ${
                  apiStatus === true 
                    ? 'bg-green-500 animate-pulse' 
                    : apiStatus === false 
                    ? 'bg-yellow-500' 
                    : 'bg-gray-400'
                }`} />
                <span className={`text-sm font-medium ${
                  apiStatus === true 
                    ? 'text-green-700' 
                    : apiStatus === false 
                    ? 'text-yellow-700' 
                    : 'text-gray-600'
                }`}>
                  {apiStatus === true 
                    ? 'Server Aktif' 
                    : apiStatus === false 
                    ? 'LocalStorage' 
                    : 'Kontrol ediliyor...'}
                </span>
              </div>

              <HelpModal />
              <Settings onConfigUpdate={handleConfigUpdate} />

              {apiStatus === false && (
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    alert(`Backend Başlatma Talimatları:\n\n1. Terminal aç\n2. cd server\n3. npm install\n4. npm start\n\nSonra sayfayı yenile (F5)`);
                  }}
                  className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium flex items-center gap-2"
                  title="Backend Nasıl Başlatılır?"
                >
                  ⚡ Backend Başlat
                </a>
              )}

              <button
                onClick={handleClearAll}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                title="Tümünü Temizle"
              >
                🗑️ Tümünü Sil
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mt-4 border-t border-gray-200 pt-4">
            <button
              onClick={() => setActiveTab('messages')}
              className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                activeTab === 'messages'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              📋 Mesajlar
              {pendingCount > 0 && (
                <span className="ml-2 bg-white text-blue-600 px-2 py-0.5 rounded-full text-xs font-bold">
                  {pendingCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('logs')}
              className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                activeTab === 'logs'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              📊 Loglar
              {logs.length > 0 && (
                <span className="ml-2 bg-white text-blue-600 px-2 py-0.5 rounded-full text-xs font-bold">
                  {logs.length}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Bekleyen Mesaj Uyarısı */}
      {pendingCount > 0 && (
        <div className="bg-blue-50 border-t border-b border-blue-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <div className="flex items-center justify-center gap-3">
              <span className="text-2xl">⏰</span>
              <div className="text-center">
                <p className="text-blue-900 font-semibold">
                  {pendingCount} bekleyen mesaj var
                </p>
                <p className="text-blue-700 text-sm">
                  Server her dakika kontrol ediyor ve zamanı gelenleri otomatik gönderiyor
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'messages' ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Form */}
            <div>
              <MessageForm onMessageAdded={loadData} />
            </div>

            {/* Mesaj Listesi */}
            <div>
              <MessageList messages={messages} onUpdate={loadData} />
            </div>
          </div>
        ) : (
          <div>
            <MessageLogs logs={logs} onUpdate={loadData} />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="space-y-4">
            {/* Ana Bilgi */}
            <div className="text-center">
              <div className="inline-flex items-center gap-2 bg-green-50 px-6 py-3 rounded-full border border-green-200 mb-3">
                <span className="text-2xl">✅</span>
                <span className="text-green-900 font-semibold">
                  Backend Server Aktif - Sayfa kapalı olsa bile mesajlar gönderilir!
                </span>
              </div>
            </div>

            {/* Özellikler */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                <div className="font-semibold text-blue-900 mb-1">💾 Veritabanı</div>
                <ul className="text-blue-700 space-y-1">
                  <li>• Mesajlar SQLite'da saklanır</li>
                  <li>• Güvenli ve kalıcı depolama</li>
                  <li>• Sunucu yeniden başlasa bile veriler kaybolmaz</li>
                </ul>
              </div>

              <div className="bg-green-50 rounded-lg p-3 border border-green-200">
                <div className="font-semibold text-green-900 mb-1">⏰ Otomatik Gönderim</div>
                <ul className="text-green-700 space-y-1">
                  <li>• Cron job ile her dakika kontrol</li>
                  <li>• Zamanı gelen mesajlar otomatik gönderilir</li>
                  <li>• Tarayıcı kapalı olsa bile çalışır</li>
                </ul>
              </div>

              <div className="bg-purple-50 rounded-lg p-3 border border-purple-200">
                <div className="font-semibold text-purple-900 mb-1">📊 Loglar</div>
                <ul className="text-purple-700 space-y-1">
                  <li>• Tüm gönderim kayıtları tutulur</li>
                  <li>• Başarı/hata durumları kaydedilir</li>
                  <li>• Son 100 log saklanır</li>
                </ul>
              </div>
            </div>

            {/* Server Bilgisi */}
            <div className="text-center text-xs text-gray-500 pt-2 border-t border-gray-200">
              🔒 Verileriniz server/database.sqlite dosyasında saklanır • Backend: Node.js + Express + SQLite
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
