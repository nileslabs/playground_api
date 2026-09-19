import React from 'react';
import type { Metadata } from 'next';
import { Icon } from '@iconify/react';
import { CodeBlock } from '@/components/ui/CodeBlock';
import config from '@/config/env';
import { siteConfig } from '@/config/site';
import { getDocArticleSchema, getBreadcrumbSchema } from '@/lib/json-ld';
import { LiveChatTester } from '@/components/docs/LiveChatTester';

export const metadata: Metadata = {
  title: 'Real-Time WebSockets, Socket.io & Live Chat Simulation — Playground API',
  description:
    'Test real-time applications with Dual Protocol WebSocket & Socket.io support, live chat rooms (#general, #support), typing indicators, automated Support Bot simulation, and Server-Sent Events (SSE) notification streams.',
  keywords: [
    'websocket mock api',
    'socket io mock server',
    'real time chat simulation',
    'support bot typing indicator websocket',
    'server sent events mock api',
    'test websocket react svelte vue',
    'sandbox chat messages rest api',
  ],
  alternates: {
    canonical: `${siteConfig.url}/docs/chat`,
  },
  openGraph: {
    title: 'Real-Time WebSockets, Socket.io & Live Chat Simulation — Playground API',
    description:
      'Dual Protocol WebSocket (/ws) & Socket.io (/socket.io) gateway with room channels, typing indicators, Support Bot assistant, and SSE event streaming.',
    url: `${siteConfig.url}/docs/chat`,
    type: 'article',
  },
};

