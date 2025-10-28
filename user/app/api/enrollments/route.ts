import { NextRequest, NextResponse } from 'next/server';
import { UserCourseEnrollmentModel } from '@amigo/shared';
import { db } from '@/lib/db';
import { getServerSession, authOptions } from '@/lib/auth';

// Add caching
export const dynamic = 'force-dynamic';
export const revalidate = 30; // Cache for 30 seconds

export async function GET(request: NextRequest) {
  try {
    console.log('[Enrollments API] Fetching enrollments...');
    const startTime = Date.now();
    
    const session = await getServerSession(authOptions);
    console.log('[Enrollments API] Session check in', Date.now() - startTime, 'ms');
    
    if (!session?.user?.id) {
      console.log('[Enrollments API] No session, returning empty');
      return NextResponse.json({ enrollments: [] });
    }

    await db.connect();
    console.log('[Enrollments API] Database connected in', Date.now() - startTime, 'ms');

    const enrollments = await UserCourseEnrollmentModel.find({
      userId: session.user.id,
    })
      .select('courseId progress status lastAccessedLessonId completedLessons')
      .lean()
      .maxTimeMS(3000); // 3 second timeout

    console.log('[Enrollments API] Found', enrollments.length, 'enrollments in', Date.now() - startTime, 'ms');

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
    console.error('[Enrollments API] Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch enrollments', enrollments: {} },
      { status: 500 }
    );
  }
}
