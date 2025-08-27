import React from 'react';
import { Play, Lock, Heart, Clock, Star } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';

export interface Content {
  id: string;
  title: string;
  description: string;
  duration_sec: number;
  category: string;
  thumbnail_url: string;
  visibility: 'public_sample' | 'members';
  is_favorite?: boolean;
  is_completed?: boolean;
  progress_percent?: number;
}

interface ContentCardProps {
  content: Content;
  showCategory?: boolean;
}

export default function ContentCard({ content, showCategory = false }: ContentCardProps) {
  const { hasAccess } = useAuth();
  const canAccess = hasAccess() || content.visibility === 'public_sample';
  
  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    return `${minutes} min`;
  };

  const CardContent = () => (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
      <div className="relative aspect-video">
        <img
          src={content.thumbnail_url}
          alt={content.title}
          className="w-full h-full object-cover"
        />
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
          {canAccess ? (
            <div className="w-12 h-12 bg-white bg-opacity-90 rounded-full flex items-center justify-center">
              <Play className="w-6 h-6 text-green-600 ml-1" />
            </div>
          ) : (
            <div className="w-12 h-12 bg-black bg-opacity-70 rounded-full flex items-center justify-center">
              <Lock className="w-6 h-6 text-white" />
            </div>
          )}
        </div>

        {/* Duration */}
        <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
          {formatDuration(content.duration_sec)}
        </div>

        {/* Progress bar */}
        {content.progress_percent && content.progress_percent > 0 && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-black bg-opacity-30">
            <div
              className="h-full bg-green-500"
              style={{ width: `${content.progress_percent}%` }}
            />
          </div>
        )}

        {/* Completion badge */}
        {content.is_completed && (
          <div className="absolute top-2 right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
            <Star className="w-4 h-4 text-white" fill="currentColor" />
          </div>
        )}
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 line-clamp-2">
              {content.title}
            </h3>
            {showCategory && (
              <p className="text-sm text-green-600 font-medium mt-1">
                {content.category}
              </p>
            )}
            <p className="text-sm text-gray-600 mt-1 line-clamp-2">
              {content.description}
            </p>
          </div>
          
          {content.is_favorite && (
            <Heart className="w-5 h-5 text-red-500 ml-2 flex-shrink-0" fill="currentColor" />
          )}
        </div>

        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center text-sm text-gray-500">
            <Clock className="w-4 h-4 mr-1" />
            {formatDuration(content.duration_sec)}
          </div>
          
          {!canAccess && (
            <span className="text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded-full">
              Premium
            </span>
          )}
        </div>
      </div>
    </div>
  );

  if (canAccess) {
    return (
      <Link to={`/watch/${content.id}`}>
        <CardContent />
      </Link>
    );
  }

  return (
    <div className="relative">
      <CardContent />
      {!canAccess && (
        <Link
          to="/checkout"
          className="absolute inset-0 bg-black bg-opacity-50 rounded-lg flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity"
        >
          <div className="text-center text-white">
            <Lock className="w-8 h-8 mx-auto mb-2" />
            <p className="text-sm font-medium">Desbloquear contenido</p>
          </div>
        </Link>
      )}
    </div>
  );
}