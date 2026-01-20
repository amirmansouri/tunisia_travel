'use client';

import Image from 'next/image';
import Link from 'next/link';
import { MapPin, Calendar, Clock } from 'lucide-react';
import { Program } from '@/types/database';
import { formatPrice, formatDateRange, getDurationText } from '@/lib/utils';
import { useLanguage } from '@/lib/i18n';

interface ProgramCardProps {
  program: Program;
}

export default function ProgramCard({ program }: ProgramCardProps) {
  const { t } = useLanguage();
  const duration = getDurationText(program.start_date, program.end_date);
  const dateRange = formatDateRange(program.start_date, program.end_date);
  const price = formatPrice(program.price);

  return (
    <Link href={`/programs/${program.id}`}>
      <article className="card group cursor-pointer h-full flex flex-col">
        {/* Image */}
        <div className="relative h-56 overflow-hidden">
          <Image
            src={program.images[0] || '/images/placeholder.jpg'}
            alt={program.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="gradient-overlay" />
          <div className="absolute bottom-4 left-4 right-4">
            <span className="inline-block bg-tunisia-red text-white text-sm font-semibold px-3 py-1 rounded-full">
              {price}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 flex-1 flex flex-col">
          <h3 className="text-xl font-bold text-gray-900 group-hover:text-tunisia-red transition-colors line-clamp-2">
            {program.title}
          </h3>

          <div className="mt-3 space-y-2 text-sm text-gray-600">
            <div className="flex items-center space-x-2">
              <MapPin className="h-4 w-4 text-tunisia-sand flex-shrink-0" />
              <span className="truncate">{program.location}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-tunisia-sand flex-shrink-0" />
              <span>{dateRange}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-tunisia-sand flex-shrink-0" />
              <span>{duration}</span>
            </div>
          </div>

          <p className="mt-4 text-gray-600 text-sm line-clamp-3 flex-1">
            {program.description.split('\n')[0]}
          </p>

          <div className="mt-4 pt-4 border-t border-gray-100">
            <span className="text-tunisia-red font-semibold group-hover:underline">
              {t.programCard.viewDetails} &rarr;
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}
