import { NextRequest, NextResponse } from 'next/server';
import { fileStorage, FILE_SIZE_LIMITS, ALLOWED_FILE_TYPES } from '@amigo/shared';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const courseId = formData.get('courseId') as string;
    const lessonId = formData.get('lessonId') as string | null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    if (!courseId) {
      return NextResponse.json({ error: 'Course ID is required' }, { status: 400 });
    }

    // Validate file size
    if (!fileStorage.validateFileSize(file.size, FILE_SIZE_LIMITS.DOCUMENT)) {
      return NextResponse.json(
        { error: `File size exceeds limit of ${FILE_SIZE_LIMITS.DOCUMENT / 1024 / 1024}MB` },
        { status: 400 }
      );
    }

    // Validate file type (allow documents, audio, and images)
    const allowedTypes = [
      ...ALLOWED_FILE_TYPES.DOCUMENT,
      ...ALLOWED_FILE_TYPES.AUDIO,
      ...ALLOWED_FILE_TYPES.IMAGE,
    ];
    
    if (!fileStorage.validateFileType(file.name, allowedTypes)) {
      return NextResponse.json(
        { error: 'Invalid file type. Allowed types: ' + allowedTypes.join(', ') },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload resource
    const result = await fileStorage.uploadResource(
      buffer,
      file.name,
      courseId,
      lessonId || undefined
    );

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error('Resource upload error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Upload failed' },
      { status: 500 }
    );
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
};