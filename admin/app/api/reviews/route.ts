import { NextRequest, NextResponse } from 'next/server';
import { Review, EnrollmentModel } from '@amigo/shared';
import { db } from '@/lib/db';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// GET reviews for a course
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const courseId = searchParams.get('courseId');

    if (!courseId) {
      return NextResponse.json(
        { success: false, error: 'Course ID is required' },
        { status: 400 }
      );
    }

    await db.connect();

    const reviews = await Review.find({ courseId, isHidden: false })
      .populate('userId', 'name avatar')
      .sort({ createdAt: -1 })
      .lean();

    // Calculate average rating
    const averageRating = reviews.length > 0
      ? reviews.reduce((sum: number, review: any) => sum + review.rating, 0) / reviews.length
      : 0;

    return NextResponse.json({
      success: true,
      data: {
        reviews,
        averageRating: Math.round(averageRating * 10) / 10,
        totalReviews: reviews.length,
      },
    });
  } catch (error: any) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch reviews' },
      { status: 500 }
    );
  }
}

// POST create a review
export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };

    const body = await request.json();
    const { courseId, rating, comment } = body;

    if (!courseId || !rating || !comment) {
      return NextResponse.json(
        { success: false, error: 'Course ID, rating, and comment are required' },
        { status: 400 }
      );
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { success: false, error: 'Rating must be between 1 and 5' },
        { status: 400 }
      );
    }

    await db.connect();

    // Check if user is enrolled in the course
    const enrollment = await EnrollmentModel.findOne({
      userId: decoded.userId,
      courseId,
      status: 'active',
    });

    // Check if user already reviewed this course
    const existingReview = await Review.findOne({
      userId: decoded.userId,
      courseId,
    });

    if (existingReview) {
      return NextResponse.json(
        { success: false, error: 'You have already reviewed this course' },
        { status: 400 }
      );
    }

    const review = new Review({
      userId: decoded.userId,
      courseId,
      rating,
      comment,
      isVerifiedPurchase: !!enrollment,
    });

    await review.save();

    const populatedReview = await Review.findById(review._id)
      .populate('userId', 'name avatar')
      .lean();

    return NextResponse.json(
      { success: true, data: populatedReview },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error creating review:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create review' },
      { status: 500 }
    );
  }
}
