'use client';

import React from 'react';
import { Icon } from '@iconify/react';
import config from '@/config/env';
import { InteractiveConsole } from '@/components/docs/InteractiveConsole';

export default function WebhookManualRetryPage() {
  const publicApiUrl = config.publicApiUrl || 'https://playground.nileslabs.com/api/v1';

  return (
    <div className="space-y-12 w-full text-slate-900">
      {/* 1. Header */}
      <div id="overview" className="space-y-4 scroll-mt-20">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold uppercase tracking-wider border border-indigo-100">
          <Icon icon="ph:arrow-clockwise-bold" className="w-3.5 h-3.5" />
          <span>Outgoing Webhooks</span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-[1.15]">
          Manual Retry & Synthetic Event Dispatch
        </h1>

        <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-3xl">
          Trigger immediate synthetic webhook events on demand to test receiver handlers, or replay previously failed dispatches without modifying underlying database records.
        </p>
      </div>

      {/* 2. Step 1: Fire Synthetic Test Webhook */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-6">
        <div className="border-b border-slate-100 pb-4">
          <h3 className="font-bold text-base text-slate-900">Step 1: Fire Synthetic Webhook Event</h3>
          <p className="text-xs text-slate-500">
            Dispatch a test webhook event immediately to all registered subscribers:
          </p>
        </div>

        <InteractiveConsole
          method="POST"
          path="/webhooks/test"
          title="Fire Synthetic Webhook"
          initialBody={JSON.stringify(
            {
              event: 'posts.created',
              data: {
                id: 999,
                title: 'Synthetic Webhook Verification Post',
                userId: 1,
              },
            },
            null,
            2
          )}
        />
      </div>

      {/* 3. Step 2: Retry Specific Delivery Attempt */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-6">
        <div className="border-b border-slate-100 pb-4">
          <h3 className="font-bold text-base text-slate-900">Step 2: Replay Specific Delivery Log</h3>
          <p className="text-xs text-slate-500">
            Replay a failed transmission using its log ID:
          </p>
        </div>

        <InteractiveConsole
          method="POST"
          path="/webhooks/logs/sample-log-id/retry"
          title="Retry Failed Dispatch"
        />
      </div>
    </div>
  );
}
