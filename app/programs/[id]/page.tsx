import { notFound } from 'next/navigation';
import Link from 'next/link';
import { MapPin, Calendar, Clock, ArrowLeft, DollarSign, Utensils, Home, CheckCircle } from 'lucide-react';
import Header from '@/components/public/Header';
import Footer from '@/components/public/Footer';
import ImageGallery from '@/components/public/ImageGallery';
import DayImageGallery from '@/components/public/DayImageGallery';
import ReservationForm from '@/components/public/ReservationForm';
import Reviews from '@/components/public/Reviews';
import AdBanner from '@/components/AdBanner';
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
      title: 'Program Not Found | Yalla Habibi',
    };
  }

  return {
    title: `${program.title} | Yalla Habibi`,
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

              {/* Itinerary Timeline */}
              {program.itinerary && program.itinerary.length > 0 && (
                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">
                    Day-by-Day Itinerary
                  </h2>

                  <div className="relative">
                    {/* Timeline line */}
                    <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-tunisia-red/20" />

                    <div className="space-y-6">
                      {program.itinerary.map((day, index) => (
                        <div key={index} className="relative pl-14">
                          {/* Day number circle */}
                          <div className="absolute left-0 w-10 h-10 bg-tunisia-red text-white rounded-full flex items-center justify-center font-bold text-lg z-10">
                            {day.day}
                          </div>

                          <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                            {/* Location & Title */}
                            <div className="flex flex-wrap items-center gap-2 mb-2">
                              <span className="inline-flex items-center gap-1 px-2 py-1 bg-tunisia-sand/20 text-tunisia-sand rounded text-sm font-medium">
                                <MapPin className="h-3 w-3" />
                                {day.location}
                              </span>
                              <h3 className="font-semibold text-gray-900">
                                {day.title}
                              </h3>
                            </div>

                            {/* Description */}
                            {day.description && (
                              <p className="text-gray-600 text-sm mb-3">
                                {day.description}
                              </p>
                            )}

                            {/* Day Images Gallery */}
                            {day.images && day.images.length > 0 && (
                              <DayImageGallery
                                images={day.images}
                                dayNumber={day.day}
                                dayTitle={day.title}
                              />
                            )}

                            {/* Activities */}
                            {day.activities && day.activities.length > 0 && (
                              <div className="mb-3">
                                <div className="flex flex-wrap gap-2">
                                  {day.activities.map((activity, ai) => (
                                    <span
                                      key={ai}
                                      className="inline-flex items-center gap-1 px-2 py-1 bg-tunisia-blue/10 text-tunisia-blue rounded-full text-xs"
                                    >
                                      <CheckCircle className="h-3 w-3" />
                                      {activity}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Meals & Accommodation */}
                            <div className="flex flex-wrap gap-4 text-xs text-gray-500">
                              {day.meals && (day.meals.breakfast || day.meals.lunch || day.meals.dinner) && (
                                <div className="flex items-center gap-1">
                                  <Utensils className="h-3 w-3" />
                                  <span>
                                    {[
                                      day.meals.breakfast && 'Breakfast',
                                      day.meals.lunch && 'Lunch',
                                      day.meals.dinner && 'Dinner',
                                    ]
                                      .filter(Boolean)
                                      .join(', ')}
                                  </span>
                                </div>
                              )}
                              {day.accommodation && (
                                <div className="flex items-center gap-1">
                                  <Home className="h-3 w-3" />
                                  <span>{day.accommodation}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Ad Banner */}
              <div className="my-4">
                <AdBanner adSlot="1525071635" adFormat="auto" />
              </div>

              {/* Reviews Section */}
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <Reviews programId={program.id} />
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
