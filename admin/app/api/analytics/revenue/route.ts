import { NextRequest, NextResponse } from 'next/server';
import { PaymentModel, authUtils } from '@amigo/shared';
import { db } from '@/lib/db';

// Get revenue analytics
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
    const period = searchParams.get('period') || 'month'; // day, week, month, year
    const limit = parseInt(searchParams.get('limit') || '12');

    let groupBy: any;
    let dateRange = new Date();

    switch (period) {
      case 'day':
        dateRange.setDate(dateRange.getDate() - limit);
        groupBy = {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' },
          day: { $dayOfMonth: '$createdAt' }
        };
        break;
      case 'week':
        dateRange.setDate(dateRange.getDate() - (limit * 7));
        groupBy = {
          year: { $year: '$createdAt' },
          week: { $week: '$createdAt' }
        };
        break;
      case 'year':
        dateRange.setFullYear(dateRange.getFullYear() - limit);
        groupBy = {
          year: { $year: '$createdAt' }
        };
        break;
      default: // month
        dateRange.setMonth(dateRange.getMonth() - limit);
        groupBy = {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' }
        };
    }

    const revenueData = await PaymentModel.aggregate([
      {
        $match: {
          status: 'completed',
          createdAt: { $gte: dateRange }
        }
      },
      {
        $group: {
          _id: groupBy,
          revenue: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1, '_id.week': 1 }
      },
      {
        $limit: limit
      }
    ]);

    // Get top selling courses
    const topCourses = await PaymentModel.aggregate([
      {
        $match: {
          status: 'completed',
          courseId: { $ne: null }
        }
      },
      {
        $group: {
          _id: '$courseId',
          revenue: { $sum: '$amount' },
          sales: { $sum: 1 }
        }
      },
      {
        $sort: { revenue: -1 }
      },
      {
        $limit: 10
      },
      {
        $lookup: {
          from: 'courses',
          localField: '_id',
          foreignField: '_id',
          as: 'course'
        }
      },
      {
        $unwind: '$course'
      },
      {
        $project: {
          courseId: '$_id',
          courseName: '$course.title',
          revenue: 1,
          sales: 1
        }
      }
    ]);

    return NextResponse.json({
      revenue: revenueData,
      topCourses,
      period,
      currency: 'USD'
    });
  } catch (error) {
    console.error('Get revenue analytics error:', error);
    return NextResponse.json({ error: 'Failed to fetch revenue analytics' }, { status: 500 });
  }
}