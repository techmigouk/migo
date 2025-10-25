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
    
    console.log('Updating course:', params.id)
    console.log('Update data:', body)
    
    const course = await CourseModel.findByIdAndUpdate(
      params.id,
      body,
      { new: true, runValidators: true }
    );
    
    if (!course) {
      console.error('Course not found:', params.id)
      return NextResponse.json(
        { success: false, error: 'Course not found' },
        { status: 404 }
      );
    }
    
    console.log('Course updated successfully:', course._id)
    return NextResponse.json({ success: true, course });
  } catch (error: any) {
    console.error('Error updating course:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update course' },
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