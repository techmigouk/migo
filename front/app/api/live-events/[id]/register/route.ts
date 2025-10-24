import { NextRequest, NextResponse } from 'next/server';
import { LiveEventModel, authUtils } from '@amigo/shared';
import { db } from '@/lib/db';

// Register for a live event
export async function POST(
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
    if (!payload) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await db.connect();

    const event = await LiveEventModel.findById(params.id);

    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    // Check if event is full
    if (event.maxAttendees && event.attendees.length >= event.maxAttendees) {
      return NextResponse.json({ error: 'Event is full' }, { status: 400 });
    }

    // Check if already registered
    if (event.attendees.includes(payload.userId as any)) {
      return NextResponse.json({ error: 'Already registered for this event' }, { status: 400 });
    }

    // Check if event is in the future
    if (event.scheduledAt < new Date()) {
      return NextResponse.json({ error: 'Cannot register for past events' }, { status: 400 });
    }

    // Add user to attendees
    event.attendees.push(payload.userId as any);
    await event.save();

    return NextResponse.json({ 
      message: 'Successfully registered for event',
      event: {
        id: event._id,
        title: event.title,
        scheduledAt: event.scheduledAt
      }
    });
  } catch (error) {
    console.error('Register for event error:', error);
    return NextResponse.json({ error: 'Failed to register for event' }, { status: 500 });
  }
}

// Unregister from a live event
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
    if (!payload) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await db.connect();

    const event = await LiveEventModel.findById(params.id);

    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    // Remove user from attendees
    event.attendees = event.attendees.filter(
      (attendeeId: any) => attendeeId.toString() !== payload.userId
    );
    await event.save();

    return NextResponse.json({ message: 'Successfully unregistered from event' });
  } catch (error) {
    console.error('Unregister from event error:', error);
    return NextResponse.json({ error: 'Failed to unregister from event' }, { status: 500 });
  }
}