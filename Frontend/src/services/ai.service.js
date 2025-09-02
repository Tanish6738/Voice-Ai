import api from "../config/axios.js";

// Placeholder chat (not implemented server side yet)
export const getAIResponse = async (prompt) => {
  const response = await api.post("/ai/chat", { prompt });
  return response.data;
};

// Text to Speech using backend endpoint. Returns an object with audioUrl, base64, voiceName.
export const textToSpeech = async ({ text, voiceName }) => {
  const response = await api.post("/ai/tts", { text, voiceName });
  if (!response.data?.success) throw new Error(response.data?.message || 'TTS failed');
  const { file, voiceName: returnedVoice, mimeType } = response.data;
  const fileUrl = api.defaults.baseURL.replace(/\/api$/, '') + file; // ensure base path
  return { audioUrl: fileUrl, file: fileUrl, voiceName: returnedVoice, mimeType };
};

export default { getAIResponse, textToSpeech };
