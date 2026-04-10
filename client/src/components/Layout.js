import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Layout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-slate-950">
      <nav className="glassmorphism border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <h1 className="text-xl font-bold gradient-text">FocusAI</h1>
              </div>
              <div className="hidden md:block ml-10">
                <div className="flex items-baseline space-x-4">
                  <NavLink
                    to="/app"
                    end
                    className={({ isActive }) =>
                      `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                        isActive
                          ? 'bg-blue-600 text-white'
                          : 'text-slate-300 hover:text-white hover:bg-slate-700'
                      }`
                    }
                  >
                    Dashboard
                  </NavLink>
                  <NavLink
                    to="/app/analyze"
                    className={({ isActive }) =>
                      `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                        isActive
                          ? 'bg-blue-600 text-white'
                          : 'text-slate-300 hover:text-white hover:bg-slate-700'
                      }`
                    }
                  >
                    Analyze
                  </NavLink>
                  <NavLink
                    to="/app/recommendations"
                    className={({ isActive }) =>
                      `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                        isActive
                          ? 'bg-blue-600 text-white'
                          : 'text-slate-300 hover:text-white hover:bg-slate-700'
                      }`
                    }
                  >
                    Recommendations
                  </NavLink>
                  <NavLink
                    to="/app/focus"
                    className={({ isActive }) =>
                      `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                        isActive
                          ? 'bg-blue-600 text-white'
                          : 'text-slate-300 hover:text-white hover:bg-slate-700'
                      }`
                    }
                  >
                    Focus Mode
                  </NavLink>
                </div>
              </div>
            </div>
            <div className="flex items-center">
              <span className="text-slate-300 mr-4">Welcome, {user?.name}</span>
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>
      
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;