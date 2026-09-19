import React from 'react';
import type { Metadata } from 'next';
import { Icon } from '@iconify/react';
import { CodeBlock } from '@/components/ui/CodeBlock';
import config from '@/config/env';
import { siteConfig } from '@/config/site';
import { LiveAnalyticsStudio } from '@/components/docs/LiveAnalyticsStudio';

export const metadata: Metadata = {
  title: 'Mock Analytics & Event Telemetry Stream — Playground API',
  description:
    'Test PostHog, Mixpanel, Segment, and Google Analytics payloads, custom tracking hooks, batch queueing, and E2E assertions without polluting production dashboards.',
  keywords: [
    'mock analytics api',
    'event telemetry simulator',
    'posthog mock api',
    'mixpanel mock backend',
    'segment event testing',
    'track event sandbox',
    'react useAnalytics hook test',
    'playwright analytics assertion'
  ],
  alternates: {
    canonical: `${siteConfig.url}/docs/analytics`,
  },
  openGraph: {
    title: 'Mock Analytics & Event Telemetry Stream — Playground API',
    description:
      'Real-time in-browser analytics stream, batch beacon ingestion, conversion funnel simulation, and Playwright test assertions.',
    url: `${siteConfig.url}/docs/analytics`,
    type: 'article',
  },
};

