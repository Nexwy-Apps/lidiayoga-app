import React, { useState } from 'react';
import { Calendar, MapPin, Users, Clock, Euro, CheckCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';

interface Workshop {
  id: string;
  title: string;
  description: string;
  start_at: string;
  end_at: string;
  location: string;
  location_type: 'online' | 'presencial' | 'hybrid';
  price_cents: number;
  capacity: number | null;
  registered_count: number;
  is_registered: boolean;
  instructor: string;
  level: 'beginner' | 'intermediate' | 'advanced' | 'all';
  thumbnail_url: string;
  status: 'upcoming' | 'ongoing' | 'completed' | 'canceled';
}

// Mock workshops data
const allWorkshops: Workshop[] = [
  {
    id: 'w1',
    title: 'Taller de Reseteo de Espalda',
    description: 'Secuencias específicas para liberar tensión de espalda y cuello. Incluye técnicas de respiración y posturas correctivas.',
    start_at: '2024-02-15T18:00:00Z',
    end_at: '2024-02-15T19:30:00Z',
    location: 'Estudio Lidia Yoga',
    location_type: 'presencial',
    price_cents: 2500,
    capacity: 15,
    registered_count: 8,
    is_registered: false,
    instructor: 'Lidia',
    level: 'all',
    thumbnail_url: 'https://images.pexels.com/photos/3823063/pexels-photo-3823063.jpeg?auto=compress&cs=tinysrgb&w=400',
    status: 'upcoming'
  },
  {
    id: 'w2',
    title: 'Meditación y Mindfulness Online',
    description: 'Introducción práctica al mindfulness. Técnicas para incorporar la meditación en tu vida diaria.',
    start_at: '2024-02-18T10:00:00Z',
    end_at: '2024-02-18T11:30:00Z',
    location: 'Zoom (link enviado por email)',
    location_type: 'online',
    price_cents: 0,
    capacity: null,
    registered_count: 24,
    is_registered: true,
    instructor: 'Lidia',
    level: 'beginner',
    thumbnail_url: 'https://images.pexels.com/photos/3822622/pexels-photo-3822622.jpeg?auto=compress&cs=tinysrgb&w=400',
    status: 'upcoming'
  },
  {
    id: 'w3',
    title: 'Pilates Core Intenso',
    description: 'Taller avanzado de fortalecimiento del core con ejercicios progresivos de pilates.',
    start_at: '2024-02-22T19:00:00Z',
    end_at: '2024-02-22T20:30:00Z',
    location: 'Híbrido: Estudio + Online',
    location_type: 'hybrid',
    price_cents: 3000,
    capacity: 12,
    registered_count: 5,
    is_registered: false,
    instructor: 'Lidia',
    level: 'intermediate',
    thumbnail_url: 'https://images.pexels.com/photos/4056723/pexels-photo-4056723.jpeg?auto=compress&cs=tinysrgb&w=400',
    status: 'upcoming'
  },
  {
    id: 'w4',
    title: 'Yoga para Principiantes',
    description: 'Fundamentos del yoga: posturas básicas, respiración y alineación correcta.',
    start_at: '2024-01-28T17:00:00Z',
    end_at: '2024-01-28T18:30:00Z',
    location: 'Estudio Lidia Yoga',
    location_type: 'presencial',
    price_cents: 2000,
    capacity: 20,
    registered_count: 18,
    is_registered: true,
    instructor: 'Lidia',
    level: 'beginner',
    thumbnail_url: 'https://images.pexels.com/photos/3822864/pexels-photo-3822864.jpeg?auto=compress&cs=tinysrgb&w=400',
    status: 'completed'
  }
];

export default function Workshops() {
  const { user, hasAccess } = useAuth();
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'upcoming' | 'registered' | 'completed'>('all');

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString('es-ES', { 
        weekday: 'long',
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      }),
      time: date.toLocaleTimeString('es-ES', { 
        hour: '2-digit',
        minute: '2-digit'
      })
    };
  };

  const formatPrice = (cents: number) => {
    if (cents === 0) return 'Gratuito';
    return `${(cents / 100).toFixed(0)}€`;
  };

  const getLocationIcon = (type: Workshop['location_type']) => {
    switch (type) {
      case 'online':
        return '💻';
      case 'presencial':
        return '📍';
      case 'hybrid':
        return '🌐';
      default:
        return '📍';
    }
  };

  const getLevelBadgeColor = (level: Workshop['level']) => {
    switch (level) {
      case 'beginner':
        return 'bg-green-100 text-green-800';
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800';
      case 'advanced':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  const getLevelText = (level: Workshop['level']) => {
    switch (level) {
      case 'beginner':
        return 'Principiante';
      case 'intermediate':
        return 'Intermedio';
      case 'advanced':
        return 'Avanzado';
      default:
        return 'Todos los niveles';
    }
  };

  const filteredWorkshops = allWorkshops.filter(workshop => {
    switch (selectedFilter) {
      case 'upcoming':
        return workshop.status === 'upcoming';
      case 'registered':
        return workshop.is_registered;
      case 'completed':
        return workshop.status === 'completed';
      default:
        return true;
    }
  });

  const upcomingCount = allWorkshops.filter(w => w.status === 'upcoming').length;
  const registeredCount = allWorkshops.filter(w => w.is_registered).length;

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Talleres y Cursos</h1>
        <p className="text-gray-600">
          Profundiza tu práctica con talleres especializados y cursos estructurados
        </p>
        
        {/* Stats */}
        {user && (
          <div className="flex items-center space-x-6 mt-4 text-sm">
            <div className="flex items-center text-blue-600">
              <Calendar className="w-4 h-4 mr-1" />
              <span>{upcomingCount} próximos</span>
            </div>
            <div className="flex items-center text-green-600">
              <CheckCircle className="w-4 h-4 mr-1" />
              <span>{registeredCount} inscrito/a</span>
            </div>
          </div>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => setSelectedFilter('all')}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            selectedFilter === 'all'
              ? 'bg-green-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Todos
        </button>
        <button
          onClick={() => setSelectedFilter('upcoming')}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            selectedFilter === 'upcoming'
              ? 'bg-green-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Próximos ({upcomingCount})
        </button>
        {user && (
          <>
            <button
              onClick={() => setSelectedFilter('registered')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedFilter === 'registered'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Mis talleres ({registeredCount})
            </button>
            <button
              onClick={() => setSelectedFilter('completed')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedFilter === 'completed'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Completados
            </button>
          </>
        )}
      </div>

      {/* Workshops List */}
      <div className="space-y-6">
        {filteredWorkshops.map(workshop => {
          const dateTime = formatDateTime(workshop.start_at);
          const canRegister = hasAccess() && workshop.status === 'upcoming' && !workshop.is_registered;
          const isFull = workshop.capacity && workshop.registered_count >= workshop.capacity;
          
          return (
            <div key={workshop.id} className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
              <div className="md:flex">
                {/* Image */}
                <div className="md:w-1/3">
                  <img
                    src={workshop.thumbnail_url}
                    alt={workshop.title}
                    className="w-full h-48 md:h-full object-cover"
                  />
                </div>
                
                {/* Content */}
                <div className="md:w-2/3 p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-1">
                        {workshop.title}
                      </h3>
                      <p className="text-sm text-gray-600">
                        con {workshop.instructor}
                      </p>
                    </div>
                    
                    {/* Status badges */}
                    <div className="flex flex-col items-end space-y-2">
                      {workshop.is_registered && (
                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                          Inscrito/a
                        </span>
                      )}
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getLevelBadgeColor(workshop.level)}`}>
                        {getLevelText(workshop.level)}
                      </span>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 mb-4 line-clamp-2">
                    {workshop.description}
                  </p>
                  
                  {/* Workshop details */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="w-4 h-4 mr-2 text-blue-500" />
                      <span className="capitalize">{dateTime.date}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Clock className="w-4 h-4 mr-2 text-green-500" />
                      <span>{dateTime.time}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin className="w-4 h-4 mr-2 text-purple-500" />
                      <span className="mr-2">{getLocationIcon(workshop.location_type)}</span>
                      <span>{workshop.location}</span>
                    </div>
                    {workshop.capacity && (
                      <div className="flex items-center text-sm text-gray-600">
                        <Users className="w-4 h-4 mr-2 text-orange-500" />
                        <span>{workshop.registered_count}/{workshop.capacity} inscrito/as</span>
                      </div>
                    )}
                  </div>
                  
                  {/* Footer */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="text-lg font-bold text-green-600">
                        {formatPrice(workshop.price_cents)}
                      </div>
                      {workshop.status === 'completed' && (
                        <span className="text-sm text-gray-500">Finalizado</span>
                      )}
                    </div>
                    
                    <div className="flex space-x-2">
                      {workshop.status === 'upcoming' && (
                        <>
                          {!user ? (
                            <Link
                              to="/auth"
                              className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
                            >
                              Iniciar sesión para inscribirme
                            </Link>
                          ) : workshop.is_registered ? (
                            <span className="bg-gray-100 text-gray-600 px-4 py-2 rounded-lg text-sm font-medium">
                              Ya inscrito/a
                            </span>
                          ) : isFull ? (
                            <span className="bg-red-100 text-red-600 px-4 py-2 rounded-lg text-sm font-medium">
                              Aforo completo
                            </span>
                          ) : !hasAccess() ? (
                            <Link
                              to="/checkout"
                              className="bg-amber-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-amber-700 transition-colors"
                            >
                              Suscríbete para inscribirte
                            </Link>
                          ) : (
                            <button className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors">
                              Inscribirme
                            </button>
                          )}
                        </>
                      )}
                      
                      {workshop.status === 'completed' && workshop.is_registered && (
                        <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
                          Ver grabación
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty state */}
      {filteredWorkshops.length === 0 && (
        <div className="text-center py-12">
          <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">
            {selectedFilter === 'upcoming' && 'No hay talleres próximos'}
            {selectedFilter === 'registered' && 'No tienes talleres registrados'}
            {selectedFilter === 'completed' && 'No has completado ningún taller aún'}
            {selectedFilter === 'all' && 'No se encontraron talleres'}
          </p>
          {selectedFilter !== 'all' && (
            <button
              onClick={() => setSelectedFilter('all')}
              className="mt-4 text-green-600 hover:text-green-700 font-medium"
            >
              Ver todos los talleres
            </button>
          )}
        </div>
      )}
    </div>
  );
}