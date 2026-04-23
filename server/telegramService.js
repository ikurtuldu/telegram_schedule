export async function sendTelegramMessage(botToken, chatId, message) {
  const url = `https://api.telegram.org/bot${botToken}/sendMessage`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: 'HTML',
      }),
    });

    const data = await response.json();

    if (!response.ok || !data.ok) {
      let errorMsg = data.description || 'Mesaj gönderilemedi';
      
      if (errorMsg.includes('bot was blocked')) {
        errorMsg = 'Bot kullanıcı tarafından engellenmiş';
      } else if (errorMsg.includes('chat not found')) {
        errorMsg = 'Chat ID bulunamadı. Lütfen bota önce bir mesaj gönderin.';
      } else if (errorMsg.includes('Unauthorized')) {
        errorMsg = 'Bot token geçersiz. Lütfen doğru token girin.';
      } else if (errorMsg.includes('Bad Request')) {
        errorMsg = 'Geçersiz istek. Chat ID formatını kontrol edin.';
      }
      
      throw new Error(errorMsg);
    }

    return { success: true, data };
  } catch (error) {
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('İnternet bağlantısı hatası.');
    }
    throw error;
  }
}

export async function testTelegramConnection(botToken, chatId) {
  try {
    await sendTelegramMessage(botToken, chatId, '✅ Test mesajı - Bağlantı başarılı!');
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}
