import { notFound } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Tournament, TournamentTeam, TournamentMatch, TournamentStanding } from '@/types/database';
import Header from '@/components/public/Header';
import Footer from '@/components/public/Footer';
import TournamentDetail from './TournamentDetail';

interface PageProps {
  params: Promise<{ id: string }>;
}

async function getTournament(id: string) {
  const { data: tournament, error } = await supabase
    .from('tournaments' as never)
    .select('*')
    .eq('id', id)
    .eq('is_published', true)
    .single<Tournament>();

  if (error || !tournament) return null;

  const [teamsRes, matchesRes, standingsRes] = await Promise.all([
    supabase
      .from('tournament_teams' as never)
      .select('*')
      .eq('tournament_id', id)
      .order('pool', { ascending: true })
      .order('name', { ascending: true })
      .returns<TournamentTeam[]>(),
    supabase
      .from('tournament_matches' as never)
      .select('*, team_a:tournament_teams!team_a_id(*), team_b:tournament_teams!team_b_id(*)')
      .eq('tournament_id', id)
      .order('match_number', { ascending: true })
      .returns<TournamentMatch[]>(),
    supabase
      .from('tournament_standings' as never)
      .select('*, team:tournament_teams(*)')
      .eq('tournament_id', id)
      .order('pool', { ascending: true })
      .order('rank', { ascending: true })
      .returns<TournamentStanding[]>(),
  ]);

  return {
    tournament,
    teams: teamsRes.data || [],
    matches: matchesRes.data || [],
    standings: standingsRes.data || [],
  };
}

export const revalidate = 0;
export const dynamic = 'force-dynamic';

export default async function TournamentPage({ params }: PageProps) {
  const resolvedParams = await params;
  const data = await getTournament(resolvedParams.id);

  if (!data) notFound();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <TournamentDetail
        tournament={data.tournament}
        teams={data.teams}
        matches={data.matches}
        standings={data.standings}
      />
      <Footer />
    </div>
  );
}
