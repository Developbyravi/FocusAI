import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-slate-950">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="relative z-10 pb-8 bg-slate-950 sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
            <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
              <div className="sm:text-center lg:text-left">
                <h1 className="text-4xl tracking-tight font-extrabold text-slate-100 sm:text-5xl md:text-6xl">
                  <span className="block xl:inline">Filter Noise.</span>{' '}
                  <span className="block gradient-text xl:inline">Focus on Value.</span>
                </h1>
                <p className="mt-3 text-base text-slate-400 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                  Intelligent content filtering system that analyzes content from various platforms 
                  and helps you focus on meaningful and productive information.
                </p>
                <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                  <div className="rounded-md shadow">
                    <Link
                      to="/signup"
                      className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 md:py-4 md:text-lg md:px-10 transition-colors"
                    >
                      Get Started
                    </Link>
                  </div>
                  <div className="mt-3 sm:mt-0 sm:ml-3">
                    <Link
                      to="/login"
                      className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-blue-400 bg-slate-800 hover:bg-slate-700 md:py-4 md:text-lg md:px-10 transition-colors"
                    >
                      Sign In
                    </Link>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-12 bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-blue-400 font-semibold tracking-wide uppercase">Features</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-slate-100 sm:text-4xl">
              Everything you need to stay focused
            </p>
          </div>

          <div className="mt-10">
            <div className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
              <div className="relative">
                <div className="glassmorphism p-6">
                  <h3 className="text-lg leading-6 font-medium text-slate-100">AI Analysis</h3>
                  <p className="mt-2 text-base text-slate-400">
                    Advanced AI algorithms analyze content and provide usefulness scores.
                  </p>
                </div>
              </div>

              <div className="relative">
                <div className="glassmorphism p-6">
                  <h3 className="text-lg leading-6 font-medium text-slate-100">Smart Summarization</h3>
                  <p className="mt-2 text-base text-slate-400">
                    Get concise summaries of lengthy content to save time.
                  </p>
                </div>
              </div>

              <div className="relative">
                <div className="glassmorphism p-6">
                  <h3 className="text-lg leading-6 font-medium text-slate-100">Productivity Tracking</h3>
                  <p className="mt-2 text-base text-slate-400">
                    Track your content consumption and productivity metrics.
                  </p>
                </div>
              </div>

              <div className="relative">
                <div className="glassmorphism p-6">
                  <h3 className="text-lg leading-6 font-medium text-slate-100">Focus Mode</h3>
                  <p className="mt-2 text-base text-slate-400">
                    Pomodoro timer and distraction blocking to maintain focus.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-slate-950">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-slate-400">&copy; 2024 FocusAI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;