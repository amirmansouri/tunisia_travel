import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';
import ReservationImport from '@/components/admin/ReservationImport';
import ReservationCard from '@/components/admin/ReservationCard';
import ReservationFilters from '@/components/admin/ReservationFilters';
import { createAdminClient } from '@/lib/supabase';
import { Program, Reservation, ReservationWithProgram } from '@/types/database';

async function getReservations(): Promise<ReservationWithProgram[]> {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from('reservations')
    .select('*')
    .order('created_at', { ascending: false })
    .returns<Reservation[]>();

  if (error || !data) {
    console.error('Error fetching reservations:', error);
    return [];
  }

  const reservations = data;

  // Fetch associated programs
  const programIds = [...new Set(reservations.map((r) => r.program_id))];
  const { data: programsData } = await supabase
    .from('programs')
    .select('*')
    .in('id', programIds)
    .returns<Program[]>();

  const programs = programsData || [];

  // Map programs to reservations
  return reservations.map((reservation) => ({
    ...reservation,
    status: reservation.status || 'pending',
    program: programs.find((p) => p.id === reservation.program_id),
  }));
}

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function AdminReservationsPage() {
  const reservations = await getReservations();

  const stats = {
    total: reservations.length,
    pending: reservations.filter((r) => r.status === 'pending').length,
    confirmed: reservations.filter((r) => r.status === 'confirmed').length,
    completed: reservations.filter((r) => r.status === 'completed').length,
    cancelled: reservations.filter((r) => r.status === 'cancelled').length,
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <AdminSidebar />

      <div className="lg:pl-64">
        <div className="pt-14 lg:pt-0">
          <AdminHeader
            title="Reservations"
            description={`${reservations.length} reservation requests`}
          />

          <main className="p-4 sm:p-6 lg:p-8">
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
              <div className="bg-white rounded-xl p-4 shadow-sm">
                <p className="text-sm text-gray-500">Total</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-sm border-l-4 border-yellow-500">
                <p className="text-sm text-gray-500">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-sm border-l-4 border-blue-500">
                <p className="text-sm text-gray-500">Confirmed</p>
                <p className="text-2xl font-bold text-blue-600">{stats.confirmed}</p>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-sm border-l-4 border-green-500">
                <p className="text-sm text-gray-500">Completed</p>
                <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-sm border-l-4 border-red-500">
                <p className="text-sm text-gray-500">Cancelled</p>
                <p className="text-2xl font-bold text-red-600">{stats.cancelled}</p>
              </div>
            </div>

            {/* Import/Export Section */}
            <div className="mb-6">
              <ReservationImport />
            </div>

            {/* Filters */}
            <ReservationFilters reservations={reservations} />
          </main>
        </div>
      </div>
    </div>
  );
}
