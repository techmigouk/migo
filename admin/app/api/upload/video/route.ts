import { NextRequest, NextResponse } from 'next/server';
import { fileStorage, FILE_SIZE_LIMITS, ALLOWED_FILE_TYPES } from '@amigo/shared';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const courseId = formData.get('courseId') as string;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    if (!courseId) {
      return NextResponse.json({ error: 'Course ID is required' }, { status: 400 });
    }

    // Validate file size
    if (!fileStorage.validateFileSize(file.size, FILE_SIZE_LIMITS.VIDEO)) {
      return NextResponse.json(
        { error: `File size exceeds limit of ${FILE_SIZE_LIMITS.VIDEO / 1024 / 1024}MB` },
        { status: 400 }
      );
    }

    // Validate file type
    if (!fileStorage.validateFileType(file.name, ALLOWED_FILE_TYPES.VIDEO)) {
      return NextResponse.json(
        { error: 'Invalid file type. Allowed types: ' + ALLOWED_FILE_TYPES.VIDEO.join(', ') },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload video
    const result = await fileStorage.uploadVideo(buffer, file.name, courseId);

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error('Video upload error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Upload failed' },
      { status: 500 }
    );
  }
}

export const config = {
  api: {
    bodyParser: false, // Disable body parser for file uploads
  },
};