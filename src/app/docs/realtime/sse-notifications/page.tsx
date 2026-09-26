'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Icon } from '@iconify/react';
import config from '@/config/env';

interface SseEvent {
  id: string;
  type: string;
  data: string;
  time: string;
}

export default function SseNotificationsPage() {
  const [status, setStatus] = useState<'disconnected' | 'connected'>('disconnected');
  const [events, setEvents] = useState<SseEvent[]>([]);
  const esRef = useRef<EventSource | null>(null);

  const streamUrl = `${config.apiUrl}/stream/notifications`;

  const connectSse = () => {
    if (esRef.current) return;

    try {
      const es = new EventSource(streamUrl, { withCredentials: true });
      esRef.current = es;

      es.onopen = () => {
        setStatus('connected');
        setEvents((prev) => [
          ...prev,
          {
            id: 'init',
            type: 'system',
            data: 'SSE connection opened to /stream/notifications',
            time: new Date().toLocaleTimeString(),
          },
        ]);
      };

      es.onmessage = (e) => {
        setEvents((prev) => [
          ...prev,
          {
            id: String(Date.now()),
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
  };

  useEffect(() => {
    return () => {
      if (esRef.current) esRef.current.close();
    };
  }, []);

  return (
    <div className="space-y-12 w-full text-slate-900">
      {/* 1. Header */}
      <div id="overview" className="space-y-4 scroll-mt-20">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold uppercase tracking-wider border border-indigo-100">
          <Icon icon="ph:stream-bold" className="w-3.5 h-3.5" />
          <span>Realtime & WebSockets</span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-[1.15]">
          Server-Sent Events (SSE) Stream
        </h1>

        <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-3xl">
          Lightweight, HTTP-based unidirectional streaming. Subscribe to live server notifications, background task updates, and automated heartbeats using the native browser <code className="font-mono text-xs bg-slate-100 px-1 py-0.5 rounded text-indigo-600">EventSource</code> API.
        </p>
      </div>

      {/* 2. Interactive SSE Event Stream Reader */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-xs overflow-hidden">
        <div className="border-b border-slate-100 bg-slate-50/70 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span
              className={`w-3 h-3 rounded-full ${
                status === 'connected' ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'
              }`}
            />
            <span className="font-mono text-xs font-bold text-slate-800">{streamUrl}</span>
          </div>

          <div className="flex items-center gap-2">
            {status === 'connected' ? (
              <button
                type="button"
                onClick={disconnectSse}
                className="px-3.5 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-semibold text-xs transition-all cursor-pointer"
              >
                Disconnect Stream
              </button>
            ) : (
              <button
                type="button"
                onClick={connectSse}
                className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-xs transition-all cursor-pointer"
              >
                Listen to Stream
              </button>
            )}
          </div>
        </div>

        {/* Live SSE Event Log */}
        <div className="p-4 bg-slate-900 min-h-[260px] max-h-[340px] overflow-y-auto space-y-2 font-mono text-xs">
          {events.length === 0 ? (
            <div className="text-center py-16 text-slate-500">
              Click &quot;Listen to Stream&quot; to subscribe to live server events.
            </div>
          ) : (
            events.map((ev, idx) => (
              <div key={idx} className="flex items-start gap-2">
                <span className="text-slate-500 text-[10px]">[{ev.time}]</span>
                <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-indigo-900 text-indigo-300 uppercase">
                  {ev.type}
                </span>
                <span className="text-slate-200">{ev.data}</span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* 3. EventSource Integration Code */}
      <div id="code-snippet" className="space-y-4 scroll-mt-20">
        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
          Client Integration Code
        </h2>
        <div className="rounded-2xl border border-slate-200 bg-slate-900 p-5 shadow-inner">
          <pre className="font-mono text-xs sm:text-sm text-slate-100 overflow-x-auto leading-relaxed">
{`const evtSource = new EventSource('${streamUrl}', { withCredentials: true });

evtSource.onmessage = (event) => {
  const data = JSON.parse(event.data);
  console.log('New notification:', data);
};

evtSource.onerror = (err) => {
  console.error('SSE connection error:', err);
};`}
          </pre>
        </div>
      </div>
    </div>
  );
}
