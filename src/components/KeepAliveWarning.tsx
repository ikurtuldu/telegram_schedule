import { useState, useEffect } from 'react';

interface KeepAliveWarningProps {
  pendingCount: number;
}

export default function KeepAliveWarning({ pendingCount }: KeepAliveWarningProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    // Eğer daha önce kapatıldıysa ve bekleyen mesaj yoksa gösterme
    const wasDismissed = localStorage.getItem('keepAliveWarningDismissed');
    if (wasDismissed && pendingCount === 0) {
      setIsVisible(false);
    }
  }, [pendingCount]);

  const handleDismiss = () => {
    setIsVisible(false);
    if (pendingCount === 0) {
      localStorage.setItem('keepAliveWarningDismissed', 'true');
    }
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div className="bg-gradient-to-r from-orange-50 to-yellow-50 border-l-4 border-orange-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-3xl">🔥</span>
              <div>
                <h3 className="text-lg font-bold text-orange-900">
                  ÖNEMLİ: Tarayıcı Açık Kalmalı!
                </h3>
                <p className="text-orange-800 text-sm">
                  Bu bir web uygulamasıdır. Mesajların gönderilmesi için bu sekme açık kalmalıdır.
                </p>
              </div>
            </div>

            {showDetails && (
              <div className="ml-12 mt-3 space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="bg-white rounded-lg p-3 border border-green-300">
                    <div className="font-semibold text-green-800 mb-2 flex items-center gap-2">
                      <span>✅</span> Yapabilirsiniz
                    </div>
                    <ul className="text-green-700 space-y-1 text-xs">
                      <li>• Sekmeyi minimize edebilirsiniz</li>
                      <li>• Başka sekmelere geçebilirsiniz</li>
                      <li>• Bilgisayarı uyku moduna alabilirsiniz</li>
                      <li>• Tarayıcıyı arka plana alabilirsiniz</li>
                    </ul>
                  </div>

                  <div className="bg-white rounded-lg p-3 border border-red-300">
                    <div className="font-semibold text-red-800 mb-2 flex items-center gap-2">
                      <span>❌</span> Yapamayacakları
                    </div>
                    <ul className="text-red-700 space-y-1 text-xs">
                      <li>• Tarayıcıyı tamamen kapatmak</li>
                      <li>• Bu sekmeyi kapatmak</li>
                      <li>• Bilgisayarı kapatmak</li>
                      <li>• İnternet bağlantısını kesmek</li>
                    </ul>
                  </div>
                </div>

                <div className="bg-blue-100 rounded-lg p-3 border border-blue-300">
                  <p className="text-blue-900 text-xs">
                    <strong>💡 İpucu:</strong> Bilgisayarınızı uzun süre açık bırakacaksanız, 
                    enerji tasarrufu ayarlarından "uyku modunu" kapatın ve ekran koruyucu yerine 
                    ekranı kapatmayı tercih edin.
                  </p>
                </div>
              </div>
            )}

            <div className="ml-12 mt-3">
              <button
                onClick={() => setShowDetails(!showDetails)}
                className="text-orange-700 hover:text-orange-900 text-sm font-medium underline"
              >
                {showDetails ? '▲ Detayları Gizle' : '▼ Detayları Göster'}
              </button>
            </div>
          </div>

          <button
            onClick={handleDismiss}
            className="ml-4 text-orange-500 hover:text-orange-700"
            title="Kapat"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
