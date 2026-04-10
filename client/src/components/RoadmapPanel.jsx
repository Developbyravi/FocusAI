import React, { useState } from 'react';
import { generateRoadmap } from '../api/focusApi';

const PHASES = [
  { key: 'Beginner',     color: '#34d399', bg: 'rgba(52,211,153,0.1)',  border: 'rgba(52,211,153,0.2)',  icon: '🌱', step: 1 },
  { key: 'Intermediate', color: '#60a5fa', bg: 'rgba(96,165,250,0.1)',  border: 'rgba(96,165,250,0.2)',  icon: '🚀', step: 2 },
  { key: 'Advanced',     color: '#a78bfa', bg: 'rgba(167,139,250,0.1)', border: 'rgba(167,139,250,0.2)', icon: '⚡', step: 3 },
];

function getPhase(level) {
  if (!level) return PHASES[1];
  const l = level.toLowerCase();
  if (l.includes('begin') || l.includes('start') || l.includes('found')) return PHASES[0];
  if (l.includes('advan') || l.includes('expert'))                        return PHASES[2];
  return PHASES[1];
}

export default function RoadmapPanel({ roadmap: initialRoadmap, goal }) {
  const [roadmap, setRoadmap] = useState(initialRoadmap);
  const [loading, setLoading] = useState(false);
  const [topic, setTopic] = useState('');
  const [expanded, setExpanded] = useState(0);

  const handleGenerate = async () => {
    if (!topic.trim()) return;
    setLoading(true);
    try {
      const data = await generateRoadmap(topic);
      if (data.roadmap?.phases) {
        setRoadmap(data.roadmap.phases.map((p) => ({ level: p.phase, topics: p.topics || [], resources: p.resources || [] })));
        setExpanded(0);
      }
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  return (
    <div className="card p-5 fade-in-up">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="section-label mb-1">Learning Path</p>
          <h3 className="text-white font-bold">Your Roadmap</h3>
        </div>
      </div>

      {/* Generator */}
      <div className="flex gap-2 mb-5">
        <input type="text" value={topic} onChange={(e) => setTopic(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
          placeholder="Generate roadmap for any topic…"
          className="input-field flex-1 px-3 py-2 text-sm"/>
        <button onClick={handleGenerate} disabled={loading || !topic.trim()}
          className="btn-primary px-4 py-2 text-sm">
          {loading ? '…' : 'Generate'}
        </button>
      </div>

      {/* Timeline */}
      {(roadmap || []).length > 0 ? (
        <div className="space-y-2">
          {(roadmap || []).map((phase, i) => {
            const ph = getPhase(phase.level);
            const isOpen = expanded === i;
            return (
              <div key={i} className="rounded-2xl overflow-hidden transition-all"
                style={{ background: isOpen ? ph.bg : 'rgba(255,255,255,0.02)', border: `1px solid ${isOpen ? ph.border : 'rgba(255,255,255,0.06)'}` }}>

                <button onClick={() => setExpanded(isOpen ? null : i)}
                  className="w-full flex items-center gap-3 p-4 text-left">
                  {/* Step indicator */}
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center text-base flex-shrink-0"
                    style={{ background: ph.bg, border: `1px solid ${ph.border}` }}>
                    {ph.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-white font-semibold text-sm">{phase.level}</div>
                    <div className="text-xs mt-0.5" style={{ color: ph.color }}>
                      {(phase.topics || []).length} topics to cover
                    </div>
                  </div>
                  {/* Progress dot */}
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full" style={{ background: ph.color }}/>
                    <span className="text-slate-600 text-xs">{isOpen ? '▲' : '▼'}</span>
                  </div>
                </button>

                {isOpen && (
                  <div className="px-4 pb-4 slide-down">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 mb-3">
                      {(phase.topics || []).map((t, j) => (
                        <div key={j} className="flex items-center gap-2 text-sm text-slate-300 py-1">
                          <span className="w-1 h-1 rounded-full flex-shrink-0" style={{ background: ph.color }}/>
                          {t}
                        </div>
                      ))}
                    </div>
                    {(phase.resources || []).length > 0 && (
                      <div className="pt-3" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                        <p className="section-label mb-2">Resources</p>
                        {phase.resources.map((r, j) => (
                          <div key={j} className="text-xs py-0.5" style={{ color: ph.color }}>→ {r}</div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-10 text-slate-600 text-sm">
          <div className="text-3xl mb-3">🗺️</div>
          Enter a topic above to generate your personalized learning path
        </div>
      )}
    </div>
  );
}
