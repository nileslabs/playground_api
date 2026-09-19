import React from 'react';
import type { Metadata } from 'next';
import { Icon } from '@iconify/react';
import { CodeBlock } from '@/components/ui/CodeBlock';
import config from '@/config/env';
import { siteConfig } from '@/config/site';
import { LiveWebhookInspector } from '@/components/docs/LiveWebhookInspector';

export const metadata: Metadata = {
  title: 'Outgoing Webhooks Dispatcher & In-Browser Delivery Inspector — Playground API',
  description:
    'Register real webhook receiver endpoints (ngrok, local server, cloud functions) and test outgoing event dispatches with HMAC SHA-256 signatures, retry simulators, and in-browser delivery inspection.',
  keywords: [
    'webhook mock api',
    'webhook dispatcher mock server',
    'hmac sha256 webhook signature verification',
    'test webhooks react nextjs express',
    'ngrok webhook testing mock',
    'webhook delivery logs inspector',
    'simulate webhook retries idempotency',
  ],
  alternates: {
    canonical: `${siteConfig.url}/docs/webhooks`,
  },
  openGraph: {
    title: 'Outgoing Webhooks Dispatcher & Delivery Inspector — Playground API',
    description:
      'Real outgoing HTTP POST webhook dispatches with HMAC SHA-256 signatures, event filtering, and an in-browser delivery log inspector.',
    url: `${siteConfig.url}/docs/webhooks`,
    type: 'article',
  },
};

