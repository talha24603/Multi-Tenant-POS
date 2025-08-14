const Stripe = require('stripe');

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2025-06-30.basil',
});

async function setupStripeProducts() {
  try {
    console.log('🛠️ Setting up Stripe products and prices...');

    // Create the main product
    const product = await stripe.products.create({
      name: 'POS SaaS Subscription',
      description: 'Point of Sale SaaS platform subscription',
      metadata: {
        type: 'subscription',
      },
    });

    console.log('✅ Product created:', product.id);

    // Create monthly price
    const monthlyPrice = await stripe.prices.create({
      product: product.id,
      unit_amount: 1900, // $19.00 in cents
      currency: 'usd',
      recurring: {
        interval: 'month',
      },
      metadata: {
        plan_type: 'monthly',
      },
    });

    console.log('✅ Monthly price created:', monthlyPrice.id);

    // Create yearly price
    const yearlyPrice = await stripe.prices.create({
      product: product.id,
      unit_amount: 19000, // $190.00 in cents
      currency: 'usd',
      recurring: {
        interval: 'year',
      },
      metadata: {
        plan_type: 'yearly',
      },
    });

    console.log('✅ Yearly price created:', yearlyPrice.id);

    console.log('\n📋 Environment variables to add to your .env file:');
    console.log(`STRIPE_MONTHLY_PRICE_ID=${monthlyPrice.id}`);
    console.log(`STRIPE_YEARLY_PRICE_ID=${yearlyPrice.id}`);
    console.log(`STRIPE_PRODUCT_ID=${product.id}`);

    console.log('\n🎉 Stripe products and prices setup complete!');
    console.log('Make sure to add the environment variables to your .env file.');

  } catch (error) {
    console.error('❌ Error setting up Stripe products:', error);
  }
}

// Run the setup
setupStripeProducts(); 