export default function RealtimeChatDocsPage() {
  const publicApiUrl = config.publicApiUrl || 'https://playground.nileslabs.com/api/v1';
  const backendBase = publicApiUrl.replace(/\/api\/v1\/?$/, '');
  const wsBase = backendBase.replace(/^http/, 'ws');

  const nativeWsSample = `// 1. Connect to Native WebSocket endpoint (/ws)
const ws = new WebSocket('${wsBase}/ws?room=support&username=Alice');

ws.onopen = () => {
  console.log('Connected to Playground API WebSocket!');
  
  // Send a chat message
  ws.send(JSON.stringify({
    type: 'message',
    room: 'support',
    text: 'Hello! How do I test rate limits?'
  }));
};

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  
  if (data.type === 'typing') {
    console.log(\`\${data.user} is \${data.isTyping ? 'typing...' : 'idle'}\`);
  } else if (data.type === 'message') {
    console.log(\`[\${data.room}] \${data.sender_name}: \${data.text}\`);
  }
};`;

  const socketIoSample = `import { io } from 'socket.io-client';

// 2. Connect to Socket.io Gateway (/socket.io)
const socket = io('${backendBase}', {
  path: '/socket.io',
  query: {
    room: 'general',
    username: 'Bob'
  }
});

socket.on('connect', () => {
  console.log('Socket.io connected with id:', socket.id);
});

// Listen for broadcasted chat messages
socket.on('message', (msg) => {
  console.log(\`[\${msg.room}] \${msg.sender_name}: \${msg.text}\`);
});

// Listen for typing events
socket.on('typing', ({ user, isTyping, room }) => {
  console.log(\`\${user} \${isTyping ? 'is typing...' : 'stopped typing'} in #\${room}\`);
});

// Send a message
socket.emit('message', {
  room: 'general',
  text: 'Hello from Socket.io client!'
});`;

  const sseSample = `// 3. Server-Sent Events (SSE) Notification Stream
const eventSource = new EventSource('${publicApiUrl}/stream/notifications');

eventSource.onopen = () => {
  console.log('SSE notification stream opened.');
};

// Listen for system notifications
eventSource.addEventListener('notification', (event) => {
  const notification = JSON.parse(event.data);
  console.log('New Notification:', notification.title, notification.message);
});

eventSource.onerror = (err) => {
  console.error('SSE Error:', err);
};`;

  const reactHookSample = `import { useEffect, useState, useRef } from 'react';

export function useChatRoom(room = 'general', username = 'Developer') {
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [typingUser, setTypingUser] = useState(null);
  const wsRef = useRef(null);

  useEffect(() => {
    const ws = new WebSocket(\`${wsBase}/ws?room=\${room}&username=\${encodeURIComponent(username)}\`);
    wsRef.current = ws;

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'message') {
        setMessages((prev) => [...prev, data]);
      } else if (data.type === 'typing') {
        setTypingUser(data.isTyping ? data.user : null);
      }
    };

    return () => ws.close();
  }, [room, username]);

  const sendMessage = (text) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type: 'message', room, text }));
    }
  };

  const sendTyping = (status) => {
    setIsTyping(status);
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type: 'typing', room, isTyping: status }));
    }
  };

  return { messages, sendMessage, sendTyping, typingUser, isTyping };
}`;

  return (
    <div className="space-y-10">
      {/* Hero Header */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
            <Icon icon="ph:broadcast-bold" className="w-3.5 h-3.5" />
            Dual-Protocol Realtime
          </span>
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            <Icon icon="ph:robot-bold" className="w-3.5 h-3.5" />
            Support Bot Simulator
          </span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Real-Time WebSockets, Socket.io &amp; Live Chat
        </h1>
        <p className="mt-3 text-base sm:text-lg text-slate-300 leading-relaxed max-w-4xl">
          Build and test real-time frontend applications without configuring external socket servers. Playground API provides unified cross-protocol message routing across <strong>RFC 6455 Native WebSockets</strong> (<code className="text-cyan-400 font-mono">/ws</code>), <strong>Socket.io 4.x</strong> (<code className="text-cyan-400 font-mono">/socket.io</code>), and <strong>Server-Sent Events</strong> (<code className="text-cyan-400 font-mono">/stream/notifications</code>), complete with room channels, typing indicators, and an automated Support Bot.
        </p>
      </div>

      {/* Interactive Chat Studio Runner */}
      <div>
        <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
          <Icon icon="ph:play-circle-bold" className="text-cyan-400 w-5 h-5" />
          Interactive Chat Studio
        </h2>
        <p className="text-sm text-slate-400 mb-4">
          Switch protocols, toggle rooms, simulate typing indicators, and message the AI Support Bot live inside your browser.
        </p>
        <LiveChatTester />
      </div>

      {/* Protocol Architecture Comparison */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <Icon icon="ph:cpu-bold" className="text-indigo-400 w-6 h-6" />
          Supported Realtime Protocols
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 space-y-3">
            <div className="flex items-center gap-2 text-cyan-400 font-semibold text-sm">
              <Icon icon="ph:plug-bold" className="w-5 h-5" />
              Native WebSocket (/ws)
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Standard RFC 6455 WebSocket endpoint. Works natively with browser <code className="text-cyan-300 font-mono">new WebSocket()</code>, Node.js <code className="text-cyan-300 font-mono">ws</code>, Python <code className="text-cyan-300 font-mono">websockets</code>, and Go.
            </p>
            <div className="text-[11px] font-mono text-slate-500 bg-slate-950 px-2.5 py-1.5 rounded border border-slate-800">
              ws://.../ws?room=general
            </div>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 space-y-3">
            <div className="flex items-center gap-2 text-indigo-400 font-semibold text-sm">
              <Icon icon="simple-icons:socketdotio" className="w-5 h-5" />
              Socket.io (/socket.io)
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Full Socket.io 4.x transport support with event multiplexing (<code className="text-indigo-300 font-mono">socket.emit('message')</code>), automatic reconnection, and cross-protocol room broadcasts.
            </p>
            <div className="text-[11px] font-mono text-slate-500 bg-slate-950 px-2.5 py-1.5 rounded border border-slate-800">
              http://.../socket.io
            </div>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 space-y-3">
            <div className="flex items-center gap-2 text-emerald-400 font-semibold text-sm">
              <Icon icon="ph:broadcast-bold" className="w-5 h-5" />
              SSE Stream (/stream)
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Unidirectional HTTP <code className="text-emerald-300 font-mono">text/event-stream</code> push channel for system notifications, database change broadcasts, and background activity pulses.
            </p>
            <div className="text-[11px] font-mono text-slate-500 bg-slate-950 px-2.5 py-1.5 rounded border border-slate-800">
              GET /api/v1/stream/notifications
            </div>
          </div>
        </div>
      </div>

      {/* Code Quickstarts */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <Icon icon="ph:code-bold" className="text-cyan-400 w-6 h-6" />
          Integration Code Examples
        </h2>

        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-semibold text-white mb-2">1. React Custom Hook (`useChatRoom`)</h3>
            <CodeBlock code={reactHookSample} language="typescript" title="hooks/useChatRoom.ts" />
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white mb-2">2. Native Browser WebSocket Connection</h3>
            <CodeBlock code={nativeWsSample} language="javascript" title="Native RFC 6455 WebSocket" />
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white mb-2">3. Socket.io Client Client Setup</h3>
            <CodeBlock code={socketIoSample} language="javascript" title="Socket.io 4.x Client" />
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white mb-2">4. Server-Sent Events (SSE) Subscriber</h3>
            <CodeBlock code={sseSample} language="javascript" title="Server-Sent Events Subscriber" />
          </div>
        </div>
      </div>

      {/* Support Bot Simulation Guide */}
      <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-6 space-y-4">
        <h3 className="text-base font-bold text-amber-300 flex items-center gap-2">
          <Icon icon="ph:robot-bold" className="w-5 h-5" />
          Automated Support Bot Simulation Engine
        </h3>
        <p className="text-xs text-slate-300 leading-relaxed">
          The Playground API server includes an integrated AI Support Bot simulator that listens on the <code className="text-amber-300 font-mono">#support</code> channel or any message mentioning <code className="text-amber-300 font-mono">@bot</code> or starting with <code className="text-amber-300 font-mono">/bot</code>. When triggered, it:
        </p>
        <ul className="list-disc list-inside text-xs text-slate-300 space-y-1.5 ml-2">
          <li>Broadcasts a <code className="text-amber-400 font-mono">&#123; type: 'typing', user: 'Support Bot', isTyping: true &#125;</code> event across all peers in the room.</li>
          <li>Simulates natural typing latency (~200ms).</li>
          <li>Broadcasts the bot reply message and turns off the typing indicator.</li>
        </ul>
      </div>
    </div>
  );
}
