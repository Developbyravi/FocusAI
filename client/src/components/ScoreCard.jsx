import React from 'react';
import ConfidenceBadge from './ConfidenceBadge';

const CLS_CONFIG = {
  Useful:  { color: '#34d399', bg: 'rgba(52,211,153,0.1)',  border: 'rgba(52,211,153,0.25)',  icon: '✦', label: 'Useful'  },
  Neutral: { color: '#fbbf24', bg: 'rgba(251,191,36,0.1)',  border: 'rgba(251,191,36,0.25)',  icon: '◈', label: 'Neutral' },
  Waste:   { color: '#f87171', bg: 'rgba(248,113,113,0.1)', border: 'rgba(248,113,113,0.25)', icon: '✕', label: 'Waste'   },
};

const SCORE_DIMS = [
  { key: 'clarity',    label: 'Clarity',    icon: '💬' },
  { key: 'depth',      label: 'Depth',      icon: '🔍' },
  { key: 'relevance',  label: 'Relevance',  icon: '🎯' },
  { key: 'usefulness', label: 'Usefulness', icon: '⚡' },
];

function ScoreRing({ score }) {
  const r = 52;
  const circ = 2 * Math.PI * r;
  const offset = circ - (score / 100) * circ;
  const color  = score >= 70 ? '#34d399' : score >= 40 ? '#fbbf24' : '#f87171';
  const glow   = score >= 70 ? 'glow-green' : score >= 40 ? 'glow-yellow' : 'glow-red';
  const label  = score >= 70 ? 'Great'      : score >= 40 ? 'Moderate'    : 'Low';

  return (
    <div className={`relative w-32 h-32 flex items-center justify-center rounded-full ${glow}`}
      style={{ background: 'rgba(255,255,255,0.02)' }}>
      <svg className="absolute inset-0 -rotate-90" width="128" height="128">
        <circle cx="64" cy="64" r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8"/>
        <circle cx="64" cy="64" r={r} fill="none"
          stroke={color} strokeWidth="8"
          strokeDasharray={circ} strokeDashoffset={offset}
          strokeLinecap="round" className="score-ring"
          style={{ filter: `drop-shadow(0 0 8px ${color}80)` }}
        />
      </svg>
      <div className="text-center z-10">
        <div className="text-3xl font-bold text-white leading-none">{score}</div>
        <div className="text-xs mt-0.5" style={{ color }}>{label}</div>
      </div>
    </div>
  );
}

export default function ScoreCard({ analysis }) {
  const cls = CLS_CONFIG[analysis.classification] || CLS_CONFIG.Neutral;
  const bd  = analysis.scoreBreakdown || {};

  return (
    <div className="card p-5 fade-in-up space-y-5">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="section-label mb-1">Content Score</p>
          <h3 className="text-white font-bold text-base">How good is this?</h3>
        </div>
        <div className="pill" style={{ background: cls.bg, border: `1px solid ${cls.border}`, color: cls.color }}>
          <span>{cls.icon}</span>
          <span>{cls.label}</span>
        </div>
      </div>

      {/* Ring + bars */}
      <div className="flex items-center gap-5">
        <ScoreRing score={analysis.score || 0} />

        <div className="flex-1 space-y-2.5">
          {SCORE_DIMS.map(({ key, label, icon }) => {
            const val = bd[key] || 0;
            const pct = (val / 25) * 100;
            const barColor = pct >= 70 ? '#34d399' : pct >= 40 ? '#fbbf24' : '#f87171';
            return (
              <div key={key}>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs text-slate-400 flex items-center gap-1">
                    <span className="text-xs">{icon}</span>{label}
                  </span>
                  <span className="text-xs font-semibold text-white">{val}<span className="text-slate-600">/25</span></span>
                </div>
                <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                  <div className="h-full rounded-full transition-all duration-1000"
                    style={{ width: `${pct}%`, background: barColor, boxShadow: `0 0 6px ${barColor}60` }}/>
                </div>
                {analysis.scoreJustification?.[key] && (
                  <p className="text-slate-600 text-xs mt-0.5 leading-snug italic line-clamp-1">
                    {analysis.scoreJustification[key]}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Classification reason */}
      {analysis.classificationReason && (
        <p className="text-slate-400 text-xs leading-relaxed pt-3"
          style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          {analysis.classificationReason}
        </p>
      )}

      {/* Productivity tip */}
      {analysis.productivityTip && (
        <div className="px-3 py-2.5 rounded-xl text-xs leading-relaxed"
          style={{ background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.15)', color: '#a5b4fc' }}>
          💡 {analysis.productivityTip}
        </div>
      )}

      {/* Confidence */}
      {analysis.confidenceLevel && (
        <ConfidenceBadge
          level={analysis.confidenceLevel}
          score={analysis.confidenceScore}
          label={analysis.confidenceLabel}
          fallbackMessage={analysis.fallbackMessage}
        />
      )}
    </div>
  );
}
