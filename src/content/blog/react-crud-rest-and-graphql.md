---
title: Building a React CRUD Application With a REST API and GraphQL
published: false
description: Compare building a modern React CRUD application with REST versus GraphQL. Understand trade-offs, query shapes, state mutations, and implementation patterns.
tags: graphql, react, javascript, webdev
canonical_url: https://playground.nileslabs.com/
series: Stop Waiting for the Backend
coverImage: "/images/blog/react-crud-rest-and-graphql.jpg"
order: 8
author: "Nilesh Kumar"
authorRole: "Creator of Playground API"
date: "2026-03-08"
slug: "react-crud-rest-and-graphql"
---

# Building a React CRUD Application With a REST API and GraphQL

**Suggested URL Slug:** `react-crud-rest-and-graphql`  
**Primary Keyword:** `React REST GraphQL API`  
**Secondary Keywords:** `REST vs GraphQL React`, `GraphQL CRUD tutorial`, `REST API frontend`, `GraphQL sandbox React`  
**Meta Description:** Compare building a modern React CRUD application with REST versus GraphQL. Understand trade-offs, query shapes, state mutations, and implementation patterns.  
**Suggested Dev.to Tags:** `#graphql`, `#react`, `#javascript`, `#webdev`

---

The debate between REST and GraphQL is one of the most enduring conversations in frontend engineering.

Some developers love the simplicity, caching, and predictable HTTP status codes of REST. Others swear by GraphQL’s ability to fetch deeply nested relational data in a single round-trip without over-fetching or under-fetching.

Instead of arguing theoretically, let's explore **how to build and test the exact same React CRUD feature using both approaches** against a unified backend sandbox.

---

## The Scenario: A User Profile with Posts and Comments

Imagine we are building a user profile screen that needs to display:
1. User details (name, email, company)
2. The user's published blog posts
3. The latest comments on each post

Let's look at how REST and GraphQL approach this data requirement.

---

## Approach 1: The REST Workflow

In standard REST architecture, resources are organized around distinct URL endpoints.

### Fetching Data in REST:
To get the user and their related posts and comments, a REST client typically executes sequential or parallel HTTP `GET` requests:

```
1. GET /api/v1/users/1           ──► Fetches User profile
2. GET /api/v1/users/1/posts     ──► Fetches User's posts
3. GET /api/v1/posts/10/comments ──► Fetches Comments for Post 10
```

*The Advantage:* Simple, intuitive, leverages standard browser and CDN caching, uses native HTTP status codes (200, 404, 500).  
*The Friction:* Multiple network roundtrips (under-fetching) or downloading unused fields (over-fetching).

### React REST Code Example:
```jsx
// Fetching with REST
async function loadUserDataREST(userId) {
  const [userRes, postsRes] = await Promise.all([
    fetch(`https://playground.nileslabs.com/api/v1/users/${userId}`),
    fetch(`https://playground.nileslabs.com/api/v1/users/${userId}/posts?_limit=3`)
  ]);

  const user = await userRes.json();
  const posts = await postsRes.json();
  return { user, posts };
}
```

---

## Approach 2: The GraphQL Workflow

In GraphQL, client applications query a single endpoint (`/api/v1/graphql`) using a declarative query language that requests only the exact fields needed.

### Fetching Data in GraphQL:
With GraphQL, the entire nested data graph is retrieved in **a single POST request**:

```graphql
query GetUserProfile($userId: ID!) {
  user(id: $userId) {
    name
    email
    company {
      name
    }
    posts {
      id
      title
      comments {
        id
        name
        body
      }
    }
  }
}
```

*The Advantage:* Zero over-fetching, single network roundtrip, strictly typed schema.  
*The Friction:* All requests are `POST` to `/graphql`, requiring specialized client libraries (Apollo Client, URQL, or custom fetchers) to handle caching and error parsing.

### React GraphQL Code Example:
```jsx
// Fetching with GraphQL
async function loadUserDataGraphQL(userId) {
  const query = `
    query GetUser($id: ID!) {
      user(id: $id) {
        name
        email
        company { name }
        posts {
          id
          title
        }
      }
    }
  `;

  const response = await fetch('https://playground.nileslabs.com/api/v1/graphql', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query,
      variables: { id: userId }
    })
  });

  const { data, errors } = await response.json();
  if (errors) throw new Error(errors[0].message);
  return data.user;
}
```

---

## Comparing CRUD Mutations: REST vs. GraphQL

Let's compare creating a new post:

### REST Mutation (`POST /api/v1/posts`):
```javascript
const res = await fetch('https://playground.nileslabs.com/api/v1/posts', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    title: 'New Post via REST',
    body: 'Content...',
    user_id: 1
  })
});
const createdPost = await res.json();
```

### GraphQL Mutation (`mutation CreatePost`):
```javascript
const mutation = `
  mutation AddPost($title: String!, $body: String!, $user_id: ID!) {
    createPost(title: $title, body: $body, user_id: $user_id) {
      id
      title
      body
      user {
        name
      }
    }
  }
`;

const res = await fetch('https://playground.nileslabs.com/api/v1/graphql', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    query: mutation,
    variables: { title: 'New Post via GraphQL', body: 'Content...', user_id: 1 }
  })
});
const { data } = await res.json();
const createdPost = data.createPost;
```

Notice the key difference: in GraphQL, you can request nested fields (like `user { name }`) immediately within the mutation response, eliminating follow-up queries.

---

## When to Choose REST vs. GraphQL

| Decision Factor | Choose REST | Choose GraphQL |
| :--- | :--- | :--- |
| **Project Complexity** | Simple to moderate CRUD apps | Complex apps with deeply nested relations |
| **Caching Requirements** | Heavy reliance on HTTP/CDN caching | Client-side normalized caching (Apollo / Urql) |
| **Bandwidth Sensitivity** | Standard web applications | Mobile apps where every byte counts |
| **Learning Curve** | Lowest (Standard browser `fetch`) | Requires understanding schemas & queries |
| **Tooling Overhead** | Zero tooling required | Code generation, schema compilation |

---

## Testing Both in a Single Sandbox

Finding a sandbox that supports both modern REST filtering and a live GraphQL gateway with mutation persistence is usually difficult.

[Playground API](https://playground.nileslabs.com) by Niles Labs offers **dual REST and GraphQL gateways** over the exact same underlying dataset:
- **REST Endpoints:** `https://playground.nileslabs.com/api/v1/posts`
- **GraphQL Endpoint:** `https://playground.nileslabs.com/api/v1/graphql`
- **Interactive GraphiQL IDE:** Visit `https://playground.nileslabs.com/api/v1/graphql` in your browser to inspect the full schema, types, and documentation interactively.

Any record created via GraphQL is instantly accessible via REST `GET /posts`, and vice versa.

---

## Conclusion

Neither REST nor GraphQL is universally "better"—they are tools tailored for different architectural priorities. By testing both approaches against a unified, stateful sandbox, you can make informed decisions based on concrete code and real network performance rather than internet dogma.

Compare REST and GraphQL hands-on with [Playground API by Niles Labs](https://playground.nileslabs.com/).
