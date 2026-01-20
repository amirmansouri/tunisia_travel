import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';
import CalendarView from '@/components/admin/CalendarView';
import { createAdminClient } from '@/lib/supabase';
import { Program, ReservationWithProgram } from '@/types/database';

async function getData() {
  const supabase = createAdminClient();

  const [programsResult, reservationsResult] = await Promise.all([
    supabase
      .from('programs')
      .select('*')
      .order('start_date', { ascending: true }),
    supabase
      .from('reservations')
      .select(`
        *,
        program:programs(id, title, start_date, end_date, location)
      `)
      .order('created_at', { ascending: false }),
  ]);

  return {
    programs: (programsResult.data || []) as Program[],
    reservations: (reservationsResult.data || []) as ReservationWithProgram[],
  };
}

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function AdminCalendarPage() {
  const { programs, reservations } = await getData();

  return (
    <div className="min-h-screen bg-gray-100">
      <AdminSidebar />

      <div className="lg:pl-64">
        <div className="pt-14 lg:pt-0">
          <AdminHeader
            title="Calendar"
            description="View programs and reservations on a calendar"
          />

          <main className="p-4 sm:p-6 lg:p-8">
            <CalendarView programs={programs} reservations={reservations} />
          </main>
        </div>
      </div>
    </div>
  );
}
