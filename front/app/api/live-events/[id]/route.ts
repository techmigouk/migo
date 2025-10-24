import { NextRequest, NextResponse } from 'next/server';
import { LiveEventModel } from '@amigo/shared';
import { db } from '@/lib/db';

// Get single event details
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await db.connect();

    const event = await LiveEventModel.findById(params.id)
      .populate('instructor', 'name email avatar')
      .select('-attendees');

    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    return NextResponse.json({ event });
  } catch (error) {
    console.error('Get live event error:', error);
    return NextResponse.json({ error: 'Failed to fetch event' }, { status: 500 });
  }
}