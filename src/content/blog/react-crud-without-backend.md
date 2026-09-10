---
title: How to Build a React CRUD App Without Building a Backend
published: false
description: Learn how to build and test a full React CRUD application with persistent mutations, pagination, and filtering without setting up a custom Express backend.
tags: react, javascript, webdev, frontend
canonical_url: https://playground.nileslabs.com/
series: Stop Waiting for the Backend
coverImage: "/images/blog/react-crud-without-backend.jpg"
order: 1
author: "Nilesh Kumar"
authorRole: "Creator of Playground API"
date: "2026-02-15"
slug: "react-crud-without-backend"
---

# How to Build a React CRUD App Without Building a Backend

**Suggested URL Slug:** `react-crud-without-backend`  
**Primary Keyword:** `React CRUD without backend`  
**Secondary Keywords:** `React mock API`, `stateful frontend prototyping`, `React CRUD tutorial`, `frontend data fetching`  
**Meta Description:** Learn how to build and test a full React CRUD application with persistent mutations, pagination, and filtering without setting up a custom Express backend.  
**Suggested Dev.to Tags:** `#react`, `#javascript`, `#webdev`, `#frontend`

---

You have designed a clean React dashboard component. The state management looks solid, the modal forms are styled, and you are ready to test the full Create, Read, Update, and Delete (CRUD) workflow.

Then you hit the familiar roadblock: **there is no backend yet**.

To test whether adding a new user updates your list or whether deleting a post handles UI state properly, you are left with two frustrating options:
1. Spend an entire afternoon spinning up a temporary Node.js/Express server with SQLite or Prisma just to test frontend forms.
2. Hardcode local mock arrays in React state (`useState([ ... ])`), which does not test real HTTP network lifecycles, loading states, headers, or error handling.

Building temporary backend scaffolding wastes time that should be spent refining your user interface. In this guide, we will walk through what a modern React CRUD frontend actually requires from an API and how to connect your components to a zero-configuration stateful sandbox API.

---

## What a Frontend CRUD Interface Actually Needs

A functional CRUD application does not care whether the backend is written in Go, Rust, or Node.js. It requires a predictable HTTP contract that supports four fundamental operations:

| Operation | HTTP Method | Endpoint Pattern | Expected Payload / Response |
| :--- | :--- | :--- | :--- |
| **Read (List)** | `GET` | `/posts?_page=1&_limit=10` | Array of items with total count headers |
| **Read (Single)**| `GET` | `/posts/:id` | Single resource object |
| **Create** | `POST` | `/posts` | Created item with generated `id` |
| **Update** | `PUT` / `PATCH` | `/posts/:id` | Updated item payload |
| **Delete** | `DELETE` | `/posts/:id` | `200 OK` or `204 No Content` |

Beyond standard status codes, a realistic frontend workflow requires:
1. **Network Lifecycle Testing:** Simulating `isLoading`, `isError`, and `isSuccess` states.
2. **State Persistence:** When a user submits a `POST` request, navigating back to the list view should display the newly created item.
3. **Query Parameters:** Pagination (`?_page=1&_limit=5`), search queries (`?q=keyword`), and relational filtering (`?user_id=1`).

---

## The Limitation of Traditional Static Mock APIs

For years, developers have relied on tools like JSONPlaceholder or static JSON files. While useful for simple `GET` requests, they fail during CRUD testing:

```javascript
// Traditional static mock behavior:
fetch('https://jsonplaceholder.typicode.com/posts', {
  method: 'POST',
  body: JSON.stringify({ title: 'My New Post', body: 'Post content' })
})
  .then(res => res.json())
  .then(data => console.log(data)); // Returns { id: 101, title: 'My New Post' }

// But subsequent GET requests do NOT include your new post:
fetch('https://jsonplaceholder.typicode.com/posts/101')
  .then(res => console.log(res.status)); // 404 Not Found!
```

Because static mock endpoints do not persist mutations, testing pagination, optimistic UI updates, or cache invalidation with tools like TanStack Query or SWR becomes impossible without mocking manual client-side state.

---

## Enter Stateful Mocking with Playground API

