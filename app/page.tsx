import Header from '@/components/public/Header';
import Footer from '@/components/public/Footer';
import HomeContent from '@/components/public/HomeContent';
import { supabase } from '@/lib/supabase';
import { Program } from '@/types/database';

async function getFeaturedPrograms(): Promise<Program[]> {
  const { data, error } = await supabase
    .from('programs')
    .select('*')
    .eq('published', true)
    .order('created_at', { ascending: false })
    .limit(6);

  if (error) {
    console.error('Error fetching programs:', error);
    return [];
  }

  return (data || []) as Program[];
}

export const revalidate = 0;
export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const programs = await getFeaturedPrograms();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <HomeContent programs={programs} />
      <Footer />
    </div>
  );
}
