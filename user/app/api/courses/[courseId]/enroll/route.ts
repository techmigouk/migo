import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { UserCourseEnrollmentModel } from '@amigo/shared';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// POST - Enroll user in course
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ courseId: string }> }
) {
  try {
    await db.connect();

    // Get token from Authorization header or cookie
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '') || request.cookies.get('token')?.value;
    
    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized - No token provided' },
        { status: 401 }
      );
    }

    let userId: string;
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as any;
      userId = decoded.userId || decoded.id;
    } catch (error) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized - Invalid token' },
        { status: 401 }
      );
    }

    const { courseId } = await params;

    // Check if already enrolled
    const existingEnrollment = await UserCourseEnrollmentModel.findOne({
      userId,
      courseId
    });

    if (existingEnrollment) {
      return NextResponse.json({
        success: false,
        message: 'Already enrolled in this course',
        enrollment: existingEnrollment
      });
    }

    // Create new enrollment
    const enrollment = await UserCourseEnrollmentModel.create({
      userId,
      courseId,
      progress: 0,
      status: 'active',
      completedLessons: [],
      quizScores: {}
    });

    return NextResponse.json({
      success: true,
      message: 'Successfully enrolled',
      enrollment
    });
  } catch (error) {
    console.error('Error enrolling in course:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to enroll in course' },
      { status: 500 }
    );
  }
}

// GET - Check enrollment status
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ courseId: string }> }
) {
  try {
    await db.connect();

    // Get token from Authorization header or cookie
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '') || request.cookies.get('token')?.value;
    
    if (!token) {
      return NextResponse.json(
        { enrolled: false },
        { status: 200 }
      );
    }

    let userId: string;
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as any;
      userId = decoded.userId || decoded.id;
    } catch (error) {
      return NextResponse.json(
        { enrolled: false },
        { status: 200 }
      );
    }

    const { courseId } = await params;

    const enrollment = await UserCourseEnrollmentModel.findOne({
      userId,
      courseId
    });

    return NextResponse.json({
      enrolled: !!enrollment,
      enrollment: enrollment || null
    });
  } catch (error) {
    console.error('Error checking enrollment:', error);
    return NextResponse.json(
      { enrolled: false },
      { status: 500 }
    );
  }
}
