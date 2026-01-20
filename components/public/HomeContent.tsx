'use client';

import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Calendar, Star, Users } from 'lucide-react';
import { useLanguage } from '@/lib/i18n';
import ProgramCard from './ProgramCard';
import Newsletter from './Newsletter';
import { Program } from '@/types/database';

interface HomeContentProps {
  programs: Program[];
}

export default function HomeContent({ programs }: HomeContentProps) {
  const { t } = useLanguage();

  return (
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
              {t.hero.title}{' '}
              <span className="text-tunisia-sand">{t.hero.titleHighlight}</span>
            </h1>
            <p className="mt-6 text-xl text-gray-200">
              {t.hero.subtitle}
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <Link href="/programs" className="btn-primary text-lg px-8">
                {t.hero.explorePrograms}
              </Link>
              <Link href="#featured" className="btn-outline text-lg px-8 border-white text-white hover:bg-white hover:text-gray-900">
                {t.hero.learnMore}
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
              <h3 className="font-semibold text-lg">{t.features.uniqueDestinations}</h3>
              <p className="text-gray-600 mt-2">
                {t.features.uniqueDestinationsDesc}
              </p>
            </div>
            <div className="text-center p-6">
              <div className="w-14 h-14 bg-tunisia-sand/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-7 w-7 text-tunisia-sand" />
              </div>
              <h3 className="font-semibold text-lg">{t.features.expertGuides}</h3>
              <p className="text-gray-600 mt-2">
                {t.features.expertGuidesDesc}
              </p>
            </div>
            <div className="text-center p-6">
              <div className="w-14 h-14 bg-tunisia-blue/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="h-7 w-7 text-tunisia-blue" />
              </div>
              <h3 className="font-semibold text-lg">{t.features.flexibleBooking}</h3>
              <p className="text-gray-600 mt-2">
                {t.features.flexibleBookingDesc}
              </p>
            </div>
            <div className="text-center p-6">
              <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="h-7 w-7 text-green-600" />
              </div>
              <h3 className="font-semibold text-lg">{t.features.trustedService}</h3>
              <p className="text-gray-600 mt-2">
                {t.features.trustedServiceDesc}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Programs */}
      <section id="featured" className="py-20 bg-tunisia-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="section-title">{t.featured.title}</h2>
            <p className="section-subtitle max-w-2xl mx-auto">
              {t.featured.subtitle}
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
                {t.featured.noPrograms}
              </p>
            </div>
          )}

          <div className="text-center mt-12">
            <Link href="/programs" className="btn-primary text-lg px-8">
              {t.featured.viewAll}
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
                {t.whyTunisia.title} <span className="text-tunisia-red">{t.whyTunisia.titleHighlight}</span>?
              </h2>
              <p className="mt-6 text-gray-600 leading-relaxed">
                {t.whyTunisia.description}
              </p>
              <ul className="mt-6 space-y-4">
                <li className="flex items-start">
                  <span className="flex-shrink-0 w-6 h-6 bg-tunisia-red rounded-full flex items-center justify-center text-white text-sm mr-3 mt-0.5">
                    ✓
                  </span>
                  <span>
                    <strong>{t.whyTunisia.unesco}</strong> {t.whyTunisia.unescoDesc}
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="flex-shrink-0 w-6 h-6 bg-tunisia-red rounded-full flex items-center justify-center text-white text-sm mr-3 mt-0.5">
                    ✓
                  </span>
                  <span>
                    <strong>{t.whyTunisia.sahara}</strong> {t.whyTunisia.saharaDesc}
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="flex-shrink-0 w-6 h-6 bg-tunisia-red rounded-full flex items-center justify-center text-white text-sm mr-3 mt-0.5">
                    ✓
                  </span>
                  <span>
                    <strong>{t.whyTunisia.beaches}</strong> {t.whyTunisia.beachesDesc}
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="flex-shrink-0 w-6 h-6 bg-tunisia-red rounded-full flex items-center justify-center text-white text-sm mr-3 mt-0.5">
                    ✓
                  </span>
                  <span>
                    <strong>{t.whyTunisia.culture}</strong> {t.whyTunisia.cultureDesc}
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
            {t.cta.title}
          </h2>
          <p className="mt-4 text-xl text-red-100">
            {t.cta.subtitle}
          </p>
          <Link
            href="/programs"
            className="mt-8 inline-block bg-white text-tunisia-red font-semibold px-8 py-4 rounded-lg hover:bg-gray-100 transition-colors text-lg"
          >
            {t.cta.button}
          </Link>
        </div>
      </section>

      {/* Newsletter Section */}
      <Newsletter />
    </main>
  );
}
