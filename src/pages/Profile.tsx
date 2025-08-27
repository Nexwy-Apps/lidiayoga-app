import React, { useState } from 'react';
import { 
  User, Settings, Trophy, Calendar, Clock, Star, 
  Heart, TrendingUp, Award, Target, Edit2, Save, X,
  Crown, Zap, ChevronRight, Gift
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useGame } from '../contexts/GameContext';
import { Link } from 'react-router-dom';

export default function Profile() {
  const { user, logout, hasAccess, isTrialActive } = useAuth();
  const { stats } = useGame();
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    name: user?.name || '',
    email: user?.email || ''
  });

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto text-center py-12">
        <User className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Inicia sesión para ver tu perfil
        </h2>
        <Link 
          to="/auth"
          className="bg-green-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors"
        >
          Iniciar sesión
        </Link>
      </div>
    );
  }

  const handleSaveProfile = () => {
    // In real app, this would update the user profile
    console.log('Saving profile:', editData);
    setIsEditing(false);
  };

  const getRoleDisplayName = () => {
    switch (user.role) {
      case 'admin':
        return 'Administradora';
      case 'trial':
        return 'Prueba gratuita';
      case 'monthly':
        return 'Suscripción mensual';
      case 'yearly':
        return 'Suscripción anual';
      case 'in_person':
        return 'Alumno presencial';
      default:
        return 'Usuario';
    }
  };

  const getTrialDaysRemaining = () => {
    if (!user.trial_ends_at) return 0;
    const endDate = new Date(user.trial_ends_at);
    const today = new Date();
    const diffTime = endDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
  };

  const levelProgress = stats ? {
    current: stats.total_points,
    next: stats.current_level.threshold_points < 1300 ? stats.current_level.threshold_points + 100 : 1300,
    percentage: stats.current_level.threshold_points < 1300 ? 
      Math.min(100, (stats.total_points / (stats.current_level.threshold_points + 100)) * 100) : 100
  } : null;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Profile Header */}
      <div className="bg-gradient-to-r from-green-500 to-teal-500 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <User className="w-10 h-10 text-white" />
            </div>
            <div>
              {isEditing ? (
                <div className="space-y-2">
                  <input
                    type="text"
                    value={editData.name}
                    onChange={(e) => setEditData(prev => ({ ...prev, name: e.target.value }))}
                    className="bg-white bg-opacity-20 border border-white border-opacity-30 rounded px-3 py-1 text-white placeholder-white placeholder-opacity-70"
                    placeholder="Nombre"
                  />
                  <input
                    type="email"
                    value={editData.email}
                    onChange={(e) => setEditData(prev => ({ ...prev, email: e.target.value }))}
                    className="bg-white bg-opacity-20 border border-white border-opacity-30 rounded px-3 py-1 text-white placeholder-white placeholder-opacity-70"
                    placeholder="Email"
                  />
                </div>
              ) : (
                <>
                  <h1 className="text-2xl font-bold">{user.name}</h1>
                  <p className="text-green-100">{user.email}</p>
                </>
              )}
              <div className="flex items-center mt-2 space-x-2">
                <span className="bg-white bg-opacity-20 px-3 py-1 rounded-full text-sm">
                  {getRoleDisplayName()}
                </span>
                {user.role === 'admin' && (
                  <Crown className="w-5 h-5 text-yellow-300" />
                )}
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {isEditing ? (
              <>
                <button
                  onClick={handleSaveProfile}
                  className="bg-white text-green-600 p-2 rounded-lg hover:bg-green-50 transition-colors"
                >
                  <Save className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="bg-white bg-opacity-20 text-white p-2 rounded-lg hover:bg-white hover:bg-opacity-30 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="bg-white bg-opacity-20 text-white p-2 rounded-lg hover:bg-white hover:bg-opacity-30 transition-colors"
              >
                <Edit2 className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* Trial/Subscription Status */}
        {isTrialActive() && (
          <div className="mt-4 bg-white bg-opacity-20 rounded-lg p-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">Prueba gratuita activa</span>
              <span className="text-sm font-medium">
                {getTrialDaysRemaining()} días restantes
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Subscription Management */}
      {!hasAccess() && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-amber-900 mb-1">
                Suscripción necesaria
              </h3>
              <p className="text-amber-700">
                Suscríbete para acceso completo a todas las clases y contenido premium
              </p>
            </div>
            <Link
              to="/checkout"
              className="bg-amber-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-amber-700 transition-colors"
            >
              Suscríbete ahora
            </Link>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gamification Stats */}
        {stats && (
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Mi Progreso</h2>
              <Trophy className="w-6 h-6 text-yellow-500" />
            </div>

            {/* Level Progress */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">
                  Nivel actual: {stats.current_level.name}
                </span>
                <span className="text-sm text-gray-500">
                  {stats.total_points} pts
                </span>
              </div>
              {levelProgress && levelProgress.current < 1300 && (
                <>
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                    <div 
                      className="bg-gradient-to-r from-green-500 to-teal-500 h-2 rounded-full transition-all"
                      style={{ width: `${levelProgress.percentage}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-600">
                    {levelProgress.next - levelProgress.current} puntos para el siguiente nivel
                  </p>
                </>
              )}
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">{stats.sessions_completed}</div>
                <div className="text-sm text-gray-600">Sesiones</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">{stats.minutes_practiced}</div>
                <div className="text-sm text-gray-600">Minutos</div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center text-2xl font-bold text-orange-600">
                  🔥 {stats.current_streak}
                </div>
                <div className="text-sm text-gray-600">Racha actual</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">{stats.badges.length}</div>
                <div className="text-sm text-gray-600">Insignias</div>
              </div>
            </div>

            {/* Recent Badges */}
            {stats.badges.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-3">Logros recientes</h3>
                <div className="grid grid-cols-2 gap-2">
                  {stats.badges.slice(0, 4).map(badge => (
                    <div key={badge.id} className="flex items-center bg-yellow-50 px-3 py-2 rounded-lg">
                      <span className="text-lg mr-2">{badge.icon}</span>
                      <span className="text-sm font-medium text-yellow-800">{badge.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Activity Stats */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Estadísticas</h2>
            <TrendingUp className="w-6 h-6 text-green-500" />
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Calendar className="w-5 h-5 text-blue-500" />
                <span className="text-gray-700">Miembro desde</span>
              </div>
              <span className="text-sm font-medium">
                {new Date(user.created_at).toLocaleDateString('es-ES', { 
                  year: 'numeric', 
                  month: 'long' 
                })}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Clock className="w-5 h-5 text-green-500" />
                <span className="text-gray-700">Último acceso</span>
              </div>
              <span className="text-sm font-medium">
                {user.last_login_at ? 
                  new Date(user.last_login_at).toLocaleDateString('es-ES') : 
                  'Hoy'
                }
              </span>
            </div>

            {stats && (
              <>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Star className="w-5 h-5 text-yellow-500" />
                    <span className="text-gray-700">Mejor racha</span>
                  </div>
                  <span className="text-sm font-medium">{stats.max_streak} días</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Target className="w-5 h-5 text-purple-500" />
                    <span className="text-gray-700">Promedio semanal</span>
                  </div>
                  <span className="text-sm font-medium">
                    {Math.round(stats.sessions_completed / 4)} sesiones
                  </span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* All Badges */}
      {stats && stats.badges.length > 0 && (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Todas mis insignias</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {stats.badges.map(badge => (
              <div key={badge.id} className="flex items-center bg-gradient-to-r from-yellow-50 to-orange-50 p-4 rounded-xl">
                <div className="text-3xl mr-4">{badge.icon}</div>
                <div>
                  <h3 className="font-semibold text-gray-900">{badge.name}</h3>
                  <p className="text-sm text-gray-600">{badge.description}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {badge.earned_at && new Date(badge.earned_at).toLocaleDateString('es-ES')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Settings */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Configuración</h2>
        <div className="space-y-3">
          <button className="w-full flex items-center justify-between p-4 rounded-lg hover:bg-gray-50 transition-colors">
            <div className="flex items-center space-x-3">
              <Settings className="w-5 h-5 text-gray-500" />
              <span className="text-gray-700">Preferencias</span>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </button>
          
          <button className="w-full flex items-center justify-between p-4 rounded-lg hover:bg-gray-50 transition-colors">
            <div className="flex items-center space-x-3">
              <Heart className="w-5 h-5 text-gray-500" />
              <span className="text-gray-700">Contenido favorito</span>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </button>

          {user.role === 'admin' && (
            <Link 
              to="/admin"
              className="w-full flex items-center justify-between p-4 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <Crown className="w-5 h-5 text-yellow-500" />
                <span className="text-gray-700">Panel de administración</span>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </Link>
          )}
          
          <button 
            onClick={logout}
            className="w-full flex items-center justify-between p-4 rounded-lg hover:bg-red-50 transition-colors text-red-600"
          >
            <span>Cerrar sesión</span>
            <ChevronRight className="w-5 h-5 text-red-400" />
          </button>
        </div>
      </div>
    </div>
  );
}