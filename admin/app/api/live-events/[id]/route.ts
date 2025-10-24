import { NextRequest, NextResponse } from 'next/server';
import { LiveEventModel, authUtils } from '@amigo/shared';
import { db } from '@/lib/db';
import { z } from 'zod';

const updateEventSchema = z.object({
  title: z.string().min(3).optional(),
  description: z.string().optional(),
  scheduledAt: z.string().datetime().optional(),
  duration: z.number().min(1).optional(),
  maxAttendees: z.number().optional(),
  meetingUrl: z.string().url().optional(),
  status: z.enum(['scheduled', 'live', 'completed', 'cancelled']).optional(),
  recordingUrl: z.string().url().optional()
});

// Get single live event
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await db.connect();

    const event = await LiveEventModel.findById(params.id)
      .populate('instructor', 'name email avatar')
      .populate('attendees', 'name email avatar');

    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    return NextResponse.json({ event });
  } catch (error) {
    console.error('Get live event error:', error);
    return NextResponse.json({ error: 'Failed to fetch event' }, { status: 500 });
  }
}

// Update live event
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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
    const validationResult = updateEventSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { error: validationResult.error.errors[0].message },
        { status: 400 }
      );
    }

    const updates = validationResult.data;
    if (updates.scheduledAt) {
      (updates as any).scheduledAt = new Date(updates.scheduledAt);
    }

    const event = await LiveEventModel.findByIdAndUpdate(
      params.id,
      updates,
      { new: true, runValidators: true }
    ).populate('instructor', 'name email');

    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    return NextResponse.json({ event });
  } catch (error) {
    console.error('Update live event error:', error);
    return NextResponse.json({ error: 'Failed to update event' }, { status: 500 });
  }
}

// Delete live event
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const event = await LiveEventModel.findByIdAndDelete(params.id);

    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Event deleted successfully' });
  } catch (error) {
    console.error('Delete live event error:', error);
    return NextResponse.json({ error: 'Failed to delete event' }, { status: 500 });
  }
}