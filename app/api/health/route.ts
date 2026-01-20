import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase';

// This endpoint keeps Supabase active by making a simple query
// Can be called by external cron services like cron-job.org
export async function GET() {
  try {
    const supabase = createAdminClient();

    // Simple query to keep database active
    const { count, error } = await supabase
      .from('programs')
      .select('*', { count: 'exact', head: true });

    if (error) {
      return NextResponse.json(
        { status: 'error', message: error.message, timestamp: new Date().toISOString() },
        { status: 500 }
      );
    }

    return NextResponse.json({
      status: 'healthy',
      database: 'connected',
      programs_count: count,
      timestamp: new Date().toISOString(),
      message: 'Ping successful - Supabase is active',
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: 'error',
        message: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}
