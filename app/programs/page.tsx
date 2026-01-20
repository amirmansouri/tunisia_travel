import Header from '@/components/public/Header';
import Footer from '@/components/public/Footer';
import ProgramsContent from '@/components/public/ProgramsContent';
import { supabase } from '@/lib/supabase';
import { Program } from '@/types/database';

async function getPrograms(): Promise<Program[]> {
  const { data, error } = await supabase
    .from('programs')
    .select('*')
    .eq('published', true)
    .order('start_date', { ascending: true });

  if (error) {
    console.error('Error fetching programs:', error);
    return [];
  }

  return (data || []) as Program[];
}

export const revalidate = 0;
export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Travel Programs | Arivo Travel',
  description:
    'Browse our curated selection of Tunisia travel programs. From Sahara adventures to coastal escapes, find your perfect trip.',
};

export default async function ProgramsPage() {
  const programs = await getPrograms();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <ProgramsContent programs={programs} />
      <Footer />
    </div>
  );
}
