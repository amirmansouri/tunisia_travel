import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase';
import { Tournament } from '@/types/database';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET - Fetch a single tournament by ID
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const resolvedParams = await params;
    const adminClient = createAdminClient();

    const { data, error } = await adminClient
      .from('tournaments' as never)
      .select('*')
      .eq('id', resolvedParams.id)
      .single<Tournament>();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: 'Tournament not found' }, { status: 404 });
      }
      throw error;
    }

    return NextResponse.json(data, {
      headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate' },
    });
  } catch (error) {
    console.error('Error fetching tournament:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tournament' },
      { status: 500 }
    );
  }
}

// PUT - Full update of a tournament (admin only)
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const resolvedParams = await params;
    const body = await request.json();
    const { name, description, location, start_date, end_date, image_url, max_teams, num_pools, status, is_published } = body;

    if (!name) {
      return NextResponse.json(
        { error: 'Missing required field: name' },
        { status: 400 }
      );
    }

    const adminClient = createAdminClient();

    const updateData = {
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
      .update(updateData as never)
      .eq('id', resolvedParams.id)
      .select()
      .single<Tournament>();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: 'Tournament not found' }, { status: 404 });
      }
      throw error;
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error updating tournament:', error);
    return NextResponse.json(
      { error: 'Failed to update tournament' },
      { status: 500 }
    );
  }
}

// DELETE - Delete a tournament (admin only)
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const resolvedParams = await params;
    const adminClient = createAdminClient();

    const { error } = await adminClient
      .from('tournaments' as never)
      .delete()
      .eq('id', resolvedParams.id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting tournament:', error);
    return NextResponse.json(
      { error: 'Failed to delete tournament' },
      { status: 500 }
    );
  }
}
