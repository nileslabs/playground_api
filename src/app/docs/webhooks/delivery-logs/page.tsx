'use client';

import React from 'react';
import { Icon } from '@iconify/react';
import config from '@/config/env';
import { InteractiveConsole } from '@/components/docs/InteractiveConsole';

export default function WebhookDeliveryLogsPage() {
  const publicApiUrl = config.publicApiUrl || 'https://playground.nileslabs.com/api/v1';

  return (
    <div className="space-y-12 w-full text-slate-900">
      {/* 1. Header */}
      <div id="overview" className="space-y-4 scroll-mt-20">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold uppercase tracking-wider border border-indigo-100">
          <Icon icon="ph:list-bullets-bold" className="w-3.5 h-3.5" />
          <span>Outgoing Webhooks</span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-[1.15]">
          Webhook Delivery Logs
        </h1>

        <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-3xl">
          Inspect transmission history for every dispatched event. Review delivery attempts, HTTP response status codes returned by your target server, round-trip latency, and request payloads.
        </p>
      </div>

      {/* 2. Interactive Delivery Log Runner */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-6">
        <div className="border-b border-slate-100 pb-4">
          <h3 className="font-bold text-base text-slate-900">Query Transmission History</h3>
          <p className="text-xs text-slate-500">
            Fetch recent delivery attempts from <code className="font-mono text-xs">/webhooks/logs</code>:
          </p>
        </div>

        <InteractiveConsole
          method="GET"
          path="/webhooks/logs"
          title="Fetch Delivery Logs"
        />
      </div>

      {/* 3. Delivery Log Fields */}
      <div id="log-schema" className="space-y-4 scroll-mt-20">
        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
          Delivery Record Schema
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="p-5 rounded-2xl border border-slate-200 bg-white shadow-xs space-y-2">
            <h3 className="font-bold text-sm text-slate-900">response_status</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              HTTP status code returned by your webhook endpoint (e.g. 200, 404, 500, or 0 if connection timed out).
            </p>
          </div>

          <div className="p-5 rounded-2xl border border-slate-200 bg-white shadow-xs space-y-2">
            <h3 className="font-bold text-sm text-slate-900">attempt_number</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              The transmission retry attempt index (1 for initial dispatch, 2-5 for automated exponential retries).
            </p>
          </div>

          <div className="p-5 rounded-2xl border border-slate-200 bg-white shadow-xs space-y-2">
            <h3 className="font-bold text-sm text-slate-900">latency_ms</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Time in milliseconds between opening socket connection to receiving HTTP response headers.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
