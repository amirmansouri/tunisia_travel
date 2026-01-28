import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const fileId = searchParams.get('id');

  if (!fileId) {
    return new Response('Missing file ID', { status: 400 });
  }

  // Multiple URL formats to try
  const urls = [
    `https://drive.google.com/uc?export=view&id=${fileId}`,
    `https://drive.google.com/thumbnail?id=${fileId}&sz=w1200`,
    `https://lh3.googleusercontent.com/d/${fileId}`,
  ];

  for (const url of urls) {
    try {
      const response = await fetch(url, {
        redirect: 'follow',
        headers: {
          'Accept': 'image/webp,image/apng,image/*,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.9',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        },
      });

      if (response.ok) {
        const contentType = response.headers.get('content-type') || '';

        // Only accept image responses
        if (contentType.includes('image')) {
          const data = await response.arrayBuffer();

          return new Response(data, {
            headers: {
              'Content-Type': contentType,
              'Cache-Control': 'public, max-age=86400, s-maxage=86400',
              'Access-Control-Allow-Origin': '*',
            },
          });
        }
      }
    } catch {
      continue;
    }
  }

  return new Response('Image not found', { status: 404 });
}
