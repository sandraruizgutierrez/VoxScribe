// Service Worker para VoxScribe
chrome.runtime.onInstalled.addListener(() => {
  console.log('VoxScribe extension instalada');
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'TRANSCRIBE') {
    transcribeAudio(message.audioBlob, message.language)
      .then(result => sendResponse({ success: true, transcript: result }))
      .catch(error => sendResponse({ success: false, error: error.message }));
    return true;
  }
});

async function transcribeAudio(audioBlob, language) {
  const formData = new FormData();
  formData.append('audio', audioBlob, 'recording.wav');
  formData.append('language', language);

  const response = await fetch('https://voxscribe.vercel.app/api/transcribe', {
    method: 'POST',
    body: formData
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }

  const data = await response.json();
  return data.transcript || data.text || '';
}
