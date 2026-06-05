// Crear botón flotante
const floatingButton = document.createElement('div');
floatingButton.id = 'voxscribe-floating-btn';
floatingButton.innerHTML = `
  <style>
    #voxscribe-floating-btn {
      position: fixed;
      bottom: 30px;
      right: 30px;
      width: 60px;
      height: 60px;
      border-radius: 50%;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 28px;
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
      z-index: 9999;
      transition: all 0.3s ease;
      user-select: none;
      border: none;
    }

    #voxscribe-floating-btn:hover {
      transform: scale(1.1);
      box-shadow: 0 6px 20px rgba(102, 126, 234, 0.6);
    }

    #voxscribe-floating-btn:active {
      transform: scale(0.95);
    }

    #voxscribe-floating-btn.recording {
      animation: vox-pulse 0.6s infinite;
    }

    @keyframes vox-pulse {
      0%, 100% {
        transform: scale(1);
        box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
      }
      50% {
        transform: scale(1.15);
        box-shadow: 0 8px 24px rgba(102, 126, 234, 0.8);
      }
    }

    #voxscribe-toast {
      position: fixed;
      bottom: 100px;
      right: 30px;
      background: #333;
      color: white;
      padding: 12px 16px;
      border-radius: 8px;
      font-size: 13px;
      z-index: 9998;
      animation: vox-slide-up 0.3s ease;
    }

    @keyframes vox-slide-up {
      from {
        opacity: 0;
        transform: translateY(10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  </style>
  🎙️
`;

document.body.appendChild(floatingButton);

let isRecording = false;
let mediaRecorder = null;
let audioChunks = [];
let stream = null;

floatingButton.addEventListener('click', async () => {
  if (!isRecording) {
    startRecording();
  } else {
    await stopRecording();
  }
});

async function startRecording() {
  try {
    stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorder = new MediaRecorder(stream);
    audioChunks = [];

    mediaRecorder.ondataavailable = (event) => {
      audioChunks.push(event.data);
    };

    mediaRecorder.start();
    isRecording = true;
    floatingButton.classList.add('recording');
    showToast('Grabando...');
  } catch (error) {
    if (error.name === 'NotAllowedError') {
      showToast('Permiso de micrófono denegado. Revisa configuración.');
    } else if (error.name === 'NotFoundError') {
      showToast('No se encontró micrófono en tu dispositivo.');
    } else {
      showToast('Error: ' + error.message);
    }
    console.error('Error al acceder al micrófono:', error);
  }
}

async function stopRecording() {
  return new Promise((resolve) => {
    if (!mediaRecorder) return resolve();

    mediaRecorder.onstop = async () => {
      isRecording = false;
      floatingButton.classList.remove('recording');
      showToast('Transcribiendo...');

      const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });

      // Obtener idioma guardado
      chrome.storage.sync.get(['language'], async (result) => {
        const language = result.language || 'es-ES';
        await transcribeAudio(audioBlob, language);
        resolve();
      });
    };

    mediaRecorder.stop();
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
  });
}

async function transcribeAudio(audioBlob, language) {
  try {
    const formData = new FormData();
    formData.append('audio', audioBlob, 'recording.wav');
    formData.append('language', language);

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
      showToast('✓ Copiado al portapapeles');
    } else {
      showToast('No se capturó audio');
    }
  } catch (error) {
    console.error('Error al transcribir:', error);
    showToast('Error: ' + error.message);
  }
}

function showToast(message) {
  // Remover toast anterior si existe
  const existingToast = document.getElementById('voxscribe-toast');
  if (existingToast) {
    existingToast.remove();
  }

  const toast = document.createElement('div');
  toast.id = 'voxscribe-toast';
  toast.textContent = message;
  document.body.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 3000);
}
