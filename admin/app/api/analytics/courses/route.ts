import { NextRequest, NextResponse } from 'next/server';
import { CourseModel, EnrollmentModel, authUtils } from '@amigo/shared';
import { db } from '@/lib/db';

// Get course analytics
export async function GET(request: NextRequest) {
  try {
    // Verify authentication
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.substring(7);
    const payload = authUtils.verifyToken(token);
    if (!payload || (payload.role !== 'admin' && payload.role !== 'instructor')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    await db.connect();

    const { searchParams } = new URL(request.url);
    const courseId = searchParams.get('courseId');

    if (courseId) {
      // Get analytics for specific course
      const [course, enrollments, completionRate] = await Promise.all([
        CourseModel.findById(courseId),
        EnrollmentModel.countDocuments({ courseId }),
        EnrollmentModel.aggregate([
          { $match: { courseId: courseId as any } },
          {
            $group: {
              _id: null,
              avgProgress: { $avg: '$progress' },
              completed: {
                $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] }
              }
            }
          }
        ])
      ]);

      if (!course) {
        return NextResponse.json({ error: 'Course not found' }, { status: 404 });
      }

      return NextResponse.json({
        course: {
          id: course._id,
          title: course.title,
          enrollments,
          avgProgress: completionRate[0]?.avgProgress || 0,
          completions: completionRate[0]?.completed || 0,
          completionRate: enrollments > 0 
            ? ((completionRate[0]?.completed || 0) / enrollments * 100).toFixed(2)
            : 0,
          rating: course.rating
        }
      });
    } else {
      // Get overview of all courses
      const courseStats = await CourseModel.aggregate([
        {
          $lookup: {
            from: 'enrollments',
            localField: '_id',
            foreignField: 'courseId',
            as: 'enrollments'
          }
        },
        {
          $project: {
            title: 1,
            status: 1,
            rating: 1,
            enrollmentCount: { $size: '$enrollments' },
            avgProgress: { $avg: '$enrollments.progress' },
            completions: {
              $size: {
                $filter: {
                  input: '$enrollments',
                  as: 'enrollment',
                  cond: { $eq: ['$$enrollment.status', 'completed'] }
                }
              }
            }
          }
        },
        {
          $sort: { enrollmentCount: -1 }
        },
        {
          $limit: 20
        }
      ]);

      return NextResponse.json({ courses: courseStats });
    }
  } catch (error) {
    console.error('Get course analytics error:', error);
    return NextResponse.json({ error: 'Failed to fetch course analytics' }, { status: 500 });
  }
}