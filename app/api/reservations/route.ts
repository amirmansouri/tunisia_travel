import { NextRequest, NextResponse } from 'next/server';
import { supabase, createAdminClient } from '@/lib/supabase';
import { Reservation } from '@/types/database';

// POST - Create a new reservation (public)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { program_id, full_name, phone, email, message } = body;

    // Validate required fields
    if (!program_id || !full_name || !phone || !email) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Verify program exists and is published
    const { data: programData, error: programError } = await supabase
      .from('programs')
      .select('id, title')
      .eq('id', program_id)
      .eq('published', true)
      .single();

    const program = programData as { id: string; title: string } | null;

    if (programError || !program) {
      return NextResponse.json(
        { error: 'Program not found or not available' },
        { status: 404 }
      );
    }

    const insertData = {
      program_id,
      full_name: full_name.trim(),
      phone: phone.trim(),
      email: email.trim().toLowerCase(),
      message: message?.trim() || null,
    };

    // Create reservation using public client (RLS allows inserts)
    const { data, error } = await supabase
      .from('reservations')
      .insert(insertData as never)
      .select()
      .single<Reservation>();

    if (error) {
      throw error;
    }

    return NextResponse.json(
      {
        success: true,
        reservation: data,
        program_title: program.title,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating reservation:', error);
    return NextResponse.json(
      { error: 'Failed to submit reservation' },
      { status: 500 }
    );
  }
}

// GET - Fetch all reservations (admin only)
export async function GET() {
  try {
    const adminClient = createAdminClient();

    const { data, error } = await adminClient
      .from('reservations')
      .select('*, programs(title, location, price)')
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching reservations:', error);
    return NextResponse.json(
      { error: 'Failed to fetch reservations' },
      { status: 500 }
    );
  }
}
