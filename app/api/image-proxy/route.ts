import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const fileId = searchParams.get('id');

  if (!fileId) {
    return NextResponse.json({ error: 'Missing file ID' }, { status: 400 });
  }

  // Redirect to Google Drive thumbnail
  const url = `https://drive.google.com/thumbnail?id=${fileId}&sz=w2000`;
  return NextResponse.redirect(url);
}
