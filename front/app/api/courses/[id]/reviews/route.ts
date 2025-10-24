import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { Review } from '@amigo/shared'
import { headers } from 'next/headers'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await db.connect()

    const courseId = params.id

    // Fetch reviews for this course
    const reviews = await Review.find({ 
      courseId, 
      isHidden: false 
    })
      .populate('userId', 'name avatar')
      .sort({ createdAt: -1 })
      .lean()

    // Calculate average rating
    const totalRating = reviews.reduce((sum: number, review: any) => sum + review.rating, 0)
    const averageRating = reviews.length > 0 ? totalRating / reviews.length : 0

    // Rating distribution
    const distribution = {
      5: reviews.filter((r: any) => r.rating === 5).length,
      4: reviews.filter((r: any) => r.rating === 4).length,
      3: reviews.filter((r: any) => r.rating === 3).length,
      2: reviews.filter((r: any) => r.rating === 2).length,
      1: reviews.filter((r: any) => r.rating === 1).length,
    }

    return NextResponse.json({
      success: true,
      reviews,
      stats: {
        totalReviews: reviews.length,
        averageRating: Math.round(averageRating * 10) / 10,
        distribution,
      },
    })
  } catch (error) {
    console.error('Error fetching reviews:', error)
    return NextResponse.json(
      { error: 'Failed to fetch reviews' },
      { status: 500 }
    )
  }
}

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const headersList = await headers()
    const authorization = headersList.get('authorization')
    
    if (!authorization || !authorization.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const token = authorization.substring(7)
    // TODO: Verify JWT token and extract userId
    const userId = 'placeholder-user-id' // Extract from verified token
    
    await db.connect()

    const courseId = params.id
    const body = await request.json()
    const { rating, comment } = body

    // Validation
    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: 'Rating must be between 1 and 5' },
        { status: 400 }
      )
    }

    if (!comment || comment.trim().length < 10) {
      return NextResponse.json(
        { error: 'Comment must be at least 10 characters' },
        { status: 400 }
      )
    }

    if (comment.length > 1000) {
      return NextResponse.json(
        { error: 'Comment must not exceed 1000 characters' },
        { status: 400 }
      )
    }

    // Check if user already reviewed this course
    const existingReview = await Review.findOne({ userId, courseId })
    
    if (existingReview) {
      // Update existing review
      existingReview.rating = rating
      existingReview.comment = comment
      await existingReview.save()

      return NextResponse.json({
        success: true,
        message: 'Review updated successfully',
        review: existingReview,
      })
    }

    // Create new review
    const review = await Review.create({
      userId,
      courseId,
      rating,
      comment,
      isVerifiedPurchase: true, // TODO: Check if user actually enrolled/purchased
    })

    return NextResponse.json({
      success: true,
      message: 'Review created successfully',
      review,
    })
  } catch (error) {
    console.error('Error creating review:', error)
    return NextResponse.json(
      { error: 'Failed to create review' },
      { status: 500 }
    )
  }
}
