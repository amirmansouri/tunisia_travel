import { NextRequest, NextResponse } from 'next/server';

// Force Node.js runtime for better compatibility
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Proxy Google Drive images to avoid mobile browser restrictions
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const fileId = searchParams.get('id');

  if (!fileId) {
    return new NextResponse('Missing file ID', { status: 400 });
  }

  try {
    // Use thumbnail endpoint for reliable image serving
    const imageUrl = `https://drive.google.com/thumbnail?id=${fileId}&sz=w2000`;

    const response = await fetch(imageUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'image/webp,image/apng,image/*,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
        'Referer': 'https://drive.google.com/',
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      console.error('Google Drive response error:', response.status, response.statusText);
      // Try alternative URL format
      const altUrl = `https://drive.google.com/uc?export=view&id=${fileId}`;
      const altResponse = await fetch(altUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        },
        redirect: 'follow',
      });

      if (!altResponse.ok) {
        return new NextResponse('Failed to fetch image', { status: 500 });
      }

      const altBuffer = await altResponse.arrayBuffer();
      const altContentType = altResponse.headers.get('content-type') || 'image/jpeg';

      return new NextResponse(altBuffer, {
        headers: {
          'Content-Type': altContentType,
          'Cache-Control': 'public, max-age=86400, s-maxage=86400, stale-while-revalidate=604800',
          'Access-Control-Allow-Origin': '*',
        },
      });
    }

    const imageBuffer = await response.arrayBuffer();
    const contentType = response.headers.get('content-type') || 'image/jpeg';

    return new NextResponse(imageBuffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=86400, s-maxage=86400, stale-while-revalidate=604800',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (error) {
    console.error('Image proxy error:', error);
    return new NextResponse('Failed to proxy image', { status: 500 });
  }
}
