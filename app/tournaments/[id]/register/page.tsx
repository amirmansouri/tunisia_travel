import { notFound, redirect } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Tournament } from '@/types/database';
import Header from '@/components/public/Header';
import Footer from '@/components/public/Footer';
import RegisterForm from './RegisterForm';

interface PageProps {
  params: Promise<{ id: string }>;
}

async function getTournament(id: string): Promise<Tournament | null> {
  const { data, error } = await supabase
    .from('tournaments' as never)
    .select('*')
    .eq('id', id)
    .eq('is_published', true)
    .single<Tournament>();

  if (error || !data) return null;
  return data;
}

export const revalidate = 0;
export const dynamic = 'force-dynamic';

export default async function RegisterPage({ params }: PageProps) {
  const resolvedParams = await params;
  const tournament = await getTournament(resolvedParams.id);

  if (!tournament) notFound();

  if (tournament.status !== 'registration') {
    redirect(`/tournaments/${tournament.id}`);
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-gray-50">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-8">
            <span className="text-4xl">🏆</span>
            <h1 className="text-2xl font-bold text-gray-900 mt-3">{tournament.name}</h1>
            <p className="text-gray-500 mt-2">Register your team for the tournament</p>
          </div>

          <RegisterForm tournamentId={tournament.id} />
        </div>
      </main>
      <Footer />
    </div>
  );
}
