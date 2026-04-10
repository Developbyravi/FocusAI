import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import config from '../config';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await axios.get(`${config.apiUrl}/analytics/dashboard`);
      setStats(response.data);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-slate-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-4xl font-bold gradient-text mb-2">Dashboard</h1>
        <p className="text-slate-400">Your productivity insights at a glance</p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glassmorphism p-6"
        >
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-slate-400 text-sm font-medium">Total Analyses</h3>
            <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <p className="text-3xl font-bold text-white">{stats?.totalAnalyses || 0}</p>
          <p className="text-xs text-slate-500 mt-1">Content items analyzed</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glassmorphism p-6"
        >
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-slate-400 text-sm font-medium">Average Score</h3>
            <svg className="w-8 h-8 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </div>
          <p className="text-3xl font-bold text-white">{stats?.averageScore || 0}</p>
          <p className="text-xs text-slate-500 mt-1">Content quality rating</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glassmorphism p-6"
        >
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-slate-400 text-sm font-medium">Productivity Score</h3>
            <svg className="w-8 h-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-3xl font-bold text-white">{stats?.productivityScore || 0}</p>
          <p className="text-xs text-slate-500 mt-1">Your focus level</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glassmorphism p-6"
        >
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-slate-400 text-sm font-medium">Time Spent</h3>
            <svg className="w-8 h-8 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-3xl font-bold text-white">
            {Math.floor((stats?.timeSpent || 0) / 3600)}h {Math.floor(((stats?.timeSpent || 0) % 3600) / 60)}m
          </p>
          <p className="text-xs text-slate-500 mt-1">Total focus time</p>
        </motion.div>
      </div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="glassmorphism p-6"
      >
        <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
        
        {stats?.recentActivity && stats.recentActivity.length > 0 ? (
          <div className="space-y-3">
            {stats.recentActivity.map((activity, idx) => (
              <div key={idx} className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg hover:bg-slate-800 transition-colors">
                <div className="flex-1">
                  <p className="text-slate-300 font-medium">{activity.type || 'Content Analysis'}</p>
                  <p className="text-sm text-slate-500 truncate">{activity.url || 'Text content'}</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className={`text-lg font-bold ${
                      activity.usefulnessScore >= 80 ? 'text-emerald-400' :
                      activity.usefulnessScore >= 60 ? 'text-blue-400' :
                      activity.usefulnessScore >= 40 ? 'text-yellow-400' :
                      'text-red-400'
                    }`}>
                      {activity.usefulnessScore}
                    </p>
                    <p className="text-xs text-slate-500">Score</p>
                  </div>
                  <button className="p-2 hover:bg-slate-700 rounded-lg transition-colors">
                    <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-slate-500">
            <svg className="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p>No recent activity</p>
            <p className="text-sm mt-2">Start analyzing content to see your activity here</p>
          </div>
        )}
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8"
      >
        <a href="/analyze" className="glassmorphism p-6 hover:bg-white/10 transition-all group">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-500/20 rounded-lg group-hover:bg-blue-500/30 transition-colors">
              <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-slate-200">Analyze Content</h3>
              <p className="text-sm text-slate-500">Check content quality</p>
            </div>
          </div>
        </a>

        <a href="/focus" className="glassmorphism p-6 hover:bg-white/10 transition-all group">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-500/20 rounded-lg group-hover:bg-purple-500/30 transition-colors">
              <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-slate-200">Focus Mode</h3>
              <p className="text-sm text-slate-500">Start a focus session</p>
            </div>
          </div>
        </a>

        <a href="/recommendations" className="glassmorphism p-6 hover:bg-white/10 transition-all group">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-emerald-500/20 rounded-lg group-hover:bg-emerald-500/30 transition-colors">
              <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-slate-200">Recommendations</h3>
              <p className="text-sm text-slate-500">Get personalized content</p>
            </div>
          </div>
        </a>
      </motion.div>
    </div>
  );
};

export default Dashboard;