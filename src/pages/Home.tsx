import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useGame } from '../contexts/GameContext';
import { Link } from 'react-router-dom';
import { Play, Brain, Calendar, Award, TrendingUp, Heart, Clock } from 'lucide-react';
import ContentCard from '../components/ContentCard';

// Mock featured content
const featuredContent = [
  {
    id: '1',
    title: 'Yoga Matutino para Principiantes',
    description: 'Despierta tu cuerpo con esta secuencia suave de yoga',
    duration_sec: 1200,
    category: 'Yoga',
    thumbnail_url: 'https://images.pexels.com/photos/3822864/pexels-photo-3822864.jpeg?auto=compress&cs=tinysrgb&w=400',
    visibility: 'public_sample' as const,
    progress_percent: 75
  },
  {
    id: '2',
    title: 'Pilates Core Intenso',
    description: 'Fortalece tu centro con ejercicios de pilates',
    duration_sec: 1800,
    category: 'Pilates',
    thumbnail_url: 'https://images.pexels.com/photos/4056723/pexels-photo-4056723.jpeg?auto=compress&cs=tinysrgb&w=400',
    visibility: 'members' as const,
    is_completed: true
  },
  {
    id: '3',
    title: 'Meditación para la Calma',
    description: 'Encuentra paz interior con esta meditación guiada',
    duration_sec: 900,
    category: 'Meditación',
    thumbnail_url: 'https://images.pexels.com/photos/3822622/pexels-photo-3822622.jpeg?auto=compress&cs=tinysrgb&w=400',
    visibility: 'public_sample' as const,
    is_favorite: true
  }
];

const quickStats = [
  { label: 'Sesiones', value: '15', icon: Play, color: 'text-blue-600 bg-blue-100' },
  { label: 'Minutos', value: '340', icon: Clock, color: 'text-green-600 bg-green-100' },
  { label: 'Racha', value: '5', icon: TrendingUp, color: 'text-orange-600 bg-orange-100' },
  { label: 'Badges', value: '4', icon: Award, color: 'text-purple-600 bg-purple-100' },
];

export default function Home() {
  const { user, hasAccess, isTrialActive } = useAuth();
  const { stats } = useGame();

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto">
        {/* Hero Section */}
        <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-2xl p-8 mb-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Bienvenida a tu espacio de bienestar
            </h1>
            <p className="text-lg text-gray-600 mb-6">
              Yoga, pilates y meditación con Lidia. Empieza tu prueba gratuita de 14 días.
            </p>
            <Link
              to="/auth"
              className="inline-block bg-green-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-green-700 transition-colors"
            >
              Prueba Gratis 14 Días
            </Link>
          </div>
        </div>

        {/* Preview Content */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Contenido de muestra
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredContent.filter(c => c.visibility === 'public_sample').map(content => (
              <ContentCard key={content.id} content={content} showCategory />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Welcome Message */}
      <div className="bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-2xl p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">
              ¡Hola, {user.name.split(' ')[0]}!
            </h1>
            <p className="text-green-100">
              {isTrialActive() ? 
                `Tu prueba gratuita vence en ${Math.ceil((new Date(user.trial_ends_at!).getTime() - Date.now()) / (1000 * 60 * 60 * 24))} días` :
                'Hoy es un buen día para cuidar de ti'
              }
            </p>
          </div>
          {stats && (
            <div className="text-right">
              <div className="text-2xl font-bold">🔥 {stats.current_streak}</div>
              <div className="text-sm text-green-100">días seguidos</div>
            </div>
          )}
        </div>
      </div>

      {/* Stats Grid */}
      {stats && (
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-white rounded-xl p-4 text-center shadow-sm">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <Play className="w-6 h-6 text-blue-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{stats.sessions_completed}</div>
            <div className="text-sm text-gray-600">Sesiones</div>
          </div>
          
          <div className="bg-white rounded-xl p-4 text-center shadow-sm">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <Clock className="w-6 h-6 text-green-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{stats.minutes_practiced}</div>
            <div className="text-sm text-gray-600">Minutos</div>
          </div>
          
          <div className="bg-white rounded-xl p-4 text-center shadow-sm">
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <TrendingUp className="w-6 h-6 text-orange-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{stats.current_streak}</div>
            <div className="text-sm text-gray-600">Racha</div>
          </div>
          
          <div className="bg-white rounded-xl p-4 text-center shadow-sm">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <Award className="w-6 h-6 text-purple-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{stats.badges.length}</div>
            <div className="text-sm text-gray-600">Badges</div>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">¿Qué te apetece hoy?</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link
            to="/classes"
            className="flex flex-col items-center p-4 rounded-xl bg-blue-50 hover:bg-blue-100 transition-colors"
          >
            <Play className="w-8 h-8 text-blue-600 mb-2" />
            <span className="text-sm font-medium text-blue-900">Clases</span>
          </Link>
          
          <Link
            to="/meditations"
            className="flex flex-col items-center p-4 rounded-xl bg-green-50 hover:bg-green-100 transition-colors"
          >
            <Brain className="w-8 h-8 text-green-600 mb-2" />
            <span className="text-sm font-medium text-green-900">Meditación</span>
          </Link>
          
          <Link
            to="/workshops"
            className="flex flex-col items-center p-4 rounded-xl bg-purple-50 hover:bg-purple-100 transition-colors"
          >
            <Calendar className="w-8 h-8 text-purple-600 mb-2" />
            <span className="text-sm font-medium text-purple-900">Talleres</span>
          </Link>
          
          <Link
            to="/profile"
            className="flex flex-col items-center p-4 rounded-xl bg-orange-50 hover:bg-orange-100 transition-colors"
          >
            <Award className="w-8 h-8 text-orange-600 mb-2" />
            <span className="text-sm font-medium text-orange-900">Mi Progreso</span>
          </Link>
        </div>
      </div>

      {/* Continue Watching */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Continúa donde lo dejaste</h2>
          <Link to="/classes" className="text-green-600 font-medium hover:text-green-700">
            Ver todas
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredContent.map(content => (
            <ContentCard key={content.id} content={content} />
          ))}
        </div>
      </div>

      {/* Level Progress */}
      {stats && (
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Tu Progreso</h2>
            <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
              {stats.current_level.name}
            </span>
          </div>
          
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Puntos actuales: {stats.total_points}</span>
                <span>Siguiente nivel: {stats.total_points < 1300 ? stats.current_level.threshold_points + 50 : 'Máximo'}</span>
              </div>
              {stats.total_points < 1300 && (
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-green-500 to-teal-500 h-2 rounded-full transition-all"
                    style={{
                      width: `${Math.min(100, (stats.total_points / (stats.current_level.threshold_points + 50)) * 100)}%`
                    }}
                  />
                </div>
              )}
            </div>

            {/* Recent Badges */}
            {stats.badges.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Logros recientes</h3>
                <div className="flex space-x-2">
                  {stats.badges.slice(0, 4).map(badge => (
                    <div key={badge.id} className="flex items-center bg-yellow-50 px-3 py-1 rounded-full">
                      <span className="text-lg mr-2">{badge.icon}</span>
                      <span className="text-sm font-medium text-yellow-800">{badge.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}