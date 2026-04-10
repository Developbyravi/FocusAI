import React, { useState } from 'react';
import Header from './components/Header';
import IntentLock from './components/IntentLock';
import InputPanel from './components/InputPanel';
import Dashboard from './components/Dashboard';
import { analyzeContent } from './api/focusApi';

export default function App() {
  const [goal, setGoal] = useState('');
  const [goalSet, setGoalSet] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [stats, setStats] = useState({ useful: 0, neutral: 0, waste: 0, total: 0 });

  const handleGoalSet = (selectedGoal) => { setGoal(selectedGoal); setGoalSet(true); };

  const handleAnalyze = async (input) => {
    setLoading(true); setError(''); setResult(null);
    try {
      const data = await analyzeContent(input, goal);
      setResult(data);
      const cls = data.analysis?.classification;
      setStats((prev) => ({
        useful:  prev.useful  + (cls === 'Useful'  ? 1 : 0),
        neutral: prev.neutral + (cls === 'Neutral' ? 1 : 0),
        waste:   prev.waste   + (cls === 'Waste'   ? 1 : 0),
        total:   prev.total   + 1,
      }));
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Analysis failed');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => { setResult(null); setError(''); };

  return (
    <div className="min-h-screen" style={{ background: 'radial-gradient(ellipse at 20% 0%, #1a1040 0%, #0d1117 60%)' }}>
      <Header goal={goal} goalSet={goalSet} stats={stats} onReset={handleReset} />
      <main className="max-w-7xl mx-auto px-4 py-8">
        {!goalSet   ? <IntentLock onGoalSet={handleGoalSet} /> :
         !result    ? <InputPanel onAnalyze={handleAnalyze} loading={loading} error={error} goal={goal} /> :
                      <Dashboard result={result} goal={goal} onAnalyzeNew={handleReset} />}
      </main>
    </div>
  );
}
