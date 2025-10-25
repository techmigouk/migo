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
    // Check if Stripe is configured
    if (!process.env.STRIPE_SECRET_KEY) {
      console.error('STRIPE_SECRET_KEY is not configured')
      return NextResponse.json(
        { error: 'Payment system is not configured. Please contact support.' },
        { status: 503 }
      );
    }

    // Verify authentication
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      console.error('No authorization header provided')
      return NextResponse.json({ error: 'Please login to subscribe' }, { status: 401 });
    }

    const token = authHeader.substring(7);
    const payload = authUtils.verifyToken(token);
    if (!payload) {
      console.error('Invalid token')
      return NextResponse.json({ error: 'Invalid session. Please login again.' }, { status: 401 });
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
    
    console.log('Creating Stripe checkout session:', {
      priceId: finalPriceId,
      customerId: customer.id,
      userId: payload.userId
    });
    
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

    console.log('Stripe session created:', session.id);

    return NextResponse.json({
      sessionId: session.id,
      url: session.url,
    });
  } catch (error: any) {
    console.error('Create subscription checkout error:', error);
    console.error('Error stack:', error.stack);
    
    // Provide more specific error messages
    let errorMessage = 'Failed to create subscription checkout';
    if (error.message?.includes('STRIPE_SECRET_KEY')) {
      errorMessage = 'Payment system is not configured. Please contact support.';
    } else if (error.message?.includes('No such price')) {
      errorMessage = 'Invalid pricing plan. Please try another plan or contact support.';
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}