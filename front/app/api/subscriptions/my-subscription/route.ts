import { NextRequest, NextResponse } from 'next/server';
import { SubscriptionModel, authUtils } from '@amigo/shared';
import { db } from '@/lib/db';

// Get user's subscription
export async function GET(request: NextRequest) {
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

    const subscription = await SubscriptionModel.findOne({ userId: payload.userId });

    if (!subscription) {
      return NextResponse.json({ 
        subscription: null,
        message: 'No active subscription found' 
      });
    }

    return NextResponse.json({ subscription });
  } catch (error) {
    console.error('Get subscription error:', error);
    return NextResponse.json({ error: 'Failed to fetch subscription' }, { status: 500 });
  }
}