import { NextRequest, NextResponse } from 'next/server';
import { fileStorage } from '@amigo/shared';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { key } = body;

    if (!key) {
      return NextResponse.json({ error: 'File key is required' }, { status: 400 });
    }

    // Get signed URL (valid for 1 hour by default)
    const expiresIn = parseInt(body.expiresIn || '3600');
    const url = await fileStorage.getSignedUrl(key, expiresIn);

    return NextResponse.json({
      success: true,
      data: { url, expiresIn },
    });
  } catch (error) {
    console.error('Signed URL error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to generate signed URL' },
      { status: 500 }
    );
  }
}