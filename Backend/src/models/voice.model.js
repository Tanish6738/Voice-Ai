import mongoose from 'mongoose';

const VoiceSchema = new mongoose.Schema(
	{
		text: { type: String, required: true, trim: true },
		voiceName: { type: String, required: true },
		// Store raw audio as Buffer for efficient retrieval
		audio: { data: Buffer, contentType: { type: String, default: 'audio/wav' } },
		// Optionally keep base64 for quick JSON responses (can be disabled to save space)
		audioBase64: { type: String },
		durationSeconds: { type: Number },
	},
	{ timestamps: true }
);

VoiceSchema.methods.toJSON = function () {
	const obj = this.toObject({ versionKey: false });
	// Do not send raw binary buffer in default JSON
	if (obj.audio) delete obj.audio;
	return obj;
};

const Voice = mongoose.model('Voice', VoiceSchema);
export default Voice;
