const express = require("express");
const path = require("path");
const multer = require("multer");
require("dotenv").config();
const { GoogleGenAI } = require("@google/genai");

const app = express();

// Middleware
app.use(express.json({ limit: "15mb" }));
app.use(express.urlencoded({ limit: "15mb", extended: true }));

const upload = multer({ storage: multer.memoryStorage() });

// Initialize Gemini SDK
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build",
    },
  },
});

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", time: new Date() });
});

// Transcribe endpoint for Chrome extension
app.post("/api/transcribe", upload.single("audio"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "Se requiere un archivo de audio." });
  }

  try {
    // Convert buffer to base64
    const audioBase64 = req.file.buffer.toString("base64");

    const audioPart = {
      inlineData: {
        mimeType: req.file.mimetype || "audio/wav",
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

    res.json({ transcript: response.text });
  } catch (error) {
    console.error("Error en la transcripción:", error);
    res.status(500).json({ error: "No se pudo transcribir el audio. Intenta de nuevo." });
  }
});

// Serve static files from dist
const distPath = path.join(__dirname, "dist");
app.use(express.static(distPath));

// Fallback to index.html for SPA
app.get("*", (req, res) => {
  if (!req.path.startsWith("/api")) {
    res.sendFile(path.join(distPath, "index.html"));
  } else {
    res.status(404).json({ error: "Endpoint not found" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
