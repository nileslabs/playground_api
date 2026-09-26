'use client';

import React from 'react';
import { Icon } from '@iconify/react';
import config from '@/config/env';
import { InteractiveConsole } from '@/components/docs/InteractiveConsole';

export default function InAppMessagesPage() {
  const publicApiUrl = config.publicApiUrl || 'https://playground.nileslabs.com/api/v1';

  return (
    <div className="space-y-12 w-full text-slate-900">
      {/* 1. Header */}
      <div id="overview" className="space-y-4 scroll-mt-20">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold uppercase tracking-wider border border-indigo-100">
          <Icon icon="ph:bell-ringing-bold" className="w-3.5 h-3.5" />
          <span>Virtual Communications</span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-[1.15]">
          In-App Notifications & Alerts
        </h1>

        <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-3xl">
          Manage toast alerts, notification dropdowns, and user announcements. Create notifications with severity tags, read/unread states, and action URLs.
        </p>
      </div>

      {/* 2. Interactive In-App Creator */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-6">
        <div className="border-b border-slate-100 pb-4">
          <h3 className="font-bold text-base text-slate-900">Step 1: Broadcast In-App Message</h3>
          <p className="text-xs text-slate-500">
            Publish an alert with title, priority level, and link action:
          </p>
        </div>

        <InteractiveConsole
          method="POST"
          path="/messages"
          title="Create In-App Message"
          initialBody={JSON.stringify(
            {
              title: 'Scheduled Maintenance Notice',
              content: 'Our database upgrade will take place on Sunday at 02:00 UTC.',
              type: 'warning',
              read: false,
              actionUrl: '/docs/status',
            },
            null,
            2
          )}
        />
      </div>

      {/* 3. List In-App Messages */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-6">
        <div className="border-b border-slate-100 pb-4">
          <h3 className="font-bold text-base text-slate-900">Step 2: List User Notifications</h3>
          <p className="text-xs text-slate-500">
            Query the user&apos;s notification feed:
          </p>
        </div>

        <InteractiveConsole
          method="GET"
          path="/messages"
          title="List In-App Notifications"
        />
      </div>
    </div>
  );
}
