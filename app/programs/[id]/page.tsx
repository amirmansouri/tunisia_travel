import { notFound } from 'next/navigation';
import Link from 'next/link';
import { MapPin, Calendar, Clock, ArrowLeft, DollarSign } from 'lucide-react';
import Header from '@/components/public/Header';
import Footer from '@/components/public/Footer';
import ImageGallery from '@/components/public/ImageGallery';
import ReservationForm from '@/components/public/ReservationForm';
import { supabase } from '@/lib/supabase';
import { Program } from '@/types/database';
import {
  formatPrice,
  formatDateRange,
  getDurationText,
} from '@/lib/utils';

interface PageProps {
  params: Promise<{ id: string }>;
}

async function getProgram(id: string): Promise<Program | null> {
  const { data, error } = await supabase
    .from('programs')
    .select('*')
    .eq('id', id)
    .eq('published', true)
    .single();

  if (error || !data) {
    return null;
  }

  return data as Program;
}

export async function generateMetadata({ params }: PageProps) {
  const resolvedParams = await params;
  const program = await getProgram(resolvedParams.id);

  if (!program) {
    return {
      title: 'Program Not Found | Tunisia Travel',
    };
  }

  return {
    title: `${program.title} | Tunisia Travel`,
    description: program.description.slice(0, 160),
    openGraph: {
      title: program.title,
      description: program.description.slice(0, 160),
      images: program.images[0] ? [program.images[0]] : [],
    },
  };
}

export const revalidate = 0;
export const dynamic = 'force-dynamic';

export default async function ProgramDetailPage({ params }: PageProps) {
  const resolvedParams = await params;
  const program = await getProgram(resolvedParams.id);

  if (!program) {
    notFound();
  }

  const duration = getDurationText(program.start_date, program.end_date);
  const dateRange = formatDateRange(program.start_date, program.end_date);
  const price = formatPrice(program.price);

  // Split description into paragraphs
  const descriptionParagraphs = program.description.split('\n\n');

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 bg-tunisia-cream">
        {/* Back Navigation */}
        <div className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <Link
              href="/programs"
              className="inline-flex items-center text-gray-600 hover:text-tunisia-red transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to All Programs
            </Link>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Image Gallery */}
              <ImageGallery images={program.images} title={program.title} />

              {/* Program Info */}
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                  {program.title}
                </h1>

                <div className="mt-6 flex flex-wrap gap-4">
                  <div className="flex items-center text-gray-600">
                    <MapPin className="h-5 w-5 text-tunisia-sand mr-2" />
                    {program.location}
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Calendar className="h-5 w-5 text-tunisia-sand mr-2" />
                    {dateRange}
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Clock className="h-5 w-5 text-tunisia-sand mr-2" />
                    {duration}
                  </div>
                  <div className="flex items-center text-tunisia-red font-semibold">
                    <DollarSign className="h-5 w-5 mr-1" />
                    {price}
                  </div>
                </div>

                <hr className="my-6" />

                {/* Description */}
                <div className="prose prose-lg max-w-none">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    Program Details
                  </h2>
                  {descriptionParagraphs.map((paragraph, index) => (
                    <p
                      key={index}
                      className="text-gray-600 whitespace-pre-line mb-4"
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar - Reservation Form */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl p-6 shadow-sm sticky top-24">
                <div className="text-center mb-6">
                  <p className="text-sm text-gray-500 uppercase tracking-wide">
                    Starting from
                  </p>
                  <p className="text-4xl font-bold text-tunisia-red">{price}</p>
                  <p className="text-sm text-gray-500">per person</p>
                </div>

                <hr className="mb-6" />

                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Reserve Your Spot
                </h3>
                <p className="text-sm text-gray-600 mb-6">
                  Fill out the form below and our team will contact you within
                  24 hours to confirm availability and finalize your booking.
                </p>

                <ReservationForm
                  programId={program.id}
                  programTitle={program.title}
                />
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
