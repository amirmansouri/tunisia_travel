import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    // Verify this is a legitimate cron request (optional security)
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}` && process.env.CRON_SECRET) {
      // Allow requests without secret in development or if secret not set
      if (process.env.NODE_ENV === 'production' && process.env.CRON_SECRET) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
    }

    const supabase = createAdminClient();

    // Ping the database by doing a simple query
    const { count, error } = await supabase
      .from('programs')
      .select('*', { count: 'exact', head: true });

    if (error) {
      console.error('Cron ping failed:', error);
      return NextResponse.json(
        { status: 'error', message: error.message, timestamp: new Date().toISOString() },
        { status: 500 }
      );
    }

    // Store the ping timestamp in the database
    const { error: pingError } = await supabase
      .from('system_pings')
      .insert({ pinged_at: new Date().toISOString(), status: 'success', programs_count: count } as never);

    if (pingError) {
      // Table might not exist yet, that's okay
      console.log('Could not store ping (table may not exist):', pingError.message);
    }

    console.log(`Cron ping successful at ${new Date().toISOString()}`);

    return NextResponse.json({
      status: 'success',
      message: 'Database pinged successfully',
      programs_count: count,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Cron ping error:', error);
    return NextResponse.json(
      { status: 'error', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
