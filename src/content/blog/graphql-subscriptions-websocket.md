---
title: "Real-Time GraphQL Subscriptions in React & Apollo Client Without a Backend"
published: true
description: "Learn how to connect Apollo Client or URQL to hosted real-time GraphQL subscriptions over WebSocket using Playground API."
tags: graphql, react, javascript, apollo
canonical_url: https://playground.nileslabs.com/docs/graphql
series: Stop Waiting for the Backend
coverImage: "/images/blog/graphql-subscriptions-websocket.jpg"
order: 25
author: "Nilesh Kumar"
authorRole: "Creator of Playground API"
date: "2026-09-20"
slug: "graphql-subscriptions-websocket"
---

# Real-Time GraphQL Subscriptions in React & Apollo Client Without a Backend

Setting up GraphQL Subscriptions on the client usually requires an elaborate Apollo Server or GraphQL Yoga backend with a Redis PubSub adapter and a WebSocket transport server (`graphql-ws`). 

When you're building a UI prototype—like a live feed, collaborative task board, or trading ticker—setting up that infrastructure just to see if your React components update in real time slows you down.

**[Playground API](https://playground.nileslabs.com)** now provides hosted **GraphQL Subscriptions over WebSocket** linked directly to stateful sandbox mutations!

---

## 1. The GraphQL Subscription Schema

Playground API exposes reactive subscription hooks for all standard resources:

```graphql
subscription OnPostAdded {
  postAdded {
    id
    title
    body
    user_id
    created_at
  }
}

subscription OnTodoUpdated {
  todoUpdated {
    id
    title
    completed
  }
}
```

---

## 2. Connecting with Apollo Client & `graphql-ws`

Here is how you set up Apollo Client with WebSocket link transport:

```typescript
import { ApolloClient, InMemoryCache, split, HttpLink } from '@apollo/client';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { createClient } from 'graphql-ws';
import { getMainDefinition } from '@apollo/client/utilities';

const httpLink = new HttpLink({
  uri: 'https://playground.nileslabs.com/graphql',
});

const wsLink = new GraphQLWsLink(
  createClient({
    url: 'wss://playground.nileslabs.com/graphql-ws',
  })
);

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  },
  wsLink,
  httpLink
);

export const client = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache(),
});
```

---

## 3. Consuming Subscriptions in a React Component

```tsx
import { useSubscription, gql } from '@apollo/client';

const POST_ADDED_SUBSCRIPTION = gql`
  subscription {
    postAdded {
      id
      title
      body
    }
  }
`;

export function LivePostFeed() {
  const { data, loading } = useSubscription(POST_ADDED_SUBSCRIPTION);

  return (
    <div>
      <h3>Live Post Feed</h3>
      {loading && <p>Listening for real-time posts...</p>}
      {data?.postAdded && (
        <div className="card">
          <h4>{data.postAdded.title}</h4>
          <p>{data.postAdded.body}</p>
        </div>
      )}
    </div>
  );
}
```

---

## 4. Triggering Mutations & Live Updates

Whenever you (or another test runner) fire a GraphQL mutation or a standard REST `POST /posts` request in your session, Playground API broadcasts the event over the `graphql-ws` link in real time!

Try it in the interactive GraphQL Studio:
👉 **[https://playground.nileslabs.com/docs/graphql](https://playground.nileslabs.com/docs/graphql)**
