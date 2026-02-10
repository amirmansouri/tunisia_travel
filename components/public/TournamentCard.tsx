'use client';

import Link from 'next/link';
import { MapPin, Calendar, Users } from 'lucide-react';
import { Tournament } from '@/types/database';
import { useLanguage } from '@/lib/i18n';
import { cn } from '@/lib/utils';

interface TournamentCardProps {
  tournament: Tournament & { team_count?: number };
}

const statusColors: Record<string, string> = {
  registration: 'bg-blue-100 text-blue-700',
  pools: 'bg-amber-100 text-amber-700',
  knockout: 'bg-purple-100 text-purple-700',
  finished: 'bg-gray-100 text-gray-600',
};

export default function TournamentCard({ tournament }: TournamentCardProps) {
  const { t, language } = useLanguage();
  const locale = language === 'ar' ? 'ar-TN' : language === 'fr' ? 'fr-FR' : 'en-US';

  const statusLabels: Record<string, string> = {
    registration: t.tournament?.registration || 'Registration',
    pools: t.tournament?.pools || 'Pool Stage',
    knockout: t.tournament?.knockout || 'Knockout',
    finished: t.tournament?.finished || 'Finished',
  };

  return (
    <Link
      href={`/tournaments/${tournament.id}`}
      className="group block bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100"
    >
      {/* Image */}
      <div className="relative h-48 bg-gradient-to-br from-tunisia-red/10 to-tunisia-sand/10 overflow-hidden">
        {tournament.image_url ? (
          <img
            src={tournament.image_url}
            alt={tournament.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <span className="text-6xl">🏆</span>
          </div>
        )}
        <div className="absolute top-3 right-3">
          <span className={cn(
            'px-3 py-1 rounded-full text-xs font-bold uppercase',
            statusColors[tournament.status]
          )}>
            {statusLabels[tournament.status]}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="font-bold text-lg text-gray-900 group-hover:text-tunisia-red transition-colors line-clamp-2">
          {tournament.name}
        </h3>
        {tournament.description && (
          <p className="text-gray-500 text-sm mt-2 line-clamp-2">{tournament.description}</p>
        )}
        <div className="flex flex-wrap items-center gap-3 mt-4 text-xs text-gray-500">
          {tournament.location && (
            <span className="flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5" />
              {tournament.location}
            </span>
          )}
          {tournament.start_date && (
            <span className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" />
              {new Date(tournament.start_date).toLocaleDateString(locale, {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
              })}
            </span>
          )}
          {tournament.team_count !== undefined && (
            <span className="flex items-center gap-1">
              <Users className="h-3.5 w-3.5" />
              {tournament.team_count} / {tournament.max_teams} {t.tournament?.teams || 'teams'}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
