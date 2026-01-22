import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const programId = searchParams.get('program_id');

    if (!programId) {
      return NextResponse.json(
        { error: 'program_id is required' },
        { status: 400 }
      );
    }

    const adminClient = createAdminClient();
    const { data, error } = await adminClient
      .from('reviews')
      .select('*')
      .eq('program_id', programId)
      .eq('approved', true)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching reviews:', error);
      return NextResponse.json(
        { error: 'Failed to fetch reviews' },
        { status: 500 }
      );
    }

    return NextResponse.json(data || []);
  } catch (error) {
    console.error('Reviews fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { program_id, user_name, user_email, rating, comment } = body;

    console.log('Review submission received:', { program_id, user_name, user_email, rating });

    // Validation
    if (!program_id || !user_name || !user_email || !rating || !comment) {
      console.log('Validation failed: missing fields');
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Rating validation
    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: 'Rating must be between 1 and 5' },
        { status: 400 }
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(user_email)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      );
    }

    const adminClient = createAdminClient();

    const insertData = {
      program_id,
      user_name,
      user_email,
      rating: Number(rating),
      comment,
      approved: false,
    };

    console.log('Inserting review:', insertData);

    const { data, error } = await adminClient
      .from('reviews')
      .insert(insertData as never)
      .select();

    if (error) {
      console.error('Error saving review:', error.message, error.details, error.hint);
      return NextResponse.json(
        { error: `Failed to save review: ${error.message}` },
        { status: 500 }
      );
    }

    console.log('Review saved successfully:', data);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Review submission error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
