import { MessageLog } from '../types';
import { clearLogs } from '../services/hybridStorage';

interface MessageLogsProps {
  logs: MessageLog[];
  onUpdate: () => void;
}

export default function MessageLogs({ logs, onUpdate }: MessageLogsProps) {
  const handleClearLogs = async () => {
    if (window.confirm('Tüm log kayıtlarını silmek istediğinizden emin misiniz?')) {
      try {
        await clearLogs();
        onUpdate();
      } catch (error: any) {
        alert('Loglar temizlenemedi: ' + error.message);
      }
    }
  };

  const formatDateTime = (isoString: string) => {
    const date = new Date(isoString);
    return new Intl.DateTimeFormat('tr-TR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    }).format(date);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <span className="text-3xl">📊</span>
          Gönderim Logları
          <span className="text-sm font-normal text-gray-500">({logs.length} kayıt)</span>
        </h2>
        {logs.length > 0 && (
          <button
            onClick={handleClearLogs}
            className="text-red-600 hover:text-red-700 font-medium text-sm flex items-center gap-1"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Logları Temizle
          </button>
        )}
      </div>

      {logs.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📝</div>
          <p className="text-gray-500">Henüz log kaydı yok.</p>
          <p className="text-gray-400 text-sm mt-2">Mesajlar gönderildikçe burada görünecekler.</p>
        </div>
      ) : (
        <div className="space-y-3 max-h-[600px] overflow-y-auto">
          {logs.map((log) => (
            <div
              key={log.id}
              className={`border-l-4 p-4 rounded-r-lg ${
                log.status === 'sent'
                  ? 'bg-green-50 border-green-500'
                  : 'bg-red-50 border-red-500'
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">
                    {log.status === 'sent' ? '✅' : '❌'}
                  </span>
                  <span className={`font-semibold ${
                    log.status === 'sent' ? 'text-green-800' : 'text-red-800'
                  }`}>
                    {log.status === 'sent' ? 'Başarıyla Gönderildi' : 'Gönderim Başarısız'}
                  </span>
                </div>
                <span className="text-xs text-gray-500">
                  Chat ID: {log.chatId}
                </span>
              </div>

              <p className="text-gray-700 text-sm mb-3 whitespace-pre-wrap">
                {log.message}
              </p>

              <div className="flex items-center justify-between text-xs text-gray-600">
                <div className="space-y-1">
                  <div>
                    <span className="font-medium">Zamanlanmış:</span>{' '}
                    {formatDateTime(log.scheduledTime)}
                  </div>
                  {log.sentTime && (
                    <div>
                      <span className="font-medium">Gönderildi:</span>{' '}
                      {formatDateTime(log.sentTime)}
                    </div>
                  )}
                </div>
                {log.error && (
                  <div className="text-red-600 font-medium max-w-xs text-right">
                    Hata: {log.error}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* İstatistikler */}
      {logs.length > 0 && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="bg-blue-50 rounded-lg p-3">
              <div className="text-2xl font-bold text-blue-600">{logs.length}</div>
              <div className="text-sm text-blue-800">Toplam</div>
            </div>
            <div className="bg-green-50 rounded-lg p-3">
              <div className="text-2xl font-bold text-green-600">
                {logs.filter(l => l.status === 'sent').length}
              </div>
              <div className="text-sm text-green-800">Başarılı</div>
            </div>
            <div className="bg-red-50 rounded-lg p-3">
              <div className="text-2xl font-bold text-red-600">
                {logs.filter(l => l.status === 'failed').length}
              </div>
              <div className="text-sm text-red-800">Başarısız</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
