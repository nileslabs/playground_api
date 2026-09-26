'use client';

import React from 'react';
import { Icon } from '@iconify/react';
import config from '@/config/env';

export default function SocketIoPage() {
  const publicApiUrl = config.publicApiUrl || 'https://playground.nileslabs.com/api/v1';
  const serverUrl = (config.apiUrl || 'http://localhost:5000/api/v1').replace('/api/v1', '');

  const reactSnippet = `import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

export function ChatComponent() {
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    // 1. Connect with session credentials
    const s = io('${serverUrl}', {
      withCredentials: true,
      transports: ['websocket', 'polling'],
    });

    s.on('connect', () => {
      console.log('Connected via Socket.io:', s.id);
      s.emit('join', { room: 'demo-chat' });
    });

    s.on('message', (data) => {
      setMessages((prev) => [...prev, data]);
    });

    setSocket(s);
    return () => s.disconnect();
  }, []);

  const sendMsg = (text) => {
    socket?.emit('chat', { room: 'demo-chat', text });
  };

  return <div>{/* Render chat */}</div>;
}`;

  return (
    <div className="space-y-12 w-full text-slate-900">
      {/* 1. Header */}
      <div id="overview" className="space-y-4 scroll-mt-20">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold uppercase tracking-wider border border-indigo-100">
          <Icon icon="ph:network-bold" className="w-3.5 h-3.5" />
          <span>Realtime & WebSockets</span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-[1.15]">
          Socket.io Gateway & Event Bus
        </h1>

        <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-3xl">
          Integrate with the built-in Socket.io server. Features automatic fallback to HTTP long-polling, room multiplexing, automated heartbeat reconnection, and broadcast channels.
        </p>
      </div>

      {/* 2. Connection Details */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
        <h3 className="font-bold text-base text-slate-900">Socket.io Endpoint Configuration</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/60 space-y-1">
            <span className="text-slate-500 block font-sans">Socket Server Host</span>
            <span className="font-bold text-indigo-600 text-sm">{serverUrl}</span>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/60 space-y-1">
            <span className="text-slate-500 block font-sans">Path & Transports</span>
            <span className="font-bold text-indigo-600 text-sm">/socket.io (WebSocket + Polling)</span>
          </div>
        </div>
      </div>

      {/* 3. React Integration Recipe */}
      <div id="react-recipe" className="space-y-4 scroll-mt-20">
        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
          React / Next.js Client Hook
        </h2>
        <div className="rounded-2xl border border-slate-200 bg-slate-900 p-5 shadow-inner">
          <pre className="font-mono text-xs sm:text-sm text-slate-100 overflow-x-auto leading-relaxed">
            {reactSnippet}
          </pre>
        </div>
      </div>

      {/* 4. Event Table */}
      <div id="events" className="space-y-4 scroll-mt-20">
        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
          Standard Event Names
        </h2>

        <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-xs">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-semibold">
              <tr>
                <th className="py-3 px-4">Event</th>
                <th className="py-3 px-4">Direction</th>
                <th className="py-3 px-4">Payload Example</th>
                <th className="py-3 px-4">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-600">
              <tr>
                <td className="py-3 px-4 font-mono font-bold text-indigo-600">join</td>
                <td className="py-3 px-4 font-mono text-xs text-slate-800">Client → Server</td>
                <td className="py-3 px-4 font-mono text-xs">&#123; room: &apos;room-1&apos; &#125;</td>
                <td className="py-3 px-4">Subscribe connection to a scoped channel.</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-mono font-bold text-indigo-600">chat</td>
                <td className="py-3 px-4 font-mono text-xs text-slate-800">Bidirectional</td>
                <td className="py-3 px-4 font-mono text-xs">&#123; text: &apos;Hello&apos; &#125;</td>
                <td className="py-3 px-4">Broadcast message to all subscribers in the room.</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-mono font-bold text-indigo-600">typing</td>
                <td className="py-3 px-4 font-mono text-xs text-slate-800">Bidirectional</td>
                <td className="py-3 px-4 font-mono text-xs">&#123; user: &apos;Alex&apos;, typing: true &#125;</td>
                <td className="py-3 px-4">Notify room participants of active keyboard activity.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
