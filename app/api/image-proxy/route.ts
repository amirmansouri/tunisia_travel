import { NextRequest, NextResponse } from 'next/server';

// Force Node.js runtime for better compatibility
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const fileId = searchParams.get('id');

  if (!fileId) {
    return new NextResponse('Missing file ID', { status: 400 });
  }

  try {
    // Try lh3.googleusercontent.com format first (most reliable)
    const lh3Url = `https://lh3.googleusercontent.com/d/${fileId}=w2000`;

    const lh3Response = await fetch(lh3Url, {
      headers: {
        'Accept': 'image/*',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      },
      redirect: 'follow',
    });

    if (lh3Response.ok) {
      const buffer = await lh3Response.arrayBuffer();
      const contentType = lh3Response.headers.get('content-type') || 'image/jpeg';

      return new NextResponse(buffer, {
        headers: {
          'Content-Type': contentType,
          'Cache-Control': 'public, max-age=31536000, immutable',
          'Access-Control-Allow-Origin': '*',
        },
      });
    }

    // Fallback to thumbnail format
    const thumbUrl = `https://drive.google.com/thumbnail?id=${fileId}&sz=w2000`;

    const thumbResponse = await fetch(thumbUrl, {
      headers: {
        'Accept': 'image/*',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      },
      redirect: 'follow',
    });

    if (thumbResponse.ok) {
      const buffer = await thumbResponse.arrayBuffer();
      const contentType = thumbResponse.headers.get('content-type') || 'image/jpeg';

      return new NextResponse(buffer, {
        headers: {
          'Content-Type': contentType,
          'Cache-Control': 'public, max-age=31536000, immutable',
          'Access-Control-Allow-Origin': '*',
        },
      });
    }

    // Last fallback to uc export
    const ucUrl = `https://drive.google.com/uc?export=view&id=${fileId}`;

    const ucResponse = await fetch(ucUrl, {
      headers: {
        'Accept': 'image/*',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      },
      redirect: 'follow',
    });

    if (!ucResponse.ok) {
      console.error('All Google Drive fetch methods failed for:', fileId);
      return new NextResponse('Image not found', { status: 404 });
    }

    const buffer = await ucResponse.arrayBuffer();
    const contentType = ucResponse.headers.get('content-type') || 'image/jpeg';

    return new NextResponse(buffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (error) {
    console.error('Proxy error:', error);
    return new NextResponse('Failed to fetch image', { status: 500 });
  }
}
