'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Icon } from '@iconify/react';
import config from '@/config/env';

export default function NativeWsPage() {
  const [status, setStatus] = useState<'disconnected' | 'connecting' | 'connected'>('disconnected');
  const [messages, setMessages] = useState<Array<{ sender: string; text: string; time: string }>>([]);
  const [inputMsg, setInputMsg] = useState('');
  const wsRef = useRef<WebSocket | null>(null);

  const getWsUrl = () => {
    const httpUrl = config.apiUrl || 'http://localhost:5000/api/v1';
    const clean = httpUrl.replace('/api/v1', '');
    return clean.replace(/^http/, 'ws') + '/ws';
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
          { sender: 'System', text: 'Connected to WebSocket server at /ws', time: new Date().toLocaleTimeString() },
        ]);
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          setMessages((prev) => [
            ...prev,
            {
              sender: data.sender || data.user || 'Server',
              text: typeof data === 'string' ? data : data.text || data.message || JSON.stringify(data),
              time: new Date().toLocaleTimeString(),
            },
          ]);
        } catch {
          setMessages((prev) => [
            ...prev,
            { sender: 'Server', text: event.data, time: new Date().toLocaleTimeString() },
          ]);
        }
      };

      ws.onclose = () => {
        setStatus('disconnected');
        setMessages((prev) => [
          ...prev,
          { sender: 'System', text: 'Disconnected from server.', time: new Date().toLocaleTimeString() },
        ]);
      };

      ws.onerror = () => {
        setStatus('disconnected');
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

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMsg.trim() || !wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) return;

    const payload = JSON.stringify({ type: 'chat', text: inputMsg });
    wsRef.current.send(payload);
    setMessages((prev) => [
      ...prev,
      { sender: 'You', text: inputMsg, time: new Date().toLocaleTimeString() },
    ]);
    setInputMsg('');
  };

  useEffect(() => {
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []);

  return (
    <div className="space-y-12 w-full text-slate-900">
      {/* 1. Header */}
      <div id="overview" className="space-y-4 scroll-mt-20">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold uppercase tracking-wider border border-indigo-100">
          <Icon icon="ph:plugs-connected-bold" className="w-3.5 h-3.5" />
          <span>Realtime & WebSockets</span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-[1.15]">
          Native WebSocket Server (/ws)
        </h1>

        <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-3xl">
          Zero-dependency, native browser WebSockets. Connect to <code className="font-mono text-xs bg-slate-100 px-1 py-0.5 rounded text-indigo-600">/ws</code>, subscribe to rooms, send bidirectional JSON frames, and test echo bots in real time.
        </p>
      </div>

      {/* 2. Interactive WebSocket Tester */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-xs overflow-hidden">
        {/* WS Header Bar */}
        <div className="border-b border-slate-100 bg-slate-50/70 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
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
          </div>

          <div className="flex items-center gap-2">
            {status === 'connected' ? (
              <button
                type="button"
                onClick={disconnectWs}
                className="px-3.5 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-semibold text-xs transition-all cursor-pointer"
              >
                Disconnect
              </button>
            ) : (
              <button
                type="button"
                onClick={connectWs}
                disabled={status === 'connecting'}
                className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-xs transition-all cursor-pointer"
              >
                Connect Live WS
              </button>
            )}
          </div>
        </div>

        {/* Message Log Terminal */}
        <div className="p-4 bg-slate-900 min-h-[260px] max-h-[340px] overflow-y-auto space-y-2 font-mono text-xs">
          {messages.length === 0 ? (
            <div className="text-center py-16 text-slate-500">
              Click &quot;Connect Live WS&quot; above to establish a WebSocket session.
            </div>
          ) : (
            messages.map((m, idx) => (
              <div key={idx} className="flex items-start gap-2">
                <span className="text-slate-500 text-[10px]">[{m.time}]</span>
                <span
                  className={`font-bold ${
                    m.sender === 'You'
                      ? 'text-indigo-400'
                      : m.sender === 'System'
                      ? 'text-amber-400'
                      : 'text-emerald-400'
                  }`}
                >
                  {m.sender}:
                </span>
                <span className="text-slate-200">{m.text}</span>
              </div>
            ))
          )}
        </div>

        {/* Send Input Bar */}
        <form onSubmit={sendMessage} className="p-3 bg-white border-t border-slate-100 flex items-center gap-2">
          <input
            type="text"
            value={inputMsg}
            onChange={(e) => setInputMsg(e.target.value)}
            disabled={status !== 'connected'}
            placeholder={status === 'connected' ? 'Type message payload and hit Enter...' : 'Connect to send messages'}
            className="flex-1 px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs font-mono text-slate-800 disabled:opacity-50 focus:outline-indigo-500"
          />
          <button
            type="submit"
            disabled={status !== 'connected' || !inputMsg.trim()}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs transition-all disabled:opacity-50 cursor-pointer"
          >
            Send Frame
          </button>
        </form>
      </div>

      {/* 3. Browser Code Snippet */}
      <div id="code-snippet" className="space-y-4 scroll-mt-20">
        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
          Client Integration (Vanilla JS)
        </h2>
        <div className="rounded-2xl border border-slate-200 bg-slate-900 p-5 shadow-inner">
          <pre className="font-mono text-xs sm:text-sm text-slate-100 overflow-x-auto leading-relaxed">
{`const ws = new WebSocket('${getWsUrl()}');

ws.onopen = () => {
  console.log('Connected to Playground API WebSocket');
  ws.send(JSON.stringify({ type: 'join', room: 'general' }));
};

ws.onmessage = (event) => {
  const msg = JSON.parse(event.data);
  console.log('Received:', msg);
};`}
          </pre>
        </div>
      </div>
    </div>
  );
}
