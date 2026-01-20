import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Calendar, Star, Users } from 'lucide-react';
import Header from '@/components/public/Header';
import Footer from '@/components/public/Footer';
import ProgramCard from '@/components/public/ProgramCard';
import { getMockPrograms } from '@/lib/mock-data';
import { Program } from '@/types/database';

async function getFeaturedPrograms(): Promise<Program[]> {
  // Use mock data for testing
  return getMockPrograms().slice(0, 6);
}

export const revalidate = 60;

export default async function HomePage() {
  const programs = await getFeaturedPrograms();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative h-[80vh] min-h-[600px] flex items-center">
          <Image
            src="https://images.unsplash.com/photo-1568454537842-d933259bb258?w=1920"
            alt="Tunisia - Sidi Bou Said"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent" />

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-white">
            <div className="max-w-2xl">
              <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                Discover the Magic of{' '}
                <span className="text-tunisia-sand">Tunisia</span>
              </h1>
              <p className="mt-6 text-xl text-gray-200">
                From ancient Carthage to the golden Sahara, experience the jewel
                of North Africa with our expertly crafted travel programs.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <Link href="/programs" className="btn-primary text-lg px-8">
                  Explore Programs
                </Link>
                <Link href="#featured" className="btn-outline text-lg px-8 border-white text-white hover:bg-white hover:text-gray-900">
                  Learn More
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="text-center p-6">
                <div className="w-14 h-14 bg-tunisia-red/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MapPin className="h-7 w-7 text-tunisia-red" />
                </div>
                <h3 className="font-semibold text-lg">Unique Destinations</h3>
                <p className="text-gray-600 mt-2">
                  From Mediterranean beaches to Sahara dunes
                </p>
              </div>
              <div className="text-center p-6">
                <div className="w-14 h-14 bg-tunisia-sand/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-7 w-7 text-tunisia-sand" />
                </div>
                <h3 className="font-semibold text-lg">Expert Guides</h3>
                <p className="text-gray-600 mt-2">
                  Local experts with deep cultural knowledge
                </p>
              </div>
              <div className="text-center p-6">
                <div className="w-14 h-14 bg-tunisia-blue/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calendar className="h-7 w-7 text-tunisia-blue" />
                </div>
                <h3 className="font-semibold text-lg">Flexible Booking</h3>
                <p className="text-gray-600 mt-2">
                  Easy reservations with no upfront payment
                </p>
              </div>
              <div className="text-center p-6">
                <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Star className="h-7 w-7 text-green-600" />
                </div>
                <h3 className="font-semibold text-lg">Trusted Service</h3>
                <p className="text-gray-600 mt-2">
                  Years of experience crafting memorable trips
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Programs */}
        <section id="featured" className="py-20 bg-tunisia-cream">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="section-title">Featured Travel Programs</h2>
              <p className="section-subtitle max-w-2xl mx-auto">
                Discover our handpicked selection of the best Tunisia has to
                offer. Each program is designed to give you an authentic and
                unforgettable experience.
              </p>
            </div>

            {programs.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {programs.map((program) => (
                  <ProgramCard key={program.id} program={program} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-white rounded-xl">
                <p className="text-gray-500">
                  No programs available at the moment. Check back soon!
                </p>
              </div>
            )}

            <div className="text-center mt-12">
              <Link href="/programs" className="btn-primary text-lg px-8">
                View All Programs
              </Link>
            </div>
          </div>
        </section>

        {/* About Tunisia Section */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="section-title">
                  Why Visit <span className="text-tunisia-red">Tunisia</span>?
                </h2>
                <p className="mt-6 text-gray-600 leading-relaxed">
                  Tunisia is a treasure trove of experiences waiting to be
                  discovered. As the northernmost country in Africa, it offers
                  an incredible blend of ancient history, diverse landscapes,
                  and warm hospitality.
                </p>
                <ul className="mt-6 space-y-4">
                  <li className="flex items-start">
                    <span className="flex-shrink-0 w-6 h-6 bg-tunisia-red rounded-full flex items-center justify-center text-white text-sm mr-3 mt-0.5">
                      ✓
                    </span>
                    <span>
                      <strong>UNESCO World Heritage Sites:</strong> From Carthage
                      to Kairouan, explore 8 UNESCO-listed destinations
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="flex-shrink-0 w-6 h-6 bg-tunisia-red rounded-full flex items-center justify-center text-white text-sm mr-3 mt-0.5">
                      ✓
                    </span>
                    <span>
                      <strong>Sahara Desert Adventures:</strong> Experience
                      camel treks, desert camps, and stunning oases
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="flex-shrink-0 w-6 h-6 bg-tunisia-red rounded-full flex items-center justify-center text-white text-sm mr-3 mt-0.5">
                      ✓
                    </span>
                    <span>
                      <strong>Mediterranean Beaches:</strong> Relax on pristine
                      beaches in Hammamet, Djerba, and more
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="flex-shrink-0 w-6 h-6 bg-tunisia-red rounded-full flex items-center justify-center text-white text-sm mr-3 mt-0.5">
                      ✓
                    </span>
                    <span>
                      <strong>Rich Culture & Cuisine:</strong> Savor authentic
                      Tunisian flavors and vibrant traditions
                    </span>
                  </li>
                </ul>
              </div>
              <div className="relative">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-4">
                    <div className="relative h-48 rounded-xl overflow-hidden">
                      <Image
                        src="https://images.unsplash.com/photo-1509023464722-18d996393ca8?w=400"
                        alt="Sahara Desert"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="relative h-32 rounded-xl overflow-hidden">
                      <Image
                        src="https://images.unsplash.com/photo-1553899017-a397a55a79f6?w=400"
                        alt="Tunisian Architecture"
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>
                  <div className="space-y-4 pt-8">
                    <div className="relative h-32 rounded-xl overflow-hidden">
                      <Image
                        src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400"
                        alt="Tunisia Beach"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="relative h-48 rounded-xl overflow-hidden">
                      <Image
                        src="https://images.unsplash.com/photo-1562679299-266e53aca53d?w=400"
                        alt="Ancient Ruins"
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-tunisia-red text-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold">
              Ready to Start Your Tunisian Adventure?
            </h2>
            <p className="mt-4 text-xl text-red-100">
              Browse our programs and book your dream trip today. No payment
              required to reserve your spot.
            </p>
            <Link
              href="/programs"
              className="mt-8 inline-block bg-white text-tunisia-red font-semibold px-8 py-4 rounded-lg hover:bg-gray-100 transition-colors text-lg"
            >
              View All Programs
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
