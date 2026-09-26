'use client';

import React from 'react';
import { Icon } from '@iconify/react';
import config from '@/config/env';
import { InteractiveConsole } from '@/components/docs/InteractiveConsole';

export default function MessageDispatcherPage() {
  const publicApiUrl = config.publicApiUrl || 'https://playground.nileslabs.com/api/v1';

  return (
    <div className="space-y-12 w-full text-slate-900">
      {/* 1. Header */}
      <div id="overview" className="space-y-4 scroll-mt-20">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold uppercase tracking-wider border border-indigo-100">
          <Icon icon="ph:paper-plane-tilt-bold" className="w-3.5 h-3.5" />
          <span>Virtual Communications</span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-[1.15]">
          Multi-Channel Message Dispatcher
        </h1>

        <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-3xl">
          Coordinate transactional communications across Email, SMS, and In-App channels. Manage reusable template blueprints and flush communication logs cleanly.
        </p>
      </div>

      {/* 2. Step 1: Manage Reusable Email Templates */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-6">
        <div className="border-b border-slate-100 pb-4">
          <h3 className="font-bold text-base text-slate-900">Step 1: Inspect Registered Communication Templates</h3>
          <p className="text-xs text-slate-500">
            Query registered templates via <code className="font-mono text-xs">/emails/templates</code>:
          </p>
        </div>

        <InteractiveConsole
          method="GET"
          path="/emails/templates"
          title="List Communication Templates"
        />
      </div>

      {/* 3. Step 2: Clear Session Mailbox */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-6">
        <div className="border-b border-slate-100 pb-4">
          <h3 className="font-bold text-base text-slate-900">Step 2: Flush Session Communication Logs</h3>
          <p className="text-xs text-slate-500">
            Purge all received emails and SMS messages from your visitor sandbox in one click:
          </p>
        </div>

        <InteractiveConsole
          method="DELETE"
          path="/inbox"
          title="Purge Communication Inbox"
        />
      </div>
    </div>
  );
}
