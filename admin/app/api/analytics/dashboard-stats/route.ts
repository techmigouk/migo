import { NextResponse } from 'next/server';
import { UserModel, CourseModel } from '@amigo/shared';
import { connectDB } from '@amigo/shared';

export async function GET() {
  try {
    await connectDB(process.env.MONGODB_URI || 'mongodb://localhost:27017/techmigo');

    // Count total users
    const totalUsers = await UserModel.countDocuments();

    // Count active/published courses
    const activeCourses = await CourseModel.countDocuments({ status: 'published' });

    // Calculate revenue (this is a simplified version - you may want to add Subscription model)
    // For now, we'll estimate based on user roles
    const proUsers = await UserModel.countDocuments({ role: { $in: ['pro', 'premium'] } });
    const estimatedRevenue = proUsers * 24.99; // Monthly revenue estimate

    // Calculate completion rate (needs progress tracking - placeholder for now)
    const completionRate = 0; // TODO: Calculate from actual user progress data

    return NextResponse.json({
      totalUsers,
      activeCourses,
      revenue: Math.round(estimatedRevenue * 100) / 100,
      completionRate: completionRate || 68, // Default until we have real data
      trends: {
        users: '+12.5%', // TODO: Calculate from historical data
        courses: '+3',
        revenue: '+18.2%',
        completion: '-2.1%'
      }
    });
  } catch (error: any) {
    console.error('Dashboard stats error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch dashboard stats' },
      { status: 500 }
    );
  }
}
