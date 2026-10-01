'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Icon } from '@iconify/react';
import config from '@/config/env';
import { CodeBlock } from '@/components/ui/CodeBlock';

interface SseLogEvent {
  id: string;
  type: string;
  data: string;
  time: string;
}

export default function SseNotificationsPage() {
  const [status, setStatus] = useState<'disconnected' | 'connecting' | 'connected'>('disconnected');
  const [events, setEvents] = useState<SseLogEvent[]>([
    {
      id: 'init-1',
      type: 'system',
      data: 'SSE terminal initialized. Click "Connect SSE Stream" to establish an HTTP persistent event stream.',
      time: '12:00:00',
    },
  ]);
  const [includeSamples, setIncludeSamples] = useState(true);
  const esRef = useRef<EventSource | null>(null);

  const streamUrl = `${config.apiUrl}/stream/notifications${includeSamples ? '?samples=true' : '?samples=false'}`;

  const connectSse = () => {
    if (esRef.current) return;

    setStatus('connecting');
    try {
      const es = new EventSource(streamUrl, { withCredentials: true });
      esRef.current = es;

      es.onopen = () => {
        setStatus('connected');
        setEvents((prev) => [
          ...prev,
          {
            id: `init-${Date.now()}`,
            type: 'connected',
            data: 'HTTP 200 Stream opened (Content-Type: text/event-stream). Heartbeats every 15s.',
            time: new Date().toLocaleTimeString(),
          },
        ]);
      };

      es.addEventListener('connected', (e: any) => {
        setEvents((prev) => [
          ...prev,
          {
            id: `evt-${Date.now()}`,
            type: 'connected',
            data: e.data,
            time: new Date().toLocaleTimeString(),
          },
        ]);
      });

      es.addEventListener('notification', (e: any) => {
        setEvents((prev) => [
          ...prev,
          {
            id: `notif-${Date.now()}`,
            type: 'notification',
            data: e.data,
            time: new Date().toLocaleTimeString(),
          },
        ]);
      });

      es.onmessage = (e) => {
        setEvents((prev) => [
          ...prev,
          {
            id: `msg-${Date.now()}`,
            type: 'message',
            data: e.data,
            time: new Date().toLocaleTimeString(),
          },
        ]);
      };

      es.onerror = () => {
        setStatus('disconnected');
      };
    } catch {
      setStatus('disconnected');
    }
  };

  const disconnectSse = () => {
    if (esRef.current) {
      esRef.current.close();
      esRef.current = null;
    }
    setStatus('disconnected');
    setEvents((prev) => [
      ...prev,
      {
        id: `close-${Date.now()}`,
        type: 'system',
        data: 'SSE connection closed.',
        time: new Date().toLocaleTimeString(),
      },
    ]);
  };

  useEffect(() => {
    return () => {
      if (esRef.current) esRef.current.close();
    };
  }, []);

  const vanillaSseSnippet = `// Client Integration using Native Browser EventSource
const streamUrl = '${config.apiUrl}/stream/notifications?samples=true';
const eventSource = new EventSource(streamUrl, { withCredentials: true });

// 1. Connection opened
eventSource.onopen = () => {
  console.log('SSE connection established');
};

// 2. Listen for custom typed events
eventSource.addEventListener('notification', (event) => {
  const payload = JSON.parse(event.data);
  console.log('New notification received:', payload);
});

// 3. Listen for general messages
eventSource.onmessage = (event) => {
  console.log('Message event:', event.data);
};

// 4. Handle errors & auto-reconnect
eventSource.onerror = (err) => {
  console.error('SSE Error:', err);
};`;

  const reactHookSnippet = `// React 19 Custom Server-Sent Events Hook
import { useState, useEffect, useRef } from 'react';

export function useServerSentEvents(url: string) {
  const [events, setEvents] = useState<any[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const esRef = useRef<EventSource | null>(null);

  useEffect(() => {
    const es = new EventSource(url, { withCredentials: true });
    esRef.current = es;

    es.onopen = () => setIsConnected(true);

    es.addEventListener('notification', (e) => {
      try {
        const parsed = JSON.parse(e.data);
        setEvents((prev) => [parsed, ...prev]);
      } catch {
        setEvents((prev) => [{ text: e.data }, ...prev]);
      }
    });

    es.onerror = () => setIsConnected(false);

    return () => {
      es.close();
    };
  }, [url]);

  return { events, isConnected };
}`;

  const curlSnippet = `# Connect and stream SSE events via cURL CLI
curl -N -i -H "Accept: text/event-stream" \\
  "${config.apiUrl}/stream/notifications?samples=true"`;

  return (
    <div className="space-y-12 w-full text-slate-900">
      {/* 1. Header with Eyebrow Badge */}
      <div id="overview" className="space-y-4 scroll-mt-20">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold uppercase tracking-wider border border-indigo-200">
          <Icon icon="ph:stream-bold" className="w-3.5 h-3.5" />
          <span>Realtime &amp; WebSockets</span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-[1.15]">
          Server-Sent Events (SSE) Stream
        </h1>

        <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-3xl">
          Lightweight, HTTP-based unidirectional streaming. Subscribe to live server notifications, background task updates, and automated heartbeats using the native browser <code className="font-mono text-xs bg-slate-100 px-1.5 py-0.5 rounded text-indigo-600 font-bold">EventSource</code> API over standard HTTP/1.1 or HTTP/2 without custom socket libraries.
        </p>
      </div>

      {/* 2. Interactive SSE Event Stream Reader */}
      <div id="sse-workbench" className="rounded-2xl border border-slate-200 bg-white shadow-xs overflow-hidden scroll-mt-20">
        {/* Stream Header */}
        <div className="border-b border-slate-100 bg-slate-50/70 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span
              className={`w-3 h-3 rounded-full ${
                status === 'connected'
                  ? 'bg-emerald-500 animate-pulse'
                  : status === 'connecting'
                  ? 'bg-amber-500 animate-spin'
                  : 'bg-slate-300'
              }`}
            />
            <span className="font-mono text-xs font-bold text-slate-800 break-all">{streamUrl}</span>
            <span
              className={`px-2 py-0.5 rounded text-[11px] font-semibold uppercase tracking-wider ${
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

          <div className="flex items-center gap-2">
            {status === 'connected' ? (
              <button
                type="button"
                onClick={disconnectSse}
                className="px-4 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-semibold text-xs transition-all cursor-pointer"
              >
                Disconnect Stream
              </button>
            ) : (
              <button
                type="button"
                onClick={connectSse}
                disabled={status === 'connecting'}
                className="px-4 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-xs transition-all cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
              >
                <Icon icon="ph:play-bold" className="w-3.5 h-3.5" />
                <span>Connect SSE Stream</span>
              </button>
            )}
          </div>
        </div>

        {/* Options Bar */}
        <div className="p-3 bg-slate-50/40 border-b border-slate-100 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="text-slate-500 font-medium">Auto-emit mock notifications (every 8s):</span>
            <button
              type="button"
              onClick={() => setIncludeSamples(!includeSamples)}
              className={`px-2.5 py-0.5 rounded text-[11px] font-semibold transition-all cursor-pointer ${
                includeSamples
                  ? 'bg-indigo-100 text-indigo-800 border border-indigo-200'
                  : 'bg-slate-100 text-slate-600 border border-slate-200'
              }`}
            >
              {includeSamples ? 'Enabled (?samples=true)' : 'Disabled (?samples=false)'}
            </button>
          </div>
          <span className="text-[11px] text-slate-400 font-mono hidden sm:inline">
            Keepalive: : ping every 15s
          </span>
        </div>

        {/* Stream Event Terminal */}
        <div className="p-4 bg-slate-900 min-h-70 max-h-95 overflow-y-auto space-y-2 font-mono text-xs">
          {events.map((ev) => (
            <div key={ev.id} className="flex items-start gap-2 leading-relaxed">
              <span className="text-slate-500 text-[10px] shrink-0">[{ev.time}]</span>
              <span
                className={`font-bold shrink-0 ${
                  ev.type === 'connected'
                    ? 'text-emerald-400'
                    : ev.type === 'notification'
                    ? 'text-indigo-400'
                    : 'text-amber-400'
                }`}
              >
                [{ev.type}]:
              </span>
              <span className="text-slate-200 break-all">{ev.data}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 3. SSE Protocol Headers Reference Table */}
      <div id="protocol-headers" className="space-y-4 scroll-mt-20">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
          SSE Protocol Headers Reference
        </h2>
        <p className="text-sm text-slate-600">
          The stream endpoint sends the following HTTP response headers to keep connections persistently open:
        </p>

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 border-b border-slate-200 text-xs uppercase tracking-wider text-slate-700 font-bold">
                <tr>
                  <th className="py-3.5 px-4">Header</th>
                  <th className="py-3.5 px-4">Value</th>
                  <th className="py-3.5 px-4">Purpose</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
                <tr className="hover:bg-slate-50/50">
                  <td className="py-3.5 px-4 font-mono text-xs font-bold text-indigo-700">Content-Type</td>
                  <td className="py-3.5 px-4 font-mono text-xs text-slate-800">text/event-stream</td>
                  <td className="py-3.5 px-4 text-slate-600 text-xs">Identifies payload as EventSource stream format.</td>
                </tr>
                <tr className="hover:bg-slate-50/50">
                  <td className="py-3.5 px-4 font-mono text-xs font-bold text-indigo-700">Cache-Control</td>
                  <td className="py-3.5 px-4 font-mono text-xs text-slate-800">no-cache, no-transform</td>
                  <td className="py-3.5 px-4 text-slate-600 text-xs">Prevents intermediate proxies and CDNs from buffering chunks.</td>
                </tr>
                <tr className="hover:bg-slate-50/50">
                  <td className="py-3.5 px-4 font-mono text-xs font-bold text-indigo-700">Connection</td>
                  <td className="py-3.5 px-4 font-mono text-xs text-slate-800">keep-alive</td>
                  <td className="py-3.5 px-4 text-slate-600 text-xs">Maintains persistent long-lived TCP connection.</td>
                </tr>
                <tr className="hover:bg-slate-50/50">
                  <td className="py-3.5 px-4 font-mono text-xs font-bold text-indigo-700">X-Accel-Buffering</td>
                  <td className="py-3.5 px-4 font-mono text-xs text-slate-800">no</td>
                  <td className="py-3.5 px-4 text-slate-600 text-xs">Instructs Nginx reverse proxies to stream chunks immediately.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* 4. Client Integration Recipes */}
      <div id="code-recipes" className="space-y-4 scroll-mt-20">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
          Client Integration Code
        </h2>
        <p className="text-sm text-slate-600">
          Production examples for native browser EventSource, React hooks, and cURL:
        </p>

        <CodeBlock
          tabs={[
            {
              id: 'vanilla',
              label: 'Vanilla JS (EventSource)',
              icon: 'simple-icons:javascript',
              language: 'javascript',
              code: vanillaSseSnippet,
            },
            {
              id: 'react',
              label: 'React Hook (useServerSentEvents)',
              icon: 'simple-icons:react',
              language: 'typescript',
              code: reactHookSnippet,
            },
            {
              id: 'curl',
              label: 'cURL Terminal Stream',
              icon: 'ph:terminal-window-bold',
              language: 'bash',
              code: curlSnippet,
            },
          ]}
          defaultTab="vanilla"
          showHeader={true}
          copyable={true}
          initialWrap={true}
        />
      </div>

      {/* 5. SSE vs WebSockets Comparison Matrix */}
      <div id="comparison-matrix" className="space-y-4 scroll-mt-20">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
          Server-Sent Events vs WebSockets
        </h2>
        <p className="text-sm text-slate-600">
          When to choose Server-Sent Events over WebSockets for application architecture:
        </p>

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 border-b border-slate-200 text-xs uppercase tracking-wider text-slate-700 font-bold">
                <tr>
                  <th className="py-3.5 px-4">Capability</th>
                  <th className="py-3.5 px-4">Server-Sent Events (SSE)</th>
                  <th className="py-3.5 px-4">WebSockets (WS)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
                <tr className="hover:bg-slate-50/50">
                  <td className="py-3.5 px-4 font-bold text-slate-900">Communication Direction</td>
                  <td className="py-3.5 px-4 text-xs font-semibold text-indigo-700">Unidirectional (Server → Client)</td>
                  <td className="py-3.5 px-4 text-xs font-semibold text-emerald-700">Full-duplex bidirectional</td>
                </tr>
                <tr className="hover:bg-slate-50/50">
                  <td className="py-3.5 px-4 font-bold text-slate-900">Transport Layer</td>
                  <td className="py-3.5 px-4 text-xs font-semibold text-emerald-700">Standard HTTP/1.1 or HTTP/2</td>
                  <td className="py-3.5 px-4 text-xs">TCP upgrade to WebSocket protocol</td>
                </tr>
                <tr className="hover:bg-slate-50/50">
                  <td className="py-3.5 px-4 font-bold text-slate-900">Automatic Reconnection</td>
                  <td className="py-3.5 px-4 text-xs font-semibold text-emerald-700">Native browser auto-retry</td>
                  <td className="py-3.5 px-4 text-xs">Custom application retry required</td>
                </tr>
                <tr className="hover:bg-slate-50/50">
                  <td className="py-3.5 px-4 font-bold text-slate-900">Firewall / Proxy Traversal</td>
                  <td className="py-3.5 px-4 text-xs font-semibold text-emerald-700">Seamless (Standard HTTP GET)</td>
                  <td className="py-3.5 px-4 text-xs">Requires WebSocket proxy support</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
