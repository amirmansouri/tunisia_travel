import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase';

// POST - Log a visitor (once per session)
export async function POST(request: NextRequest) {
  try {
    // Get IP address from headers
    const forwardedFor = request.headers.get('x-forwarded-for');
    const ip_address = forwardedFor ? forwardedFor.split(',')[0].trim() : 'unknown';

    // Get user agent
    const user_agent = request.headers.get('user-agent') || 'unknown';

    // Get geo info from Vercel headers (if available)
    const country = request.headers.get('x-vercel-ip-country') || null;
    const city = request.headers.get('x-vercel-ip-city') || null;

    const adminClient = createAdminClient();

    await adminClient
      .from('visitors')
      .insert({
        ip_address,
        user_agent,
        country,
        city,
      } as never);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error logging visitor:', error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}

// GET - Get all visitors (admin only)
export async function GET() {
  try {
    const adminClient = createAdminClient();

    const { data, error } = await adminClient
      .from('visitors')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(500);

    if (error) {
      throw error;
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching visitors:', error);
    return NextResponse.json(
      { error: 'Failed to fetch visitors' },
      { status: 500 }
    );
  }
}
