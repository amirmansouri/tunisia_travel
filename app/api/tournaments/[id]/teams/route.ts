import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient, supabase } from '@/lib/supabase';
import { TournamentTeam } from '@/types/database';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET - Fetch teams for a tournament
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const resolvedParams = await params;

    const { data, error } = await supabase
      .from('tournament_teams' as never)
      .select('*')
      .eq('tournament_id', resolvedParams.id)
      .order('pool', { ascending: true })
      .order('seed', { ascending: true })
      .returns<TournamentTeam[]>();

    if (error) throw error;

    return NextResponse.json(data, {
      headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate' },
    });
  } catch (error) {
    console.error('Error fetching teams:', error);
    return NextResponse.json(
      { error: 'Failed to fetch teams' },
      { status: 500 }
    );
  }
}

// POST - Register a new team or perform admin actions on teams
export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const resolvedParams = await params;
    const body = await request.json();
    const adminClient = createAdminClient();

    // Handle admin actions
    if (body._action === 'delete') {
      const { error } = await adminClient
        .from('tournament_teams' as never)
        .delete()
        .eq('id', body.team_id);
      if (error) throw error;
      return NextResponse.json({ success: true });
    }

    if (body._action === 'update_pool') {
      const { error } = await adminClient
        .from('tournament_teams' as never)
        .update({ pool: body.pool } as never)
        .eq('id', body.team_id);
      if (error) throw error;
      return NextResponse.json({ success: true });
    }

    if (body._action === 'toggle_confirm') {
      const { error } = await adminClient
        .from('tournament_teams' as never)
        .update({ is_confirmed: body.is_confirmed } as never)
        .eq('id', body.team_id);
      if (error) throw error;
      return NextResponse.json({ success: true });
    }

    // Normal team registration
    const { name, country, captain_name, captain_phone, captain_email, pool, seed, is_confirmed } = body;

    if (!name) {
      return NextResponse.json(
        { error: 'Missing required field: name' },
        { status: 400 }
      );
    }

    const insertData = {
      tournament_id: resolvedParams.id,
      name,
      country: country || null,
      captain_name: captain_name || null,
      captain_phone: captain_phone || null,
      captain_email: captain_email || null,
      pool: pool || null,
      seed: seed ?? null,
      is_confirmed: is_confirmed ?? false,
    };

    const { data, error } = await adminClient
      .from('tournament_teams' as never)
      .insert(insertData as never)
      .select()
      .single<TournamentTeam>();

    if (error) throw error;

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('Error with team operation:', error);
    return NextResponse.json(
      { error: 'Failed to perform team operation' },
      { status: 500 }
    );
  }
}
