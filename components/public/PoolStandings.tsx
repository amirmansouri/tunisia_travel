'use client';

import { TournamentStanding } from '@/types/database';
import { getCountryFlag } from '@/lib/tournament-utils';
import { useLanguage } from '@/lib/i18n';

interface PoolStandingsProps {
  standings: TournamentStanding[];
  pool: string;
}

export default function PoolStandings({ standings, pool }: PoolStandingsProps) {
  const { t } = useLanguage();

  const sorted = [...standings].sort((a, b) => a.rank - b.rank);

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="bg-gradient-to-r from-gray-800 to-gray-900 px-4 py-3">
        <h3 className="font-bold text-white">
          {t.tournament?.poolStage || 'Pool'} {pool}
        </h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b bg-gray-50">
              <th className="px-3 py-2 text-left text-xs font-semibold text-gray-500 uppercase">#</th>
              <th className="px-3 py-2 text-left text-xs font-semibold text-gray-500 uppercase">
                {t.tournament?.teams || 'Team'}
              </th>
              <th className="px-3 py-2 text-center text-xs font-semibold text-gray-500 uppercase">P</th>
              <th className="px-3 py-2 text-center text-xs font-semibold text-gray-500 uppercase">W</th>
              <th className="px-3 py-2 text-center text-xs font-semibold text-gray-500 uppercase">D</th>
              <th className="px-3 py-2 text-center text-xs font-semibold text-gray-500 uppercase">L</th>
              <th className="px-3 py-2 text-center text-xs font-semibold text-gray-500 uppercase">+/-</th>
              <th className="px-3 py-2 text-center text-xs font-semibold text-gray-500 uppercase font-bold">Pts</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {sorted.map((s, idx) => (
              <tr key={s.id} className={idx < 2 ? 'bg-green-50/50' : ''}>
                <td className="px-3 py-2.5 text-sm font-bold text-gray-400">{s.rank || idx + 1}</td>
                <td className="px-3 py-2.5 text-sm font-medium text-gray-900">
                  {s.team?.country && <span className="mr-1.5">{getCountryFlag(s.team.country)}</span>}
                  {s.team?.name || '—'}
                </td>
                <td className="px-3 py-2.5 text-sm text-center text-gray-600">{s.played}</td>
                <td className="px-3 py-2.5 text-sm text-center text-green-600 font-medium">{s.won}</td>
                <td className="px-3 py-2.5 text-sm text-center text-gray-500">{s.drawn}</td>
                <td className="px-3 py-2.5 text-sm text-center text-red-500">{s.lost}</td>
                <td className="px-3 py-2.5 text-sm text-center">
                  <span className={s.points_for - s.points_against > 0 ? 'text-green-600' : s.points_for - s.points_against < 0 ? 'text-red-500' : 'text-gray-500'}>
                    {s.points_for - s.points_against > 0 ? '+' : ''}{s.points_for - s.points_against}
                  </span>
                </td>
                <td className="px-3 py-2.5 text-sm text-center font-bold text-gray-900">{s.points}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
