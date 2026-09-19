import React from 'react';
import type { Metadata } from 'next';
import { Icon } from '@iconify/react';
import { CodeBlock } from '@/components/ui/CodeBlock';
import config from '@/config/env';
import { siteConfig } from '@/config/site';
import { LiveGraphqlSubscriptionStudio } from '@/components/docs/LiveGraphqlSubscriptionStudio';

export const metadata: Metadata = {
  title: 'Real-Time GraphQL Subscriptions over WebSocket (graphql-ws) — Playground API',
  description:
    'Test live reactive GraphQL subscriptions over WebSocket using the industry-standard graphql-ws protocol. Compatible with Apollo Client, Urql, and Relay.',
  keywords: [
    'graphql subscriptions mock api',
    'graphql-ws protocol sandbox',
    'apollo client subscriptions testing',
    'urql subscriptions mock',
    'realtime websocket graphql',
    'graphql live queries sandbox',
    'reactive mock api websocket'
  ],
  alternates: {
    canonical: `${siteConfig.url}/docs/graphql/subscriptions`,
  },
  openGraph: {
    title: 'Real-Time GraphQL Subscriptions — Playground API',
    description:
      'In-browser GraphQL subscription studio and WebSocket sandbox powered by the graphql-ws protocol.',
    url: `${siteConfig.url}/docs/graphql/subscriptions`,
    type: 'article',
  },
};

