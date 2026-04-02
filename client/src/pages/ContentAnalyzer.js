import React, { useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import config from '../config';

const ContentAnalyzer = () => {
  const [url, setUrl] = useState('');
  const [content, setContent] = useState('');
  const [type, setType] = useState('url');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleAnalyze = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await axios.post(`${config.apiUrl}/analyze`, {
        url: type === 'url' ? url : undefined,
        content: type === 'text' ? content : undefined,
        type
      });
      
      setResult(response.data);
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Failed to analyze content');
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-emerald-400';
    if (score >= 60) return 'text-blue-400';
    if (score >= 40) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-4xl font-bold gradient-text mb-2">Content Analyzer</h1>
        <p className="text-slate-400">Analyze content to get usefulness scores and insights</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Section */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="glassmorphism p-6"
        >
          <h2 className="text-xl font-semibold mb-4">Input Content</h2>
          
          <div className="mb-4">
            <div className="flex gap-4 mb-4">
              <button
                onClick={() => setType('url')}
                className={`flex-1 py-2 px-4 rounded-lg transition-all ${
                  type === 'url'
                    ? 'bg-blue-500 text-white'
                    : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                }`}
              >
                URL
              </button>
              <button
                onClick={() => setType('text')}
                className={`flex-1 py-2 px-4 rounded-lg transition-all ${
                  type === 'text'
                    ? 'bg-blue-500 text-white'
                    : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                }`}
              >
                Text
              </button>
            </div>

            <form onSubmit={handleAnalyze}>
              {type === 'url' ? (
                <input
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="Enter URL (e.g., https://example.com)"
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  required
                />
              ) : (
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Paste your content here..."
                  rows="8"
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 resize-none"
                  required
                />
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-4 py-3 px-6 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-blue-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Analyzing...' : 'Analyze Content'}
              </button>
            </form>

            {error && (
              <div className="mt-4 p-4 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400">
                {error}
              </div>
            )}
          </div>
        </motion.div>

        {/* Results Section */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="glassmorphism p-6"
        >
          <h2 className="text-xl font-semibold mb-4">Analysis Results</h2>
          
          {!result && !loading && (
            <div className="flex items-center justify-center h-64 text-slate-500">
              <div className="text-center">
                <svg className="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <p>Results will appear here</p>
              </div>
            </div>
          )}

          {loading && (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                <p className="text-slate-400">Analyzing content...</p>
              </div>
            </div>
          )}

          {result && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-4"
            >
              {/* Score */}
              <div className="text-center p-6 bg-slate-800/50 rounded-lg">
                <p className="text-sm text-slate-400 mb-2">Usefulness Score</p>
                <p className={`text-5xl font-bold ${getScoreColor(result.usefulnessScore)}`}>
                  {result.usefulnessScore}
                </p>
                <p className="text-xs text-slate-500 mt-2">out of 100</p>
              </div>

              {/* Summary */}
              <div className="p-4 bg-slate-800/50 rounded-lg">
                <h3 className="text-sm font-semibold text-slate-300 mb-2">Summary</h3>
                <p className="text-slate-400 text-sm">{result.summary}</p>
              </div>

              {/* Categories */}
              {result.categories && result.categories.length > 0 && (
                <div className="p-4 bg-slate-800/50 rounded-lg">
                  <h3 className="text-sm font-semibold text-slate-300 mb-2">Categories</h3>
                  <div className="flex flex-wrap gap-2">
                    {result.categories.map((cat, idx) => (
                      <span key={idx} className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-xs">
                        {cat}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Key Points */}
              {result.keyPoints && result.keyPoints.length > 0 && (
                <div className="p-4 bg-slate-800/50 rounded-lg">
                  <h3 className="text-sm font-semibold text-slate-300 mb-2">Key Points</h3>
                  <ul className="space-y-2">
                    {result.keyPoints.map((point, idx) => (
                      <li key={idx} className="text-slate-400 text-sm flex items-start">
                        <span className="text-blue-400 mr-2">•</span>
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Sentiment */}
              {result.sentiment && (
                <div className="p-4 bg-slate-800/50 rounded-lg">
                  <h3 className="text-sm font-semibold text-slate-300 mb-2">Sentiment</h3>
                  <span className={`px-3 py-1 rounded-full text-xs ${
                    result.sentiment === 'positive' ? 'bg-emerald-500/20 text-emerald-400' :
                    result.sentiment === 'negative' ? 'bg-red-500/20 text-red-400' :
                    'bg-slate-500/20 text-slate-400'
                  }`}>
                    {result.sentiment.charAt(0).toUpperCase() + result.sentiment.slice(1)}
                  </span>
                </div>
              )}
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default ContentAnalyzer;