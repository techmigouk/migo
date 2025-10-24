import { NextRequest, NextResponse } from 'next/server';
import { LessonModel } from '@amigo/shared';
import { db } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await db.connect();
    const lessons = await LessonModel.find({ courseId: params.id }).sort({ order: 1 });
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
  { params }: { params: { id: string } }
) {
  try {
    await db.connect();
    const body = await request.json();
    const lesson = new LessonModel({
      ...body,
      courseId: params.id
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