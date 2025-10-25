import { NextRequest, NextResponse } from 'next/server';
import { CourseModel } from '@amigo/shared';
import { db } from '@/lib/db';

export async function GET() {
  try {
    await db.connect();
    const courses = await CourseModel.find({}).populate('instructor', 'name email');
    return NextResponse.json({ success: true, courses });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch courses' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await db.connect();
    const body = await request.json();
    const course = new CourseModel(body);
    await course.save();
    
    return NextResponse.json({ success: true, course }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to create course' },
      { status: 500 }
    );
  }
}