---
title: "How to Test Flaky APIs & Chaos Network Engineering in React"
published: true
description: "Learn how to test exponential backoff retries, offline fallback states, and intermittent 500 errors in React using Playground API's Chaos Mode."
tags: react, webdev, javascript, testing
canonical_url: https://playground.nileslabs.com/docs/chaos
series: Stop Waiting for the Backend
coverImage: "/images/blog/chaos-network-simulation.jpg"
order: 22
author: "Nilesh Kumar"
authorRole: "Creator of Playground API"
date: "2026-09-20"
slug: "chaos-network-simulation"
---

# How to Test Flaky APIs & Chaos Network Engineering in React

In local development, APIs respond in 5 milliseconds with `200 OK`. In production, mobile networks drop packets, servers return intermittent `502 Bad Gateway` errors, and third-party APIs time out.

If your frontend doesn't have resilient retry logic (e.g. TanStack Query retries, Axios retry interceptors, exponential backoff), your users will see broken screens.

**[Playground API](https://playground.nileslabs.com)** now provides a dedicated **Flaky & Chaos Network Simulation Mode**!

---

## 1. Enabling Chaos Mode via Headers & Query Params

You can configure failure probabilities and intermittent errors:

- **Header**: `X-Simulate-Chaos: 0.3` (30% random error rate)
- **Query Parameter**: `?_chaos=true` or `?_chaos=0.4`
- **Status Pools**: Randomly responds with `500 Internal Server Error`, `502 Bad Gateway`, `503 Service Unavailable`, or `504 Gateway Timeout`.

```bash
curl "https://playground.nileslabs.com/posts?_chaos=0.3"
```

---

## 2. Implementing Exponential Backoff Retries with React Query

TanStack React Query handles flaky connections automatically:

```typescript
import { useQuery } from '@tanstack/react-query';

export function useResilientPosts() {
  return useQuery({
    queryKey: ['chaos-posts'],
    queryFn: async () => {
      const res = await fetch('https://playground.nileslabs.com/posts?_chaos=0.3');
      if (!res.ok) throw new Error(`API Error: ${res.status}`);
      return res.json();
    },
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}
```

---

## 3. Interactive Chaos Studio

Test retry loops, jitter, and error rates in real time:
👉 **[https://playground.nileslabs.com/docs/chaos](https://playground.nileslabs.com/docs/chaos)**

---

## Conclusion

Don't wait for production incidents to discover UI resilience bugs. Test flaky APIs and retry logic with Playground API!
