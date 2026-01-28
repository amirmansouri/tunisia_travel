import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const fileId = searchParams.get('id');

  if (!fileId) {
    return new NextResponse('Missing file ID', { status: 400 });
  }

  // Redirect to Google Drive thumbnail URL directly
  // This is the most reliable method and avoids serverless function timeouts
  const thumbnailUrl = `https://drive.google.com/thumbnail?id=${fileId}&sz=w2000`;

  return NextResponse.redirect(thumbnailUrl, { status: 302 });
}
