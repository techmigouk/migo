import { NextRequest, NextResponse } from 'next/server';
import { UserCourseEnrollmentModel } from '@amigo/shared';
import { db } from '@/lib/db';
import { getServerSession, authOptions } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ enrollments: [] });
    }

    await db.connect();

    const enrollments = await UserCourseEnrollmentModel.find({
      userId: session.user.id,
    })
      .select('courseId progress status lastAccessedLessonId completedLessons')
      .lean();

    // Create a map for easy lookup
    const enrollmentMap: Record<string, any> = {};
    enrollments.forEach((enrollment) => {
      enrollmentMap[enrollment.courseId.toString()] = {
        progress: enrollment.progress,
        status: enrollment.status,
        lastAccessedLessonId: enrollment.lastAccessedLessonId,
        completedLessons: enrollment.completedLessons,
      };
    });

    return NextResponse.json({ enrollments: enrollmentMap });

  } catch (error: any) {
    console.error('Get enrollments error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch enrollments' },
      { status: 500 }
    );
  }
}
