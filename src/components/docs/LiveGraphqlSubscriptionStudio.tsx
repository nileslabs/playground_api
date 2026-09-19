'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Icon } from '@iconify/react';
import config from '@/config/env';

interface SubscriptionTemplate {
  id: string;
  name: string;
  description: string;
  query: string;
  variables?: string;
  triggerAction: {
    name: string;
    endpoint: string;
    method: string;
    body: Record<string, unknown>;
  };
}

const TEMPLATES: SubscriptionTemplate[] = [
  {
    id: 'post-added',
    name: 'Post Added (postAdded)',
    description: 'Listen for new posts created via REST POST /posts or GraphQL mutation createPost.',
    query: `subscription OnPostAdded {
  postAdded {
    id
    title
    body
    user_id
  }
}`,
    triggerAction: {
      name: 'Create Post via REST',
      endpoint: '/posts',
      method: 'POST',
      body: {
        title: 'Real-Time Reactive Post',
        body: 'Dispatched from subscription studio — observed via WebSocket in real time!',
        user_id: 1,
      },
    },
  },
  {
    id: 'comment-added',
    name: 'Comment Added (commentAdded)',
    description: 'Listen for new comments added to a specific post.',
    query: `subscription OnCommentAdded($postId: ID) {
  commentAdded(postId: $postId) {
    id
    post_id
    name
    email
    body
  }
}`,
    variables: JSON.stringify({ postId: 1 }, null, 2),
    triggerAction: {
      name: 'Add Comment to Post 1',
      endpoint: '/comments',
      method: 'POST',
      body: {
        post_id: 1,
        name: 'Live Feedback User',
        email: 'feedback@example.com',
        body: 'GraphQL subscriptions make reactive client sync effortless!',
      },
    },
  },
  {
    id: 'todo-updated',
    name: 'Todo Created or Updated (todoUpdated)',
    description: 'Listen for user todo items created, toggled, or modified.',
    query: `subscription OnTodoUpdated {
  todoUpdated {
    id
    title
    completed
    user_id
  }
}`,
    triggerAction: {
      name: 'Create New Todo Item',
      endpoint: '/todos',
      method: 'POST',
      body: {
        title: 'Deploy reactive GraphQL subscriptions to production',
        completed: false,
        user_id: 1,
      },
    },
  },
  {
    id: 'custom-record',
    name: 'Custom Record Mutated (customRecordMutated)',
    description: 'Listen for ad-hoc custom collection entities created in the sandbox.',
    query: `subscription OnCustomMutated($collection: String!) {
  customRecordMutated(collection: $collection) {
    id
    collection
    data
    created_at
  }
}`,
    variables: JSON.stringify({ collection: 'products' }, null, 2),
    triggerAction: {
      name: 'Create Custom Product Entity',
      endpoint: '/custom/products',
      method: 'POST',
      body: {
        name: 'Mechanical Keyboard (RGB)',
        price: 149.99,
        category: 'electronics',
        stock: 24,
      },
    },
  },
];

interface LogEvent {
  id: string;
  timestamp: string;
  type: 'incoming' | 'system' | 'error' | 'trigger';
  data: unknown;
}

