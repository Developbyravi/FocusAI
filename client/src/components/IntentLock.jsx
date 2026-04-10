import React, { useState } from 'react';

const PRESET_GOALS = [
  { icon: '📚', label: 'Learn something new',          value: 'Learn something new' },
  { icon: '🎯', label: 'Deep dive into a topic',       value: 'Deep dive into a specific topic' },
  { icon: '🚀', label: 'Improve my skills',            value: 'Improve my skills' },
  { icon: '💼', label: 'Career development',           value: 'Career development' },
  { icon: '🎬', label: 'Entertainment',                value: 'Entertainment' },
  { icon: '🔬', label: 'Research & exploration',       value: 'Research & exploration' },
];

export default function IntentLock({ onGoalSet }) {
  const [custom, setCustom] = useState('');
  const [selected, setSelected] = useState('');

  const handleSubmit = () => {
    const goal = custom.trim() || selected;
    if (goal) onGoalSet(goal);
  };

  return (
    <div className="min-h-[82vh] flex items-center justify-center px-2">
      <div className="w-full max-w-xl fade-in-up">

        {/* Hero */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-5 section-label"
            style={{ background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.18)', color: '#818cf8' }}>
            🔒 Intent Lock
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3 leading-tight">
            What are you here<br />
            <span className="gradient-text">to learn today?</span>
          </h2>
          <p className="text-slate-400 text-base leading-relaxed max-w-sm mx-auto">
            Setting your goal helps FocusAI give you a score and summary that actually matters to you.
          </p>
        </div>

        {/* Preset grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 mb-4">
          {PRESET_GOALS.map((g) => {
            const isSelected = selected === g.value;
            return (
              <button
                key={g.value}
                onClick={() => { setSelected(g.value); setCustom(''); }}
                className="p-3.5 rounded-2xl text-left transition-all"
                style={{
                  background: isSelected ? 'rgba(99,102,241,0.15)' : 'rgba(255,255,255,0.03)',
                  border: `1px solid ${isSelected ? 'rgba(99,102,241,0.5)' : 'rgba(255,255,255,0.07)'}`,
                  transform: isSelected ? 'scale(1.02)' : 'scale(1)',
                }}
              >
                <span className="text-xl block mb-1.5">{g.icon}</span>
                <span className={`text-xs font-medium leading-snug ${isSelected ? 'text-white' : 'text-slate-400'}`}>
                  {g.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* Custom input */}
        <div className="relative mb-5">
          <input
            type="text"
            value={custom}
            onChange={(e) => { setCustom(e.target.value); setSelected(''); }}
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            placeholder="Or describe your specific goal…"
            className="input-field w-full px-4 py-3 text-sm"
          />
        </div>

        <button
          onClick={handleSubmit}
          disabled={!custom.trim() && !selected}
          className="btn-primary w-full py-3.5 text-base"
        >
          Start Analyzing →
        </button>

        <p className="text-center text-slate-600 text-xs mt-4">
          You can change your goal anytime
        </p>
      </div>
    </div>
  );
}
