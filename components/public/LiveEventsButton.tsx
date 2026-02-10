'use client';

import { useLanguage } from '@/lib/i18n';
import { Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LiveEventsButtonProps {
  hasEvents: boolean;
  isOpen: boolean;
  onToggle: () => void;
}

export default function LiveEventsButton({ hasEvents, isOpen, onToggle }: LiveEventsButtonProps) {
  const { t } = useLanguage();

  if (!hasEvents) return null;

  return (
    <button
      onClick={onToggle}
      className={cn(
        'relative flex items-center gap-2 px-4 py-2 rounded-full text-sm font-extrabold tracking-wide transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105',
        isOpen
          ? 'bg-gray-900 text-white shadow-gray-900/30'
          : 'bg-gradient-to-r from-red-600 via-red-500 to-orange-500 text-white shadow-red-500/40 animate-pulse-subtle'
      )}
    >
      {/* Glow effect */}
      {!isOpen && (
        <span className="absolute inset-0 rounded-full bg-gradient-to-r from-red-600 via-red-500 to-orange-500 opacity-40 blur-md -z-10"></span>
      )}

      {/* Live dot */}
      <span className="relative flex h-2.5 w-2.5">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white"></span>
      </span>

      <Zap className="h-3.5 w-3.5 fill-current" />

      {t.liveEvents?.live || 'EVENT'}
    </button>
  );
}
