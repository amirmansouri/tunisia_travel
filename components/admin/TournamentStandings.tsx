'use client';

import { TournamentStanding } from '@/types/database';
import { getCountryFlag } from '@/lib/tournament-utils';

interface TournamentStandingsProps {
  standings: TournamentStanding[];
}

export default function TournamentStandings({ standings }: TournamentStandingsProps) {
  if (standings.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No standings yet. Generate pool matches and update scores first.
      </div>
    );
  }

  // Group by pool
  const poolGroups = new Map<string, TournamentStanding[]>();
  for (const s of standings) {
    const group = poolGroups.get(s.pool) || [];
    group.push(s);
    poolGroups.set(s.pool, group);
  }

  // Sort each pool by rank
  for (const [, group] of poolGroups) {
    group.sort((a, b) => a.rank - b.rank);
  }

  return (
    <div className="space-y-6">
      {Array.from(poolGroups.entries())
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([pool, poolStandings]) => (
          <div key={pool} className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="bg-gray-50 px-4 py-3 border-b">
              <h3 className="font-semibold text-gray-700">Pool {pool}</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="px-3 py-2 text-left text-xs font-semibold text-gray-500 uppercase">#</th>
                    <th className="px-3 py-2 text-left text-xs font-semibold text-gray-500 uppercase">Team</th>
                    <th className="px-3 py-2 text-center text-xs font-semibold text-gray-500 uppercase">P</th>
                    <th className="px-3 py-2 text-center text-xs font-semibold text-gray-500 uppercase">W</th>
                    <th className="px-3 py-2 text-center text-xs font-semibold text-gray-500 uppercase">D</th>
                    <th className="px-3 py-2 text-center text-xs font-semibold text-gray-500 uppercase">L</th>
                    <th className="px-3 py-2 text-center text-xs font-semibold text-gray-500 uppercase">PF</th>
                    <th className="px-3 py-2 text-center text-xs font-semibold text-gray-500 uppercase">PA</th>
                    <th className="px-3 py-2 text-center text-xs font-semibold text-gray-500 uppercase">+/-</th>
                    <th className="px-3 py-2 text-center text-xs font-semibold text-gray-500 uppercase font-bold">Pts</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {poolStandings.map((s, idx) => (
                    <tr key={s.id} className={idx < 2 ? 'bg-green-50/50' : ''}>
                      <td className="px-3 py-2 text-sm font-bold text-gray-500">{s.rank || idx + 1}</td>
                      <td className="px-3 py-2 text-sm font-medium text-gray-900">
                        {s.team?.country && <span className="mr-1">{getCountryFlag(s.team.country)}</span>}
                        {s.team?.name || '—'}
                      </td>
                      <td className="px-3 py-2 text-sm text-center text-gray-600">{s.played}</td>
                      <td className="px-3 py-2 text-sm text-center text-green-600 font-medium">{s.won}</td>
                      <td className="px-3 py-2 text-sm text-center text-gray-500">{s.drawn}</td>
                      <td className="px-3 py-2 text-sm text-center text-red-500">{s.lost}</td>
                      <td className="px-3 py-2 text-sm text-center text-gray-600">{s.points_for}</td>
                      <td className="px-3 py-2 text-sm text-center text-gray-600">{s.points_against}</td>
                      <td className="px-3 py-2 text-sm text-center font-medium">
                        <span className={s.points_for - s.points_against > 0 ? 'text-green-600' : s.points_for - s.points_against < 0 ? 'text-red-500' : 'text-gray-500'}>
                          {s.points_for - s.points_against > 0 ? '+' : ''}{s.points_for - s.points_against}
                        </span>
                      </td>
                      <td className="px-3 py-2 text-sm text-center font-bold text-gray-900">{s.points}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="px-4 py-2 bg-gray-50 border-t">
              <p className="text-xs text-gray-400">
                Green rows qualify for knockout stage
              </p>
            </div>
          </div>
        ))}
    </div>
  );
}
