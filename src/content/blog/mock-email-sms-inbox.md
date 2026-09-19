---
title: "How to Test Email & SMS Verification (OTP & Magic Links) in React Without Twilio or SendGrid"
published: true
description: "Learn how to test OTP verification codes, magic links, email templates, and SMS alerts using Playground API's Virtual Web Inbox."
tags: react, webdev, javascript, security
canonical_url: https://playground.nileslabs.com/docs/inbox
series: Stop Waiting for the Backend
coverImage: "/images/blog/mock-email-sms-inbox.jpg"
order: 21
author: "Nilesh Kumar"
authorRole: "Creator of Playground API"
date: "2026-09-20"
slug: "mock-email-sms-inbox"
---

# How to Test Email & SMS Verification (OTP & Magic Links) in React Without Twilio or SendGrid

Building authentication and onboarding flows often requires sending transactional emails and SMS messages:
- 6-digit OTP verification codes (Two-Factor Auth / Phone login).
- Passwordless magic login links.
- Welcome emails and invoice receipts.

Testing these flows during local development usually requires setting up Mailtrap, Twilio, or SendGrid accounts, which cost money and slow down automated testing suites.

**[Playground API](https://playground.nileslabs.com)** now provides a dedicated **Virtual In-Browser Email & SMS Web Inbox**!

---

## 1. Dispatching Virtual Emails & SMS Messages

Send transactional communications via simple REST endpoints:

```typescript
// Sending a magic login link email
await fetch('https://playground.nileslabs.com/api/v1/emails', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    to: 'user@example.com',
    subject: 'Your Magic Login Link',
    html: '<p>Click here to login: <a href="http://localhost:3000/auth/verify?token=tok_987">Log In</a></p>',
  }),
});

// Sending an OTP SMS message
await fetch('https://playground.nileslabs.com/api/v1/sms', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    to: '+15551234567',
    message: 'Your verification code is 849201. Valid for 5 minutes.',
  }),
});
```

---

## 2. Real-Time In-Browser Web Inbox

Instead of checking an external email inbox, navigate to:
👉 **[https://playground.nileslabs.com/docs/inbox](https://playground.nileslabs.com/docs/inbox)**

The virtual inbox displays:
- 📬 **Live Message List**: Incoming emails and SMS messages appear instantly with zero page reloads.
- 🔑 **Automatic OTP Parser**: Automatically extracts 6-digit verification codes into a 1-click copy badge.
- 🌐 **HTML Email Previewer**: Render responsive email templates, inspect raw HTML, and click test links.
- 📱 **SMS Device View**: Visual phone screen displaying simulated SMS bubbles.

---

## 3. Automated E2E Testing with Playwright & Cypress

Query messages programmatically in your automated test suites:

```typescript
// In Playwright / Cypress
const res = await request.get('https://playground.nileslabs.com/api/v1/inbox?to=user@example.com');
const { messages } = await res.json();
const otpCode = messages[0].otp_code; // e.g. "849201"

// Fill OTP into React form
await page.fill('input[name="otp"]', otpCode);
await page.click('button[type="submit"]');
```

---

## 4. Interactive Inbox Studio

Explore email sending, OTP extraction, and live templates directly in the documentation:
👉 **[https://playground.nileslabs.com/docs/inbox](https://playground.nileslabs.com/docs/inbox)**

---

## Conclusion

Test authentication flows, magic links, and OTP codes effortlessly with Playground API!
