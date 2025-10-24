import { NextRequest, NextResponse } from 'next/server';
import { AnalyticsEventModel, AnalyticsEventSchema } from '@amigo/shared';
import { db } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    const validationResult = AnalyticsEventSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: validationResult.error.errors[0].message },
        { status: 400 }
      );
    }

    // Extract metadata from request
    const userAgent = request.headers.get('user-agent') || undefined;
    const ipAddress = request.headers.get('x-forwarded-for') || 
                     request.headers.get('x-real-ip') || 
                     undefined;
    const referrer = request.headers.get('referer') || undefined;

    await db.connect();

    // Create analytics event
    const event = await AnalyticsEventModel.create({
      ...validationResult.data,
      metadata: {
        ...validationResult.data.metadata,
        userAgent,
        ipAddress,
        referrer,
      },
    });

    return NextResponse.json({
      success: true,
      data: { eventId: event._id },
    });
  } catch (error) {
    console.error('Analytics tracking error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Tracking failed' },
      { status: 500 }
    );
  }
}