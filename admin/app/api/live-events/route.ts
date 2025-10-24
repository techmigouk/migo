import { NextRequest, NextResponse } from 'next/server';
import { LiveEventModel, authUtils } from '@amigo/shared';
import { db } from '@/lib/db';
import { z } from 'zod';

const createEventSchema = z.object({
  title: z.string().min(3),
  description: z.string(),
  scheduledAt: z.string().datetime(),
  duration: z.number().min(1),
  maxAttendees: z.number().optional(),
  meetingUrl: z.string().url().optional()
});

// Get all live events
export async function GET(request: NextRequest) {
  try {
    // Verify authentication
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.substring(7);
    const payload = authUtils.verifyToken(token);
    if (!payload || (payload.role !== 'admin' && payload.role !== 'instructor')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    await db.connect();

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    const query = status ? { status } : {};
    const events = await LiveEventModel.find(query)
      .populate('instructor', 'name email')
      .populate('attendees', 'name email')
      .sort({ scheduledAt: -1 });

    return NextResponse.json({ events });
  } catch (error) {
    console.error('Get live events error:', error);
    return NextResponse.json({ error: 'Failed to fetch events' }, { status: 500 });
  }
}

// Create a new live event
export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.substring(7);
    const payload = authUtils.verifyToken(token);
    if (!payload || (payload.role !== 'admin' && payload.role !== 'instructor')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    await db.connect();

    const body = await request.json();
    const validationResult = createEventSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { error: validationResult.error.errors[0].message },
        { status: 400 }
      );
    }

    const eventData = validationResult.data;

    const event = new LiveEventModel({
      ...eventData,
      instructor: payload.userId,
      scheduledAt: new Date(eventData.scheduledAt),
      status: 'scheduled'
    });

    await event.save();
    await event.populate('instructor', 'name email');

    return NextResponse.json({ event }, { status: 201 });
  } catch (error) {
    console.error('Create live event error:', error);
    return NextResponse.json({ error: 'Failed to create event' }, { status: 500 });
  }
}