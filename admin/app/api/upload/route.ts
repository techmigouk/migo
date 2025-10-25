import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // Get the authorization header
    const authHeader = request.headers.get('Authorization');
    
    // Get form data
    const formData = await request.formData();
    
    // Forward request to main API
    const apiUrl = process.env.NEXT_PUBLIC_FRONT_URL || 'https://techmigo.co.uk';
    const response = await fetch(`${apiUrl}/api/upload`, {
      method: 'POST',
      headers: authHeader ? {
        'Authorization': authHeader,
      } : {},
      body: formData,
    });

    const data = await response.json();
    
    return NextResponse.json(data, { status: response.status });
  } catch (error: any) {
    console.error('Upload proxy error:', error);
    return NextResponse.json(
      { error: error.message || 'Upload failed' },
      { status: 500 }
    );
  }
}
