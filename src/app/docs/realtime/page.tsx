'use client';

import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import Link from 'next/link';
import { Icon } from '@iconify/react';
import config from '@/config/env';
import { CodeBlock } from '@/components/ui/CodeBlock';

type RealtimeTab = 'chat' | 'ticker' | 'presence' | 'sse' | 'recipes';
type RoomName = 'general' | 'support' | 'crypto' | 'trading' | 'dev';

interface ChatMessage {
  id: string;
  room: string;
  sender_id: string | number;
  sender_name: string;
  text: string;
  created_at: string;
  isBot?: boolean;
}

interface RoomPeer {
  id: string;
  username: string;
  role?: string;
  status: 'online' | 'idle' | 'away';
  isBot?: boolean;
  transport?: string;
  isYou?: boolean;
}

interface TickerAsset {
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  high24h: number;
  low24h: number;
  volume: string;
  category: 'crypto' | 'equity';
  trend?: 'up' | 'down';
  delta?: number;
  history: number[];
}

interface SseRawFrame {
  id: string;
  eventId?: string;
  type: string;
  data: string;
  timestamp: string;
  raw: string;
}

const ROOM_BLUEPRINTS: Record<RoomName, { label: string; desc: string; icon: string }> = {
  general: { label: '#general', desc: 'Public broadcast room for developers and open discussions', icon: 'ph:chat-teardrop-text-bold' },
  support: { label: '#support', desc: 'AI customer support room with automated instant bot echo replies', icon: 'ph:robot-bold' },
  crypto: { label: '#crypto', desc: 'Cryptocurrency market signals and high-volatility discussions', icon: 'ph:currency-btc-bold' },
  trading: { label: '#trading', desc: 'Equities, options, and algorithmic market data channel', icon: 'ph:chart-line-up-bold' },
  dev: { label: '#dev', desc: 'System build events, CI/CD telemetry, and architecture sync', icon: 'ph:code-bold' }
};

const INITIAL_TICKER_DATA: Record<string, TickerAsset> = {
  'BTC-USD': { symbol: 'BTC-USD', name: 'Bitcoin', price: 63840.50, change24h: 2.45, high24h: 64500.00, low24h: 62100.00, volume: '28.4B', category: 'crypto', history: [63200, 63450, 63100, 63700, 63840] },
  'ETH-USD': { symbol: 'ETH-USD', name: 'Ethereum', price: 3450.25, change24h: -1.15, high24h: 3520.00, low24h: 3380.00, volume: '14.2B', category: 'crypto', history: [3480, 3490, 3460, 3440, 3450] },
  'SOL-USD': { symbol: 'SOL-USD', name: 'Solana', price: 154.80, change24h: 5.80, high24h: 158.40, low24h: 146.20, volume: '4.8B', category: 'crypto', history: [148, 150, 152, 153, 154.8] },
  'NVDA': { symbol: 'NVDA', name: 'NVIDIA Corp', price: 128.45, change24h: 3.12, high24h: 130.10, low24h: 124.90, volume: '52.1M', category: 'equity', history: [125, 126, 127.5, 128, 128.45] },
  'AAPL': { symbol: 'AAPL', name: 'Apple Inc', price: 227.30, change24h: 0.65, high24h: 229.00, low24h: 225.80, volume: '48.9M', category: 'equity', history: [226, 226.5, 227, 226.8, 227.3] }
};

