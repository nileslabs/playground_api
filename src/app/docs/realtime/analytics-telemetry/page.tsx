'use client';

import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import config from '@/config/env';
import { InteractiveConsole } from '@/components/docs/InteractiveConsole';
import { CodeBlock } from '@/components/ui/CodeBlock';

export default function AnalyticsTelemetryPage() {
  const publicApiUrl = config.publicApiUrl || 'https://playground.nileslabs.com/api/v1';

  const [activePreset, setActivePreset] = useState<'pageview' | 'checkout' | 'batch' | 'summary'>('pageview');

  const presets = {
    pageview: {
      label: 'Track Pageview Beacon',
      desc: 'Ingests a single pageview event with route path, referrer, and user device properties.',
      method: 'POST' as const,
      path: '/analytics/track',
      body: JSON.stringify(
        {
          event: 'pageview',
          properties: {
            path: '/docs/realtime/analytics-telemetry',
            referrer: 'https://google.com',
            viewport: '1920x1080',
          },
          timestamp: '2026-09-29T12:00:00.000Z',
        },
        null,
        2
      ),
    },
    checkout: {
      label: 'Track Checkout Completed',
      desc: 'Records an e-commerce conversion event with revenue, currency, and cart metadata.',
      method: 'POST' as const,
      path: '/analytics/track',
      body: JSON.stringify(
        {
          event: 'checkout_completed',
          properties: {
            cart_total: 149.99,
            currency: 'USD',
            item_count: 2,
            coupon: 'PLAYGROUND2026',
          },
          timestamp: '2026-09-29T12:00:00.000Z',
        },
        null,
        2
      ),
    },
    batch: {
      label: 'Batch Telemetry Ingestion',
      desc: 'Transmits multiple buffered telemetry events in a single HTTP POST request.',
      method: 'POST' as const,
      path: '/analytics/batch',
      body: JSON.stringify(
        {
          events: [
            {
              event: 'button_clicked',
              properties: { button_id: 'btn_hero_cta', label: 'Start Free' },
              timestamp: '2026-09-29T12:00:01.000Z',
            },
            {
              event: 'search_performed',
              properties: { query: 'WebSockets', results_count: 8 },
              timestamp: '2026-09-29T12:00:03.000Z',
            },
          ],
        },
        null,
        2
      ),
    },
    summary: {
      label: 'Session Analytics Summary',
      desc: 'Retrieves aggregated metrics, total events, and breakdown by event category.',
      method: 'GET' as const,
      path: '/analytics/summary',
      body: '',
    },
  };

  const sendBeaconSnippet = `// Browser Telemetry with navigator.sendBeacon (Guaranteed On-Unload)
export function trackBeacon(eventName: string, properties: Record<string, any> = {}) {
  const url = '${publicApiUrl}/analytics/track';
  const payload = JSON.stringify({
    event: eventName,
    properties,
    timestamp: new Date().toISOString(),
  });

  if (typeof navigator !== 'undefined' && navigator.sendBeacon) {
    const blob = new Blob([payload], { type: 'application/json' });
    navigator.sendBeacon(url, blob);
  } else {
    fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: payload,
      keepalive: true,
    }).catch(() => {});
  }
}`;

  const batchTrackerSnippet = `// Production Batch Telemetry Queue
class TelemetryQueue {
  private queue: any[] = [];
  private flushTimer: any = null;

  track(event: string, properties: Record<string, any> = {}) {
    this.queue.push({
      event,
      properties,
      timestamp: new Date().toISOString(),
    });

    if (this.queue.length >= 10) {
      this.flush();
    } else if (!this.flushTimer) {
      this.flushTimer = setTimeout(() => this.flush(), 5000);
    }
  }

  async flush() {
    if (this.flushTimer) clearTimeout(this.flushTimer);
    this.flushTimer = null;
    if (this.queue.length === 0) return;

    const batch = [...this.queue];
    this.queue = [];

    await fetch('${publicApiUrl}/analytics/batch', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ events: batch }),
    });
  }
}

export const telemetry = new TelemetryQueue();`;

  return (
    <div className="space-y-12 w-full text-slate-900">
      {/* 1. Header with Eyebrow Badge */}
      <div id="overview" className="space-y-4 scroll-mt-20">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold uppercase tracking-wider border border-indigo-200">
          <Icon icon="ph:chart-line-up-bold" className="w-3.5 h-3.5" />
          <span>Realtime &amp; WebSockets</span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-[1.15]">
          Analytics &amp; Telemetry Ingestion
        </h1>

        <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-3xl">
          Track pageviews, button clicks, user conversion funnels, and performance beacons. Ingest events singly or in batches, and query aggregated session summaries in real time without external analytics vendor tracking.
        </p>
      </div>

      {/* 2. Interactive Telemetry Workbench */}
      <div id="analytics-workbench" className="p-6 sm:p-7 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-6 scroll-mt-20">
        <div className="border-b border-slate-100 pb-4">
          <h2 className="font-bold text-base sm:text-lg text-slate-900">
            Interactive Telemetry Workbench
          </h2>
          <p className="text-sm text-slate-600">
            Select a telemetry scenario below to send live tracking beacons or inspect aggregated session metrics:
          </p>
        </div>

        {/* Preset Selector Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {(['pageview', 'checkout', 'batch', 'summary'] as const).map((key) => {
            const p = presets[key];
            const isActive = activePreset === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => setActivePreset(key)}
                className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                  isActive
                    ? 'bg-indigo-50/80 border-indigo-300 ring-2 ring-indigo-500/20 shadow-xs'
                    : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/60 shadow-2xs'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span
                    className={`font-mono text-[11px] font-bold px-2 py-0.5 rounded ${
                      p.method === 'GET'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-indigo-100 text-indigo-800'
                    }`}
                  >
                    {p.method} {p.path}
                  </span>
                </div>
                <h3 className="font-bold text-sm text-slate-900">{p.label}</h3>
                <p className="text-xs text-slate-600 mt-1 line-clamp-2 leading-relaxed">{p.desc}</p>
              </button>
            );
          })}
        </div>

        {/* Embedded Interactive Console */}
        <InteractiveConsole
          key={activePreset}
          method={presets[activePreset].method}
          path={presets[activePreset].path}
          initialBody={presets[activePreset].body}
          title={presets[activePreset].label}
          description={presets[activePreset].desc}
        />
      </div>

      {/* 3. Event Schema Reference Table */}
      <div id="schema-table" className="space-y-4 scroll-mt-20">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
          Telemetry Event Payload Schema
        </h2>
        <p className="text-sm text-slate-600">
          The <code className="font-mono text-xs bg-slate-100 px-1.5 py-0.5 rounded text-indigo-600 font-bold">/analytics/track</code> endpoint accepts structured JSON beacons:
        </p>

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 border-b border-slate-200 text-xs uppercase tracking-wider text-slate-700 font-bold">
                <tr>
                  <th className="py-3.5 px-4">Field</th>
                  <th className="py-3.5 px-4">Type</th>
                  <th className="py-3.5 px-4">Required</th>
                  <th className="py-3.5 px-4">Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
                <tr className="hover:bg-slate-50/50">
                  <td className="py-3.5 px-4 font-mono text-xs font-bold text-indigo-700">event</td>
                  <td className="py-3.5 px-4 font-mono text-xs text-slate-500">string</td>
                  <td className="py-3.5 px-4 font-semibold text-emerald-700">Yes</td>
                  <td className="py-3.5 px-4 text-slate-600 text-xs">
                    Unique event identifier (e.g. <code className="font-mono text-slate-800">pageview</code>, <code className="font-mono text-slate-800">checkout_completed</code>).
                  </td>
                </tr>
                <tr className="hover:bg-slate-50/50">
                  <td className="py-3.5 px-4 font-mono text-xs font-bold text-indigo-700">properties</td>
                  <td className="py-3.5 px-4 font-mono text-xs text-slate-500">object</td>
                  <td className="py-3.5 px-4 font-semibold text-slate-500">Optional</td>
                  <td className="py-3.5 px-4 text-slate-600 text-xs">
                    Arbitrary key-value metadata dictionary (route path, currency, user agent).
                  </td>
                </tr>
                <tr className="hover:bg-slate-50/50">
                  <td className="py-3.5 px-4 font-mono text-xs font-bold text-indigo-700">timestamp</td>
                  <td className="py-3.5 px-4 font-mono text-xs text-slate-500">string (ISO-8601)</td>
                  <td className="py-3.5 px-4 font-semibold text-slate-500">Optional</td>
                  <td className="py-3.5 px-4 text-slate-600 text-xs">
                    Client-side event capture time (defaults to server receipt time if omitted).
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* 4. Client Integration Recipes */}
      <div id="code-recipes" className="space-y-4 scroll-mt-20">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
          Client Integration Code
        </h2>
        <p className="text-sm text-slate-600">
          Production patterns for guaranteed unload delivery and batching:
        </p>

        <CodeBlock
          tabs={[
            {
              id: 'beacon',
              label: 'navigator.sendBeacon',
              icon: 'simple-icons:javascript',
              language: 'typescript',
              code: sendBeaconSnippet,
            },
            {
              id: 'queue',
              label: 'Batched Telemetry Queue',
              icon: 'simple-icons:typescript',
              language: 'typescript',
              code: batchTrackerSnippet,
            },
          ]}
          defaultTab="beacon"
          showHeader={true}
          copyable={true}
          initialWrap={true}
        />
      </div>
    </div>
  );
}
