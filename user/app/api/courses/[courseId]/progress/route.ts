import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { verifyToken } from '@/lib/auth';
import { LessonProgress } from '@/../shared/src/models/LessonProgress';

export async function GET(
  request: NextRequest,
  { params }: { params: { courseId: string } }
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

    // Get all progress records for this user and course using Mongoose model
    const progressRecords = await LessonProgress
      .find({
        userId: user.userId,
        courseId: params.courseId
      })
      .lean();

    // Transform into a map of lessonId -> progress data
    const progressMap: Record<string, any> = {};
    progressRecords.forEach((record: any) => {
      progressMap[record.lessonId.toString()] = {
        isCompleted: record.isCompleted || false,
        quizCompleted: record.quizCompleted || false,
        isUnlocked: record.isUnlocked || false,
        completedAt: record.completedAt,
        quizCompletedAt: record.quizCompletedAt,
        lastAccessedAt: record.lastAccessedAt || record.updatedAt,
      };
    });

    return NextResponse.json({ progress: progressMap });
  } catch (error) {
    console.error('Error fetching lesson progress:', error);
    return NextResponse.json(
      { error: 'Failed to fetch lesson progress' },
      { status: 500 }
    );
  }
}
