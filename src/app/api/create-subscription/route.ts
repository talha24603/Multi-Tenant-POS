// app/api/create-subscription/route.ts
import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { auth } from '@/auth';
import prisma from '@/prismaClient';


const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-06-30.basil',
});

export async function POST(request: Request) {
  try {
    const { plan } = await request.json() as { plan: 'monthly' | 'yearly' };

    // Authenticate user
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }
    const userId = session.user.id;

    // Select the correct Price ID
    const priceId =
      plan === 'monthly'
        ? process.env.STRIPE_MONTHLY_PRICE_ID!
        : process.env.STRIPE_YEARLY_PRICE_ID!;

    // Retrieve or create a Stripe Customer for this user
    let customerId = session.user.stripeCustomerId;
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: session.user.email!,
        metadata: { userId },
      });
      customerId = customer.id;
      
      // Persist this customerId to the User record in Prisma
      await prisma.user.update({
        where: { id: userId },
        data: { stripeCustomerId: customerId },
      });
    }

    // Create a Stripe Checkout Session with 14-day trial
    const checkoutSession = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      customer: customerId,
      line_items: [{ price: priceId, quantity: 1 }],
      metadata: { userId },
      subscription_data: {
        trial_period_days: 14, // 14-day free trial
        metadata: {
          userId,
          planType: plan,
          trial_days: '14',
        },
      },
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/cancel`,
      billing_address_collection: 'required',
      allow_promotion_codes: true,
    });

    return NextResponse.json({ 
      sessionId: checkoutSession.id,
      trialDays: 14,
      planType: plan 
    });
  } catch (error: any) {
    console.error('Error creating subscription:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
