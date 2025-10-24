import { NextRequest, NextResponse } from 'next/server';
import { LiveEventModel } from '@amigo/shared';
import { db } from '@/lib/db';

// Get all upcoming and live events
export async function GET(request: NextRequest) {
  try {
    await db.connect();

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || 'scheduled,live';
    const limit = parseInt(searchParams.get('limit') || '10');

    const statusArray = status.split(',');
    const now = new Date();

    const events = await LiveEventModel.find({
      status: { $in: statusArray },
      scheduledAt: { $gte: now }
    })
      .populate('instructor', 'name avatar')
      .select('-attendees')
      .sort({ scheduledAt: 1 })
      .limit(limit);

    return NextResponse.json({ events });
  } catch (error) {
    console.error('Get live events error:', error);
    return NextResponse.json({ error: 'Failed to fetch events' }, { status: 500 });
  }
}