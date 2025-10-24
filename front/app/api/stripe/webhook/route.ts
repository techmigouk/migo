import { NextRequest, NextResponse } from 'next/server';
import { 
  stripeUtils, 
  PaymentModel, 
  EnrollmentModel, 
  SubscriptionModel,
  CourseModel,
  UserModel,
  emailService
} from '@amigo/shared';
import { db } from '@/lib/db';
import Stripe from 'stripe';

const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET || '';

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get('stripe-signature');

    if (!signature) {
      return NextResponse.json({ error: 'No signature' }, { status: 400 });
    }

    // Verify webhook signature
    const event = stripeUtils.constructWebhookEvent(
      body,
      signature,
      STRIPE_WEBHOOK_SECRET
    );

    await db.connect();

    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutSessionCompleted(event.data.object as Stripe.Checkout.Session);
        break;

      case 'payment_intent.succeeded':
        await handlePaymentIntentSucceeded(event.data.object as Stripe.PaymentIntent);
        break;

      case 'payment_intent.payment_failed':
        await handlePaymentIntentFailed(event.data.object as Stripe.PaymentIntent);
        break;

      case 'customer.subscription.created':
      case 'customer.subscription.updated':
        await handleSubscriptionUpdate(event.data.object as Stripe.Subscription);
        break;

      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: error.message || 'Webhook handler failed' },
      { status: 400 }
    );
  }
}

async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
  const metadata = session.metadata;
  
  if (!metadata) return;

  if (metadata.type === 'course_purchase') {
    // Create payment record
    const payment = await PaymentModel.create({
      userId: metadata.userId,
      courseId: metadata.courseId,
      amount: (session.amount_total || 0) / 100,
      currency: session.currency || 'usd',
      status: 'completed',
      paymentMethod: 'stripe',
      transactionId: session.payment_intent as string,
    });

    // Create enrollment
    await EnrollmentModel.create({
      userId: metadata.userId,
      courseId: metadata.courseId,
      enrolledAt: new Date(),
      status: 'active',
    });

    // Update course enrollment count
    await CourseModel.findByIdAndUpdate(metadata.courseId, {
      $inc: { enrollmentCount: 1 },
    });

    // Get user and course details for email
    const user = await UserModel.findById(metadata.userId);
    const course = await CourseModel.findById(metadata.courseId);

    if (user && course) {
      // Send payment receipt
      emailService.sendPaymentReceipt(
        user.email,
        user.name,
        payment.amount,
        payment.currency,
        course.title,
        payment.transactionId
      ).catch((error: Error) => {
        console.error('Failed to send payment receipt:', error);
      });

      // Send enrollment confirmation
      emailService.sendEnrollmentConfirmation(
        user.email,
        user.name,
        course.title,
        course._id.toString()
      ).catch((error: Error) => {
        console.error('Failed to send enrollment confirmation:', error);
      });
    }

    console.log('Course purchase completed:', metadata);
  } else if (metadata.type === 'subscription') {
    // Handle subscription in the subscription.created event
    console.log('Subscription checkout completed:', metadata);
  }
}

async function handlePaymentIntentSucceeded(paymentIntent: Stripe.PaymentIntent) {
  // Update payment status if needed
  await PaymentModel.findOneAndUpdate(
    { transactionId: paymentIntent.id },
    { status: 'completed' }
  );
  console.log('Payment succeeded:', paymentIntent.id);
}

async function handlePaymentIntentFailed(paymentIntent: Stripe.PaymentIntent) {
  // Update payment status
  await PaymentModel.findOneAndUpdate(
    { transactionId: paymentIntent.id },
    { status: 'failed' }
  );
  console.log('Payment failed:', paymentIntent.id);
}

async function handleSubscriptionUpdate(subscription: Stripe.Subscription) {
  const metadata = subscription.metadata;
  
  if (!metadata?.userId) return;

  const plan = metadata.plan || 'basic';
  const status = subscription.status === 'active' ? 'active' : 
                 subscription.status === 'canceled' ? 'cancelled' : 'expired';

  // Update or create subscription record
  const sub = await SubscriptionModel.findOneAndUpdate(
    { userId: metadata.userId },
    {
      userId: metadata.userId,
      plan: plan as any,
      status: status as any,
      startDate: new Date(subscription.current_period_start * 1000),
      endDate: new Date(subscription.current_period_end * 1000),
      autoRenew: !subscription.cancel_at_period_end,
      paymentMethodId: subscription.default_payment_method as string,
    },
    { upsert: true, new: true }
  );

  // Send subscription confirmation email if newly active
  if (subscription.status === 'active') {
    const user = await UserModel.findById(metadata.userId);
    if (user) {
      const amount = (subscription.items.data[0]?.price.unit_amount || 0) / 100;
      const currency = subscription.items.data[0]?.price.currency || 'usd';
      
      emailService.sendSubscriptionConfirmation(
        user.email,
        user.name,
        plan.charAt(0).toUpperCase() + plan.slice(1),
        amount,
        currency
      ).catch((error: Error) => {
        console.error('Failed to send subscription confirmation:', error);
      });
    }
  }

  console.log('Subscription updated:', subscription.id);
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  const metadata = subscription.metadata;
  
  if (!metadata?.userId) return;

  // Update subscription status
  const sub = await SubscriptionModel.findOneAndUpdate(
    { userId: metadata.userId },
    { 
      status: 'cancelled',
      autoRenew: false 
    }
  );

  // Send cancellation confirmation email
  if (sub) {
    const user = await UserModel.findById(metadata.userId);
    if (user) {
      emailService.sendSubscriptionCancellation(
        user.email,
        user.name,
        sub.plan.charAt(0).toUpperCase() + sub.plan.slice(1),
        sub.endDate
      ).catch((error: Error) => {
        console.error('Failed to send cancellation confirmation:', error);
      });
    }
  }

  console.log('Subscription deleted:', subscription.id);
}