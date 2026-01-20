'use client';

import { useState } from 'react';
import { Search, Filter } from 'lucide-react';
import { ReservationWithProgram, ReservationStatus } from '@/types/database';
import ReservationCard from './ReservationCard';
import { cn } from '@/lib/utils';

interface ReservationFiltersProps {
  reservations: ReservationWithProgram[];
}

const statusOptions: { value: ReservationStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'pending', label: 'Pending' },
  { value: 'confirmed', label: 'Confirmed' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
];

export default function ReservationFilters({ reservations }: ReservationFiltersProps) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<ReservationStatus | 'all'>('all');

  const filteredReservations = reservations.filter((reservation) => {
    // Status filter
    if (statusFilter !== 'all' && reservation.status !== statusFilter) {
      return false;
    }

    // Search filter
    if (search) {
      const searchLower = search.toLowerCase();
      return (
        reservation.full_name.toLowerCase().includes(searchLower) ||
        reservation.email.toLowerCase().includes(searchLower) ||
        reservation.phone.includes(search) ||
        reservation.program?.title.toLowerCase().includes(searchLower)
      );
    }

    return true;
  });

  return (
    <div>
      {/* Filter Controls */}
      <div className="bg-white rounded-xl p-4 shadow-sm mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, email, phone, or program..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-tunisia-blue focus:border-transparent"
            />
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-gray-400" />
            <div className="flex gap-1">
              {statusOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setStatusFilter(option.value)}
                  className={cn(
                    'px-3 py-1.5 text-sm font-medium rounded-lg transition-colors',
                    statusFilter === option.value
                      ? 'bg-tunisia-red text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  )}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Results */}
      {filteredReservations.length === 0 ? (
        <div className="bg-white rounded-xl p-12 text-center">
          <h3 className="text-lg font-semibold text-gray-700">
            {reservations.length === 0 ? 'No Reservations Yet' : 'No Results Found'}
          </h3>
          <p className="text-gray-500 mt-2">
            {reservations.length === 0
              ? 'Reservation requests will appear here when customers submit them.'
              : 'Try adjusting your search or filters.'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <p className="text-sm text-gray-500">
            Showing {filteredReservations.length} of {reservations.length} reservations
          </p>
          {filteredReservations.map((reservation) => (
            <ReservationCard key={reservation.id} reservation={reservation} />
          ))}
        </div>
      )}
    </div>
  );
}