To solve this friction, [Playground API](https://playground.nileslabs.com) by Niles Labs provides a free, stateful REST and GraphQL sandbox. 

Instead of discarding mutations, Playground API maintains a **virtual per-session overlay**. When you execute a `POST`, `PUT`, `PATCH`, or `DELETE` request, the change is saved to your temporary session without altering the shared global seed dataset. Subsequent `GET` requests immediately reflect your mutations.

Let's build a complete, working React CRUD component using this sandbox.

---

## Building the React CRUD Dashboard

Here is a clean React implementation using standard `fetch` that handles listing, creating, and deleting posts.

### 1. API Configuration Module (`api.js`)

```javascript
// src/api.js
const BASE_URL = 'https://playground.nileslabs.com/api/v1';

export async function fetchPosts(page = 1, limit = 5) {
  const response = await fetch(`${BASE_URL}/posts?_page=${page}&_limit=${limit}`);
  if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
  
  const data = await response.json();
  const totalCount = response.headers.get('x-total-count') || 100;
  return { posts: data, totalCount: Number(totalCount) };
}

export async function createPost(postData) {
  const response = await fetch(`${BASE_URL}/posts`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(postData),
  });
  if (!response.ok) throw new Error('Failed to create post');
  return response.json();
}

export async function deletePost(id) {
  const response = await fetch(`${BASE_URL}/posts/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) throw new Error('Failed to delete post');
  return response.json();
}
```

---

### 2. The React CRUD Component (`PostDashboard.jsx`)

```jsx
// src/components/PostDashboard.jsx
import React, { useState, useEffect } from 'react';
import { fetchPosts, createPost, deletePost } from '../api';

export default function PostDashboard() {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Form state
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Load posts on page change
  const loadPosts = async () => {
    try {
      setLoading(true);
      setError(null);
      const { posts: data } = await fetchPosts(page, 5);
      setPosts(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPosts();
  }, [page]);

  // Handle Create
  const handleCreate = async (e) => {
    e.preventDefault();
    if (!title.trim() || !body.trim()) return;

    try {
      setSubmitting(true);
      await createPost({ title, body, user_id: 1 });
      setTitle('');
      setBody('');
      // Reload posts: your newly created post is now in the list!
      await loadPosts();
    } catch (err) {
      alert(`Error creating post: ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  // Handle Delete
  const handleDelete = async (id) => {
    if (!window.confirm('Delete this post?')) return;
    try {
      await deletePost(id);
      // Remove from list or re-fetch
      setPosts(current => current.filter(p => p.id !== id));
    } catch (err) {
      alert(`Error deleting post: ${err.message}`);
    }
  };

  return (
    <div style={{ maxWidth: '680px', margin: '2rem auto', fontFamily: 'sans-serif' }}>
      <h2>📝 React CRUD Post Manager</h2>

      {/* Creation Form */}
      <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '2rem' }}>
        <input
          type="text"
          placeholder="Post title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <textarea
          placeholder="Post content body..."
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={3}
          required
        />
        <button type="submit" disabled={submitting}>
          {submitting ? 'Creating...' : '+ Add Post'}
        </button>
      </form>

      {/* Status Indicators */}
      {loading && <p>⏳ Loading posts from API...</p>}
      {error && <p style={{ color: 'red' }}>❌ Error: {error}</p>}

      {/* Post List */}
      {!loading && (
        <div>
          {posts.map((post) => (
            <div key={post.id} style={{ border: '1px solid #e2e8f0', padding: '1rem', marginBottom: '1rem', borderRadius: '6px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ margin: 0 }}>#{post.id} {post.title}</h3>
                <button onClick={() => handleDelete(post.id)} style={{ color: '#ef4444' }}>
                  Delete
                </button>
              </div>
              <p style={{ color: '#475569' }}>{post.body}</p>
            </div>
          ))}

          {/* Pagination Controls */}
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginTop: '1.5rem' }}>
            <button onClick={() => setPage(p => Math.max(p - 1, 1))} disabled={page === 1}>
              Previous
            </button>
            <span>Page {page}</span>
            <button onClick={() => setPage(p => p + 1)}>
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
```

---

## Key Best Practices When Building Without a Backend

1. **Decouple API Calls from Components:** Keep API functions in a dedicated service module (`api.js` or `services/posts.js`). When your real backend is ready, you only need to change the `BASE_URL`.
2. **Test Network Latency:** Real backends rarely respond in 5ms. Test your UI loading skeletons by passing `?_delay=1000` to simulate realistic network delay.
3. **Verify Error States:** Make sure your UI handles HTTP `400`, `404`, and `500` status codes gracefully rather than crashing.

---

## Limitations & Considerations

While a stateful sandbox is ideal for frontend prototyping, automated UI tests, and staging demos, keep these boundaries in mind:
- **Temporary Persistence:** Sandbox records are tied to session cookies or client headers. They are not intended for long-term production storage.
- **No Custom Business Logic:** If your application requires complex server-side validation rules or external payment webhooks, you will eventually transition to a production backend.

---

## Conclusion

You don't need to slow down frontend development to build disposable backend servers. By utilizing a stateful mock API with built-in CRUD operations, pagination, and persistent mutations, you can build, iterate, and polish your React interfaces with production-grade data flow on day one.

If you are prototyping a React application and want a ready-to-use stateful backend, check out [Playground API by Niles Labs](https://playground.nileslabs.com/).
