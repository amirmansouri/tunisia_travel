import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient, supabase } from '@/lib/supabase';
import { Tournament } from '@/types/database';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

// GET - Fetch published tournaments (public)
export async function GET() {
  try {
    const { data, error } = await supabase
      .from('tournaments' as never)
      .select('*')
      .eq('is_published', true)
      .order('start_date', { ascending: true })
      .returns<Tournament[]>();

    if (error) throw error;

    return NextResponse.json(data, {
      headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate' },
    });
  } catch (error) {
    console.error('Error fetching tournaments:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tournaments' },
      { status: 500 }
    );
  }
}

// POST - Create a new tournament (admin only)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, description, location, start_date, end_date, image_url, max_teams, num_pools, status, is_published } = body;

    if (!name) {
      return NextResponse.json(
        { error: 'Missing required field: name' },
        { status: 400 }
      );
    }

    const adminClient = createAdminClient();

    const insertData = {
      name,
      description: description || null,
      location: location || null,
      start_date: start_date || null,
      end_date: end_date || null,
      image_url: image_url || null,
      max_teams: max_teams ?? 32,
      num_pools: num_pools ?? 4,
      status: status || 'registration',
      is_published: is_published ?? false,
    };

    const { data, error } = await adminClient
      .from('tournaments' as never)
      .insert(insertData as never)
      .select()
      .single<Tournament>();

    if (error) throw error;

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('Error creating tournament:', error);
    return NextResponse.json(
      { error: 'Failed to create tournament' },
      { status: 500 }
    );
  }
}
