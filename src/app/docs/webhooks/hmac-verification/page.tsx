'use client';

import React from 'react';
import { Icon } from '@iconify/react';
import config from '@/config/env';

export default function HmacVerificationPage() {
  const nodeSnippet = `import crypto from 'crypto';

export function verifyWebhookSignature(payload, signatureHeader, secret) {
  // 1. Extract timestamp and signature hash
  const parts = signatureHeader.split(',');
  const timestamp = parts.find(p => p.startsWith('t='))?.split('=')[1];
  const receivedSig = parts.find(p => p.startsWith('v1='))?.split('=')[1];

  if (!timestamp || !receivedSig) {
    throw new Error('Invalid signature header format');
  }

  // 2. Prevent replay attacks (check timestamp drift within 5 minutes)
  const fiveMinutesAgo = Math.floor(Date.now() / 1000) - 300;
  if (parseInt(timestamp, 10) < fiveMinutesAgo) {
    throw new Error('Timestamp too old, potential replay attack');
  }

  // 3. Recompute HMAC SHA-256
  const signedPayload = \`\${timestamp}.\${typeof payload === 'string' ? payload : JSON.stringify(payload)}\`;
  const expectedSig = crypto
    .createHmac('sha256', secret)
    .update(signedPayload)
    .digest('hex');

  // 4. Constant-time equality comparison
  return crypto.timingSafeEqual(Buffer.from(receivedSig), Buffer.from(expectedSig));
}`;

  return (
    <div className="space-y-12 w-full text-slate-900">
      {/* 1. Header */}
      <div id="overview" className="space-y-4 scroll-mt-20">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold uppercase tracking-wider border border-indigo-100">
          <Icon icon="ph:fingerprint-bold" className="w-3.5 h-3.5" />
          <span>Outgoing Webhooks</span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-[1.15]">
          HMAC SHA-256 Signatures & Replay Protection
        </h1>

        <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-3xl">
          Every outgoing webhook payload sent by Playground API includes a cryptographic signature in the <code className="font-mono text-xs bg-slate-100 px-1 py-0.5 rounded text-indigo-600">X-Playground-Signature</code> header. Verify payloads to ensure authenticity and defend against replay attacks.
        </p>
      </div>

      {/* 2. Signature Header Breakdown */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
        <h3 className="font-bold text-base text-slate-900">Header Structure</h3>
        <div className="p-3.5 rounded-xl bg-slate-900 font-mono text-xs text-indigo-300 overflow-x-auto">
          X-Playground-Signature: t=1758932400,v1=9a2b8e39f72b7a48d...
        </div>
        <p className="text-xs text-slate-600 leading-relaxed">
          The header contains two values: <code className="font-mono text-indigo-600">t</code> (Unix epoch timestamp of dispatch) and <code className="font-mono text-indigo-600">v1</code> (HMAC SHA-256 hex digest computed over <code className="font-mono text-slate-850">t.payload</code> using your endpoint secret).
        </p>
      </div>

      {/* 3. Verification Code Snippet */}
      <div id="verification-code" className="space-y-4 scroll-mt-20">
        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
          Node.js Verification Helper
        </h2>
        <div className="rounded-2xl border border-slate-200 bg-slate-900 p-5 shadow-inner">
          <pre className="font-mono text-xs sm:text-sm text-slate-100 overflow-x-auto leading-relaxed">
            {nodeSnippet}
          </pre>
        </div>
      </div>
    </div>
  );
}
