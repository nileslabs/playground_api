'use client';

import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import config from '@/config/env';
import { InteractiveConsole } from '@/components/docs/InteractiveConsole';
import { CodeBlock } from '@/components/ui/CodeBlock';
import { DocWorkflowDiagram } from '@/components/docs/DocWorkflowDiagram';

export default function WebhookSubscriptionsPage() {
  const publicApiUrl = config.publicApiUrl || 'https://playground.nileslabs.com/api/v1';

  const [activePreset, setActivePreset] = useState<'orders' | 'auth' | 'wildcard' | 'list'>('orders');

  const presets = {
    orders: {
      label: 'Order & Payment Sync',
      desc: 'Subscribes to posts.* and payment_intent.succeeded with custom secret.',
      method: 'POST' as const,
      path: '/webhooks',
      body: JSON.stringify(
        {
          name: 'Order & Payment Sync',
          url: 'https://httpbin.org/post',
          events: ['posts.*', 'payment_intent.succeeded'],
          secret: 'whsec_orders_live_demo_9901',
          isActive: true,
        },
        null,
        2
      ),
    },
    auth: {
      label: 'Auth & User Lifecycle',
      desc: 'Subscribes to auth.login, auth.registered, and users.* profile updates.',
      method: 'POST' as const,
      path: '/webhooks',
      body: JSON.stringify(
        {
          name: 'User Lifecycle Sync',
          url: 'https://httpbin.org/post',
          events: ['auth.login', 'auth.registered', 'users.*'],
          secret: 'whsec_auth_lifecycle_demo_8820',
          isActive: true,
        },
        null,
        2
      ),
    },
    wildcard: {
      label: 'Wildcard Firehose (*)',
      desc: 'Captures all mutations and actions across the entire session sandbox.',
      method: 'POST' as const,
      path: '/webhooks',
      body: JSON.stringify(
        {
          name: 'Wildcard Event Firehose',
          url: 'https://httpbin.org/post',
          events: ['*'],
          secret: 'whsec_firehose_demo_7730',
          isActive: true,
        },
        null,
        2
      ),
    },
    list: {
      label: 'List Active Subscriptions',
      desc: 'Queries all currently registered webhook destinations in your session.',
      method: 'GET' as const,
      path: '/webhooks',
      body: '',
    },
  };

  const payloadEnvelopeSnippet = `{
  "id": "del_7f8c9b10-21a4-4a5e-88c9-9430e527d2c1",
  "event": "posts.created",
  "timestamp": "2026-09-29T12:00:00.000Z",
  "data": {
    "id": 101,
    "title": "Real-time Webhook Architectures",
    "body": "Demonstration of zero-infrastructure webhook dispatching...",
    "userId": 1
  }
}`;

  const receiverSnippet = `// Next.js App Router / Express Webhook Receiver
export async function POST(request: Request) {
  const signature = request.headers.get('X-Playground-Signature');
  const event = request.headers.get('X-Playground-Event');
  const deliveryId = request.headers.get('X-Playground-Delivery');

  const rawBody = await request.text();
  const payload = JSON.parse(rawBody);

  console.log(\`[Webhook \${deliveryId}] Received \${event}:\`, payload.data);

  // Return standard 200 OK to acknowledge receipt
  return new Response(JSON.stringify({ received: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}`;

  return (
    <div className="space-y-12 w-full text-slate-900">
      {/* 1. Header with Eyebrow Badge */}
      <div id="overview" className="space-y-4 scroll-mt-20">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold uppercase tracking-wider border border-indigo-200">
          <Icon icon="ph:webhooks-logo-bold" className="w-3.5 h-3.5" />
          <span>Outgoing Webhooks</span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-[1.15]">
          Webhook Subscriptions &amp; Event Routing
        </h1>

        <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-3xl">
          Register HTTP callback URLs to receive real-time JSON webhooks whenever resources change in your session. Filter by specific entity events (<code className="font-mono text-xs bg-slate-100 px-1.5 py-0.5 rounded text-indigo-600 font-bold">posts.created</code>, <code className="font-mono text-xs bg-slate-100 px-1.5 py-0.5 rounded text-indigo-600 font-bold">payment_intent.succeeded</code>) or category-level wildcards (<code className="font-mono text-xs bg-slate-100 px-1.5 py-0.5 rounded text-indigo-600 font-bold">posts.*</code>).
        </p>

        {/* Workflow Diagram */}
        <DocWorkflowDiagram
          src="/images/docs/workflows/webhooks-dispatcher-retry.jpg"
          alt="Playground API Webhook Dispatcher and Exponential Backoff Retry Engine Workflow Diagram"
          title="Webhook Dispatcher & Exponential Backoff Retry Engine"
          subtitle="Event-driven delivery loop: HMAC-SHA256 signature signing, asynchronous queuing, and exponential jitter retries."
          badge="Webhook Lifecycle"
          steps={[
            {
              number: 1,
              title: 'Event Trigger & Signing',
              desc: 'Sandbox mutations generate event payloads signed with HMAC-SHA256 secrets.',
              badge: 'HMAC SHA-256',
            },
            {
              number: 2,
              title: 'Asynchronous Queue Delivery',
              desc: 'Dispatches HTTP POST to destination URLs with X-Playground-Signature headers.',
              badge: 'HTTP POST',
            },
            {
              number: 3,
              title: 'Exponential Backoff Retry',
              desc: '5xx errors and timeouts trigger automated retries (attempts 1-3 with jitter).',
              badge: 'Fault Tolerant',
            },
          ]}
        />
      </div>

      {/* 2. Interactive Webhook Workbench */}
      <div id="interactive-workbench" className="p-6 sm:p-7 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-6 scroll-mt-20">
        <div className="border-b border-slate-100 pb-4">
          <h2 className="font-bold text-base sm:text-lg text-slate-900">
            Interactive Webhook Workbench
          </h2>
          <p className="text-sm text-slate-600">
            Select a preset subscription configuration or query existing session webhooks:
          </p>
        </div>

        {/* Preset Selector Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {(['orders', 'auth', 'wildcard', 'list'] as const).map((key) => {
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

      {/* 3. Supported Event Catalog */}
      <div id="event-catalog" className="space-y-4 scroll-mt-20">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
          Supported Event Catalog
        </h2>
        <p className="text-sm text-slate-600 leading-relaxed max-w-3xl">
          The Playground API publishes standardized events across all core domain entities. Subscriptions can target exact event strings or category-level wildcard prefixes:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-5 rounded-2xl border border-slate-200 bg-white shadow-xs space-y-3">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-lg bg-indigo-50 text-indigo-600">
                <Icon icon="ph:article-bold" className="w-4 h-4" />
              </span>
              <h3 className="font-bold text-sm text-slate-900">Content &amp; Post Events</h3>
            </div>
            <ul className="space-y-2 text-xs text-slate-600">
              <li className="flex items-center justify-between border-b border-slate-100 pb-1.5">
                <code className="font-mono text-indigo-600 font-bold">posts.created</code>
                <span className="text-slate-500">Triggered on POST /posts</span>
              </li>
              <li className="flex items-center justify-between border-b border-slate-100 pb-1.5">
                <code className="font-mono text-indigo-600 font-bold">posts.updated</code>
                <span className="text-slate-500">Triggered on PUT/PATCH /posts/:id</span>
              </li>
              <li className="flex items-center justify-between">
                <code className="font-mono text-indigo-600 font-bold">posts.deleted</code>
                <span className="text-slate-500">Triggered on DELETE /posts/:id</span>
              </li>
            </ul>
          </div>

          <div className="p-5 rounded-2xl border border-slate-200 bg-white shadow-xs space-y-3">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
                <Icon icon="ph:credit-card-bold" className="w-4 h-4" />
              </span>
              <h3 className="font-bold text-sm text-slate-900">Payments &amp; Financial Events</h3>
            </div>
            <ul className="space-y-2 text-xs text-slate-600">
              <li className="flex items-center justify-between border-b border-slate-100 pb-1.5">
                <code className="font-mono text-emerald-600 font-bold">payment_intent.created</code>
                <span className="text-slate-500">Intent initialized</span>
              </li>
              <li className="flex items-center justify-between border-b border-slate-100 pb-1.5">
                <code className="font-mono text-emerald-600 font-bold">payment_intent.succeeded</code>
                <span className="text-slate-500">Payment captured</span>
              </li>
              <li className="flex items-center justify-between">
                <code className="font-mono text-emerald-600 font-bold">payment_intent.payment_failed</code>
                <span className="text-slate-500">Payment declined</span>
              </li>
            </ul>
          </div>

          <div className="p-5 rounded-2xl border border-slate-200 bg-white shadow-xs space-y-3">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-lg bg-blue-50 text-blue-600">
                <Icon icon="ph:user-bold" className="w-4 h-4" />
              </span>
              <h3 className="font-bold text-sm text-slate-900">User &amp; Auth Events</h3>
            </div>
            <ul className="space-y-2 text-xs text-slate-600">
              <li className="flex items-center justify-between border-b border-slate-100 pb-1.5">
                <code className="font-mono text-blue-600 font-bold">auth.login</code>
                <span className="text-slate-500">JWT issued for user</span>
              </li>
              <li className="flex items-center justify-between border-b border-slate-100 pb-1.5">
                <code className="font-mono text-blue-600 font-bold">auth.registered</code>
                <span className="text-slate-500">New user account created</span>
              </li>
              <li className="flex items-center justify-between">
                <code className="font-mono text-blue-600 font-bold">users.updated</code>
                <span className="text-slate-500">Profile attribute mutation</span>
              </li>
            </ul>
          </div>

          <div className="p-5 rounded-2xl border border-slate-200 bg-white shadow-xs space-y-3">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-lg bg-amber-50 text-amber-600">
                <Icon icon="ph:sparkle-bold" className="w-4 h-4" />
              </span>
              <h3 className="font-bold text-sm text-slate-900">Wildcards &amp; Synthetic Events</h3>
            </div>
            <ul className="space-y-2 text-xs text-slate-600">
              <li className="flex items-center justify-between border-b border-slate-100 pb-1.5">
                <code className="font-mono text-amber-600 font-bold">*</code>
                <span className="text-slate-500">Catches every event</span>
              </li>
              <li className="flex items-center justify-between border-b border-slate-100 pb-1.5">
                <code className="font-mono text-amber-600 font-bold">posts.*</code>
                <span className="text-slate-500">All post mutations</span>
              </li>
              <li className="flex items-center justify-between">
                <code className="font-mono text-amber-600 font-bold">test.ping</code>
                <span className="text-slate-500">Ad-hoc synthetic ping</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* 4. Payload Envelope & Handler Code */}
      <div id="payload-envelope" className="space-y-4 scroll-mt-20">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
          Standard Webhook Envelope &amp; Handler
        </h2>
        <p className="text-sm text-slate-600 leading-relaxed max-w-3xl">
          Dispatched requests carry a standard JSON body and diagnostic HTTP headers (<code className="font-mono text-xs bg-slate-100 px-1 py-0.5 rounded text-indigo-600 font-bold">X-Playground-Signature</code>, <code className="font-mono text-xs bg-slate-100 px-1 py-0.5 rounded text-indigo-600 font-bold">X-Playground-Event</code>, <code className="font-mono text-xs bg-slate-100 px-1 py-0.5 rounded text-indigo-600 font-bold">X-Playground-Delivery</code>):
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <CodeBlock
            code={payloadEnvelopeSnippet}
            language="json"
            title="Outgoing JSON Envelope"
            showHeader={true}
            copyable={true}
          />
          <CodeBlock
            code={receiverSnippet}
            language="typescript"
            title="TypeScript Receiver Route"
            showHeader={true}
            copyable={true}
          />
        </div>
      </div>
    </div>
  );
}
