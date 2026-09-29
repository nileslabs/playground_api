'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Icon } from '@iconify/react';
import config, { getWebSocketUrl } from '@/config/env';
import { CodeBlock } from '@/components/ui/CodeBlock';

interface SubscriptionTopic {
  id: string;
  name: string;
  desc: string;
  document: string;
  sampleEvent: any;
}

const TOPICS: SubscriptionTopic[] = [
  {
    id: 'postAdded',
    name: 'postAdded',
    desc: 'Dispatched whenever a post is created via REST or GraphQL mutation.',
    document: `subscription OnPostCreated {
  postAdded {
    id
    title
    body
    userId
    user {
      name
      email
    }
  }
}`,
    sampleEvent: {
      postAdded: {
        id: 101,
        title: 'Real-Time Streaming with GraphQL Subscriptions',
        body: 'Dispatched directly via WebSocket pubsub event bus.',
        userId: 1,
        user: {
          name: 'Leanne Graham',
          email: 'sincere@april.biz',
        },
      },
    },
  },
  {
    id: 'commentAdded',
    name: 'commentAdded(postId: "1")',
    desc: 'Filtered stream emitting comments attached to a specific discussion thread.',
    document: `subscription OnCommentAdded($postId: ID!) {
  commentAdded(postId: $postId) {
    id
    name
    email
    body
    post_id
  }
}`,
    sampleEvent: {
      commentAdded: {
        id: 501,
        name: 'Alex Rivera',
        email: 'alex.rivera@example.com',
        body: 'Subscribed in real time over graphql-ws!',
        post_id: 1,
      },
    },
  },
  {
    id: 'todoUpdated',
    name: 'todoUpdated(userId: "1")',
    desc: 'Emits task checklist status modifications scoped to a specific user author ID.',
    document: `subscription OnTodoUpdated($userId: ID!) {
  todoUpdated(userId: $userId) {
    id
    title
    completed
    userId
  }
}`,
    sampleEvent: {
      todoUpdated: {
        id: 14,
        title: 'Review GraphQL subscription client link',
        completed: true,
        userId: 1,
      },
    },
  },
  {
    id: 'customRecordMutated',
    name: 'customRecordMutated(collection: "products")',
    desc: 'Streams insertions, updates, and deletions across dynamic custom collections.',
    document: `subscription OnCustomRecordMutated($collection: String!) {
  customRecordMutated(collection: $collection) {
    id
    collection
    data
    created_at
  }
}`,
    sampleEvent: {
      customRecordMutated: {
        id: 'rec_982341',
        collection: 'products',
        data: JSON.stringify({ sku: 'PRD-99', name: 'Ergonomic Desk', price: 299.99 }),
        created_at: '2026-09-29T12:00:00.000Z',
      },
    },
  },
];

interface LogEntry {
  id: string;
  topic: string;
  type: 'ack' | 'event' | 'system' | 'sent';
  payload: any;
  time: string;
}

