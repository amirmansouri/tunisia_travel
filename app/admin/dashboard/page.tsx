import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';
import DashboardStats from '@/components/admin/DashboardStats';
import { createAdminClient } from '@/lib/supabase';

async function getDashboardData() {
  const supabase = createAdminClient();

  // Get counts
  const [programsResult, reservationsResult, visitorsResult] = await Promise.all([
    supabase.from('programs').select('*', { count: 'exact', head: true }),
    supabase.from('reservations').select('*', { count: 'exact', head: true }),
    supabase.from('visitors').select('*', { count: 'exact', head: true }),
  ]);

  // Get reservations by status
  const { data: reservations } = await supabase
    .from('reservations')
    .select('status, created_at, program_id')
    .returns<Array<{ status: string; created_at: string; program_id: string }>>();

  // Get recent reservations
  const { data: recentReservations } = await supabase
    .from('reservations')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(5)
    .returns<Array<{ id: string; full_name: string; email: string; status: string; created_at: string; program_id: string }>>();

  // Get programs for revenue calculation
  const { data: programs } = await supabase
    .from('programs')
    .select('id, title, price')
    .returns<Array<{ id: string; title: string; price: number }>>();

  // Get visitors by country
  const { data: visitors } = await supabase
    .from('visitors')
    .select('country, created_at')
    .returns<Array<{ country: string; created_at: string }>>();

  // Calculate stats
  const statusCounts = {
    pending: 0,
    confirmed: 0,
    completed: 0,
    cancelled: 0,
  };

  reservations?.forEach((r) => {
    const status = r.status || 'pending';
    if (status in statusCounts) {
      statusCounts[status as keyof typeof statusCounts]++;
    }
  });

  // Calculate potential revenue (from confirmed + completed)
  const programsMap = new Map(programs?.map((p) => [p.id, p]) || []);
  let potentialRevenue = 0;
  let confirmedRevenue = 0;

  reservations?.forEach((r) => {
    const program = programsMap.get(r.program_id);
    if (program) {
      if (r.status === 'confirmed' || r.status === 'completed') {
        confirmedRevenue += program.price;
      }
      if (r.status !== 'cancelled') {
        potentialRevenue += program.price;
      }
    }
  });

  // Group visitors by country
  const countryCount: Record<string, number> = {};
  visitors?.forEach((v) => {
    const country = v.country || 'Unknown';
    countryCount[country] = (countryCount[country] || 0) + 1;
  });

  const topCountries = Object.entries(countryCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([country, count]) => ({ country, count }));

  // Group reservations by date (last 7 days)
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    return date.toISOString().split('T')[0];
  });

  const reservationsByDay = last7Days.map((date) => ({
    date,
    count: reservations?.filter((r) => r.created_at.split('T')[0] === date).length || 0,
  }));

  // Map recent reservations with program titles
  const recentWithPrograms = recentReservations?.map((r) => ({
    ...r,
    programTitle: programsMap.get(r.program_id)?.title || 'Unknown Program',
  })) || [];

  return {
    counts: {
      programs: programsResult.count || 0,
      reservations: reservationsResult.count || 0,
      visitors: visitorsResult.count || 0,
    },
    statusCounts,
    potentialRevenue,
    confirmedRevenue,
    topCountries,
    reservationsByDay,
    recentReservations: recentWithPrograms,
  };
}

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function AdminDashboardPage() {
  const data = await getDashboardData();

  return (
    <div className="min-h-screen bg-gray-100">
      <AdminSidebar />

      <div className="lg:pl-64">
        <div className="pt-14 lg:pt-0">
          <AdminHeader
            title="Dashboard"
            description="Overview of your travel business"
          />

          <main className="p-4 sm:p-6 lg:p-8">
            <DashboardStats data={data} />
          </main>
        </div>
      </div>
    </div>
  );
}
