import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient, supabase } from '@/lib/supabase';
import { TournamentMatch, TournamentTeam } from '@/types/database';
import { generatePoolMatches } from '@/lib/tournament-utils';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET - Fetch matches for a tournament
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const resolvedParams = await params;

    const { data, error } = await supabase
      .from('tournament_matches' as never)
      .select('*, team_a:tournament_teams!team_a_id(*), team_b:tournament_teams!team_b_id(*)')
      .eq('tournament_id', resolvedParams.id)
      .order('match_number', { ascending: true })
      .returns<TournamentMatch[]>();

    if (error) throw error;

    return NextResponse.json(data, {
      headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate' },
    });
  } catch (error) {
    console.error('Error fetching matches:', error);
    return NextResponse.json(
      { error: 'Failed to fetch matches' },
      { status: 500 }
    );
  }
}

// POST - Generate pool matches for a tournament (admin only)
export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const resolvedParams = await params;
    const adminClient = createAdminClient();
    const body = await request.json();
    const { action } = body;

    if (action === 'generate_pool_matches') {
      // Get all teams grouped by pool
      const { data: teams, error: teamsError } = await adminClient
        .from('tournament_teams' as never)
        .select('*')
        .eq('tournament_id', resolvedParams.id)
        .not('pool', 'is', null)
        .order('pool', { ascending: true })
        .order('seed', { ascending: true })
        .returns<TournamentTeam[]>();

      if (teamsError) throw teamsError;
      if (!teams || teams.length === 0) {
        return NextResponse.json(
          { error: 'No teams assigned to pools' },
          { status: 400 }
        );
      }

      // Delete existing pool matches
      await adminClient
        .from('tournament_matches' as never)
        .delete()
        .eq('tournament_id', resolvedParams.id)
        .eq('round_type', 'pool');

      // Delete existing standings
      await adminClient
        .from('tournament_standings' as never)
        .delete()
        .eq('tournament_id', resolvedParams.id);

      // Group teams by pool
      const poolGroups = new Map<string, TournamentTeam[]>();
      for (const team of teams) {
        if (!team.pool) continue;
        const group = poolGroups.get(team.pool) || [];
        group.push(team);
        poolGroups.set(team.pool, group);
      }

      // Generate matches for each pool
      let matchNumber = 1;
      const allMatches: ReturnType<typeof generatePoolMatches> = [];

      for (const [pool, poolTeams] of poolGroups) {
        const matches = generatePoolMatches(poolTeams, pool, resolvedParams.id, matchNumber);
        allMatches.push(...matches);
        matchNumber += matches.length;
      }

      if (allMatches.length === 0) {
        return NextResponse.json(
          { error: 'No matches could be generated. Ensure teams are assigned to pools.' },
          { status: 400 }
        );
      }

      // Insert all matches
      const { data: insertedMatches, error: insertError } = await adminClient
        .from('tournament_matches' as never)
        .insert(allMatches as never)
        .select()
        .returns<TournamentMatch[]>();

      if (insertError) throw insertError;

      // Create initial standings for each team
      const standingsData = teams.map((team) => ({
        tournament_id: resolvedParams.id,
        team_id: team.id,
        pool: team.pool!,
        played: 0,
        won: 0,
        lost: 0,
        drawn: 0,
        points_for: 0,
        points_against: 0,
        points: 0,
        rank: 0,
      }));

      await adminClient
        .from('tournament_standings' as never)
        .insert(standingsData as never);

      return NextResponse.json({
        message: `Generated ${insertedMatches?.length || 0} pool matches`,
        matches: insertedMatches,
      }, { status: 201 });
    }

    if (action === 'generate_knockout') {
      // Generate knockout bracket from pool standings
      const { data: standings, error: standingsError } = await adminClient
        .from('tournament_standings' as never)
        .select('*, team:tournament_teams(*)')
        .eq('tournament_id', resolvedParams.id)
        .order('pool', { ascending: true })
        .order('rank', { ascending: true })
        .returns<Array<{ team_id: string; pool: string; rank: number; team: TournamentTeam }>>();

      if (standingsError) throw standingsError;

      // Get top 2 from each pool
      const poolGroups = new Map<string, typeof standings>();
      for (const s of standings || []) {
        const group = poolGroups.get(s.pool) || [];
        group.push(s);
        poolGroups.set(s.pool, group);
      }

      const qualifiedTeams: Array<{ team_id: string; pool: string; rank: number }> = [];
      for (const [, poolStandings] of poolGroups) {
        qualifiedTeams.push(...poolStandings.slice(0, 2));
      }

      if (qualifiedTeams.length < 4) {
        return NextResponse.json(
          { error: 'Not enough qualified teams for knockout stage (need at least 4)' },
          { status: 400 }
        );
      }

      // Delete existing knockout matches
      await adminClient
        .from('tournament_matches' as never)
        .delete()
        .eq('tournament_id', resolvedParams.id)
        .neq('round_type', 'pool');

      const knockoutMatches: Array<{
        tournament_id: string;
        round_type: string;
        pool: null;
        match_number: number;
        team_a_id: string | null;
        team_b_id: string | null;
        score_a: number;
        score_b: number;
        status: string;
      }> = [];

      let matchNum = 100;

      if (qualifiedTeams.length >= 8) {
        // Quarter finals: Pool A 1st vs Pool D 2nd, etc.
        const pools = Array.from(poolGroups.keys()).sort();
        const pairings = [
          [0, 0, pools.length - 1, 1], // Pool A 1st vs Pool D 2nd
          [1, 0, pools.length - 2, 1], // Pool B 1st vs Pool C 2nd
          [2, 0, 1, 1],                // Pool C 1st vs Pool B 2nd
          [3, 0, 0, 1],                // Pool D 1st vs Pool A 2nd
        ];

        for (const [poolAIdx, rankA, poolBIdx, rankB] of pairings) {
          const poolA = pools[poolAIdx];
          const poolB = pools[poolBIdx];
          const teamA = qualifiedTeams.find(t => t.pool === poolA && t.rank === rankA + 1);
          const teamB = qualifiedTeams.find(t => t.pool === poolB && t.rank === rankB + 1);

          knockoutMatches.push({
            tournament_id: resolvedParams.id,
            round_type: 'quarter',
            pool: null,
            match_number: matchNum++,
            team_a_id: teamA?.team_id || null,
            team_b_id: teamB?.team_id || null,
            score_a: 0,
            score_b: 0,
            status: 'scheduled',
          });
        }
      }

      // Semi finals (empty, to be filled after quarters)
      knockoutMatches.push(
        { tournament_id: resolvedParams.id, round_type: 'semi', pool: null, match_number: matchNum++, team_a_id: null, team_b_id: null, score_a: 0, score_b: 0, status: 'scheduled' },
        { tournament_id: resolvedParams.id, round_type: 'semi', pool: null, match_number: matchNum++, team_a_id: null, team_b_id: null, score_a: 0, score_b: 0, status: 'scheduled' }
      );

      // 3rd place
      knockoutMatches.push({
        tournament_id: resolvedParams.id, round_type: '3rd_place', pool: null, match_number: matchNum++, team_a_id: null, team_b_id: null, score_a: 0, score_b: 0, status: 'scheduled',
      });

      // Final
      knockoutMatches.push({
        tournament_id: resolvedParams.id, round_type: 'final', pool: null, match_number: matchNum++, team_a_id: null, team_b_id: null, score_a: 0, score_b: 0, status: 'scheduled',
      });

      // If only 4 teams (2 pools), skip quarters and put them directly in semis
      if (qualifiedTeams.length === 4 && knockoutMatches.length > 0) {
        // Remove quarter matches and use semis directly
        const semiMatches = knockoutMatches.filter(m => m.round_type === 'semi');
        const pools = Array.from(poolGroups.keys()).sort();
        if (semiMatches.length >= 2 && pools.length >= 2) {
          const a1 = qualifiedTeams.find(t => t.pool === pools[0] && t.rank === 1);
          const b2 = qualifiedTeams.find(t => t.pool === pools[1] && t.rank === 2);
          const b1 = qualifiedTeams.find(t => t.pool === pools[1] && t.rank === 1);
          const a2 = qualifiedTeams.find(t => t.pool === pools[0] && t.rank === 2);
          semiMatches[0].team_a_id = a1?.team_id || null;
          semiMatches[0].team_b_id = b2?.team_id || null;
          semiMatches[1].team_a_id = b1?.team_id || null;
          semiMatches[1].team_b_id = a2?.team_id || null;
        }
        // Remove quarter finals
        const filtered = knockoutMatches.filter(m => m.round_type !== 'quarter');
        knockoutMatches.length = 0;
        knockoutMatches.push(...filtered);
      }

      const { data: inserted, error: insertError } = await adminClient
        .from('tournament_matches' as never)
        .insert(knockoutMatches as never)
        .select()
        .returns<TournamentMatch[]>();

      if (insertError) throw insertError;

      return NextResponse.json({
        message: `Generated ${inserted?.length || 0} knockout matches`,
        matches: inserted,
      }, { status: 201 });
    }

    return NextResponse.json(
      { error: 'Invalid action. Use "generate_pool_matches" or "generate_knockout"' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Error generating matches:', error);
    return NextResponse.json(
      { error: 'Failed to generate matches' },
      { status: 500 }
    );
  }
}
