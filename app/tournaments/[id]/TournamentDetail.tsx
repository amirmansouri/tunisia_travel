'use client';

import { useState } from 'react';
import Link from 'next/link';
import { MapPin, Calendar, Users, Trophy } from 'lucide-react';
import { Tournament, TournamentTeam, TournamentMatch, TournamentStanding } from '@/types/database';
import { useLanguage } from '@/lib/i18n';
import { getCountryFlag } from '@/lib/tournament-utils';
import { cn } from '@/lib/utils';
import PoolStandings from '@/components/public/PoolStandings';
import MatchCard from '@/components/public/MatchCard';
import BracketView from '@/components/public/BracketView';

interface TournamentDetailProps {
  tournament: Tournament;
  teams: TournamentTeam[];
  matches: TournamentMatch[];
  standings: TournamentStanding[];
}

type Tab = 'overview' | 'teams' | 'schedule' | 'standings' | 'bracket';

const statusColors: Record<string, string> = {
  registration: 'bg-blue-100 text-blue-700',
  pools: 'bg-amber-100 text-amber-700',
  knockout: 'bg-purple-100 text-purple-700',
  finished: 'bg-gray-100 text-gray-600',
};

export default function TournamentDetail({ tournament, teams, matches, standings }: TournamentDetailProps) {
  const { t, language } = useLanguage();
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const locale = language === 'ar' ? 'ar-TN' : language === 'fr' ? 'fr-FR' : 'en-US';

  const statusLabels: Record<string, string> = {
    registration: t.tournament?.registration || 'Registration',
    pools: t.tournament?.pools || 'Pool Stage',
    knockout: t.tournament?.knockout || 'Knockout',
    finished: t.tournament?.finished || 'Finished',
  };

  const knockoutMatches = matches.filter(m => m.round_type !== 'pool');
  const poolMatches = matches.filter(m => m.round_type === 'pool');

  // Group standings by pool
  const poolGroups = new Map<string, TournamentStanding[]>();
  for (const s of standings) {
    const group = poolGroups.get(s.pool) || [];
    group.push(s);
    poolGroups.set(s.pool, group);
  }

  // Group pool matches by pool
  const matchesByPool = new Map<string, TournamentMatch[]>();
  for (const m of poolMatches) {
    if (!m.pool) continue;
    const group = matchesByPool.get(m.pool) || [];
    group.push(m);
    matchesByPool.set(m.pool, group);
  }

  const tabs: { key: Tab; label: string }[] = [
    { key: 'overview', label: t.tournament?.overview || 'Overview' },
    { key: 'teams', label: `${t.tournament?.teams || 'Teams'} (${teams.length})` },
    { key: 'schedule', label: t.tournament?.schedule || 'Schedule' },
    { key: 'standings', label: t.tournament?.standings || 'Standings' },
    { key: 'bracket', label: t.tournament?.bracket || 'Bracket' },
  ];

  return (
    <main className="flex-1 bg-gray-50">
      {/* Hero */}
      <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="flex items-center gap-2 text-gray-400 text-sm mb-4">
            <Link href="/tournaments" className="hover:text-white transition-colors">
              {t.tournament?.tournaments || 'Tournaments'}
            </Link>
            <span>/</span>
            <span className="text-white">{tournament.name}</span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Trophy className="h-8 w-8 text-amber-400" />
                <h1 className="text-2xl sm:text-3xl font-bold">{tournament.name}</h1>
              </div>
              <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-gray-400">
                {tournament.location && (
                  <span className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {tournament.location}
                  </span>
                )}
                {tournament.start_date && (
                  <span className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {new Date(tournament.start_date).toLocaleDateString(locale, {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                    {tournament.end_date && (
                      <> — {new Date(tournament.end_date).toLocaleDateString(locale, {
                        day: 'numeric',
                        month: 'long',
                      })}</>
                    )}
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  {teams.length} / {tournament.max_teams} {t.tournament?.teams || 'teams'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className={cn(
                'px-4 py-1.5 rounded-full text-sm font-bold uppercase',
                statusColors[tournament.status]
              )}>
                {statusLabels[tournament.status]}
              </span>
              {tournament.status === 'registration' && (
                <Link
                  href={`/tournaments/${tournament.id}/register`}
                  className="btn-primary text-sm"
                >
                  {t.tournament?.registerTeam || 'Register Team'}
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b bg-white sticky top-16 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-6 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={cn(
                  'py-3 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-colors',
                  activeTab === tab.key
                    ? 'border-tunisia-red text-tunisia-red'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                )}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Overview */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {tournament.description && (
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h2 className="font-bold text-lg text-gray-900 mb-3">
                  {t.tournament?.overview || 'About'}
                </h2>
                <p className="text-gray-600 whitespace-pre-wrap">{tournament.description}</p>
              </div>
            )}

            {/* Quick stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-white rounded-xl p-4 shadow-sm text-center">
                <div className="text-2xl font-bold text-gray-900">{teams.length}</div>
                <div className="text-sm text-gray-500">{t.tournament?.teams || 'Teams'}</div>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-sm text-center">
                <div className="text-2xl font-bold text-gray-900">{tournament.num_pools}</div>
                <div className="text-sm text-gray-500">{t.tournament?.pools || 'Pools'}</div>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-sm text-center">
                <div className="text-2xl font-bold text-gray-900">{matches.length}</div>
                <div className="text-sm text-gray-500">{t.tournament?.matches || 'Matches'}</div>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-sm text-center">
                <div className="text-2xl font-bold text-gray-900">
                  {matches.filter(m => m.status === 'finished').length}
                </div>
                <div className="text-sm text-gray-500">{t.tournament?.finished || 'Finished'}</div>
              </div>
            </div>

            {/* Live matches */}
            {matches.filter(m => m.status === 'live').length > 0 && (
              <div>
                <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                  </span>
                  Live Now
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {matches.filter(m => m.status === 'live').map(m => (
                    <MatchCard key={m.id} match={m} />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Teams */}
        {activeTab === 'teams' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {teams.map((team) => (
              <div key={team.id} className="bg-white rounded-xl p-4 shadow-sm flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center flex-shrink-0">
                  {team.country ? (
                    <span className="text-lg">{getCountryFlag(team.country)}</span>
                  ) : (
                    <span className="text-sm font-bold text-gray-400">{team.name.charAt(0)}</span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 truncate">{team.name}</p>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    {team.country && <span>{team.country}</span>}
                    {team.pool && (
                      <span className="bg-gray-100 px-1.5 py-0.5 rounded text-gray-600 font-medium">
                        Pool {team.pool}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {teams.length === 0 && (
              <div className="col-span-full text-center py-12 text-gray-500">
                No teams registered yet.
              </div>
            )}
          </div>
        )}

        {/* Schedule */}
        {activeTab === 'schedule' && (
          <div className="space-y-8">
            {/* Pool matches by pool */}
            {Array.from(matchesByPool.entries())
              .sort(([a], [b]) => a.localeCompare(b))
              .map(([pool, poolMatchList]) => (
                <div key={pool}>
                  <h3 className="font-bold text-gray-900 mb-3">Pool {pool}</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {poolMatchList.map(m => (
                      <MatchCard key={m.id} match={m} />
                    ))}
                  </div>
                </div>
              ))}

            {/* Knockout matches */}
            {knockoutMatches.length > 0 && (
              <div>
                <h3 className="font-bold text-gray-900 mb-3">
                  {t.tournament?.knockout || 'Knockout Stage'}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {knockoutMatches.map(m => (
                    <MatchCard key={m.id} match={m} />
                  ))}
                </div>
              </div>
            )}

            {matches.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                No matches scheduled yet.
              </div>
            )}
          </div>
        )}

        {/* Standings */}
        {activeTab === 'standings' && (
          <div className="space-y-6">
            {Array.from(poolGroups.entries())
              .sort(([a], [b]) => a.localeCompare(b))
              .map(([pool, poolStandings]) => (
                <PoolStandings key={pool} standings={poolStandings} pool={pool} />
              ))}
            {standings.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                No standings available yet.
              </div>
            )}
          </div>
        )}

        {/* Bracket */}
        {activeTab === 'bracket' && (
          <BracketView matches={knockoutMatches} />
        )}
      </div>
    </main>
  );
}
