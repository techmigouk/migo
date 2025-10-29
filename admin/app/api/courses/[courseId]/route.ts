import { NextRequest, NextResponse } from 'next/server';
import { CourseModel } from '@amigo/shared';
import { db } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: { courseId: string } }
) {
  try {
    console.log('📖 Fetching course:', params.courseId);
    await db.connect();
    const course = await CourseModel.findById(params.courseId);
    
    if (!course) {
      console.log('❌ Course not found:', params.courseId);
      return NextResponse.json(
        { success: false, error: 'Course not found' },
        { status: 404 }
      );
    }
    
    console.log('✅ Course found:', course.title);
    return NextResponse.json({ success: true, course });
  } catch (error: any) {
    console.error('❌ Error fetching course:', error.message);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch course' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { courseId: string } }
) {
  try {
    console.log('📝 Updating course:', params.courseId);
    await db.connect();
    const body = await request.json();
    console.log('Update data:', body);
    
    const course = await CourseModel.findByIdAndUpdate(
      params.courseId,
      body,
      { new: true, runValidators: true }
    );
    
    if (!course) {
      console.log('❌ Course not found for update:', params.courseId);
      return NextResponse.json(
        { success: false, error: 'Course not found' },
        { status: 404 }
      );
    }
    
    console.log('✅ Course updated successfully:', course.title);
    return NextResponse.json({ success: true, course });
  } catch (error: any) {
    console.error('❌ Error updating course:', error.message);
    return NextResponse.json(
      { success: false, error: 'Failed to update course: ' + error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { courseId: string } }
) {
  try {
    console.log('🗑️ Deleting course:', params.courseId);
    await db.connect();
    const course = await CourseModel.findByIdAndDelete(params.courseId);
    
    if (!course) {
      console.log('❌ Course not found for deletion:', params.courseId);
      return NextResponse.json(
        { success: false, error: 'Course not found' },
        { status: 404 }
      );
    }
    
    console.log('✅ Course deleted successfully:', course.title);
    return NextResponse.json({ success: true, message: 'Course deleted successfully' });
  } catch (error: any) {
    console.error('❌ Error deleting course:', error.message);
    return NextResponse.json(
      { success: false, error: 'Failed to delete course: ' + error.message },
      { status: 500 }
    );
  }
}
