'use client';

import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import config from '@/config/env';
import { CodeBlock } from '@/components/ui/CodeBlock';

export default function PresenceTypingPage() {
  const [selectedUser, setSelectedUser] = useState<'Alice' | 'Bob' | 'Support Bot'>('Alice');
  const [presenceState, setPresenceState] = useState<'online' | 'idle' | 'away'>('online');
  const [isTyping, setIsTyping] = useState(true);
  const [botQueried, setBotQueried] = useState(false);

  const outgoingFrameSnippet = JSON.stringify(
    {
      type: 'typing',
      room: 'general',
      user: selectedUser,
      isTyping: isTyping,
      status: presenceState,
    },
    null,
    2
  );

  const botReplySnippet = JSON.stringify(
    {
      type: 'message',
      id: 'msg-bot-8e99a1-cb42',
      room: 'support',
      sender_id: 'bot_assistant',
      sender_name: 'Support Bot',
      text: 'Received your query: "@bot what is the current server time?". All systems operational.',
      created_at: '2026-09-29T12:00:00.000Z',
    },
    null,
    2
  );

  const debouncedTypingHookSnippet = `// React 19 Custom Typing Indicator Debouncer Hook
import { useState, useRef, useCallback, useEffect } from 'react';

export function useTypingIndicator(socket: any, room = 'general', debounceMs = 1500) {
  const [isTyping, setIsTyping] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const notifyTyping = useCallback(() => {
    if (!isTyping) {
      setIsTyping(true);
      socket?.emit('typing', { room, isTyping: true });
    }

    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      socket?.emit('typing', { room, isTyping: false });
    }, debounceMs);
  }, [socket, room, isTyping, debounceMs]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return { notifyTyping, isTyping };
}`;

  return (
    <div className="space-y-12 w-full text-slate-900">
      {/* 1. Header with Eyebrow Badge */}
      <div id="overview" className="space-y-4 scroll-mt-20">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold uppercase tracking-wider border border-indigo-200">
          <Icon icon="ph:user-circle-gear-bold" className="w-3.5 h-3.5" />
          <span>Realtime &amp; WebSockets</span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-[1.15]">
          Presence Tracking &amp; Echo Bots
        </h1>

        <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-3xl">
          Simulate real-time user presence (online/away/offline), keystroke typing indicators, and automated response echo bots in collaborative multi-user apps. Both the Native WebSocket and Socket.io gateways synchronize presence events across shared rooms.
        </p>
      </div>

      {/* 2. Interactive Presence & Bot Workbench */}
      <div id="presence-workbench" className="p-6 sm:p-7 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-6 scroll-mt-20">
        <div className="border-b border-slate-100 pb-4">
          <h2 className="font-bold text-base sm:text-lg text-slate-900">
            Interactive Presence &amp; Echo Bot Visualizer
          </h2>
          <p className="text-sm text-slate-600">
            Select a simulated participant, toggle presence state or keystroke activity, and inspect the resulting JSON frames:
          </p>
        </div>

        {/* User Card & Interactive Status Controls */}
        <div className="p-5 rounded-2xl bg-slate-50/70 border border-slate-200/80 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            {/* User Avatar & Info */}
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-12 h-12 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-base shadow-2xs">
                  {selectedUser[0]}
                </div>
                <span
                  className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-white ${
                    presenceState === 'online'
                      ? 'bg-emerald-500'
                      : presenceState === 'idle'
                      ? 'bg-amber-500'
                      : 'bg-slate-400'
                  }`}
                />
              </div>
              <div>
                <h3 className="font-bold text-sm text-slate-900">{selectedUser}</h3>
                <div className="text-xs text-slate-500 font-medium flex items-center gap-2">
                  <span>Room #general</span>
                  <span>•</span>
                  <span className="capitalize font-semibold text-indigo-700">{presenceState}</span>
                </div>
              </div>
            </div>

            {/* Action Toggles */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setIsTyping(!isTyping)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                  isTyping
                    ? 'bg-amber-100 text-amber-900 border border-amber-300 shadow-xs'
                    : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <Icon icon="ph:keyboard-bold" className="w-3.5 h-3.5" />
                <span>{isTyping ? 'Typing: ON' : 'Typing: OFF'}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  const nextState = presenceState === 'online' ? 'idle' : presenceState === 'idle' ? 'away' : 'online';
                  setPresenceState(nextState);
                }}
                className="px-3.5 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs"
              >
                <Icon icon="ph:arrows-clockwise-bold" className="w-3.5 h-3.5" />
                <span>State: {presenceState}</span>
              </button>

              <button
                type="button"
                onClick={() => setBotQueried(!botQueried)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                  botQueried
                    ? 'bg-purple-100 text-purple-900 border border-purple-300 shadow-xs'
                    : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <Icon icon="ph:robot-bold" className="w-3.5 h-3.5" />
                <span>{botQueried ? 'Echo Bot Active' : 'Query @bot'}</span>
              </button>
            </div>
          </div>

          {/* Typing Indicator Live Bubble */}
          {isTyping && (
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-slate-200/90 shadow-2xs text-xs text-slate-700 animate-fadeIn">
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-bounce" />
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-bounce [animation-delay:0.2s]" />
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-bounce [animation-delay:0.4s]" />
              </span>
              <span className="font-semibold">{selectedUser} is typing...</span>
            </div>
          )}
        </div>

        {/* Side-by-Side Equal Height CodeBlocks */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-stretch">
          <CodeBlock
            code={outgoingFrameSnippet}
            language="json"
            title="Dispatched Typing / Presence Frame"
            showHeader={true}
            copyable={true}
            initialWrap={true}
            className="h-full flex flex-col"
          />

          <CodeBlock
            code={botReplySnippet}
            language="json"
            title="Automated Echo Bot Reply Frame (@bot)"
            showHeader={true}
            copyable={true}
            initialWrap={true}
            className="h-full flex flex-col"
          />
        </div>
      </div>

      {/* 3. Presence State Machine Specification */}
      <div id="state-machine" className="space-y-4 scroll-mt-20">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
          Presence State Machine Specification
        </h2>
        <p className="text-sm text-slate-600">
          Standard presence lifecycle transitions supported across room subscribers:
        </p>

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 border-b border-slate-200 text-xs uppercase tracking-wider text-slate-700 font-bold">
                <tr>
                  <th className="py-3.5 px-4">State</th>
                  <th className="py-3.5 px-4">Indicator</th>
                  <th className="py-3.5 px-4">Trigger Condition</th>
                  <th className="py-3.5 px-4">Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
                <tr className="hover:bg-slate-50/50">
                  <td className="py-3.5 px-4 font-mono font-bold text-emerald-700">online</td>
                  <td className="py-3.5 px-4">
                    <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  </td>
                  <td className="py-3.5 px-4 text-xs font-semibold text-slate-700">Socket connection active</td>
                  <td className="py-3.5 px-4 text-slate-600 text-xs">
                    Client is connected and actively interacting with the workspace.
                  </td>
                </tr>
                <tr className="hover:bg-slate-50/50">
                  <td className="py-3.5 px-4 font-mono font-bold text-amber-700">idle</td>
                  <td className="py-3.5 px-4">
                    <span className="inline-block w-2.5 h-2.5 rounded-full bg-amber-500" />
                  </td>
                  <td className="py-3.5 px-4 text-xs font-semibold text-slate-700">300s keystroke inactivity</td>
                  <td className="py-3.5 px-4 text-slate-600 text-xs">
                    Connection remains alive but no typing or click activity detected.
                  </td>
                </tr>
                <tr className="hover:bg-slate-50/50">
                  <td className="py-3.5 px-4 font-mono font-bold text-indigo-700">away</td>
                  <td className="py-3.5 px-4">
                    <span className="inline-block w-2.5 h-2.5 rounded-full bg-indigo-500" />
                  </td>
                  <td className="py-3.5 px-4 text-xs font-semibold text-slate-700">Explicit status update</td>
                  <td className="py-3.5 px-4 text-slate-600 text-xs">
                    User manually toggled status or switched browser tab visibility.
                  </td>
                </tr>
                <tr className="hover:bg-slate-50/50">
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-500">offline</td>
                  <td className="py-3.5 px-4">
                    <span className="inline-block w-2.5 h-2.5 rounded-full bg-slate-300" />
                  </td>
                  <td className="py-3.5 px-4 text-xs font-semibold text-slate-700">Socket disconnect / timeout</td>
                  <td className="py-3.5 px-4 text-slate-600 text-xs">
                    TCP connection closed or heartbeat missed. Client removed from room set.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* 4. Client Integration Code */}
      <div id="debouncer-hook" className="space-y-4 scroll-mt-20">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
          Client Debounced Typing Hook
        </h2>
        <p className="text-sm text-slate-600">
          Prevent network flooding by debouncing typing indicators with a 1500ms timeout window:
        </p>

        <CodeBlock
          code={debouncedTypingHookSnippet}
          language="typescript"
          title="useTypingIndicator.ts"
          showHeader={true}
          copyable={true}
          initialWrap={true}
        />
      </div>
    </div>
  );
}
