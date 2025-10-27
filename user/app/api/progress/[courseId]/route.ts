import { NextRequest, NextResponse } from 'next/server';
import { UserCourseEnrollmentModel, LessonModel } from '@amigo/shared';
import { db } from '@/lib/db';
import { getServerSession } from '@/lib/auth';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ courseId: string }> }
) {
  try {
    const session = await getServerSession();
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { courseId } = await context.params;
    await db.connect();

    const enrollment = await UserCourseEnrollmentModel.findOne({
      userId: session.user.id,
      courseId: courseId,
    }).populate('lastAccessedLessonId');

    if (!enrollment) {
      return NextResponse.json(
        { error: 'Not enrolled in this course' },
        { status: 404 }
      );
    }

    // Get all lessons for the course
    const lessons = await LessonModel.find({ courseId }).sort({ order: 1 });

    return NextResponse.json({
      enrollment,
      completedLessons: enrollment.completedLessons,
      progress: enrollment.progress,
      lastAccessedLesson: enrollment.lastAccessedLessonId,
      totalLessons: lessons.length,
      quizScores: enrollment.quizScores,
    });

  } catch (error: any) {
    console.error('Get progress error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch progress' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ courseId: string }> }
) {
  try {
    const session = await getServerSession();
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { courseId } = await context.params;
    const body = await request.json();
    await db.connect();

    const enrollment = await UserCourseEnrollmentModel.findOne({
      userId: session.user.id,
      courseId: courseId,
    });

    if (!enrollment) {
      return NextResponse.json(
        { error: 'Not enrolled in this course' },
        { status: 404 }
      );
    }

    // Update fields
    if (body.lastAccessedLessonId) {
      enrollment.lastAccessedLessonId = body.lastAccessedLessonId;
      enrollment.lastAccessedAt = new Date();
    }

    if (body.completedLessonId) {
      if (!enrollment.completedLessons.includes(body.completedLessonId)) {
        enrollment.completedLessons.push(body.completedLessonId);
      }
    }

    if (body.quizScore !== undefined && body.lessonId) {
      enrollment.quizScores.set(body.lessonId, body.quizScore);
    }

    // Calculate progress percentage
    const totalLessons = await LessonModel.countDocuments({ courseId });
    enrollment.progress = totalLessons > 0 
      ? Math.round((enrollment.completedLessons.length / totalLessons) * 100)
      : 0;

    // Check if course is completed
    if (enrollment.progress === 100) {
      enrollment.status = 'completed';
    }

    await enrollment.save();

    return NextResponse.json({
      success: true,
      enrollment,
      message: 'Progress updated successfully',
    });

  } catch (error: any) {
    console.error('Update progress error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update progress' },
      { status: 500 }
    );
  }
}
