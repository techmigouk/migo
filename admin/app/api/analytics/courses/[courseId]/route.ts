import { NextRequest, NextResponse } from 'next/server';
import { AnalyticsEventModel, EnrollmentModel } from '@amigo/shared';
import { db } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: { courseId: string } }
) {
  try {
    const courseId = params.courseId;

    await db.connect();

    // Get course analytics
    const [
      totalViews,
      uniqueViewers,
      enrollments,
      completionRate,
      avgWatchTime,
    ] = await Promise.all([
      AnalyticsEventModel.countDocuments({
        eventType: 'course_view',
        'eventData.courseId': courseId,
      }),
      AnalyticsEventModel.distinct('userId', {
        eventType: 'course_view',
        'eventData.courseId': courseId,
      }).then(users => users.length),
      EnrollmentModel.countDocuments({ courseId }),
      EnrollmentModel.aggregate([
        { $match: { courseId } },
        {
          $group: {
            _id: null,
            avgProgress: { $avg: '$progress' },
          },
        },
      ]),
      AnalyticsEventModel.aggregate([
        {
          $match: {
            eventType: 'video_complete',
            'eventData.courseId': courseId,
            'eventData.duration': { $exists: true },
          },
        },
        {
          $group: {
            _id: null,
            avgDuration: { $avg: '$eventData.duration' },
          },
        },
      ]),
    ]);

    // Get views over time (last 30 days)
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const viewsOverTime = await AnalyticsEventModel.aggregate([
      {
        $match: {
          eventType: 'course_view',
          'eventData.courseId': courseId,
          createdAt: { $gte: thirtyDaysAgo },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          views: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Get lesson completion stats
    const lessonStats = await AnalyticsEventModel.aggregate([
      {
        $match: {
          eventType: 'lesson_complete',
          'eventData.courseId': courseId,
          'eventData.lessonId': { $exists: true },
        },
      },
      {
        $group: {
          _id: '$eventData.lessonId',
          completions: { $sum: 1 },
        },
      },
      { $sort: { completions: -1 } },
    ]);

    return NextResponse.json({
      success: true,
      data: {
        overview: {
          totalViews,
          uniqueViewers,
          enrollments,
          completionRate: completionRate[0]?.avgProgress || 0,
          avgWatchTime: avgWatchTime[0]?.avgDuration || 0,
          conversionRate: uniqueViewers > 0 ? (enrollments / uniqueViewers) * 100 : 0,
        },
        viewsOverTime,
        lessonStats,
      },
    });
  } catch (error) {
    console.error('Course analytics error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch course analytics' },
      { status: 500 }
    );
  }
}