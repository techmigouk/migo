import { NextRequest, NextResponse } from 'next/server';
import { fileStorage, FILE_SIZE_LIMITS, ALLOWED_FILE_TYPES, UserModel } from '@amigo/shared';
import { db } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    // Get user ID from auth header (implement auth middleware)
    const userId = request.headers.get('x-user-id');
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Validate file size
    if (!fileStorage.validateFileSize(file.size, FILE_SIZE_LIMITS.IMAGE)) {
      return NextResponse.json(
        { error: `File size exceeds limit of ${FILE_SIZE_LIMITS.IMAGE / 1024 / 1024}MB` },
        { status: 400 }
      );
    }

    // Validate file type
    if (!fileStorage.validateFileType(file.name, ALLOWED_FILE_TYPES.IMAGE)) {
      return NextResponse.json(
        { error: 'Invalid file type. Allowed types: ' + ALLOWED_FILE_TYPES.IMAGE.join(', ') },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload avatar
    const result = await fileStorage.uploadAvatar(buffer, file.name, userId);

    // Update user profile with new avatar URL
    await db.connect();
    await UserModel.findByIdAndUpdate(userId, {
      'profile.avatar': result.url,
    });

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error('Avatar upload error:', error);
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