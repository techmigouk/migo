import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    console.log('📋 Profile complete proxy - request received');
    
    // Get the authorization header
    const authHeader = request.headers.get('Authorization');
    console.log('🔑 Auth header present:', !!authHeader);
    
    // Get request body
    const body = await request.json();
    console.log('📝 Request body userId:', body.userId);
    
    // Forward request to main API
    const apiUrl = process.env.NEXT_PUBLIC_FRONT_URL || process.env.NEXT_PUBLIC_API_URL || 'https://techmigo.co.uk';
    const fullUrl = `${apiUrl}/api/profile/complete`;
    
    console.log('🌐 Forwarding to:', fullUrl);
    
    const response = await fetch(fullUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(authHeader ? { 'Authorization': authHeader } : {}),
      },
      body: JSON.stringify(body),
    });

    console.log('📥 Response status:', response.status);
    
    const data = await response.json();
    console.log('📦 Response data:', { success: data.success, error: data.error });
    
    return NextResponse.json(data, { status: response.status });
  } catch (error: any) {
    console.error('❌ Profile complete proxy error:', error.message || error);
    console.error('Stack:', error.stack);
    return NextResponse.json(
      { error: `Proxy error: ${error.message || 'Profile update failed'}` },
      { status: 500 }
    );
  }
}
