import { NextRequest, NextResponse } from 'next/server';
import { stripeUtils, SubscriptionModel, authUtils } from '@amigo/shared';
import { db } from '@/lib/db';

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

    // Find user's subscription
    const subscription = await SubscriptionModel.findOne({ userId: payload.userId });

    if (!subscription) {
      return NextResponse.json({ error: 'No active subscription found' }, { status: 404 });
    }

    // Get Stripe customer
    const customer = await stripeUtils.getCustomerByEmail(payload.email);
    if (!customer) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 });
    }

    // Cancel the subscription in Stripe
    // This will trigger a webhook event to update our database
    const canceledSubscription = await stripeUtils.cancelSubscription(
      subscription.paymentMethodId || ''
    );

    return NextResponse.json({
      message: 'Subscription cancelled successfully',
      subscription: {
        id: canceledSubscription.id,
        cancelAt: canceledSubscription.cancel_at,
        canceledAt: canceledSubscription.canceled_at,
      },
    });
  } catch (error: any) {
    console.error('Cancel subscription error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to cancel subscription' },
      { status: 500 }
    );
  }
}