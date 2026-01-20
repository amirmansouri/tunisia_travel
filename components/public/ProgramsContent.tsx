'use client';

import { useState, useMemo } from 'react';
import { useLanguage } from '@/lib/i18n';
import ProgramCard from './ProgramCard';
import { Program, ProgramCategory } from '@/types/database';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProgramsContentProps {
  programs: Program[];
}

type SortOption = 'priceAsc' | 'priceDesc' | 'dateAsc' | 'dateDesc';

const categories: (ProgramCategory | 'all')[] = ['all', 'adventure', 'beach', 'cultural', 'desert', 'city', 'nature'];

export default function ProgramsContent({ programs }: ProgramsContentProps) {
  const { t } = useLanguage();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<ProgramCategory | 'all'>('all');
  const [sortBy, setSortBy] = useState<SortOption>('dateAsc');
  const [showFilters, setShowFilters] = useState(false);

  const filteredPrograms = useMemo(() => {
    let result = [...programs];

    // Search filter
    if (search) {
      const searchLower = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(searchLower) ||
          p.description.toLowerCase().includes(searchLower) ||
          p.location.toLowerCase().includes(searchLower)
      );
    }

    // Category filter
    if (category !== 'all') {
      result = result.filter((p) => p.category === category);
    }

    // Sorting
    result.sort((a, b) => {
      switch (sortBy) {
        case 'priceAsc':
          return a.price - b.price;
        case 'priceDesc':
          return b.price - a.price;
        case 'dateAsc':
          return new Date(a.start_date).getTime() - new Date(b.start_date).getTime();
        case 'dateDesc':
          return new Date(b.start_date).getTime() - new Date(a.start_date).getTime();
        default:
          return 0;
      }
    });

    return result;
  }, [programs, search, category, sortBy]);

  const hasActiveFilters = search || category !== 'all';

  const clearFilters = () => {
    setSearch('');
    setCategory('all');
    setSortBy('dateAsc');
  };

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

      {/* Filters Section */}
      <section className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder={t.filters.search}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-tunisia-red focus:border-transparent"
              />
            </div>

            {/* Filter Toggle (Mobile) */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="md:hidden flex items-center justify-center gap-2 px-4 py-2.5 border rounded-lg hover:bg-gray-50"
            >
              <SlidersHorizontal className="h-5 w-5" />
              {t.filters.category}
            </button>

            {/* Desktop Filters */}
            <div className="hidden md:flex items-center gap-4">
              {/* Sort */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-tunisia-red focus:border-transparent bg-white"
              >
                <option value="dateAsc">{t.filters.dateAsc}</option>
                <option value="dateDesc">{t.filters.dateDesc}</option>
                <option value="priceAsc">{t.filters.priceAsc}</option>
                <option value="priceDesc">{t.filters.priceDesc}</option>
              </select>

              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="flex items-center gap-1 px-3 py-2 text-sm text-gray-600 hover:text-tunisia-red"
                >
                  <X className="h-4 w-4" />
                  {t.filters.clearFilters}
                </button>
              )}
            </div>
          </div>

          {/* Category Pills */}
          <div className={cn(
            'flex flex-wrap gap-2 mt-4',
            !showFilters && 'hidden md:flex'
          )}>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={cn(
                  'px-4 py-2 rounded-full text-sm font-medium transition-colors',
                  category === cat
                    ? 'bg-tunisia-red text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                )}
              >
                {t.categories[cat]}
              </button>
            ))}
          </div>

          {/* Mobile Sort & Clear */}
          {showFilters && (
            <div className="flex items-center gap-4 mt-4 md:hidden">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="flex-1 px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-tunisia-red focus:border-transparent bg-white"
              >
                <option value="dateAsc">{t.filters.dateAsc}</option>
                <option value="dateDesc">{t.filters.dateDesc}</option>
                <option value="priceAsc">{t.filters.priceAsc}</option>
                <option value="priceDesc">{t.filters.priceDesc}</option>
              </select>

              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="flex items-center gap-1 px-3 py-2 text-sm text-gray-600 hover:text-tunisia-red"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Programs Grid */}
      <section className="py-8 bg-tunisia-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Results count */}
          <p className="text-sm text-gray-500 mb-6">
            {t.filters.results.replace('{count}', String(filteredPrograms.length))}
          </p>

          {filteredPrograms.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-xl">
              <h3 className="text-xl font-semibold text-gray-700">
                {programs.length === 0 ? t.programsPage.noPrograms : t.filters.noResults}
              </h3>
              <p className="text-gray-500 mt-2">
                {programs.length === 0 ? t.programsPage.checkBack : ''}
              </p>
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="mt-4 px-6 py-2 bg-tunisia-red text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  {t.filters.clearFilters}
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPrograms.map((program) => (
                <ProgramCard key={program.id} program={program} />
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
