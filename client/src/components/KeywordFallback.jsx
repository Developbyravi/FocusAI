import React, { useState } from 'react';
import { analyzeWithKeywords } from '../api/focusApi';

export default function KeywordFallback({ videoId, goal, onResult }) {
  const [keywords, setKeywords] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (!keywords.trim()) return;
    setLoading(true);
    setError('');
    try {
      const data = await analyzeWithKeywords(videoId, keywords.trim(), goal);
      onResult(data.analysis);
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass rounded-2xl p-6 border border-red-500/20 fade-in-up">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center text-xl">
          🔴
        </div>
        <div>
          <h3 className="text-white font-bold">No Content Found</h3>
          <p className="text-slate-400 text-xs">Transcript, captions, and metadata all unavailable</p>
        </div>
      </div>

      <p className="text-slate-300 text-sm mb-4">
        Help FocusAI analyze this video by entering keywords or a brief description of the topic:
      </p>

      <textarea
        value={keywords}
        onChange={(e) => setKeywords(e.target.value)}
        placeholder="e.g. React hooks tutorial, useState useEffect, beginner JavaScript..."
        rows={3}
        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-indigo-500 resize-none mb-3"
      />

      {error && (
        <p className="text-red-400 text-xs mb-3">⚠️ {error}</p>
      )}

      <button
        onClick={handleSubmit}
        disabled={!keywords.trim() || loading}
        className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium disabled:opacity-40 transition-all flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Analyzing with keywords...
          </>
        ) : (
          '🧠 Analyze with My Keywords'
        )}
      </button>
    </div>
  );
}
