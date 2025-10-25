import { NextRequest, NextResponse } from 'next/server';
import { CourseModel } from '@amigo/shared';
import { db } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await db.connect();
    const course = await CourseModel.findById(params.id).populate('instructor', 'name email');
    
    if (!course) {
      return NextResponse.json(
        { success: false, error: 'Course not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true, course });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch course' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await db.connect();
    const body = await request.json();
    const course = await CourseModel.findByIdAndUpdate(
      params.id,
      body,
      { new: true, runValidators: true }
    );
    
    if (!course) {
      return NextResponse.json(
        { success: false, error: 'Course not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true, course });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to update course' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await db.connect();
    const course = await CourseModel.findByIdAndDelete(params.id);
    
    if (!course) {
      return NextResponse.json(
        { success: false, error: 'Course not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true, message: 'Course deleted successfully' });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to delete course' },
      { status: 500 }
    );
  }
}