import React, { useState } from 'react';
import VideoPlayer from './VideoPlayer';
import ScoreCard from './ScoreCard';
import SummaryPanel from './SummaryPanel';
import RoadmapPanel from './RoadmapPanel';
import RecommendationsPanel from './RecommendationsPanel';
import ChatAssistant from './ChatAssistant';
import FeedbackPanel from './FeedbackPanel';
import KeywordFallback from './KeywordFallback';

export default function Dashboard({ result, goal, onAnalyzeNew }) {
  const { title, embedUrl, videoId, inputType, url } = result;
  const [analysis, setAnalysis] = useState(result.analysis);

  const needsKeywords =
    inputType === 'youtube' &&
    analysis.confidenceLevel === 'minimal' &&
    !analysis.keywordsProvided;

  const handleKeywordResult = (newAnalysis) =>
    setAnalysis({ ...newAnalysis, keywordsProvided: true });

  const chatContext = {
    title, goal,
    score: analysis.score,
    classification: analysis.classification,
    summary: analysis.summary,
    keyInsights: analysis.keyInsights,
  };

  const typeLabel = inputType === 'youtube' ? '🎬 YouTube'
    : inputType === 'article' ? '📰 Article' : '📝 Text';

  return (
    <div className="fade-in-up pb-12">

      {/* ── Page header ── */}
      <div className="flex items-start justify-between gap-4 mb-6">
        <div className="min-w-0">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="section-label">{typeLabel}</span>
            {url && (
              <a href={url} target="_blank" rel="noopener noreferrer"
                className="text-xs text-indigo-400 hover:underline truncate max-w-xs">
                {url}
              </a>
            )}
          </div>
          <h2 className="text-xl font-bold text-white leading-snug truncate max-w-2xl">{title}</h2>
          <p className="text-slate-500 text-xs mt-1">Goal: <span className="text-slate-400">{goal}</span></p>
        </div>
        <button onClick={onAnalyzeNew}
          className="btn-secondary px-4 py-2 text-sm flex-shrink-0">
          ← New
        </button>
      </div>

      {/* ── Keyword fallback (Layer 4) ── */}
      {needsKeywords && (
        <div className="mb-5">
          <KeywordFallback videoId={videoId} goal={goal} onResult={handleKeywordResult}/>
        </div>
      )}

      {/* ── Main layout ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* Left — main content */}
        <div className="lg:col-span-2 space-y-4">

          {/* Video */}
          {inputType === 'youtube' && embedUrl && (
            <VideoPlayer embedUrl={embedUrl} title={title} videoId={videoId}
              fallbackMessage={analysis.fallbackMessage}/>
          )}

          {/* Score + Summary */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ScoreCard analysis={analysis} title={title}/>
            <SummaryPanel analysis={analysis}/>
          </div>

          {/* Roadmap */}
          <RoadmapPanel roadmap={analysis.roadmap} goal={goal}/>

          {/* Chat */}
          <ChatAssistant context={chatContext}/>
        </div>

        {/* Right — sidebar */}
        <div className="space-y-4">

          {/* Quick stats */}
          <div className="card p-5">
            <p className="section-label mb-3">At a Glance</p>
            <div className="space-y-3">
              <StatRow icon="🏆" label="Value Score"   value={`${analysis.score}/100`}
                valueColor={analysis.score >= 70 ? '#34d399' : analysis.score >= 40 ? '#fbbf24' : '#f87171'}/>
              <StatRow icon="🎯" label="Focus Score"   value={`${analysis.focusScore || '—'}/100`}/>
              <StatRow icon="⏱️" label="Time to Read"  value={`${analysis.timeToConsume || '?'} min`}/>
              <StatRow icon="📊" label="Classification" value={analysis.classification}
                valueColor={analysis.classification === 'Useful' ? '#34d399' : analysis.classification === 'Waste' ? '#f87171' : '#fbbf24'}/>
            </div>
          </div>

          {/* Recommendations */}
          <RecommendationsPanel
            recommendations={analysis.recommendations}
            shortVideoAlternative={analysis.shortVideoAlternative}/>

          {/* Feedback */}
          <FeedbackPanel title={title} onAnalyzeNew={onAnalyzeNew}/>
        </div>
      </div>
    </div>
  );
}

function StatRow({ icon, label, value, valueColor }) {
  return (
    <div className="flex items-center justify-between py-1"
      style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
      <div className="flex items-center gap-2">
        <span className="text-sm">{icon}</span>
        <span className="text-slate-400 text-sm">{label}</span>
      </div>
      <span className="text-sm font-semibold" style={{ color: valueColor || '#e2e8f0' }}>{value}</span>
    </div>
  );
}
