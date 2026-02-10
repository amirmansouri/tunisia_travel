import { supabase } from '@/lib/supabase';
import { Tournament } from '@/types/database';
import Header from '@/components/public/Header';
import Footer from '@/components/public/Footer';
import TournamentCard from '@/components/public/TournamentCard';

async function getTournaments(): Promise<(Tournament & { team_count: number })[]> {
  const { data, error } = await supabase
    .from('tournaments' as never)
    .select('*')
    .eq('is_published', true)
    .order('start_date', { ascending: true })
    .returns<Tournament[]>();

  if (error) {
    console.error('Error fetching tournaments:', error);
    return [];
  }

  const results = [];
  for (const t of data || []) {
    const { count } = await supabase
      .from('tournament_teams' as never)
      .select('*', { count: 'exact', head: true })
      .eq('tournament_id', t.id);
    results.push({ ...t, team_count: count || 0 });
  }

  return results;
}

export const revalidate = 0;
export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Tournaments | Yalla Habibi',
  description: 'International pétanque tournaments organized by Yalla Habibi in Cannes, France.',
};

export default async function TournamentsPage() {
  const tournaments = await getTournaments();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <TournamentsContent tournaments={tournaments} />
      <Footer />
    </div>
  );
}

function TournamentsContent({ tournaments }: { tournaments: (Tournament & { team_count: number })[] }) {
  return (
    <main className="flex-1 bg-gray-50">
      {/* Hero */}
      <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-5xl mb-4 block">🏆</span>
          <h1 className="text-3xl sm:text-4xl font-bold">Tournaments</h1>
          <p className="text-gray-400 mt-3 max-w-2xl mx-auto">
            International pétanque competitions in Cannes, France
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {tournaments.length === 0 ? (
          <div className="text-center py-16">
            <span className="text-4xl">🏆</span>
            <h2 className="text-xl font-semibold text-gray-700 mt-4">No tournaments at the moment</h2>
            <p className="text-gray-500 mt-2">Check back soon for upcoming competitions!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tournaments.map((tournament) => (
              <TournamentCard key={tournament.id} tournament={tournament} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
