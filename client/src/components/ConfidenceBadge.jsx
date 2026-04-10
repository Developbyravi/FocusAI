import React from 'react';

const CFG = {
  high:    { color: '#34d399', bg: 'rgba(52,211,153,0.08)',   border: 'rgba(52,211,153,0.2)',   icon: '●', title: 'Full Transcript',    bar: '#34d399' },
  medium:  { color: '#fbbf24', bg: 'rgba(251,191,36,0.08)',   border: 'rgba(251,191,36,0.2)',   icon: '◐', title: 'Auto Captions',      bar: '#fbbf24' },
  low:     { color: '#fb923c', bg: 'rgba(251,146,60,0.08)',   border: 'rgba(251,146,60,0.2)',   icon: '◔', title: 'Limited Data',       bar: '#fb923c' },
  minimal: { color: '#f87171', bg: 'rgba(248,113,113,0.08)',  border: 'rgba(248,113,113,0.2)',  icon: '○', title: 'Keywords Only',      bar: '#f87171' },
};

export default function ConfidenceBadge({ level, score, label, fallbackMessage }) {
  if (!level) return null;
  const c = CFG[level] || CFG.high;

  return (
    <div className="rounded-xl p-3" style={{ background: c.bg, border: `1px solid ${c.border}` }}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold" style={{ color: c.color }}>{c.icon}</span>
          <span className="text-xs font-semibold text-white">Data Quality: {c.title}</span>
        </div>
        <span className="text-xs font-bold" style={{ color: c.color }}>{score}%</span>
      </div>

      <div className="h-1 rounded-full overflow-hidden mb-2" style={{ background: 'rgba(255,255,255,0.06)' }}>
        <div className="h-full rounded-full transition-all duration-1000"
          style={{ width: `${score}%`, background: c.bar }}/>
      </div>

      <p className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>{label}</p>

      {fallbackMessage && (
        <div className="mt-2 flex items-start gap-1.5 text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>
          <span className="flex-shrink-0">⚠️</span>
          <span>{fallbackMessage}</span>
        </div>
      )}
    </div>
  );
}