export default function GraphqlSubscriptionsPage() {
  const publicApiUrl = config.publicApiUrl || 'https://playground.nileslabs.com/api/v1';

  const [activeTopic, setActiveTopic] = useState<SubscriptionTopic>(TOPICS[0]);
  const [activeRecipe, setActiveRecipe] = useState<'apollo' | 'graphqlWs' | 'reactHook'>('apollo');
  const [status, setStatus] = useState<'disconnected' | 'connecting' | 'connected'>('disconnected');
  const [logs, setLogs] = useState<LogEntry[]>([
    {
      id: 'init-1',
      topic: 'system',
      type: 'system',
      payload: 'Subscription simulator initialized. Select a topic and connect to test graphql-ws event streaming.',
      time: '12:00:00',
    },
  ]);

  const wsRef = useRef<WebSocket | null>(null);

  const getWsUrl = () => {
    if (typeof config.getWebSocketUrl === 'function') {
      return config.getWebSocketUrl('/graphql');
    }
    if (typeof window !== 'undefined') {
      const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
      if (isLocal) {
        return 'ws://localhost:3001/graphql';
      }
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      return `${protocol}//${window.location.host}/graphql`;
    }
    return 'ws://localhost:3001/graphql';
  };

  const connectWs = () => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) return;

    setStatus('connecting');
    const wsUrl = getWsUrl();

    try {
      // Connect using graphql-transport-ws subprotocol
      const ws = new WebSocket(wsUrl, 'graphql-transport-ws');
      wsRef.current = ws;

      ws.onopen = () => {
        // Send connection_init frame per graphql-ws specification
        ws.send(JSON.stringify({ type: 'connection_init', payload: {} }));
      };

      ws.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data);

          if (msg.type === 'connection_ack') {
            setStatus('connected');
            setLogs((prev) => [
              ...prev,
              {
                id: `ack-${Date.now()}`,
                topic: 'protocol',
                type: 'ack',
                payload: { type: 'connection_ack', status: 'GraphQL-WS protocol handshake acknowledged' },
                time: new Date().toLocaleTimeString(),
              },
            ]);

            // Subscribe to active topic
            ws.send(
              JSON.stringify({
                id: `sub-${activeTopic.id}`,
                type: 'subscribe',
                payload: {
                  query: activeTopic.document,
                },
              })
            );

            setLogs((prev) => [
              ...prev,
              {
                id: `sent-${Date.now()}`,
                topic: activeTopic.name,
                type: 'sent',
                payload: { type: 'subscribe', document: activeTopic.document },
                time: new Date().toLocaleTimeString(),
              },
            ]);
          } else if (msg.type === 'next') {
            setLogs((prev) => [
              ...prev,
              {
                id: `evt-${Date.now()}`,
                topic: activeTopic.name,
                type: 'event',
                payload: msg.payload?.data || msg.payload,
                time: new Date().toLocaleTimeString(),
              },
            ]);
          }
        } catch {
          // Ignore raw frame parse errors
        }
      };

      ws.onclose = () => {
        setStatus('disconnected');
        setLogs((prev) => [
          ...prev,
          {
            id: `close-${Date.now()}`,
            topic: 'system',
            type: 'system',
            payload: 'WebSocket session disconnected.',
            time: new Date().toLocaleTimeString(),
          },
        ]);
      };

      ws.onerror = () => {
        setStatus('disconnected');
        setLogs((prev) => [
          ...prev,
          {
            id: `err-${Date.now()}`,
            topic: 'system',
            type: 'system',
            payload: `Connection notice: Socket channel closed or inactive on ${wsUrl}.`,
            time: new Date().toLocaleTimeString(),
          },
        ]);
      };
    } catch {
      setStatus('disconnected');
    }
  };

  const disconnectWs = () => {
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    setStatus('disconnected');
  };

  const handleSimulateEvent = () => {
    setLogs((prev) => [
      ...prev,
      {
        id: `sim-${Date.now()}`,
        topic: activeTopic.name,
        type: 'event',
        payload: activeTopic.sampleEvent,
        time: new Date().toLocaleTimeString(),
      },
    ]);
  };

  useEffect(() => {
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []);

  const apolloRecipe = `// Apollo Client Split Link (HTTP + WebSocket)
import { ApolloClient, InMemoryCache, split, HttpLink } from '@apollo/client';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { createClient } from 'graphql-ws';
import { getMainDefinition } from '@apollo/client/utilities';

// 1. HTTP Link for Queries & Mutations
const httpLink = new HttpLink({
  uri: '${publicApiUrl}/graphql',
});

// 2. WebSocket Link for Subscriptions
const wsLink = new GraphQLWsLink(
  createClient({
    url: '${publicApiUrl.replace(/^http/, 'ws')}/graphql',
    connectionParams: {
      // Optional session authentication:
      // token: 'your-session-jwt-or-sandbox-id',
    },
  })
);

// 3. Directional Split Link
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

  const graphqlWsRecipe = `// Standalone graphql-ws Integration (Vanilla JS / Framework Agnostic)
import { createClient } from 'graphql-ws';

const client = createClient({
  url: '${publicApiUrl.replace(/^http/, 'ws')}/graphql',
  lazy: true,
  retryAttempts: 5,
});

// Subscribe to real-time events
const unsubscribe = client.subscribe(
  {
    query: \`${activeTopic.document.trim()}\`,
  },
  {
    next: (data) => console.log('Subscription event received:', data),
    error: (err) => console.error('Subscription error:', err),
    complete: () => console.log('Subscription completed'),
  }
);

// Call unsubscribe() when component unmounts
// unsubscribe();`;

  const reactHookRecipe = `// React 19 Custom Subscription Hook
import { useState, useEffect } from 'react';
import { createClient } from 'graphql-ws';

const wsUrl = '${publicApiUrl.replace(/^http/, 'ws')}/graphql';

export function useGraphQLSubscription(query: string, variables = {}) {
  const [data, setData] = useState<any>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const client = createClient({ url: wsUrl });

    const unsubscribe = client.subscribe(
      { query, variables },
      {
        next: (res) => setData(res.data),
        error: (err) => console.error('Subscription error', err),
        complete: () => setIsConnected(false),
      }
    );

    setIsConnected(true);

    return () => {
      unsubscribe();
      client.dispose();
    };
  }, [query, JSON.stringify(variables)]);

  return { data, isConnected };
}`;

  return (
    <div className="space-y-12 w-full text-slate-900">
      {/* 1. Header with Eyebrow Badge */}
      <div id="overview" className="space-y-4 scroll-mt-20">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold uppercase tracking-wider border border-indigo-100">
          <Icon icon="ph:waveform-bold" className="w-3.5 h-3.5" />
          <span>GraphQL Gateway</span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-[1.15]">
          Real-Time GraphQL Subscriptions
        </h1>

        <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-3xl">
          Listen to live resource mutation events over WebSockets using the modern <code className="font-mono text-xs bg-slate-100 px-1 py-0.5 rounded text-indigo-600">graphql-ws</code> protocol. Stream new blog posts, discussion comments, and task modifications instantaneously.
        </p>
      </div>

      {/* 2. Interactive Subscription Workbench */}
      <div id="subscription-workbench" className="p-6 sm:p-7 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-6 scroll-mt-20">
        <div className="border-b border-slate-100 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="font-bold text-base sm:text-lg text-slate-900">
              Interactive Subscription Visualizer
            </h2>
            <p className="text-sm text-slate-600">
              Select a subscription channel, connect the live WebSocket socket, or simulate trigger events:
            </p>
          </div>

          <div className="flex items-center gap-2">
            {status === 'connected' ? (
              <button
                type="button"
                onClick={disconnectWs}
                className="px-4 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-semibold text-xs transition-all cursor-pointer"
              >
                Disconnect
              </button>
            ) : (
              <button
                type="button"
                onClick={connectWs}
                disabled={status === 'connecting'}
                className="px-4 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-xs transition-all cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
              >
                <Icon icon="ph:plugs-connected-bold" className="w-3.5 h-3.5" />
                <span>Connect Live WS</span>
              </button>
            )}
          </div>
        </div>

        {/* Topic Selectors */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {TOPICS.map((topic) => (
            <button
              key={topic.id}
              type="button"
              onClick={() => setActiveTopic(topic)}
              className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                activeTopic.id === topic.id
                  ? 'border-indigo-600 bg-indigo-50/60 shadow-xs ring-1 ring-indigo-500'
                  : 'border-slate-200 bg-slate-50/50 hover:border-slate-300 hover:bg-slate-50 shadow-2xs'
              }`}
            >
              <div>
                <div className="font-mono font-bold text-xs text-indigo-700 truncate">
                  {topic.name}
                </div>
                <div className="text-[11px] text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                  {topic.desc}
                </div>
              </div>
              <div className="mt-3 flex items-center gap-1 text-[11px] font-bold text-slate-600">
                <Icon icon="ph:broadcast-bold" className="w-3 h-3 text-indigo-500" />
                <span>Select Topic</span>
              </div>
            </button>
          ))}
        </div>

        {/* Terminal Header & Action Bar */}
        <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-xs">
          <div className="border-b border-slate-100 bg-slate-50/80 p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
            <div className="flex items-center gap-2 flex-wrap">
              <span
                className={`w-2 h-2 rounded-full ${
                  status === 'connected'
                    ? 'bg-emerald-500 animate-pulse'
                    : status === 'connecting'
                    ? 'bg-amber-500 animate-ping'
                    : 'bg-slate-300'
                }`}
              />
              <span className="font-mono text-xs font-bold text-slate-800">{getWsUrl()}</span>
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider ${
                  status === 'connected'
                    ? 'bg-emerald-100 text-emerald-800'
                    : status === 'connecting'
                    ? 'bg-amber-100 text-amber-800'
                    : 'bg-slate-100 text-slate-600'
                }`}
              >
                {status}
              </span>
            </div>

            <button
              type="button"
              onClick={handleSimulateEvent}
              className="px-3 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 self-start sm:self-auto"
            >
              <Icon icon="ph:sparkle-bold" className="w-3.5 h-3.5" />
              <span>Simulate Live Event Frame</span>
            </button>
          </div>

          {/* Terminal Event Stream */}
          <div className="p-4 bg-slate-900 min-h-[260px] max-h-[380px] overflow-y-auto space-y-2 font-mono text-xs text-slate-200">
            {logs.map((log) => (
              <div key={log.id} className="flex items-start gap-2 leading-relaxed">
                <span className="text-slate-500 text-[10px] shrink-0">[{log.time}]</span>
                <span
                  className={`px-1.5 py-0.2 rounded text-[10px] font-bold uppercase shrink-0 ${
                    log.type === 'event'
                      ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/60'
                      : log.type === 'ack'
                      ? 'bg-purple-950 text-purple-400 border border-purple-800/60'
                      : log.type === 'sent'
                      ? 'bg-blue-950 text-blue-400 border border-blue-800/60'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {log.topic}
                </span>
                <span className="text-slate-300 break-all">
                  {typeof log.payload === 'string' ? log.payload : JSON.stringify(log.payload)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 3. The graphql-ws Protocol Flow */}
      <div id="protocol-flow" className="space-y-4 scroll-mt-20">
        <div className="border-b border-slate-100 pb-3">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
            The graphql-ws Handshake Lifecycle
          </h2>
          <p className="text-sm text-slate-600">
            Playground API adheres to the official W3C subprotocol <code className="font-mono text-xs bg-slate-100 px-1 py-0.5 rounded text-indigo-600">graphql-transport-ws</code>:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl border border-slate-200 bg-white shadow-xs space-y-2">
            <span className="px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 font-mono text-[10px] font-bold uppercase">
              1. Handshake
            </span>
            <div className="font-bold text-xs sm:text-sm text-slate-900">connection_init</div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Client connects via WebSocket and transmits credentials in <code className="font-mono text-[11px] bg-slate-100 px-1 rounded">payload</code>.
            </p>
          </div>

          <div className="p-4 rounded-2xl border border-slate-200 bg-white shadow-xs space-y-2">
            <span className="px-2 py-0.5 rounded bg-purple-50 text-purple-700 font-mono text-[10px] font-bold uppercase">
              2. Acknowledgement
            </span>
            <div className="font-bold text-xs sm:text-sm text-slate-900">connection_ack</div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Gateway acknowledges the subprotocol and confirms readiness for subscription requests.
            </p>
          </div>

          <div className="p-4 rounded-2xl border border-slate-200 bg-white shadow-xs space-y-2">
            <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-mono text-[10px] font-bold uppercase">
              3. Registration
            </span>
            <div className="font-bold text-xs sm:text-sm text-slate-900">subscribe</div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Client sends subscription query document and assigns a unique client operation ID.
            </p>
          </div>

          <div className="p-4 rounded-2xl border border-slate-200 bg-white shadow-xs space-y-2">
            <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-mono text-[10px] font-bold uppercase">
              4. Streaming Push
            </span>
            <div className="font-bold text-xs sm:text-sm text-slate-900">next / complete</div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Server broadcasts mutation events matching the active channel in full JSON format.
            </p>
          </div>
        </div>
      </div>

      {/* 4. Supported Topics Reference Table */}
      <div id="supported-topics" className="space-y-4 scroll-mt-20">
        <div className="border-b border-slate-100 pb-3">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
            Supported Subscription Topics
          </h2>
          <p className="text-sm text-slate-600">
            Pre-configured subscription channels available on the Playground API GraphQL gateway:
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/80 text-[11px] font-bold uppercase tracking-wider text-slate-600">
                  <th className="py-3 px-4">Topic Name</th>
                  <th className="py-3 px-4">Filter Parameters</th>
                  <th className="py-3 px-4">Trigger Action</th>
                  <th className="py-3 px-4">Emitted Entity</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
                <tr className="hover:bg-slate-50/50">
                  <td className="py-3 px-4 font-mono font-bold text-indigo-700">postAdded</td>
                  <td className="py-3 px-4 text-slate-500 italic text-xs">None (Global stream)</td>
                  <td className="py-3 px-4 text-slate-600 text-xs">Fires whenever any new post is created via REST or GraphQL mutation.</td>
                  <td className="py-3 px-4 font-mono text-indigo-600 text-xs">Post</td>
                </tr>
                <tr className="hover:bg-slate-50/50">
                  <td className="py-3 px-4 font-mono font-bold text-indigo-700">commentAdded</td>
                  <td className="py-3 px-4 font-mono text-slate-600 text-xs">postId / post_id: ID</td>
                  <td className="py-3 px-4 text-slate-600 text-xs">Fires when a comment is attached to a post (filterable by target postId).</td>
                  <td className="py-3 px-4 font-mono text-indigo-600 text-xs">Comment</td>
                </tr>
                <tr className="hover:bg-slate-50/50">
                  <td className="py-3 px-4 font-mono font-bold text-indigo-700">todoUpdated</td>
                  <td className="py-3 px-4 font-mono text-slate-600 text-xs">userId / user_id: ID</td>
                  <td className="py-3 px-4 text-slate-600 text-xs">Fires on checklist task creation, title change, or completion status toggles.</td>
                  <td className="py-3 px-4 font-mono text-indigo-600 text-xs">Todo</td>
                </tr>
                <tr className="hover:bg-slate-50/50">
                  <td className="py-3 px-4 font-mono font-bold text-indigo-700">customRecordMutated</td>
                  <td className="py-3 px-4 font-mono text-slate-600 text-xs">collection: String</td>
                  <td className="py-3 px-4 text-slate-600 text-xs">Streams real-time updates across dynamic developer custom collections.</td>
                  <td className="py-3 px-4 font-mono text-indigo-600 text-xs">CustomRecord</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* 5. Production Integration Recipes */}
      <div id="client-recipes" className="space-y-4 scroll-mt-20">
        <div className="border-b border-slate-100 pb-3">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
            Client Integration Recipes
          </h2>
          <p className="text-sm text-slate-600">
            Recommended implementations for full-duplex GraphQL WebSocket subscriptions:
          </p>
        </div>

        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            {[
              { id: 'apollo', label: 'Apollo Client (Split Link)', icon: 'ph:atom-bold' },
              { id: 'graphqlWs', label: 'Standalone graphql-ws', icon: 'ph:plugs-connected-bold' },
              { id: 'reactHook', label: 'React 19 Custom Hook', icon: 'ph:code-bold' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveRecipe(tab.id as any)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                  activeRecipe === tab.id
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <Icon icon={tab.icon} className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          <CodeBlock
            code={
              activeRecipe === 'apollo'
                ? apolloRecipe
                : activeRecipe === 'graphqlWs'
                ? graphqlWsRecipe
                : reactHookRecipe
            }
            language="typescript"
            title={`subscriptionLink.${activeRecipe === 'reactHook' ? 'tsx' : 'ts'}`}
            copyable
          />
        </div>
      </div>
    </div>
  );
}
