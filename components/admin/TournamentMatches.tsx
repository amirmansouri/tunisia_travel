'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Play, CheckCircle } from 'lucide-react';
import { TournamentMatch } from '@/types/database';
import { getCountryFlag } from '@/lib/tournament-utils';
import { cn } from '@/lib/utils';

interface TournamentMatchesProps {
  tournamentId: string;
  matches: TournamentMatch[];
}

const roundLabels: Record<string, string> = {
  pool: 'Pool Stage',
  quarter: 'Quarter Finals',
  semi: 'Semi Finals',
  '3rd_place': '3rd Place',
  final: 'Final',
};

const statusColors: Record<string, string> = {
  scheduled: 'bg-gray-100 text-gray-600',
  live: 'bg-red-100 text-red-700',
  finished: 'bg-green-100 text-green-700',
};

export default function TournamentMatches({ tournamentId, matches }: TournamentMatchesProps) {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  const [editingMatch, setEditingMatch] = useState<string | null>(null);
  const [scores, setScores] = useState<{ score_a: number; score_b: number }>({ score_a: 0, score_b: 0 });

  const generatePoolMatches = async () => {
    if (!confirm('This will regenerate all pool matches and reset standings. Continue?')) return;
    setGenerating(true);

    try {
      const response = await fetch(`/api/tournaments/${tournamentId}/matches`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'generate_pool_matches' }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to generate matches');
      }

      router.refresh();
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to generate matches');
    } finally {
      setGenerating(false);
    }
  };

  const generateKnockout = async () => {
    if (!confirm('Generate knockout bracket from current pool standings?')) return;
    setGenerating(true);

    try {
      const response = await fetch(`/api/tournaments/${tournamentId}/matches`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'generate_knockout' }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to generate knockout');
      }

      router.refresh();
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to generate knockout');
    } finally {
      setGenerating(false);
    }
  };

  const startEdit = (match: TournamentMatch) => {
    setEditingMatch(match.id);
    setScores({ score_a: match.score_a, score_b: match.score_b });
  };

  const saveScore = async (matchId: string, newStatus?: string) => {
    setLoading(matchId);
    try {
      const body: Record<string, unknown> = {
        score_a: scores.score_a,
        score_b: scores.score_b,
      };
      if (newStatus) body.status = newStatus;

      const response = await fetch(`/api/tournaments/${tournamentId}/matches/${matchId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to update match');
      }

      setEditingMatch(null);
      router.refresh();
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to update');
    } finally {
      setLoading(null);
    }
  };

  const setMatchStatus = async (matchId: string, status: string) => {
    setLoading(matchId);
    try {
      await fetch(`/api/tournaments/${tournamentId}/matches/${matchId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      router.refresh();
    } catch {
      // Silently fail
    } finally {
      setLoading(null);
    }
  };

  // Group matches by round
  const grouped = new Map<string, TournamentMatch[]>();
  for (const match of matches) {
    const key = match.round_type === 'pool' ? `pool_${match.pool}` : match.round_type;
    const group = grouped.get(key) || [];
    group.push(match);
    grouped.set(key, group);
  }

  return (
    <div className="space-y-4">
      {/* Actions */}
      <div className="flex flex-wrap gap-3">
        <button
          onClick={generatePoolMatches}
          disabled={generating}
          className="btn-primary text-sm"
        >
          {generating ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : null}
          Generate Pool Matches
        </button>
        <button
          onClick={generateKnockout}
          disabled={generating}
          className="px-4 py-2 text-sm font-medium bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors disabled:opacity-50"
        >
          {generating ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : null}
          Generate Knockout
        </button>
      </div>

      {matches.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No matches yet. Assign teams to pools and generate matches.
        </div>
      ) : (
        Array.from(grouped.entries()).map(([key, groupMatches]) => (
          <div key={key} className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="bg-gray-50 px-4 py-3 border-b">
              <h3 className="font-semibold text-gray-700">
                {key.startsWith('pool_') ? `Pool ${key.replace('pool_', '')}` : roundLabels[key] || key}
              </h3>
            </div>
            <div className="divide-y divide-gray-100">
              {groupMatches.map((match) => {
                const teamA = match.team_a;
                const teamB = match.team_b;
                const isEditing = editingMatch === match.id;

                return (
                  <div key={match.id} className="px-4 py-3 flex items-center gap-3 hover:bg-gray-50">
                    {/* Match Number */}
                    <span className="text-xs text-gray-400 w-8">#{match.match_number}</span>

                    {/* Team A */}
                    <div className="flex-1 text-right">
                      <span className="text-sm font-medium">
                        {teamA ? (
                          <>{teamA.country && getCountryFlag(teamA.country)} {teamA.name}</>
                        ) : (
                          <span className="text-gray-400">TBD</span>
                        )}
                      </span>
                    </div>

                    {/* Score */}
                    <div className="flex items-center gap-2 min-w-[120px] justify-center">
                      {isEditing ? (
                        <>
                          <input
                            type="number"
                            value={scores.score_a}
                            onChange={(e) => setScores(s => ({ ...s, score_a: parseInt(e.target.value) || 0 }))}
                            className="w-12 text-center border rounded px-1 py-0.5 text-sm"
                            min="0"
                          />
                          <span className="text-gray-400">-</span>
                          <input
                            type="number"
                            value={scores.score_b}
                            onChange={(e) => setScores(s => ({ ...s, score_b: parseInt(e.target.value) || 0 }))}
                            className="w-12 text-center border rounded px-1 py-0.5 text-sm"
                            min="0"
                          />
                        </>
                      ) : (
                        <button
                          onClick={() => startEdit(match)}
                          className="px-3 py-1 rounded bg-gray-100 hover:bg-gray-200 text-sm font-bold tabular-nums transition-colors"
                        >
                          {match.score_a} - {match.score_b}
                        </button>
                      )}
                    </div>

                    {/* Team B */}
                    <div className="flex-1">
                      <span className="text-sm font-medium">
                        {teamB ? (
                          <>{teamB.country && getCountryFlag(teamB.country)} {teamB.name}</>
                        ) : (
                          <span className="text-gray-400">TBD</span>
                        )}
                      </span>
                    </div>

                    {/* Status */}
                    <span className={cn(
                      'px-2 py-0.5 rounded-full text-xs font-medium',
                      statusColors[match.status]
                    )}>
                      {match.status}
                    </span>

                    {/* Actions */}
                    <div className="flex items-center gap-1">
                      {isEditing ? (
                        <>
                          <button
                            onClick={() => saveScore(match.id, 'finished')}
                            disabled={loading === match.id}
                            className="p-1 text-green-600 hover:text-green-700"
                            title="Save & Finish"
                          >
                            {loading === match.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle className="h-4 w-4" />}
                          </button>
                          <button
                            onClick={() => saveScore(match.id)}
                            disabled={loading === match.id}
                            className="text-xs text-blue-600 hover:text-blue-700 px-1"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditingMatch(null)}
                            className="text-xs text-gray-400 hover:text-gray-600 px-1"
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <>
                          {match.status === 'scheduled' && (
                            <button
                              onClick={() => setMatchStatus(match.id, 'live')}
                              disabled={loading === match.id}
                              className="p-1 text-red-500 hover:text-red-600"
                              title="Start Match"
                            >
                              <Play className="h-4 w-4" />
                            </button>
                          )}
                          {match.status === 'live' && (
                            <button
                              onClick={() => startEdit(match)}
                              className="text-xs text-blue-600 hover:text-blue-700 px-1"
                            >
                              Score
                            </button>
                          )}
                        </>
                      )}
                    </div>

                    {/* Court */}
                    {match.court && (
                      <span className="text-xs text-gray-400">{match.court}</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
