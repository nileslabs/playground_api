---
title: How to Test Slow APIs and Network Latency in Frontend Applications
published: false
description: Discover why frontend apps break on slow networks, and learn how to simulate API latency, test skeleton loaders, handle race conditions, and cancel requests.
tags: react, performance, webdev, javascript
canonical_url: https://playground.nileslabs.com/
series: Stop Waiting for the Backend
coverImage: "/images/blog/test-slow-apis-network-latency.jpg"
order: 5
author: "Nilesh Kumar"
authorRole: "Creator of Playground API"
date: "2026-02-27"
slug: "test-slow-apis-network-latency"
---

# How to Test Slow APIs and Network Latency in Frontend Applications

**Suggested URL Slug:** `test-slow-apis-network-latency`  
**Primary Keyword:** `test API latency`  
**Secondary Keywords:** `network latency simulation`, `React loading skeleton`, `API race condition testing`, `AbortController React`  
**Meta Description:** Discover why frontend apps break on slow networks, and learn how to simulate API latency, test skeleton loaders, handle race conditions, and cancel requests.  
**Suggested Dev.to Tags:** `#react`, `#performance`, `#webdev`, `#javascript`

---

When developing locally on your high-speed laptop, your frontend feels blazingly fast. API responses resolve in 4 milliseconds. Modals snap open instantly. Transitions look silky smooth.

Then you test your web app on a mobile device with poor 4G reception, and everything falls apart:
- Layouts jump violently because skeleton loaders flash on and off in 20ms or don't appear at all.
- Fast typists trigger search autocomplete race conditions, where an earlier query resolves *after* a later query, displaying outdated results.
- Users double-click submit buttons because there is no visual loading indicator, creating duplicate records.
- Stale network requests continue executing in the background after the user navigates away.

Localhost is a deceptive environment. To build resilient user interfaces, you must test against realistic network latency during development.

---

## Why Latency Breaks Frontend Applications

Real-world API latency is unpredictable. A response can take 200ms, 1500ms, or 8000ms depending on geographic distance, mobile network handoffs, and database load.

When API latency is introduced, frontend applications face three classic bugs:

### 1. The Autocomplete Race Condition
Consider a search bar. The user types `"react"`, and then quickly types `"react native"`.

```
Timeline:
t=0ms:  Request A ("react") dispatched  ───────────── (Takes 1800ms) ───────────► Resolves at t=1800ms
t=100ms: Request B ("react native") dispatched ── (Takes 400ms) ──► Resolves at t=500ms
```

If Request B finishes at 500ms and updates the screen, but Request A finishes at 1800ms and overwrites the screen, the user ends up looking at results for `"react"` even though the search input says `"react native"`.

### 2. Layout Shift (Cumulative Layout Shift - CLS)
If data loads without placeholder skeleton loaders that match the exact aspect ratio of the incoming content, the page content jumps when data arrives, causing a jarring user experience.

### 3. Missing Request Cancellation
If a user switches tabs or navigates away while a 2000ms query is in flight, the unresolved Promise might attempt to update state on an unmounted component or waste unnecessary mobile bandwidth.

---

## Simulating Network Delay on Demand

Instead of relying on browser DevTools global throttling (which slows down all asset downloads, CSS, and images simultaneously), you can throttle **specific API requests** using latency simulation parameters.

