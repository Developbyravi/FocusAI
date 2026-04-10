import React, { useState } from 'react';
import { sendFeedback } from '../api/focusApi';

const REACTIONS = [
  { value: 'yes',     emoji: '👍', label: 'Yes, very helpful!',  color: '#34d399', bg: 'rgba(52,211,153,0.1)',  border: 'rgba(52,211,153,0.3)'  },
  { value: 'neutral', emoji: '😐', label: 'Somewhat useful',     color: '#fbbf24', bg: 'rgba(251,191,36,0.1)',  border: 'rgba(251,191,36,0.3)'  },
  { value: 'no',      emoji: '👎', label: 'Not really',          color: '#f87171', bg: 'rgba(248,113,113,0.1)', border: 'rgba(248,113,113,0.3)' },
];

export default function FeedbackPanel({ title, onAnalyzeNew }) {
  const [reaction, setReaction] = useState(null);
  const [learned, setLearned] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async () => {
    try { await sendFeedback({ title, useful: reaction === 'yes', reaction, learned }); }
    catch { /* ignore */ }
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="card p-5 text-center fade-in-up">
        <div className="text-4xl mb-3">🎉</div>
        <h3 className="text-white font-bold mb-1">Thanks for the feedback!</h3>
        <p className="text-slate-500 text-sm mb-5">FocusAI uses this to improve your future recommendations.</p>
        <button onClick={onAnalyzeNew} className="btn-primary w-full py-2.5 text-sm">
          Analyze Another →
        </button>
      </div>
    );
  }

  return (
    <div className="card p-5 fade-in-up">
      <p className="section-label mb-1">Outcome Tracker</p>
      <h3 className="text-white font-bold mb-1">Did this help you learn?</h3>
      <p className="text-slate-500 text-xs mb-4">Your feedback trains FocusAI to serve you better</p>

      {/* Emoji reactions */}
      <div className="flex gap-2 mb-4">
        {REACTIONS.map((r) => {
          const isSelected = reaction === r.value;
          return (
            <button key={r.value} onClick={() => setReaction(r.value)}
              className="flex-1 flex flex-col items-center gap-1.5 py-3 rounded-2xl transition-all"
              style={{
                background: isSelected ? r.bg : 'rgba(255,255,255,0.02)',
                border: `1px solid ${isSelected ? r.border : 'rgba(255,255,255,0.06)'}`,
                transform: isSelected ? 'scale(1.04)' : 'scale(1)',
              }}>
              <span className="text-2xl">{r.emoji}</span>
              <span className="text-xs font-medium" style={{ color: isSelected ? r.color : '#64748b' }}>
                {r.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* What did you learn */}
      <textarea value={learned} onChange={(e) => setLearned(e.target.value)}
        placeholder="What was your key takeaway? (optional)"
        rows={2}
        className="input-field w-full px-3 py-2 text-sm resize-none mb-4"/>

      <div className="flex gap-2">
        <button onClick={handleSubmit} disabled={!reaction}
          className="btn-primary flex-1 py-2.5 text-sm">
          Submit
        </button>
        <button onClick={onAnalyzeNew}
          className="btn-secondary flex-1 py-2.5 text-sm">
          Analyze Another →
        </button>
      </div>
    </div>
  );
}
