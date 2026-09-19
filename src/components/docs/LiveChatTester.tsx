'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Icon } from '@iconify/react';
import config from '@/config/env';

interface ChatMessage {
  id: string | number;
  room: string;
  sender_name: string;
  sender_id?: string | number;
  recipient_id?: string | null;
  text: string;
  created_at: string;
  protocol?: 'ws' | 'socketio' | 'rest' | 'system';
}

export function LiveChatTester() {
  const [protocol, setProtocol] = useState<'ws' | 'socketio' | 'sse'>('ws');
  const [room, setRoom] = useState<string>('support');
  const [username, setUsername] = useState<string>('Demo Developer');
  const [inputText, setInputText] = useState<string>('');
  const [connected, setConnected] = useState<boolean>(false);
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [typingUser, setTypingUser] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [pingMs, setPingMs] = useState<number | null>(null);

  const wsRef = useRef<WebSocket | null>(null);
  const sseRef = useRef<EventSource | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const rawApiUrl = config.publicApiUrl || 'http://localhost:5000/api/v1';
  const backendBase = rawApiUrl.replace(/\/api\/v1\/?$/, '');
  const wsBase = backendBase.replace(/^http/, 'ws');

  // Auto scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typingUser]);

  // Initial Seed / Fetch baseline messages
  useEffect(() => {
    async function loadInitial() {
      try {
        const res = await fetch(`${rawApiUrl}/messages?room=${room}`, {
          credentials: 'include'
        });
        if (res.ok) {
          const json = await res.json();
          if (Array.isArray(json.data)) {
            setMessages(json.data);
          }
        }
      } catch (_) {}
    }
    loadInitial();
  }, [room, rawApiUrl]);

  // Handle Protocol Connection
  useEffect(() => {
    if (protocol === 'ws') {
      const url = `${wsBase}/ws?room=${room}&username=${encodeURIComponent(username)}`;
      let ws: WebSocket;
      try {
        ws = new WebSocket(url);
      } catch (_) {
        return;
      }
      wsRef.current = ws;

      const pingStart = Date.now();
      ws.onopen = () => {
        setConnected(true);
        setPingMs(Date.now() - pingStart);
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.type === 'message') {
            setMessages((prev) => [...prev, { ...data, protocol: 'ws' }]);
          } else if (data.type === 'typing') {
            if (data.isTyping) {
              setTypingUser(data.user);
            } else {
              setTypingUser(null);
            }
          }
        } catch (_) {}
      };

      ws.onclose = () => {
        setConnected(false);
      };

      return () => {
        try {
          ws.close();
        } catch (_) {}
      };
    } else if (protocol === 'sse') {
      const sseUrl = `${rawApiUrl}/stream/notifications`;
      let sse: EventSource;
      try {
        sse = new EventSource(sseUrl);
      } catch (_) {
        return;
      }
      sseRef.current = sse;

      sse.onopen = () => {
        setConnected(true);
      };

      sse.addEventListener('notification', (e: MessageEvent) => {
        try {
          const item = JSON.parse(e.data);
          setMessages((prev) => [
            ...prev,
            {
              id: item.id || `sse-${Date.now()}`,
              room: 'notifications',
              sender_name: 'SSE Stream System',
              text: `[${item.type?.toUpperCase() || 'EVENT'}] ${item.title}: ${item.message}`,
              created_at: item.timestamp || new Date().toISOString(),
              protocol: 'system'
            }
          ]);
        } catch (_) {}
      });

      sse.onerror = () => {
        setConnected(false);
      };

      return () => {
        try {
          sse.close();
        } catch (_) {}
      };
    } else {
      // Socket.io connection state
      setConnected(true);
    }
  }, [protocol, room, username, wsBase, rawApiUrl]);

  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const text = inputText.trim();
    if (!text) return;

    if (protocol === 'ws' && wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(
        JSON.stringify({
          type: 'message',
          room,
          text
        })
      );
    } else {
      // Fallback to REST POST
      fetch(`${rawApiUrl}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          room,
          sender_name: username,
          text
        })
      }).then(async (res) => {
        if (res.ok) {
          const msg = await res.json();
          setMessages((prev) => [...prev, { ...msg, protocol: 'rest' }]);
        }
      });
    }

    setInputText('');
  };

  const handleTypingToggle = () => {
    const nextState = !isTyping;
    setIsTyping(nextState);
    if (protocol === 'ws' && wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(
        JSON.stringify({
          type: 'typing',
          room,
          isTyping: nextState
        })
      );
    }
  };

  return (
    <div className="rounded-2xl border border-slate-700/60 bg-slate-900/90 shadow-2xl backdrop-blur-xl overflow-hidden my-8">
      {/* Studio Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 bg-slate-950/60 px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="relative flex h-3 w-3">
            {connected ? (
              <>
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </>
            ) : (
              <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500"></span>
            )}
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <span>Real-Time Live Chat Studio</span>
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                {connected ? 'Live Connected' : 'Connecting...'}
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Cross-protocol message bus (RFC 6455 Native WS, Socket.io, &amp; SSE)
            </p>
          </div>
        </div>

        {/* Protocol Selector Tabs */}
        <div className="flex items-center gap-1 rounded-xl bg-slate-900 p-1 border border-slate-800">
          <button
            type="button"
            onClick={() => setProtocol('ws')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
              protocol === 'ws'
                ? 'bg-cyan-500 text-slate-950 font-semibold shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Icon icon="ph:plug-bold" className="w-3.5 h-3.5" />
            Native WS (/ws)
          </button>
          <button
            type="button"
            onClick={() => setProtocol('socketio')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
              protocol === 'socketio'
                ? 'bg-cyan-500 text-slate-950 font-semibold shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Icon icon="simple-icons:socketdotio" className="w-3.5 h-3.5" />
            Socket.io (/socket.io)
          </button>
          <button
            type="button"
            onClick={() => setProtocol('sse')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
              protocol === 'sse'
                ? 'bg-cyan-500 text-slate-950 font-semibold shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Icon icon="ph:broadcast-bold" className="w-3.5 h-3.5" />
            SSE Stream (/stream)
          </button>
        </div>
      </div>

      {/* Control Bar: Room & User */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 p-4 bg-slate-900/50 border-b border-slate-800 text-xs">
        <div>
          <label className="block text-slate-400 mb-1 font-mono">Active Room</label>
          <div className="flex gap-2">
            {['support', 'general', 'random'].map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRoom(r)}
                className={`px-2.5 py-1 rounded-md font-mono border transition-all ${
                  room === r
                    ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40 font-bold'
                    : 'bg-slate-800/80 text-slate-400 border-slate-700/60 hover:text-white'
                }`}
              >
                #{r}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-slate-400 mb-1 font-mono">Your Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-md px-2.5 py-1 text-slate-200 focus:outline-none focus:border-cyan-500"
          />
        </div>

        <div>
          <label className="block text-slate-400 mb-1 font-mono">Simulate Assistant</label>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setInputText('How do I simulate 429 rate limiting with Retry-After?');
              }}
              className="text-[11px] px-2.5 py-1 rounded bg-slate-800 text-cyan-300 hover:bg-slate-700 transition"
            >
              Ask Support Bot
            </button>
            {pingMs !== null && (
              <span className="text-[10px] text-slate-500 font-mono">
                {pingMs}ms latency
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Chat Messages Feed */}
      <div className="h-80 overflow-y-auto p-4 space-y-3 bg-slate-950/40">
        {messages.length === 0 ? (
          <div className="flex h-full items-center justify-center text-slate-500 text-xs font-mono">
            No messages yet in #{room}. Say hello or trigger Support Bot!
          </div>
        ) : (
          messages.map((m, idx) => {
            const isMe = m.sender_name === username;
            const isBot = m.sender_name === 'Support Bot' || m.sender_id === 'bot_assistant';
            const isSys = m.protocol === 'system';

            return (
              <div
                key={m.id || idx}
                className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} transition-all`}
              >
                <div className="flex items-center gap-1.5 mb-0.5 text-[10px] text-slate-400 font-mono">
                  <span className={isBot ? 'text-amber-400 font-semibold' : isMe ? 'text-cyan-400 font-semibold' : 'text-slate-300'}>
                    {m.sender_name}
                  </span>
                  {isBot && (
                    <span className="px-1 py-0.2 rounded bg-amber-500/20 text-amber-300 text-[9px] border border-amber-500/30">
                      BOT
                    </span>
                  )}
                  {m.protocol && (
                    <span className="px-1 py-0.2 rounded bg-slate-800 text-slate-400 text-[9px]">
                      {m.protocol.toUpperCase()}
                    </span>
                  )}
                  <span className="text-slate-500 text-[9px]">
                    {new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                  </span>
                </div>
                <div
                  className={`max-w-[85%] rounded-xl px-3.5 py-2 text-xs leading-relaxed ${
                    isMe
                      ? 'bg-cyan-600 text-white rounded-br-none'
                      : isBot
                      ? 'bg-linear-to-r from-amber-950/60 to-slate-900 border border-amber-500/30 text-slate-200 rounded-bl-none shadow'
                      : isSys
                      ? 'bg-slate-800/80 text-cyan-200 border border-slate-700/60'
                      : 'bg-slate-800 text-slate-200 rounded-bl-none border border-slate-700/50'
                  }`}
                >
                  {m.text}
                </div>
              </div>
            );
          })
        )}

        {/* Typing indicator bubble */}
        {typingUser && (
          <div className="flex items-center gap-2 text-xs text-amber-300 font-mono animate-pulse">
            <span className="inline-block w-2 h-2 rounded-full bg-amber-400"></span>
            <span>{typingUser} is typing...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Message Composer Footer */}
      <form onSubmit={handleSendMessage} className="flex items-center gap-2 p-3 bg-slate-900 border-t border-slate-800">
        <button
          type="button"
          onClick={handleTypingToggle}
          title="Toggle typing indicator for peers"
          className={`p-2 rounded-lg border transition ${
            isTyping
              ? 'bg-amber-500/20 border-amber-500 text-amber-300'
              : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
          }`}
        >
          <Icon icon="ph:keyboard-bold" className="w-4 h-4" />
        </button>

        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder={`Type a message to #${room}... (e.g. "@bot help")`}
          className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
        />

        <button
          type="submit"
          disabled={!inputText.trim()}
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 disabled:hover:bg-cyan-500 text-slate-950 font-semibold text-xs transition"
        >
          <span>Send</span>
          <Icon icon="ph:paper-plane-right-fill" className="w-3.5 h-3.5" />
        </button>
      </form>
    </div>
  );
}
