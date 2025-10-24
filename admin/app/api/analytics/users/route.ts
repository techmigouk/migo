import { NextRequest, NextResponse } from 'next/server';
import { UserModel, EnrollmentModel, authUtils } from '@amigo/shared';
import { db } from '@/lib/db';

// Get user analytics
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

    // User growth over time
    const userGrowth = await UserModel.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
            day: { $dayOfMonth: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 }
      }
    ]);

    // User distribution by role
    const usersByRole = await UserModel.aggregate([
      {
        $group: {
          _id: '$role',
          count: { $sum: 1 }
        }
      }
    ]);

    // Active users (users who accessed courses recently)
    const activeUsers = await EnrollmentModel.aggregate([
      {
        $match: {
          lastAccessedAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$lastAccessedAt' },
            month: { $month: '$lastAccessedAt' },
            day: { $dayOfMonth: '$lastAccessedAt' }
          },
          users: { $addToSet: '$userId' }
        }
      },
      {
        $project: {
          _id: 1,
          count: { $size: '$users' }
        }
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 }
      }
    ]);

    // Most engaged users
    const topUsers = await EnrollmentModel.aggregate([
      {
        $group: {
          _id: '$userId',
          enrollments: { $sum: 1 },
          avgProgress: { $avg: '$progress' },
          completions: {
            $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] }
          }
        }
      },
      {
        $sort: { completions: -1, enrollments: -1 }
      },
      {
        $limit: 10
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user'
        }
      },
      {
        $unwind: '$user'
      },
      {
        $project: {
          userId: '$_id',
          name: '$user.name',
          email: '$user.email',
          enrollments: 1,
          avgProgress: { $round: ['$avgProgress', 2] },
          completions: 1
        }
      }
    ]);

    return NextResponse.json({
      userGrowth,
      usersByRole,
      activeUsers,
      topUsers,
      period: {
        days,
        startDate,
        endDate: new Date()
      }
    });
  } catch (error) {
    console.error('Get user analytics error:', error);
    return NextResponse.json({ error: 'Failed to fetch user analytics' }, { status: 500 });
  }
}