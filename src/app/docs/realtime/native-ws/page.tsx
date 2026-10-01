'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Icon } from '@iconify/react';
import config from '@/config/env';
import { CodeBlock } from '@/components/ui/CodeBlock';

interface ChatMessage {
  id: string;
  sender: string;
  text: string;
  time: string;
  isBot?: boolean;
}

const PRESET_PAYLOADS = [
  {
    label: 'Join #general Room',
    payload: JSON.stringify({ type: 'join', room: 'general' }),
  },
  {
    label: 'Send Public Message',
    payload: JSON.stringify({ type: 'chat', text: 'Hello team from native WebSocket!' }),
  },
  {
    label: 'Query @bot Assistant',
    payload: JSON.stringify({ type: 'chat', text: '@bot what is the current server status?' }),
  },
  {
    label: 'Typing Indicator Event',
    payload: JSON.stringify({ type: 'typing', isTyping: true, room: 'general' }),
  },
];

export default function NativeWsPage() {
  const [status, setStatus] = useState<'disconnected' | 'connecting' | 'connected'>('disconnected');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'seed-1',
      sender: 'System',
      text: 'WebSocket client ready. Click "Connect Live WS" to establish a persistent full-duplex session.',
      time: '12:00:00',
    },
  ]);
  const [inputMsg, setInputMsg] = useState('');
  const wsRef = useRef<WebSocket | null>(null);

  const getWsUrl = () => {
    if (typeof config.getWebSocketUrl === 'function') {
      return config.getWebSocketUrl('/ws');
    }
    if (config.wsUrl) {
      return config.wsUrl;
    }
    if (typeof window !== 'undefined') {
      const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
      if (isLocal) {
        return 'ws://localhost:3001/ws';
      }
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      return `${protocol}//${window.location.host}/ws`;
    }
    return 'ws://localhost:3001/ws';
  };

  const connectWs = () => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) return;

    setStatus('connecting');
    try {
      const wsUrl = getWsUrl();
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        setStatus('connected');
        setMessages((prev) => [
          ...prev,
          {
            id: `msg-${Date.now()}-open`,
            sender: 'System',
            text: `Connected to Playground WebSocket server at ${wsUrl}. Subscribed to #general.`,
            time: new Date().toLocaleTimeString(),
          },
        ]);
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          const isBot = data.sender_id === 'bot_assistant' || data.user === 'Support Bot';
          setMessages((prev) => [
            ...prev,
            {
              id: data.id || `msg-${Date.now()}`,
              sender: data.sender_name || data.user || data.sender || 'Server',
              text: typeof data === 'string' ? data : data.text || data.message || JSON.stringify(data),
              time: new Date().toLocaleTimeString(),
              isBot,
            },
          ]);
        } catch {
          setMessages((prev) => [
            ...prev,
            {
              id: `msg-${Date.now()}`,
              sender: 'Server',
              text: event.data,
              time: new Date().toLocaleTimeString(),
            },
          ]);
        }
      };

      ws.onclose = () => {
        setStatus('disconnected');
        setMessages((prev) => [
          ...prev,
          {
            id: `msg-${Date.now()}-close`,
            sender: 'System',
            text: 'WebSocket connection closed.',
            time: new Date().toLocaleTimeString(),
          },
        ]);
      };

      ws.onerror = (err) => {
        console.error('WebSocket error:', err);
        setStatus('disconnected');
        setMessages((prev) => [
          ...prev,
          {
            id: `msg-${Date.now()}-err`,
            sender: 'System',
            text: `Connection error on ${wsUrl}. Verify backend WebSocket server is running on port 3001.`,
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

  const sendMessagePayload = (textToSend: string) => {
    if (!textToSend.trim() || !wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) return;

    try {
      // If user typed raw JSON, send as-is; otherwise wrap in standard chat frame
      if (textToSend.trim().startsWith('{')) {
        wsRef.current.send(textToSend);
      } else {
        const payload = JSON.stringify({ type: 'chat', text: textToSend });
        wsRef.current.send(payload);
      }

      setMessages((prev) => [
        ...prev,
        {
          id: `msg-${Date.now()}-you`,
          sender: 'You',
          text: textToSend,
          time: new Date().toLocaleTimeString(),
        },
      ]);
    } catch (err) {
      console.error('Failed to send frame', err);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMsg.trim()) return;
    sendMessagePayload(inputMsg);
    setInputMsg('');
  };

  useEffect(() => {
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []);

  const vanillaJsSnippet = `// Native WebSocket Connection (Vanilla JavaScript)
const wsUrl = '${getWsUrl()}';
const ws = new WebSocket(wsUrl);

ws.onopen = () => {
  console.log('Connected to Playground API WebSocket server');
  
  // 1. Join room
  ws.send(JSON.stringify({ type: 'join', room: 'general' }));
  
  // 2. Send public message
  ws.send(JSON.stringify({ type: 'chat', text: 'Hello from client!' }));
};

ws.onmessage = (event) => {
  const frame = JSON.parse(event.data);
  console.log('Received frame:', frame);
};

ws.onclose = (event) => {
  console.warn('Disconnected:', event.reason);
};`;

  const reactHookSnippet = `// React 19 / Next.js Custom WebSocket Hook
import { useState, useEffect, useRef, useCallback } from 'react';

export function useWebSocket(url: string, room = 'general') {
  const [messages, setMessages] = useState<any[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const ws = new WebSocket(url);
    wsRef.current = ws;

    ws.onopen = () => {
      setIsConnected(true);
      ws.send(JSON.stringify({ type: 'join', room }));
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        setMessages((prev) => [...prev, data]);
      } catch {
        setMessages((prev) => [...prev, { text: event.data }]);
      }
    };

    ws.onclose = () => setIsConnected(false);

    return () => {
      ws.close();
    };
  }, [url, room]);

  const send = useCallback((text: string) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type: 'chat', text, room }));
    }
  }, [room]);

  return { messages, isConnected, send };
}`;

  return (
    <div className="space-y-12 w-full text-slate-900">
      {/* 1. Header with Eyebrow Badge */}
      <div id="overview" className="space-y-4 scroll-mt-20">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold uppercase tracking-wider border border-indigo-200">
          <Icon icon="ph:plugs-connected-bold" className="w-3.5 h-3.5" />
          <span>Realtime &amp; WebSockets</span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-[1.15]">
          Native WebSocket Server (/ws)
        </h1>

        <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-3xl">
          Connect to the native browser WebSocket server at <code className="font-mono text-xs bg-slate-100 px-1.5 py-0.5 rounded text-indigo-600 font-bold">/ws</code>. Features room multiplexing, peer-to-peer event broadcasts, typing indicators, and an automated <code className="font-mono text-xs bg-slate-100 px-1.5 py-0.5 rounded text-indigo-600 font-bold">@bot</code> assistant simulator without external socket dependencies.
        </p>
      </div>

      {/* 2. Interactive WebSocket Terminal Workbench */}
      <div id="interactive-terminal" className="rounded-2xl border border-slate-200 bg-white shadow-xs overflow-hidden scroll-mt-20">
        {/* Terminal Header */}
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
            <span className="font-mono text-xs font-bold text-slate-800">{getWsUrl()}</span>
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

        {/* Quick Send Preset Chips */}
        <div className="p-3 bg-slate-50/40 border-b border-slate-100 flex flex-wrap items-center gap-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mr-1">
            Quick Payloads:
          </span>
          {PRESET_PAYLOADS.map((item, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                if (status !== 'connected') {
                  connectWs();
                }
                sendMessagePayload(item.payload);
              }}
              className="px-2.5 py-1 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-[11px] font-mono text-slate-700 hover:text-indigo-600 transition-all cursor-pointer shadow-2xs"
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Message Log Terminal */}
        <div className="p-4 bg-slate-900 min-h-70 max-h-95 overflow-y-auto space-y-2 font-mono text-xs">
          {messages.map((m) => (
            <div key={m.id} className="flex items-start gap-2 leading-relaxed">
              <span className="text-slate-500 text-[10px] shrink-0">[{m.time}]</span>
              <span
                className={`font-bold shrink-0 ${
                  m.sender === 'You'
                    ? 'text-indigo-400'
                    : m.sender === 'System'
                    ? 'text-amber-400'
                    : m.isBot
                    ? 'text-purple-400'
                    : 'text-emerald-400'
                }`}
              >
                {m.sender}:
              </span>
              <span className="text-slate-200 break-all">{m.text}</span>
            </div>
          ))}
        </div>

        {/* Frame Input Form */}
        <form onSubmit={handleFormSubmit} className="p-3 bg-white border-t border-slate-100 flex items-center gap-2">
          <input
            type="text"
            value={inputMsg}
            onChange={(e) => setInputMsg(e.target.value)}
            disabled={status !== 'connected'}
            placeholder={status === 'connected' ? 'Type message text or raw JSON frame and press Enter...' : 'Connect to send messages'}
            className="flex-1 px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50/50 text-xs font-mono text-slate-900 disabled:opacity-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
          />
          <button
            type="submit"
            disabled={status !== 'connected' || !inputMsg.trim()}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-xs transition-all disabled:opacity-50 cursor-pointer flex items-center gap-1.5"
          >
            <Icon icon="ph:paper-plane-tilt-bold" className="w-3.5 h-3.5" />
            <span>Send Frame</span>
          </button>
        </form>
      </div>

      {/* 3. Protocol Frame Specification Table */}
      <div id="protocol-spec" className="space-y-4 scroll-mt-20">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
          WebSocket Protocol Frame Specification
        </h2>
        <p className="text-sm text-slate-600">
          The Playground WebSocket gateway parses standardized JSON envelope payloads:
        </p>

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 border-b border-slate-200 text-xs uppercase tracking-wider text-slate-700 font-bold">
                <tr>
                  <th className="py-3.5 px-4">Frame Type</th>
                  <th className="py-3.5 px-4">Direction</th>
                  <th className="py-3.5 px-4">Payload Example</th>
                  <th className="py-3.5 px-4">Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
                <tr className="hover:bg-slate-50/50">
                  <td className="py-3.5 px-4 font-mono text-xs font-bold text-indigo-700">join</td>
                  <td className="py-3.5 px-4 text-xs font-semibold text-slate-600">Client → Server</td>
                  <td className="py-3.5 px-4 font-mono text-xs text-slate-800">
                    {`{"type":"join","room":"general"}`}
                  </td>
                  <td className="py-3.5 px-4 text-slate-600 text-xs">
                    Subscribes socket to a specific channel (e.g. general, support, custom).
                  </td>
                </tr>
                <tr className="hover:bg-slate-50/50">
                  <td className="py-3.5 px-4 font-mono text-xs font-bold text-indigo-700">chat</td>
                  <td className="py-3.5 px-4 text-xs font-semibold text-slate-600">Client → Server</td>
                  <td className="py-3.5 px-4 font-mono text-xs text-slate-800">
                    {`{"type":"chat","text":"Hello"}`}
                  </td>
                  <td className="py-3.5 px-4 text-slate-600 text-xs">
                    Broadcasts a chat message to all peers in the current active room.
                  </td>
                </tr>
                <tr className="hover:bg-slate-50/50">
                  <td className="py-3.5 px-4 font-mono text-xs font-bold text-indigo-700">typing</td>
                  <td className="py-3.5 px-4 text-xs font-semibold text-slate-600">Bidirectional</td>
                  <td className="py-3.5 px-4 font-mono text-xs text-slate-800">
                    {`{"type":"typing","isTyping":true}`}
                  </td>
                  <td className="py-3.5 px-4 text-slate-600 text-xs">
                    Emits keystroke typing bubble to room peers without persisting to database.
                  </td>
                </tr>
                <tr className="hover:bg-slate-50/50">
                  <td className="py-3.5 px-4 font-mono text-xs font-bold text-indigo-700">message</td>
                  <td className="py-3.5 px-4 text-xs font-semibold text-slate-600">Server → Client</td>
                  <td className="py-3.5 px-4 font-mono text-xs text-slate-800">
                    {`{"type":"message","id":"msg-..","text":".."}`}
                  </td>
                  <td className="py-3.5 px-4 text-slate-600 text-xs">
                    Inbound server broadcast dispatched to subscribers with timestamp and sender ID.
                  </td>
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
          Production-grade integration patterns for Vanilla JS and React / Next.js hooks:
        </p>

        <CodeBlock
          tabs={[
            {
              id: 'vanilla',
              label: 'Vanilla JavaScript',
              icon: 'simple-icons:javascript',
              language: 'javascript',
              code: vanillaJsSnippet,
            },
            {
              id: 'react',
              label: 'React Hook (useWebSocket)',
              icon: 'simple-icons:react',
              language: 'typescript',
              code: reactHookSnippet,
            },
          ]}
          defaultTab="vanilla"
          showHeader={true}
          copyable={true}
          initialWrap={true}
        />
      </div>
    </div>
  );
}
