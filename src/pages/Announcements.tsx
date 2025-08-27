import React, { useState } from 'react';
import { Pin, Heart, MessageSquare, Share2, Calendar, Play, Image as ImageIcon } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface Announcement {
  id: string;
  type: 'text' | 'image' | 'video';
  title: string;
  body: string;
  media_url?: string;
  is_pinned: boolean;
  author: {
    name: string;
    avatar_url?: string;
  };
  published_at: string;
  likes_count: number;
  comments_count: number;
  is_liked: boolean;
}

// Mock announcements data
const allAnnouncements: Announcement[] = [
  {
    id: 'a1',
    type: 'text',
    title: '¡Nueva clase de Yoga Restaurativo disponible!',
    body: 'Me emociona compartir con vosotras la nueva clase de Yoga Restaurativo que acabo de subir. Es perfecta para esos días en los que necesitáis una pausa profunda y relajante. \n\n¡Espero que la disfrutéis tanto como yo disfruté creándola para vosotras! 🧘‍♀️✨',
    is_pinned: true,
    author: {
      name: 'Lidia',
      avatar_url: 'https://images.pexels.com/photos/3823063/pexels-photo-3823063.jpeg?auto=compress&cs=tinysrgb&w=100'
    },
    published_at: '2024-01-20T10:00:00Z',
    likes_count: 24,
    comments_count: 8,
    is_liked: true
  },
  {
    id: 'a2',
    type: 'image',
    title: 'Recordatorio: Taller de Reseteo de Espalda',
    body: 'No olvidéis que mañana tenemos el taller especial de Reseteo de Espalda a las 18:00h. Aún quedan algunas plazas disponibles.',
    media_url: 'https://images.pexels.com/photos/4498606/pexels-photo-4498606.jpeg?auto=compress&cs=tinysrgb&w=600',
    is_pinned: false,
    author: {
      name: 'Lidia',
      avatar_url: 'https://images.pexels.com/photos/3823063/pexels-photo-3823063.jpeg?auto=compress&cs=tinysrgb&w=100'
    },
    published_at: '2024-01-19T16:30:00Z',
    likes_count: 15,
    comments_count: 3,
    is_liked: false
  },
  {
    id: 'a3',
    type: 'video',
    title: 'Tip de la semana: Respiración consciente',
    body: 'Esta semana quiero compartir con vosotras una técnica de respiración que uso a diario. Es muy sencilla pero muy poderosa para centrarnos y encontrar calma.',
    media_url: 'https://images.pexels.com/photos/3822622/pexels-photo-3822622.jpeg?auto=compress&cs=tinysrgb&w=600',
    is_pinned: false,
    author: {
      name: 'Lidia',
      avatar_url: 'https://images.pexels.com/photos/3823063/pexels-photo-3823063.jpeg?auto=compress&cs=tinysrgb&w=100'
    },
    published_at: '2024-01-18T14:15:00Z',
    likes_count: 32,
    comments_count: 12,
    is_liked: true
  },
  {
    id: 'a4',
    type: 'text',
    title: 'Beneficios de la práctica matutina',
    body: 'Buenos días, yoguis! 🌅\n\nQuería hablaros de algo que ha transformado mi vida: la práctica matutina. No tiene que ser larga, incluso 10-15 minutos pueden marcar la diferencia en tu día.\n\n¿Habéis probado alguna vez hacer yoga o meditación por la mañana? ¡Contadme vuestra experiencia en los comentarios!',
    is_pinned: false,
    author: {
      name: 'Lidia',
      avatar_url: 'https://images.pexels.com/photos/3823063/pexels-photo-3823063.jpeg?auto=compress&cs=tinysrgb&w=100'
    },
    published_at: '2024-01-17T08:00:00Z',
    likes_count: 28,
    comments_count: 15,
    is_liked: false
  },
  {
    id: 'a5',
    type: 'image',
    title: 'Nueva incorporación: Clases con Fitball',
    body: 'Estoy súper emocionada de anunciar que vamos a incorporar clases con fitball a nuestra plataforma. El trabajo con pelota nos permite explorar el equilibrio y la fuerza de una manera diferente y muy divertida.',
    media_url: 'https://images.pexels.com/photos/3775593/pexels-photo-3775593.jpeg?auto=compress&cs=tinysrgb&w=600',
    is_pinned: false,
    author: {
      name: 'Lidia',
      avatar_url: 'https://images.pexels.com/photos/3823063/pexels-photo-3823063.jpeg?auto=compress&cs=tinysrgb&w=100'
    },
    published_at: '2024-01-15T11:20:00Z',
    likes_count: 19,
    comments_count: 7,
    is_liked: true
  }
];

