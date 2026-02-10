import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient, supabase } from '@/lib/supabase';
import { LiveEvent } from '@/types/database';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

// GET - Fetch active events (public, respects global toggle)
export async function GET() {
  try {
    // Check if live events are enabled
    const { data: setting } = await supabase
      .from('site_settings' as never)
      .select('value')
      .eq('key', 'live_events_enabled')
      .single<{ value: { enabled: boolean } }>();

    if (!setting?.value?.enabled) {
      return NextResponse.json([], {
        headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate' },
      });
    }

    const { data, error } = await supabase
      .from('live_events')
      .select('*')
      .eq('is_active', true)
      .order('event_date', { ascending: true })
      .returns<LiveEvent[]>();

    if (error) throw error;

    return NextResponse.json(data, {
      headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate' },
    });
  } catch (error) {
    console.error('Error fetching events:', error);
    return NextResponse.json(
      { error: 'Failed to fetch events' },
      { status: 500 }
    );
  }
}

// POST - Create a new event (admin only)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { event_type, name, description, location, event_date, image_url, is_active, team_a, team_b, score_a, score_b, match_status } = body;

    if (!event_type || !name || !event_date) {
      return NextResponse.json(
        { error: 'Missing required fields: event_type, name, event_date' },
        { status: 400 }
      );
    }

    if (!['match', 'general'].includes(event_type)) {
      return NextResponse.json(
        { error: 'event_type must be "match" or "general"' },
        { status: 400 }
      );
    }

    const adminClient = createAdminClient();

    const insertData = {
      event_type,
      name,
      description: description || null,
      location: location || null,
      event_date,
      image_url: image_url || null,
      is_active: is_active ?? true,
      team_a: event_type === 'match' ? (team_a || null) : null,
      team_b: event_type === 'match' ? (team_b || null) : null,
      score_a: event_type === 'match' ? (score_a ?? 0) : null,
      score_b: event_type === 'match' ? (score_b ?? 0) : null,
      match_status: event_type === 'match' ? (match_status || 'upcoming') : null,
    };

    const { data, error } = await adminClient
      .from('live_events')
      .insert(insertData as never)
      .select()
      .single<LiveEvent>();

    if (error) throw error;

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('Error creating event:', error);
    return NextResponse.json(
      { error: 'Failed to create event' },
      { status: 500 }
    );
  }
}
