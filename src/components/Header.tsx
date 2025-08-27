import React from 'react';
import { User, Bell, Settings } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useGame } from '../contexts/GameContext';
import { Link } from 'react-router-dom';

export default function Header() {
  const { user, hasAccess } = useAuth();
  const { stats } = useGame();

  if (!user) return null;

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <User className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-gray-900">
                Hola, {user.name.split(' ')[0]}
              </h1>
              <div className="flex items-center space-x-3 text-sm text-gray-600">
                {stats && (
                  <>
                    <span className="flex items-center">
                      🔥 {stats.current_streak} días
                    </span>
                    <span className="flex items-center">
                      ⭐ {stats.total_points} pts
                    </span>
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                      {stats.current_level.name}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            {!hasAccess() && (
              <Link
                to="/checkout"
                className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
              >
                Suscríbete
              </Link>
            )}
            <button className="p-2 text-gray-600 hover:text-gray-900 transition-colors">
              <Bell className="w-5 h-5" />
            </button>
            <Link
              to="/profile"
              className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <Settings className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}