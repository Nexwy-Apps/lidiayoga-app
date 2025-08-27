import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type UserRole = 'guest' | 'trial' | 'monthly' | 'yearly' | 'in_person' | 'admin';
export type UserStatus = 'active' | 'paused' | 'canceled' | 'banned';

export interface User {
  id: string;
  email: string;
  name: string;
  avatar_url?: string;
  role: UserRole;
  status: UserStatus;
  trial_ends_at?: string;
  created_at: string;
  last_login_at?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  hasAccess: (requiredRoles?: UserRole[]) => boolean;
  isTrialActive: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock data for development
const mockUsers: User[] = [
  {
    id: '1',
    email: 'admin@lidia.com',
    name: 'Lidia Admin',
    role: 'admin',
    status: 'active',
    created_at: '2024-01-01',
    last_login_at: '2024-01-15'
  },
  {
    id: '2', 
    email: 'trial@test.com',
    name: 'Usuario Trial',
    role: 'trial',
    status: 'active',
    trial_ends_at: '2024-02-01',
    created_at: '2024-01-15'
  },
  {
    id: '3',
    email: 'monthly@test.com', 
    name: 'Suscriptor Mensual',
    role: 'monthly',
    status: 'active',
    created_at: '2023-12-01'
  }
];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for stored session
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      // Mock authentication
      const foundUser = mockUsers.find(u => u.email === email);
      if (foundUser) {
        const updatedUser = { ...foundUser, last_login_at: new Date().toISOString() };
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
      } else {
        throw new Error('Usuario no encontrado');
      }
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signup = async (email: string, password: string, name: string) => {
    setLoading(true);
    try {
      // Mock signup with 14-day trial
      const newUser: User = {
        id: Math.random().toString(36).substr(2, 9),
        email,
        name,
        role: 'trial',
        status: 'active',
        trial_ends_at: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
        created_at: new Date().toISOString()
      };
      setUser(newUser);
      localStorage.setItem('user', JSON.stringify(newUser));
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const hasAccess = (requiredRoles: UserRole[] = ['trial', 'monthly', 'yearly', 'in_person', 'admin']) => {
    if (!user) return false;
    if (user.status !== 'active') return false;
    
    // Admin always has access
    if (user.role === 'admin') return true;
    
    // Check if user role is in required roles
    if (!requiredRoles.includes(user.role)) return false;
    
    // Check trial expiration
    if (user.role === 'trial' && user.trial_ends_at) {
      return new Date(user.trial_ends_at) > new Date();
    }
    
    return true;
  };

  const isTrialActive = () => {
    if (!user || user.role !== 'trial') return false;
    if (!user.trial_ends_at) return false;
    return new Date(user.trial_ends_at) > new Date();
  };

  const value = {
    user,
    loading,
    login,
    signup,
    logout,
    hasAccess,
    isTrialActive
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}