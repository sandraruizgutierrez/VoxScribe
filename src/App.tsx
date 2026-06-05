import React, { useState, useEffect, useRef } from "react";
import {
  Mic,
  MicOff,
  Play,
  Square,
  RefreshCw,
  Copy,
  Trash2,
  Download,
  Check,
  Sparkles,
  FileCheck,
  Globe,
  HelpCircle,
  FileText,
  Bookmark,
  Volume2,
  UploadCloud,
  ChevronDown,
  History,
  X,
  VolumeX,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useSpeechRecognition } from "./hooks/useSpeechRecognition";
import { MicVisualizer } from "./components/MicVisualizer";
import { DictationRecord, SUPPORTED_LANGUAGES, LanguageOption } from "./types";

export default function App() {
  const {
    isListening,
    transcript,
    setTranscript,
    interimTranscript,
    error: speechError,
    isSupported: isSpeechSupported,
    startListening,
    stopListening,
    resetTranscript,
  } = useSpeechRecognition();

  // Primary States
  const [activeTab, setActiveTab] = useState<"live" | "file">("live");
  const [selectedLanguage, setSelectedLanguage] = useState<LanguageOption>(SUPPORTED_LANGUAGES[0]);
  const [editorText, setEditorText] = useState("");
  const [originalTextBeforeAI, setOriginalTextBeforeAI] = useState<string | null>(null);
  
  // Audio record states
  const [recordingFile, setRecordingFile] = useState<boolean>(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [isProcessingAI, setIsProcessingAI] = useState(false);
  
  // Timer tracking
  const [duration, setDuration] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // History states
  const [history, setHistory] = useState<DictationRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedHistoryId, setSelectedHistoryId] = useState<string | null>(null);

  // Translation states
  const [translateLang, setTranslateLang] = useState("inglés");
  const [customTranslateLang, setCustomTranslateLang] = useState("");

  // Diagnostics & levels (Custom aesthetic interactive widgets)
  const [noiseLevel, setNoiseLevel] = useState(-55);
  const [latency, setLatency] = useState(12);

  // Custom alert/toast states
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [sysError, setSysError] = useState<string | null>(null);

  // Media record references
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  // Speech TTS states
  const [isPlayingTTS, setIsPlayingTTS] = useState(false);
  const speechUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Sync Speech live transcribing to the Editor
  useEffect(() => {
    if (transcript) {
      setEditorText(transcript);
    }
  }, [transcript]);

  // Load recordings history from localStorage on mounting
  useEffect(() => {
    try {
      const stored = localStorage.getItem("dictation_history");
      if (stored) {
        setHistory(JSON.parse(stored));
      }
    } catch (e) {
      console.error("No se pudo cargar el historial", e);
    }
  }, []);

  // Set randomized simulated diagnostic levels to increase immersion!
  useEffect(() => {
    const diagnosticInterval = setInterval(() => {
      if (isListening || recordingFile) {
        setNoiseLevel(Math.floor(Math.random() * 20) - 45); // louder activity
        setLatency(Math.floor(Math.random() * 10) + 18);   // active streaming latency
      } else {
        setNoiseLevel(Math.floor(Math.random() * 8) - 58);  // quiet background noise
        setLatency(Math.floor(Math.random() * 4) + 8);     // idle ping
      }
    }, 1500);

    return () => clearInterval(diagnosticInterval);
  }, [isListening, recordingFile]);

  // Active micro/recorder timer
  useEffect(() => {
    if (isListening || recordingFile) {
      timerRef.current = setInterval(() => {
        setDuration((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isListening, recordingFile]);

  // Save history helper functions
  const saveHistoryList = (newList: DictationRecord[]) => {
    try {
      localStorage.setItem("dictation_history", JSON.stringify(newList));
      setHistory(newList);
    } catch (e) {
      console.error("Error al persistir historial", e);
      showToast("Error al guardar en el almacenamiento local.");
    }
  };

  // Toast feedback popups triggered by custom events
  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  // Toggle continuing live microphone transcription
  const handleToggleLiveListening = () => {
    if (isListening) {
      stopListening();
      showToast("Dictado en vivo pausado.");
    } else {
      setOriginalTextBeforeAI(null); // clean original buffer context
      setDuration(0);
      startListening(selectedLanguage.code);
      showToast("Micrófono abierto. Comienza a hablar...");
    }
  };

  // Editor modifications
  const handleEditorChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEditorText(e.target.value);
  };

  // Clean/reset whole workspace
  const handleClearEditor = () => {
    resetTranscript();
    setEditorText("");
    setOriginalTextBeforeAI(null);
    setDuration(0);
    setSelectedHistoryId(null);
    showToast("Editor restablecido.");
  };

  // Capture user sounds & convert to direct downloadable media
  const startFileRecording = async () => {
    setAudioBlob(null);
    setAudioUrl(null);
    audioChunksRef.current = [];
    setDuration(0);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const options = { mimeType: "audio/webm" };
      let recorder;
      try {
        recorder = new MediaRecorder(stream, options);
      } catch (err) {
        recorder = new MediaRecorder(stream);
      }

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      recorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: recorder.mimeType || "audio/webm" });
        setAudioBlob(blob);
        setAudioUrl(URL.createObjectURL(blob));
        setRecordingFile(false);
        showToast("Audio grabado correctamente.");
      };

      mediaRecorderRef.current = recorder;
      recorder.start();
      setRecordingFile(true);
      showToast("Grabación iniciada...");
    } catch (err: any) {
      console.error("Error al acceder al micrófono:", err);
      setSysError("No se pudo iniciar el grabador local. Por favor entrega permisos al micrófono.");
    }
  };

  const stopFileRecording = () => {
    if (mediaRecorderRef.current && recordingFile) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach((track) => track.stop());
    }
  };

  const cancelFileRecording = () => {
    if (mediaRecorderRef.current && recordingFile) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach((track) => track.stop());
    }
    setRecordingFile(false);
    setAudioBlob(null);
    setAudioUrl(null);
    setDuration(0);
    showToast("Grabación interrumpida.");
  };

  // File drop event parsing
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("audio/")) {
      setSysError("Por favor selecciona un archivo multimedia de audio correcto.");
      return;
    }

    setAudioBlob(file);
    setAudioUrl(URL.createObjectURL(file));
    setDuration(0);
    setSysError(null);
    showToast(`Archivo cargado: ${file.name}`);
  };

  // Convert binary file to transit Base64 string
  const blobToBase64Helper = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = (reader.result as string).split(",")[1];
        resolve(base64String);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  // Remote transcription endpoint client
  const transcribeAudioFile = async () => {
    if (!audioBlob) return;
    setIsTranscribing(true);
    setSysError(null);

    try {
      const base64Audio = await blobToBase64Helper(audioBlob);
      const mimeType = audioBlob.type || "audio/webm";

      const res = await fetch("/api/ai/transcribe-file", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ audioBase64: base64Audio, mimeType }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Ocurrió un error en el servidor.");
      }

      if (data.transcription) {
        setEditorText(data.transcription);
        setOriginalTextBeforeAI(null);
        showToast("¡Audio transcripto con Gemini AI!");
      } else {
        setSysError("Gemini no pudo recuperar oraciones claras de este recurso multimedia.");
      }
    } catch (err: any) {
      console.error(err);
      setSysError(err.message || "Error al procesar la transcripción con Gemini.");
    } finally {
      setIsTranscribing(false);
    }
  };

  // AI correction engines
  const processTextWithAI = async (action: "polish" | "summarize" | "formalize" | "translate") => {
    if (!editorText.trim()) {
      showToast("Escribe o dicta algún texto primero.");
      return;
    }

    setIsProcessingAI(true);
    setSysError(null);

    if (!originalTextBeforeAI) {
      setOriginalTextBeforeAI(editorText);
    }

    try {
      const res = await fetch("/api/ai/process", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: editorText,
          action,
          targetLanguage: action === "translate" ? (translateLang === "custom" ? customTranslateLang : translateLang) : undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Error de servidor.");
      }

      if (data.processedText) {
        setEditorText(data.processedText);
        showToast(`Texto optimizado con Inteligencia Artificial`);
      } else {
        setSysError("La Inteligencia Artificial de Gemini no generó respuesta.");
      }
    } catch (err: any) {
      console.error(err);
      setSysError(err.message || "Error al contactar con la Inteligencia Artificial.");
    } finally {
      setIsProcessingAI(false);
    }
  };

  // Local storage listings tracker
  const handleSaveToHistory = () => {
    if (!editorText.trim()) {
      showToast("Tu editor está vacío.");
      return;
    }

    const words = editorText.trim().split(/\s+/);
    const suggestedTitle = words.slice(0, 5).join(" ") + (words.length > 5 ? "..." : "");

    const newRecord: DictationRecord = {
      id: selectedHistoryId || "rec_" + Date.now(),
      title: suggestedTitle,
      text: editorText,
      originalText: originalTextBeforeAI || undefined,
      timestamp: new Date().toLocaleDateString("es-ES", {
        day: "numeric",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
      }),
      language: selectedLanguage.name,
      durationSecs: duration,
      isAIPolished: originalTextBeforeAI !== null,
    };

    let updatedHistory: DictationRecord[];
    if (selectedHistoryId) {
      updatedHistory = history.map((item) => (item.id === selectedHistoryId ? newRecord : item));
      showToast("Transcripción actualizada correctamente.");
    } else {
      updatedHistory = [newRecord, ...history];
      setSelectedHistoryId(newRecord.id);
      showToast("Grabación almacenada en tu biblioteca.");
    }

    saveHistoryList(updatedHistory);
  };

  const handleLoadHistoryRecord = (rec: DictationRecord) => {
    setEditorText(rec.text);
    setOriginalTextBeforeAI(rec.originalText || null);
    setSelectedHistoryId(rec.id);
    setDuration(rec.durationSecs);
    showToast(`Grabación cargada: "${rec.title}"`);
  };

  const handleDeleteHistoryRecord = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = history.filter((item) => item.id !== id);
    saveHistoryList(updated);
    if (selectedHistoryId === id) {
      handleClearEditor();
    }
    showToast("Grabación eliminada de la biblioteca.");
  };

  // Disk writes helpers
  const handleDownloadAsTxt = () => {
    if (!editorText.trim()) return;
    const blob = new Blob([editorText], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `NotaVoce_${new Date().toISOString().slice(0, 10)}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast("Archivo .TXT exportado.");
  };

  const handleCopyToClipboard = (textToCopy: string = editorText) => {
    if (!textToCopy.trim()) return;
    navigator.clipboard.writeText(textToCopy);
    showToast("¡Texto copiado al portapapeles!");
  };

  // Readback Synthesis engine
  const handleToggleTTS = () => {
    if (isPlayingTTS) {
      window.speechSynthesis.cancel();
      setIsPlayingTTS(false);
      showToast("Lectura pausada.");
      return;
    }

    if (!editorText.trim()) {
      showToast("No hay texto legible para reproducir.");
      return;
    }

    const utterance = new SpeechSynthesisUtterance(editorText);
    utterance.lang = "es-ES";

    utterance.onend = () => {
      setIsPlayingTTS(false);
    };

    utterance.onerror = () => {
      setIsPlayingTTS(false);
    };

    speechUtteranceRef.current = utterance;
    setIsPlayingTTS(true);
    window.speechSynthesis.speak(utterance);
    showToast("Reproduciendo texto en voz alta...");
  };

  const handleRestoreOriginal = () => {
    if (originalTextBeforeAI) {
      setEditorText(originalTextBeforeAI);
      setOriginalTextBeforeAI(null);
      showToast("Volviendo al dictado original...");
    }
  };

  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    return `${mins.toString().padStart(2, "0")}:${remainingSecs.toString().padStart(2, "0")}`;
  };

  const filteredHistory = history.filter(
    (item) =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.text.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col antialiased relative overflow-hidden font-sans">
      
      {/* Background Glow Atmosphere */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-orange-600/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-25%] left-[-10%] w-[800px] h-[800px] bg-indigo-600/10 rounded-full blur-[150px]" />
      </div>

      {/* Floating alert notifier popups */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-stone-900 border border-white/10 text-white font-medium text-xs py-3 px-6 rounded-full shadow-[0_0_30px_rgba(255,255,255,0.05)] flex items-center gap-2.5 backdrop-blur-md"
          >
            <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse shadow-[0_0_10px_#f97316]" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header bar controls navigation */}
      <header className="sticky top-0 bg-black/40 border-b border-white/5 backdrop-blur-lg z-20 px-6 py-4.5">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          
          {/* Logo & title context */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center text-white shadow-[0_0_20px_rgba(234,88,12,0.3)] border border-orange-400/20">
              <Mic className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold font-display text-white tracking-tight flex items-center gap-1.5 leading-none">
                VoxScribe
                <span className="text-[10px] bg-white/10 border border-white/10 text-white/60 font-semibold px-2 py-0.5 rounded-full ml-1 uppercase">
                  Immersivo
                </span>
              </h1>
              <p className="text-[11px] text-white/40 mt-1">Transcripción de voz instantánea potenciada con Inteligencia Artificial</p>
            </div>
          </div>

          {/* Quick status line and Language selectors */}
          <div className="flex items-center gap-3 flex-wrap justify-center">
            
            {/* Status light */}
            <div className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full shadow-[0_0_8px_#22c55e] ${isListening || recordingFile ? "bg-orange-500 animate-ping shadow-[0_0_8px_#f97316]" : "bg-green-500 shadow-[0_0_8px_#22c55e]"}`} />
              <span className="text-xs font-semibold text-white/70">
                {isListening ? "Escuchando Voz" : recordingFile ? "Grabando Audio" : "Sistema Listo"}
              </span>
            </div>

            <div className="h-4 w-px bg-white/10" />

            {/* Accent Select Dropdown */}
            <div className="relative">
              <select
                id="header-lang-select"
                value={selectedLanguage.code}
                onChange={(e) => {
                  const found = SUPPORTED_LANGUAGES.find((lang) => lang.code === e.target.value);
                  if (found) {
                    setSelectedLanguage(found);
                    showToast(`Idioma cambiado a: ${found.name}`);
                  }
                }}
                className="appearance-none bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs py-1.5 pl-3.5 pr-8 rounded-xl outline-none font-medium cursor-pointer transition-colors"
              >
                {SUPPORTED_LANGUAGES.map((lang) => (
                  <option key={lang.code} value={lang.code} className="bg-stone-900 text-white text-xs">
                    {lang.flag} &nbsp; {lang.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-white/40 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            <button
              onClick={handleDownloadAsTxt}
              disabled={!editorText.trim()}
              className="px-3.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 disabled:opacity-40 disabled:pointer-events-none text-xs font-medium text-white transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              Exportar
            </button>
          </div>
        </div>
      </header>

      {/* Grid Content Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 z-10 relative">
        
        {/* Left Side Section: Controls, Studio, Editor and Actions */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          
          {/* Studio Audio Capture Controls Card */}
          <div className="bg-white/5 border border-white/10 rounded-2xl backdrop-blur-xl p-5 shadow-2xl relative overflow-hidden group">
            
            {/* Top selection items */}
            <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-5 flex-wrap gap-3">
              <div className="flex gap-1 bg-black/40 p-1 rounded-xl border border-white/5">
                <button
                  type="button"
                  id="tab-btn-live-v3"
                  onClick={() => {
                    setActiveTab("live");
                    if (recordingFile) stopFileRecording();
                  }}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
                    activeTab === "live"
                      ? "bg-white text-black shadow-lg"
                      : "text-white/60 hover:text-white"
                  }`}
                >
                  <Mic className="w-3.5 h-3.5" />
                  Dictado Directo
                </button>
                <button
                  type="button"
                  id="tab-btn-file-v3"
                  onClick={() => {
                    setActiveTab("file");
                    if (isListening) stopListening();
                  }}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
                    activeTab === "file"
                      ? "bg-white text-black shadow-lg"
                      : "text-white/60 hover:text-white"
                  }`}
                >
                  <UploadCloud className="w-3.5 h-3.5" />
                  Subir o Grabar Audio
                </button>
              </div>

              <div className="flex items-center gap-2 text-xs text-white/50 bg-white/5 border border-white/5 rounded-lg px-3 py-1 font-mono">
                <span>Muestreo: 44.1 kHz</span>
              </div>
            </div>

            {/* Error messaging banners inside the glass frame */}
            {sysError && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-xl flex items-center justify-between gap-2"
              >
                <span className="font-semibold">{sysError}</span>
                <button
                  onClick={() => setSysError(null)}
                  className="p-1 hover:bg-white/10 rounded-lg text-red-400 transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </motion.div>
            )}

            {speechError && (
              <div className="mb-4 p-3 bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs rounded-xl flex items-center justify-between gap-2">
                <span className="font-medium">{speechError}</span>
                <span className="text-[10px] bg-orange-500/20 px-2 py-0.5 rounded text-orange-300 font-mono">Aviso Micrófono</span>
              </div>
            )}

            {/* TAB CONTENT: LIVE VOICE */}
            {activeTab === "live" ? (
              <div className="flex flex-col items-center justify-center p-6 bg-black/20 rounded-xl border border-white/5 relative overflow-hidden min-h-[170px]">
                
                {!isSpeechSupported ? (
                  <div className="text-center p-3">
                    <p className="text-white/60 text-xs max-w-sm font-medium leading-relaxed">
                      El Speech Recognition nativo no está activo en este navegador. Utiliza la pestaña de <strong>Subir o Grabar Audio</strong> para transcribir y procesar tus archivos de audio mediante Gemini AI.
                    </p>
                  </div>
                ) : (
                  <div className="w-full flex flex-col items-center gap-4">
                    {/* Visual waves indicator */}
                    <MicVisualizer isActive={isListening} color="bg-orange-500" />

                    {/* Microphone active button action triggers */}
                    <div className="flex items-center gap-4">
                      {isListening && (
                        <button
                          type="button"
                          id="btn-cancel-recording-v3"
                          onClick={() => {
                            stopListening();
                            setDuration(0);
                            setEditorText("");
                            showToast("Dictado detenido y limpiado.");
                          }}
                          className="p-3 bg-white/5 text-white/70 hover:text-white border border-white/10 hover:bg-white/10 rounded-full transition-colors cursor-pointer"
                          title="Volver a empezar"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}

                      {/* Prime Mic switch button */}
                      <div className="relative">
                        <div className={`absolute inset-0 rounded-full ${isListening ? "bg-orange-500/30 animate-pulse" : "bg-transparent"}`} />
                        <button
                          type="button"
                          id="btn-trigger-mic-v3"
                          onClick={handleToggleLiveListening}
                          className={`relative w-20 h-20 rounded-full flex items-center justify-center shadow-xl transition-all active:scale-95 duration-150 cursor-pointer ${
                            isListening
                              ? "bg-gradient-to-tr from-orange-600 to-red-500 text-white shadow-[0_0_30px_rgba(249,115,22,0.4)]"
                              : "bg-white text-black hover:bg-stone-100"
                          }`}
                        >
                          {isListening ? <MicOff className="w-7 h-7" /> : <Mic className="w-7 h-7" />}
                        </button>
                      </div>

                      {(isListening || duration > 0) && (
                        <button
                          type="button"
                          id="btn-check-mic-v3"
                          onClick={() => {
                            stopListening();
                            showToast("Dictado completado.");
                          }}
                          className="p-3 bg-orange-500 hover:bg-orange-650 text-white rounded-full transition-colors cursor-pointer shadow-lg"
                          title="Detener y registrar"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    <div className="text-center">
                      <p className="text-xs font-bold uppercase tracking-[0.2em] text-white">
                        {isListening ? `Grabando: ${formatTime(duration)}` : "Iniciar dictado de voz"}
                      </p>
                      <p className="text-[10px] text-white/40 mt-1">
                        {isListening ? "Habla para comenzar a transcribir" : `Micrófono sintonizado en ${selectedLanguage.name}`}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* TAB CONTENT: RECORDING OR UPLOADING AUDIO */
              <div className="flex flex-col items-center justify-center p-6 bg-black/20 rounded-xl border border-white/5 relative overflow-hidden">
                <div className="w-full flex flex-col sm:flex-row items-center gap-6">
                  
                  {/* Left component: Local micro recorder to blob */}
                  <div className="flex-1 flex flex-col items-center border-b sm:border-b-0 sm:border-r border-white/10 pb-5 sm:pb-0 sm:pr-6 gap-3 w-full">
                    <MicVisualizer isActive={recordingFile} color="bg-rose-500" />

                    <div className="flex items-center gap-3">
                      {!recordingFile && !audioUrl ? (
                        <button
                          type="button"
                          id="btn-play-record"
                          onClick={startFileRecording}
                          className="flex items-center gap-2 bg-rose-600 hover:bg-rose-700 text-white font-medium py-2 px-4 rounded-xl text-xs transition-colors shadow-lg cursor-pointer"
                        >
                          <Play className="w-3.5 h-3.5" />
                          Grabar Nota de Audio
                        </button>
                      ) : recordingFile ? (
                        <>
                          <button
                            type="button"
                            id="btn-cancel-recording-local"
                            onClick={cancelFileRecording}
                            className="p-2 bg-white/5 border border-white/10 text-white/50 hover:text-white rounded-xl hover:bg-white/10 transition-colors"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            id="btn-stop-recording-local"
                            onClick={stopFileRecording}
                            className="flex items-center gap-2 bg-rose-500 hover:bg-rose-650 text-white font-semibold py-2 px-4 rounded-xl text-xs transition-all animate-pulse"
                          >
                            <Square className="w-3.5 h-3.5 fill-current" />
                            Detener ({formatTime(duration)})
                          </button>
                        </>
                      ) : (
                        <div className="flex flex-col items-center gap-2">
                          <audio src={audioUrl || undefined} controls className="h-9 w-44 brightness-95 filter invert" />
                          <button
                            type="button"
                            id="btn-reset-recording-local"
                            onClick={startFileRecording}
                            className="flex items-center gap-1.5 text-rose-400 hover:text-rose-500 font-medium text-[11px]"
                          >
                            <RefreshCw className="w-3 h-3" />
                            Volver a grabar
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right component: Audio file selector */}
                  <div className="flex-1 w-full flex flex-col items-center py-2 gap-3">
                    <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/60">
                      <UploadCloud className="w-5 h-5" />
                    </div>
                    
                    <div className="text-center w-full">
                      <label className="block w-full max-w-[200px] mx-auto bg-white/5 hover:bg-white/10 border border-white/10 text-white/80 font-medium py-2 px-3 rounded-xl text-xs transition-colors text-center cursor-pointer">
                        Selecciona un archivo
                        <input
                          type="file"
                          id="file-element-capture"
                          accept="audio/*"
                          onChange={handleFileUpload}
                          className="hidden"
                        />
                      </label>
                      <p className="text-[10px] text-white/40 mt-2">Soporta MP3, WAV, WEBM, M4A, OGG</p>
                    </div>
                  </div>
                </div>

                {/* Submit to Gemini translation trigger */}
                {audioBlob && (
                  <div className="w-full pt-4 mt-5 border-t border-white/10 flex justify-center">
                    <button
                      type="button"
                      id="btn-run-transcription-gemini"
                      disabled={isTranscribing}
                      onClick={transcribeAudioFile}
                      className="flex items-center gap-2 bg-white text-black hover:bg-stone-200 disabled:bg-white/20 disabled:text-white/40 font-bold py-2.5 px-6 rounded-xl text-xs transition-all cursor-pointer shadow-xl"
                    >
                      {isTranscribing ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin text-black" />
                          <span>Gemini transcribiendo...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4 text-orange-500 fill-current" />
                          <span>Transcribir con Gemini AI</span>
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Primary Editor Screen Space */}
          <div className="bg-white/5 border border-white/10 rounded-2xl shadow-2xl flex-1 flex flex-col overflow-hidden min-h-[350px] relative backdrop-blur-xl">
            
            {/* Action panel editor options */}
            <div className="px-5 py-3.5 bg-black/40 border-b border-white/5 flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-green-500 shadow-[0_0_8px_#22c55e]" />
                <span className="text-xs font-bold uppercase tracking-wide text-white/80">Editor de Transcripción</span>
                {originalTextBeforeAI && (
                  <span className="text-[10px] bg-orange-500/10 text-orange-400 px-2.5 py-0.5 rounded-full border border-orange-500/20 font-bold">
                    Texto Modificado
                  </span>
                )}
              </div>

              {/* Utility operations (Copy, speak, reset, export) */}
              <div className="flex items-center gap-1.5 bg-black/20 p-1 rounded-xl">
                
                {/* Voice Speak TTS readback speaker triggers */}
                <button
                  type="button"
                  id="btn-play-speak-tts"
                  onClick={handleToggleTTS}
                  title={isPlayingTTS ? "Detener reproducción" : "Escuchar texto"}
                  className={`p-2 rounded-lg transition-colors cursor-pointer border ${
                    isPlayingTTS
                      ? "bg-rose-500/20 border-rose-500/30 text-rose-400"
                      : "bg-transparent border-transparent text-white/50 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <Volume2 className="w-4 h-4" />
                </button>

                {/* Copies code */}
                <button
                  type="button"
                  id="btn-copy-transcription-raw"
                  onClick={() => handleCopyToClipboard(editorText)}
                  title="Copiar texto"
                  className="p-2 text-white/50 hover:text-white hover:bg-white/5 rounded-lg transition-colors cursor-pointer"
                >
                  <Copy className="w-4 h-4" />
                </button>

                {/* Downloads text file */}
                <button
                  type="button"
                  id="btn-download-transcription-raw"
                  onClick={handleDownloadAsTxt}
                  title="Descargar nota de texto (.txt)"
                  className="p-2 text-white/50 hover:text-white hover:bg-white/5 rounded-lg transition-colors cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                </button>

                <div className="w-px h-4 bg-white/15 mx-1" />

                {/* Trash cleaner */}
                <button
                  type="button"
                  id="btn-clean-editor-all"
                  onClick={handleClearEditor}
                  title="Nuevo/Limpiar todo"
                  className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Editable Screen area workspace */}
            <div className="flex-1 p-6 flex flex-col relative bg-transparent min-h-[220px]">
              <textarea
                id="transcription-textarea-v3"
                value={editorText}
                onChange={handleEditorChange}
                placeholder="Las palabras dictadas o transcripciones aparecerán en esta pantalla inteligente. Pulsa directamente en cualquier sitio para corregir, estructurar o añadir anotaciones..."
                className="w-full flex-1 resize-none bg-transparent outline-none text-white/90 text-sm leading-relaxed placeholder-white/20 font-sans h-full focus:ring-0"
              />

              {/* Streaming Interim text words popup layer */}
              {isListening && interimTranscript && (
                <div className="absolute bottom-5 left-6 right-6 p-2.5 bg-black/60 border border-white/10 rounded-xl text-xs text-white/60 font-medium transition-all pointer-events-none animate-pulse flex items-center gap-2 backdrop-blur-md">
                  <span className="w-2 h-2 bg-orange-500 rounded-full shadow-[0_0_6px_#f97316]" />
                  <span className="font-bold text-orange-400 font-mono">En directo:</span>
                  <span className="italic">{interimTranscript}</span>
                </div>
              )}
            </div>

            {/* AI undo support */}
            {originalTextBeforeAI && (
              <div className="px-5 py-2.5 bg-white/[0.02] border-t border-white/5 flex items-center justify-between">
                <span className="text-[11px] text-white/40">¿Quieres deshacer las correcciones hechas por Gemini?</span>
                <button
                  type="button"
                  id="btn-undo-polishing"
                  onClick={handleRestoreOriginal}
                  className="text-[11px] font-bold text-orange-400 hover:text-orange-300 underline cursor-pointer"
                >
                  Restaurar Texto Original
                </button>
              </div>
            )}

            {/* Save record triggers drawer footer */}
            <div className="px-5 py-3 border-t border-white/5 flex justify-end bg-black/30">
              <button
                type="button"
                id="btn-save-record-history"
                onClick={handleSaveToHistory}
                disabled={!editorText.trim()}
                className="flex items-center gap-1.5 bg-white hover:bg-stone-100 font-bold disabled:bg-white/10 disabled:text-white/30 text-black text-xs py-2 px-5 rounded-xl shadow-lg cursor-pointer transition-colors"
              >
                <Bookmark className="w-3.5 h-3.5" />
                {selectedHistoryId ? "Actualizar Grabación" : "Guardar en Notas"}
              </button>
            </div>
          </div>

          {/* AI Advanced Action Tools Box bar */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-5 shadow-2xl relative overflow-hidden backdrop-blur-xl">
            <h4 className="text-xs font-bold uppercase tracking-widest text-white/70 mb-4 flex items-center gap-2">
              <Sparkles className="w-4.5 h-4.5 text-orange-400 fill-current" />
              Procesador Avanzado Inteligente (Gemini)
            </h4>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
              {/* Polish punctuation option */}
              <button
                type="button"
                id="widget-btn-polish"
                disabled={isProcessingAI || !editorText.trim()}
                onClick={() => processTextWithAI("polish")}
                className="flex flex-col items-start gap-1 pb-3 pt-3 px-3.5 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-orange-500/40 disabled:opacity-30 disabled:hover:bg-white/5 rounded-xl transition-all text-left cursor-pointer active:scale-[0.98]"
              >
                <div className="w-7 h-7 rounded-lg bg-orange-500/10 text-orange-400 flex items-center justify-center mb-1 border border-orange-500/20">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <span className="text-xs font-bold text-white leading-normal">Pulir Puntuación</span>
                <span className="text-[10px] text-white/40 leading-snug">Inserta mayúsculas, comas y corrige gramática</span>
              </button>

              {/* Bullet summaries option */}
              <button
                type="button"
                id="widget-btn-summarize"
                disabled={isProcessingAI || !editorText.trim()}
                onClick={() => processTextWithAI("summarize")}
                className="flex flex-col items-start gap-1 pb-3 pt-3 px-3.5 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-sky-500/40 disabled:opacity-30 disabled:hover:bg-white/5 rounded-xl transition-all text-left cursor-pointer active:scale-[0.98]"
              >
                <div className="w-7 h-7 rounded-lg bg-sky-500/10 text-sky-400 flex items-center justify-center mb-1 border border-sky-500/20">
                  <FileText className="w-3.5 h-3.5" />
                </div>
                <span className="text-xs font-bold text-white leading-normal">Estructurar Resumen</span>
                <span className="text-[10px] text-white/40 leading-snug">Sintetiza lo dictado en viñetas ordenadas</span>
              </button>

              {/* Professional Corporate formats option */}
              <button
                type="button"
                id="widget-btn-formalize"
                disabled={isProcessingAI || !editorText.trim()}
                onClick={() => processTextWithAI("formalize")}
                className="flex flex-col items-start gap-1 pb-3 pt-3 px-3.5 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-emerald-500/40 disabled:opacity-30 disabled:hover:bg-white/5 rounded-xl transition-all text-left cursor-pointer active:scale-[0.98]"
              >
                <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-1 border border-emerald-500/20">
                  <FileCheck className="w-3.5 h-3.5" />
                </div>
                <span className="text-xs font-bold text-white leading-normal">Formato Profesional</span>
                <span className="text-[10px] text-white/40 leading-snug">Adapta a un correo corporativo formal</span>
              </button>

              {/* Live Translator selects options */}
              <div className="flex flex-col gap-2 p-3 bg-white/5 border border-white/10 rounded-xl relative overflow-hidden">
                <div className="flex items-center justify-between gap-1">
                  <div className="flex items-center gap-1 text-xs font-bold text-white/80">
                    <Globe className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Traducir</span>
                  </div>
                  <button
                    type="button"
                    id="widget-btn-translate"
                    disabled={isProcessingAI || !editorText.trim()}
                    onClick={() => processTextWithAI("translate")}
                    className="text-[10px] bg-indigo-500 text-white hover:bg-indigo-600 disabled:opacity-30 disabled:hover:bg-indigo-500 font-bold py-1 px-2.5 rounded-lg transition-colors cursor-pointer"
                  >
                    Traducir
                  </button>
                </div>
                
                <select
                  id="translation-language-selector"
                  value={translateLang}
                  onChange={(e) => setTranslateLang(e.target.value)}
                  className="bg-black/40 border border-white/10 text-[11px] p-1.5 rounded-lg outline-none text-white/80 cursor-pointer"
                >
                  <option value="inglés" className="bg-stone-900">🇺🇸 Inglés</option>
                  <option value="francés" className="bg-stone-900">🇫🇷 Francés</option>
                  <option value="alemán" className="bg-stone-900">🇩🇪 Alemán</option>
                  <option value="italiano" className="bg-stone-900">🇮🇹 Italiano</option>
                  <option value="portugués" className="bg-stone-900">🇧🇷 Portugués</option>
                  <option value="custom" className="bg-stone-900">Otro idioma...</option>
                </select>

                {translateLang === "custom" && (
                  <input
                    type="text"
                    id="translation-custom-input"
                    value={customTranslateLang}
                    onChange={(e) => setCustomTranslateLang(e.target.value)}
                    placeholder="Ej. Japonés"
                    className="bg-black/40 border border-white/10 p-1.5 rounded-lg text-[10px] outline-none text-white"
                  />
                )}
              </div>
            </div>

            {/* Processing state indicator overlay */}
            {isProcessingAI && (
              <div className="mt-4 p-3 bg-orange-600/15 border border-orange-500/20 rounded-xl flex items-center justify-center gap-3">
                <RefreshCw className="w-4 h-4 text-orange-400 animate-spin" />
                <span className="text-xs text-orange-300 font-medium">Gemini AI puliendo y adaptando el texto...</span>
              </div>
            )}
          </div>

        </div>

        {/* Right Side Section: Recordings History Feed & Instructions */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          
          {/* History records pane list items */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-5 shadow-2xl flex-1 flex flex-col min-h-[400px] backdrop-blur-xl">
            <h3 className="text-sm font-bold uppercase tracking-widest text-white/80 mb-4 flex items-center gap-2">
              <History className="w-4 h-4 text-white/50" />
              Tus Notas Dictadas ({history.length})
            </h3>

            {/* Filter records lists */}
            <div className="relative mb-4">
              <input
                type="text"
                id="search-input-notes-history"
                placeholder="Buscar en grabaciones..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-black/40 border border-white/15 focus:border-white/30 text-xs py-2 pl-3.5 pr-8 rounded-xl outline-none transition-colors text-white placeholder-white/20"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Feed area */}
            <div className="flex-1 overflow-y-auto space-y-2.5 max-h-[460px] pr-1">
              {filteredHistory.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-6 bg-black/20 rounded-xl border border-dashed border-white/10 my-auto">
                  <Bookmark className="w-7 h-7 text-white/20 mb-2" />
                  <p className="text-xs font-semibold text-white/60">Biblioteca vacía</p>
                  <p className="text-[10px] text-white/40 max-w-[180px] mt-1 leading-normal">
                    Dicta o guarda notas en el editor para visualizarlas aquí.
                  </p>
                </div>
              ) : (
                filteredHistory.map((item) => {
                  const isSelected = selectedHistoryId === item.id;
                  return (
                    <div
                      key={item.id}
                      onClick={() => handleLoadHistoryRecord(item)}
                      className={`group p-3 border rounded-xl text-left cursor-pointer transition-all ${
                        isSelected
                          ? "bg-white text-black border-white shadow-xl"
                          : "bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/10"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className="text-xs font-bold line-clamp-1 leading-none flex-1">
                          {item.title}
                        </span>
                        
                        {/* Copy + delete quick commands inside item */}
                        <div className="flex items-center gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCopyToClipboard(item.text);
                            }}
                            title="Copiar texto"
                            className={`p-1 rounded-md transition-colors ${
                              isSelected ? "hover:bg-stone-200 text-black" : "hover:bg-white/10 text-white/60"
                            }`}
                          >
                            <Copy className="w-3 h-3" />
                          </button>
                          
                          <button
                            type="button"
                            onClick={(e) => handleDeleteHistoryRecord(item.id, e)}
                            title="Eliminar"
                            className={`p-1 rounded-md transition-colors ${
                              isSelected ? "hover:bg-red-100 text-red-600" : "hover:bg-red-500/10 text-red-400"
                            }`}
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>

                      <p
                        className={`text-[11px] line-clamp-2 mt-1.5 leading-snug ${
                          isSelected ? "text-stone-700" : "text-white/60"
                        }`}
                      >
                        {item.text}
                      </p>

                      {/* Small metadata bar info */}
                      <div className="flex items-center justify-between mt-3 pt-2 border-t border-dashed border-white/5 text-[10px]">
                        <span className={isSelected ? "text-stone-500" : "text-white/40"}>
                          {item.timestamp}
                        </span>
                        
                        <div className="flex items-center gap-1.5">
                          {item.isAIPolished && (
                            <span className="inline-flex items-center gap-0.5 bg-orange-500/10 text-orange-400 px-1.5 py-0.5 rounded text-[9px] font-bold">
                              IA ✨
                            </span>
                          )}
                          <span className={isSelected ? "text-stone-500" : "text-white/40"}>
                            {item.language}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Quick instructions and manuals */}
          <div className="bg-white/5 rounded-2xl border border-white/10 p-4 leading-relaxed text-white/60 text-[11px] backdrop-blur-xl">
            <h4 className="font-bold flex items-center gap-1.5 text-white/95 text-xs mb-2">
              <HelpCircle className="w-3.5 h-3.5 text-orange-400" />
              ¿Cómo dictar con éxito?
            </h4>
            <ol className="list-decimal pl-4.5 space-y-1.5 text-white/60">
              <li>Pulsa <strong>Dictado Directo</strong> para transcribir tu discurso hablado en tiempo real usando tu propio navegador.</li>
              <li>Sube o graba notas de voz en <strong>Subir o Grabar Audio</strong> para que Gemini detecte y transcriba de manera óptima.</li>
              <li>Utiliza el <strong>Procesador Avanzado Inteligente</strong> para insertar comas, resumir o traducir.</li>
              <li>Almacena tus mejores notas en tu biblioteca para recordarlas y reproducir su lectura mecánica.</li>
            </ol>
          </div>

        </div>
      </main>

      {/* Floating telemetry widget (Bottom Right) to increase immersive theme context */}
      <div className="fixed bottom-6 right-6 z-30 hidden md:block">
        <div className="px-4 py-3 bg-black/60 border border-white/10 rounded-2xl backdrop-blur-md flex items-center gap-4 shadow-2xl">
          <div className="flex flex-col items-end">
            <span className="text-[9px] text-white/40 uppercase font-bold tracking-widest">Nivel de Ruido</span>
            <span className="text-xs font-mono text-orange-400">{noiseLevel} dB</span>
          </div>
          <div className="w-px h-6 bg-white/10" />
          <div className="flex flex-col items-end">
            <span className="text-[9px] text-white/40 uppercase font-bold tracking-widest">Latencia</span>
            <span className="text-xs font-mono text-white/80">{latency}ms</span>
          </div>
        </div>
      </div>

      {/* Elegant minimalist footer */}
      <footer className="py-4.5 border-t border-white/5 bg-black/20 text-center text-[10px] text-white/40 px-6 mt-6 z-10 relative">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2.5">
          <span>VoxScribe © {new Date().getFullYear()}</span>
          <div className="flex items-center gap-3">
            <span>Servicio de transcripción por Gemini 3.5 Flash en español</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
