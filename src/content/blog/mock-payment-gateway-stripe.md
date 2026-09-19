---
title: "How to Test Stripe Checkout & 3D Secure in React Without Real API Keys"
published: true
description: "Learn how to simulate Stripe PaymentIntents, 3D Secure verification, test credit cards, refunds, and webhook triggers using Playground API."
tags: react, webdev, javascript, stripe
canonical_url: https://playground.nileslabs.com/docs/payments
series: Stop Waiting for the Backend
coverImage: "/images/blog/mock-payment-gateway-stripe.jpg"
order: 20
author: "Nilesh Kumar"
authorRole: "Creator of Playground API"
date: "2026-09-20"
slug: "mock-payment-gateway-stripe"
---

# How to Test Stripe Checkout & 3D Secure in React Without Real API Keys

Integrating online payments (Stripe, PayPal, LemonSqueezy) into a frontend application is one of the most critical flows in ecommerce and SaaS.

However, testing payment forms during early frontend prototyping is painful:
- You need a live Stripe test mode account and secret API keys.
- Handling test card numbers (declines, insufficient funds, 3DS authentication challenges) requires navigating third-party dashboards.
- Testing post-payment webhook fulfillment requires running local webhooks proxies.

**[Playground API](https://playground.nileslabs.com)** provides a complete **Mock Payment Gateway & Checkout Simulation** with full Stripe API parity!

---

## 1. Creating a Payment Intent

Create payment intents via `POST /api/v1/payments/intents`:

```typescript
const res = await fetch('https://playground.nileslabs.com/api/v1/payments/intents', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    amount: 4900, // $49.00
    currency: 'USD',
    description: 'Pro Subscription Upgrade',
  }),
});

const intent = await res.json();
console.log('Client Secret:', intent.client_secret);
```

---

## 2. Deterministic Test Card Numbers

Playground API supports standard deterministic test cards:

- **Success Card**: `4242 4242 4242 4242` -> Status: `succeeded`
- **3D Secure Challenge**: `4000 0000 0000 3020` -> Status: `requires_action` (triggers 3DS modal)
- **Declined Card**: `4000 0000 0000 0002` -> Status: `402 Payment Required` (`card_declined`)
- **Insufficient Funds**: `4000 0000 0000 9995` -> Status: `402 Payment Required` (`insufficient_funds`)

```typescript
// Confirm payment
const confirmRes = await fetch(`https://playground.nileslabs.com/api/v1/payments/intents/${intent.id}/confirm`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    payment_method: {
      card: { number: '4242424242424242', exp_month: 12, exp_year: 2028, cvc: '123' },
    },
  }),
});
```

---

## 3. Automatic Webhook Triggers

Confirming a payment intent automatically triggers a signed `payment_intent.succeeded` webhook to any registered endpoints in your session!

---

## 4. Interactive Payments Studio

Test payment modals, 3DS challenges, and refund flows directly inside the documentation:
👉 **[https://playground.nileslabs.com/docs/payments](https://playground.nileslabs.com/docs/payments)**

---

## Conclusion

Build high-converting checkout flows with confidence. Test payments with Playground API today!
