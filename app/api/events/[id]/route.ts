import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase';
import { LiveEvent } from '@/types/database';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET - Fetch a single event by ID
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const resolvedParams = await params;
    const adminClient = createAdminClient();

    const { data, error } = await adminClient
      .from('live_events')
      .select('*')
      .eq('id', resolvedParams.id)
      .single<LiveEvent>();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: 'Event not found' }, { status: 404 });
      }
      throw error;
    }

    return NextResponse.json(data, {
      headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate' },
    });
  } catch (error) {
    console.error('Error fetching event:', error);
    return NextResponse.json(
      { error: 'Failed to fetch event' },
      { status: 500 }
    );
  }
}

// PUT - Full update of an event (admin only)
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const resolvedParams = await params;
    const body = await request.json();
    const { event_type, name, description, location, event_date, image_url, is_active, team_a, team_b, score_a, score_b, match_status } = body;

    if (!event_type || !name || !event_date) {
      return NextResponse.json(
        { error: 'Missing required fields: event_type, name, event_date' },
        { status: 400 }
      );
    }

    const adminClient = createAdminClient();

    const updateData = {
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
      .update(updateData as never)
      .eq('id', resolvedParams.id)
      .select()
      .single<LiveEvent>();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: 'Event not found' }, { status: 404 });
      }
      throw error;
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error updating event:', error);
    return NextResponse.json(
      { error: 'Failed to update event' },
      { status: 500 }
    );
  }
}

// PATCH - Partial update (e.g., toggle active, update scores)
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const resolvedParams = await params;
    const body = await request.json();
    const adminClient = createAdminClient();

    const { data, error } = await adminClient
      .from('live_events')
      .update(body as never)
      .eq('id', resolvedParams.id)
      .select()
      .single<LiveEvent>();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: 'Event not found' }, { status: 404 });
      }
      throw error;
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error updating event:', error);
    return NextResponse.json(
      { error: 'Failed to update event' },
      { status: 500 }
    );
  }
}

// DELETE - Delete an event (admin only)
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const resolvedParams = await params;
    const adminClient = createAdminClient();

    const { error } = await adminClient
      .from('live_events')
      .delete()
      .eq('id', resolvedParams.id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting event:', error);
    return NextResponse.json(
      { error: 'Failed to delete event' },
      { status: 500 }
    );
  }
}
