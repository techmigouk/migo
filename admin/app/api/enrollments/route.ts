import { NextRequest, NextResponse } from 'next/server';
import { EnrollmentModel, UserModel } from '@amigo/shared';
import { db } from '@/lib/db';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// GET user's enrollments or check enrollment status
export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };

    const { searchParams } = new URL(request.url);
    const courseId = searchParams.get('courseId');

    await db.connect();

    if (courseId) {
      // Check enrollment status for specific course
      const enrollment = await EnrollmentModel.findOne({
        userId: decoded.userId,
        courseId,
      }).lean();

      return NextResponse.json({
        success: true,
        data: {
          isEnrolled: !!enrollment,
          enrollment: enrollment || null,
        },
      });
    } else {
      // Get all enrollments for user
      const enrollments = await EnrollmentModel.find({ userId: decoded.userId })
        .populate('courseId')
        .sort({ lastAccessedAt: -1 })
        .lean();

      return NextResponse.json({
        success: true,
        data: enrollments,
      });
    }
  } catch (error: any) {
    console.error('Error fetching enrollments:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch enrollments' },
      { status: 500 }
    );
  }
}

// POST enroll in a course
export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };

    const body = await request.json();
    const { courseId } = body;

    if (!courseId) {
      return NextResponse.json(
        { success: false, error: 'Course ID is required' },
        { status: 400 }
      );
    }

    await db.connect();

    // Check if already enrolled
    const existingEnrollment = await EnrollmentModel.findOne({
      userId: decoded.userId,
      courseId,
    });

    if (existingEnrollment) {
      return NextResponse.json(
        { success: false, error: 'Already enrolled in this course' },
        { status: 400 }
      );
    }

    // Create enrollment
    const enrollment = new EnrollmentModel({
      userId: decoded.userId,
      courseId,
      status: 'active',
      enrolledAt: new Date(),
      lastAccessedAt: new Date(),
    });

    await enrollment.save();

    const populatedEnrollment = await EnrollmentModel.findById(enrollment._id)
      .populate('courseId')
      .lean();

    return NextResponse.json(
      { success: true, data: populatedEnrollment },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error creating enrollment:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to enroll in course' },
      { status: 500 }
    );
  }
}

// PUT update enrollment (progress, last accessed)
export async function PUT(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };

    const body = await request.json();
    const { courseId, progress, completedLessonId, timeSpent } = body;

    if (!courseId) {
      return NextResponse.json(
        { success: false, error: 'Course ID is required' },
        { status: 400 }
      );
    }

    await db.connect();

    const updateData: any = {
      lastAccessedAt: new Date(),
    };

    if (progress !== undefined) {
      updateData.progress = progress;
      if (progress >= 100) {
        updateData.status = 'completed';
        updateData.completedAt = new Date();
        
        // Award points for course completion
        await UserModel.findByIdAndUpdate(decoded.userId, {
          $inc: { points: 100, coursesCompleted: 1 },
        });
      }
    }

    if (completedLessonId) {
      updateData.$addToSet = { completedLessons: completedLessonId };
    }

    const enrollment = await EnrollmentModel.findOneAndUpdate(
      { userId: decoded.userId, courseId },
      updateData,
      { new: true }
    ).populate('courseId');

    // Update user time spent if provided
    if (timeSpent && timeSpent > 0) {
      await UserModel.findByIdAndUpdate(decoded.userId, {
        $inc: { totalTimeSpent: timeSpent },
      });
    }

    return NextResponse.json({
      success: true,
      data: enrollment,
    });
  } catch (error: any) {
    console.error('Error updating enrollment:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update enrollment' },
      { status: 500 }
    );
  }
}
