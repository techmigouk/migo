import { NextRequest, NextResponse } from 'next/server';
import { EnrollmentModel, CourseModel, authUtils } from '@amigo/shared';
import { db } from '@/lib/db';

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

// POST create enrollment
export async function POST(request: NextRequest) {
  try {
    // Check authorization
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Unauthorized - No token provided' },
        { status: 401, headers: corsHeaders }
      );
    }

    const token = authHeader.substring(7);
    const payload = authUtils.verifyToken(token);
    
    if (!payload) {
      return NextResponse.json(
        { error: 'Unauthorized - Invalid token' },
        { status: 401, headers: corsHeaders }
      );
    }

    await db.connect();
    const body = await request.json();
    const { courseId } = body;
    const userId = payload.userId;

    // Check if user is already enrolled
    const existingEnrollment = await EnrollmentModel.findOne({ userId, courseId });
    if (existingEnrollment) {
      return NextResponse.json(
        { error: 'Already enrolled in this course' },
        { status: 400, headers: corsHeaders }
      );
    }

    // Create new enrollment
    const enrollment = await EnrollmentModel.create({
      userId,
      courseId,
      enrolledAt: new Date(),
      status: 'active',
      progress: 0,
      completedLessons: []
    });

    // Update course enrollment count
    await CourseModel.findByIdAndUpdate(courseId, {
      $inc: { enrollmentCount: 1 }
    });

    return NextResponse.json({ 
      success: true,
      enrollment 
    }, { 
      status: 201, 
      headers: corsHeaders 
    });
  } catch (error: any) {
    console.error('POST /api/enrollments error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to enroll in course' },
      { status: 500, headers: corsHeaders }
    );
  }
}

// GET user enrollments
export async function GET(request: NextRequest) {
  try {
    // Check authorization
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Unauthorized - No token provided' },
        { status: 401, headers: corsHeaders }
      );
    }

    const token = authHeader.substring(7);
    const payload = authUtils.verifyToken(token);
    
    if (!payload) {
      return NextResponse.json(
        { error: 'Unauthorized - Invalid token' },
        { status: 401, headers: corsHeaders }
      );
    }

    await db.connect();
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId') || payload.userId;

    const enrollments = await EnrollmentModel.find({ userId })
      .populate('courseId')
      .sort({ enrolledAt: -1 });

    return NextResponse.json({ 
      success: true,
      enrollments 
    }, { headers: corsHeaders });
  } catch (error: any) {
    console.error('GET /api/enrollments error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch enrollments' },
      { status: 500, headers: corsHeaders }
    );
  }
}