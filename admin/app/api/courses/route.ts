import { NextRequest, NextResponse } from 'next/server';
import { CourseModel } from '@amigo/shared';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    await db.connect();
    
    // Get query parameters for pagination
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '50'); // Default 50 courses
    const page = parseInt(searchParams.get('page') || '1');
    const skip = (page - 1) * limit;
    
    // Use lean() for faster queries and select only needed fields
    const courses = await CourseModel.find({})
      .select('title description thumbnail status category difficulty level price currency createdAt updatedAt')
      .lean()
      .sort({ createdAt: -1 }) // Most recent first
      .limit(limit)
      .skip(skip);
      
    const total = await CourseModel.countDocuments({});
    
    return NextResponse.json({ 
      success: true, 
      courses,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    });
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
    
    console.log('Creating course with data:', body);
    
    const course = new CourseModel(body);
    await course.save();
    
    console.log('Course created successfully:', course._id);
    
    return NextResponse.json({ success: true, course }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating course:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create course' },
      { status: 500 }
    );
  }
}