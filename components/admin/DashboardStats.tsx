'use client';

import Link from 'next/link';
import {
  TrendingUp,
  Users,
  Calendar,
  DollarSign,
  Map,
  Clock,
  ArrowRight,
  Globe
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface DashboardData {
  counts: {
    programs: number;
    reservations: number;
    visitors: number;
  };
  statusCounts: {
    pending: number;
    confirmed: number;
    completed: number;
    cancelled: number;
  };
  potentialRevenue: number;
  confirmedRevenue: number;
  topCountries: Array<{ country: string; count: number }>;
  reservationsByDay: Array<{ date: string; count: number }>;
  recentReservations: Array<{
    id: string;
    full_name: string;
    email: string;
    status: string;
    created_at: string;
    programTitle: string;
  }>;
}

interface DashboardStatsProps {
  data: DashboardData;
}

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-700',
  confirmed: 'bg-blue-100 text-blue-700',
  completed: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
};

// Simple country code to flag emoji
function getCountryFlag(country: string): string {
  const flags: Record<string, string> = {
    'Tunisia': '🇹🇳',
    'France': '🇫🇷',
    'Germany': '🇩🇪',
    'United Kingdom': '🇬🇧',
    'United States': '🇺🇸',
    'Italy': '🇮🇹',
    'Spain': '🇪🇸',
    'Algeria': '🇩🇿',
    'Libya': '🇱🇾',
    'Morocco': '🇲🇦',
    'Unknown': '🌍',
  };
  return flags[country] || '🌍';
}

export default function DashboardStats({ data }: DashboardStatsProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-TN', {
      style: 'currency',
      currency: 'TND',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  const maxReservations = Math.max(...data.reservationsByDay.map((d) => d.count), 1);

  return (
    <div className="space-y-6">
      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Programs</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{data.counts.programs}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <Map className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <Link href="/admin/programs" className="text-sm text-tunisia-blue hover:underline mt-4 inline-flex items-center">
            View all <ArrowRight className="h-4 w-4 ml-1" />
          </Link>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Reservations</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{data.counts.reservations}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <Calendar className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <Link href="/admin/reservations" className="text-sm text-tunisia-blue hover:underline mt-4 inline-flex items-center">
            View all <ArrowRight className="h-4 w-4 ml-1" />
          </Link>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Visitors</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{data.counts.visitors}</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <Users className="h-6 w-6 text-purple-600" />
            </div>
          </div>
          <Link href="/admin/visitors" className="text-sm text-tunisia-blue hover:underline mt-4 inline-flex items-center">
            View all <ArrowRight className="h-4 w-4 ml-1" />
          </Link>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Confirmed Revenue</p>
              <p className="text-3xl font-bold text-green-600 mt-1">{formatCurrency(data.confirmedRevenue)}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-4">
            Potential: {formatCurrency(data.potentialRevenue)}
          </p>
        </div>
      </div>

      {/* Reservation Status & Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Reservation Status */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
            <TrendingUp className="h-5 w-5 mr-2 text-tunisia-red" />
            Reservation Status
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-yellow-500 mr-3" />
                <span className="text-gray-600">Pending</span>
              </div>
              <span className="font-semibold">{data.statusCounts.pending}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-blue-500 mr-3" />
                <span className="text-gray-600">Confirmed</span>
              </div>
              <span className="font-semibold">{data.statusCounts.confirmed}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-green-500 mr-3" />
                <span className="text-gray-600">Completed</span>
              </div>
              <span className="font-semibold">{data.statusCounts.completed}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-red-500 mr-3" />
                <span className="text-gray-600">Cancelled</span>
              </div>
              <span className="font-semibold">{data.statusCounts.cancelled}</span>
            </div>
          </div>
        </div>

        {/* Reservations Chart (Last 7 Days) */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
            <Calendar className="h-5 w-5 mr-2 text-tunisia-blue" />
            Reservations (Last 7 Days)
          </h3>
          <div className="flex items-end justify-between h-40 gap-2">
            {data.reservationsByDay.map((day) => (
              <div key={day.date} className="flex-1 flex flex-col items-center">
                <div className="w-full flex flex-col items-center justify-end h-32">
                  <span className="text-xs text-gray-600 mb-1">{day.count}</span>
                  <div
                    className="w-full bg-tunisia-red rounded-t"
                    style={{
                      height: `${(day.count / maxReservations) * 100}%`,
                      minHeight: day.count > 0 ? '8px' : '2px',
                    }}
                  />
                </div>
                <span className="text-xs text-gray-500 mt-2">
                  {formatDate(day.date)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Countries & Recent Reservations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Countries */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
            <Globe className="h-5 w-5 mr-2 text-purple-600" />
            Top Visitor Countries
          </h3>
          {data.topCountries.length === 0 ? (
            <p className="text-gray-500 text-sm">No visitor data yet</p>
          ) : (
            <div className="space-y-3">
              {data.topCountries.map((item, index) => (
                <div key={item.country} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="text-xl mr-3">{getCountryFlag(item.country)}</span>
                    <span className="text-gray-700">{item.country}</span>
                  </div>
                  <span className="font-semibold text-gray-900">{item.count}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Reservations */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
            <Clock className="h-5 w-5 mr-2 text-green-600" />
            Recent Reservations
          </h3>
          {data.recentReservations.length === 0 ? (
            <p className="text-gray-500 text-sm">No reservations yet</p>
          ) : (
            <div className="space-y-3">
              {data.recentReservations.map((reservation) => (
                <div key={reservation.id} className="flex items-center justify-between py-2 border-b last:border-0">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">{reservation.full_name}</p>
                    <p className="text-sm text-gray-500 truncate">{reservation.programTitle}</p>
                  </div>
                  <span className={cn(
                    'px-2 py-1 rounded-full text-xs font-medium ml-2',
                    statusColors[reservation.status] || statusColors.pending
                  )}>
                    {reservation.status || 'pending'}
                  </span>
                </div>
              ))}
            </div>
          )}
          <Link href="/admin/reservations" className="text-sm text-tunisia-blue hover:underline mt-4 inline-flex items-center">
            View all reservations <ArrowRight className="h-4 w-4 ml-1" />
          </Link>
        </div>
      </div>
    </div>
  );
}
