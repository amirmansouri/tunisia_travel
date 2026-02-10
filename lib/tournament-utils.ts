import { TournamentTeam, TournamentMatch, TournamentStanding } from '@/types/database';

/**
 * Convert a 2-letter country code to a flag emoji
 */
export function getCountryFlag(code: string | null): string {
  if (!code || code.length !== 2) return '';
  const upper = code.toUpperCase();
  return String.fromCodePoint(
    ...Array.from(upper).map((c) => 0x1f1e6 + c.charCodeAt(0) - 65)
  );
}

/**
 * Convert pool index to letter: 0→'A', 1→'B', etc.
 */
export function getPoolLabel(index: number): string {
  return String.fromCharCode(65 + index);
}

/**
 * Generate round-robin matches for teams in a single pool
 */
export function generatePoolMatches(
  teams: TournamentTeam[],
  pool: string,
  tournamentId: string,
  startMatchNumber: number
): Array<{
  tournament_id: string;
  round_type: 'pool';
  pool: string;
  match_number: number;
  team_a_id: string;
  team_b_id: string;
  score_a: number;
  score_b: number;
  status: 'scheduled';
}> {
  const matches: Array<{
    tournament_id: string;
    round_type: 'pool';
    pool: string;
    match_number: number;
    team_a_id: string;
    team_b_id: string;
    score_a: number;
    score_b: number;
    status: 'scheduled';
  }> = [];

  let matchNum = startMatchNumber;

  for (let i = 0; i < teams.length; i++) {
    for (let j = i + 1; j < teams.length; j++) {
      matches.push({
        tournament_id: tournamentId,
        round_type: 'pool',
        pool,
        match_number: matchNum++,
        team_a_id: teams[i].id,
        team_b_id: teams[j].id,
        score_a: 0,
        score_b: 0,
        status: 'scheduled',
      });
    }
  }

  return matches;
}

/**
 * Recalculate standings from finished matches for a given pool
 */
export function recalcStandings(
  matches: TournamentMatch[],
  teams: TournamentTeam[],
  tournamentId: string,
  pool: string
): Array<Omit<TournamentStanding, 'id' | 'team'>> {
  const statsMap = new Map<string, {
    played: number;
    won: number;
    lost: number;
    drawn: number;
    points_for: number;
    points_against: number;
    points: number;
  }>();

  // Init stats for all teams in this pool
  for (const team of teams) {
    statsMap.set(team.id, {
      played: 0,
      won: 0,
      lost: 0,
      drawn: 0,
      points_for: 0,
      points_against: 0,
      points: 0,
    });
  }

  // Process finished matches
  for (const match of matches) {
    if (match.status !== 'finished') continue;
    if (!match.team_a_id || !match.team_b_id) continue;

    const statsA = statsMap.get(match.team_a_id);
    const statsB = statsMap.get(match.team_b_id);
    if (!statsA || !statsB) continue;

    statsA.played++;
    statsB.played++;
    statsA.points_for += match.score_a;
    statsA.points_against += match.score_b;
    statsB.points_for += match.score_b;
    statsB.points_against += match.score_a;

    if (match.score_a > match.score_b) {
      statsA.won++;
      statsA.points += 3;
      statsB.lost++;
    } else if (match.score_b > match.score_a) {
      statsB.won++;
      statsB.points += 3;
      statsA.lost++;
    } else {
      statsA.drawn++;
      statsB.drawn++;
      statsA.points += 1;
      statsB.points += 1;
    }
  }

  // Sort by points, then point difference, then points_for
  const sorted = teams
    .map((team) => ({
      team_id: team.id,
      ...statsMap.get(team.id)!,
    }))
    .sort((a, b) => {
      if (b.points !== a.points) return b.points - a.points;
      const diffA = a.points_for - a.points_against;
      const diffB = b.points_for - b.points_against;
      if (diffB !== diffA) return diffB - diffA;
      return b.points_for - a.points_for;
    });

  return sorted.map((s, i) => ({
    tournament_id: tournamentId,
    team_id: s.team_id,
    pool,
    played: s.played,
    won: s.won,
    lost: s.lost,
    drawn: s.drawn,
    points_for: s.points_for,
    points_against: s.points_against,
    points: s.points,
    rank: i + 1,
  }));
}
