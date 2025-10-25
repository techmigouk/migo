import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // Get the authorization header
    const authHeader = request.headers.get('Authorization');
    
    // Get request body
    const body = await request.json();
    
    // Forward request to main API
    const apiUrl = process.env.NEXT_PUBLIC_FRONT_URL || 'https://techmigo.co.uk';
    const response = await fetch(`${apiUrl}/api/profile/complete`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(authHeader ? { 'Authorization': authHeader } : {}),
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    
    return NextResponse.json(data, { status: response.status });
  } catch (error: any) {
    console.error('Profile complete proxy error:', error);
    return NextResponse.json(
      { error: error.message || 'Profile update failed' },
      { status: 500 }
    );
  }
}
