'use client';

import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import config from '@/config/env';

export default function PresenceTypingPage() {
  const [isTyping, setIsTyping] = useState(false);
  const [simulatedUser, setSimulatedUser] = useState<'Alice' | 'Bob' | 'PlaygroundBot'>('Alice');

  return (
    <div className="space-y-12 w-full text-slate-900">
      {/* 1. Header */}
      <div id="overview" className="space-y-4 scroll-mt-20">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold uppercase tracking-wider border border-indigo-100">
          <Icon icon="ph:user-circle-gear-bold" className="w-3.5 h-3.5" />
          <span>Realtime & WebSockets</span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-[1.15]">
          Presence Tracking & Echo Bots
        </h1>

        <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-3xl">
          Simulate real-time user presence (online/away/offline), keystroke typing indicators, and automated response echo bots in collaborative multi-user apps.
        </p>
      </div>

      {/* 2. Interactive Presence Visualizer */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-6">
        <div className="border-b border-slate-100 pb-4">
          <h3 className="font-bold text-base text-slate-900">Simulate Typing Activity</h3>
          <p className="text-xs text-slate-500">Toggle typing status to preview real-time indicator bubbles:</p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-sm">
                  {simulatedUser[0]}
                </div>
                <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-slate-900">{simulatedUser}</h4>
                <div className="text-xs text-slate-500">Online • In Room #general</div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsTyping(!isTyping)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                isTyping
                  ? 'bg-amber-100 text-amber-800 border border-amber-200'
                  : 'bg-indigo-600 text-white shadow-xs'
              }`}
            >
              {isTyping ? 'Stop Typing' : 'Simulate Typing'}
            </button>
          </div>

          {/* Typing Indicator Bubble */}
          {isTyping && (
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-slate-200 shadow-2xs text-xs text-slate-600">
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-bounce" />
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-bounce [animation-delay:0.2s]" />
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-bounce [animation-delay:0.4s]" />
              </span>
              <span className="font-medium">{simulatedUser} is typing...</span>
            </div>
          )}
        </div>
      </div>

      {/* 3. Echo Bot Feature */}
      <div id="echo-bot" className="space-y-4 scroll-mt-20">
        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
          Built-in Playground Echo Bot
        </h2>

        <div className="p-6 rounded-2xl border border-slate-200 bg-white shadow-xs space-y-3">
          <p className="text-sm text-slate-600 leading-relaxed">
            When connecting to the WebSocket server, send a message containing <code className="font-mono text-xs bg-slate-100 px-1 py-0.5 rounded text-indigo-600">@bot</code> to trigger an immediate automated AI response:
          </p>
          <div className="p-3.5 rounded-xl bg-slate-900 font-mono text-xs text-emerald-400">
            &gt; &quot;@bot what is the current server time?&quot;<br />
            &lt; &quot;Hello! Server time is 2026-09-27T02:13:00Z. All systems operational.&quot;
          </div>
        </div>
      </div>
    </div>
  );
}
