import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request: NextRequest) {
  try {
    const { publicId } = await request.json();

    if (!publicId) {
      return NextResponse.json(
        { success: false, error: 'No publicId provided' },
        { status: 400 }
      );
    }

    // Remove 'cloudinary://video/' prefix if present
    const cleanPublicId = publicId.replace('cloudinary://video/', '');

    // Generate signed HLS streaming URL that expires in 3 hours
    const expiresAt = Math.floor(Date.now() / 1000) + (3 * 60 * 60); // 3 hours from now

    // Generate HLS streaming URL with signature
    const hlsUrl = cloudinary.url(cleanPublicId, {
      resource_type: 'video',
      type: 'private', // Match upload type
      streaming_profile: 'hd',
      format: 'm3u8', // HLS format
      sign_url: true, // Sign the URL
      secure: true,
      expires_at: expiresAt,
      // Add subtle watermark
      transformation: [
        {
          overlay: {
            font_family: 'Arial',
            font_size: 60,
            font_weight: 'bold',
            text_align: 'center',
            text: 'TECHMIGO',
          },
          opacity: 8,
          gravity: 'center',
          color: '#FFFFFF',
        }
      ],
    });

    return NextResponse.json({
      success: true,
      url: hlsUrl,
      expiresAt,
      format: 'm3u8',
    });

  } catch (error: any) {
    console.error('Signed URL generation error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to generate signed URL' },
      { status: 500 }
    );
  }
}
