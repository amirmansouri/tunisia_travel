import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient, supabase } from '@/lib/supabase';
import { Program } from '@/types/database';

// GET - Fetch all published programs (public)
export async function GET() {
  try {
    const { data, error } = await supabase
      .from('programs')
      .select('*')
      .eq('published', true)
      .order('start_date', { ascending: true })
      .returns<Program[]>();

    if (error) {
      throw error;
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching programs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch programs' },
      { status: 500 }
    );
  }
}

// POST - Create a new program (admin only)
export async function POST(request: NextRequest) {
  try {
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

    const insertData = {
      title,
      description,
      price: parseFloat(price),
      start_date,
      end_date,
      location,
      images: images || [],
      published: published || false,
      category: category || null,
    };

    const { data, error } = await adminClient
      .from('programs')
      .insert(insertData as never)
      .select()
      .single<Program>();

    if (error) {
      throw error;
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('Error creating program:', error);
    return NextResponse.json(
      { error: 'Failed to create program' },
      { status: 500 }
    );
  }
}
