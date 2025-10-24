import Stripe from 'stripe';

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY || '';

let stripeInstance: Stripe | null = null;

function getStripeInstance(): Stripe {
  if (!stripeInstance) {
    if (!STRIPE_SECRET_KEY) {
      throw new Error('STRIPE_SECRET_KEY is not set. Please configure Stripe before using payment features.');
    }
    stripeInstance = new Stripe(STRIPE_SECRET_KEY, {
      apiVersion: '2025-09-30.clover',
      typescript: true,
    });
  }
  return stripeInstance;
}

// Legacy export for backward compatibility (will throw error if key not set)
export const stripe = new Proxy({} as Stripe, {
  get(target, prop) {
    return (getStripeInstance() as any)[prop];
  }
});

export const stripeUtils = {
  // Create a payment intent for one-time purchases
  async createPaymentIntent(
    amount: number,
    currency: string = 'usd',
    metadata?: Record<string, string>
  ): Promise<Stripe.PaymentIntent> {
    const stripe = getStripeInstance();
    return await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency,
      metadata,
      automatic_payment_methods: {
        enabled: true,
      },
    });
  },

  // Create a customer
  async createCustomer(
    email: string,
    name?: string,
    metadata?: Record<string, string>
  ): Promise<Stripe.Customer> {
    const stripe = getStripeInstance();
    return await stripe.customers.create({
      email,
      name,
      metadata,
    });
  },

  // Create a subscription
  async createSubscription(
    customerId: string,
    priceId: string,
    metadata?: Record<string, string>
  ): Promise<Stripe.Subscription> {
    const stripe = getStripeInstance();
    return await stripe.subscriptions.create({
      customer: customerId,
      items: [{ price: priceId }],
      payment_behavior: 'default_incomplete',
      payment_settings: { save_default_payment_method: 'on_subscription' },
      expand: ['latest_invoice.payment_intent'],
      metadata,
    });
  },

  // Cancel a subscription
  async cancelSubscription(subscriptionId: string): Promise<Stripe.Subscription> {
    const stripe = getStripeInstance();
    return await stripe.subscriptions.cancel(subscriptionId);
  },

  // Update a subscription
  async updateSubscription(
    subscriptionId: string,
    priceId: string
  ): Promise<Stripe.Subscription> {
    const stripe = getStripeInstance();
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    return await stripe.subscriptions.update(subscriptionId, {
      items: [
        {
          id: subscription.items.data[0].id,
          price: priceId,
        },
      ],
    });
  },

  // Get customer by email
  async getCustomerByEmail(email: string): Promise<Stripe.Customer | null> {
    const stripe = getStripeInstance();
    const customers = await stripe.customers.list({
      email,
      limit: 1,
    });
    return customers.data[0] || null;
  },

  // Create a checkout session for course purchase
  async createCheckoutSession(
    successUrl: string,
    cancelUrl: string,
    lineItems: Stripe.Checkout.SessionCreateParams.LineItem[],
    customerId?: string,
    metadata?: Record<string, string>
  ): Promise<Stripe.Checkout.Session> {
    const stripe = getStripeInstance();
    return await stripe.checkout.sessions.create({
      mode: 'payment',
      success_url: successUrl,
      cancel_url: cancelUrl,
      line_items: lineItems,
      customer: customerId,
      metadata,
    });
  },

  // Create a subscription checkout session
  async createSubscriptionCheckoutSession(
    successUrl: string,
    cancelUrl: string,
    priceId: string,
    customerId?: string,
    metadata?: Record<string, string>
  ): Promise<Stripe.Checkout.Session> {
    const stripe = getStripeInstance();
    return await stripe.checkout.sessions.create({
      mode: 'subscription',
      success_url: successUrl,
      cancel_url: cancelUrl,
      line_items: [{ price: priceId, quantity: 1 }],
      customer: customerId,
      metadata,
    });
  },

  // Verify webhook signature
  constructWebhookEvent(
    payload: string | Buffer,
    signature: string,
    webhookSecret: string
  ): Stripe.Event {
    const stripe = getStripeInstance();
    return stripe.webhooks.constructEvent(payload, signature, webhookSecret);
  },

  // Create a refund
  async createRefund(
    paymentIntentId: string,
    amount?: number,
    reason?: Stripe.RefundCreateParams.Reason
  ): Promise<Stripe.Refund> {
    const stripe = getStripeInstance();
    return await stripe.refunds.create({
      payment_intent: paymentIntentId,
      amount: amount ? Math.round(amount * 100) : undefined,
      reason,
    });
  },
};