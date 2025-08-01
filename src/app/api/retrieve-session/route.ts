// app/api/retrieve-session/route.ts
import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-06-30.basil',
});

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const sessionId = searchParams.get('session_id');
  if (!sessionId) {
    return NextResponse.json({ error: 'session_id is required' }, { status: 400 });
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['subscription']
    });

    if (!session.subscription || typeof session.subscription === 'string') {
      return NextResponse.json(
        { error: 'No subscription found on session' },
        { status: 404 }
      );
    }

    const subscription = session.subscription as Stripe.Subscription;
    const planInterval = subscription.items.data[0].price.recurring?.interval?.toUpperCase() || null;

    return NextResponse.json(
      {
        subscriptionId: subscription.id,
        status: subscription.status.toUpperCase(),
        plan: planInterval,
        currentPeriodEnd: (subscription as any).current_period_end * 1000
      }
    );
  } catch (err: any) {
    console.error('Error retrieving session:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
