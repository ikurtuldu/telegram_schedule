import { useState, useEffect } from 'react';
import { getConfig, saveConfig, testConfig } from '../services/hybridStorage';
import { TelegramConfig } from '../types';

interface SettingsProps {
  onConfigUpdate: (config: TelegramConfig) => void;
}

export default function Settings({ onConfigUpdate }: SettingsProps) {
  const [config, setConfig] = useState<TelegramConfig>({
    botToken: '',
    defaultChatId: '',
  });
  const [isOpen, setIsOpen] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [testing, setTesting] = useState(false);

  useEffect(() => {
    const loadConfig = async () => {
      try {
        const savedConfig = await getConfig();
        if (savedConfig) {
          setConfig(savedConfig);
          setIsSaved(true);
        } else {
          setIsOpen(true); // İlk kullanımda ayarları aç
        }
      } catch (error) {
        console.error('Config yükleme hatası:', error);
        setIsOpen(true);
      }
    };
    loadConfig();
  }, []);

  const handleSave = async () => {
    if (!config.botToken || !config.defaultChatId) {
      alert('Lütfen tüm alanları doldurun');
      return;
    }

    try {
      await saveConfig(config.botToken, config.defaultChatId);
      onConfigUpdate(config);
      setIsSaved(true);
      setIsOpen(false);
      alert('Ayarlar kaydedildi! ✅');
    } catch (error: any) {
      alert('Ayarlar kaydedilemedi: ' + error.message);
    }
  };

  const handleTest = async () => {
    if (!config.botToken || !config.defaultChatId) {
      alert('Lütfen önce bot token ve chat ID girin');
      return;
    }

    setTesting(true);
    try {
      const result = await testConfig(config.botToken, config.defaultChatId);
      if (result.success) {
        alert('Bağlantı başarılı! Test mesajı gönderildi. ✅');
      } else {
        alert('Bağlantı başarısız. Lütfen bilgilerinizi kontrol edin. ❌');
      }
    } catch (error: any) {
      console.error('Test hatası:', error);
      
      let errorMsg = 'Bağlantı hatası! ❌\n\n';
      
      if (error.message) {
        errorMsg += 'Hata Mesajı: ' + error.message + '\n\n';
      }
      
      errorMsg += 'Kontrol Listesi:\n';
      errorMsg += '✓ Bot Token doğru mu?\n';
      errorMsg += '✓ Chat ID doğru formatta mı? (sayısal)\n';
      errorMsg += '✓ Bot ile daha önce bir mesaj gönderdiniz mi?\n';
      errorMsg += '✓ Grup için botu admin yaptınız mı?\n';
      errorMsg += '✓ İnternet bağlantınız aktif mi?';
      
      alert(errorMsg);
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
          isSaved
            ? 'bg-green-100 text-green-700 hover:bg-green-200'
            : 'bg-red-100 text-red-700 hover:bg-red-200'
        }`}
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        Ayarlar
        {!isSaved && <span className="text-xs">(Gerekli)</span>}
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Telegram Bot Ayarları</h2>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bot Token
                  </label>
                  <input
                    type="text"
                    value={config.botToken}
                    onChange={(e) => setConfig({ ...config, botToken: e.target.value.trim() })}
                    placeholder="1234567890:ABCdefGHIjklMNOpqrsTUVwxyz"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                  />
                  <p className="mt-2 text-sm text-gray-600">
                    @BotFather'dan alacağınız bot token'ını girin.
                    {config.botToken && !config.botToken.includes(':') && (
                      <span className="text-red-600 block mt-1">⚠️ Token ':' karakteri içermeli!</span>
                    )}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Varsayılan Chat ID
                  </label>
                  <input
                    type="text"
                    value={config.defaultChatId}
                    onChange={(e) => setConfig({ ...config, defaultChatId: e.target.value.trim() })}
                    placeholder="-1001234567890 veya 123456789"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                  />
                  <p className="mt-2 text-sm text-gray-600">
                    Mesaj göndermek istediğiniz grup veya kullanıcı ID'si.
                    {config.defaultChatId && isNaN(Number(config.defaultChatId)) && (
                      <span className="text-red-600 block mt-1">⚠️ Chat ID sayısal olmalı!</span>
                    )}
                    {config.defaultChatId && !isNaN(Number(config.defaultChatId)) && Number(config.defaultChatId) > 0 && (
                      <span className="text-green-600 block mt-1">✓ Kişisel chat (pozitif ID)</span>
                    )}
                    {config.defaultChatId && !isNaN(Number(config.defaultChatId)) && Number(config.defaultChatId) < 0 && (
                      <span className="text-blue-600 block mt-1">✓ Grup chat (negatif ID)</span>
                    )}
                  </p>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="font-semibold text-blue-900 mb-2">📝 Nasıl Kullanılır?</h3>
                  <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
                    <li>Telegram'da @BotFather'a mesaj gönderin</li>
                    <li>/newbot komutuyla yeni bot oluşturun</li>
                    <li>Size verilen token'ı yukarıya yapıştırın</li>
                    <li>Chat ID için @userinfobot kullanın veya grubunuzun ID'sini alın</li>
                    <li>Botunuza Telegram'da /start gönderin (önemli!)</li>
                    <li>"Bağlantıyı Test Et" butonuyla kontrol edin</li>
                  </ol>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <h3 className="font-semibold text-yellow-900 mb-2">⚠️ Sık Yapılan Hatalar</h3>
                  <ul className="text-sm text-yellow-800 space-y-1">
                    <li>• <strong>Bota /start göndermeden</strong> test etmek</li>
                    <li>• <strong>Token'da boşluk</strong> bırakmak</li>
                    <li>• <strong>Grup ID'si pozitif</strong> girmek (negatif olmalı)</li>
                    <li>• <strong>Grupta botu admin yapmamak</strong></li>
                  </ul>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h3 className="font-semibold text-green-900 mb-2">💡 Chat ID Bulma</h3>
                  <div className="text-sm text-green-800 space-y-2">
                    <div>
                      <strong>Kişisel mesaj için:</strong><br/>
                      @userinfobot'a /start gönderin → Size ID verir (örn: 123456789)
                    </div>
                    <div>
                      <strong>Grup için:</strong><br/>
                      @RawDataBot'u gruba ekleyin → Size grup ID verir (örn: -1001234567890)
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={handleTest}
                    disabled={testing}
                    className="flex-1 bg-yellow-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-yellow-600 transition-colors disabled:bg-gray-400"
                  >
                    {testing ? 'Test Ediliyor...' : '🧪 Bağlantıyı Test Et'}
                  </button>
                  <button
                    onClick={handleSave}
                    className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                  >
                    💾 Kaydet
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
