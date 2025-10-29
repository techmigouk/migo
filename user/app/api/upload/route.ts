import { NextRequest, NextResponse } from 'next/server';
import { put } from '@vercel/blob';

export async function POST(request: NextRequest) {
  try {
    console.log('📤 Upload request received')
    
    // Check authorization
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('❌ No authorization header or invalid format')
      return NextResponse.json({ error: 'Unauthorized - Please login first' }, { status: 401 });
    }

    console.log('✅ Authorization header present')

    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      console.log('❌ No file in form data')
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    console.log('📁 File received:', { name: file.name, type: file.type, size: file.size })

    // Validate file type
    if (!file.type.startsWith('image/')) {
      console.log('❌ Invalid file type:', file.type)
      return NextResponse.json({ error: 'Only image files are allowed' }, { status: 400 });
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      console.log('❌ File too large:', file.size)
      return NextResponse.json({ error: 'File size exceeds 5MB limit' }, { status: 400 });
    }

    console.log('✅ File validation passed')

    // Generate unique filename
    const timestamp = Date.now();
    const originalName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const filename = `user-uploads/${timestamp}-${originalName}`;

    console.log('☁️ Uploading to Vercel Blob:', filename)

    // Get token from environment
    const token = process.env.BLOB_READ_WRITE_TOKEN;
    
    if (!token) {
      console.error('❌ BLOB_READ_WRITE_TOKEN not found in environment')
      return NextResponse.json({ error: 'Server configuration error: Upload token not configured' }, { status: 500 });
    }

    // Upload to Vercel Blob with explicit token
    const blob = await put(filename, file, {
      access: 'public',
      addRandomSuffix: false,
      token: token,
    });

    console.log('✅ File uploaded successfully:', blob.url)

    return NextResponse.json(
      {
        success: true,
        url: blob.url,
        filename: filename,
      },
      {
        status: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
      }
    );
  } catch (error: any) {
    console.error('❌ Upload error:', error.message || error);
    console.error('Stack:', error.stack);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Upload failed' },
      { status: 500 }
    );
  }
}

// Add CORS headers
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
