import { GoogleGenAI } from "@google/genai";
import { config } from "dotenv";

config();

// Build a minimal WAV container for 16-bit PCM mono data
function pcmToWav(pcmBuffer, { channels = 1, sampleRate = 24000, bitsPerSample = 16 } = {}) {
   const byteRate = sampleRate * channels * bitsPerSample / 8;
   const blockAlign = channels * bitsPerSample / 8;
   const dataSize = pcmBuffer.length;
   const buffer = Buffer.alloc(44 + dataSize);

   let offset = 0;
   buffer.write('RIFF', offset); offset += 4;
   buffer.writeUInt32LE(36 + dataSize, offset); offset += 4; // file size - 8
   buffer.write('WAVE', offset); offset += 4;
   buffer.write('fmt ', offset); offset += 4;
   buffer.writeUInt32LE(16, offset); offset += 4; // Subchunk1Size (PCM)
   buffer.writeUInt16LE(1, offset); offset += 2; // AudioFormat (PCM = 1)
   buffer.writeUInt16LE(channels, offset); offset += 2;
   buffer.writeUInt32LE(sampleRate, offset); offset += 4;
   buffer.writeUInt32LE(byteRate, offset); offset += 4;
   buffer.writeUInt16LE(blockAlign, offset); offset += 2;
   buffer.writeUInt16LE(bitsPerSample, offset); offset += 2;
   buffer.write('data', offset); offset += 4;
   buffer.writeUInt32LE(dataSize, offset); offset += 4;
   pcmBuffer.copy(buffer, offset);
   return buffer;
}

// Generate TTS audio for given text and voice. Returns base64 WAV data built from raw PCM if needed.
export async function generateVoice({ text, voiceName = 'Kore' }) {
   if (!process.env.GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY not set in environment');
   }
   if (!text || !text.trim()) {
      throw new Error('Text is required');
   }

   const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

   const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text }] }],
      config: {
         responseModalities: ['AUDIO'],
         speechConfig: {
            voiceConfig: {
               prebuiltVoiceConfig: { voiceName },
            },
         },
      },
   });

   const part = response.candidates?.[0]?.content?.parts?.[0];
   const inline = part?.inlineData;
   const data = inline?.data;
   if (!data) throw new Error('No audio data returned from model');

   const originalMime = inline?.mimeType || 'audio/pcm';
   const rawPcm = Buffer.from(data, 'base64');

   // If already wav we can keep; otherwise wrap raw PCM into wav container
   let wavBuffer;
   if (originalMime.includes('wav')) {
      wavBuffer = rawPcm; // assume container already present
   } else {
      wavBuffer = pcmToWav(rawPcm); // default mono 24kHz 16-bit
   }

   const audioBase64 = wavBuffer.toString('base64');
   const durationSeconds = rawPcm.length / 2 / 24000; // 2 bytes per sample

   return {
      audioBase64,
      mimeType: 'audio/wav',
      voiceName,
      durationSeconds,
      originalMimeType: originalMime,
   };
}

export default { generateVoice };