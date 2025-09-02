import React, { useState } from "react";
import { textToSpeech } from "../services/ai.service.js";

const Home = () => {
  const [text, setText] = useState("Say cheerfully: Have a wonderful day!");
  const [voiceName, setVoiceName] = useState("Kore");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);
  // File-based approach (no DB)

  const handleGenerate = async () => {
    setError(null);
    setLoading(true);
    setAudioUrl(null);
    try {
  const { audioUrl } = await textToSpeech({ text, voiceName });
  setAudioUrl(audioUrl);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white shadow-lg rounded-2xl p-8 border border-gray-100">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          Text to Speech
        </h1>

        {/* Text Input */}
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Text
        </label>
        <textarea
          rows={5}
          className="w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 p-3 text-gray-800 shadow-sm"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        {/* Voice Selector */}
        <label className="block text-sm font-medium text-gray-700 mt-6 mb-2">
          Voice
        </label>
        <select
          className="w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 p-3 text-gray-800 shadow-sm"
          value={voiceName}
          onChange={(e) => setVoiceName(e.target.value)}
        >
          <option value="Kore">Kore</option>
          <option value="Aoede">Aoede</option>
          <option value="Charon">Charon</option>
          <option value="Fenrir">Fenrir</option>
        </select>

        {/* Generate Button */}
        <div className="mt-6">
          <button
            disabled={loading}
            onClick={handleGenerate}
            className={`w-full py-3 px-6 rounded-lg text-white font-semibold shadow-md transition ${
              loading
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? "Generating..." : "Generate Voice"}
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <p className="text-red-500 text-sm font-medium mt-4">{error}</p>
        )}

        {/* Audio Preview */}
        {audioUrl && (
          <div className="mt-8 border-t pt-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              Preview
            </h3>
            <audio
              controls
              src={audioUrl}
              className="w-full rounded-lg border border-gray-200 shadow-sm"
            />
            <div className="mt-4 text-sm text-gray-600 space-y-1">
              <div>File URL: <a className="text-blue-600 underline" href={audioUrl} target="_blank" rel="noreferrer">Open file</a></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