export default function RealtimeStudioPage() {
  const publicApiUrl = config.publicApiUrl || 'https://playground.nileslabs.com/api/v1';

  // -----------------------------------------------------------------
  // Studio State
  // -----------------------------------------------------------------
  const [activeTab, setActiveTab] = useState<RealtimeTab>('chat');
  const [activeRoom, setActiveRoom] = useState<RoomName>('general');

  // -----------------------------------------------------------------
  // 1. WebSocket Live Chat Engine
  // -----------------------------------------------------------------
  const [wsStatus, setWsStatus] = useState<'disconnected' | 'connecting' | 'connected'>('disconnected');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'seed-1',
      room: 'general',
      sender_id: 'sys',
      sender_name: 'System',
      text: 'Connected to Playground API Realtime Studio. Switch rooms or send a message to test bidirectional WebSocket broadcast.',
      created_at: new Date(Date.now() - 60000).toISOString()
    },
    {
      id: 'seed-2',
      room: 'general',
      sender_id: '2',
      sender_name: 'Ervin Howell',
      text: 'WebSocket server supports room multiplexing, typing events, and automated echo bots! 🚀',
      created_at: new Date(Date.now() - 30000).toISOString()
    }
  ]);
  const [inputMsg, setInputMsg] = useState('');
  const [latencyMs, setLatencyMs] = useState<number>(14);
  const [roomPeers, setRoomPeers] = useState<RoomPeer[]>([]);
  const [myPresence, setMyPresence] = useState<'online' | 'idle' | 'away'>('online');
  const [peerTypingStatus, setPeerTypingStatus] = useState<{ user: string; isTyping: boolean } | null>(null);

  const wsRef = useRef<WebSocket | null>(null);
  const pingStartRef = useRef<number>(0);

  // Determine WebSocket URL
  const getWsUrl = useCallback(() => {
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
  }, []);

  // Connect Native WebSocket
  const connectWebSocket = useCallback(() => {
    if (wsRef.current && (wsRef.current.readyState === WebSocket.OPEN || wsRef.current.readyState === WebSocket.CONNECTING)) {
      return;
    }

    setWsStatus('connecting');
    try {
      const url = `${getWsUrl()}?room=${activeRoom}&username=You`;
      const ws = new WebSocket(url);
      wsRef.current = ws;

      ws.onopen = () => {
        setWsStatus('connected');
        // Initial ping to measure latency
        pingStartRef.current = Date.now();
        ws.send(JSON.stringify({ type: 'ping' }));
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          const type = (data.type || '').toLowerCase();

          if (type === 'pong') {
            const delta = Date.now() - pingStartRef.current;
            setLatencyMs(delta > 0 ? delta : 12);
            return;
          }

          if (type === 'room_presence') {
            const participants = (data.participants || []).map((p: any) => ({
              ...p,
              isYou: p.id === wsRef.current?.url
            }));
            setRoomPeers(participants);
            return;
          }

          if (type === 'typing') {
            setPeerTypingStatus({
              user: data.user || 'Someone',
              isTyping: Boolean(data.isTyping)
            });
            if (!data.isTyping) {
              setTimeout(() => setPeerTypingStatus(null), 1000);
            }
            return;
          }

          if (type === 'message' || type === 'chat') {
            const isBot = data.sender_id === 'bot_assistant' || data.sender_name?.includes('Bot');
            setMessages(prev => [
              ...prev,
              {
                id: data.id || `msg-${Date.now()}`,
                room: data.room || activeRoom,
                sender_id: data.sender_id || 'anon',
                sender_name: data.sender_name || 'Anonymous',
                text: data.text || data.message || '',
                created_at: data.created_at || new Date().toISOString(),
                isBot
              }
            ]);
            return;
          }

          if (type === 'ticker') {
            handleIncomingTick(data);
            return;
          }
        } catch {
          // Ignore unparseable frames
        }
      };

      ws.onclose = () => {
        setWsStatus('disconnected');
      };

      ws.onerror = () => {
        setWsStatus('disconnected');
      };
    } catch {
      setWsStatus('disconnected');
    }
  }, [getWsUrl, activeRoom]);

  // Disconnect WebSocket
  const disconnectWebSocket = () => {
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    setWsStatus('disconnected');
  };

  // Join different room
  const handleSwitchRoom = (newRoom: RoomName) => {
    setActiveRoom(newRoom);
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type: 'join', room: newRoom, username: 'You' }));
    }
  };

  // Send Chat Message
  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputMsg.trim()) return;

    const payload = {
      type: 'chat',
      room: activeRoom,
      text: inputMsg.trim()
    };

    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(payload));
    } else {
      // Local optimistic display when offline
      setMessages(prev => [
        ...prev,
        {
          id: `local-${Date.now()}`,
          room: activeRoom,
          sender_id: 'you',
          sender_name: 'You (Offline Mode)',
          text: inputMsg.trim(),
          created_at: new Date().toISOString()
        }
      ]);
    }
    setInputMsg('');
  };

  // Change presence status
  const handleChangePresence = (status: 'online' | 'idle' | 'away') => {
    setMyPresence(status);
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type: 'presence', status, room: activeRoom }));
    }
  };

  // Auto-connect WS on mount
  useEffect(() => {
    connectWebSocket();
    return () => {
      if (wsRef.current) wsRef.current.close();
    };
  }, []);

  // Filter messages by active room
  const filteredMessages = useMemo(() => {
    return messages.filter(m => !m.room || m.room === activeRoom);
  }, [messages, activeRoom]);

  // -----------------------------------------------------------------
  // 2. High-Frequency Ticker Stream Engine
  // -----------------------------------------------------------------
  const [assets, setAssets] = useState<Record<string, TickerAsset>>(INITIAL_TICKER_DATA);
  const [tickerStreamSource, setTickerStreamSource] = useState<'sse' | 'ws'>('sse');
  const [tickerInterval, setTickerInterval] = useState<number>(1000);
  const [isTickerPaused, setIsTickerPaused] = useState<boolean>(false);
  const [flashStates, setFlashStates] = useState<Record<string, 'up' | 'down'>>({});
  const [shockLoading, setShockLoading] = useState<boolean>(false);

  const sseTickerRef = useRef<EventSource | null>(null);

  const handleIncomingTick = (tick: any) => {
    if (!tick || !tick.symbol) return;
    setAssets(prev => {
      const existing = prev[tick.symbol] || {
        symbol: tick.symbol,
        name: tick.name || tick.symbol,
        price: tick.price,
        change24h: tick.change24h || 0,
        high24h: tick.high24h || tick.price,
        low24h: tick.low24h || tick.price,
        volume: tick.volume || '10M',
        category: (tick.category as any) || 'crypto',
        history: []
      };

      const updatedHistory = [...(existing.history || []), tick.price].slice(-10);
      return {
        ...prev,
        [tick.symbol]: {
          ...existing,
          price: tick.price,
          change24h: tick.change24h !== undefined ? tick.change24h : existing.change24h,
          high24h: Math.max(existing.high24h, tick.price),
          low24h: Math.min(existing.low24h, tick.price),
          trend: tick.trend || (tick.price >= existing.price ? 'up' : 'down'),
          delta: +(tick.price - existing.price).toFixed(2),
          history: updatedHistory
        }
      };
    });

    // Trigger visual pulse
    const trend = tick.trend || (tick.delta >= 0 ? 'up' : 'down');
    setFlashStates(prev => ({ ...prev, [tick.symbol]: trend }));
    setTimeout(() => {
      setFlashStates(prev => {
        const next = { ...prev };
        delete next[tick.symbol];
        return next;
      });
    }, 600);
  };

  // Manage SSE Ticker Stream
  useEffect(() => {
    if (activeTab !== 'ticker' && activeTab !== 'sse') return;
    if (isTickerPaused) {
      if (sseTickerRef.current) {
        sseTickerRef.current.close();
        sseTickerRef.current = null;
      }
      return;
    }

    if (tickerStreamSource === 'sse') {
      const url = `${config.apiUrl}/stream/ticker?interval=${tickerInterval}`;
      const es = new EventSource(url, { withCredentials: true });
      sseTickerRef.current = es;

      es.addEventListener('ticker', (e: MessageEvent) => {
        try {
          const tick = JSON.parse(e.data);
          handleIncomingTick(tick);
        } catch {
          // Ignore
        }
      });

      return () => {
        es.close();
        sseTickerRef.current = null;
      };
    } else {
      // Stream via WebSocket
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        wsRef.current.send(JSON.stringify({
          type: 'ticker_subscribe',
          symbols: Object.keys(INITIAL_TICKER_DATA),
          interval: tickerInterval
        }));
      }
    }
  }, [activeTab, tickerStreamSource, tickerInterval, isTickerPaused]);

  // Trigger Market Shock
  const handleMarketShock = async (symbol = 'BTC-USD', direction = 'up') => {
    setShockLoading(true);
    try {
      const res = await fetch(`${config.apiUrl}/stream/ticker/shock`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ symbol, direction }),
        credentials: 'include'
      });
      const data = await res.json();
      if (data.tick) {
        handleIncomingTick(data.tick);
      }
    } catch (err) {
      console.error('Failed to trigger market shock', err);
    } finally {
      setShockLoading(false);
    }
  };

  // -----------------------------------------------------------------
  // 3. Presence & Typing Indicator Debouncer
  // -----------------------------------------------------------------
  const [typingInput, setTypingInput] = useState('');
  const [isTypingDebounced, setIsTypingDebounced] = useState(false);
  const [typingCountdown, setTypingCountdown] = useState<number>(0);
  const typingTimerRef = useRef<NodeJS.Timeout | null>(null);
  const countdownIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const handleTypingChange = (val: string) => {
    setTypingInput(val);

    if (!isTypingDebounced) {
      setIsTypingDebounced(true);
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        wsRef.current.send(JSON.stringify({ type: 'typing', room: activeRoom, isTyping: true, user: 'You' }));
      }
    }

    setTypingCountdown(1500);

    if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
    if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);

    countdownIntervalRef.current = setInterval(() => {
      setTypingCountdown(prev => Math.max(0, prev - 100));
    }, 100);

    typingTimerRef.current = setTimeout(() => {
      setIsTypingDebounced(false);
      setTypingCountdown(0);
      if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        wsRef.current.send(JSON.stringify({ type: 'typing', room: activeRoom, isTyping: false, user: 'You' }));
      }
    }, 1500);
  };

  // -----------------------------------------------------------------
  // 4. SSE Reconnection Loop Tester & Raw Frame Inspector
  // -----------------------------------------------------------------
  const [sseState, setSseState] = useState<'connected' | 'disconnected' | 'reconnecting' | 'severed'>('disconnected');
  const [sseReconnectCountdown, setSseReconnectCountdown] = useState<number>(0);
  const [sseFrames, setSseFrames] = useState<SseRawFrame[]>([
    {
      id: 'frame-1',
      eventId: '100',
      type: 'connected',
      data: '{"status": "ready", "protocol": "HTTP/2 text/event-stream"}',
      timestamp: '12:00:00',
      raw: 'id: 100\nevent: connected\nretry: 3000\ndata: {"status": "ready"}'
    }
  ]);
  const [lastReceivedEventId, setLastReceivedEventId] = useState<string>('100');
  const sseInspectorRef = useRef<EventSource | null>(null);

  const connectSseInspector = useCallback(() => {
    if (sseInspectorRef.current) sseInspectorRef.current.close();

    setSseState('connected');
    const url = `${config.apiUrl}/stream/notifications${lastReceivedEventId ? `?lastEventId=${lastReceivedEventId}` : ''}`;
    const es = new EventSource(url, { withCredentials: true });
    sseInspectorRef.current = es;

    es.onopen = () => {
      setSseState('connected');
    };

    es.addEventListener('connected', (e: MessageEvent) => {
      setSseFrames(prev => [
        {
          id: `frame-${Date.now()}`,
          eventId: e.lastEventId || undefined,
          type: 'connected',
          data: e.data,
          timestamp: new Date().toLocaleTimeString(),
          raw: `event: connected\ndata: ${e.data}`
        },
        ...prev.slice(0, 40)
      ]);
    });

    es.addEventListener('notification', (e: MessageEvent) => {
      if (e.lastEventId) setLastReceivedEventId(e.lastEventId);
      setSseFrames(prev => [
        {
          id: `frame-${Date.now()}`,
          eventId: e.lastEventId || undefined,
          type: 'notification',
          data: e.data,
          timestamp: new Date().toLocaleTimeString(),
          raw: `id: ${e.lastEventId || 'notif'}\nevent: notification\ndata: ${e.data}`
        },
        ...prev.slice(0, 40)
      ]);
    });

    es.onerror = () => {
      setSseState('reconnecting');
      setSseReconnectCountdown(3);
      const timer = setInterval(() => {
        setSseReconnectCountdown(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    };
  }, [lastReceivedEventId]);

  const severSseConnection = () => {
    if (sseInspectorRef.current) {
      sseInspectorRef.current.close();
      sseInspectorRef.current = null;
    }
    setSseState('severed');
    setSseFrames(prev => [
      {
        id: `sever-${Date.now()}`,
        type: 'error',
        data: 'Simulated connection severance! EventSource entering backoff retry state.',
        timestamp: new Date().toLocaleTimeString(),
        raw: ': CLIENT_DROPPED_CONNECTION (testing exponential backoff)'
      },
      ...prev
    ]);
  };

  useEffect(() => {
    if (activeTab === 'sse') {
      connectSseInspector();
    }
    return () => {
      if (sseInspectorRef.current) sseInspectorRef.current.close();
    };
  }, [activeTab, connectSseInspector]);

  return (
    <div className="space-y-10 w-full text-slate-900 pb-20">
      {/* 1. Header with Eyebrow Badge & Live Status Matrix */}
      <div id="overview" className="space-y-4 scroll-mt-20">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold uppercase tracking-wider border border-indigo-200">
            <Icon icon="ph:broadcast-bold" className="w-3.5 h-3.5 text-indigo-600 animate-pulse" />
            <span>Realtime &amp; WebSockets Studio</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 border border-slate-200 text-xs font-mono font-medium text-slate-700">
              <span className={`w-2 h-2 rounded-full ${wsStatus === 'connected' ? 'bg-emerald-500 animate-ping' : wsStatus === 'connecting' ? 'bg-amber-500' : 'bg-rose-500'}`} />
              <span>WS: {wsStatus.toUpperCase()}</span>
            </span>

            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 border border-slate-200 text-xs font-mono font-medium text-slate-700">
              <Icon icon="ph:timer-bold" className="w-3.5 h-3.5 text-slate-400" />
              <span>{latencyMs}ms RTT</span>
            </span>
          </div>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-[1.15]">
          Real-Time Streaming &amp; WebSockets
        </h1>

        <p className="text-slate-600 text-base sm:text-lg max-w-4xl leading-relaxed">
          Test full-duplex WebSocket channels, high-frequency stock &amp; crypto market streams, multi-room chat, presence detection, and Server-Sent Events (SSE) with automatic backoff reconnection loops.
        </p>

        {/* Studio Live Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          <div className="p-4 rounded-2xl border border-slate-200 bg-white shadow-2xs space-y-1">
            <span className="text-xs text-slate-500 font-medium">Dual Protocol</span>
            <p className="text-2xl font-extrabold text-indigo-600">WS &amp; SSE</p>
            <span className="text-[11px] text-slate-600 font-medium">Full Duplex + Push</span>
          </div>

          <div className="p-4 rounded-2xl border border-slate-200 bg-white shadow-2xs space-y-1">
            <span className="text-xs text-slate-500 font-medium">Active Room</span>
            <p className="text-2xl font-extrabold text-emerald-600">{ROOM_BLUEPRINTS[activeRoom].label}</p>
            <span className="text-[11px] text-emerald-700 font-semibold">{roomPeers.length || 3} Connected Peers</span>
          </div>

          <div className="p-4 rounded-2xl border border-slate-200 bg-white shadow-2xs space-y-1">
            <span className="text-xs text-slate-500 font-medium">Live Ticker Rate</span>
            <p className="text-2xl font-extrabold text-amber-600">{1000 / tickerInterval} Hz</p>
            <span className="text-[11px] text-amber-700 font-semibold">Every {tickerInterval}ms</span>
          </div>

          <div className="p-4 rounded-2xl border border-slate-200 bg-white shadow-2xs space-y-1">
            <span className="text-xs text-slate-500 font-medium">Reconnect Engine</span>
            <p className="text-2xl font-extrabold text-violet-600">Last-Event-ID</p>
            <span className="text-[11px] text-violet-700 font-semibold">Zero Data-Loss Resume</span>
          </div>
        </div>
      </div>

      {/* 2. Studio Workspace Tabs */}
      <div className="space-y-6">
        <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-2">
          {[
            { id: 'chat', label: 'Multi-Room Chat', icon: 'ph:chats-teardrop-bold', badge: `${filteredMessages.length}` },
            { id: 'ticker', label: 'Market Ticker Stream', icon: 'ph:trend-up-bold', badge: 'Live' },
            { id: 'presence', label: 'Presence & Typing', icon: 'ph:user-circle-gear-bold' },
            { id: 'sse', label: 'SSE Reconnect Tester', icon: 'ph:stream-bold', badge: 'SSE' },
            { id: 'recipes', label: 'Protocols & Code Recipes', icon: 'ph:code-bold' }
          ].map(tab => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as RealtimeTab)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
              }`}
            >
              <Icon icon={tab.icon} className="w-4 h-4" />
              <span>{tab.label}</span>
              {tab.badge && (
                <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                  activeTab === tab.id ? 'bg-indigo-700 text-white' : 'bg-slate-200 text-slate-700'
                }`}>
                  {tab.badge}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* ============================================================= */}
        {/* TAB 1: Multi-Room Live Chat Studio */}
        {/* ============================================================= */}
        {activeTab === 'chat' && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Room Directory Sidebar */}
            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <Icon icon="ph:hash-bold" className="w-4 h-4 text-indigo-600" />
                  Chat Rooms
                </span>
                <span className="text-[10px] bg-indigo-50 text-indigo-700 font-bold px-1.5 py-0.5 rounded">
                  {Object.keys(ROOM_BLUEPRINTS).length} Rooms
                </span>
              </div>

              <div className="space-y-1">
                {(Object.entries(ROOM_BLUEPRINTS) as [RoomName, typeof ROOM_BLUEPRINTS[RoomName]][]).map(([key, room]) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => handleSwitchRoom(key)}
                    className={`w-full p-2.5 rounded-xl text-left flex items-start gap-2.5 transition-all cursor-pointer border ${
                      activeRoom === key
                        ? 'bg-indigo-50 border-indigo-300 text-indigo-950 font-bold shadow-2xs'
                        : 'border-transparent hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <Icon icon={room.icon} className={`w-4 h-4 mt-0.5 shrink-0 ${activeRoom === key ? 'text-indigo-600' : 'text-slate-400'}`} />
                    <div className="min-w-0">
                      <p className="text-xs font-bold truncate">{room.label}</p>
                      <p className="text-[11px] text-slate-500 line-clamp-1 leading-snug">{room.desc}</p>
                    </div>
                  </button>
                ))}
              </div>

              {/* Presence Status Selector */}
              <div className="pt-3 border-t border-slate-100 space-y-2">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Your Presence:</span>
                <div className="grid grid-cols-3 gap-1">
                  {(['online', 'idle', 'away'] as const).map(st => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => handleChangePresence(st)}
                      className={`px-2 py-1 rounded-lg text-[11px] font-bold capitalize flex items-center justify-center gap-1 cursor-pointer border ${
                        myPresence === st
                          ? 'bg-slate-900 text-white border-slate-900 shadow-2xs'
                          : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border-slate-200'
                      }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${st === 'online' ? 'bg-emerald-400' : st === 'idle' ? 'bg-amber-400' : 'bg-rose-400'}`} />
                      <span>{st}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Connection Controls */}
              <div className="pt-2">
                {wsStatus === 'connected' ? (
                  <button
                    type="button"
                    onClick={disconnectWebSocket}
                    className="w-full py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold border border-rose-200 flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Icon icon="ph:plug-bold" className="w-3.5 h-3.5" />
                    <span>Disconnect Socket</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={connectWebSocket}
                    className="w-full py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <Icon icon="ph:plugs-connected-bold" className="w-3.5 h-3.5" />
                    <span>Connect WebSocket</span>
                  </button>
                )}
              </div>
            </div>

            {/* Live Chat Window */}
            <div className="lg:col-span-3 p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col h-[560px]">
              {/* Chat Header */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold">
                    <Icon icon={ROOM_BLUEPRINTS[activeRoom].icon} className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-slate-900">{ROOM_BLUEPRINTS[activeRoom].label}</h3>
                    <p className="text-[11px] text-slate-500">{ROOM_BLUEPRINTS[activeRoom].desc}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs">
                  <span className="text-[11px] font-mono text-slate-500">Endpoint: <code className="text-indigo-600 font-bold">/ws</code></span>
                  <button
                    type="button"
                    onClick={() => {
                      pingStartRef.current = Date.now();
                      wsRef.current?.send(JSON.stringify({ type: 'ping' }));
                    }}
                    className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 cursor-pointer"
                    title="Send ping to test round-trip latency"
                  >
                    <Icon icon="ph:arrows-clockwise-bold" className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Message List */}
              <div className="flex-1 overflow-y-auto py-4 space-y-3 pr-2">
                {filteredMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex items-start gap-2.5 text-xs ${msg.sender_name === 'You' ? 'justify-end' : ''}`}
                  >
                    {msg.sender_name !== 'You' && (
                      <div className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 ${
                        msg.isBot ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-700'
                      }`}>
                        {msg.isBot ? <Icon icon="ph:robot-bold" className="w-4 h-4" /> : msg.sender_name.charAt(0)}
                      </div>
                    )}

                    <div className={`max-w-[75%] rounded-2xl p-3 space-y-1 ${
                      msg.sender_name === 'You'
                        ? 'bg-indigo-600 text-white rounded-tr-xs'
                        : msg.isBot
                        ? 'bg-amber-50/80 border border-amber-200 text-amber-950 rounded-tl-xs'
                        : 'bg-slate-100 text-slate-900 rounded-tl-xs'
                    }`}>
                      <div className="flex items-center justify-between gap-3 text-[10px] opacity-75">
                        <span className="font-bold flex items-center gap-1">
                          {msg.sender_name}
                          {msg.isBot && <span className="bg-amber-200 text-amber-900 px-1 rounded text-[9px] font-extrabold uppercase">BOT</span>}
                        </span>
                        <span>{new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
                      </div>
                      <p className="text-xs leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                    </div>
                  </div>
                ))}

                {/* Peer Typing Indicator Bubble */}
                {peerTypingStatus && peerTypingStatus.isTyping && (
                  <div className="flex items-center gap-2 text-xs text-slate-500 pl-2">
                    <span className="flex gap-1 items-center">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-bounce" />
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-bounce delay-100" />
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-bounce delay-200" />
                    </span>
                    <span className="font-medium text-[11px]">{peerTypingStatus.user} is typing...</span>
                  </div>
                )}
              </div>

              {/* Quick Preset Queries Bar */}
              <div className="pt-2 pb-2 border-t border-slate-100 flex flex-wrap items-center gap-1.5 text-xs">
                <span className="text-[10px] uppercase font-bold text-slate-400">Presets:</span>
                {[
                  { label: 'Say Hello', text: 'Hello everyone from Playground Realtime Studio! 👋' },
                  { label: 'Query @bot', text: '@bot what is the current server time and system load?' },
                  { label: 'Ask Status', text: '@bot status check' },
                  { label: 'Room Switch', text: `/join ${activeRoom === 'general' ? 'support' : 'general'}` }
                ].map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setInputMsg(preset.text);
                    }}
                    className="px-2 py-0.5 rounded-md bg-slate-50 hover:bg-slate-100 border border-slate-200 text-[11px] text-slate-600 cursor-pointer"
                  >
                    {preset.label}
                  </button>
                ))}
              </div>

              {/* Message Composer Input Form */}
              <form onSubmit={handleSendMessage} className="pt-2 flex items-center gap-2">
                <input
                  type="text"
                  value={inputMsg}
                  onChange={(e) => {
                    setInputMsg(e.target.value);
                    handleTypingChange(e.target.value);
                  }}
                  placeholder={`Send message to ${ROOM_BLUEPRINTS[activeRoom].label}...`}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-slate-300 text-xs bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-slate-900"
                />
                <button
                  type="submit"
                  disabled={!inputMsg.trim()}
                  className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-xs disabled:opacity-40 transition-all"
                >
                  <Icon icon="ph:paper-plane-right-bold" className="w-4 h-4" />
                  <span>Send</span>
                </button>
              </form>
            </div>
          </div>
        )}

        {/* ============================================================= */}
        {/* TAB 2: High-Frequency Market Ticker Stream */}
        {/* ============================================================= */}
        {activeTab === 'ticker' && (
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-6">
            {/* Stream Control Toolbar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                  <Icon icon="ph:trend-up-bold" className="w-5 h-5 text-emerald-600" />
                  <span>High-Frequency Market &amp; Crypto Ticker</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Unidirectional push stream simulating live order book executions with micro-volatility and brownian random-walk pricing.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {/* Protocol Switch */}
                <div className="flex rounded-xl bg-slate-100 p-0.5 text-xs font-bold">
                  <button
                    type="button"
                    onClick={() => setTickerStreamSource('sse')}
                    className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                      tickerStreamSource === 'sse' ? 'bg-white text-indigo-700 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    SSE Stream (/ticker)
                  </button>
                  <button
                    type="button"
                    onClick={() => setTickerStreamSource('ws')}
                    className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                      tickerStreamSource === 'ws' ? 'bg-white text-indigo-700 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    WebSocket Push
                  </button>
                </div>

                {/* Pause/Resume */}
                <button
                  type="button"
                  onClick={() => setIsTickerPaused(!isTickerPaused)}
                  className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors ${
                    isTickerPaused
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
                  }`}
                >
                  <Icon icon={isTickerPaused ? 'ph:play-bold' : 'ph:pause-bold'} className="w-3.5 h-3.5" />
                  <span>{isTickerPaused ? 'Resume Stream' : 'Pause'}</span>
                </button>

                {/* Simulate Market Shock */}
                <button
                  type="button"
                  disabled={shockLoading}
                  onClick={() => handleMarketShock('BTC-USD', 'up')}
                  className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs cursor-pointer disabled:opacity-50 transition-colors"
                >
                  <Icon icon="ph:lightning-bold" className="w-3.5 h-3.5" />
                  <span>{shockLoading ? 'Injecting...' : 'Inject +5% Shock'}</span>
                </button>
              </div>
            </div>

            {/* Frequency Slider */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
              <div className="flex items-center gap-2 text-slate-700 font-semibold">
                <Icon icon="ph:gauge-bold" className="w-4 h-4 text-indigo-600" />
                <span>Streaming Frequency: <strong className="text-slate-900 font-mono">{tickerInterval}ms</strong> ({+(1000 / tickerInterval).toFixed(1)} ticks/sec)</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[11px] text-slate-500">Fast (200ms)</span>
                <input
                  type="range"
                  min="200"
                  max="2000"
                  step="100"
                  value={tickerInterval}
                  onChange={(e) => setTickerInterval(Number(e.target.value))}
                  className="w-48 cursor-pointer accent-indigo-600"
                />
                <span className="text-[11px] text-slate-500">Relaxed (2000ms)</span>
              </div>
            </div>

            {/* Asset Ticker Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3.5">
              {Object.values(assets).map((asset) => {
                const isFlashUp = flashStates[asset.symbol] === 'up';
                const isFlashDown = flashStates[asset.symbol] === 'down';
                const isPositive = asset.change24h >= 0;

                return (
                  <div
                    key={asset.symbol}
                    className={`p-4 rounded-2xl border transition-all duration-300 space-y-3 ${
                      isFlashUp
                        ? 'bg-emerald-50/90 border-emerald-400 shadow-md ring-2 ring-emerald-300/40'
                        : isFlashDown
                        ? 'bg-rose-50/90 border-rose-400 shadow-md ring-2 ring-rose-300/40'
                        : 'bg-white border-slate-200 hover:border-slate-300 shadow-2xs'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-mono font-extrabold text-sm text-slate-900">{asset.symbol}</span>
                        <p className="text-[11px] text-slate-500 truncate">{asset.name}</p>
                      </div>
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded uppercase font-mono ${
                        asset.category === 'crypto' ? 'bg-indigo-50 text-indigo-700' : 'bg-slate-100 text-slate-700'
                      }`}>
                        {asset.category}
                      </span>
                    </div>

                    <div className="space-y-0.5">
                      <p className={`text-2xl font-black font-mono tracking-tight transition-colors ${
                        isFlashUp ? 'text-emerald-700' : isFlashDown ? 'text-rose-700' : 'text-slate-900'
                      }`}>
                        ${asset.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </p>

                      <div className="flex items-center gap-1.5 text-xs font-bold">
                        <span className={`inline-flex items-center gap-0.5 ${isPositive ? 'text-emerald-600' : 'text-rose-600'}`}>
                          <Icon icon={isPositive ? 'ph:trend-up-bold' : 'ph:trend-down-bold'} className="w-3.5 h-3.5" />
                          <span>{isPositive ? '+' : ''}{asset.change24h}%</span>
                        </span>
                        {asset.delta !== undefined && (
                          <span className="text-[10px] text-slate-400 font-mono">({asset.delta > 0 ? `+$${asset.delta}` : `-$${Math.abs(asset.delta)}`})</span>
                        )}
                      </div>
                    </div>

                    {/* Mini Sparkline Bar Chart */}
                    <div className="pt-1 flex items-end gap-1 h-8">
                      {asset.history.map((val, i) => {
                        const min = Math.min(...asset.history);
                        const max = Math.max(...asset.history);
                        const range = max - min || 1;
                        const heightPercent = Math.max(15, Math.min(100, Math.round(((val - min) / range) * 100)));
                        return (
                          <div
                            key={i}
                            style={{ height: `${heightPercent}%` }}
                            className={`flex-1 rounded-xs transition-all duration-300 ${
                              isPositive ? 'bg-emerald-400' : 'bg-rose-400'
                            }`}
                            title={`$${val}`}
                          />
                        );
                      })}
                    </div>

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] font-mono text-slate-500">
                      <span>24h Vol: {asset.volume}</span>
                      <span>H: ${asset.high24h.toFixed(0)}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ============================================================= */}
        {/* TAB 3: Presence & Typing Indicator Hub */}
        {/* ============================================================= */}
        {activeTab === 'presence' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Live Participants List */}
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <Icon icon="ph:users-three-bold" className="w-4 h-4 text-indigo-600" />
                  Room Peers ({roomPeers.length || 3})
                </span>
                <span className="text-[10px] bg-emerald-50 text-emerald-700 font-bold px-1.5 py-0.5 rounded">
                  {ROOM_BLUEPRINTS[activeRoom].label}
                </span>
              </div>

              <div className="space-y-2">
                {roomPeers.map((peer, idx) => (
                  <div
                    key={peer.id || idx}
                    className="p-3 rounded-xl border border-slate-100 bg-slate-50/50 flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="relative">
                        <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-800 font-bold flex items-center justify-center text-xs">
                          {peer.isBot ? <Icon icon="ph:robot-bold" className="w-4 h-4 text-amber-600" /> : peer.username.charAt(0)}
                        </div>
                        <span className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full ring-2 ring-white ${
                          peer.status === 'online' ? 'bg-emerald-500' : peer.status === 'idle' ? 'bg-amber-500' : 'bg-rose-500'
                        }`} />
                      </div>

                      <div>
                        <p className="font-bold text-slate-900 flex items-center gap-1">
                          {peer.username}
                          {peer.isYou && <span className="text-[9px] bg-indigo-100 text-indigo-700 px-1 rounded font-bold">YOU</span>}
                        </p>
                        <p className="text-[11px] text-slate-500">{peer.role || (peer.isBot ? 'Bot Simulator' : 'Connected Peer')}</p>
                      </div>
                    </div>

                    <span className="text-[10px] font-mono capitalize px-2 py-0.5 rounded-full bg-white border border-slate-200 text-slate-600 font-bold">
                      {peer.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Interactive Debounced Typing Indicator Sandbox */}
            <div className="lg:col-span-2 p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-5">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                  <Icon icon="ph:keyboard-bold" className="w-5 h-5 text-indigo-600" />
                  <span>Real-Time Typing Indicator Debouncer</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Test keystroke debouncing to prevent socket floods. The client emits <code className="font-mono text-indigo-600">typing: true</code> on initial keystroke and automatically cancels after 1500ms of inactivity.
                </p>
              </div>

              {/* Interactive Input */}
              <div className="space-y-3">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                  Interactive Keystroke Field:
                </label>
                <textarea
                  rows={3}
                  value={typingInput}
                  onChange={(e) => handleTypingChange(e.target.value)}
                  placeholder="Type anything here to trigger live typing indicator events..."
                  className="w-full p-3 rounded-xl border border-slate-300 font-mono text-xs bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 transition-all"
                />
              </div>

              {/* Visual Debounce Monitor Card */}
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <span className={`w-2.5 h-2.5 rounded-full ${isTypingDebounced ? 'bg-emerald-500 animate-ping' : 'bg-slate-400'}`} />
                    Socket Status: <strong>{isTypingDebounced ? 'EMITTING TYPING: TRUE' : 'IDLE / SILENT'}</strong>
                  </span>
                  <span className="font-mono text-xs font-bold text-indigo-600">{typingCountdown}ms remaining</span>
                </div>

                {/* Countdown progress bar */}
                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                  <div
                    style={{ width: `${(typingCountdown / 1500) * 100}%` }}
                    className="bg-indigo-600 h-full transition-all duration-100"
                  />
                </div>
              </div>

              {/* Protocol Spec Code */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Wire Frame JSON:</span>
                <CodeBlock
                  language="json"
                  code={JSON.stringify(
                    {
                      type: 'typing',
                      room: activeRoom,
                      user: 'You',
                      isTyping: isTypingDebounced,
                      status: myPresence
                    },
                    null,
                    2
                  )}
                />
              </div>
            </div>
          </div>
        )}

        {/* ============================================================= */}
        {/* TAB 4: SSE Reconnect Loops & Resiliency Tester */}
        {/* ============================================================= */}
        {activeTab === 'sse' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Visual State Machine & Resiliency Diagram */}
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-5">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                  <Icon icon="ph:git-commit-bold" className="w-4 h-4 text-indigo-600" />
                  <span>SSE State Machine &amp; Resiliency</span>
                </h3>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  How standard EventSource handles packet drops, retry timers, and Last-Event-ID catchup.
                </p>
              </div>

              {/* State Machine Steps */}
              <div className="space-y-3 text-xs">
                {[
                  {
                    step: 1,
                    title: 'HTTP 200 Keep-Alive Handshake',
                    active: sseState === 'connected',
                    desc: 'Streams frames over persistent HTTP connection with text/event-stream header.'
                  },
                  {
                    step: 2,
                    title: 'Network Sever / Packet Drop',
                    active: sseState === 'severed',
                    desc: 'Browser detects TCP drop or server restart, firing the EventSource error event.'
                  },
                  {
                    step: 3,
                    title: 'Automatic Backoff Delay',
                    active: sseState === 'reconnecting',
                    desc: 'Browser honors retry: 3000 header and enters reconnect backoff loop.'
                  },
                  {
                    step: 4,
                    title: 'Last-Event-ID Resumption',
                    active: sseState === 'connected' && Boolean(lastReceivedEventId),
                    desc: `Client passes Last-Event-ID: ${lastReceivedEventId || '100'} to replay missed events with zero data loss.`
                  }
                ].map((s) => (
                  <div
                    key={s.step}
                    className={`p-3 rounded-xl border transition-all ${
                      s.active
                        ? 'bg-indigo-50 border-indigo-400 text-indigo-950 font-bold shadow-2xs'
                        : 'bg-slate-50 border-slate-200 text-slate-600'
                    }`}
                  >
                    <div className="flex items-center gap-2 font-bold text-xs">
                      <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
                        s.active ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-700'
                      }`}>
                        {s.step}
                      </span>
                      <span>{s.title}</span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1 pl-7 font-normal">{s.desc}</p>
                  </div>
                ))}
              </div>

              {/* Chaos Controls */}
              <div className="pt-3 border-t border-slate-100 space-y-2">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Chaos Injection:</span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={severSseConnection}
                    className="px-3 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs border border-rose-200 cursor-pointer"
                  >
                    Sever Stream
                  </button>
                  <button
                    type="button"
                    onClick={connectSseInspector}
                    className="px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs cursor-pointer"
                  >
                    Reconnect Stream
                  </button>
                </div>
              </div>
            </div>

            {/* Raw SSE Frame Inspector */}
            <div className="lg:col-span-2 p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col h-[520px]">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                    <Icon icon="ph:terminal-window-bold" className="w-4 h-4 text-slate-700" />
                    <span>Raw SSE Wire Frame Inspector</span>
                  </h3>
                  <p className="text-[11px] text-slate-500">Live inspection of incoming event stream frames:</p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                    Last-Event-ID: {lastReceivedEventId}
                  </span>
                  <button
                    type="button"
                    onClick={() => setSseFrames([])}
                    className="p-1 rounded hover:bg-slate-100 text-slate-400 hover:text-slate-700 cursor-pointer"
                    title="Clear frame log"
                  >
                    <Icon icon="ph:trash-bold" className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Frame Logs */}
              <div className="flex-1 overflow-y-auto py-3 space-y-2 font-mono text-xs pr-1">
                {sseFrames.map((frame) => (
                  <div key={frame.id} className="p-3 rounded-xl bg-slate-900 text-slate-100 space-y-1.5 shadow-2xs">
                    <div className="flex items-center justify-between text-[11px] text-slate-400 border-b border-slate-800 pb-1">
                      <span className="font-bold text-emerald-400 flex items-center gap-1.5">
                        <Icon icon="ph:stream-bold" className="w-3.5 h-3.5" />
                        event: {frame.type}
                      </span>
                      {frame.eventId && <span className="text-indigo-400">id: {frame.eventId}</span>}
                      <span>{frame.timestamp}</span>
                    </div>
                    <pre className="text-slate-300 whitespace-pre-wrap break-all text-[11px] leading-relaxed">
                      {frame.raw}
                    </pre>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ============================================================= */}
        {/* TAB 5: Protocols Comparison & Production Recipes */}
        {/* ============================================================= */}
        {activeTab === 'recipes' && (
          <div className="space-y-6">
            {/* Protocol Comparison Matrix */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
              <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                <Icon icon="ph:scales-bold" className="w-5 h-5 text-indigo-600" />
                <span>Real-Time Protocols Comparison</span>
              </h3>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left border-collapse">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase font-mono text-[10px]">
                    <tr>
                      <th className="p-3">Protocol</th>
                      <th className="p-3">Directionality</th>
                      <th className="p-3">Transport</th>
                      <th className="p-3">Auto Reconnect</th>
                      <th className="p-3">Firewall / Proxy</th>
                      <th className="p-3">Best Use Case</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    <tr>
                      <td className="p-3 font-bold text-indigo-700 font-mono">Native WebSocket (/ws)</td>
                      <td className="p-3">Bidirectional (Full Duplex)</td>
                      <td className="p-3">TCP Upgrade</td>
                      <td className="p-3 text-amber-600">Manual (Client JS)</td>
                      <td className="p-3">Requires WS support</td>
                      <td className="p-3">Multi-user chat, whiteboards, gaming</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-bold text-violet-700 font-mono">Socket.io Gateway</td>
                      <td className="p-3">Bidirectional + Rooms</td>
                      <td className="p-3">WS + Polling Fallback</td>
                      <td className="p-3 text-emerald-600 font-bold">Built-In Automatic</td>
                      <td className="p-3">High (HTTP fallback)</td>
                      <td className="p-3">Enterprise apps, flaky mobile networks</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-bold text-emerald-700 font-mono">Server-Sent Events (SSE)</td>
                      <td className="p-3">Unidirectional (Server &rarr; Client)</td>
                      <td className="p-3">Standard HTTP/2</td>
                      <td className="p-3 text-emerald-600 font-bold">Native EventSource</td>
                      <td className="p-3">100% standard HTTP</td>
                      <td className="p-3">Stock tickers, notification bells, logs</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-bold text-slate-600 font-mono">Short / Long Polling</td>
                      <td className="p-3">Simulated Push</td>
                      <td className="p-3">Repeated HTTP Requests</td>
                      <td className="p-3">Loop interval</td>
                      <td className="p-3">Universal</td>
                      <td className="p-3">Legacy systems without keep-alive</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Production React 19 Custom Hooks */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h4 className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                  <Icon icon="ph:code-bold" className="w-4 h-4 text-indigo-600" />
                  <span>Production React 19 WebSocket Hook</span>
                </h4>
                <CodeBlock
                  language="typescript"
                  code={`// hooks/useWebSocket.ts
import { useState, useEffect, useRef, useCallback } from 'react';

export function useWebSocket(url: string, room = 'general') {
  const [messages, setMessages] = useState<any[]>([]);
  const [status, setStatus] = useState<'connecting' | 'connected' | 'disconnected'>('disconnected');
  const wsRef = useRef<WebSocket | null>(null);

  const sendMessage = useCallback((text: string) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type: 'chat', room, text }));
    }
  }, [room]);

  useEffect(() => {
    setStatus('connecting');
    const ws = new WebSocket(\`\${url}?room=\${room}\`);
    wsRef.current = ws;

    ws.onopen = () => setStatus('connected');
    ws.onmessage = (e) => {
      const data = JSON.parse(e.data);
      if (data.type === 'message') {
        setMessages((prev) => [...prev, data]);
      }
    };
    ws.onclose = () => setStatus('disconnected');

    return () => ws.close();
  }, [url, room]);

  return { status, messages, sendMessage };
}`}
                />
              </div>

              <div className="space-y-3">
                <h4 className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                  <Icon icon="ph:stream-bold" className="w-4 h-4 text-emerald-600" />
                  <span>Production React 19 SSE Hook with Auto-Resume</span>
                </h4>
                <CodeBlock
                  language="typescript"
                  code={`// hooks/useServerSentEvents.ts
import { useState, useEffect, useRef } from 'react';

export function useServerSentEvents(url: string) {
  const [data, setData] = useState<any>(null);
  const [isConnected, setIsConnected] = useState(false);
  const lastIdRef = useRef<string | null>(null);

  useEffect(() => {
    const streamUrl = lastIdRef.current 
      ? \`\${url}?lastEventId=\${lastIdRef.current}\` 
      : url;

    const es = new EventSource(streamUrl, { withCredentials: true });

    es.onopen = () => setIsConnected(true);
    es.addEventListener('ticker', (e: MessageEvent) => {
      if (e.lastEventId) lastIdRef.current = e.lastEventId;
      setData(JSON.parse(e.data));
    });
    es.onerror = () => setIsConnected(false);

    return () => es.close();
  }, [url]);

  return { isConnected, data };
}`}
                />
              </div>
            </div>

            {/* Deep Dive Subpage Links */}
            <div className="p-6 rounded-2xl bg-gradient-to-r from-indigo-50 to-violet-50 border border-indigo-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h4 className="font-bold text-sm text-indigo-950">Looking for In-Depth Dedicated Guides?</h4>
                <p className="text-xs text-indigo-700 mt-0.5">Explore our standalone protocol walkthroughs and integration guides:</p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <Link
                  href="/docs/realtime/native-ws"
                  className="px-3 py-1.5 rounded-xl bg-white hover:bg-indigo-50 text-indigo-700 text-xs font-bold border border-indigo-200 transition-colors"
                >
                  Native WS (/ws)
                </Link>
                <Link
                  href="/docs/realtime/socketio"
                  className="px-3 py-1.5 rounded-xl bg-white hover:bg-indigo-50 text-indigo-700 text-xs font-bold border border-indigo-200 transition-colors"
                >
                  Socket.io Gateway
                </Link>
                <Link
                  href="/docs/realtime/presence-typing"
                  className="px-3 py-1.5 rounded-xl bg-white hover:bg-indigo-50 text-indigo-700 text-xs font-bold border border-indigo-200 transition-colors"
                >
                  Presence &amp; Typing
                </Link>
                <Link
                  href="/docs/realtime/sse-notifications"
                  className="px-3 py-1.5 rounded-xl bg-white hover:bg-indigo-50 text-indigo-700 text-xs font-bold border border-indigo-200 transition-colors"
                >
                  SSE Stream
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
