import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const supabase = createAdminClient();

    // Get counts from all tables
    const [programsResult, reservationsResult, visitorsResult] = await Promise.all([
      supabase.from('programs').select('*', { count: 'exact', head: true }),
      supabase.from('reservations').select('*', { count: 'exact', head: true }),
      supabase.from('visitors').select('*', { count: 'exact', head: true }),
    ]);

    // Get recent activity and last ping
    const [recentVisitors, recentReservations, lastPing] = await Promise.all([
      supabase
        .from('visitors')
        .select('created_at')
        .order('created_at', { ascending: false })
        .limit(1)
        .returns<Array<{ created_at: string }>>(),
      supabase
        .from('reservations')
        .select('created_at')
        .order('created_at', { ascending: false })
        .limit(1)
        .returns<Array<{ created_at: string }>>(),
      supabase
        .from('system_pings')
        .select('pinged_at, status')
        .order('pinged_at', { ascending: false })
        .limit(1)
        .returns<Array<{ pinged_at: string; status: string }>>(),
    ]);

    // Estimate database size (rough approximation)
    // Programs: ~2KB each, Reservations: ~0.5KB each, Visitors: ~0.3KB each
    const programsCount = programsResult.count || 0;
    const reservationsCount = reservationsResult.count || 0;
    const visitorsCount = visitorsResult.count || 0;

    const estimatedSizeKB =
      programsCount * 2 + reservationsCount * 0.5 + visitorsCount * 0.3;
    const estimatedSizeMB = estimatedSizeKB / 1024;

    return NextResponse.json({
      counts: {
        programs: programsCount,
        reservations: reservationsCount,
        visitors: visitorsCount,
        total_rows: programsCount + reservationsCount + visitorsCount,
      },
      storage: {
        estimated_kb: Math.round(estimatedSizeKB * 100) / 100,
        estimated_mb: Math.round(estimatedSizeMB * 100) / 100,
        limit_mb: 500,
        usage_percent: Math.round((estimatedSizeMB / 500) * 10000) / 100,
      },
      last_activity: {
        last_visitor: recentVisitors.data?.[0]?.created_at || null,
        last_reservation: recentReservations.data?.[0]?.created_at || null,
      },
      last_ping: lastPing.data?.[0]?.pinged_at || null,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Stats error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    );
  }
}
