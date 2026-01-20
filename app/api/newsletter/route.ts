import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

interface NewsletterRecord {
  id: string;
  subscribed: boolean;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email } = body;

    // Validation
    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      );
    }

    // Check if already subscribed
    const { data } = await supabase
      .from('newsletter')
      .select('id, subscribed')
      .eq('email', email)
      .single();

    const existing = data as NewsletterRecord | null;

    if (existing) {
      if (existing.subscribed) {
        return NextResponse.json({ success: true, message: 'Already subscribed' });
      } else {
        // Resubscribe
        await supabase
          .from('newsletter')
          .update({ subscribed: true } as never)
          .eq('id', existing.id);
        return NextResponse.json({ success: true });
      }
    }

    const { error } = await supabase.from('newsletter').insert({
      email,
      subscribed: true,
    } as never);

    if (error) {
      console.error('Error saving newsletter subscription:', error);
      return NextResponse.json(
        { error: 'Failed to subscribe' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Newsletter error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
