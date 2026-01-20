'use client';

import { Heart } from 'lucide-react';
import { useFavorites } from '@/lib/favorites';
import { useLanguage } from '@/lib/i18n';
import { cn } from '@/lib/utils';

interface FavoriteButtonProps {
  programId: string;
  className?: string;
}

export default function FavoriteButton({ programId, className }: FavoriteButtonProps) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const { t } = useLanguage();
  const favorite = isFavorite(programId);

  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleFavorite(programId);
      }}
      className={cn(
        'p-2 rounded-full transition-all',
        favorite
          ? 'bg-tunisia-red text-white'
          : 'bg-white/80 text-gray-600 hover:bg-white hover:text-tunisia-red',
        className
      )}
      aria-label={favorite ? t.favorites.remove : t.favorites.add}
      title={favorite ? t.favorites.remove : t.favorites.add}
    >
      <Heart className={cn('h-5 w-5', favorite && 'fill-current')} />
    </button>
  );
}
