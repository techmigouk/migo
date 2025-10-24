/**
 * Script to create Stripe subscription products and prices
 * Run this once to set up your subscription plans in Stripe
 * 
 * Usage: STRIPE_SECRET_KEY=sk_test_xxx node scripts/setup-stripe-products.js
 */

require('dotenv').config();
const Stripe = require('stripe');

if (!process.env.STRIPE_SECRET_KEY) {
  console.error('❌ Error: STRIPE_SECRET_KEY environment variable is required');
  console.log('Usage: STRIPE_SECRET_KEY=sk_test_xxx node scripts/setup-stripe-products.js');
  process.exit(1);
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2025-09-30.clover',
});

async function setupProducts() {
  try {
    console.log('Creating Stripe products and prices...\n');

    // Create Monthly Plan - $24.99/month
    const monthlyProduct = await stripe.products.create({
      name: 'Monthly Plan',
      description: 'Full course library with month-to-month flexibility',
      metadata: {
        plan: 'monthly',
      },
    });

    const monthlyPrice = await stripe.prices.create({
      product: monthlyProduct.id,
      unit_amount: 2499, // $24.99 in cents
      currency: 'usd',
      recurring: {
        interval: 'month',
      },
      metadata: {
        plan: 'monthly',
      },
    });

    console.log('✅ Monthly Plan Created');
    console.log(`   Product ID: ${monthlyProduct.id}`);
    console.log(`   Price ID: ${monthlyPrice.id}`);
    console.log('');

    // Create Annual Plan - $249.90/year (Most Popular)
    const annualProduct = await stripe.products.create({
      name: 'Annual Plan',
      description: 'Best value! Save 16% with annual commitment - Most Popular',
      metadata: {
        plan: 'annual',
        popular: 'true',
      },
    });

    const annualPrice = await stripe.prices.create({
      product: annualProduct.id,
      unit_amount: 24990, // $249.90 in cents
      currency: 'usd',
      recurring: {
        interval: 'year',
      },
      metadata: {
        plan: 'annual',
      },
    });

    console.log('✅ Annual Plan Created (MOST POPULAR)');
    console.log(`   Product ID: ${annualProduct.id}`);
    console.log(`   Price ID: ${annualPrice.id}`);
    console.log('');

    // Create Lifetime Plan - $899.64 one-time
    const lifetimeProduct = await stripe.products.create({
      name: 'Lifetime Plan',
      description: 'One-time payment for unlimited lifetime access',
      metadata: {
        plan: 'lifetime',
      },
    });

    const lifetimePrice = await stripe.prices.create({
      product: lifetimeProduct.id,
      unit_amount: 89964, // $899.64 in cents
      currency: 'usd',
      metadata: {
        plan: 'lifetime',
      },
    });

    console.log('✅ Lifetime Plan Created');
    console.log(`   Product ID: ${lifetimeProduct.id}`);
    console.log(`   Price ID: ${lifetimePrice.id}`);
    console.log('');

    // Print environment variables to add to .env
    console.log('═══════════════════════════════════════════════════════');
    console.log('Add these to your .env file:');
    console.log('═══════════════════════════════════════════════════════');
    console.log(`STRIPE_BASIC_PRICE_ID=${monthlyPrice.id}`);
    console.log(`STRIPE_PREMIUM_PRICE_ID=${annualPrice.id}`);
    console.log(`STRIPE_LIFETIME_PRICE_ID=${lifetimePrice.id}`);
    console.log('');
    console.log('Or using new naming:');
    console.log(`STRIPE_MONTHLY_PRICE_ID=${monthlyPrice.id}`);
    console.log(`STRIPE_ANNUAL_PRICE_ID=${annualPrice.id}`);
    console.log(`STRIPE_LIFETIME_PRICE_ID=${lifetimePrice.id}`);
    console.log('═══════════════════════════════════════════════════════');
    console.log('\nNote: Free plan does not require a Stripe product');
    console.log('The Annual plan is marked as MOST POPULAR');

  } catch (error) {
    console.error('Error creating products:', error);
  }
}

setupProducts();