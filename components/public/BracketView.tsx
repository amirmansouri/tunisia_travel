'use client';

import { TournamentMatch } from '@/types/database';
import { getCountryFlag } from '@/lib/tournament-utils';
import { useLanguage } from '@/lib/i18n';
import { cn } from '@/lib/utils';

interface BracketViewProps {
  matches: TournamentMatch[];
}

function BracketMatch({ match, label }: { match: TournamentMatch | null; label: string }) {
  if (!match) return null;
  const isLive = match.status === 'live';
  const isFinished = match.status === 'finished';
  const winnerIsA = isFinished && match.score_a > match.score_b;
  const winnerIsB = isFinished && match.score_b > match.score_a;

  return (
    <div className="w-full">
      <div className="text-xs text-gray-400 font-medium mb-1 uppercase tracking-wider">{label}</div>
      <div className={cn(
        'rounded-lg overflow-hidden border',
        isLive ? 'border-red-300 shadow-md' : 'border-gray-200'
      )}>
        {/* Team A */}
        <div className={cn(
          'flex items-center justify-between px-3 py-2 text-sm',
          winnerIsA ? 'bg-green-50 font-bold' : 'bg-white'
        )}>
          <span className="truncate flex-1">
            {match.team_a ? (
              <>{match.team_a.country && <span className="mr-1">{getCountryFlag(match.team_a.country)}</span>}{match.team_a.name}</>
            ) : (
              <span className="text-gray-300">TBD</span>
            )}
          </span>
          <span className={cn(
            'font-bold tabular-nums ml-2',
            winnerIsA ? 'text-green-700' : 'text-gray-600'
          )}>
            {match.score_a}
          </span>
        </div>
        {/* Divider */}
        <div className="h-px bg-gray-200" />
        {/* Team B */}
        <div className={cn(
          'flex items-center justify-between px-3 py-2 text-sm',
          winnerIsB ? 'bg-green-50 font-bold' : 'bg-white'
        )}>
          <span className="truncate flex-1">
            {match.team_b ? (
              <>{match.team_b.country && <span className="mr-1">{getCountryFlag(match.team_b.country)}</span>}{match.team_b.name}</>
            ) : (
              <span className="text-gray-300">TBD</span>
            )}
          </span>
          <span className={cn(
            'font-bold tabular-nums ml-2',
            winnerIsB ? 'text-green-700' : 'text-gray-600'
          )}>
            {match.score_b}
          </span>
        </div>
      </div>
      {isLive && (
        <div className="flex items-center gap-1 mt-1">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-400"></span>
          </span>
          <span className="text-xs text-red-600 font-bold">LIVE</span>
        </div>
      )}
    </div>
  );
}

export default function BracketView({ matches }: BracketViewProps) {
  const { t } = useLanguage();

  const quarters = matches.filter(m => m.round_type === 'quarter').sort((a, b) => a.match_number - b.match_number);
  const semis = matches.filter(m => m.round_type === 'semi').sort((a, b) => a.match_number - b.match_number);
  const final = matches.find(m => m.round_type === 'final');
  const thirdPlace = matches.find(m => m.round_type === '3rd_place');

  const hasQuarters = quarters.length > 0;

  if (!final && semis.length === 0 && quarters.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        {t.tournament?.noBracket || 'Knockout bracket not yet generated.'}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Bracket Grid */}
      <div className="overflow-x-auto">
        <div className={cn(
          'grid gap-6 min-w-[600px]',
          hasQuarters ? 'grid-cols-3' : 'grid-cols-2'
        )}>
          {/* Quarter Finals */}
          {hasQuarters && (
            <div className="space-y-4">
              <h4 className="font-bold text-gray-700 text-sm uppercase tracking-wider">
                {t.tournament?.quarterFinal || 'Quarter Finals'}
              </h4>
              {quarters.map((m, i) => (
                <BracketMatch key={m.id} match={m} label={`QF${i + 1}`} />
              ))}
            </div>
          )}

          {/* Semi Finals */}
          <div className="space-y-4">
            <h4 className="font-bold text-gray-700 text-sm uppercase tracking-wider">
              {t.tournament?.semiFinal || 'Semi Finals'}
            </h4>
            <div className={cn(hasQuarters ? 'mt-8' : '')}>
              {semis.map((m, i) => (
                <div key={m.id} className={i > 0 ? 'mt-4' : ''}>
                  <BracketMatch match={m} label={`SF${i + 1}`} />
                </div>
              ))}
            </div>
          </div>

          {/* Final & 3rd Place */}
          <div className="space-y-6">
            <div>
              <h4 className="font-bold text-gray-700 text-sm uppercase tracking-wider">
                {t.tournament?.final || 'Final'}
              </h4>
              <div className={cn(hasQuarters ? 'mt-12' : 'mt-4')}>
                <BracketMatch match={final || null} label="Final" />
              </div>
            </div>

            {thirdPlace && (
              <div>
                <h4 className="font-bold text-gray-700 text-sm uppercase tracking-wider">
                  {t.tournament?.thirdPlace || '3rd Place'}
                </h4>
                <div className="mt-2">
                  <BracketMatch match={thirdPlace} label="3rd" />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Winner */}
      {final && final.status === 'finished' && (
        <div className="text-center py-6 bg-gradient-to-r from-amber-50 to-yellow-50 rounded-2xl border border-amber-200">
          <span className="text-4xl">🏆</span>
          <h3 className="text-2xl font-bold text-gray-900 mt-2">
            {final.score_a > final.score_b
              ? (final.team_a ? `${final.team_a.country ? getCountryFlag(final.team_a.country) + ' ' : ''}${final.team_a.name}` : 'Team A')
              : (final.team_b ? `${final.team_b.country ? getCountryFlag(final.team_b.country) + ' ' : ''}${final.team_b.name}` : 'Team B')
            }
          </h3>
          <p className="text-amber-700 font-medium mt-1">
            {t.tournament?.champion || 'Champion'}
          </p>
        </div>
      )}
    </div>
  );
}
