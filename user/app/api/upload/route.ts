import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    console.log('📤 Upload proxy - request received');
    
    // Get the authorization header
    const authHeader = request.headers.get('Authorization');
    console.log('🔑 Auth header present:', !!authHeader);
    
    // Get form data
    const formData = await request.formData();
    const file = formData.get('file') as File;
    console.log('📁 File:', file?.name, file?.size, file?.type);
    
    // Forward request to main API
    const apiUrl = process.env.NEXT_PUBLIC_FRONT_URL || process.env.NEXT_PUBLIC_API_URL || 'https://techmigo.co.uk';
    const fullUrl = `${apiUrl}/api/upload`;
    
    console.log('🌐 Forwarding to:', fullUrl);
    
    const response = await fetch(fullUrl, {
      method: 'POST',
      headers: authHeader ? {
        'Authorization': authHeader,
      } : {},
      body: formData,
    });

    console.log('📥 Response status:', response.status);
    
    const data = await response.json();
    console.log('📦 Response data:', { success: data.success, url: data.url, error: data.error });
    
    return NextResponse.json(data, { status: response.status });
  } catch (error: any) {
    console.error('❌ Upload proxy error:', error.message || error);
    console.error('Stack:', error.stack);
    return NextResponse.json(
      { error: `Proxy error: ${error.message || 'Upload failed'}` },
      { status: 500 }
    );
  }
}
