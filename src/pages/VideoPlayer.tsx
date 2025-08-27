import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, Play, Pause, Volume2, VolumeX, Settings, 
  Maximize, Heart, BookOpen, Share2, CheckCircle, Star 
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useGame } from '../contexts/GameContext';

// Mock video data
const videoContent = {
  '1': {
    id: '1',
    title: 'Yoga Matutino para Principiantes',
    description: 'Una secuencia suave de yoga perfecta para comenzar el día con energía y claridad. Esta práctica incluye movimientos de calentamiento, posturas básicas de yoga y una relajación final.',
    duration_sec: 1200,
    category: 'Yoga',
    instructor: 'Lidia',
    level: 'Principiante',
    equipment_needed: 'Esterilla de yoga',
    thumbnail_url: 'https://images.pexels.com/photos/3822864/pexels-photo-3822864.jpeg?auto=compress&cs=tinysrgb&w=800',
    video_url: 'dQw4w9WgXcQ', // YouTube video ID
    tags: ['mañana', 'principiantes', 'suave', 'energía'],
    visibility: 'public_sample',
    is_favorite: false,
    progress_percent: 75,
    completed: false
  },
  '2': {
    id: '2',
    title: 'Pilates Core Intenso',
    description: 'Fortalece tu centro con esta secuencia intensa de pilates. Trabajaremos músculos profundos del core, mejoraremos la estabilidad y construiremos fuerza funcional.',
    duration_sec: 1800,
    category: 'Pilates',
    instructor: 'Lidia',
    level: 'Intermedio',
    equipment_needed: 'Esterilla',
    thumbnail_url: 'https://images.pexels.com/photos/4056723/pexels-photo-4056723.jpeg?auto=compress&cs=tinysrgb&w=800',
    video_url: 'dQw4w9WgXcQ',
    tags: ['core', 'fuerza', 'pilates', 'intenso'],
    visibility: 'members',
    is_favorite: true,
    progress_percent: 0,
    completed: false
  }
};

export default function VideoPlayer() {
  const { contentId } = useParams<{ contentId: string }>();
  const navigate = useNavigate();
  const { user, hasAccess } = useAuth();
  const { markContentComplete } = useGame();
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showCompleteButton, setShowCompleteButton] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  const content = contentId ? videoContent[contentId as keyof typeof videoContent] : null;

  useEffect(() => {
    if (!content) return;
    
    // Check if user has access to this content
    if (content.visibility === 'members' && !hasAccess()) {
      navigate('/checkout');
      return;
    }

    // Restore progress if exists
    if (content.progress_percent) {
      setCurrentTime((content.progress_percent / 100) * content.duration_sec);
    }

    // Show complete button when 90% watched
    const completionThreshold = content.duration_sec * 0.9;
    if (currentTime >= completionThreshold) {
      setShowCompleteButton(true);
    }
  }, [content, currentTime, hasAccess, navigate]);

  if (!content) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-center">
          <h2 className="text-2xl font-bold mb-4">Contenido no encontrado</h2>
          <Link 
            to="/classes" 
            className="text-green-400 hover:text-green-300 underline"
          >
            Volver a clases
          </Link>
        </div>
      </div>
    );
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = (time: number) => {
    setCurrentTime(time);
    
    // Auto-show complete button at 90%
    const completionThreshold = content.duration_sec * 0.9;
    if (time >= completionThreshold && !showCompleteButton) {
      setShowCompleteButton(true);
    }
  };

  const handleComplete = () => {
    if (!user) return;
    
    setIsCompleted(true);
    markContentComplete(content.id);
    
    // Show success message
    setTimeout(() => {
      setShowCompleteButton(false);
    }, 2000);
  };

  const toggleFavorite = () => {
    // In real app, this would update favorites
    console.log('Toggle favorite for:', content.id);
  };

  const progress = (currentTime / content.duration_sec) * 100;

  return (
    <div className="min-h-screen bg-black">
      {/* Video Player */}
      <div className="relative aspect-video bg-black">
        {/* YouTube Embed */}
        <div className="w-full h-full">
          <iframe
            src={`https://www.youtube.com/embed/${content.video_url}?autoplay=${isPlaying ? 1 : 0}&modestbranding=1&rel=0&controls=1`}
            title={content.title}
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>

        {/* Custom Controls Overlay */}
        <div className={`absolute inset-0 bg-black bg-opacity-40 transition-opacity ${showControls ? 'opacity-100' : 'opacity-0'}`}>
          {/* Back Button */}
          <button
            onClick={() => navigate(-1)}
            className="absolute top-4 left-4 bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-70 transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>

          {/* Complete Button */}
          {showCompleteButton && !isCompleted && user && (
            <div className="absolute top-4 right-4">
              <button
                onClick={handleComplete}
                className="bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center space-x-2"
              >
                <CheckCircle className="w-5 h-5" />
                <span>Marcar como completada</span>
              </button>
            </div>
          )}

          {/* Completion Message */}
          {isCompleted && (
            <div className="absolute top-4 right-4">
              <div className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2">
                <Star className="w-5 h-5" fill="currentColor" />
                <span>¡Completada!</span>
              </div>
            </div>
          )}
        </div>

        {/* Progress Bar */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-white bg-opacity-30">
          <div
            className="h-full bg-green-500 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Video Info */}
      <div className="bg-white">
        <div className="max-w-4xl mx-auto p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                {content.title}
              </h1>
              <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                <span>{content.instructor}</span>
                <span>•</span>
                <span>{content.category}</span>
                <span>•</span>
                <span>{content.level}</span>
                <span>•</span>
                <span>{formatTime(content.duration_sec)}</span>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex items-center space-x-2">
              <button
                onClick={toggleFavorite}
                className={`p-2 rounded-lg transition-colors ${
                  content.is_favorite 
                    ? 'bg-red-50 text-red-600' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <Heart className={`w-5 h-5 ${content.is_favorite ? 'fill-current' : ''}`} />
              </button>
              <button className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors">
                <Share2 className="w-5 h-5" />
              </button>
            </div>
          </div>

          <p className="text-gray-700 mb-6">
            {content.description}
          </p>

          {/* Class Details */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Equipamiento necesario</h3>
              <p className="text-gray-600">{content.equipment_needed}</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Nivel</h3>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                content.level === 'Principiante' ? 'bg-green-100 text-green-800' :
                content.level === 'Intermedio' ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>
                {content.level}
              </span>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Tags</h3>
              <div className="flex flex-wrap gap-1">
                {content.tags.map(tag => (
                  <span key={tag} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-sm">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Progress Section */}
          {user && (
            <div className="bg-gray-50 rounded-2xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900">Tu progreso</h3>
                  <p className="text-sm text-gray-600">
                    {Math.round(progress)}% completado
                  </p>
                </div>
                <div className="text-2xl">
                  {isCompleted || content.completed ? '✅' : progress > 50 ? '⏳' : '▶️'}
                </div>
              </div>
            </div>
          )}

          {/* Not logged in CTA */}
          {!user && (
            <div className="bg-green-50 border border-green-200 rounded-2xl p-6 text-center">
              <h3 className="text-lg font-semibold text-green-900 mb-2">
                ¡Guarda tu progreso!
              </h3>
              <p className="text-green-700 mb-4">
                Inicia sesión para guardar tu progreso, marcar favoritos y desbloquear logros
              </p>
              <Link
                to="/auth"
                className="bg-green-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors"
              >
                Iniciar sesión
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}