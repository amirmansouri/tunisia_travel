import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase';
import { TournamentMatch, TournamentTeam } from '@/types/database';
import { recalcStandings } from '@/lib/tournament-utils';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface RouteParams {
  params: Promise<{ id: string; matchId: string }>;
}

// PATCH - Update match score/status (admin only)
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const resolvedParams = await params;
    const body = await request.json();
    const adminClient = createAdminClient();

    const { data: match, error: updateError } = await adminClient
      .from('tournament_matches' as never)
      .update(body as never)
      .eq('id', resolvedParams.matchId)
      .select('*, team_a:tournament_teams!team_a_id(*), team_b:tournament_teams!team_b_id(*)')
      .single<TournamentMatch>();

    if (updateError) {
      if (updateError.code === 'PGRST116') {
        return NextResponse.json({ error: 'Match not found' }, { status: 404 });
      }
      throw updateError;
    }

    // If this is a pool match that was just finished, recalculate standings
    if (match.round_type === 'pool' && match.pool && body.status === 'finished') {
      // Get all pool matches
      const { data: poolMatches } = await adminClient
        .from('tournament_matches' as never)
        .select('*')
        .eq('tournament_id', resolvedParams.id)
        .eq('round_type', 'pool')
        .eq('pool', match.pool)
        .returns<TournamentMatch[]>();

      // Get all teams in this pool
      const { data: poolTeams } = await adminClient
        .from('tournament_teams' as never)
        .select('*')
        .eq('tournament_id', resolvedParams.id)
        .eq('pool', match.pool)
        .returns<TournamentTeam[]>();

      if (poolMatches && poolTeams) {
        const standings = recalcStandings(poolMatches, poolTeams, resolvedParams.id, match.pool);

        // Upsert standings
        for (const standing of standings) {
          await adminClient
            .from('tournament_standings' as never)
            .upsert(standing as never, { onConflict: 'tournament_id,team_id' });
        }
      }
    }

    // If this is a knockout match that was just finished, advance winner
    if (match.status === 'finished' && body.status === 'finished' && match.round_type !== 'pool') {
      const winnerId = match.score_a > match.score_b ? match.team_a_id : match.team_b_id;
      const loserId = match.score_a > match.score_b ? match.team_b_id : match.team_a_id;

      if (match.round_type === 'quarter') {
        // Find the semi-final to advance to
        const { data: semis } = await adminClient
          .from('tournament_matches' as never)
          .select('*')
          .eq('tournament_id', resolvedParams.id)
          .eq('round_type', 'semi')
          .order('match_number', { ascending: true })
          .returns<TournamentMatch[]>();

        if (semis && semis.length >= 2) {
          // Determine which semi to put the winner in based on match position
          const { data: quarters } = await adminClient
            .from('tournament_matches' as never)
            .select('*')
            .eq('tournament_id', resolvedParams.id)
            .eq('round_type', 'quarter')
            .order('match_number', { ascending: true })
            .returns<TournamentMatch[]>();

          if (quarters) {
            const matchIndex = quarters.findIndex(q => q.id === resolvedParams.matchId);
            const semiIndex = Math.floor(matchIndex / 2);
            const isTeamA = matchIndex % 2 === 0;

            if (semis[semiIndex]) {
              const updateField = isTeamA ? { team_a_id: winnerId } : { team_b_id: winnerId };
              await adminClient
                .from('tournament_matches' as never)
                .update(updateField as never)
                .eq('id', semis[semiIndex].id);
            }
          }
        }
      } else if (match.round_type === 'semi') {
        // Advance winner to final, loser to 3rd place
        const { data: finalMatch } = await adminClient
          .from('tournament_matches' as never)
          .select('*')
          .eq('tournament_id', resolvedParams.id)
          .eq('round_type', 'final')
          .single<TournamentMatch>();

        const { data: thirdPlace } = await adminClient
          .from('tournament_matches' as never)
          .select('*')
          .eq('tournament_id', resolvedParams.id)
          .eq('round_type', '3rd_place')
          .single<TournamentMatch>();

        const { data: semis } = await adminClient
          .from('tournament_matches' as never)
          .select('*')
          .eq('tournament_id', resolvedParams.id)
          .eq('round_type', 'semi')
          .order('match_number', { ascending: true })
          .returns<TournamentMatch[]>();

        if (semis) {
          const semiIndex = semis.findIndex(s => s.id === resolvedParams.matchId);
          const isTeamA = semiIndex === 0;

          if (finalMatch) {
            const updateField = isTeamA ? { team_a_id: winnerId } : { team_b_id: winnerId };
            await adminClient
              .from('tournament_matches' as never)
              .update(updateField as never)
              .eq('id', finalMatch.id);
          }

          if (thirdPlace) {
            const updateField = isTeamA ? { team_a_id: loserId } : { team_b_id: loserId };
            await adminClient
              .from('tournament_matches' as never)
              .update(updateField as never)
              .eq('id', thirdPlace.id);
          }
        }
      }
    }

    return NextResponse.json(match);
  } catch (error) {
    console.error('Error updating match:', error);
    return NextResponse.json(
      { error: 'Failed to update match' },
      { status: 500 }
    );
  }
}

// DELETE - Delete a match (admin only)
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const resolvedParams = await params;
    const adminClient = createAdminClient();

    const { error } = await adminClient
      .from('tournament_matches' as never)
      .delete()
      .eq('id', resolvedParams.matchId);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting match:', error);
    return NextResponse.json(
      { error: 'Failed to delete match' },
      { status: 500 }
    );
  }
}
