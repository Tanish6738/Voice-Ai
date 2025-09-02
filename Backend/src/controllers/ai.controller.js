import { generateVoice } from "../Services/ai.service.js";
import path from 'path';
import fs from 'fs';

export const textToSpeech = async (req, res) => {
	try {
		const { text, voiceName } = req.body;
		const result = await generateVoice({ text, voiceName });
		const audioBuffer = Buffer.from(result.audioBase64, 'base64');

		const uploadsDir = path.join(process.cwd(), 'uploads', 'voices');
		if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });
		const timestamp = Date.now();
		const safeVoice = (voiceName || 'voice').replace(/[^a-z0-9_-]/gi, '_');
		const filename = `${timestamp}-${safeVoice}.wav`;
		const filePath = path.join(uploadsDir, filename);
		fs.writeFileSync(filePath, audioBuffer);
		const publicUrl = `/uploads/voices/${filename}`;

		res.json({ success: true, file: publicUrl, filename, ...result });
	} catch (err) {
		res.status(400).json({ success: false, message: err.message });
	}
};

// Return metadata (without raw audio buffer) for a stored voice
// Removed DB-related endpoints when using filesystem storage.

export default { textToSpeech};
