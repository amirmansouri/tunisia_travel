import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient, supabase } from '@/lib/supabase';
import { Program } from '@/types/database';

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET - Fetch a single program by ID (public)
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const resolvedParams = await params;
    const { data, error } = await supabase
      .from('programs')
      .select('*')
      .eq('id', resolvedParams.id)
      .eq('published', true)
      .single<Program>();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Program not found' },
          { status: 404 }
        );
      }
      throw error;
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching program:', error);
    return NextResponse.json(
      { error: 'Failed to fetch program' },
      { status: 500 }
    );
  }
}

// PUT - Update a program (admin only)
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const resolvedParams = await params;
    const body = await request.json();
    const { title, description, price, start_date, end_date, location, images, published, category } = body;

    // Validate required fields
    if (!title || !description || !price || !start_date || !end_date || !location) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate date range
    if (new Date(end_date) < new Date(start_date)) {
      return NextResponse.json(
        { error: 'End date must be after start date' },
        { status: 400 }
      );
    }

    const adminClient = createAdminClient();

    const updateData: Partial<Program> = {
      title,
      description,
      price: parseFloat(price),
      start_date,
      end_date,
      location,
      images: images || [],
      published: published ?? false,
      category: category || null,
    };

    const { data, error } = await adminClient
      .from('programs')
      .update(updateData as never)
      .eq('id', resolvedParams.id)
      .select()
      .single<Program>();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Program not found' },
          { status: 404 }
        );
      }
      throw error;
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error updating program:', error);
    return NextResponse.json(
      { error: 'Failed to update program' },
      { status: 500 }
    );
  }
}

// PATCH - Partial update (e.g., toggle published status)
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const resolvedParams = await params;
    const body = await request.json();

    const adminClient = createAdminClient();

    const { data, error } = await adminClient
      .from('programs')
      .update(body as never)
      .eq('id', resolvedParams.id)
      .select()
      .single<Program>();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Program not found' },
          { status: 404 }
        );
      }
      throw error;
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error updating program:', error);
    return NextResponse.json(
      { error: 'Failed to update program' },
      { status: 500 }
    );
  }
}

// DELETE - Delete a program (admin only)
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const resolvedParams = await params;
    const adminClient = createAdminClient();

    const { error } = await adminClient
      .from('programs')
      .delete()
      .eq('id', resolvedParams.id);

    if (error) {
      throw error;
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting program:', error);
    return NextResponse.json(
      { error: 'Failed to delete program' },
      { status: 500 }
    );
  }
}
