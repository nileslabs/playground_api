---
title: "How to Test Outgoing Webhooks and HMAC Signatures Without Setting Up an Event Server"
published: true
description: "Learn how to simulate outgoing webhook dispatches, verify HMAC-SHA256 signatures, test automatic retries, and inspect delivery logs using Playground API."
tags: webdev, javascript, api, security
canonical_url: https://playground.nileslabs.com/docs/webhooks
series: Stop Waiting for the Backend
coverImage: "/images/blog/webhooks-dispatcher-inspector.jpg"
order: 14
author: "Nilesh Kumar"
authorRole: "Creator of Playground API"
date: "2026-09-20"
slug: "webhooks-dispatcher-inspector"
---

# How to Test Outgoing Webhooks and HMAC Signatures Without Setting Up an Event Server

When building integrations for payment gateways, SaaS workflows, or third-party webhooks, testing incoming event consumers is famously cumbersome. You typically need:
1. A live public URL (using Ngrok or Cloudflare Tunnels).
2. An active subscription or event trigger on a third-party service.
3. Cryptographic signature generation (`HMAC-SHA256`) to ensure your security verification middleware works under pressure.
4. A way to simulate failed deliveries (HTTP 500, timeouts) to test your exponential retry and alerting systems.

In this guide, we'll explore how **[Playground API](https://playground.nileslabs.com)** provides a complete outgoing webhook dispatcher, delivery inspector, and cryptographic signature generator with zero server setup.

---

## 1. Registering an Outgoing Webhook Endpoint

To start receiving webhook events from Playground API, send a `POST` request to register your destination URL and subscribed topics:

```bash
curl -X POST https://playground.nileslabs.com/api/v1/webhooks \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://api.yourdomain.com/webhooks/incoming",
    "events": ["post.created", "user.updated", "order.completed"],
    "secret": "whsec_test_secret_key_849204"
  }'
```

### Response:
```json
{
  "id": "whk_9a8b7c6d5e",
  "url": "https://api.yourdomain.com/webhooks/incoming",
  "events": ["post.created", "user.updated", "order.completed"],
  "status": "active",
  "secret": "whsec_test_secret_key_849204",
  "created_at": "2026-09-19T18:30:00.000Z"
}
```

---

## 2. Triggering Test Webhook Dispatches

Whenever a mutation occurs in your Playground API sandbox (e.g. `POST /posts` or `POST /orders`), the dispatcher automatically packages the event payload and fires an HTTP POST request to your registered destination URL.

You can also trigger a manual test dispatch directly via the API:

```bash
curl -X POST https://playground.nileslabs.com/api/v1/webhooks/whk_9a8b7c6d5e/test \
  -H "Content-Type: application/json" \
  -d '{
    "event": "order.completed",
    "data": {
      "order_id": "ord_10492",
      "amount": 99.00,
      "currency": "USD"
    }
  }'
```

---

## 3. Verifying Cryptographic HMAC-SHA256 Signatures

Every webhook sent by Playground API includes security headers:
- `X-Playground-Signature`: `t=1758306600,v1=9e8b7c4a3...`
- `X-Playground-Event`: `order.completed`
- `X-Playground-Delivery-ID`: `del_3f920a`

Here is how you verify this in a Node.js / Express middleware:

```typescript
import crypto from 'crypto';
import { Request, Response, NextFunction } from 'express';

export function verifyWebhookSignature(req: Request, res: Response, next: NextFunction) {
  const signatureHeader = req.headers['x-playground-signature'] as string;
  const secret = process.env.PLAYGROUND_WEBHOOK_SECRET!;

  if (!signatureHeader) {
    return res.status(401).json({ error: 'Missing signature header' });
  }

  const parts = Object.fromEntries(
    signatureHeader.split(',').map((part) => part.split('='))
  );

  const timestamp = parts['t'];
  const signature = parts['v1'];

  // Prevent replay attacks (5 minute window)
  const currentTimestamp = Math.floor(Date.now() / 1000);
  if (Math.abs(currentTimestamp - parseInt(timestamp, 10)) > 300) {
    return res.status(400).json({ error: 'Timestamp expired' });
  }

  // Compute expected HMAC hash
  const rawBody = (req as any).rawBody || JSON.stringify(req.body);
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(`${timestamp}.${rawBody}`)
    .digest('hex');

  if (crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))) {
    return next();
  }

  return res.status(403).json({ error: 'Invalid HMAC signature' });
}
```

---

## 4. Live In-Browser Delivery Inspector

You can view the status of every dispatch, inspect request headers, payload bodies, response status codes, and retry counts directly in the Playground API documentation:

👉 **[https://playground.nileslabs.com/docs/webhooks](https://playground.nileslabs.com/docs/webhooks)**

Features in the Inspector:
- 📊 **Real-time Status Badges**: `200 OK`, `500 Server Error`, `Timed Out`.
- 🔁 **One-Click Redelivery**: Re-send any failed webhook event with preserved delivery IDs.
- ⏱️ **Latency Timings**: Measure response times from your server down to the millisecond.

---

## Conclusion

Testing webhooks should not require mocking raw HTTP requests or setting up complex third-party test accounts. Playground API gives you a complete, stateful dispatcher with cryptographic security out of the box.

Start testing webhooks right now: **[https://playground.nileslabs.com/docs/webhooks](https://playground.nileslabs.com/docs/webhooks)**
