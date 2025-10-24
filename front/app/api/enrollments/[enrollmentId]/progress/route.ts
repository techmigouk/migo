import { NextRequest, NextResponse } from 'next/server';
import { EnrollmentModel, LessonModel, authUtils } from '@amigo/shared';
import { db } from '@/lib/db';
import { z } from 'zod';

const updateProgressSchema = z.object({
  lessonId: z.string(),
  completed: z.boolean()
});

// Update lesson progress
export async function PUT(
  request: NextRequest,
  { params }: { params: { enrollmentId: string } }
) {
  try {
    // Verify authentication
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.substring(7);
    const payload = authUtils.verifyToken(token);
    if (!payload) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await db.connect();

    const enrollment = await EnrollmentModel.findById(params.enrollmentId);

    if (!enrollment) {
      return NextResponse.json({ error: 'Enrollment not found' }, { status: 404 });
    }

    // Check if user owns this enrollment
    if (enrollment.userId.toString() !== payload.userId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const validationResult = updateProgressSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { error: validationResult.error.errors[0].message },
        { status: 400 }
      );
    }

    const { lessonId, completed } = validationResult.data;

    // Update completed lessons
    if (completed && !enrollment.completedLessons.includes(lessonId as any)) {
      enrollment.completedLessons.push(lessonId as any);
    } else if (!completed && enrollment.completedLessons.includes(lessonId as any)) {
      enrollment.completedLessons = enrollment.completedLessons.filter(
        (id: any) => id.toString() !== lessonId
      );
    }

    // Calculate progress percentage
    const totalLessons = await LessonModel.countDocuments({ 
      courseId: enrollment.courseId 
    });
    
    enrollment.progress = totalLessons > 0
      ? (enrollment.completedLessons.length / totalLessons) * 100
      : 0;

    // Update last accessed time
    enrollment.lastAccessedAt = new Date();

    // Check if course is completed
    if (enrollment.progress === 100 && enrollment.status !== 'completed') {
      enrollment.status = 'completed';
      enrollment.completedAt = new Date();
    }

    await enrollment.save();

    return NextResponse.json({ 
      enrollment: {
        id: enrollment._id,
        progress: enrollment.progress,
        completedLessons: enrollment.completedLessons,
        status: enrollment.status,
        completedAt: enrollment.completedAt
      }
    });
  } catch (error) {
    console.error('Update progress error:', error);
    return NextResponse.json({ error: 'Failed to update progress' }, { status: 500 });
  }
}