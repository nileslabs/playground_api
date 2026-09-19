---
title: "How to Test Cursor-Based Pagination & Infinite Scroll in React Without a Backend"
published: true
description: "Learn how to test cursor-based pagination, opaque base64 tokens, React Query useInfiniteQuery, and infinite scroll feeds using Playground API."
tags: react, webdev, javascript, frontend
canonical_url: https://playground.nileslabs.com/docs/pagination
series: Stop Waiting for the Backend
coverImage: "/images/blog/cursor-pagination-infinite-scroll.jpg"
order: 18
author: "Nilesh Kumar"
authorRole: "Creator of Playground API"
date: "2026-09-20"
slug: "cursor-pagination-infinite-scroll"
---

# How to Test Cursor-Based Pagination & Infinite Scroll in React Without a Backend

Standard offset-based pagination (`?page=2&limit=10`) works fine for simple tables, but for modern infinite scroll feeds (Twitter, Instagram, Reddit style), **offset pagination fails** because:
- New items inserted at the top shift the entire list, causing duplicate items or skipped entries when scrolling down.
- Database `OFFSET` queries degrade severely on large datasets.

Modern production APIs use **Cursor-Based Pagination** (`?cursor=<base64>&limit=10`), returning a pointer to the last item seen (`nextCursor`) and a boolean `hasMore` flag.

**[Playground API](https://playground.nileslabs.com)** now provides native **Cursor-Based Pagination** across all endpoints!

---

## 1. The Cursor Endpoint Contract

Make a request with `cursor` and `limit`:

```bash
curl "https://playground.nileslabs.com/posts?cursor=eyJpZCI6MTB9&limit=10"
```

### JSON Response:
```json
{
  "data": [
    { "id": 11, "title": "Next Post Title", "body": "..." },
    { "id": 12, "title": "Another Post", "body": "..." }
  ],
  "pagination": {
    "nextCursor": "eyJpZCI6MjB9",
    "hasMore": true,
    "total": 100
  }
}
```

When reaching the end of the collection, `hasMore` returns `false` and `nextCursor` returns `null`.

---

## 2. Integrating with TanStack React Query (`useInfiniteQuery`)

```tsx
import { useInfiniteQuery } from '@tanstack/react-query';

async function fetchPosts({ pageParam = null }: { pageParam?: string | null }) {
  const url = pageParam
    ? `https://playground.nileslabs.com/posts?cursor=${pageParam}&limit=10`
    : 'https://playground.nileslabs.com/posts?limit=10';

  const res = await fetch(url);
  return res.json();
}

export function InfiniteFeed() {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ['infinite-posts'],
    queryFn: fetchPosts,
    getNextPageParam: (lastPage) => lastPage.pagination.nextCursor,
    initialPageParam: null,
  });

  return (
    <div>
      {data?.pages.map((page, i) => (
        <div key={i}>
          {page.data.map((post: any) => (
            <div key={post.id} className="post-card">
              <h4>{post.title}</h4>
            </div>
          ))}
        </div>
      ))}

      {hasNextPage && (
        <button onClick={() => fetchNextPage()} disabled={isFetchingNextPage}>
          {isFetchingNextPage ? 'Loading more...' : 'Load More'}
        </button>
      )}
    </div>
  );
}
```

---

## 3. Interactive Pagination Studio

Explore cursor tokens, page parameters, and infinite scrolling in the documentation:
👉 **[https://playground.nileslabs.com/docs/pagination](https://playground.nileslabs.com/docs/pagination)**

---

## Conclusion

Test real infinite scroll feeds and TanStack Query caching seamlessly with Playground API!
