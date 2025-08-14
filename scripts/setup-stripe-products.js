const Stripe = require('stripe');

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2025-06-30.basil',
});

async function setupStripeProducts() {
  try {
    console.log('🛠️ Setting up Stripe products and prices with 14-day free trial...');

    // Create the main product
    const product = await stripe.products.create({
      name: 'POS SaaS Subscription',
      description: 'Point of Sale SaaS platform subscription with 14-day free trial',
      metadata: {
        type: 'subscription',
        trial_days: '14',
      },
    });

    console.log('✅ Product created:', product.id);

    // Create monthly price with 14-day trial
    const monthlyPrice = await stripe.prices.create({
      product: product.id,
      unit_amount: 1900, // $19.00 in cents
      currency: 'usd',
      recurring: {
        interval: 'month',
      },
      metadata: {
        plan_type: 'monthly',
        trial_days: '14',
      },
    });

    console.log('✅ Monthly price with 14-day trial created:', monthlyPrice.id);

    // Create yearly price with 14-day trial
    const yearlyPrice = await stripe.prices.create({
      product: product.id,
      unit_amount: 19000, // $190.00 in cents
      currency: 'usd',
      recurring: {
        interval: 'year',
      },
      metadata: {
        plan_type: 'yearly',
        trial_days: '14',
      },
    });

    console.log('✅ Yearly price with 14-day trial created:', yearlyPrice.id);

    console.log('\n📋 Environment variables to add to your .env file:');
    console.log(`STRIPE_MONTHLY_PRICE_ID=${monthlyPrice.id}`);
    console.log(`STRIPE_YEARLY_PRICE_ID=${yearlyPrice.id}`);
    console.log(`STRIPE_PRODUCT_ID=${product.id}`);

    console.log('\n🎉 Stripe products and prices setup complete!');
    console.log('✨ All subscriptions now include a 14-day free trial');
    console.log('Make sure to add the environment variables to your .env file.');

  } catch (error) {
    console.error('❌ Error setting up Stripe products:', error);
  }
}

// Run the setup
setupStripeProducts(); 