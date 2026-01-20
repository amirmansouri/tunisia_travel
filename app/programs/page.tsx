import { Suspense } from 'react';
import Header from '@/components/public/Header';
import Footer from '@/components/public/Footer';
import ProgramCard from '@/components/public/ProgramCard';
import { supabase } from '@/lib/supabase';
import { Program } from '@/types/database';
import { Loader2 } from 'lucide-react';

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

export const revalidate = 0; // Always fetch fresh data
export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Travel Programs | Tunisia Travel',
  description:
    'Browse our curated selection of Tunisia travel programs. From Sahara adventures to coastal escapes, find your perfect trip.',
};

function LoadingState() {
  return (
    <div className="flex items-center justify-center py-20">
      <Loader2 className="h-8 w-8 animate-spin text-tunisia-red" />
    </div>
  );
}

async function ProgramsList() {
  const programs = await getPrograms();

  if (programs.length === 0) {
    return (
      <div className="text-center py-20 bg-white rounded-xl">
        <h3 className="text-xl font-semibold text-gray-700">
          No Programs Available
        </h3>
        <p className="text-gray-500 mt-2">
          Check back soon for new travel programs!
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {programs.map((program) => (
        <ProgramCard key={program.id} program={program} />
      ))}
    </div>
  );
}

export default function ProgramsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Banner */}
        <section className="bg-gradient-to-r from-tunisia-red to-red-700 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl font-bold">
              Our Travel Programs
            </h1>
            <p className="mt-4 text-xl text-red-100 max-w-2xl mx-auto">
              Discover Tunisia&apos;s wonders with our carefully designed travel
              experiences. Each program offers authentic adventures and
              unforgettable memories.
            </p>
          </div>
        </section>

        {/* Programs Grid */}
        <section className="py-16 bg-tunisia-cream">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Suspense fallback={<LoadingState />}>
              <ProgramsList />
            </Suspense>
          </div>
        </section>

        {/* Info Section */}
        <section className="py-16 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900">
              How Reservations Work
            </h2>
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <div className="w-12 h-12 bg-tunisia-red text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto">
                  1
                </div>
                <h3 className="mt-4 font-semibold">Choose Your Program</h3>
                <p className="text-gray-600 mt-2">
                  Browse our programs and find the perfect trip for you
                </p>
              </div>
              <div>
                <div className="w-12 h-12 bg-tunisia-red text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto">
                  2
                </div>
                <h3 className="mt-4 font-semibold">Submit a Reservation</h3>
                <p className="text-gray-600 mt-2">
                  Fill out the simple form with your details - no payment needed
                </p>
              </div>
              <div>
                <div className="w-12 h-12 bg-tunisia-red text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto">
                  3
                </div>
                <h3 className="mt-4 font-semibold">We&apos;ll Contact You</h3>
                <p className="text-gray-600 mt-2">
                  Our team will reach out within 24 hours to confirm your trip
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
