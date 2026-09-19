---
title: "Dual-Mode User Sandboxing: Anonymous Session vs Authenticated State in Playground API"
published: true
description: "Deep dive into Dual-Mode User Sandboxing in Playground API: Anonymous Session-Level (user_id = 0) vs Authenticated User-Scoped (user_id > 0) hybrid state isolation."
tags: webdev, react, architecture, backend
canonical_url: https://playground.nileslabs.com/docs/sandboxing
series: Stop Waiting for the Backend
coverImage: "/images/blog/dual-mode-user-sandboxing.jpg"
order: 29
author: "Nilesh Kumar"
authorRole: "Creator of Playground API"
date: "2026-09-20"
slug: "dual-mode-user-sandboxing"
---

# Dual-Mode User Sandboxing: Anonymous Session vs Authenticated State in Playground API

When developers prototype web applications, they frequently navigate two distinct phases:
1. **Anonymous / Guest Phase**: Rapid UI prototyping without logging in, creating mock posts and comments that persist locally in the browser session.
2. **Authenticated / Multi-User Phase**: Logging into distinct user accounts (`user_id = 1`, `user_id = 2`) to test user profile ownership, private data isolation, and user-specific collections (`/users/1/posts`).

In traditional mock APIs, this hybrid model breaks: either all mutations are global (causing test pollution), or authentication is purely decorative.

**[Playground API](https://playground.nileslabs.com)** solves this with an architectural breakthrough: **Dual-Mode User Sandboxing**!

---

## 1. Mode A: Anonymous Session Sandbox (`user_id = 0`)

When no `Authorization: Bearer <jwt>` header is provided:
- Playground API provisions a session sandbox tied to an HMAC-signed cookie or `X-Playground-Identity` header.
- Mutations are overlaid on top of global seed data with virtual `user_id = 0`.
- Perfect for anonymous prototyping, public blogs, and landing page demos.

```bash
# Creates a session-scoped post without logging in
curl -X POST https://playground.nileslabs.com/posts \
  -H "Content-Type: application/json" \
  -d '{"title": "Anonymous Prototype Post", "body": "Session isolated"}'
```

---

## 2. Mode B: Authenticated User-Scoped Sandbox (`user_id > 0`)

When a valid JWT is provided (`Authorization: Bearer <token>`):
- The overlay engine extracts the authenticated `user_id` (e.g. `user_id = 3`).
- All created records are strictly stamped with that user ID.
- Relational queries like `GET /users/3/posts` or `GET /todos?user_id=3` automatically resolve both base seed data and that specific user's virtual mutations.
- Other users in the same sandbox cannot modify or delete these records.

```typescript
// Authenticated user creates a scoped record
const res = await fetch('https://playground.nileslabs.com/posts', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${userJwtToken}`,
  },
  body: JSON.stringify({ title: 'My Private Post', body: 'User 3 only' }),
});
```

---

## 3. Seamless Transition & Migration

When an anonymous user registers or logs in during an interactive demo, Playground API seamlessly links the anonymous session mutations to the newly authenticated account, preserving UI continuity.

---

## 4. Interactive Sandboxing Studio

Inspect your active session tokens, identity hashes, and authenticated user state:
👉 **[https://playground.nileslabs.com/docs/sandboxing](https://playground.nileslabs.com/docs/sandboxing)**

---

## Conclusion

Experience true full-stack realism without a dedicated database. Build with Playground API today!
