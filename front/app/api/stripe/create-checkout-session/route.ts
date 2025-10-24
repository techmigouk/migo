import { NextRequest, NextResponse } from 'next/server';
import { stripeUtils, CourseModel, authUtils } from '@amigo/shared';
import { db } from '@/lib/db';
import { z } from 'zod';

const checkoutSchema = z.object({
  courseId: z.string(),
  successUrl: z.string().url().optional(),
  cancelUrl: z.string().url().optional()
});

export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.substring(7);
    const payload = authUtils.verifyToken(token);
    if (!payload) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await db.connect();

    const body = await request.json();
    const validationResult = checkoutSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { error: validationResult.error.errors[0].message },
        { status: 400 }
      );
    }

    const { courseId, successUrl, cancelUrl } = validationResult.data;

    // Get course details
    const course = await CourseModel.findById(courseId);
    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    // Check if course is published
    if (course.status !== 'published') {
      return NextResponse.json({ error: 'Course is not available for purchase' }, { status: 400 });
    }

    // Create or get Stripe customer
    let customer = await stripeUtils.getCustomerByEmail(payload.email);
    if (!customer) {
      customer = await stripeUtils.createCustomer(
        payload.email,
        undefined,
        { userId: payload.userId }
      );
    }

    // Create checkout session
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const session = await stripeUtils.createCheckoutSession(
      successUrl || `${baseUrl}/courses/${courseId}?success=true`,
      cancelUrl || `${baseUrl}/courses/${courseId}?canceled=true`,
      [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: course.title,
              description: course.description,
              images: course.thumbnail ? [course.thumbnail] : [],
            },
            unit_amount: Math.round(course.price * 100), // Convert to cents
          },
          quantity: 1,
        },
      ],
      customer.id,
      {
        userId: payload.userId,
        courseId: courseId,
        type: 'course_purchase',
      }
    );

    return NextResponse.json({
      sessionId: session.id,
      url: session.url,
    });
  } catch (error: any) {
    console.error('Create checkout session error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}