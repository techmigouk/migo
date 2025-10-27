import { NextRequest, NextResponse } from 'next/server';
import { CourseModel } from '@amigo/shared';
import { db } from '@/lib/db';

export async function GET() {
  try {
    await db.connect();
    
    // Only return published courses for the user-facing app
    const courses = await CourseModel.find({ 
      status: 'published' 
    })
    .populate('instructor', 'name email avatar')
    .sort({ createdAt: -1 });
    
    return NextResponse.json({ 
      success: true,
      courses 
    });
  } catch (error) {
    console.error('Error fetching courses:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to fetch courses',
        courses: [] 
      },
      { status: 500 }
    );
  }
}
