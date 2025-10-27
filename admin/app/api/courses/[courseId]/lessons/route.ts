import { NextRequest, NextResponse } from 'next/server';
import { LessonModel } from '@amigo/shared';
import { db } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: { courseId: string } }
) {
  try {
    await db.connect();
    const lessons = await LessonModel.find({ courseId: params.courseId }).sort({ order: 1 });
    return NextResponse.json({ lessons });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch lessons' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { courseId: string } }
) {
  try {
    await db.connect();
    const body = await request.json();
    const lesson = new LessonModel({
      ...body,
      courseId: params.courseId
    });
    await lesson.save();
    
    return NextResponse.json(lesson, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create lesson' },
      { status: 500 }
    );
  }
}
