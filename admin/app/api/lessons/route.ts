import { NextRequest, NextResponse } from 'next/server';
import { LessonModel } from '@amigo/shared';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    await db.connect();
    
    const { searchParams } = new URL(request.url);
    const courseId = searchParams.get('courseId');
    
    const query = courseId ? { courseId } : {};
    const lessons = await LessonModel.find(query)
      .sort({ order: 1 })
      .lean();
    
    return NextResponse.json({ lessons });
  } catch (error) {
    console.error('Error fetching lessons:', error);
    return NextResponse.json(
      { error: 'Failed to fetch lessons' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await db.connect();
    const body = await request.json();
    
    // Validate required fields
    if (!body.courseId) {
      return NextResponse.json(
        { error: 'Course ID is required' },
        { status: 400 }
      );
    }
    
    if (!body.title) {
      return NextResponse.json(
        { error: 'Title is required' },
        { status: 400 }
      );
    }
    
    const lesson = new LessonModel(body);
    await lesson.save();
    
    return NextResponse.json(lesson, { status: 201 });
  } catch (error) {
    console.error('Error creating lesson:', error);
    return NextResponse.json(
      { error: 'Failed to create lesson' },
      { status: 500 }
    );
  }
}
