import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase';
import { TournamentStanding } from '@/types/database';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET - Fetch standings for a tournament
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const resolvedParams = await params;
    const adminClient = createAdminClient();

    const { data, error } = await adminClient
      .from('tournament_standings' as never)
      .select('*, team:tournament_teams(*)')
      .eq('tournament_id', resolvedParams.id)
      .order('pool', { ascending: true })
      .order('rank', { ascending: true })
      .returns<TournamentStanding[]>();

    if (error) throw error;

    return NextResponse.json(data, {
      headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate' },
    });
  } catch (error) {
    console.error('Error fetching standings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch standings' },
      { status: 500 }
    );
  }
}
