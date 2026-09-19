---
title: "Introducing the Official Zero-Dependency TypeScript SDK for Playground API"
published: true
description: "Explore the lightweight (<4kB), zero-dependency isomorphic TypeScript SDK for Playground API with full type safety, auto-completion, and automatic session persistence."
tags: typescript, javascript, webdev, react
canonical_url: https://playground.nileslabs.com/docs/sdk
series: Stop Waiting for the Backend
coverImage: "/images/blog/official-typescript-sdk.jpg"
order: 19
author: "Nilesh Kumar"
authorRole: "Creator of Playground API"
date: "2026-09-20"
slug: "official-typescript-sdk"
---

# Introducing the Official Zero-Dependency TypeScript SDK for Playground API

Building frontend prototypes with stateful APIs should be effortless. While `fetch()` is great, writing raw HTTP requests, manually typing payload schemas, and managing session headers across requests adds friction.

Today, we are releasing the **Official TypeScript SDK for [Playground API](https://playground.nileslabs.com)** (`@playground-api/client` and `playground-api`).

It is **zero-dependency**, weighs **under 4kB**, is fully isomorphic (works in Node.js, Next.js App Router, React, Vue, Svelte, and React Native), and delivers 100% end-to-end type safety.

---

## 1. Installation

```bash
npm install @playground-api/client
# or
pnpm add @playground-api/client
# or
yarn add @playground-api/client
```

---

## 2. Quickstart & Automatic Session Persistence

Initialize the client with zero configuration:

```typescript
import { createPlaygroundClient } from '@playground-api/client';

const api = createPlaygroundClient({
  // Optional: specify custom session ID or delay simulation
  delay: 300,
});

// Full TypeScript auto-completion & type inferences
const posts = await api.posts.list({ limit: 10, sort: 'id', order: 'desc' });
console.log(posts[0].title);

// Create a stateful post in your sandbox
const newPost = await api.posts.create({
  title: 'Shipping with TypeScript SDK',
  body: 'Zero dependencies, full type safety.',
  userId: 1,
});
console.log(newPost.id);
```

---

## 3. Supported SDK Resource Modules

The SDK provides ergonomic resource namespaces for all Playground API capabilities:

- `api.posts`: `list()`, `get(id)`, `create(data)`, `update(id, data)`, `delete(id)`
- `api.users`: `list()`, `get(id)`, `posts(id)`, `todos(id)`
- `api.todos`: `list()`, `toggle(id)`, `create(data)`
- `api.auth`: `login({ email, password })`, `register()`, `me()`, `refresh()`
- `api.uploads`: `upload(file, options)`, `bulk(files)`
- `api.analytics`: `track(event, props)`, `batch(events)`
- `api.webhooks`: `register()`, `list()`, `test()`
- `api.session`: `reset()`, `export()`, `import()`

---

## 4. Built-in Simulation Utilities

Need to test slow connections or chaotic error rates in your test suite?

```typescript
// Enable simulation globally or per-request
const client = createPlaygroundClient({
  simulate: {
    delay: 1200,      // Add 1.2s latency to all requests
    errorRate: 0.2,   // 20% random error injection
  },
});
```

---

## 5. Live SDK Documentation & Sandbox

Explore the full API reference, download `.d.ts` type declarations, and run code samples in the interactive Studio:
👉 **[https://playground.nileslabs.com/docs/sdk](https://playground.nileslabs.com/docs/sdk)**

---

## Conclusion

Accelerate your frontend prototyping with full type safety and zero bundle bloat. Install `@playground-api/client` today!
