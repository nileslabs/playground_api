'use client';

import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import config from '@/config/env';
import { InteractiveConsole } from '@/components/docs/InteractiveConsole';
import { CodeBlock } from '@/components/ui/CodeBlock';

export default function WebhookDeliveryLogsPage() {
  const publicApiUrl = config.publicApiUrl || 'https://playground.nileslabs.com/api/v1';

  const [activePreset, setActivePreset] = useState<'deliveries' | 'logsAlias' | 'testPing'>('deliveries');

  const presets = {
    deliveries: {
      label: 'Fetch Deliveries (/deliveries)',
      desc: 'Retrieves transmission logs for all events dispatched in your session.',
      method: 'GET' as const,
      path: '/webhooks/deliveries',
      body: '',
    },
    logsAlias: {
      label: 'Fetch Logs (/logs alias)',
      desc: 'Convenient alias route for query tools expecting standard /logs syntax.',
      method: 'GET' as const,
      path: '/webhooks/logs',
      body: '',
    },
    testPing: {
      label: 'Trigger Synthetic Dispatch',
      desc: 'Fires an immediate test webhook to httpbin.org to populate delivery history.',
      method: 'POST' as const,
      path: '/webhooks/test',
      body: JSON.stringify(
        {
          url: 'https://httpbin.org/post',
          event: 'posts.created',
          data: {
            id: 201,
            title: 'Synthetic Webhook Telemetry Ping',
            category: 'telemetry',
            timestamp: '2026-09-29T12:00:00.000Z',
          },
        },
        null,
        2
      ),
    },
  };

  const sampleDeliveryLog = `{
  "id": "del_e28c5a14-41bf-4c7b-8392-127810bba104",
  "webhookId": 1,
  "webhookUrl": "https://httpbin.org/post",
  "event": "posts.created",
  "status": 200,
  "success": true,
  "durationMs": 48,
  "timestamp": "2026-09-29T12:15:50.933Z",
  "requestHeaders": {
    "Content-Type": "application/json",
    "User-Agent": "Playground-API-Webhook-Dispatcher/1.0",
    "X-Playground-Event": "posts.created",
    "X-Playground-Delivery": "del_e28c5a14-41bf-4c7b-8392-127810bba104",
    "X-Playground-Signature": "t=1759165200,v1=9a2b8e39f72b7a48d..."
  },
  "requestBody": {
    "id": "del_e28c5a14-41bf-4c7b-8392-127810bba104",
    "event": "posts.created",
    "timestamp": "2026-09-29T12:15:50.933Z",
    "data": {
      "id": 101,
      "title": "Synthetic Webhook Telemetry Ping"
    }
  },
  "responseBody": "{\\n  \\"headers\\": {\\n    \\"X-Playground-Event\\": \\"posts.created\\"\\n  }\\n}",
  "error": null
}`;

  const headersSample = `Content-Type: application/json
User-Agent: Playground-API-Webhook-Dispatcher/1.0
X-Playground-Event: posts.created
X-Playground-Delivery: del_e28c5a14-41bf-4c7b-8392-127810bba104
X-Playground-Signature: t=1759165200,v1=9a2b8e39f72b7a48d...`;

  return (
    <div className="space-y-12 w-full text-slate-900">
      {/* 1. Header with Eyebrow Badge */}
      <div id="overview" className="space-y-4 scroll-mt-20">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold uppercase tracking-wider border border-indigo-200">
          <Icon icon="ph:list-bullets-bold" className="w-3.5 h-3.5" />
          <span>Outgoing Webhooks</span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-[1.15]">
          Delivery Logs &amp; Transmission Telemetry
        </h1>

        <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-3xl">
          Inspect transmission history for every dispatched webhook event. Review delivery attempts, HTTP response status codes returned by your target receiver, round-trip latency (<code className="font-mono text-xs bg-slate-100 px-1.5 py-0.5 rounded text-indigo-600 font-bold">durationMs</code>), signed request headers, and response payloads.
        </p>
      </div>

      {/* 2. Interactive Telemetry Workbench */}
      <div id="telemetry-workbench" className="p-6 sm:p-7 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-6 scroll-mt-20">
        <div className="border-b border-slate-100 pb-4">
          <h2 className="font-bold text-base sm:text-lg text-slate-900">
            Interactive Telemetry Workbench
          </h2>
          <p className="text-sm text-slate-600">
            Query delivery history or trigger a synthetic dispatch to observe live round-trip telemetry:
          </p>
        </div>

        {/* Preset Selector Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {(['deliveries', 'logsAlias', 'testPing'] as const).map((key) => {
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

      {/* 3. Sample Delivery Record CodeBlock */}
      <div id="sample-record" className="space-y-4 scroll-mt-20">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
          Delivery Record Telemetry Structure
        </h2>
        <p className="text-sm text-slate-600 leading-relaxed max-w-3xl">
          Each transmission entry captures complete telemetry including round-trip duration, response status, full request headers with cryptographic signatures, and response payloads:
        </p>

        <CodeBlock
          tabs={[
            {
              id: 'record',
              label: 'Delivery Record JSON',
              icon: 'ph:file-code-bold',
              language: 'json',
              code: sampleDeliveryLog,
            },
            {
              id: 'headers',
              label: 'Dispatched Headers',
              icon: 'ph:list-bullets-bold',
              language: 'bash',
              code: headersSample,
            },
          ]}
          defaultTab="record"
          showHeader={true}
          copyable={true}
        />
      </div>

      {/* 4. Delivery Record Schema Reference Table */}
      <div id="schema-reference" className="space-y-4 scroll-mt-20">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
          Delivery Record Schema Reference
        </h2>
        <p className="text-sm text-slate-600">
          Field specifications returned by <code className="font-mono text-xs bg-slate-100 px-1.5 py-0.5 rounded text-indigo-600 font-bold">GET /api/v1/webhooks/deliveries</code>:
        </p>

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 border-b border-slate-200 text-xs uppercase tracking-wider text-slate-700 font-bold">
                <tr>
                  <th className="py-3.5 px-4">Field</th>
                  <th className="py-3.5 px-4">Type</th>
                  <th className="py-3.5 px-4">Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
                <tr className="hover:bg-slate-50/50">
                  <td className="py-3.5 px-4 font-mono text-xs font-bold text-indigo-700">id</td>
                  <td className="py-3.5 px-4 font-mono text-xs text-slate-500">string</td>
                  <td className="py-3.5 px-4 text-slate-600 text-xs">
                    Unique transmission UUID (<code className="font-mono text-slate-800">del_...</code>). Matches <code className="font-mono text-indigo-600">X-Playground-Delivery</code>.
                  </td>
                </tr>
                <tr className="hover:bg-slate-50/50">
                  <td className="py-3.5 px-4 font-mono text-xs font-bold text-indigo-700">webhookUrl</td>
                  <td className="py-3.5 px-4 font-mono text-xs text-slate-500">string</td>
                  <td className="py-3.5 px-4 text-slate-600 text-xs">
                    HTTP/HTTPS destination address the request was transmitted to.
                  </td>
                </tr>
                <tr className="hover:bg-slate-50/50">
                  <td className="py-3.5 px-4 font-mono text-xs font-bold text-indigo-700">status</td>
                  <td className="py-3.5 px-4 font-mono text-xs text-slate-500">number</td>
                  <td className="py-3.5 px-4 text-slate-600 text-xs">
                    HTTP status code returned by receiver (e.g. 200, 404, 500) or 0 if connection aborted/timed out.
                  </td>
                </tr>
                <tr className="hover:bg-slate-50/50">
                  <td className="py-3.5 px-4 font-mono text-xs font-bold text-indigo-700">durationMs</td>
                  <td className="py-3.5 px-4 font-mono text-xs text-slate-500">number</td>
                  <td className="py-3.5 px-4 text-slate-600 text-xs">
                    Round-trip latency in milliseconds from socket open to response completion.
                  </td>
                </tr>
                <tr className="hover:bg-slate-50/50">
                  <td className="py-3.5 px-4 font-mono text-xs font-bold text-indigo-700">requestHeaders</td>
                  <td className="py-3.5 px-4 font-mono text-xs text-slate-500">object</td>
                  <td className="py-3.5 px-4 text-slate-600 text-xs">
                    Full set of outgoing HTTP headers including HMAC signature and event topic.
                  </td>
                </tr>
                <tr className="hover:bg-slate-50/50">
                  <td className="py-3.5 px-4 font-mono text-xs font-bold text-indigo-700">responseBody</td>
                  <td className="py-3.5 px-4 font-mono text-xs text-slate-500">string</td>
                  <td className="py-3.5 px-4 text-slate-600 text-xs">
                    Captured response text returned by the receiving endpoint (truncated at 1000 characters).
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* 5. Dispatcher Operational Safeguards */}
      <div id="safeguards" className="space-y-4 scroll-mt-20">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
          Dispatcher Operational Safeguards
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-5 rounded-2xl border border-slate-200 bg-white shadow-xs space-y-2">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-amber-50 text-amber-600">
                <Icon icon="ph:timer-bold" className="w-4 h-4" />
              </span>
              <h3 className="font-bold text-sm text-slate-900">4,000ms Timeout Guard</h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Dispatches use <code className="font-mono text-slate-800">AbortSignal.timeout(4000)</code>. If the target receiver does not acknowledge within 4 seconds, the request aborts and logs status 0.
            </p>
          </div>

          <div className="p-5 rounded-2xl border border-slate-200 bg-white shadow-xs space-y-2">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600">
                <Icon icon="ph:scissors-bold" className="w-4 h-4" />
              </span>
              <h3 className="font-bold text-sm text-slate-900">Payload Truncation</h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Response text is capped at 1,000 characters to prevent accidental buffer exhaustion when target receivers dump verbose HTML stack traces.
            </p>
          </div>

          <div className="p-5 rounded-2xl border border-slate-200 bg-white shadow-xs space-y-2">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600">
                <Icon icon="ph:circle-notch-bold" className="w-4 h-4" />
              </span>
              <h3 className="font-bold text-sm text-slate-900">Session Ring Buffer</h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              The 50 most recent delivery logs are cached per visitor session, allowing instant inspection and replay across browser reloads.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