export default function Announcements() {
  const { user } = useAuth();
  const [likedPosts, setLikedPosts] = useState<Set<string>>(
    new Set(allAnnouncements.filter(a => a.is_liked).map(a => a.id))
  );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return 'Hoy';
    } else if (diffDays === 1) {
      return 'Ayer';
    } else if (diffDays < 7) {
      return `Hace ${diffDays} días`;
    } else {
      return date.toLocaleDateString('es-ES', {
        day: 'numeric',
        month: 'long'
      });
    }
  };

  const toggleLike = (postId: string) => {
    setLikedPosts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(postId)) {
        newSet.delete(postId);
      } else {
        newSet.add(postId);
      }
      return newSet;
    });
  };

  const getMediaIcon = (type: Announcement['type']) => {
    switch (type) {
      case 'image':
        return <ImageIcon className="w-4 h-4" />;
      case 'video':
        return <Play className="w-4 h-4" />;
      default:
        return null;
    }
  };

  // Separate pinned and regular posts
  const pinnedPosts = allAnnouncements.filter(a => a.is_pinned);
  const regularPosts = allAnnouncements.filter(a => !a.is_pinned).sort(
    (a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime()
  );

  const renderPost = (announcement: Announcement) => (
    <article key={announcement.id} className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full overflow-hidden bg-green-100">
              {announcement.author.avatar_url ? (
                <img 
                  src={announcement.author.avatar_url} 
                  alt={announcement.author.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-green-600 font-semibold">
                  {announcement.author.name.charAt(0)}
                </div>
              )}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-semibold text-gray-900">{announcement.author.name}</h3>
                {announcement.is_pinned && (
                  <Pin className="w-4 h-4 text-green-600" />
                )}
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <span>{formatDate(announcement.published_at)}</span>
                {getMediaIcon(announcement.type)}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h2 className="text-lg font-semibold text-gray-900 mb-2">
          {announcement.title}
        </h2>
        <p className="text-gray-700 whitespace-pre-line mb-4">
          {announcement.body}
        </p>

        {/* Media */}
        {announcement.media_url && (
          <div className="mb-4 rounded-xl overflow-hidden">
            {announcement.type === 'video' ? (
              <div className="relative aspect-video bg-gray-100">
                <img
                  src={announcement.media_url}
                  alt="Video thumbnail"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40">
                  <div className="w-16 h-16 bg-white bg-opacity-90 rounded-full flex items-center justify-center">
                    <Play className="w-8 h-8 text-gray-800 ml-1" />
                  </div>
                </div>
              </div>
            ) : (
              <img
                src={announcement.media_url}
                alt={announcement.title}
                className="w-full h-auto max-h-96 object-cover"
              />
            )}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="px-4 py-3 border-t border-gray-100 bg-gray-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <button
              onClick={() => user && toggleLike(announcement.id)}
              disabled={!user}
              className={`flex items-center space-x-2 text-sm transition-colors ${
                likedPosts.has(announcement.id) && user
                  ? 'text-red-600'
                  : 'text-gray-600 hover:text-red-600'
              } ${!user ? 'cursor-not-allowed opacity-50' : ''}`}
            >
              <Heart 
                className={`w-5 h-5 ${likedPosts.has(announcement.id) && user ? 'fill-current' : ''}`} 
              />
              <span>
                {announcement.likes_count + (likedPosts.has(announcement.id) && user ? 
                  (announcement.is_liked ? 0 : 1) : 
                  (announcement.is_liked ? -1 : 0)
                )}
              </span>
            </button>
            
            <button className="flex items-center space-x-2 text-sm text-gray-600 hover:text-green-600 transition-colors">
              <MessageSquare className="w-5 h-5" />
              <span>{announcement.comments_count}</span>
            </button>
          </div>
          
          <button className="text-gray-400 hover:text-gray-600 transition-colors">
            <Share2 className="w-5 h-5" />
          </button>
        </div>
      </div>
    </article>
  );

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Novedades</h1>
        <p className="text-gray-600">
          Mantente al día con las últimas noticias, tips y actualizaciones
        </p>
      </div>

      {!user && (
        <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">
            ¡No te pierdas nada!
          </h2>
          <p className="text-gray-600 mb-4">
            Inicia sesión para interactuar con las publicaciones y mantenerte conectada con la comunidad.
          </p>
          <button className="bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors">
            Iniciar sesión
          </button>
        </div>
      )}

      {/* Posts Feed */}
      <div className="space-y-6">
        {/* Pinned posts first */}
        {pinnedPosts.map(renderPost)}
        
        {/* Regular posts */}
        {regularPosts.map(renderPost)}
      </div>

      {/* Load more */}
      <div className="text-center mt-8">
        <button className="bg-white border border-gray-300 text-gray-700 px-6 py-2 rounded-lg font-medium hover:bg-gray-50 transition-colors">
          Cargar más publicaciones
        </button>
      </div>
    </div>
  );
}