export default function GraphqlSubscriptionsPage() {
  const wsUrl = (config.apiUrl || 'https://playground.nileslabs.com/api/v1')
    .replace(/^http/, 'ws')
    .replace(/\/api\/v1$/, '') + '/graphql';

  const apolloExample = `// 1. Apollo Client Setup with GraphQLWsLink & HttpLink
import { ApolloClient, InMemoryCache, split, HttpLink } from '@apollo/client';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { createClient } from 'graphql-ws';
import { getMainDefinition } from '@apollo/client/utilities';

// HTTP Link for queries and mutations
const httpLink = new HttpLink({
  uri: 'https://playground.nileslabs.com/api/v1/graphql',
  headers: {
    'X-Playground-Identity': 'your_sandbox_identity_token',
  },
});

// WebSocket Link for live subscriptions
const wsLink = new GraphQLWsLink(
  createClient({
    url: '${wsUrl}',
    connectionParams: {
      token: 'your_sandbox_identity_token',
    },
  })
);

// Split link based on operation type
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
});`;

  const reactHookExample = `// 2. React Component using Apollo's useSubscription Hook
import React from 'react';
import { useSubscription, gql } from '@apollo/client';

const POST_ADDED_SUBSCRIPTION = gql\`
  subscription OnPostAdded {
    postAdded {
      id
      title
      body
      user {
        name
        email
      }
    }
  }
\`;

export function LivePostFeed() {
  const { data, loading, error } = useSubscription(POST_ADDED_SUBSCRIPTION);

  if (loading) return <div>Listening for new posts over WebSocket...</div>;
  if (error) return <div>Subscription Error: {error.message}</div>;

  return (
    <div className="p-4 rounded-xl border border-emerald-500 bg-emerald-50">
      <h3 className="font-bold text-emerald-900">⚡ New Post Received Live!</h3>
      <p className="font-semibold">{data?.postAdded?.title}</p>
      <p className="text-sm text-slate-600">{data?.postAdded?.body}</p>
    </div>
  );
}`;

  const urqlExample = `// 3. Urql Setup with Subscription Exchange
import { createClient, defaultExchanges, subscriptionExchange } from 'urql';
import { createClient as createWSClient } from 'graphql-ws';

const wsClient = createWSClient({
  url: '${wsUrl}',
  connectionParams: {
    token: 'your_sandbox_identity_token',
  },
});

export const urqlClient = createClient({
  url: 'https://playground.nileslabs.com/api/v1/graphql',
  exchanges: [
    ...defaultExchanges,
    subscriptionExchange({
      forwardSubscription: (operation) => ({
        subscribe: (sink) => ({
          unsubscribe: wsClient.subscribe(operation, sink),
        }),
      }),
    }),
  ],
});`;

  const sdkExample = `// 4. Official TypeScript SDK (Zero-Dependency Helper)
import { PlaygroundClient } from 'playground-api';

const client = new PlaygroundClient({
  apiUrl: 'https://playground.nileslabs.com/api/v1',
  identityToken: 'your_sandbox_identity_token',
});

// Subscribe to real-time post creation
const unsubscribe = client.gql.subscribe(
  \`
    subscription {
      postAdded {
        id
        title
      }
    }
  \`,
  {},
  {
    onNext: (data) => console.log('Live Post Received:', data),
    onError: (err) => console.error('Subscription error:', err),
    onComplete: () => console.log('Subscription completed'),
  }
);

// To cancel subscription later:
// unsubscribe();`;

  return (
    <div className="space-y-12 max-w-6xl mx-auto pb-16">
      {/* Interactive Studio */}
      <LiveGraphqlSubscriptionStudio />

      {/* Architecture & Protocol Section */}
      <section className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Icon icon="lucide:broadcast" className="w-5 h-5 text-pink-500" />
          WebSocket Architecture &amp; graphql-ws Transport
        </h2>
        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
          Playground API provides stateful real-time GraphQL Subscriptions over WebSocket compliant with the modern{' '}
          <strong className="text-slate-800 dark:text-slate-200">graphql-ws</strong> protocol. Whenever a record is created or updated in your sandbox (via GraphQL mutations or REST endpoints), the reactive in-memory PubSub engine immediately publishes the event to active WebSocket listeners scoped strictly to your sandbox session.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 space-y-2">
            <div className="w-8 h-8 rounded-lg bg-pink-100 dark:bg-pink-950/60 text-pink-600 dark:text-pink-400 flex items-center justify-center">
              <Icon icon="simple-icons:graphql" className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
              RFC graphql-ws Protocol
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Native compatibility with Apollo Client <code>GraphQLWsLink</code>, Urql, Relay, and modern GraphQL developer tooling.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 space-y-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Icon icon="lucide:git-merge" className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
              Unified REST &amp; GQL Mutations
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Events are emitted regardless of whether mutations are made via REST (<code>POST /posts</code>) or GraphQL (<code>createPost</code>).
            </p>
          </div>

          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 space-y-2">
            <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center">
              <Icon icon="lucide:shield-check" className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
              Session Sandbox Isolation
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Subscription streams are scoped to your session identity token (<code>token</code> or <code>Authorization: Bearer</code>), preventing cross-user noise.
            </p>
          </div>
        </div>
      </section>

      {/* Subscription Schema Table */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Icon icon="lucide:book-open" className="w-5 h-5 text-pink-500" />
          Supported Subscription Fields &amp; Arguments
        </h2>
        <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 dark:bg-slate-900/80 text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="px-4 py-3">Subscription Field</th>
                <th className="px-4 py-3">Arguments</th>
                <th className="px-4 py-3">Return Type</th>
                <th className="px-4 py-3">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
              <tr>
                <td className="px-4 py-3 font-mono text-xs font-semibold text-pink-600 dark:text-pink-400">postAdded</td>
                <td className="px-4 py-3 text-xs text-slate-400">—</td>
                <td className="px-4 py-3 font-mono text-xs font-semibold">Post!</td>
                <td className="px-4 py-3 text-xs text-slate-500 dark:text-slate-400">Fires when any new post is created in the current sandbox.</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-mono text-xs font-semibold text-pink-600 dark:text-pink-400">commentAdded</td>
                <td className="px-4 py-3 font-mono text-xs">postId: ID</td>
                <td className="px-4 py-3 font-mono text-xs font-semibold">Comment!</td>
                <td className="px-4 py-3 text-xs text-slate-500 dark:text-slate-400">Fires when a comment is added, optionally filtered by <code>postId</code>.</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-mono text-xs font-semibold text-pink-600 dark:text-pink-400">todoUpdated</td>
                <td className="px-4 py-3 font-mono text-xs">userId: ID</td>
                <td className="px-4 py-3 font-mono text-xs font-semibold">Todo!</td>
                <td className="px-4 py-3 text-xs text-slate-500 dark:text-slate-400">Fires when a todo is created or updated in the current sandbox.</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-mono text-xs font-semibold text-pink-600 dark:text-pink-400">customRecordMutated</td>
                <td className="px-4 py-3 font-mono text-xs">collection: String!</td>
                <td className="px-4 py-3 font-mono text-xs font-semibold">CustomRecord!</td>
                <td className="px-4 py-3 text-xs text-slate-500 dark:text-slate-400">Fires when a dynamic custom entity (e.g. products, orders) is mutated.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Integration Code Examples */}
      <section className="space-y-6">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Icon icon="lucide:code-2" className="w-5 h-5 text-pink-500" />
          Client Integration Examples
        </h2>

        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
            <Icon icon="simple-icons:apollographql" className="w-4 h-4 text-pink-500" />
            Apollo Client 3 (GraphQLWsLink)
          </h3>
          <CodeBlock code={apolloExample} language="typescript" />
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
            <Icon icon="simple-icons:react" className="w-4 h-4 text-blue-500" />
            React useSubscription Hook Example
          </h3>
          <CodeBlock code={reactHookExample} language="tsx" />
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
            <Icon icon="simple-icons:graphql" className="w-4 h-4 text-purple-500" />
            Urql Subscription Exchange
          </h3>
          <CodeBlock code={urqlExample} language="typescript" />
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
            <Icon icon="simple-icons:typescript" className="w-4 h-4 text-blue-600" />
            Official TypeScript SDK
          </h3>
          <CodeBlock code={sdkExample} language="typescript" />
        </div>
      </section>
    </div>
  );
}
