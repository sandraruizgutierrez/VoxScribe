import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import { createServer as createViteServer } from "vite";

dotenv.config();

const app = express();
const PORT = 3000;

// Increase limit to allow audio uploads up to 10MB
app.use(express.json({ limit: "15mb" }));
app.use(express.urlencoded({ limit: "15mb", extended: true }));

// Initialize Gemini SDK with User-Agent header as per guidelines
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build",
    },
  },
});

// Endpoint for processing transcribed text with AI
app.post("/api/ai/process", async (req, res) => {
  const { text, action, targetLanguage } = req.body;

  if (!text || typeof text !== "string") {
    return res.status(400).json({ error: "Se requiere un texto válido." });
  }

  try {
    let systemInstruction = "";
    let prompt = "";

    switch (action) {
      case "polish":
        systemInstruction = "Eres un redactor experto y corrector de textos en español.";
        prompt = `Toma el siguiente texto dictado (que puede no tener puntuación correcta, mayúsculas, comas o puntos) y corrígelo minuciosamente. Devuelve el texto perfectamente redactado, con correcta gramática, puntuación y ortografía en español. Mantén el tono original y no agregues comentarios de lo que arreglaste ni introducciones.
Texto original: "${text}"`;
        break;
      case "summarize":
        systemInstruction = "Eres un asistente de productividad experto en sintetizar ideas de forma clara y organizada.";
        prompt = `Sintetiza las ideas del siguiente texto dictado en un resumen elegante, profesional y estructurado con viñetas claras (puntos clave). Hazlo en español.
Texto: "${text}"`;
        break;
      case "formalize":
        systemInstruction = "Eres un redactor profesional experto en comunicación corporativa y formal.";
        prompt = `Reescribe el siguiente texto dictado de forma improvisada para transformarlo en un correo electrónico o nota profesional, formal, pulida y educada en español. Mantén la esencia de las ideas pero usa un vocabulario profesional. Agrega un asunto formal sugerido al principio. No incluyes explicaciones adicionales de lo que modificaste.
Texto original: "${text}"`;
        break;
      case "translate":
        const lang = targetLanguage || "inglés";
        systemInstruction = `Eres un traductor experto bilingüe con alta fluidez y adaptabilidad cultural.`;
        prompt = `Traduce de manera natural y precisa el siguiente texto dictado al idioma: ${lang}. Devuelve única y exclusivamente la traducción adaptada, sin textos explicativos ni introducciones.
Texto: "${text}"`;
        break;
      default:
        systemInstruction = "Eres un asistente de redacción útil.";
        prompt = `Mejora y dale una estructura limpia al siguiente texto: "${text}"`;
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction,
        temperature: 0.3,
      },
    });

    res.json({ processedText: response.text });
  } catch (error: any) {
    console.error("Error al procesar texto con Gemini:", error);
    res.status(500).json({ error: "Error interno al procesar el texto con Inteligencia Artificial." });
  }
});

// Endpoint for transcribing audio file via Gemini multimodal
app.post("/api/ai/transcribe-file", async (req, res) => {
  const { audioBase64, mimeType } = req.body;

  if (!audioBase64 || !mimeType) {
    return res.status(400).json({ error: "Se requiere audio en base64 y el tipo MIME." });
  }

  try {
    const audioPart = {
      inlineData: {
        mimeType: mimeType, // type of audio e.g., 'audio/webm', 'audio/wav', 'audio/ogg'
        data: audioBase64,
      },
    };

    const textPart = {
      text: "Transcribe literalmente y con máxima precisión el discurso contenido en este audio. Detecta el idioma y genera la transcripción en su idioma nativo original. Devuelve única y exclusivamente la transcripción exacta sin preámbulos, notas de autor o comentarios explicativos.",
    };

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: { parts: [audioPart, textPart] },
    });

    res.json({ transcription: response.text });
  } catch (error: any) {
    console.error("Error en la transcripción multimodal:", error);
    res.status(500).json({ error: "No se pudo transcribir el audio. Verifica que sea un formato de audio soportado (webm, wav, ogg, mp3, m4a)." });
  }
});

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", time: new Date() });
});

// Configure Vite or Serve static built assets
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
