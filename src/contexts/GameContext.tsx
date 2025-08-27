import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';

export interface Badge {
  id: string;
  key: string;
  name: string;
  description: string;
  icon: string;
  earned_at?: string;
}

export interface Level {
  id: string;
  name: string;
  threshold_points: number;
  order_index: number;
}

export interface UserStats {
  total_points: number;
  current_level: Level;
  current_streak: number;
  max_streak: number;
  badges: Badge[];
  sessions_completed: number;
  minutes_practiced: number;
}

interface GameContextType {
  stats: UserStats | null;
  loading: boolean;
  awardPoints: (points: number, reason: string) => void;
  updateStreak: () => void;
  markContentComplete: (contentId: string) => void;
  checkBadges: () => void;
  refreshStats: () => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

// Game data
const levels: Level[] = [
  { id: '1', name: 'Semilla', threshold_points: 0, order_index: 1 },
  { id: '2', name: 'Respira y Fluye', threshold_points: 50, order_index: 2 },
  { id: '3', name: 'Corazón Fuerte', threshold_points: 120, order_index: 3 },
  { id: '4', name: 'Guerrero Sereno', threshold_points: 250, order_index: 4 },
  { id: '5', name: 'Equilibrio Profundo', threshold_points: 400, order_index: 5 },
  { id: '6', name: 'Sabia del Movimiento', threshold_points: 600, order_index: 6 },
  { id: '7', name: 'Zen Avanzado', threshold_points: 900, order_index: 7 },
  { id: '8', name: 'Maestría Interior', threshold_points: 1300, order_index: 8 },
];

const badgesCatalog: Badge[] = [
  { id: '1', key: 'first_class', name: 'Bienvenida', description: 'Primera clase completada', icon: '🌱' },
  { id: '2', key: 'streak_3', name: 'Constancia inicial', description: '3 días seguidos practicando', icon: '🔥' },
  { id: '3', key: 'ten_sessions', name: 'Diez pasos', description: '10 sesiones completadas', icon: '⭐' },
  { id: '4', key: 'streak_7', name: 'Racha 7', description: '7 días seguidos practicando', icon: '🏆' },
  { id: '5', key: 'sunrise_5', name: 'Amanecer', description: '5 prácticas antes de las 10:00', icon: '🌅' },
  { id: '6', key: 'pilates_5', name: 'Fuerza y Core', description: '5 clases de Pilates', icon: '💪' },
  { id: '7', key: 'yoga_5', name: 'Flujo Solar', description: '5 clases de Yoga', icon: '🧘‍♀️' },
  { id: '8', key: 'meditation_60min', name: 'Respira', description: '60 minutos de meditación', icon: '🕯️' },
];

export function GameProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadUserStats();
    } else {
      setStats(null);
    }
  }, [user]);

  const loadUserStats = () => {
    if (!user) return;
    
    // Mock user stats - in real app, load from API
    const mockStats: UserStats = {
      total_points: user.id === '1' ? 890 : user.id === '2' ? 45 : 180,
      current_level: getCurrentLevel(user.id === '1' ? 890 : user.id === '2' ? 45 : 180),
      current_streak: user.id === '1' ? 12 : user.id === '2' ? 2 : 5,
      max_streak: user.id === '1' ? 25 : user.id === '2' ? 3 : 8,
      badges: getBadgesForUser(user.id),
      sessions_completed: user.id === '1' ? 65 : user.id === '2' ? 3 : 18,
      minutes_practiced: user.id === '1' ? 1250 : user.id === '2' ? 75 : 340
    };
    
    setStats(mockStats);
    setLoading(false);
  };

  const getCurrentLevel = (points: number): Level => {
    for (let i = levels.length - 1; i >= 0; i--) {
      if (points >= levels[i].threshold_points) {
        return levels[i];
      }
    }
    return levels[0];
  };

  const getBadgesForUser = (userId: string): Badge[] => {
    // Mock earned badges based on user
    if (userId === '1') {
      return badgesCatalog.slice(0, 7).map(badge => ({
        ...badge,
        earned_at: '2024-01-10'
      }));
    } else if (userId === '2') {
      return [{ ...badgesCatalog[0], earned_at: '2024-01-15' }];
    } else {
      return badgesCatalog.slice(0, 4).map(badge => ({
        ...badge,
        earned_at: '2024-01-05'
      }));
    }
  };

  const awardPoints = (points: number, reason: string) => {
    if (!stats || !user) return;
    
    const newTotalPoints = stats.total_points + points;
    const newLevel = getCurrentLevel(newTotalPoints);
    
    setStats(prev => prev ? {
      ...prev,
      total_points: newTotalPoints,
      current_level: newLevel
    } : null);

    // Show notification
    const notification = document.createElement('div');
    notification.className = 'fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-bounce';
    notification.textContent = `+${points} pts • ${reason}`;
    document.body.appendChild(notification);
    
    setTimeout(() => {
      document.body.removeChild(notification);
    }, 3000);
  };

  const updateStreak = () => {
    if (!stats) return;
    
    setStats(prev => prev ? {
      ...prev,
      current_streak: prev.current_streak + 1,
      max_streak: Math.max(prev.max_streak, prev.current_streak + 1)
    } : null);
  };

  const markContentComplete = (contentId: string) => {
    if (!stats) return;
    
    // Award points based on content type
    awardPoints(10, 'Clase completada');
    
    setStats(prev => prev ? {
      ...prev,
      sessions_completed: prev.sessions_completed + 1,
      minutes_practiced: prev.minutes_practiced + 30 // Mock 30 min average
    } : null);
    
    checkBadges();
  };

  const checkBadges = () => {
    if (!stats || !user) return;
    
    // Check for new badges to unlock
    const earnedBadgeKeys = stats.badges.map(b => b.key);
    
    // First class badge
    if (stats.sessions_completed >= 1 && !earnedBadgeKeys.includes('first_class')) {
      const badge = badgesCatalog.find(b => b.key === 'first_class');
      if (badge) {
        setStats(prev => prev ? {
          ...prev,
          badges: [...prev.badges, { ...badge, earned_at: new Date().toISOString() }]
        } : null);
        
        showBadgeNotification(badge);
      }
    }

    // 10 sessions badge
    if (stats.sessions_completed >= 10 && !earnedBadgeKeys.includes('ten_sessions')) {
      const badge = badgesCatalog.find(b => b.key === 'ten_sessions');
      if (badge) {
        setStats(prev => prev ? {
          ...prev,
          badges: [...prev.badges, { ...badge, earned_at: new Date().toISOString() }]
        } : null);
        
        showBadgeNotification(badge);
      }
    }
  };

  const showBadgeNotification = (badge: Badge) => {
    const notification = document.createElement('div');
    notification.className = 'fixed top-4 right-4 bg-yellow-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-bounce';
    notification.innerHTML = `${badge.icon} Badge desbloqueado: ${badge.name}`;
    document.body.appendChild(notification);
    
    setTimeout(() => {
      document.body.removeChild(notification);
    }, 4000);
  };

  const refreshStats = () => {
    loadUserStats();
  };

  const value = {
    stats,
    loading,
    awardPoints,
    updateStreak,
    markContentComplete,
    checkBadges,
    refreshStats
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export function useGame() {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}