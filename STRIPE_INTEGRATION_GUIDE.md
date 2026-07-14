# Stripe Integration Guide for Dreamtime Echo

## Overview

This document outlines the complete Stripe integration for the Dreamtime Echo e-commerce website. The integration includes payment processing, webhook handling, and order management.

## Architecture

### Frontend (React)
- **Stripe.js**: Loads the Stripe library
- **React Stripe.js**: Provides React components for Stripe Elements
- **PaymentElement**: Handles card input and payment method selection
- **Elements Provider**: Wraps the checkout form with Stripe context

### Backend (Flask)
- **Stripe Python SDK**: Handles server-side payment processing
- **Payment Intent API**: Creates and manages payment intents
- **Webhook Handler**: Processes Stripe events (payment success, failure, etc.)

## Setup Instructions

### 1. Stripe Account Configuration

1. Create a Stripe account at https://stripe.com
2. Navigate to the Dashboard
3. Go to **Developers > API Keys**
4. Copy your:
   - **Publishable Key** (starts with `pk_live_` or `pk_test_`)
   - **Secret Key** (starts with `sk_live_` or `sk_test_`)

### 2. Backend Setup

#### Environment Variables

Create a `.env` file in the `backend/` directory:

```bash
STRIPE_SECRET_KEY=sk_live_your_actual_secret_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
FLASK_ENV=production
PORT=5000
```

#### Install Dependencies

```bash
cd backend
pip install -r requirements.txt
```

#### Run the Backend

```bash
python app.py
```

The backend will start on `http://localhost:5000`

### 3. Frontend Setup

#### Install Stripe Libraries

```bash
cd frontend
npm install @stripe/stripe-js @stripe/react-stripe-js
```

#### Update Publishable Key

In `frontend/src/App.js`, ensure your Stripe publishable key is set:

```javascript
const stripePromise = loadStripe('pk_live_your_actual_publishable_key_here');
```

#### Run the Frontend

```bash
npm start
```

The frontend will start on `http://localhost:3000`

## API Endpoints

### POST `/api/create-payment-intent`

Creates a Stripe Payment Intent for the cart items.

**Request:**
```json
{
  "items": [
    {
      "id": "cosmic_journey",
      "quantity": 1
    },
    {
      "id": "digital_art",
      "quantity": 2
    }
  ]
}
```

**Response:**
```json
{
  "clientSecret": "pi_1234567890_secret_abcdef",
  "amount": 10997
}
```

### POST `/api/webhook`

Handles Stripe webhook events. This endpoint should be configured in your Stripe Dashboard.

**Webhook URL:** `https://yourdomain.com/api/webhook`

**Supported Events:**
- `payment_intent.succeeded`: Payment completed successfully
- `payment_intent.payment_failed`: Payment failed
- `charge.refunded`: Refund processed

## Payment Flow

1. **Customer adds items to cart** → Cart state updated in React
2. **Customer clicks "Checkout"** → Checkout modal opens
3. **Payment Intent created** → Backend creates a Stripe PaymentIntent
4. **Customer enters payment details** → Stripe PaymentElement collects card info
5. **Customer submits payment** → Frontend calls `stripe.confirmPayment()`
6. **Payment processed** → Stripe processes the payment
7. **Webhook triggered** → Backend receives webhook event
8. **Order fulfilled** → Backend can send confirmation emails, etc.

## Product Catalog

The product catalog is synchronized between frontend and backend:

| Product ID | Name | Price (AUD) |
|---|---|---|
| cosmic_journey | Cosmic Journey Process | $49.99 |
| digital_art | Digital Art Collection | $29.99 |
| wisdom_guides | Wisdom Guides | $19.99 |
| storytelling_prompts | Australian Storytelling Prompt Pack | $24.99 |
| art_style_guide | Indigenous Art Style Guide for AI | $39.99 |
| bush_tucker_cards | Bush Tucker Knowledge Cards | $19.99 |
| social_media_templates | Dreamtime Social Media Templates | $34.99 |
| wildlife_content_pack | Australian Wildlife Content Pack | $29.99 |
| sacred_sites_collection | Sacred Sites Inspiration Collection | $44.99 |

## Testing

### Test Cards

Use these test card numbers in development (test mode):

| Card Type | Number | CVC | Date |
|---|---|---|---|
| Visa | 4242 4242 4242 4242 | Any 3 digits | Any future date |
| Visa (debit) | 4000 0566 5566 5556 | Any 3 digits | Any future date |
| Mastercard | 5555 5555 5555 4444 | Any 3 digits | Any future date |
| Amex | 3782 822463 10005 | Any 4 digits | Any future date |

### Test Webhook Events

1. Go to Stripe Dashboard > Developers > Webhooks
2. Click "Add an endpoint"
3. Enter your webhook URL: `http://localhost:5000/api/webhook` (for local testing, use a tool like ngrok)
4. Select events to listen for
5. Use the "Send test event" feature to trigger webhook events

## Deployment

### Render.com (Recommended)

1. Push code to GitHub
2. Connect Render to your GitHub repository
3. Create a new Web Service
4. Set environment variables in Render dashboard:
   - `STRIPE_SECRET_KEY`
   - `STRIPE_WEBHOOK_SECRET`
5. Deploy

### Vercel (Frontend)

1. Push code to GitHub
2. Connect Vercel to your repository
3. Deploy frontend automatically

### Environment Variables for Production

Ensure these are set in your production environment:
- `STRIPE_SECRET_KEY`: Your live Stripe secret key
- `STRIPE_WEBHOOK_SECRET`: Your live webhook secret
- `FLASK_ENV=production`

## Security Considerations

1. **Never expose secret keys**: Keep `STRIPE_SECRET_KEY` and `STRIPE_WEBHOOK_SECRET` in environment variables only
2. **Use HTTPS**: Always use HTTPS in production
3. **Verify webhook signatures**: The backend already does this
4. **PCI Compliance**: Stripe handles PCI compliance; never store raw card data
5. **CORS Configuration**: Backend is configured with CORS for your frontend domain

## Troubleshooting

### Payment Intent Creation Fails

- Check that `STRIPE_SECRET_KEY` is set correctly
- Verify cart items have valid product IDs
- Check browser console for API errors

### Webhook Events Not Received

- Verify webhook URL is publicly accessible
- Check webhook signing secret matches in `.env`
- Use Stripe Dashboard to resend test events

### Payment Element Not Loading

- Verify Stripe publishable key is correct
- Check that `clientSecret` is being received from backend
- Ensure Elements provider wraps the checkout form

## Next Steps

1. **Email Notifications**: Add email service to send order confirmations
2. **Order Database**: Store orders in a database for tracking
3. **Digital Delivery**: Implement digital product delivery system
4. **Analytics**: Track conversion rates and revenue
5. **Refund Handling**: Implement refund processing workflow

## Resources

- [Stripe Documentation](https://stripe.com/docs)
- [Stripe React Integration](https://stripe.com/docs/stripe-js/react)
- [Payment Intent API](https://stripe.com/docs/payments/payment-intents)
- [Webhook Events](https://stripe.com/docs/webhooks)

## Support

For issues or questions:
1. Check Stripe Dashboard for payment details
2. Review browser console for frontend errors
3. Check backend logs for server errors
4. Contact Stripe support: https://support.stripe.com
