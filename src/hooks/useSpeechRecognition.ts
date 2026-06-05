import { useState, useEffect, useRef } from "react";

export function useSpeechRecognition() {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [interimTranscript, setInterimTranscript] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSupported, setIsSupported] = useState(false);

  const recognitionRef = useRef<any>(null);
  const isManuallyListeningRef = useRef(false);

  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (SpeechRecognition) {
      setIsSupported(true);
      const rec = new SpeechRecognition();
      rec.continuous = true;
      rec.interimResults = true;
      rec.lang = "es-ES";

      rec.onstart = () => {
        setIsListening(true);
        setError(null);
      };

      rec.onresult = (event: any) => {
        let finalResult = "";
        let interimResult = "";

        for (let i = 0; i < event.results.length; ++i) {
          const text = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalResult += text;
          } else {
            interimResult += text;
          }
        }

        // Only set transcript if there's final text
        if (finalResult) {
          setTranscript(finalResult);
        }
        setInterimTranscript(interimResult);
      };

      rec.onerror = (event: any) => {
        console.error("Speech recognition error:", event.error);
        if (event.error === "not-allowed") {
          setError("Acceso al micrófono denegado. Permite el acceso e intenta de nuevo.");
        } else if (event.error === "no-speech") {
          // No-speech can occur if silent for too long, we don't necessarily want to halt.
        } else {
          setError(`Error de dictado: ${event.error}`);
        }
      };

      rec.onend = () => {
        setIsListening(false);
        setInterimTranscript("");
        // Auto-restart if we are supposed to be manually listening (handles silent timeout disconnects)
        if (isManuallyListeningRef.current) {
          try {
            rec.start();
            setIsListening(true);
          } catch (e) {
            console.error("Failed to restart speech recognition:", e);
          }
        }
      };

      recognitionRef.current = rec;
    } else {
      setIsSupported(false);
    }

    return () => {
      if (recognitionRef.current) {
        isManuallyListeningRef.current = false;
        recognitionRef.current.abort();
      }
    };
  }, []);

  const startListening = (langCode: string = "es-ES") => {
    if (!isSupported || !recognitionRef.current) return;
    setError(null);
    isManuallyListeningRef.current = true;
    recognitionRef.current.lang = langCode;
    try {
      setTranscript("");
      setInterimTranscript("");
      recognitionRef.current.start();
    } catch (e) {
      console.error("Speech start error:", e);
      // If already started, just ignore or re-sync
    }
  };

  const stopListening = () => {
    isManuallyListeningRef.current = false;
    if (!recognitionRef.current) return;
    try {
      recognitionRef.current.stop();
    } catch (e) {
      console.error("Speech stop error:", e);
    }
    setIsListening(false);
    setInterimTranscript("");
  };

  const resetTranscript = () => {
    setTranscript("");
    setInterimTranscript("");
  };

  return {
    isListening,
    transcript,
    setTranscript,
    interimTranscript,
    error,
    isSupported,
    startListening,
    stopListening,
    resetTranscript,
  };
}
export default useSpeechRecognition;
