import { NextRequest, NextResponse } from 'next/server';
import { 
  UserModel, 
  CourseModel, 
  EnrollmentModel, 
  PaymentModel,
  authUtils 
} from '@amigo/shared';
import { db } from '@/lib/db';

// Get dashboard overview statistics
export async function GET(request: NextRequest) {
  try {
    // Verify authentication
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.substring(7);
    const payload = authUtils.verifyToken(token);
    if (!payload || payload.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden - Admin only' }, { status: 403 });
    }

    await db.connect();

    const { searchParams } = new URL(request.url);
    const days = parseInt(searchParams.get('days') || '30');
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Run all queries in parallel
    const [
      totalUsers,
      newUsers,
      totalCourses,
      publishedCourses,
      totalEnrollments,
      newEnrollments,
      totalRevenue,
      recentRevenue,
      activeUsers
    ] = await Promise.all([
      UserModel.countDocuments(),
      UserModel.countDocuments({ createdAt: { $gte: startDate } }),
      CourseModel.countDocuments(),
      CourseModel.countDocuments({ status: 'published' }),
      EnrollmentModel.countDocuments(),
      EnrollmentModel.countDocuments({ enrolledAt: { $gte: startDate } }),
      PaymentModel.aggregate([
        { $match: { status: 'completed' } },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ]),
      PaymentModel.aggregate([
        { 
          $match: { 
            status: 'completed',
            createdAt: { $gte: startDate }
          } 
        },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ]),
      EnrollmentModel.distinct('userId', { 
        lastAccessedAt: { $gte: startDate } 
      })
    ]);

    return NextResponse.json({
      overview: {
        users: {
          total: totalUsers,
          new: newUsers,
          active: activeUsers.length
        },
        courses: {
          total: totalCourses,
          published: publishedCourses
        },
        enrollments: {
          total: totalEnrollments,
          new: newEnrollments
        },
        revenue: {
          total: totalRevenue[0]?.total || 0,
          recent: recentRevenue[0]?.total || 0,
          currency: 'USD'
        }
      },
      period: {
        days,
        startDate,
        endDate: new Date()
      }
    });
  } catch (error) {
    console.error('Get overview error:', error);
    return NextResponse.json({ error: 'Failed to fetch overview' }, { status: 500 });
  }
}