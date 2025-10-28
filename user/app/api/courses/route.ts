import { NextRequest, NextResponse } from 'next/server';
import { CourseModel } from '@amigo/shared';
import { db } from '@/lib/db';

// Add caching
export const dynamic = 'force-dynamic';
export const revalidate = 60; // Cache for 60 seconds

export async function GET() {
  try {
    console.log('[Courses API] Fetching courses from database...');
    const startTime = Date.now();
    
    await db.connect();
    console.log('[Courses API] Database connected in', Date.now() - startTime, 'ms');
    
    // Only return published courses for the user-facing app
    const courses = await CourseModel.find({ 
      status: 'published' 
    })
    .populate('instructor', 'name email avatar')
    .sort({ createdAt: -1 })
    .lean() // Use lean() for faster queries
    .limit(100) // Limit to prevent slow queries
    .maxTimeMS(5000); // 5 second timeout
    
    console.log('[Courses API] Found', courses.length, 'courses in', Date.now() - startTime, 'ms');
    
    return NextResponse.json({ 
      success: true,
      courses 
    });
  } catch (error) {
    console.error('[Courses API] Error fetching courses:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to fetch courses',
        message: error instanceof Error ? error.message : 'Unknown error',
        courses: [] 
      },
      { status: 500 }
    );
  }
}
