import { NextRequest, NextResponse } from 'next/server';
import { stripeUtils, authUtils } from '@amigo/shared';
import { z } from 'zod';

const subscriptionSchema = z.object({
  priceId: z.string().optional(),
  plan: z.enum(['basic', 'premium', 'enterprise', 'monthly', 'annual', 'lifetime']).optional(),
  successUrl: z.string().url().optional(),
  cancelUrl: z.string().url().optional()
});

// Stripe Price IDs - these should be set in environment variables
const PRICE_IDS = {
  basic: process.env.STRIPE_BASIC_PRICE_ID || 'price_1SLGCAJZuJlFWRBhESjwJ5ik',
  premium: process.env.STRIPE_PREMIUM_PRICE_ID || 'price_1SLGCAJZuJlFWRBhXv7LEw3Q',
  enterprise: process.env.STRIPE_ENTERPRISE_PRICE_ID || 'price_enterprise',
  monthly: process.env.STRIPE_BASIC_PRICE_ID || 'price_1SLGCAJZuJlFWRBhESjwJ5ik',
  annual: process.env.STRIPE_PREMIUM_PRICE_ID || 'price_1SLGCAJZuJlFWRBhXv7LEw3Q',
  lifetime: process.env.STRIPE_LIFETIME_PRICE_ID || 'price_lifetime_plan',
};

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

    const body = await request.json();
    const validationResult = subscriptionSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { error: validationResult.error.errors[0].message },
        { status: 400 }
      );
    }

    const { priceId, plan, successUrl, cancelUrl } = validationResult.data;

    // Determine which price ID to use
    const finalPriceId = priceId || (plan ? PRICE_IDS[plan] : null);
    
    if (!finalPriceId) {
      return NextResponse.json(
        { error: 'Either priceId or plan must be provided' },
        { status: 400 }
      );
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

    // Create subscription checkout session
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const session = await stripeUtils.createSubscriptionCheckoutSession(
      successUrl || `${baseUrl}/dashboard?subscription=success`,
      cancelUrl || `${baseUrl}/pricing?canceled=true`,
      finalPriceId,
      customer.id,
      {
        userId: payload.userId,
        plan: plan || 'custom',
        type: 'subscription',
      }
    );

    return NextResponse.json({
      sessionId: session.id,
      url: session.url,
    });
  } catch (error: any) {
    console.error('Create subscription checkout error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create subscription checkout' },
      { status: 500 }
    );
  }
}