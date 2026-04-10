import React from 'react';

export default function RecommendationsPanel({ recommendations, shortVideoAlternative }) {
  const openSearch = (q) =>
    window.open(`https://www.youtube.com/results?search_query=${encodeURIComponent(q)}`, '_blank');

  return (
    <div className="card p-5 fade-in-up">
      <p className="section-label mb-1">Curated For You</p>
      <h3 className="text-white font-bold mb-4">Better Alternatives</h3>

      {/* Short video alternative — highlighted */}
      {shortVideoAlternative && (
        <div className="mb-4 p-4 rounded-2xl"
          style={{ background: 'linear-gradient(135deg, rgba(251,146,60,0.08), rgba(239,68,68,0.06))', border: '1px solid rgba(251,146,60,0.2)' }}>
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <span className="pill mb-2" style={{ background: 'rgba(251,146,60,0.12)', border: '1px solid rgba(251,146,60,0.25)', color: '#fb923c' }}>
                ⚡ Shorter Option
              </span>
              <p className="text-white text-sm font-semibold mt-2 leading-snug">{shortVideoAlternative.title}</p>
              <p className="text-slate-500 text-xs mt-1 leading-relaxed">{shortVideoAlternative.reason}</p>
            </div>
            <button onClick={() => openSearch(shortVideoAlternative.searchQuery)}
              className="flex-shrink-0 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all"
              style={{ background: 'rgba(251,146,60,0.15)', border: '1px solid rgba(251,146,60,0.3)', color: '#fb923c' }}>
              Find →
            </button>
          </div>
        </div>
      )}

      {/* Recommendation list */}
      <div className="space-y-2">
        {(recommendations || []).map((rec, i) => (
          <div key={i}
            className="flex items-start gap-3 p-3 rounded-xl group cursor-pointer transition-all"
            style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}
            onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(99,102,241,0.3)'}
            onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)'}
            onClick={() => openSearch(rec.searchQuery)}>
            <div className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5"
              style={{ background: 'rgba(99,102,241,0.12)', color: '#818cf8' }}>
              {i + 1}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-medium leading-snug">{rec.title}</p>
              <p className="text-slate-500 text-xs mt-0.5 leading-relaxed">{rec.reason}</p>
            </div>
            <span className="text-slate-600 text-xs flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity mt-1">→</span>
          </div>
        ))}
      </div>

      {(!recommendations || recommendations.length === 0) && (
        <p className="text-slate-600 text-sm text-center py-6">No recommendations available</p>
      )}
    </div>
  );
}
