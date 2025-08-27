import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Play, Brain, Calendar, MessageCircle } from 'lucide-react';

const navItems = [
  { to: '/', icon: Home, label: 'Inicio' },
  { to: '/classes', icon: Play, label: 'Clases' },
  { to: '/meditations', icon: Brain, label: 'Meditación' },
  { to: '/workshops', icon: Calendar, label: 'Talleres' },
  { to: '/announcements', icon: MessageCircle, label: 'Novedades' },
];

export default function Navigation() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
      <div className="flex">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex-1 flex flex-col items-center py-2 px-1 text-xs font-medium transition-colors ${
                isActive
                  ? 'text-green-600 bg-green-50'
                  : 'text-gray-600 hover:text-gray-900'
              }`
            }
          >
            <Icon className="w-5 h-5 mb-1" />
            <span>{label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}