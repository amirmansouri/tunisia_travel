'use client';

import { useEffect } from 'react';
import { X, MapPin, Clock, Trophy, Calendar, Flame } from 'lucide-react';
import { useLanguage } from '@/lib/i18n';
import { LiveEvent } from '@/types/database';
import { cn } from '@/lib/utils';

interface LiveEventsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  events: LiveEvent[];
}

const statusConfig: Record<string, { bg: string; text: string; glow: string }> = {
  upcoming: { bg: 'bg-blue-500/20', text: 'text-blue-400', glow: '' },
  live: { bg: 'bg-red-500/20', text: 'text-red-400', glow: 'shadow-red-500/20 shadow-lg' },
  halftime: { bg: 'bg-amber-500/20', text: 'text-amber-400', glow: '' },
  finished: { bg: 'bg-gray-500/20', text: 'text-gray-400', glow: '' },
};

export default function LiveEventsPanel({ isOpen, onClose, events }: LiveEventsPanelProps) {
  const { t, language } = useLanguage();

  const statusLabels: Record<string, string> = {
    upcoming: t.liveEvents?.upcoming || 'Upcoming',
    live: t.liveEvents?.matchLive || 'LIVE',
    halftime: t.liveEvents?.halftime || 'Halftime',
    finished: t.liveEvents?.finished || 'Finished',
  };

  const locale = language === 'ar' ? 'ar-TN' : language === 'fr' ? 'fr-FR' : 'en-US';

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100]">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative flex items-start justify-center pt-20 sm:pt-24 px-4 pb-8 h-full overflow-y-auto">
        <div className="w-full max-w-3xl animate-in fade-in slide-in-from-top-4 duration-300">
          {/* Header */}
          <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 rounded-t-2xl px-6 py-5 flex items-center justify-between border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Flame className="h-6 w-6 text-orange-400" />
              </div>
              <div>
                <h2 className="text-white font-bold text-lg tracking-wide">
                  {t.liveEvents?.panelTitle || 'Live Events'}
                </h2>
                <p className="text-gray-400 text-xs mt-0.5">
                  {events.length} {language === 'fr' ? 'événement(s) actif(s)' : language === 'ar' ? 'أحداث نشطة' : 'active event(s)'}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/10 text-gray-400 hover:text-white hover:bg-white/20 transition-all"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Events */}
          <div className="bg-gray-900/95 backdrop-blur-xl rounded-b-2xl p-4 sm:p-6 space-y-4">
            {events.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">
                  {t.liveEvents?.noEvents || 'No live events at the moment.'}
                </p>
              </div>
            ) : (
              events.map((event) => (
                <div key={event.id}>
                  {event.event_type === 'match' ? (
                    <MatchCard event={event} statusLabels={statusLabels} locale={locale} vsText={t.liveEvents?.vs || 'vs'} />
                  ) : (
                    <GeneralCard event={event} locale={locale} />
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function MatchCard({ event, statusLabels, locale, vsText }: {
  event: LiveEvent;
  statusLabels: Record<string, string>;
  locale: string;
  vsText: string;
}) {
  const status = event.match_status || 'upcoming';
  const config = statusConfig[status] || statusConfig.upcoming;
  const isLive = status === 'live';

  return (
    <div className={cn(
      'rounded-2xl overflow-hidden transition-all',
      isLive ? 'bg-gradient-to-br from-gray-800 via-gray-800 to-red-900/30 ring-1 ring-red-500/30' : 'bg-gray-800/80 ring-1 ring-white/5'
    )}>
      {/* Match header */}
      <div className="px-5 pt-4 pb-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Trophy className="h-4 w-4 text-amber-400" />
          <span className="text-gray-300 text-sm font-medium">{event.name}</span>
        </div>
        <span className={cn(
          'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider',
          config.bg, config.text
        )}>
          {isLive && (
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-400"></span>
            </span>
          )}
          {statusLabels[status]}
        </span>
      </div>

      {/* Scoreboard */}
      <div className="px-5 py-6">
        <div className="flex items-center justify-center">
          {/* Team A */}
          <div className="flex-1 text-center">
            <div className="w-14 h-14 mx-auto rounded-full bg-gradient-to-br from-blue-500/20 to-blue-600/10 flex items-center justify-center mb-3 ring-1 ring-blue-500/20">
              <span className="text-2xl font-black text-white">{event.team_a?.charAt(0) || 'A'}</span>
            </div>
            <p className="text-white font-bold text-sm truncate px-2">{event.team_a}</p>
          </div>

          {/* Score */}
          <div className="px-6 text-center">
            <div className={cn(
              'flex items-center gap-3 px-5 py-3 rounded-2xl',
              isLive ? 'bg-red-500/10 ring-1 ring-red-500/20' : 'bg-white/5 ring-1 ring-white/10'
            )}>
              <span className={cn(
                'text-4xl font-black tabular-nums',
                isLive ? 'text-white' : 'text-gray-200'
              )}>
                {event.score_a ?? 0}
              </span>
              <span className="text-gray-500 text-lg font-bold">:</span>
              <span className={cn(
                'text-4xl font-black tabular-nums',
                isLive ? 'text-white' : 'text-gray-200'
              )}>
                {event.score_b ?? 0}
              </span>
            </div>
            <p className="text-gray-600 text-xs font-medium mt-2 uppercase tracking-wider">{vsText}</p>
          </div>

          {/* Team B */}
          <div className="flex-1 text-center">
            <div className="w-14 h-14 mx-auto rounded-full bg-gradient-to-br from-red-500/20 to-red-600/10 flex items-center justify-center mb-3 ring-1 ring-red-500/20">
              <span className="text-2xl font-black text-white">{event.team_b?.charAt(0) || 'B'}</span>
            </div>
            <p className="text-white font-bold text-sm truncate px-2">{event.team_b}</p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="px-5 pb-4 flex items-center gap-4 text-xs text-gray-500">
        {event.location && (
          <span className="flex items-center gap-1">
            <MapPin className="h-3 w-3" />
            {event.location}
          </span>
        )}
        <span className="flex items-center gap-1">
          <Clock className="h-3 w-3" />
          {new Date(event.event_date).toLocaleDateString(locale, {
            day: 'numeric',
            month: 'short',
            hour: '2-digit',
            minute: '2-digit',
          })}
        </span>
      </div>
    </div>
  );
}

function GeneralCard({ event, locale }: { event: LiveEvent; locale: string }) {
  return (
    <div className="rounded-2xl bg-gray-800/80 ring-1 ring-white/5 overflow-hidden hover:ring-white/10 transition-all">
      <div className="p-5">
        <div className="flex items-start gap-4">
          {/* Icon */}
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center flex-shrink-0 ring-1 ring-blue-500/20">
            <Calendar className="h-5 w-5 text-blue-400" />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <h4 className="text-white font-bold text-base">{event.name}</h4>
            {event.description && (
              <p className="text-gray-400 text-sm mt-1 line-clamp-2 leading-relaxed">{event.description}</p>
            )}
            <div className="flex items-center flex-wrap gap-3 mt-3 text-xs text-gray-500">
              {event.location && (
                <span className="flex items-center gap-1 bg-white/5 px-2.5 py-1 rounded-full">
                  <MapPin className="h-3 w-3" />
                  {event.location}
                </span>
              )}
              <span className="flex items-center gap-1 bg-white/5 px-2.5 py-1 rounded-full">
                <Clock className="h-3 w-3" />
                {new Date(event.event_date).toLocaleDateString(locale, {
                  day: 'numeric',
                  month: 'short',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
