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
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const type = formData.get('type') as string; // 'image' or 'video'

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file provided' },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload to Cloudinary
    const result = await new Promise((resolve, reject) => {
      const uploadOptions: any = {
        folder: 'techmigo/courses',
        resource_type: type === 'video' ? 'video' : 'image',
      };

      // Additional options for videos
      if (type === 'video') {
        uploadOptions.folder = 'techmigo/courses/intro-videos';
        uploadOptions.eager = [
          { streaming_profile: 'hd', format: 'm3u8' }, // HLS streaming
        ];
        uploadOptions.eager_async = true; // Process async, return MP4 first
        uploadOptions.type = 'upload'; // Use regular upload type for compatibility
      }

      // Additional options for images
      if (type === 'image') {
        uploadOptions.folder = 'techmigo/courses/thumbnails';
        uploadOptions.transformation = [
          { quality: 'auto', fetch_format: 'auto' }, // Auto optimize
        ];
      }

      cloudinary.uploader.upload_stream(
        uploadOptions,
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      ).end(buffer);
    });

    const uploadResult = result as any;

    // Return the secure Cloudinary URL
    return NextResponse.json({
      success: true,
      url: uploadResult.secure_url,
      publicId: uploadResult.public_id,
      resourceType: uploadResult.resource_type,
      format: uploadResult.format,
      width: uploadResult.width,
      height: uploadResult.height,
      duration: uploadResult.duration,
    });

  } catch (error: any) {
    console.error('Cloudinary upload error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Upload failed' },
      { status: 500 }
    );
  }
}
