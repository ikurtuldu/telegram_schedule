const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// Config
export async function saveConfig(botToken: string, defaultChatId: string) {
  const response = await fetch(`${API_URL}/config`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ botToken, defaultChatId }),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Yapılandırma kaydedilemedi');
  }
  
  return response.json();
}

export async function getConfig() {
  const response = await fetch(`${API_URL}/config`);
  
  if (!response.ok) {
    throw new Error('Yapılandırma alınamadı');
  }
  
  return response.json();
}

export async function testConfig(botToken: string, chatId: string) {
  const response = await fetch(`${API_URL}/config/test`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ botToken, chatId }),
  });
  
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.error || 'Test başarısız');
  }
  
  return data;
}

// Messages
export async function getMessages() {
  const response = await fetch(`${API_URL}/messages`);
  
  if (!response.ok) {
    throw new Error('Mesajlar alınamadı');
  }
  
  return response.json();
}

export async function addMessage(message: {
  id: string;
  chatId: string;
  message: string;
  scheduledTime: string;
}) {
  const response = await fetch(`${API_URL}/messages`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(message),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Mesaj eklenemedi');
  }
  
  return response.json();
}

export async function deleteMessage(id: string) {
  const response = await fetch(`${API_URL}/messages/${id}`, {
    method: 'DELETE',
  });
  
  if (!response.ok) {
    throw new Error('Mesaj silinemedi');
  }
  
  return response.json();
}

// Logs
export async function getLogs() {
  const response = await fetch(`${API_URL}/logs`);
  
  if (!response.ok) {
    throw new Error('Loglar alınamadı');
  }
  
  return response.json();
}

export async function clearLogs() {
  const response = await fetch(`${API_URL}/logs`, {
    method: 'DELETE',
  });
  
  if (!response.ok) {
    throw new Error('Loglar temizlenemedi');
  }
  
  return response.json();
}

export async function clearAll() {
  const response = await fetch(`${API_URL}/clear-all`, {
    method: 'DELETE',
  });
  
  if (!response.ok) {
    throw new Error('Veriler temizlenemedi');
  }
  
  return response.json();
}
