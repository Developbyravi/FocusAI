import React, { useState } from 'react';

function detectType(input) {
  if (/youtube\.com|youtu\.be/.test(input)) return { label: 'YouTube Video', icon: '🎬', color: '#f87171' };
  if (/^https?:\/\//.test(input))           return { label: 'Article / Web Page', icon: '📰', color: '#60a5fa' };
  if (input.length > 10)                    return { label: 'Plain Text', icon: '📝', color: '#34d399' };
  return null;
}

const EXAMPLES = [
  { label: 'YouTube', icon: '🎬', value: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
  { label: 'Article',  icon: '📰', value: 'https://medium.com/some-article' },
  { label: 'Text',     icon: '📝', value: 'Paste any text content here to analyze...' },
];

export default function InputPanel({ onAnalyze, loading, error, goal }) {
  const [input, setInput] = useState('');
  const detected = input.trim() ? detectType(input.trim()) : null;

  return (
    <div className="min-h-[72vh] flex items-center justify-center px-2">
      <div className="w-full max-w-2xl fade-in-up">

        {/* Goal reminder */}
        <div className="flex items-center gap-2.5 mb-5 px-4 py-2.5 rounded-2xl"
          style={{ background: 'rgba(99,102,241,0.07)', border: '1px solid rgba(99,102,241,0.15)' }}>
          <span className="text-base">🎯</span>
          <span className="text-slate-400 text-sm">Goal:</span>
          <span className="text-white text-sm font-semibold">{goal}</span>
        </div>

        <div className="card p-6">
          <h2 className="text-xl font-bold text-white mb-1">Analyze Content</h2>
          <p className="text-slate-500 text-sm mb-5">
            Paste a YouTube URL, article link, or any text to get an AI-powered analysis.
          </p>

          {/* Textarea */}
          <div className="relative mb-3">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Paste YouTube URL, article link, or text here…"
              rows={5}
              className="input-field w-full px-4 py-3 text-sm resize-none"
            />
            {detected && (
              <div className="absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium"
                style={{ background: 'rgba(13,17,23,0.9)', color: detected.color, border: `1px solid ${detected.color}30` }}>
                <span>{detected.icon}</span>
                <span>{detected.label}</span>
              </div>
            )}
          </div>

          {/* Quick examples */}
          <div className="flex flex-wrap items-center gap-2 mb-5">
            <span className="text-slate-600 text-xs">Try:</span>
            {EXAMPLES.map((ex) => (
              <button key={ex.label} onClick={() => setInput(ex.value)}
                className="btn-secondary px-3 py-1 text-xs">
                {ex.icon} {ex.label}
              </button>
            ))}
          </div>

          {/* Error */}
          {error && (
            <div className="mb-4 px-4 py-3 rounded-xl text-sm flex items-start gap-2"
              style={{ background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.2)', color: '#fca5a5' }}>
              <span className="flex-shrink-0 mt-0.5">⚠️</span>
              <span>{error}</span>
            </div>
          )}

          <button
            onClick={() => onAnalyze(input)}
            disabled={!input.trim() || loading}
            className="btn-primary w-full py-3.5 text-base flex items-center justify-center gap-3"
          >
            {loading ? (
              <>
                <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                </svg>
                Analyzing with AI…
              </>
            ) : '🧠 Analyze Content'}
          </button>
        </div>
      </div>
    </div>
  );
}
