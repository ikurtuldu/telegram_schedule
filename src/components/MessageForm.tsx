import { useState, useEffect } from 'react';
import { addMessage, getConfig } from '../services/hybridStorage';

interface MessageFormProps {
  onMessageAdded: () => void;
}

export default function MessageForm({ onMessageAdded }: MessageFormProps) {
  const [chatId, setChatId] = useState('');
  const [message, setMessage] = useState('');
  const [scheduledDate, setScheduledDate] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');
  const [defaultChatId, setDefaultChatId] = useState('');

  useEffect(() => {
    const loadConfig = async () => {
      try {
        const config = await getConfig();
        if (config) {
          setDefaultChatId(config.defaultChatId);
        }
      } catch (error) {
        console.error('Config yükleme hatası:', error);
      }
    };
    loadConfig();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!defaultChatId && !chatId) {
      alert('Lütfen önce Telegram ayarlarını yapın veya Chat ID girin!');
      return;
    }

    if (!message || !scheduledDate || !scheduledTime) {
      alert('Lütfen tüm alanları doldurun!');
      return;
    }

    const targetChatId = chatId || defaultChatId;
    if (!targetChatId) {
      alert('Lütfen Chat ID girin veya varsayılan Chat ID ayarlayın!');
      return;
    }

    const scheduledDateTime = new Date(`${scheduledDate}T${scheduledTime}`);
    const now = new Date();

    if (scheduledDateTime <= now) {
      alert('Zamanlanmış tarih gelecekte olmalıdır!');
      return;
    }

    try {
      await addMessage({
        id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        chatId: targetChatId,
        message,
        scheduledTime: scheduledDateTime.toISOString(),
      });
      
      // Formu temizle
      setMessage('');
      setScheduledDate('');
      setScheduledTime('');
      
      onMessageAdded();
      alert('Mesaj veritabanına kaydedildi ve zamanı geldiğinde otomatik gönderilecek! ✅');
    } catch (error: any) {
      alert('Mesaj eklenemedi: ' + error.message);
    }
  };

  // Minimum tarih olarak bugünü ayarla
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
        <span className="text-3xl">📝</span>
        Yeni Zamanlanmış Mesaj
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Chat ID (Opsiyonel - boş bırakırsanız varsayılan kullanılır)
          </label>
          <input
            type="text"
            value={chatId}
            onChange={(e) => setChatId(e.target.value)}
            placeholder="Varsayılan chat ID kullanılacak"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Mesaj *
          </label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Göndermek istediğiniz mesajı yazın..."
            rows={4}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          />
          <p className="mt-1 text-sm text-gray-500">
            HTML formatı desteklenir: {'<b>kalın</b>, <i>italik</i>, <code>kod</code>'}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tarih *
            </label>
            <input
              type="date"
              value={scheduledDate}
              onChange={(e) => setScheduledDate(e.target.value)}
              min={today}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Saat *
            </label>
            <input
              type="time"
              value={scheduledTime}
              onChange={(e) => setScheduledTime(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl"
        >
          ⏰ Mesajı Zamanla
        </button>
      </form>
    </div>
  );
}
