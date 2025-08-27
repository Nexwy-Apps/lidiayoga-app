import React, { useState } from 'react';
import { Filter, Search, Clock, Heart } from 'lucide-react';
import ContentCard, { Content } from '../components/ContentCard';

// Mock meditations data
const allMeditations: Content[] = [
  {
    id: 'm1',
    title: 'Respiración para la Calma',
    description: 'Técnicas de respiración para reducir el estrés y encontrar paz interior',
    duration_sec: 600,
    category: 'Meditación Corta',
    thumbnail_url: 'https://images.pexels.com/photos/3822622/pexels-photo-3822622.jpeg?auto=compress&cs=tinysrgb&w=400',
    visibility: 'public_sample',
    is_favorite: true
  },
  {
    id: 'm2',
    title: 'Meditación Mindfulness',
    description: 'Práctica de atención plena para el momento presente',
    duration_sec: 900,
    category: 'Meditación Corta',
    thumbnail_url: 'https://images.pexels.com/photos/3823063/pexels-photo-3823063.jpeg?auto=compress&cs=tinysrgb&w=400',
    visibility: 'members',
    progress_percent: 45
  },
  {
    id: 'm3',
    title: 'Meditación para Dormir',
    description: 'Relajación profunda para preparar el cuerpo y mente para el descanso',
    duration_sec: 1800,
    category: 'Meditación Larga',
    thumbnail_url: 'https://images.pexels.com/photos/3094215/pexels-photo-3094215.jpeg?auto=compress&cs=tinysrgb&w=400',
    visibility: 'members'
  },
  {
    id: 'm4',
    title: 'Scan Corporal Completo',
    description: 'Recorrido consciente por todo el cuerpo para liberar tensiones',
    duration_sec: 2100,
    category: 'Meditación Larga',
    thumbnail_url: 'https://images.pexels.com/photos/3822621/pexels-photo-3822621.jpeg?auto=compress&cs=tinysrgb&w=400',
    visibility: 'members',
    is_completed: true
  },
  {
    id: 'm5',
    title: 'Meditación Matutina',
    description: 'Empieza el día con claridad mental y energía positiva',
    duration_sec: 720,
    category: 'Meditación Corta',
    thumbnail_url: 'https://images.pexels.com/photos/3775593/pexels-photo-3775593.jpeg?auto=compress&cs=tinysrgb&w=400',
    visibility: 'public_sample'
  },
  {
    id: 'm6',
    title: 'Meditación para Ansiedad',
    description: 'Técnicas específicas para calmar la mente ansiosa',
    duration_sec: 1200,
    category: 'Meditación Corta',
    thumbnail_url: 'https://images.pexels.com/photos/4498606/pexels-photo-4498606.jpeg?auto=compress&cs=tinysrgb&w=400',
    visibility: 'members',
    progress_percent: 100,
    is_completed: true
  }
];

const categories = ['Todas', 'Meditación Corta', 'Meditación Larga'];
const durations = ['Todas', '< 10 min', '10-20 min', '> 20 min'];

export default function Meditations() {
  const [selectedCategory, setSelectedCategory] = useState('Todas');
  const [selectedDuration, setSelectedDuration] = useState('Todas');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const filteredMeditations = allMeditations.filter(meditation => {
    const matchesCategory = selectedCategory === 'Todas' || meditation.category === selectedCategory;
    
    const matchesDuration = selectedDuration === 'Todas' || 
      (selectedDuration === '< 10 min' && meditation.duration_sec < 600) ||
      (selectedDuration === '10-20 min' && meditation.duration_sec >= 600 && meditation.duration_sec <= 1200) ||
      (selectedDuration === '> 20 min' && meditation.duration_sec > 1200);
    
    const matchesSearch = meditation.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         meditation.description.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesDuration && matchesSearch;
  });

  const favoriteCount = allMeditations.filter(m => m.is_favorite).length;
  const completedCount = allMeditations.filter(m => m.is_completed).length;

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Meditaciones guiadas</h1>
        <p className="text-gray-600">
          Encuentra calma y claridad mental con nuestras meditaciones
        </p>
        
        {/* Stats */}
        <div className="flex items-center space-x-6 mt-4 text-sm">
          <div className="flex items-center text-red-600">
            <Heart className="w-4 h-4 mr-1" fill="currentColor" />
            <span>{favoriteCount} favoritas</span>
          </div>
          <div className="flex items-center text-green-600">
            <span className="w-2 h-2 bg-green-600 rounded-full mr-2"></span>
            <span>{completedCount} completadas</span>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="mb-6 space-y-4">
        <div className="flex items-center space-x-4">
          <div className="flex-1 relative">
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar meditaciones..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Filter className="w-5 h-5 mr-2" />
            Filtros
          </button>
        </div>

        {/* Filter Options */}
        {showFilters && (
          <div className="bg-white p-4 rounded-lg border border-gray-200 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Categoría
              </label>
              <div className="flex flex-wrap gap-2">
                {categories.map(category => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                      selectedCategory === category
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Duración
              </label>
              <div className="flex flex-wrap gap-2">
                {durations.map(duration => (
                  <button
                    key={duration}
                    onClick={() => setSelectedDuration(duration)}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                      selectedDuration === duration
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {duration}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Quick Access */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 text-center">
          <div className="text-2xl mb-2">🌅</div>
          <div className="text-sm font-medium text-blue-900">Meditación Matutina</div>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 text-center">
          <div className="text-2xl mb-2">💤</div>
          <div className="text-sm font-medium text-purple-900">Para Dormir</div>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 text-center">
          <div className="text-2xl mb-2">🧘</div>
          <div className="text-sm font-medium text-green-900">Mindfulness</div>
        </div>
        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-4 text-center">
          <div className="text-2xl mb-2">❤️</div>
          <div className="text-sm font-medium text-orange-900">Favoritas</div>
        </div>
      </div>

      {/* Results */}
      <div className="mb-4">
        <p className="text-sm text-gray-600">
          {filteredMeditations.length} {filteredMeditations.length === 1 ? 'meditación encontrada' : 'meditaciones encontradas'}
        </p>
      </div>

      {/* Meditations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMeditations.map(meditation => (
          <ContentCard 
            key={meditation.id} 
            content={meditation} 
            showCategory={selectedCategory === 'Todas'}
          />
        ))}
      </div>

      {filteredMeditations.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No se encontraron meditaciones con esos filtros</p>
          <button
            onClick={() => {
              setSelectedCategory('Todas');
              setSelectedDuration('Todas');
              setSearchQuery('');
            }}
            className="mt-4 text-green-600 hover:text-green-700 font-medium"
          >
            Limpiar filtros
          </button>
        </div>
      )}
    </div>
  );
}