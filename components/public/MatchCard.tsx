'use client';

import { Clock, MapPin } from 'lucide-react';
import { TournamentMatch } from '@/types/database';
import { getCountryFlag } from '@/lib/tournament-utils';
import { useLanguage } from '@/lib/i18n';
import { cn } from '@/lib/utils';

interface MatchCardProps {
  match: TournamentMatch;
}

const statusColors: Record<string, { bg: string; text: string }> = {
  scheduled: { bg: 'bg-gray-100', text: 'text-gray-600' },
  live: { bg: 'bg-red-100', text: 'text-red-700' },
  finished: { bg: 'bg-green-100', text: 'text-green-700' },
};

export default function MatchCard({ match }: MatchCardProps) {
  const { language } = useLanguage();
  const locale = language === 'ar' ? 'ar-TN' : language === 'fr' ? 'fr-FR' : 'en-US';
  const isLive = match.status === 'live';
  const config = statusColors[match.status] || statusColors.scheduled;

  return (
    <div className={cn(
      'bg-white rounded-xl p-4 transition-all',
      isLive ? 'ring-2 ring-red-300 shadow-md' : 'shadow-sm'
    )}>
      <div className="flex items-center justify-between mb-3">
        {/* Status */}
        <span className={cn(
          'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold uppercase',
          config.bg, config.text
        )}>
          {isLive && (
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-400"></span>
            </span>
          )}
          {match.status}
        </span>

        {/* Pool/Round */}
        {match.pool && (
          <span className="text-xs text-gray-400 font-medium">Pool {match.pool}</span>
        )}
      </div>

      {/* Teams & Score */}
      <div className="flex items-center gap-3">
        {/* Team A */}
        <div className="flex-1 text-right">
          <p className="font-semibold text-sm text-gray-900 truncate">
            {match.team_a ? (
              <>{match.team_a.country && getCountryFlag(match.team_a.country)} {match.team_a.name}</>
            ) : (
              <span className="text-gray-400">TBD</span>
            )}
          </p>
        </div>

        {/* Score */}
        <div className={cn(
          'flex items-center gap-2 px-3 py-1.5 rounded-lg font-bold tabular-nums text-lg min-w-[80px] justify-center',
          isLive ? 'bg-red-50 text-red-700' : 'bg-gray-50 text-gray-800'
        )}>
          <span>{match.score_a}</span>
          <span className="text-gray-300">-</span>
          <span>{match.score_b}</span>
        </div>

        {/* Team B */}
        <div className="flex-1">
          <p className="font-semibold text-sm text-gray-900 truncate">
            {match.team_b ? (
              <>{match.team_b.country && getCountryFlag(match.team_b.country)} {match.team_b.name}</>
            ) : (
              <span className="text-gray-400">TBD</span>
            )}
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center gap-3 mt-3 text-xs text-gray-400">
        {match.scheduled_time && (
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {new Date(match.scheduled_time).toLocaleDateString(locale, {
              day: 'numeric',
              month: 'short',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </span>
        )}
        {match.court && (
          <span className="flex items-center gap-1">
            <MapPin className="h-3 w-3" />
            {match.court}
          </span>
        )}
      </div>
    </div>
  );
}
