'use client';

import { useLanguage } from '@/lib/i18n';
import ProgramCard from './ProgramCard';
import { Program } from '@/types/database';

interface ProgramsContentProps {
  programs: Program[];
}

export default function ProgramsContent({ programs }: ProgramsContentProps) {
  const { t } = useLanguage();

  return (
    <main className="flex-1">
      {/* Hero Banner */}
      <section className="bg-gradient-to-r from-tunisia-red to-red-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold">
            {t.programsPage.title}
          </h1>
          <p className="mt-4 text-xl text-red-100 max-w-2xl mx-auto">
            {t.programsPage.subtitle}
          </p>
        </div>
      </section>

      {/* Programs Grid */}
      <section className="py-16 bg-tunisia-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {programs.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-xl">
              <h3 className="text-xl font-semibold text-gray-700">
                {t.programsPage.noPrograms}
              </h3>
              <p className="text-gray-500 mt-2">
                {t.programsPage.checkBack}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {programs.map((program) => (
                <ProgramCard key={program.id} program={program} />
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
