import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const FocusMode = () => {
  const [time, setTime] = useState(25 * 60); // 25 minutes in seconds
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState('focus'); // focus, shortBreak, longBreak
  const [sessions, setSessions] = useState(0);

  const modes = {
    focus: { duration: 25 * 60, label: 'Focus Time', color: 'blue' },
    shortBreak: { duration: 5 * 60, label: 'Short Break', color: 'emerald' },
    longBreak: { duration: 15 * 60, label: 'Long Break', color: 'purple' }
  };

  useEffect(() => {
    let interval = null;

    if (isActive && time > 0) {
      interval = setInterval(() => {
        setTime((time) => time - 1);
      }, 1000);
    } else if (time === 0) {
      handleTimerComplete();
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, time]);

  const handleTimerComplete = () => {
    setIsActive(false);
    
    // Play notification sound (optional)
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('FocusAI Timer', {
        body: `${modes[mode].label} completed!`,
        icon: '/favicon.ico'
      });
    }

    // Auto-switch to break after focus session
    if (mode === 'focus') {
      setSessions(sessions + 1);
      if ((sessions + 1) % 4 === 0) {
        switchMode('longBreak');
      } else {
        switchMode('shortBreak');
      }
    }
  };

  const switchMode = (newMode) => {
    setMode(newMode);
    setTime(modes[newMode].duration);
    setIsActive(false);
  };

  const toggleTimer = () => {
    setIsActive(!isActive);
    
    // Request notification permission
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  };

  const resetTimer = () => {
    setIsActive(false);
    setTime(modes[mode].duration);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = ((modes[mode].duration - time) / modes[mode].duration) * 100;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 text-center"
      >
        <h1 className="text-4xl font-bold gradient-text mb-2">Focus Mode</h1>
        <p className="text-slate-400">Stay productive with the Pomodoro Technique</p>
      </motion.div>

      {/* Mode Selector */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex gap-4 mb-8 justify-center"
      >
        {Object.entries(modes).map(([key, { label, color }]) => (
          <button
            key={key}
            onClick={() => switchMode(key)}
            disabled={isActive}
            className={`px-6 py-3 rounded-lg font-medium transition-all ${
              mode === key
                ? `bg-${color}-500 text-white shadow-lg`
                : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
            } ${isActive ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {label}
          </button>
        ))}
      </motion.div>

      {/* Timer Display */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        className="glassmorphism p-12 mb-8"
      >
        <div className="relative">
          {/* Progress Circle */}
          <svg className="w-full h-full" viewBox="0 0 200 200">
            <circle
              cx="100"
              cy="100"
              r="90"
              fill="none"
              stroke="rgba(148, 163, 184, 0.1)"
              strokeWidth="8"
            />
            <circle
              cx="100"
              cy="100"
              r="90"
              fill="none"
              stroke={
                mode === 'focus' ? '#3b82f6' :
                mode === 'shortBreak' ? '#10b981' :
                '#8b5cf6'
              }
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 90}`}
              strokeDashoffset={`${2 * Math.PI * 90 * (1 - progress / 100)}`}
              transform="rotate(-90 100 100)"
              className="transition-all duration-1000"
            />
          </svg>

          {/* Timer Text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <p className="text-7xl font-bold text-white mb-2">{formatTime(time)}</p>
            <p className="text-slate-400 text-lg">{modes[mode].label}</p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex gap-4 justify-center mt-8">
          <button
            onClick={toggleTimer}
            className={`px-8 py-4 rounded-lg font-semibold text-white transition-all ${
              isActive
                ? 'bg-red-500 hover:bg-red-600'
                : 'bg-gradient-to-r from-blue-500 to-purple-500 hover:shadow-lg hover:shadow-blue-500/50'
            }`}
          >
            {isActive ? 'Pause' : 'Start'}
          </button>
          <button
            onClick={resetTimer}
            className="px-8 py-4 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-lg transition-all"
          >
            Reset
          </button>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glassmorphism p-6 text-center"
        >
          <div className="text-4xl font-bold text-blue-400 mb-2">{sessions}</div>
          <p className="text-slate-400">Sessions Today</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glassmorphism p-6 text-center"
        >
          <div className="text-4xl font-bold text-emerald-400 mb-2">
            {Math.floor((sessions * 25) / 60)}h {(sessions * 25) % 60}m
          </div>
          <p className="text-slate-400">Focus Time</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="glassmorphism p-6 text-center"
        >
          <div className="text-4xl font-bold text-purple-400 mb-2">
            {sessions > 0 ? Math.floor((sessions / 4) * 100) : 0}%
          </div>
          <p className="text-slate-400">Goal Progress</p>
        </motion.div>
      </div>

      {/* Tips */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="glassmorphism p-6"
      >
        <h3 className="text-xl font-semibold text-slate-200 mb-4 flex items-center gap-2">
          <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
          Pomodoro Tips
        </h3>
        <ul className="space-y-3 text-slate-400">
          <li className="flex items-start gap-3">
            <span className="text-blue-400 mt-1">•</span>
            <span>Work for 25 minutes with full focus, then take a 5-minute break</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-blue-400 mt-1">•</span>
            <span>After 4 focus sessions, take a longer 15-minute break</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-blue-400 mt-1">•</span>
            <span>During breaks, step away from your screen and stretch</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-blue-400 mt-1">•</span>
            <span>Eliminate distractions before starting a focus session</span>
          </li>
        </ul>
      </motion.div>
    </div>
  );
};

export default FocusMode;