let isRecording = false;
let mediaRecorder = null;
let audioChunks = [];

const toggleBtn = document.getElementById('toggleBtn');
const statusDiv = document.getElementById('status');
const previewDiv = document.getElementById('preview');
const languageSelect = document.getElementById('languageSelect');

toggleBtn.addEventListener('click', async () => {
  if (!isRecording) {
    startRecording();
  } else {
    await stopRecording();
  }
});

async function startRecording() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorder = new MediaRecorder(stream);
    audioChunks = [];

    mediaRecorder.ondataavailable = (event) => {
      audioChunks.push(event.data);
    };

    mediaRecorder.onstart = () => {
      isRecording = true;
      toggleBtn.textContent = '⏹️ Grabando...';
      toggleBtn.classList.add('recording');
      statusDiv.textContent = 'Grabando...';
      previewDiv.style.display = 'none';
    };

    mediaRecorder.start();
  } catch (error) {
    statusDiv.textContent = 'Error: ' + error.message;
    console.error('Error al acceder al micrófono:', error);
  }
}

async function stopRecording() {
  return new Promise((resolve) => {
    if (!mediaRecorder) return resolve();

    mediaRecorder.onstop = async () => {
      isRecording = false;
      toggleBtn.textContent = 'Presiona para grabar';
      toggleBtn.classList.remove('recording');
      statusDiv.textContent = 'Transcribiendo...';

      const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
      await transcribeAudio(audioBlob);
      resolve();
    };

    mediaRecorder.stop();
    mediaRecorder.stream.getTracks().forEach(track => track.stop());
  });
}

async function transcribeAudio(audioBlob) {
  try {
    const formData = new FormData();
    formData.append('audio', audioBlob, 'recording.wav');
    formData.append('language', languageSelect.value);

    // Use the server URL - can be local or Vercel
    const serverUrl = 'https://voxscribe.vercel.app';
    const response = await fetch(`${serverUrl}/api/transcribe`, {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();
    const transcript = data.transcript || data.text || '';

    if (transcript) {
      // Copiar al portapapeles
      await navigator.clipboard.writeText(transcript);

      previewDiv.textContent = transcript;
      previewDiv.style.display = 'block';
      statusDiv.textContent = '✓ Copiado al portapapeles';

      setTimeout(() => {
        statusDiv.textContent = 'Listo';
      }, 3000);
    } else {
      statusDiv.textContent = 'No se capturó audio';
    }
  } catch (error) {
    console.error('Error al transcribir:', error);
    statusDiv.textContent = 'Error: ' + error.message;
  }
}

// Cargar idioma guardado
chrome.storage.sync.get(['language'], (result) => {
  if (result.language) {
    languageSelect.value = result.language;
  }
});

// Guardar idioma seleccionado
languageSelect.addEventListener('change', (e) => {
  chrome.storage.sync.set({ language: e.target.value });
});
