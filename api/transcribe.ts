import { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenAI } from '@google/genai';
import busboy from 'busboy';

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Parse multipart form data
    const bb = busboy({ headers: req.headers });
    let audioBuffer: Buffer | null = null;
    let language = 'es-ES';

    await new Promise((resolve, reject) => {
      bb.on('file', (fieldname, file, info) => {
        if (fieldname === 'audio') {
          const chunks: Buffer[] = [];
          file.on('data', (data) => {
            chunks.push(data);
          });
          file.on('end', () => {
            audioBuffer = Buffer.concat(chunks);
          });
        }
      });

      bb.on('field', (fieldname, val) => {
        if (fieldname === 'language') {
          language = val;
        }
      });

      bb.on('close', resolve);
      bb.on('error', reject);

      req.pipe(bb);
    });

    if (!audioBuffer) {
      return res.status(400).json({ error: 'Se requiere un archivo de audio.' });
    }

    // Convert to base64
    const audioBase64 = audioBuffer.toString('base64');

    const audioPart = {
      inlineData: {
        mimeType: 'audio/wav',
        data: audioBase64,
      },
    };

    const textPart = {
      text: 'Transcribe literalmente y con máxima precisión el discurso contenido en este audio. Detecta el idioma y genera la transcripción en su idioma nativo original. Devuelve única y exclusivamente la transcripción exacta sin preámbulos, notas de autor o comentarios explicativos.',
    };

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: { parts: [audioPart, textPart] },
    });

    res.status(200).json({ transcript: response.text });
  } catch (error: any) {
    console.error('Error en la transcripción:', error);
    res.status(500).json({ error: 'No se pudo transcribir el audio. Intenta de nuevo.' });
  }
}
