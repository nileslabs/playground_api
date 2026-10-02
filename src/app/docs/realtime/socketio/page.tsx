'use client';

import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import config from '@/config/env';
import { CodeBlock } from '@/components/ui/CodeBlock';

export default function SocketIoPage() {
  const publicApiUrl = config.publicApiUrl || 'https://playground.nileslabs.com/api/v1';
  const serverUrl =
    (typeof config.getBackendBaseUrl === 'function' ? config.getBackendBaseUrl() : null) ||
    config.backendUrl ||
    (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
      ? `${window.location.protocol}//${window.location.hostname}:3001`
      : 'http://localhost:3001');

  const [activeChannel, setActiveChannel] = useState<'general' | 'support' | 'private'>('general');

  const channels = {
    general: {
      name: '#general',
      desc: 'Public chat broadcast channel open to all active browser peers.',
      event: 'chat',
      samplePayload: JSON.stringify({ room: 'general', text: 'Hello Socket.io team!' }, null, 2),
    },
    support: {
      name: '#support',
      desc: 'Interactive AI support room with automated 200ms echo bot response.',
      event: 'chat',
      samplePayload: JSON.stringify({ room: 'support', text: '@bot query system status' }, null, 2),
    },
    private: {
      name: 'Direct Messaging',
      desc: 'Peer-to-peer user messaging scoped to recipient_id.',
      event: 'chat',
      samplePayload: JSON.stringify({ room: 'private', recipient_id: 2, text: 'Private invoice sync' }, null, 2),
    },
  };

  const reactHookSnippet = `import { useEffect, useState, useRef, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';

export function useSocketIo(serverUrl = '${serverUrl}', room = 'general') {
  const [messages, setMessages] = useState<any[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    // Initialize Socket.io client with dual transports
    const socket = io(serverUrl, {
      path: '/socket.io',
      transports: ['websocket', 'polling'],
      withCredentials: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      setIsConnected(true);
      socket.emit('join', { room });
    });

    socket.on('message', (data) => {
      setMessages((prev) => [...prev, data]);
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
    });

    return () => {
      socket.disconnect();
    };
  }, [serverUrl, room]);

  const sendMessage = useCallback((text: string) => {
    socketRef.current?.emit('chat', { room, text });
  }, [room]);

  return { messages, isConnected, sendMessage };
}`;

  const vanillaNodeSnippet = `// Node.js / TypeScript Client
import { io } from 'socket.io-client';

const socket = io('${serverUrl}', {
  path: '/socket.io',
  transports: ['websocket'],
});

socket.on('connect', () => {
  console.log('Connected via Socket.io ID:', socket.id);
  
  // Join room and send message
  socket.emit('join', { room: 'general' });
  socket.emit('chat', { room: 'general', text: 'Hello from Node.js!' });
});

socket.on('message', (msg) => {
  console.log('Incoming message event:', msg);
});`;

  return (
    <div className="space-y-12 w-full text-slate-900">
      {/* 1. Header with Eyebrow Badge */}
      <div id="overview" className="space-y-4 scroll-mt-20">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold uppercase tracking-wider border border-indigo-200">
          <Icon icon="ph:network-bold" className="w-3.5 h-3.5" />
          <span>Realtime &amp; WebSockets</span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-[1.15]">
          Socket.io Gateway &amp; Event Bus
        </h1>

        <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-3xl">
          Integrate with the built-in Socket.io server mounted at <code className="font-mono text-xs bg-slate-100 px-1.5 py-0.5 rounded text-indigo-600 font-bold">/socket.io</code>. Features automatic fallback to HTTP long-polling, room multiplexing, automated heartbeat reconnection, and peer-to-peer event broadcast channels.
        </p>
      </div>

      {/* 2. Channel Architecture Workbench */}
      <div id="channel-workbench" className="p-6 sm:p-7 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-6 scroll-mt-20">
        <div className="border-b border-slate-100 pb-4">
          <h2 className="font-bold text-base sm:text-lg text-slate-900">
            Channel Configuration &amp; Event Workbench
          </h2>
          <p className="text-sm text-slate-600">
            Select an active channel preset to view connection parameters and sample payload dispatch envelopes:
          </p>
        </div>

        {/* Channel Preset Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {(['general', 'support', 'private'] as const).map((key) => {
            const ch = channels[key];
            const isActive = activeChannel === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => setActiveChannel(key)}
                className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                  isActive
                    ? 'bg-indigo-50/80 border-indigo-300 ring-2 ring-indigo-500/20 shadow-xs'
                    : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/60 shadow-2xs'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-mono text-xs font-bold text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded">
                    {ch.name}
                  </span>
                </div>
                <h3 className="font-bold text-sm text-slate-900">{key === 'general' ? 'Public Broadcast' : key === 'support' ? 'AI Echo Bot' : 'Direct Message'}</h3>
                <p className="text-xs text-slate-600 mt-1 line-clamp-2 leading-relaxed">{ch.desc}</p>
              </button>
            );
          })}
        </div>

        {/* Connection Specs & Payload Display */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-stretch">
          <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <Icon icon="ph:faders-bold" className="w-4 h-4 text-indigo-600" />
                <span>Socket Gateway Connection Specs</span>
              </h3>
              <div className="space-y-2 text-xs font-mono">
                <div className="p-3 rounded-xl bg-white border border-slate-200/80 flex justify-between items-center">
                  <span className="text-slate-500">Gateway URL:</span>
                  <span className="font-bold text-indigo-700">{serverUrl}</span>
                </div>
                <div className="p-3 rounded-xl bg-white border border-slate-200/80 flex justify-between items-center">
                  <span className="text-slate-500">Path:</span>
                  <span className="font-bold text-slate-800">/socket.io</span>
                </div>
                <div className="p-3 rounded-xl bg-white border border-slate-200/80 flex justify-between items-center">
                  <span className="text-slate-500">Transports:</span>
                  <span className="font-bold text-emerald-700">websocket, polling</span>
                </div>
                <div className="p-3 rounded-xl bg-white border border-slate-200/80 flex justify-between items-center">
                  <span className="text-slate-500">Selected Channel:</span>
                  <span className="font-bold text-purple-700">{channels[activeChannel].name}</span>
                </div>
              </div>
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Playground API Socket.io server automatically synchronizes broadcasts with Native WebSocket clients across shared channels.
            </p>
          </div>

          <CodeBlock
            code={channels[activeChannel].samplePayload}
            language="json"
            title={`Sample Emit Payload (${channels[activeChannel].event})`}
            showHeader={true}
            copyable={true}
            initialWrap={true}
            className="h-full flex flex-col"
          />
        </div>
      </div>

      {/* 3. Event Names Reference Table */}
      <div id="events-table" className="space-y-4 scroll-mt-20">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
          Standard Event Names &amp; Signatures
        </h2>
        <p className="text-sm text-slate-600">
          The Socket.io server listens for and emits typed events over active client connections:
        </p>

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 border-b border-slate-200 text-xs uppercase tracking-wider text-slate-700 font-bold">
                <tr>
                  <th className="py-3.5 px-4">Event Name</th>
                  <th className="py-3.5 px-4">Direction</th>
                  <th className="py-3.5 px-4">Payload Keys</th>
                  <th className="py-3.5 px-4">Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
                <tr className="hover:bg-slate-50/50">
                  <td className="py-3.5 px-4 font-mono text-xs font-bold text-indigo-700">join</td>
                  <td className="py-3.5 px-4 text-xs font-semibold text-slate-600">Client → Server</td>
                  <td className="py-3.5 px-4 font-mono text-xs text-slate-800">{`{ room }`}</td>
                  <td className="py-3.5 px-4 text-slate-600 text-xs">
                    Associates the socket connection with a target room channel.
                  </td>
                </tr>
                <tr className="hover:bg-slate-50/50">
                  <td className="py-3.5 px-4 font-mono text-xs font-bold text-indigo-700">chat</td>
                  <td className="py-3.5 px-4 text-xs font-semibold text-slate-600">Client → Server</td>
                  <td className="py-3.5 px-4 font-mono text-xs text-slate-800">{`{ room, text, recipient_id }`}</td>
                  <td className="py-3.5 px-4 text-slate-600 text-xs">
                    Dispatches a chat payload to all peers subscribed to the room.
                  </td>
                </tr>
                <tr className="hover:bg-slate-50/50">
                  <td className="py-3.5 px-4 font-mono text-xs font-bold text-indigo-700">typing</td>
                  <td className="py-3.5 px-4 text-xs font-semibold text-slate-600">Bidirectional</td>
                  <td className="py-3.5 px-4 font-mono text-xs text-slate-800">{`{ room, isTyping }`}</td>
                  <td className="py-3.5 px-4 text-slate-600 text-xs">
                    Broadcasts ephemeral keystroke indicators to peer clients.
                  </td>
                </tr>
                <tr className="hover:bg-slate-50/50">
                  <td className="py-3.5 px-4 font-mono text-xs font-bold text-indigo-700">message</td>
                  <td className="py-3.5 px-4 text-xs font-semibold text-slate-600">Server → Client</td>
                  <td className="py-3.5 px-4 font-mono text-xs text-slate-800">{`{ id, room, sender_id, text, created_at }`}</td>
                  <td className="py-3.5 px-4 text-slate-600 text-xs">
                    Incoming broadcast message event delivered to the client.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* 4. Client Integration Recipes */}
      <div id="client-integration" className="space-y-4 scroll-mt-20">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
          Client Integration Code
        </h2>
        <p className="text-sm text-slate-600">
          Copy-paste production hooks for React 19 / Next.js and Node.js:
        </p>

        <CodeBlock
          tabs={[
            {
              id: 'react',
              label: 'React Hook (useSocketIo)',
              icon: 'simple-icons:react',
              language: 'typescript',
              code: reactHookSnippet,
            },
            {
              id: 'node',
              label: 'Node.js Client',
              icon: 'simple-icons:nodedotjs',
              language: 'javascript',
              code: vanillaNodeSnippet,
            },
          ]}
          defaultTab="react"
          showHeader={true}
          copyable={true}
          initialWrap={true}
        />
      </div>

      {/* 5. Architectural Comparison Table */}
      <div id="comparison" className="space-y-4 scroll-mt-20">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
          Socket.io vs Native WebSockets
        </h2>
        <p className="text-sm text-slate-600">
          Key trade-offs between Socket.io and native browser WebSocket streams:
        </p>

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 border-b border-slate-200 text-xs uppercase tracking-wider text-slate-700 font-bold">
                <tr>
                  <th className="py-3.5 px-4">Feature</th>
                  <th className="py-3.5 px-4">Socket.io Gateway</th>
                  <th className="py-3.5 px-4">Native WebSocket (/ws)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
                <tr className="hover:bg-slate-50/50">
                  <td className="py-3.5 px-4 font-bold text-slate-900">Client Dependency</td>
                  <td className="py-3.5 px-4 font-mono text-xs">socket.io-client required</td>
                  <td className="py-3.5 px-4 font-mono text-xs text-emerald-700 font-bold">Zero dependencies (built-in API)</td>
                </tr>
                <tr className="hover:bg-slate-50/50">
                  <td className="py-3.5 px-4 font-bold text-slate-900">Fallback Transports</td>
                  <td className="py-3.5 px-4 text-xs font-semibold text-emerald-700">Automatic fallback to HTTP Polling</td>
                  <td className="py-3.5 px-4 text-xs">Direct TCP WebSocket upgrade only</td>
                </tr>
                <tr className="hover:bg-slate-50/50">
                  <td className="py-3.5 px-4 font-bold text-slate-900">Auto Reconnection</td>
                  <td className="py-3.5 px-4 text-xs font-semibold text-emerald-700">Built-in exponential backoff</td>
                  <td className="py-3.5 px-4 text-xs">Manual onclose retry loop needed</td>
                </tr>
                <tr className="hover:bg-slate-50/50">
                  <td className="py-3.5 px-4 font-bold text-slate-900">Framing Overhead</td>
                  <td className="py-3.5 px-4 text-xs">Engine.IO packet headers</td>
                  <td className="py-3.5 px-4 text-xs font-semibold text-emerald-700">Minimal 2-10 byte WebSocket frame</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
