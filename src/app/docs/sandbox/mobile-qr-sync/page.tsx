'use client';

import React from 'react';
import { Icon } from '@iconify/react';
import config from '@/config/env';

export default function MobileQrSyncPage() {
  const publicApiUrl = config.publicApiUrl || 'https://playground.nileslabs.com/api/v1';

  return (
    <div className="space-y-12 w-full text-slate-900">
      {/* 1. Header */}
      <div id="overview" className="space-y-4 scroll-mt-20">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold uppercase tracking-wider border border-indigo-100">
          <Icon icon="ph:qr-code-bold" className="w-3.5 h-3.5" />
          <span>Sandbox State & Health</span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-[1.15]">
          Mobile QR Code State Synchronization
        </h1>

        <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-3xl">
          Test mobile web or React Native apps with the exact same data you created on your desktop. Sync session tokens across physical devices via QR code without logging in or configuring proxies.
        </p>
      </div>

      {/* 2. QR Sync Visualizer */}
      <div className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center gap-8">
        <div className="w-36 h-36 rounded-2xl border-2 border-indigo-200 bg-slate-50 p-3 flex flex-col items-center justify-center shrink-0 shadow-inner">
          <Icon icon="ph:qr-code-bold" className="w-24 h-24 text-indigo-700" />
          <span className="text-[10px] font-mono font-bold text-slate-500 mt-1">SESSION-QR</span>
        </div>

        <div className="space-y-3">
          <h3 className="font-extrabold text-lg text-slate-900">How Cross-Device Sync Works</h3>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-xl">
            Scanning this QR code with your mobile camera automatically opens your demo application with the <code className="font-mono text-indigo-600 bg-slate-100 px-1 py-0.5 rounded text-xs">?_session_id=...</code> query parameter, binding the mobile browser to your active desktop sandbox.
          </p>
          <div className="flex items-center gap-2 text-xs text-emerald-700 font-semibold">
            <Icon icon="ph:check-circle-bold" className="w-4 h-4 text-emerald-600" />
            <span>Real-time bidirectional synchronization active</span>
          </div>
        </div>
      </div>
    </div>
  );
}