export default function WebhooksDocsPage() {
  const publicApiUrl = config.publicApiUrl || 'https://playground.nileslabs.com/api/v1';

  const expressReceiverSample = `import express from 'express';
import crypto from 'crypto';

const app = express();
const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET || 'whsec_demo_secret_key_123';

// Capture raw body for exact cryptographic HMAC verification
app.post('/api/webhooks/playground', express.raw({ type: 'application/json' }), (req, res) => {
  const signature = req.headers['x-playground-signature']; // "sha256=<hash>"
  const event = req.headers['x-playground-event'];
  const rawBody = req.body.toString('utf8');

  // Verify HMAC SHA-256 signature
  const expectedSignature = 'sha256=' + crypto
    .createHmac('sha256', WEBHOOK_SECRET)
    .update(rawBody)
    .digest('hex');

  if (signature !== expectedSignature) {
    return res.status(401).json({ error: 'Invalid HMAC signature' });
  }

  const payload = JSON.parse(rawBody);
  console.log(\`Received Webhook [\${event}]:\`, payload.data);

  // Return 200 OK to acknowledge delivery
  res.status(200).json({ received: true });
});

app.listen(3000, () => console.log('Webhook receiver running on port 3000'));`;

  const nextjsRouteSample = `// app/api/webhooks/route.ts (Next.js App Router)
import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET || 'whsec_demo_secret_key_123';

export async function POST(req: NextRequest) {
  const rawBody = await req.text();
  const signature = req.headers.get('x-playground-signature');
  const event = req.headers.get('x-playground-event');

  const expectedSignature = 'sha256=' + crypto
    .createHmac('sha256', WEBHOOK_SECRET)
    .update(rawBody)
    .digest('hex');

  if (signature !== expectedSignature) {
    return NextResponse.json({ error: 'Signature mismatch' }, { status: 401 });
  }

  const data = JSON.parse(rawBody);
  console.log(\`Processed \${event} event:\`, data);

  return NextResponse.json({ received: true });
}`;

  const pythonFastApiSample = `from fastapi import FastAPI, Request, HTTPException, Header
import hmac
import hashlib
import json

app = FastAPI()
WEBHOOK_SECRET = "whsec_demo_secret_key_123"

@app.post("/api/webhooks/playground")
async def receive_webhook(request: Request, x_playground_signature: str = Header(None)):
    raw_body = await request.body()
    
    expected_sig = "sha256=" + hmac.new(
        WEBHOOK_SECRET.encode(), raw_body, hashlib.sha256
    ).hexdigest()
    
    if not hmac.compare_digest(x_playground_signature or "", expected_sig):
        raise HTTPException(status_code=401, detail="Invalid signature")
    
    payload = json.loads(raw_body)
    print(f"Received event {payload['event']}: {payload['data']}")
    return {"status": "ok"}`;

  return (
    <div className="space-y-10">
      {/* Hero Header */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-violet-500/10 text-violet-400 border border-violet-500/30">
            <Icon icon="ph:paper-plane-tilt-bold" className="w-3.5 h-3.5" />
            Outgoing Webhook Dispatcher
          </span>
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            <Icon icon="ph:shield-check-bold" className="w-3.5 h-3.5" />
            HMAC SHA-256 Signed
          </span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Outgoing Webhooks &amp; Delivery Inspector
        </h1>
        <p className="mt-3 text-base sm:text-lg text-slate-300 leading-relaxed max-w-4xl">
          Test real webhook receivers and event-driven architectures without waiting for third-party service webhooks. Whenever a REST or GraphQL mutation occurs inside Playground API, the server dispatches a real HTTP POST request to your application or local ngrok tunnel with cryptographic <strong>HMAC SHA-256 signatures</strong> and provides an in-browser delivery inspector with retry simulation.
        </p>
      </div>

      {/* Interactive Webhook Studio */}
      <div>
        <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
          <Icon icon="ph:play-circle-bold" className="text-violet-400 w-5 h-5" />
          Interactive Webhook Inspector Studio
        </h2>
        <p className="text-sm text-slate-400 mb-4">
          Register your receiver URL, fire test pings, trigger mutations, and inspect dispatched headers, payloads, and response codes.
        </p>
        <LiveWebhookInspector />
      </div>

      {/* Dispatched Header Standards */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <Icon icon="ph:file-lock-bold" className="text-violet-400 w-6 h-6" />
          Dispatched Header Specifications
        </h2>

        <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900/60">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="border-b border-slate-800 bg-slate-950/80 font-mono text-slate-400">
              <tr>
                <th className="p-3.5">Header Name</th>
                <th className="p-3.5">Example Value</th>
                <th className="p-3.5">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              <tr>
                <td className="p-3.5 font-semibold text-violet-300">X-Playground-Signature</td>
                <td className="p-3.5 text-slate-400 truncate max-w-xs">sha256=a8c5f...4e91</td>
                <td className="p-3.5 font-sans text-slate-300">HMAC-SHA256 signature computed over raw JSON body using your secret key.</td>
              </tr>
              <tr>
                <td className="p-3.5 font-semibold text-violet-300">X-Playground-Event</td>
                <td className="p-3.5 text-slate-400">post.created</td>
                <td className="p-3.5 font-sans text-slate-300">Name of the triggered event channel (e.g. <code>post.created</code>, <code>auth.registered</code>).</td>
              </tr>
              <tr>
                <td className="p-3.5 font-semibold text-violet-300">X-Playground-Delivery</td>
                <td className="p-3.5 text-slate-400">del_89f1...2c90</td>
                <td className="p-3.5 font-sans text-slate-300">Unique delivery UUID for idempotency deduplication.</td>
              </tr>
              <tr>
                <td className="p-3.5 font-semibold text-violet-300">User-Agent</td>
                <td className="p-3.5 text-slate-400">Playground-API-Webhook-Dispatcher/1.0</td>
                <td className="p-3.5 font-sans text-slate-300">Official dispatcher user-agent identifier.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Code Recipes */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <Icon icon="ph:code-bold" className="text-violet-400 w-6 h-6" />
          Receiver Verification Recipes
        </h2>

        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-semibold text-white mb-2">1. Node.js / Express Webhook Receiver</h3>
            <CodeBlock code={expressReceiverSample} language="javascript" title="server.js (Express)" />
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white mb-2">2. Next.js App Router Webhook Route Handler</h3>
            <CodeBlock code={nextjsRouteSample} language="typescript" title="app/api/webhooks/route.ts" />
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white mb-2">3. Python FastAPI Receiver</h3>
            <CodeBlock code={pythonFastApiSample} language="python" title="main.py (FastAPI)" />
          </div>
        </div>
      </div>

      {/* Event Catalog Table */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <Icon icon="ph:broadcast-bold" className="text-violet-400 w-6 h-6" />
          Supported Event Catalog
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/60 space-y-2">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-violet-500/10 text-violet-300 text-xs font-mono">post.*</span>
              Posts Resource Events
            </h3>
            <ul className="text-xs text-slate-400 space-y-1 font-mono">
              <li>• post.created — Triggered on POST /posts</li>
              <li>• post.updated — Triggered on PUT / PATCH /posts/:id</li>
              <li>• post.deleted — Triggered on DELETE /posts/:id</li>
            </ul>
          </div>

          <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/60 space-y-2">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-violet-500/10 text-violet-300 text-xs font-mono">auth.*</span>
              Authentication Events
            </h3>
            <ul className="text-xs text-slate-400 space-y-1 font-mono">
              <li>• auth.registered — Triggered on POST /auth/register</li>
              <li>• auth.login — Triggered on POST /auth/login</li>
            </ul>
          </div>

          <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/60 space-y-2">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-violet-500/10 text-violet-300 text-xs font-mono">custom.*</span>
              Custom Dynamic Collections
            </h3>
            <ul className="text-xs text-slate-400 space-y-1 font-mono">
              <li>• custom.&lt;collection&gt;.created — POST /custom/:collection</li>
              <li>• custom.&lt;collection&gt;.updated — PUT / PATCH /custom/:collection/:id</li>
              <li>• custom.&lt;collection&gt;.deleted — DELETE /custom/:collection/:id</li>
            </ul>
          </div>

          <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/60 space-y-2">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-violet-500/10 text-violet-300 text-xs font-mono">user.* / comment.*</span>
              Users, Comments &amp; Todos
            </h3>
            <ul className="text-xs text-slate-400 space-y-1 font-mono">
              <li>• user.created / user.updated / user.deleted</li>
              <li>• comment.created / comment.updated / comment.deleted</li>
              <li>• todo.created / todo.updated / todo.deleted</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
