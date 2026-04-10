import React from 'react';

export default function Header({ goal, goalSet, stats, onReset }) {
  return (
    <header style={{ background: 'rgba(13,17,23,0.85)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}
      className="sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">

        {/* Logo */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center text-white font-bold text-sm"
            style={{ background: 'linear-gradient(135deg, #4f46e5, #7c3aed)', boxShadow: '0 0 16px rgba(99,102,241,0.4)' }}>
            F
          </div>
          <div className="hidden sm:block">
            <span className="text-base font-bold gradient-text">FocusAI</span>
            <span className="text-slate-500 text-xs ml-2">· Learn Smarter</span>
          </div>
        </div>

        {/* Goal pill */}
        {goalSet && goal && (
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full"
            style={{ background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.2)' }}>
            <span className="text-indigo-400 text-xs">🎯</span>
            <span className="text-slate-300 text-xs font-medium truncate max-w-52">{goal}</span>
          </div>
        )}

        {/* Session stats */}
        {goalSet && stats.total > 0 && (
          <div className="hidden sm:flex items-center gap-3">
            <Stat color="#34d399" label={`${stats.useful} useful`} />
            <Stat color="#fbbf24" label={`${stats.neutral} neutral`} />
            <Stat color="#f87171" label={`${stats.waste} waste`} />
          </div>
        )}

        {/* CTA */}
        {goalSet && (
          <button onClick={onReset} className="btn-primary px-4 py-2 text-sm flex-shrink-0">
            + Analyze New
          </button>
        )}
      </div>
    </header>
  );
}

function Stat({ color, label }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: color }} />
      <span className="text-xs text-slate-400">{label}</span>
    </div>
  );
}
