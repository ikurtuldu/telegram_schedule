import { useState } from 'react';

export default function HelpModal() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        Yardım
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Yardım ve Sorun Giderme</h2>
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
                {/* Hızlı Başlangıç */}
                <section>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <span className="text-2xl">🚀</span>
                    Hızlı Başlangıç
                  </h3>
                  <ol className="space-y-2 text-gray-700">
                    <li className="flex gap-3">
                      <span className="font-bold text-blue-600">1.</span>
                      <span>Telegram'da <strong>@BotFather</strong>'a gidin ve <code className="bg-gray-100 px-2 py-1 rounded">/newbot</code> yazın</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="font-bold text-blue-600">2.</span>
                      <span>Bot için isim ve kullanıcı adı belirleyin, size <strong>token</strong> verilecek</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="font-bold text-blue-600">3.</span>
                      <span>Kendi Telegram ID'nizi öğrenmek için <strong>@userinfobot</strong>'a <code className="bg-gray-100 px-2 py-1 rounded">/start</code> yazın</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="font-bold text-blue-600">4.</span>
                      <span>Oluşturduğunuz botunuza <code className="bg-gray-100 px-2 py-1 rounded">/start</code> gönderin (çok önemli!)</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="font-bold text-blue-600">5.</span>
                      <span>Bu uygulamada "Ayarlar"a gidin, token ve chat ID'yi girin, "Test Et"e tıklayın</span>
                    </li>
                  </ol>
                </section>

                {/* Sık Karşılaşılan Hatalar */}
                <section className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <h3 className="text-xl font-semibold text-red-900 mb-3 flex items-center gap-2">
                    <span className="text-2xl">❌</span>
                    Sık Karşılaşılan Hatalar
                  </h3>
                  
                  <div className="space-y-4 text-sm">
                    <div>
                      <h4 className="font-bold text-red-800 mb-1">"Unauthorized" Hatası</h4>
                      <ul className="text-red-700 ml-4 space-y-1">
                        <li>• Bot token yanlış veya geçersiz</li>
                        <li>• Token kopyalarken başında/sonunda boşluk kalmış</li>
                        <li>• Yeni token aldıysanız eski token artık çalışmaz</li>
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-bold text-red-800 mb-1">"Chat not found" Hatası</h4>
                      <ul className="text-red-700 ml-4 space-y-1">
                        <li>• <strong>En yaygın hata:</strong> Bota hiç mesaj göndermediniz!</li>
                        <li>• Telegram'da botunuzu bulun ve <code className="bg-red-100 px-1 rounded">/start</code> gönderin</li>
                        <li>• Grup için: Botu gruba ekleyin, admin yapın</li>
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-bold text-red-800 mb-1">"Bad Request" Hatası</h4>
                      <ul className="text-red-700 ml-4 space-y-1">
                        <li>• Chat ID yanlış formatta (sadece sayı olmalı)</li>
                        <li>• Kişisel: Pozitif sayı <code className="bg-red-100 px-1 rounded">123456789</code></li>
                        <li>• Grup: Negatif sayı <code className="bg-red-100 px-1 rounded">-1001234567890</code></li>
                      </ul>
                    </div>
                  </div>
                </section>

                {/* Örnek Değerler */}
                <section className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h3 className="text-xl font-semibold text-green-900 mb-3 flex items-center gap-2">
                    <span className="text-2xl">📝</span>
                    Örnek Değerler
                  </h3>
                  
                  <div className="space-y-3 text-sm">
                    <div>
                      <h4 className="font-bold text-green-800 mb-1">Bot Token örneği:</h4>
                      <code className="bg-green-100 px-3 py-1 rounded block text-green-900 overflow-x-auto">
                        5234567890:AAHdqTcvCH1vGWJxfSeofSAs0K5PALDsaw
                      </code>
                      <p className="text-green-700 mt-1">✓ İki nokta (:) içermeli, başında/sonunda boşluk olmamalı</p>
                    </div>

                    <div>
                      <h4 className="font-bold text-green-800 mb-1">Kişisel Chat ID örneği:</h4>
                      <code className="bg-green-100 px-3 py-1 rounded block text-green-900">
                        987654321
                      </code>
                      <p className="text-green-700 mt-1">✓ Pozitif sayı (kendi ID'niz)</p>
                    </div>

                    <div>
                      <h4 className="font-bold text-green-800 mb-1">Grup Chat ID örneği:</h4>
                      <code className="bg-green-100 px-3 py-1 rounded block text-green-900">
                        -1001234567890
                      </code>
                      <p className="text-green-700 mt-1">✓ Negatif sayı, genellikle -100 ile başlar</p>
                    </div>
                  </div>
                </section>

                {/* İpuçları */}
                <section className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="text-xl font-semibold text-blue-900 mb-3 flex items-center gap-2">
                    <span className="text-2xl">💡</span>
                    İpuçları
                  </h3>
                  
                  <ul className="space-y-2 text-sm text-blue-800">
                    <li className="flex gap-2">
                      <span>•</span>
                      <span><strong>Sayfa açık kalmalı:</strong> Mesajların gönderilmesi için tarayıcı sekmesi açık olmalıdır</span>
                    </li>
                    <li className="flex gap-2">
                      <span>•</span>
                      <span><strong>HTML formatı:</strong> Mesajlarda <code className="bg-blue-100 px-1 rounded">&lt;b&gt;</code>, <code className="bg-blue-100 px-1 rounded">&lt;i&gt;</code>, <code className="bg-blue-100 px-1 rounded">&lt;code&gt;</code> kullanabilirsiniz</span>
                    </li>
                    <li className="flex gap-2">
                      <span>•</span>
                      <span><strong>Otomatik kontrol:</strong> Sistem her 10 saniyede mesajları kontrol eder</span>
                    </li>
                    <li className="flex gap-2">
                      <span>•</span>
                      <span><strong>Güvenlik:</strong> Tüm bilgiler sadece tarayıcınızda saklanır, hiçbir yere gönderilmez</span>
                    </li>
                  </ul>
                </section>

                {/* Faydalı Botlar */}
                <section>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <span className="text-2xl">🤖</span>
                    Faydalı Telegram Botları
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                    <div className="border border-gray-200 rounded-lg p-3">
                      <h4 className="font-bold text-gray-800">@BotFather</h4>
                      <p className="text-gray-600">Bot oluşturma ve yönetme</p>
                    </div>
                    <div className="border border-gray-200 rounded-lg p-3">
                      <h4 className="font-bold text-gray-800">@userinfobot</h4>
                      <p className="text-gray-600">Kişisel chat ID öğrenme</p>
                    </div>
                    <div className="border border-gray-200 rounded-lg p-3">
                      <h4 className="font-bold text-gray-800">@RawDataBot</h4>
                      <p className="text-gray-600">Grup chat ID öğrenme</p>
                    </div>
                    <div className="border border-gray-200 rounded-lg p-3">
                      <h4 className="font-bold text-gray-800">@myidbot</h4>
                      <p className="text-gray-600">Alternatif ID bulma botu</p>
                    </div>
                  </div>
                </section>
              </div>

              <div className="mt-6 pt-4 border-t">
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  Anladım
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
