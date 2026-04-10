import React, { useState } from 'react';

const TABS = [
  { id: 'summary',    label: 'Summary',     icon: '📋' },
  { id: 'insights',   label: 'Key Insights', icon: '💡' },
  { id: 'compressed', label: 'Quick Take',   icon: '⚡' },
];

const INSIGHT_COLORS = ['#818cf8','#34d399','#fbbf24','#f472b6','#60a5fa'];

export default function SummaryPanel({ analysis }) {
  const [tab, setTab] = useState('summary');

  return (
    <div className="card p-5 fade-in-up flex flex-col">

      {/* Tab bar */}
      <div className="flex gap-1 mb-5 p-1 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)' }}>
        {TABS.map((t) => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-medium transition-all"
            style={tab === t.id
              ? { background: 'rgba(99,102,241,0.2)', color: '#a5b4fc', border: '1px solid rgba(99,102,241,0.3)' }
              : { color: '#64748b' }}>
            <span>{t.icon}</span>
            <span className="hidden sm:inline">{t.label}</span>
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1">
        {tab === 'summary' && (
          <div className="fade-in">
            <p className="text-slate-300 text-sm leading-relaxed">{analysis.summary}</p>
            {(analysis.timeToConsume || analysis.focusScore) && (
              <div className="flex items-center gap-4 mt-4 pt-4"
                style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                {analysis.timeToConsume && (
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs">⏱️</span>
                    <span className="text-xs text-slate-500">{analysis.timeToConsume} min read</span>
                  </div>
                )}
                {analysis.focusScore && (
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs">🎯</span>
                    <span className="text-xs text-slate-500">Focus score: {analysis.focusScore}/100</span>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {tab === 'insights' && (
          <ul className="space-y-3 fade-in">
            {(analysis.keyInsights || []).map((insight, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5"
                  style={{ background: `${INSIGHT_COLORS[i % INSIGHT_COLORS.length]}18`, color: INSIGHT_COLORS[i % INSIGHT_COLORS.length] }}>
                  {i + 1}
                </span>
                <span className="text-slate-300 text-sm leading-relaxed">{insight}</span>
              </li>
            ))}
          </ul>
        )}

        {tab === 'compressed' && (
          <div className="fade-in">
            <div className="p-4 rounded-xl" style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.08), rgba(124,58,237,0.08))', border: '1px solid rgba(99,102,241,0.15)' }}>
              <p className="text-white text-sm leading-relaxed font-medium">{analysis.compressedEssentials}</p>
            </div>
            <p className="text-slate-600 text-xs mt-3 flex items-center gap-1.5">
              <span>⚡</span> Smart compression — only the essentials
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
