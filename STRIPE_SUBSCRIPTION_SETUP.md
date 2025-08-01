# Stripe Subscription Setup Guide

This guide will help you set up Stripe subscriptions for your POS SaaS application.

## Prerequisites

1. **Stripe Account**: Make sure you have a Stripe account with test mode enabled
2. **Environment Variables**: Ensure you have the following in your `.env` file:
   ```
   STRIPE_SECRET_KEY=sk_test_...
   STRIPE_PUBLIC_KEY=pk_test_...
   STRIPE_WEBHOOK_SECRET=whsec_...
   ```

## Step 1: Set up Stripe Products and Prices

### Option A: Using the Setup Script (Recommended)

1. Install the Stripe package if not already installed:
   ```bash
   npm install stripe
   ```

2. Run the setup script:
   ```bash
   node scripts/setup-stripe-products.js
   ```

3. Copy the generated environment variables to your `.env` file:
   ```
   STRIPE_MONTHLY_PRICE_ID=price_...
   STRIPE_YEARLY_PRICE_ID=price_...
   STRIPE_PRODUCT_ID=prod_...
   ```

### Option B: Manual Setup

1. Go to your Stripe Dashboard
2. Navigate to Products → Add Product
3. Create a product named "POS SaaS Subscription"
4. Add two prices:
   - Monthly: $19.00/month
   - Yearly: $190.00/year
5. Copy the price IDs to your `.env` file

## Step 2: Update Database Schema

Run the database migration to add subscription fields:

```bash
npx prisma migrate dev --name add_subscription_fields
```

## Step 3: Configure Webhooks

1. In your Stripe Dashboard, go to Webhooks
2. Add endpoint: `https://your-domain.com/api/webhooks/stripe`
3. Select these events:
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
   - `payment_intent.succeeded` (for existing one-time payments)
4. Copy the webhook signing secret to your `.env` file

## Step 4: Test the Implementation

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Navigate to `/buy-tenant` to test the subscription flow
3. Use Stripe test cards:
   - Success: `4242 4242 4242 4242`
   - Decline: `4000 0000 0000 0002`

## Features Implemented

### ✅ Subscription Management
- Monthly ($19/month) and Yearly ($190/year) plans
- Automatic subscription creation
- Customer management
- Payment method saving

### ✅ Database Integration
- Tenant model updated with subscription fields
- Subscription status tracking
- Plan type tracking
- End date tracking

### ✅ Webhook Handling
- Subscription lifecycle events
- Payment success/failure events
- Automatic status updates

### ✅ Frontend Components
- Plan selection interface
- Subscription checkout flow
- Payment confirmation
- Success page updates

## Environment Variables Required

Add these to your `.env` file:

```env
# Existing Stripe variables
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLIC_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# New subscription variables
STRIPE_MONTHLY_PRICE_ID=price_...
STRIPE_YEARLY_PRICE_ID=price_...
STRIPE_PRODUCT_ID=prod_...
```

## API Endpoints

### New Subscription Endpoint
- `POST /api/stripe/subscription`
- Creates subscription and returns client secret
- Parameters: `{ userId, planType }`

### Updated Webhook Endpoint
- `POST /api/webhooks/stripe`
- Handles subscription events and payment events

## Testing

1. **Test Monthly Subscription**:
   - Select Monthly plan
   - Use test card: `4242 4242 4242 4242`
   - Verify tenant creation and subscription status

2. **Test Yearly Subscription**:
   - Select Yearly plan
   - Use test card: `4242 4242 4242 4242`
   - Verify tenant creation and subscription status

3. **Test Payment Failure**:
   - Use test card: `4000 0000 0000 0002`
   - Verify error handling

## Troubleshooting

### Common Issues

1. **"Price ID not configured" error**:
   - Ensure `STRIPE_MONTHLY_PRICE_ID` and `STRIPE_YEARLY_PRICE_ID` are set
   - Verify price IDs exist in your Stripe dashboard

2. **Webhook signature verification failed**:
   - Check `STRIPE_WEBHOOK_SECRET` is correct
   - Ensure webhook endpoint is accessible

3. **Subscription not created**:
   - Check Stripe logs for errors
   - Verify customer creation is successful
   - Check webhook events are being received

### Debug Mode

Enable detailed logging by checking the console for:
- 🔔 Webhook events
- 💳 Payment intent creation
- 📦 Subscription creation
- ✅ Success confirmations

## Next Steps

1. **Production Setup**:
   - Switch to live Stripe keys
   - Update webhook endpoints
   - Test with real payment methods

2. **Additional Features**:
   - Subscription management dashboard
   - Plan upgrades/downgrades
   - Cancellation handling
   - Usage tracking

3. **Security**:
   - Implement proper authentication
   - Add rate limiting
   - Validate webhook signatures
   - Secure customer data handling 