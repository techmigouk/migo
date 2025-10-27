import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { verifyToken } from '@/lib/auth';
import { LessonProgress } from '@/../shared/src/models/LessonProgress';

export async function POST(
  request: NextRequest,
  { params }: { params: { lessonId: string } }
) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = verifyToken(token);
    if (!user) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    await db.connect();

    // Update or create progress record using Mongoose
    const progress = await LessonProgress.findOneAndUpdate(
      {
        userId: user.userId,
        lessonId: params.lessonId
      },
      {
        userId: user.userId,
        lessonId: params.lessonId,
        isCompleted: true,
        completedAt: new Date()
      },
      {
        upsert: true,
        new: true
      }
    );

    return NextResponse.json({ success: true, progress });
  } catch (error) {
    console.error('Error marking lesson complete:', error);
    return NextResponse.json(
      { error: 'Failed to mark lesson complete' },
      { status: 500 }
    );
  }
}
