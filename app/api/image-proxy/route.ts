import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const fileId = searchParams.get('id');

  if (!fileId) {
    return new NextResponse('Missing file ID', { status: 400 });
  }

  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;

  if (!cloudName) {
    // Fallback to direct Google Drive if Cloudinary not configured
    return NextResponse.redirect(`https://drive.google.com/thumbnail?id=${fileId}&sz=w2000`);
  }

  // Use Cloudinary fetch - it fetches from Google Drive and caches on Cloudinary CDN
  const googleUrl = encodeURIComponent(`https://drive.google.com/thumbnail?id=${fileId}&sz=w2000`);
  const cloudinaryUrl = `https://res.cloudinary.com/${cloudName}/image/fetch/f_auto,q_auto/${googleUrl}`;

  return NextResponse.redirect(cloudinaryUrl);
}