export default function AnalyticsDocsPage() {
  const publicApiUrl = config.publicApiUrl || 'https://playground.nileslabs.com/api/v1';

  const singleTrackCode = `// 1. Ingest a Single Telemetry Event Beacon
fetch('${publicApiUrl}/analytics/track', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    event: 'button_clicked',
    userId: 'usr_dev_101',
    properties: {
      page: '/pricing',
      plan: 'pro_annual',
      cta_position: 'hero'
    },
    timestamp: new Date().toISOString()
  })
})
.then(res => res.json())
.then(data => {
  console.log('Event recorded:', data.event.id);
});`;

  const batchTrackCode = `// 2. Bulk Event Beacon Batching (Segment / Mixpanel Parity)
fetch('${publicApiUrl}/analytics/batch', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    batch: [
      { event: 'page_view', properties: { path: '/home' } },
      { event: 'scroll_depth', properties: { depth: '75%' } },
      { event: 'checkout_started', properties: { cartTotal: 129.00 } }
    ]
  })
})
.then(res => res.json())
.then(data => {
  console.log(\`Batch processed: \${data.summary.processed}/\${data.summary.total} events\`);
});`;

  const sdkCode = `// 3. Official TypeScript SDK Usage
import { PlaygroundClient } from 'playground-api';

const client = new PlaygroundClient({
  identityToken: 'your_sandbox_token'
});

// A. Track single event
await client.analytics.track({
  event: 'subscription_upgraded',
  userId: 'usr_alice',
  properties: { fromTier: 'free', toTier: 'enterprise' }
});

// B. Ingest batch of events
await client.analytics.batch([
  { event: 'feature_used', properties: { feature: 'dark_mode' } },
  { event: 'export_downloaded', properties: { format: 'csv' } }
]);

// C. Fetch stream summary and events
const summary = await client.analytics.summary();
console.log('Total tracked events:', summary.summary.totalEvents);

const stream = await client.analytics.list({ limit: 10 });
console.log('Latest event:', stream.data[0]);`;

  const reactHookCode = `// 4. Custom React useAnalytics() Hook with Offline Queueing
import { useEffect, useRef } from 'react';

export function useAnalytics() {
  const queue = useRef<any[]>([]);

  const track = (event: string, properties: Record<string, any> = {}) => {
    const payload = {
      event,
      properties,
      timestamp: new Date().toISOString()
    };

    // Attempt beacon dispatch
    fetch('${publicApiUrl}/analytics/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    }).catch(() => {
      // Queue offline if network error
      queue.current.push(payload);
    });
  };

  return { track };
}`;

  const playwrightCode = `// 5. Automated E2E Test Assertion (Playwright)
import { test, expect } from '@playwright/test';

test('Clicking Buy Now dispatches analytics beacon', async ({ page, request }) => {
  await page.goto('http://localhost:3000/pricing');
  await page.click('#buy-pro-btn');

  // Verify beacon arrived in Playground API sandbox
  const res = await request.get('${publicApiUrl}/analytics/events?event=button_clicked');
  const body = await res.json();

  expect(res.status()).toBe(200);
  expect(body.data.length).toBeGreaterThanOrEqual(1);
  expect(body.data[0].properties.plan).toBe('pro_annual');
});`;

  return (
    <div className="space-y-12 pb-16">
      {/* Hero Section */}
      <div className="space-y-4">
        <div className="inline-flex items-center gap-2 rounded-full border border-purple-500/20 bg-purple-500/10 px-3.5 py-1 text-xs font-semibold text-purple-400">
          <Icon icon="ph:chart-line-up-bold" className="h-3.5 w-3.5" />
          Developer Telemetry Sandbox
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl text-foreground">
          Mock Analytics & Event Telemetry Stream
        </h1>
        <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
          Test PostHog, Mixpanel, Segment, and custom event tracking beacons, validate frontend telemetry hooks, and write automated Playwright E2E assertions without polluting production dashboards.
        </p>
      </div>

      {/* Live Interactive Studio */}
      <section>
        <LiveAnalyticsStudio />
      </section>

      {/* Value Pillars */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-xl border border-border/60 bg-muted/20 p-5 space-y-2">
          <div className="flex items-center gap-2 text-purple-400 font-semibold text-sm">
            <Icon icon="ph:shield-slash-bold" className="h-4 w-4" />
            Zero Dashboard Pollution
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Keep your real PostHog, Mixpanel, and Google Analytics clean. Run dev builds, tests, and CI pipelines against an isolated mock telemetry endpoint.
          </p>
        </div>

        <div className="rounded-xl border border-border/60 bg-muted/20 p-5 space-y-2">
          <div className="flex items-center gap-2 text-blue-400 font-semibold text-sm">
            <Icon icon="ph:stack-bold" className="h-4 w-4" />
            Batch & Beacon Ingestion
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Supports both single <code className="text-blue-300 font-mono">/analytics/track</code> calls and bulk <code className="text-blue-300 font-mono">/analytics/batch</code> payloads up to 50 events per batch.
          </p>
        </div>

        <div className="rounded-xl border border-border/60 bg-muted/20 p-5 space-y-2">
          <div className="flex items-center gap-2 text-emerald-400 font-semibold text-sm">
            <Icon icon="ph:check-square-bold" className="h-4 w-4" />
            Automated E2E Assertions
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Query <code className="text-emerald-300 font-mono">GET /analytics/events</code> in Playwright or Cypress to assert that specific business events and metadata were dispatched.
          </p>
        </div>
      </div>

      {/* Code Examples & Recipes */}
      <section className="space-y-8">
        <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
          <Icon icon="ph:code-bold" className="h-5 w-5 text-purple-400" />
          Integration Recipes & Usage
        </h2>

        {/* 1. Single Event Track */}
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-foreground">1. Ingest Single Event Beacon</h3>
          <p className="text-xs text-muted-foreground">
            Dispatches a single event payload containing event name, user ID, properties, and timestamp.
          </p>
          <CodeBlock code={singleTrackCode} language="javascript" />
        </div>

        {/* 2. Batch Ingestion */}
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-foreground">2. Bulk Batch Ingestion (Segment / Mixpanel Parity)</h3>
          <p className="text-xs text-muted-foreground">
            Send an array of events in a single HTTP request for offline queue flushes and SDK periodic syncs.
          </p>
          <CodeBlock code={batchTrackCode} language="javascript" />
        </div>

        {/* 3. TypeScript SDK */}
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-foreground">3. Official TypeScript SDK</h3>
          <p className="text-xs text-muted-foreground">
            Type-safe analytics methods with automatic session identity routing.
          </p>
          <CodeBlock code={sdkCode} language="typescript" />
        </div>

        {/* 4. React useAnalytics Hook */}
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-foreground">4. React Custom useAnalytics() Hook</h3>
          <p className="text-xs text-muted-foreground">
            Lightweight client-side telemetry hook with offline retry queueing.
          </p>
          <CodeBlock code={reactHookCode} language="tsx" />
        </div>

        {/* 5. Playwright Assertion */}
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-foreground">5. Playwright E2E Test Assertion</h3>
          <p className="text-xs text-muted-foreground">
            Verify that critical conversion funnels and user actions trigger the expected tracking telemetry.
          </p>
          <CodeBlock code={playwrightCode} language="typescript" />
        </div>
      </section>

      {/* Endpoints Table */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
          <Icon icon="ph:compass-bold" className="h-5 w-5 text-purple-400" />
          Analytics API Reference
        </h2>
        <div className="overflow-x-auto rounded-xl border border-border/60 bg-card/40">
          <table className="w-full text-left text-xs font-mono">
            <thead className="border-b border-border/60 bg-muted/40 text-muted-foreground font-semibold">
              <tr>
                <th className="py-3 px-4">Method</th>
                <th className="py-3 px-4">Endpoint</th>
                <th className="py-3 px-4 font-sans">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              <tr>
                <td className="py-3 px-4 text-emerald-400 font-bold">POST</td>
                <td className="py-3 px-4 text-foreground">/api/v1/analytics/track</td>
                <td className="py-3 px-4 font-sans text-muted-foreground">Ingest a single event beacon with properties and traits.</td>
              </tr>
              <tr>
                <td className="py-3 px-4 text-emerald-400 font-bold">POST</td>
                <td className="py-3 px-4 text-foreground">/api/v1/analytics/batch</td>
                <td className="py-3 px-4 font-sans text-muted-foreground">Ingest a batch of up to 50 event beacons atomically.</td>
              </tr>
              <tr>
                <td className="py-3 px-4 text-blue-400 font-bold">GET</td>
                <td className="py-3 px-4 text-foreground">/api/v1/analytics/events</td>
                <td className="py-3 px-4 font-sans text-muted-foreground">List recorded telemetry stream with filtering (?event=..., ?userId=...).</td>
              </tr>
              <tr>
                <td className="py-3 px-4 text-blue-400 font-bold">GET</td>
                <td className="py-3 px-4 text-foreground">/api/v1/analytics/summary</td>
                <td className="py-3 px-4 font-sans text-muted-foreground">Get aggregated metrics, unique users count, and top events breakdown.</td>
              </tr>
              <tr>
                <td className="py-3 px-4 text-rose-400 font-bold">DELETE</td>
                <td className="py-3 px-4 text-foreground">/api/v1/analytics/events</td>
                <td className="py-3 px-4 font-sans text-muted-foreground">Clear all recorded analytics events for this session sandbox.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
