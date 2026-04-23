import { ScheduledMessage } from '../types';
import { deleteMessage } from '../services/hybridStorage';

interface MessageListProps {
  messages: ScheduledMessage[];
  onUpdate: () => void;
}

export default function MessageList({ messages, onUpdate }: MessageListProps) {
  const handleDelete = async (id: string) => {
    if (window.confirm('Bu mesajı silmek istediğinizden emin misiniz?')) {
      try {
        await deleteMessage(id);
        onUpdate();
      } catch (error: any) {
        alert('Mesaj silinemedi: ' + error.message);
      }
    }
  };

  const getStatusBadge = (status: ScheduledMessage['status']) => {
    const styles = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      sent: 'bg-green-100 text-green-800 border-green-300',
      failed: 'bg-red-100 text-red-800 border-red-300',
    };

    const labels = {
      pending: '⏳ Bekliyor',
      sent: '✅ Gönderildi',
      failed: '❌ Başarısız',
    };

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${styles[status]}`}>
        {labels[status]}
      </span>
    );
  };

  const formatDateTime = (isoString: string) => {
    const date = new Date(isoString);
    return new Intl.DateTimeFormat('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const getTimeRemaining = (scheduledTime: string) => {
    const now = new Date();
    const scheduled = new Date(scheduledTime);
    const diff = scheduled.getTime() - now.getTime();

    if (diff < 0) return 'Zamanı geldi';

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (days > 0) return `${days} gün ${hours} saat kaldı`;
    if (hours > 0) return `${hours} saat ${minutes} dakika kaldı`;
    return `${minutes} dakika kaldı`;
  };

  const pendingMessages = messages.filter(m => m.status === 'pending');
  const completedMessages = messages.filter(m => m.status !== 'pending');

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
        <span className="text-3xl">📋</span>
        Zamanlanmış Mesajlar
        <span className="text-sm font-normal text-gray-500">({messages.length} mesaj)</span>
      </h2>

      {messages.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📭</div>
          <p className="text-gray-500">Henüz zamanlanmış mesaj yok.</p>
          <p className="text-gray-400 text-sm mt-2">Yukarıdaki formu kullanarak mesaj ekleyin.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Bekleyen Mesajlar */}
          {pendingMessages.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-3">
                🕒 Bekleyen Mesajlar ({pendingMessages.length})
              </h3>
              <div className="space-y-3">
                {pendingMessages.map((msg) => (
                  <MessageCard
                    key={msg.id}
                    message={msg}
                    onDelete={handleDelete}
                    getStatusBadge={getStatusBadge}
                    formatDateTime={formatDateTime}
                    getTimeRemaining={getTimeRemaining}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Tamamlanan Mesajlar */}
          {completedMessages.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-3">
                📦 Tamamlanan Mesajlar ({completedMessages.length})
              </h3>
              <div className="space-y-3">
                {completedMessages.map((msg) => (
                  <MessageCard
                    key={msg.id}
                    message={msg}
                    onDelete={handleDelete}
                    getStatusBadge={getStatusBadge}
                    formatDateTime={formatDateTime}
                    getTimeRemaining={getTimeRemaining}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

interface MessageCardProps {
  message: ScheduledMessage;
  onDelete: (id: string) => void;
  getStatusBadge: (status: ScheduledMessage['status']) => React.ReactElement;
  formatDateTime: (isoString: string) => string;
  getTimeRemaining: (scheduledTime: string) => string;
}

function MessageCard({ message, onDelete, getStatusBadge, formatDateTime, getTimeRemaining }: MessageCardProps) {
  return (
    <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            {getStatusBadge(message.status)}
            <span className="text-xs text-gray-500">
              Chat ID: {message.chatId}
            </span>
          </div>
          <p className="text-gray-800 whitespace-pre-wrap">{message.message}</p>
        </div>
        <button
          onClick={() => onDelete(message.id)}
          className="ml-2 text-gray-400 hover:text-red-600 transition-colors"
          title="Sil"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>

      <div className="flex items-center justify-between text-sm">
        <div className="text-gray-600">
          <span className="font-medium">📅 Zamanlanmış:</span> {formatDateTime(message.scheduledTime)}
        </div>
        {message.status === 'pending' && (
          <div className="text-blue-600 font-medium">
            {getTimeRemaining(message.scheduledTime)}
          </div>
        )}
      </div>
    </div>
  );
}
