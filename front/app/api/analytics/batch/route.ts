import { NextRequest, NextResponse } from 'next/server';
import { AnalyticsEventModel } from '@amigo/shared';
import { db } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { events } = body;

    if (!Array.isArray(events) || events.length === 0) {
      return NextResponse.json(
        { error: 'Events array is required' },
        { status: 400 }
      );
    }

    // Extract metadata from request
    const userAgent = request.headers.get('user-agent') || undefined;
    const ipAddress = request.headers.get('x-forwarded-for') || 
                     request.headers.get('x-real-ip') || 
                     undefined;

    await db.connect();

    // Batch insert events
    const eventsToInsert = events.map(event => ({
      ...event,
      metadata: {
        ...event.metadata,
        userAgent,
        ipAddress,
      },
    }));

    await AnalyticsEventModel.insertMany(eventsToInsert);

    return NextResponse.json({
      success: true,
      data: { count: events.length },
    });
  } catch (error) {
    console.error('Batch analytics error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Batch tracking failed' },
      { status: 500 }
    );
  }
}