export function LiveGraphqlSubscriptionStudio() {
  const [selectedTemplate, setSelectedTemplate] = useState<SubscriptionTemplate>(TEMPLATES[0]);
  const [queryText, setQueryText] = useState(TEMPLATES[0].query);
  const [variablesText, setVariablesText] = useState(TEMPLATES[0].variables || '');
  const [connectionStatus, setConnectionStatus] = useState<'disconnected' | 'connecting' | 'connected'>('disconnected');
  const [eventLogs, setEventLogs] = useState<LogEvent[]>([]);
  const [isTriggering, setIsTriggering] = useState(false);
  const [triggerCount, setTriggerCount] = useState(0);

  const wsRef = useRef<WebSocket | null>(null);
  const subIdRef = useRef<string>('sub-1');
  const logsEndRef = useRef<HTMLDivElement | null>(null);

  const apiUrl = config.apiUrl;
  const wsBaseUrl = apiUrl.replace(/^http/, 'ws') + '/graphql';

  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [eventLogs]);

  const addLog = (type: LogEvent['type'], data: unknown) => {
    setEventLogs((prev) => [
      ...prev.slice(-49), // Keep last 50 events
      {
        id: Math.random().toString(36).substring(2, 9),
        timestamp: new Date().toLocaleTimeString(),
        type,
        data,
      },
    ]);
  };

  const handleSelectTemplate = (template: SubscriptionTemplate) => {
    setSelectedTemplate(template);
    setQueryText(template.query);
    setVariablesText(template.variables || '');
    if (connectionStatus === 'connected') {
      disconnect();
    }
  };

  const connectAndSubscribe = () => {
    if (wsRef.current) {
      disconnect();
    }

    setConnectionStatus('connecting');
    addLog('system', `Connecting to WebSocket at ${wsBaseUrl}...`);

    try {
      const ws = new WebSocket(wsBaseUrl, 'graphql-transport-ws');
      wsRef.current = ws;

      const currentSubId = `sub_${Date.now()}`;
      subIdRef.current = currentSubId;

      ws.onopen = () => {
        addLog('system', 'WebSocket connection open. Sending connection_init...');
        ws.send(
          JSON.stringify({
            type: 'connection_init',
            payload: {},
          })
        );
      };

      ws.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data);
          if (msg.type === 'connection_ack') {
            setConnectionStatus('connected');
            addLog('system', 'Connection acknowledged! Dispatching subscription query...');

            let parsedVariables: Record<string, unknown> | undefined;
            if (variablesText.trim()) {
              try {
                parsedVariables = JSON.parse(variablesText);
              } catch (_) {}
            }

            ws.send(
              JSON.stringify({
                id: currentSubId,
                type: 'subscribe',
                payload: {
                  query: queryText,
                  variables: parsedVariables,
                },
              })
            );
          } else if (msg.type === 'next' && msg.id === currentSubId) {
            addLog('incoming', msg.payload);
          } else if (msg.type === 'error') {
            addLog('error', msg.payload);
          } else if (msg.type === 'complete') {
            addLog('system', 'Subscription completed by server.');
          }
        } catch (err) {
          addLog('error', `Message parsing error: ${String(err)}`);
        }
      };

      ws.onerror = (err) => {
        addLog('error', 'WebSocket encounter an error event.');
        setConnectionStatus('disconnected');
      };

      ws.onclose = () => {
        addLog('system', 'WebSocket connection closed.');
        setConnectionStatus('disconnected');
        wsRef.current = null;
      };
    } catch (e) {
      addLog('error', `Failed to open WebSocket: ${String(e)}`);
      setConnectionStatus('disconnected');
    }
  };

  const disconnect = () => {
    if (wsRef.current) {
      if (wsRef.current.readyState === WebSocket.OPEN) {
        try {
          wsRef.current.send(JSON.stringify({ id: subIdRef.current, type: 'complete' }));
          wsRef.current.close();
        } catch (_) {}
      }
      wsRef.current = null;
    }
    setConnectionStatus('disconnected');
  };

  const handleTriggerMutation = async () => {
    setIsTriggering(true);
    const trigger = selectedTemplate.triggerAction;
    addLog('trigger', `Dispatching trigger ${trigger.method} ${trigger.endpoint}...`);

    try {
      const res = await fetch(`${apiUrl}${trigger.endpoint}`, {
        method: trigger.method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...trigger.body,
          title: trigger.body.title ? `${trigger.body.title} (#${triggerCount + 1})` : undefined,
        }),
      });

      const data = await res.json();
      setTriggerCount((c) => c + 1);
      addLog('trigger', {
        status: res.status,
        message: 'Mutation dispatched successfully! Watch for incoming subscription event above.',
        response: data,
      });
    } catch (err) {
      addLog('error', `Trigger failed: ${String(err)}`);
    } finally {
      setIsTriggering(false);
    }
  };

  useEffect(() => {
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []);

  return (
    <div className="w-full space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-pink-500/10 text-pink-500">
              <Icon icon="simple-icons:graphql" className="w-5 h-5" />
            </span>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Live GraphQL Subscription Studio
            </h2>
            <span className="px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider rounded-full bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300">
              graphql-ws
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Connect over RFC-compliant WebSocket transport and watch reactive data streams in real time.
          </p>
        </div>

        {/* Status Indicator & Main Button */}
        <div className="flex items-center gap-3 self-end sm:self-auto">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs font-medium">
            <span
              className={`w-2 h-2 rounded-full ${
                connectionStatus === 'connected'
                  ? 'bg-emerald-500 shadow-sm shadow-emerald-500/50 animate-pulse'
                  : connectionStatus === 'connecting'
                  ? 'bg-amber-500 animate-ping'
                  : 'bg-slate-400'
              }`}
            />
            <span className="text-slate-700 dark:text-slate-300 capitalize">
              {connectionStatus === 'connected'
                ? 'Listening (Live WS)'
                : connectionStatus === 'connecting'
                ? 'Handshaking...'
                : 'Disconnected'}
            </span>
          </div>

          {connectionStatus === 'connected' ? (
            <button
              onClick={disconnect}
              className="px-4 py-1.5 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-lg border border-rose-200 dark:border-rose-900 transition-colors flex items-center gap-1.5"
            >
              <Icon icon="lucide:power-off" className="w-3.5 h-3.5" />
              Disconnect
            </button>
          ) : (
            <button
              onClick={connectAndSubscribe}
              disabled={connectionStatus === 'connecting'}
              className="px-4 py-1.5 text-xs font-semibold text-white bg-pink-600 hover:bg-pink-700 disabled:opacity-50 rounded-lg shadow-sm shadow-pink-600/20 transition-all flex items-center gap-1.5"
            >
              <Icon icon="lucide:play" className="w-3.5 h-3.5" />
              Connect &amp; Subscribe
            </button>
          )}
        </div>
      </div>

      {/* Preset Selector */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {TEMPLATES.map((tmpl) => (
          <button
            key={tmpl.id}
            onClick={() => handleSelectTemplate(tmpl)}
            className={`p-3 text-left rounded-xl border text-xs font-medium transition-all ${
              selectedTemplate.id === tmpl.id
                ? 'border-pink-500 bg-pink-50/50 dark:bg-pink-950/20 text-pink-700 dark:text-pink-300 ring-1 ring-pink-500'
                : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700'
            }`}
          >
            <div className="font-semibold text-slate-900 dark:text-white truncate">{tmpl.name}</div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
              {tmpl.triggerAction.name}
            </div>
          </button>
        ))}
      </div>

      {/* Main Studio Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Query & Variables Editor */}
        <div className="lg:col-span-6 space-y-4">
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-sm">
            <div className="flex items-center justify-between px-4 py-2.5 bg-slate-50/80 dark:bg-slate-950/80 border-b border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300">
              <span className="flex items-center gap-1.5">
                <Icon icon="lucide:terminal-square" className="w-4 h-4 text-pink-500" />
                Subscription Document (SDL)
              </span>
              <span className="font-mono text-[11px] text-slate-400">ws://.../graphql</span>
            </div>
            <div className="p-3">
              <textarea
                value={queryText}
                onChange={(e) => setQueryText(e.target.value)}
                rows={9}
                className="w-full font-mono text-xs p-3 rounded-lg bg-slate-950 text-slate-100 border border-slate-800 focus:outline-none focus:ring-1 focus:ring-pink-500 resize-none leading-relaxed"
                spellCheck={false}
              />
            </div>
          </div>

          {/* Variables input */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-sm">
            <div className="flex items-center justify-between px-4 py-2 bg-slate-50/80 dark:bg-slate-950/80 border-b border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300">
              <span>Query Variables (JSON)</span>
            </div>
            <div className="p-3">
              <textarea
                value={variablesText}
                onChange={(e) => setVariablesText(e.target.value)}
                placeholder="{}"
                rows={3}
                className="w-full font-mono text-xs p-2.5 rounded-lg bg-slate-950 text-slate-100 border border-slate-800 focus:outline-none focus:ring-1 focus:ring-pink-500 resize-none"
                spellCheck={false}
              />
            </div>
          </div>

          {/* Quick Action Trigger Box */}
          <div className="p-4 rounded-2xl border border-indigo-200 dark:border-indigo-900/60 bg-linear-to-br from-indigo-50/60 to-purple-50/60 dark:from-indigo-950/20 dark:to-purple-950/20 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="p-1 rounded-md bg-indigo-600 text-white">
                  <Icon icon="lucide:zap" className="w-3.5 h-3.5" />
                </span>
                <span className="text-xs font-bold text-slate-900 dark:text-white">
                  Simulate Live Mutation
                </span>
              </div>
              <span className="text-[11px] font-mono text-indigo-600 dark:text-indigo-400">
                {selectedTemplate.triggerAction.method} {selectedTemplate.triggerAction.endpoint}
              </span>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300">
              Trigger a real database mutation in your session sandbox. The server will immediately publish an event through the GraphQL WebSocket connection.
            </p>

            <button
              onClick={handleTriggerMutation}
              disabled={isTriggering}
              className="w-full py-2 px-4 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 transition-all flex items-center justify-center gap-2 shadow-sm shadow-indigo-600/20"
            >
              {isTriggering ? (
                <Icon icon="lucide:loader-2" className="w-4 h-4 animate-spin" />
              ) : (
                <Icon icon="lucide:sparkles" className="w-4 h-4" />
              )}
              {selectedTemplate.triggerAction.name}
            </button>
          </div>
        </div>

        {/* Right: Live Event Stream Terminal */}
        <div className="lg:col-span-6 flex flex-col rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-950 overflow-hidden shadow-lg h-115">
          {/* Terminal Top Bar */}
          <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900 border-b border-slate-800 text-xs">
            <div className="flex items-center gap-2 text-slate-300 font-semibold">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block" />
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
              <span className="font-mono text-xs text-slate-400 ml-1">Live Event Stream</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 text-[10px] font-mono rounded bg-slate-800 text-slate-400">
                {eventLogs.filter((e) => e.type === 'incoming').length} events
              </span>
              <button
                onClick={() => setEventLogs([])}
                className="p-1 text-slate-400 hover:text-white transition-colors"
                title="Clear logs"
              >
                <Icon icon="lucide:trash-2" className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Event Stream Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 font-mono text-xs">
            {eventLogs.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-600 space-y-2 py-16">
                <Icon icon="lucide:radio" className="w-8 h-8 opacity-40 animate-pulse" />
                <p className="text-xs">No events captured yet.</p>
                <p className="text-[11px] text-slate-600 text-center max-w-xs">
                  Click &ldquo;Connect &amp; Subscribe&rdquo; and trigger a mutation to observe real-time data flow.
                </p>
              </div>
            ) : (
              eventLogs.map((log) => (
                <div
                  key={log.id}
                  className={`p-3 rounded-lg border text-[11px] space-y-1 transition-all ${
                    log.type === 'incoming'
                      ? 'border-emerald-500/30 bg-emerald-950/20 text-emerald-300'
                      : log.type === 'trigger'
                      ? 'border-indigo-500/30 bg-indigo-950/20 text-indigo-300'
                      : log.type === 'error'
                      ? 'border-rose-500/30 bg-rose-950/20 text-rose-300'
                      : 'border-slate-800 bg-slate-900/50 text-slate-400'
                  }`}
                >
                  <div className="flex items-center justify-between text-[10px] text-slate-500">
                    <span className="uppercase font-bold tracking-wider">
                      {log.type === 'incoming' ? '🟢 Push Event Received' : log.type.toUpperCase()}
                    </span>
                    <span>{log.timestamp}</span>
                  </div>
                  <pre className="overflow-x-auto whitespace-pre-wrap leading-relaxed text-slate-200">
                    {typeof log.data === 'string' ? log.data : JSON.stringify(log.data, null, 2)}
                  </pre>
                </div>
              ))
            )}
            <div ref={logsEndRef} />
          </div>
        </div>
      </div>
    </div>
  );
}
