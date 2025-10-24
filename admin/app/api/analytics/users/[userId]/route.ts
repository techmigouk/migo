import { NextRequest, NextResponse } from 'next/server';
import { AnalyticsEventModel } from '@amigo/shared';
import { db } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const userId = params.userId;

    await db.connect();

    // Get user activity stats
    const [
      totalEvents,
      lastSeen,
      courseViews,
      lessonsCompleted,
      videoWatchTime,
    ] = await Promise.all([
      AnalyticsEventModel.countDocuments({ userId }),
      AnalyticsEventModel.findOne({ userId }).sort({ createdAt: -1 }).select('createdAt'),
      AnalyticsEventModel.countDocuments({ userId, eventType: 'course_view' }),
      AnalyticsEventModel.countDocuments({ userId, eventType: 'lesson_complete' }),
      AnalyticsEventModel.aggregate([
        {
          $match: {
            userId,
            eventType: 'video_complete',
            'eventData.duration': { $exists: true },
          },
        },
        {
          $group: {
            _id: null,
            totalWatchTime: { $sum: '$eventData.duration' },
          },
        },
      ]),
    ]);

    // Get activity by day (last 30 days)
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const activityByDay = await AnalyticsEventModel.aggregate([
      {
        $match: {
          userId,
          createdAt: { $gte: thirtyDaysAgo },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Get most viewed courses
    const topCourses = await AnalyticsEventModel.aggregate([
      {
        $match: {
          userId,
          eventType: 'course_view',
          'eventData.courseId': { $exists: true },
        },
      },
      {
        $group: {
          _id: '$eventData.courseId',
          views: { $sum: 1 },
        },
      },
      { $sort: { views: -1 } },
      { $limit: 5 },
    ]);

    return NextResponse.json({
      success: true,
      data: {
        overview: {
          totalEvents,
          lastSeen: lastSeen?.createdAt,
          courseViews,
          lessonsCompleted,
          totalWatchTime: videoWatchTime[0]?.totalWatchTime || 0,
        },
        activityByDay,
        topCourses,
      },
    });
  } catch (error) {
    console.error('User analytics error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch user analytics' },
      { status: 500 }
    );
  }
}