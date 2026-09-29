'use client';

import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import config from '@/config/env';
import { InteractiveConsole } from '@/components/docs/InteractiveConsole';
import { CodeBlock } from '@/components/ui/CodeBlock';

export default function WebhookManualRetryPage() {
  const publicApiUrl = config.publicApiUrl || 'https://playground.nileslabs.com/api/v1';

  const [activePreset, setActivePreset] = useState<'synthetic' | 'redeliver' | 'retryAlias'>('synthetic');

  const presets = {
    synthetic: {
      label: 'Dispatch Synthetic Event',
      desc: 'Dispatches an on-demand test webhook to any target URL to verify receiver processing.',
      method: 'POST' as const,
      path: '/webhooks/test',
      body: JSON.stringify(
        {
          url: 'https://httpbin.org/post',
          event: 'posts.created',
          data: {
            id: 301,
            title: 'Synthetic Post Event Simulation',
            author: 'Developer Lead',
            category: 'verification',
            timestamp: '2026-09-29T12:00:00.000Z',
          },
        },
        null,
        2
      ),
    },
    redeliver: {
      label: 'Re-deliver Delivery Record',
      desc: 'Replays a past delivery attempt using its unique delivery UUID to test consumer idempotency.',
      method: 'POST' as const,
      path: '/webhooks/deliveries/del_sample_01/redeliver',
      body: '',
    },
    retryAlias: {
      label: 'Replay via /retry Alias',
      desc: 'Convenient alias route for tools and scripts expecting standard /retry syntax.',
      method: 'POST' as const,
      path: '/webhooks/deliveries/del_sample_01/retry',
      body: '',
    },
  };

  const redisIdempotencySnippet = `// Redis Idempotency Pattern for Webhook Consumers (Node.js/Express)
import Redis from 'ioredis';
const redis = new Redis(process.env.REDIS_URL);

app.post('/api/webhooks', async (req, res) => {
  const deliveryId = req.headers['x-playground-delivery'];
  if (!deliveryId) {
    return res.status(400).json({ error: 'Missing X-Playground-Delivery header' });
  }

  // 1. Atomic lock with 24-hour expiration (SETNX)
  const lockKey = \`webhook:processed:\${deliveryId}\`;
  const isNew = await redis.set(lockKey, '1', 'EX', 86400, 'NX');

  if (!isNew) {
    console.warn(\`Duplicate webhook delivery detected [\${deliveryId}]. Skipping reprocessing.\`);
    // Return 200 OK immediately so dispatcher does not retry
    return res.status(200).json({ status: 'already_processed', deliveryId });
  }

  try {
    // 2. Process domain business logic safely
    await handleEvent(req.body.event, req.body.data);
    return res.status(200).json({ status: 'success', deliveryId });
  } catch (err) {
    // Release key on fatal failure to allow legitimate manual retry
    await redis.del(lockKey);
    return res.status(500).json({ error: 'Processing failure' });
  }
});`;

  const postgresIdempotencySnippet = `-- PostgreSQL Idempotent Event Log Migration & Ingestion
CREATE TABLE IF NOT EXISTS processed_webhook_deliveries (
  delivery_id VARCHAR(64) PRIMARY KEY,
  event_name VARCHAR(64) NOT NULL,
  received_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  processed_status VARCHAR(20) NOT NULL
);

-- Ingestion Query with ON CONFLICT DO NOTHING
INSERT INTO processed_webhook_deliveries (delivery_id, event_name, processed_status)
VALUES ($1, $2, 'processed')
ON CONFLICT (delivery_id) DO NOTHING;`;

  return (
    <div className="space-y-12 w-full text-slate-900">
      {/* 1. Header with Eyebrow Badge */}
      <div id="overview" className="space-y-4 scroll-mt-20">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold uppercase tracking-wider border border-indigo-200">
          <Icon icon="ph:arrow-clockwise-bold" className="w-3.5 h-3.5" />
          <span>Outgoing Webhooks</span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-[1.15]">
          Manual Retry &amp; Synthetic Event Dispatcher
        </h1>

        <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-3xl">
          Trigger immediate synthetic webhook events on demand to test receiver handlers, or replay previously failed dispatches using the redelivery endpoint without modifying underlying database records.
        </p>
      </div>

      {/* 2. Interactive Retry Workbench */}
      <div id="retry-workbench" className="p-6 sm:p-7 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-6 scroll-mt-20">
        <div className="border-b border-slate-100 pb-4">
          <h2 className="font-bold text-base sm:text-lg text-slate-900">
            Interactive Retry &amp; Synthetic Dispatcher
          </h2>
          <p className="text-sm text-slate-600">
            Select a simulation scenario below to dispatch an ad-hoc event or replay a delivery log:
          </p>
        </div>

        {/* Preset Selector Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {(['synthetic', 'redeliver', 'retryAlias'] as const).map((key) => {
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
                  <span className="font-mono text-[11px] font-bold px-2 py-0.5 rounded bg-indigo-100 text-indigo-800">
                    {p.method} {p.path.split('/')[1] === 'test' ? '/webhooks/test' : '.../redeliver'}
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

      {/* 3. Idempotency Architecture CodeBlock */}
      <div id="idempotency-patterns" className="space-y-4 scroll-mt-20">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
          Receiver Idempotency Architecture
        </h2>
        <p className="text-sm text-slate-600 leading-relaxed max-w-3xl">
          Because network retries and manual replays can cause duplicate deliveries (&quot;at-least-once delivery&quot;), webhook receivers must record the <code className="font-mono text-xs bg-slate-100 px-1.5 py-0.5 rounded text-indigo-600 font-bold">X-Playground-Delivery</code> header before processing mutations:
        </p>

        <CodeBlock
          tabs={[
            {
              id: 'redis',
              label: 'Redis SETNX Distributed Lock',
              icon: 'simple-icons:redis',
              language: 'typescript',
              code: redisIdempotencySnippet,
            },
            {
              id: 'sql',
              label: 'PostgreSQL Unique Index',
              icon: 'simple-icons:postgresql',
              language: 'sql',
              code: postgresIdempotencySnippet,
            },
          ]}
          defaultTab="redis"
          showHeader={true}
          copyable={true}
        />
      </div>

      {/* 4. Retry Strategy Comparison Table */}
      <div id="retry-strategies" className="space-y-4 scroll-mt-20">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
          Retry Strategies &amp; Failure Recovery
        </h2>
        <p className="text-sm text-slate-600">
          Comparison of standard delivery recovery patterns in event-driven systems:
        </p>

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 border-b border-slate-200 text-xs uppercase tracking-wider text-slate-700 font-bold">
                <tr>
                  <th className="py-3.5 px-4">Pattern</th>
                  <th className="py-3.5 px-4">Trigger Mechanism</th>
                  <th className="py-3.5 px-4">Payload Guarantee</th>
                  <th className="py-3.5 px-4">Best Use Case</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
                <tr className="hover:bg-slate-50/50">
                  <td className="py-3.5 px-4 font-bold text-slate-900">
                    Automated Exponential Backoff
                  </td>
                  <td className="py-3.5 px-4 text-xs">
                    Non-2xx response or network timeout (retried at 5s, 30s, 5m, 1h).
                  </td>
                  <td className="py-3.5 px-4 text-xs font-mono text-indigo-700">
                    Same payload, new timestamp
                  </td>
                  <td className="py-3.5 px-4 text-xs text-slate-600">
                    Transient network blips, cold starts, and rolling server deployments.
                  </td>
                </tr>
                <tr className="hover:bg-slate-50/50">
                  <td className="py-3.5 px-4 font-bold text-slate-900">
                    Dead-Letter Queue (DLQ)
                  </td>
                  <td className="py-3.5 px-4 text-xs">
                    Exhaustion of maximum automated retries (e.g. after 5 failures).
                  </td>
                  <td className="py-3.5 px-4 text-xs font-mono text-indigo-700">
                    Archived immutable payload
                  </td>
                  <td className="py-3.5 px-4 text-xs text-slate-600">
                    Long-term outage isolation and manual engineering triage.
                  </td>
                </tr>
                <tr className="hover:bg-slate-50/50">
                  <td className="py-3.5 px-4 font-bold text-slate-900">
                    Manual Redelivery API
                  </td>
                  <td className="py-3.5 px-4 text-xs">
                    Explicit POST to <code className="font-mono text-slate-800">/deliveries/:id/redeliver</code>.
                  </td>
                  <td className="py-3.5 px-4 text-xs font-mono text-indigo-700">
                    Exact replay with original event
                  </td>
                  <td className="py-3.5 px-4 text-xs text-slate-600">
                    Debugging receiver bugfixes, local tunnel testing, and idempotency tests.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