[Playground API](https://playground.nileslabs.com) by Niles Labs allows you to inject millisecond delays into any endpoint:

```
// Via Query Parameter (e.g. 1500ms delay):
GET https://playground.nileslabs.com/api/v1/posts?_delay=1500

// Via HTTP Header:
X-Simulate-Delay: 2000
```

This lets you test slow API endpoints in isolation while keeping the rest of your web application running at full speed.

---

## Building a Race-Condition-Proof React Search Component

Let's build a search-as-you-type React component that combines:
1. Shimmer skeleton loading state
2. `AbortController` for active request cancellation
3. Artificial latency simulation for QA testing

```jsx
// src/components/SearchAutocomplete.jsx
import React, { useState, useEffect, useRef } from 'react';

export default function SearchAutocomplete() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [delayMs, setDelayMs] = useState(1200); // Default simulated delay

  // Keep a reference to the active AbortController
  const abortControllerRef = useRef(null);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setLoading(false);
      return;
    }

    // Cancel any in-flight request before starting a new one
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Create a new AbortController for this request
    const controller = new AbortController();
    abortControllerRef.current = controller;

    const performSearch = async () => {
      setLoading(true);
      try {
        const url = `https://playground.nileslabs.com/api/v1/posts?q=${encodeURIComponent(query)}&_delay=${delayMs}`;
        const res = await fetch(url, { signal: controller.signal });
        
        if (!res.ok) throw new Error('Search failed');
        const data = await res.json();
        setResults(data);
      } catch (err) {
        if (err.name === 'AbortError') {
          console.log(`Cancelled stale query for: "${query}"`);
        } else {
          console.error(err);
        }
      } finally {
        // Only turn off loading if this was the latest controller
        if (abortControllerRef.current === controller) {
          setLoading(false);
        }
      }
    };

    // Debounce input by 250ms
    const debounceTimer = setTimeout(performSearch, 250);

    return () => {
      clearTimeout(debounceTimer);
      controller.abort();
    };
  }, [query, delayMs]);

  return (
    <div style={{ maxWidth: '500px', margin: '2rem auto', fontFamily: 'sans-serif' }}>
      <h3>⚡ Latency-Tolerant Search</h3>

      {/* Simulator Latency Control */}
      <div style={{ marginBottom: '1rem', fontSize: '13px', color: '#64748b' }}>
        <label>Simulated Latency: </label>
        <select value={delayMs} onChange={(e) => setDelayMs(Number(e.target.value))}>
          <option value={0}>0ms (Instant Localhost)</option>
          <option value={500}>500ms (Fast 4G)</option>
          <option value={1500}>1500ms (Slow 3G)</option>
          <option value={3000}>3000ms (High Latency Satellite)</option>
        </select>
      </div>

      {/* Search Input */}
      <input
        type="text"
        placeholder="Search posts (e.g. 'qui', 'optio')..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        style={{ width: '100%', padding: '10px', boxSizing: 'border-box', borderRadius: '6px', border: '1px solid #cbd5e1' }}
      />

      {/* Skeleton Loading State */}
      {loading && (
        <div style={{ marginTop: '1rem' }}>
          {[1, 2, 3].map((n) => (
            <div 
              key={n} 
              style={{
                height: '40px',
                backgroundColor: '#e2e8f0',
                borderRadius: '4px',
                marginBottom: '8px',
                animation: 'pulse 1.5s infinite ease-in-out'
              }}
            />
          ))}
        </div>
      )}

      {/* Results List */}
      {!loading && (
        <ul style={{ listStyle: 'none', padding: 0, marginTop: '1rem' }}>
          {results.map((post) => (
            <li key={post.id} style={{ padding: '8px', borderBottom: '1px solid #f1f5f9' }}>
              <strong>#{post.id}</strong> {post.title}
            </li>
          ))}
          {query && results.length === 0 && (
            <li style={{ color: '#94a3b8' }}>No matching posts found.</li>
          )}
        </ul>
      )}
    </div>
  );
}
```

---

## 3 Best Practices for Latency-Resilient Web UIs

1. **Always Implement Debouncing and `AbortController`:**  
   Every search bar or live filter should debounce keypresses by 200–300ms and cancel previous unresolved HTTP requests using `AbortController`.
2. **Prevent Double-Submissions on Slow Mutations:**  
   Whenever a user clicks "Submit Form", immediately disable the button and show a spinner. On a 2000ms slow connection, impatient users will repeatedly click buttons if feedback is missing.
3. **Use Skeleton Screens Instead of Plain Spinners:**  
   Skeleton screens preserve layout height and prepare the user’s eyes for incoming content, drastically reducing perceived latency.

---

## Conclusion

A performant web application is not just one that runs fast on localhost—it is one that handles slowness gracefully. By actively injecting network latency into your mock APIs, you can expose race conditions, refine skeleton loaders, and build rock-solid loading states before shipping to users.

To simulate network latency in your own development workflows, try [Playground API by Niles Labs](https://playground.nileslabs.com/).
