import React, { useState } from 'react';
import { Filter, Search } from 'lucide-react';
import ContentCard, { Content } from '../components/ContentCard';

// Mock classes data
const allClasses: Content[] = [
  {
    id: '1',
    title: 'Yoga Matutino para Principiantes',
    description: 'Despierta tu cuerpo con esta secuencia suave de yoga perfecta para empezar el día',
    duration_sec: 1200,
    category: 'Yoga',
    thumbnail_url: 'https://images.pexels.com/photos/3822864/pexels-photo-3822864.jpeg?auto=compress&cs=tinysrgb&w=400',
    visibility: 'public_sample',
    progress_percent: 75
  },
  {
    id: '2',
    title: 'Pilates Core Intenso',
    description: 'Fortalece tu centro con ejercicios específicos de pilates',
    duration_sec: 1800,
    category: 'Pilates',
    thumbnail_url: 'https://images.pexels.com/photos/4056723/pexels-photo-4056723.jpeg?auto=compress&cs=tinysrgb&w=400',
    visibility: 'members',
    is_completed: true
  },
  {
    id: '3',
    title: 'Yoga Vinyasa Flow',
    description: 'Fluye entre posturas con respiración consciente',
    duration_sec: 2700,
    category: 'Yoga',
    thumbnail_url: 'https://images.pexels.com/photos/3823063/pexels-photo-3823063.jpeg?auto=compress&cs=tinysrgb&w=400',
    visibility: 'members',
    progress_percent: 20
  },
  {
    id: '4',
    title: 'Pilates con Fitball',
    description: 'Ejercicios dinámicos usando pelota de pilates',
    duration_sec: 2100,
    category: 'Fitball',
    thumbnail_url: 'https://images.pexels.com/photos/3775593/pexels-photo-3775593.jpeg?auto=compress&cs=tinysrgb&w=400',
    visibility: 'members'
  },
  {
    id: '5',
    title: 'Yoga Restaurativo',
    description: 'Relaja profundamente cuerpo y mente',
    duration_sec: 3600,
    category: 'Yoga',
    thumbnail_url: 'https://images.pexels.com/photos/3094215/pexels-photo-3094215.jpeg?auto=compress&cs=tinysrgb&w=400',
    visibility: 'members',
    is_favorite: true
  },
  {
    id: '6',
    title: 'Pilates para Principiantes',
    description: 'Introducción suave a los principios del pilates',
    duration_sec: 1500,
    category: 'Pilates',
    thumbnail_url: 'https://images.pexels.com/photos/4498606/pexels-photo-4498606.jpeg?auto=compress&cs=tinysrgb&w=400',
    visibility: 'public_sample'
  },
  {
    id: '7',
    title: 'Fitball Balance y Core',
    description: 'Mejora equilibrio y fuerza central con fitball',
    duration_sec: 1800,
    category: 'Fitball',
    thumbnail_url: 'https://images.pexels.com/photos/4498421/pexels-photo-4498421.jpeg?auto=compress&cs=tinysrgb&w=400',
    visibility: 'members'
  },
  {
    id: '8',
    title: 'Yoga Noche Relajante',
    description: 'Prepara tu cuerpo para un descanso profundo',
    duration_sec: 1800,
    category: 'Yoga',
    thumbnail_url: 'https://images.pexels.com/photos/3822621/pexels-photo-3822621.jpeg?auto=compress&cs=tinysrgb&w=400',
    visibility: 'members',
    progress_percent: 100,
    is_completed: true
  }
];

const categories = ['Todas', 'Yoga', 'Pilates', 'Fitball'];
const durations = ['Todas', '< 20 min', '20-40 min', '> 40 min'];

export default function Classes() {
  const [selectedCategory, setSelectedCategory] = useState('Todas');
  const [selectedDuration, setSelectedDuration] = useState('Todas');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const filteredClasses = allClasses.filter(cls => {
    const matchesCategory = selectedCategory === 'Todas' || cls.category === selectedCategory;
    
    const matchesDuration = selectedDuration === 'Todas' || 
      (selectedDuration === '< 20 min' && cls.duration_sec < 1200) ||
      (selectedDuration === '20-40 min' && cls.duration_sec >= 1200 && cls.duration_sec <= 2400) ||
      (selectedDuration === '> 40 min' && cls.duration_sec > 2400);
    
    const matchesSearch = cls.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         cls.description.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesDuration && matchesSearch;
  });

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Clases grabadas</h1>
        <p className="text-gray-600">
          Yoga, pilates y fitball para todos los niveles
        </p>
      </div>

      {/* Search and Filters */}
      <div className="mb-6 space-y-4">
        <div className="flex items-center space-x-4">
          <div className="flex-1 relative">
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar clases..."
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

      {/* Results */}
      <div className="mb-4">
        <p className="text-sm text-gray-600">
          {filteredClasses.length} {filteredClasses.length === 1 ? 'clase encontrada' : 'clases encontradas'}
        </p>
      </div>

      {/* Classes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredClasses.map(cls => (
          <ContentCard 
            key={cls.id} 
            content={cls} 
            showCategory={selectedCategory === 'Todas'}
          />
        ))}
      </div>

      {filteredClasses.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No se encontraron clases con esos filtros</p>
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