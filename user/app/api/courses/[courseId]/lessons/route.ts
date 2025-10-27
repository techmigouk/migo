import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { LessonModel } from '@amigo/shared';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ courseId: string }> }
) {
  try {
    await db.connect();

    const { courseId } = await params;

    // Fetch all lessons for the course, sorted by order
    const lessons = await LessonModel.find({ courseId })
      .sort({ order: 1 })
      .select('_id courseId title description order videoUrl duration isPreview quiz')
      .lean();

    return NextResponse.json(lessons);
  } catch (error) {
    console.error('Error fetching course lessons:', error);
    return NextResponse.json(
      { error: 'Failed to fetch lessons' },
      { status: 500 }
    );
  }
}
