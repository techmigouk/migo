import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { LessonModel } from '@amigo/shared';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ lessonId: string }> }
) {
  try {
    await db.connect();

    const { lessonId } = await params;

    // Fetch the specific lesson with all fields
    const lesson = await LessonModel.findById(lessonId).lean();

    if (!lesson) {
      return NextResponse.json(
        { error: 'Lesson not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(lesson);
  } catch (error) {
    console.error('Error fetching lesson:', error);
    return NextResponse.json(
      { error: 'Failed to fetch lesson' },
      { status: 500 }
    );
  }
}
