import { NextRequest } from 'next/server';

// Use Edge Runtime - faster and better for proxying on Vercel
export const runtime = 'edge';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const fileId = searchParams.get('id');

  if (!fileId) {
    return new Response('Missing file ID', { status: 400 });
  }

  // Try thumbnail URL first (most reliable)
  const url = `https://drive.google.com/thumbnail?id=${fileId}&sz=w1200`;

  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
      },
    });

    if (!response.ok) {
      return new Response('Image not found', { status: 404 });
    }

    const data = await response.arrayBuffer();
    const contentType = response.headers.get('content-type') || 'image/jpeg';

    return new Response(data, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch {
    return new Response('Failed to fetch image', { status: 500 });
  }
}
