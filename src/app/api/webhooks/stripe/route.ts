import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import prisma from '@/prismaClient';

export const config = { api: { bodyParser: false } };

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-06-30.basil',
});

// Read raw body for signature verification
async function buffer(readable: ReadableStream<Uint8Array>): Promise<Buffer> {
  const chunks: Uint8Array[] = [];
  const reader = readable.getReader();
  let done = false;
  while (!done) {
    const { value, done: d } = await reader.read();
    if (value) chunks.push(value);
    done = d;
  }
  return Buffer.concat(chunks);
}

// Helper function to safely get subscription end date
function getSubscriptionEndDate(subscription: Stripe.Subscription): Date | null {
  const currentPeriodEnd = (subscription as any).current_period_end;
  if (currentPeriodEnd && typeof currentPeriodEnd === 'number') {
    return new Date(currentPeriodEnd * 1000);
  }
  return null;
}

export async function POST(request: Request) {
  const sig = request.headers.get('stripe-signature')!;
  let event: Stripe.Event;

  try {
    const body = await buffer(request.body as any);
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    console.error('⚠️ Webhook signature verification failed.', err.message);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.userId as string;
        const customerId = session.customer as string;
        const subscriptionId = session.subscription as string | undefined;

        if (!userId || !customerId || !subscriptionId) {
          console.error('Missing data on checkout.session.completed', { userId, customerId, subscriptionId });
          break;
        }

        const subscription = await stripe.subscriptions.retrieve(subscriptionId);
        const status = subscription.status.toUpperCase();
        const planInterval = subscription.items.data[0].price.recurring?.interval?.toUpperCase() || 'MONTHLY';
        const endDate = getSubscriptionEndDate(subscription);

        await prisma.tenant.create({
          data: {
            name: `Tenant of ${userId}`,
            stripeCustomerId: customerId,
            stripeSubscriptionId: subscriptionId,
            subscriptionStatus: status,
            subscriptionPlan: planInterval,
            subscriptionEndDate: endDate,
            status: status === 'ACTIVE' ? 'ACTIVE' : 'INACTIVE',
            users: { create: { userId, role: 'OWNER' } }
          }
        });
        console.log(`✅ Tenant created for user ${userId}`);
        break;
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as any;
        // Extract subscription ID, handling odd structure
        let subscriptionId: string | undefined = invoice.subscription;
        if (!subscriptionId && invoice.parent?.subscription_details) {
          subscriptionId = invoice.parent.subscription_details.subscription;
        }
        if (!subscriptionId) {
          console.error('Missing subscription ID on invoice.payment_succeeded', invoice);
          break;
        }

        const subscription = await stripe.subscriptions.retrieve(subscriptionId);
        const customerId = subscription.customer as string;
        const status = subscription.status.toUpperCase();
        const planInterval = subscription.items.data[0].price.recurring?.interval?.toUpperCase() || 'MONTHLY';
        const endDate = getSubscriptionEndDate(subscription);

        // Update existing tenant
        await prisma.tenant.updateMany({
          where: { stripeCustomerId: customerId },
          data: {
            subscriptionStatus: status,
            subscriptionPlan: planInterval,
            subscriptionEndDate: endDate,
            status: status === 'ACTIVE' ? 'ACTIVE' : 'INACTIVE'
          }
        });
        console.log(`🔄 Tenant updated for subscription ${subscriptionId}`);
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as any;
        let subscriptionId = invoice.subscription;
        if (!subscriptionId && invoice.parent?.subscription_details) {
          subscriptionId = invoice.parent.subscription_details.subscription;
        }
        if (!subscriptionId) {
          console.error('Missing subscription ID on invoice.payment_failed', invoice);
          break;
        }

        await prisma.tenant.updateMany({
          where: { stripeSubscriptionId: subscriptionId },
          data: { subscriptionStatus: 'PAST_DUE', status: 'INACTIVE' }
        });
        console.log(`⚠️ Tenant marked PAST_DUE for subscription ${subscriptionId}`);
        break;
      }

      case 'customer.subscription.deleted':
      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        const subscriptionId = subscription.id;
        const status = subscription.status.toUpperCase();
        const endDate = getSubscriptionEndDate(subscription);
        
        // Determine if tenant should be inactive based on subscription status
        // When subscription expires, Stripe sends status: 'CANCELED' or 'UNPAID'
        const isActive = ['ACTIVE', 'TRIALING'].includes(status);
        
        await prisma.tenant.updateMany({
          where: { stripeSubscriptionId: subscriptionId },
          data: { 
            subscriptionStatus: status, 
            status: isActive ? 'ACTIVE' : 'INACTIVE',
            subscriptionEndDate: endDate
          }
        });
        console.log(`🔄 Subscription ${subscriptionId} status updated to ${status}, tenant ${isActive ? 'ACTIVE' : 'INACTIVE'}`);
        break;
      }

      default:
        console.log(`Unhandled Stripe event: ${event.type}`);
    }
  } catch (err: any) {
    console.error('Error processing webhook event', event?.type, err);
    return NextResponse.json({ error: 'Webhook handler error' }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}