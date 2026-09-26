'use client';

import React from 'react';
import { Icon } from '@iconify/react';
import config from '@/config/env';
import { InteractiveConsole } from '@/components/docs/InteractiveConsole';

export default function AnalyticsTelemetryPage() {
  const publicApiUrl = config.publicApiUrl || 'https://playground.nileslabs.com/api/v1';

  return (
    <div className="space-y-12 w-full text-slate-900">
      {/* 1. Header */}
      <div id="overview" className="space-y-4 scroll-mt-20">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold uppercase tracking-wider border border-indigo-100">
          <Icon icon="ph:chart-line-up-bold" className="w-3.5 h-3.5" />
          <span>Realtime & WebSockets</span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-[1.15]">
          Analytics & Telemetry Ingestion
        </h1>

        <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-3xl">
          Track pageviews, button clicks, user conversion funnels, and performance beacons. Ingest events singly or in batches, and query aggregated session summaries in real time.
        </p>
      </div>

      {/* 2. Step 1: Track Single Event Beacon */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-6">
        <div className="border-b border-slate-100 pb-4">
          <h3 className="font-bold text-base text-slate-900">Step 1: Ingest Telemetry Event</h3>
          <p className="text-xs text-slate-500">
            Submit an event beacon with name, properties, and device metadata:
          </p>
        </div>

        <InteractiveConsole
          method="POST"
          path="/analytics/track"
          title="Track Event Beacon"
          initialBody={JSON.stringify(
            {
              event: 'checkout_completed',
              properties: {
                cart_total: 89.5,
                currency: 'USD',
                item_count: 3,
                coupon: 'DEV2026',
              },
              timestamp: new Date().toISOString(),
            },
            null,
            2
          )}
        />
      </div>

      {/* 3. Step 2: Query Aggregated Summary */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-6">
        <div className="border-b border-slate-100 pb-4">
          <h3 className="font-bold text-base text-slate-900">Step 2: Inspect Session Analytics Summary</h3>
          <p className="text-xs text-slate-500">
            Fetch aggregated metrics and event counts for your session:
          </p>
        </div>

        <InteractiveConsole
          method="GET"
          path="/analytics/summary"
          title="Analytics Session Summary"
        />
      </div>
    </div>
  );
}
