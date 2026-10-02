'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Icon } from '@iconify/react';
import { CodeBlock } from '@/components/ui/CodeBlock';

const PRESET_PAYLOADS = {
  posts: {
    event: 'posts.created',
    data: {
      id: 42,
      title: 'Zero-Trust Webhook Authentication',
      author: 'Security Lead',
      userId: 1,
    },
  },
  payment: {
    event: 'payment_intent.succeeded',
    data: {
      id: 'pi_3Mtwx2LkdIwHu7ix0snN0B15',
      amount: 4900,
      currency: 'usd',
      status: 'succeeded',
    },
  },
  auth: {
    event: 'auth.login',
    data: {
      userId: 7,
      email: 'alex.rivera@example.com',
      loginIp: '198.51.100.4',
    },
  },
};

export default function HmacVerificationPage() {
  const [selectedPreset, setSelectedPreset] = useState<'posts' | 'payment' | 'auth'>('posts');
  const [secretKey, setSecretKey] = useState('whsec_demo_secret_key_8899');
  const [timestamp, setTimestamp] = useState('1759165200');
  const [calculatedStandardSig, setCalculatedStandardSig] = useState('');
  const [calculatedTimestampedSig, setCalculatedTimestampedSig] = useState('');

  // Fixed ISO timestamp derived only from timestamp to eliminate any continuous re-render loop
  const isoTimestamp = useMemo(() => {
    const tsNum = parseInt(timestamp, 10);
    return !isNaN(tsNum) && tsNum > 0
      ? new Date(tsNum * 1000).toISOString()
      : '2026-09-29T12:00:00.000Z';
  }, [timestamp]);

  const payloadString = useMemo(() => {
    return JSON.stringify(
      {
        id: 'del_e28c5a14-41bf-4c7b-8392-127810bba104',
        event: PRESET_PAYLOADS[selectedPreset].event,
        timestamp: isoTimestamp,
        data: PRESET_PAYLOADS[selectedPreset].data,
      },
      null,
      2
    );
  }, [selectedPreset, isoTimestamp]);

  // Compute live HMAC SHA-256 only when user modifies inputs (no infinite loop)
  useEffect(() => {
    let isCancelled = false;

    async function computeHmac() {
      try {
        const enc = new TextEncoder();
        const keyData = enc.encode(secretKey || 'whsec_default');
        const cryptoKey = await window.crypto.subtle.importKey(
          'raw',
          keyData,
          { name: 'HMAC', hash: 'SHA-256' },
          false,
          ['sign']
        );

        // 1. Standard body signature: sha256=<hex>
        const standardSignatureBuffer = await window.crypto.subtle.sign(
          'HMAC',
          cryptoKey,
          enc.encode(payloadString)
        );
        const standardHex = Array.from(new Uint8Array(standardSignatureBuffer))
          .map((b) => b.toString(16).padStart(2, '0'))
          .join('');

        // 2. Timestamped signature: t=<ts>,v1=<hex>
        const timestampedPayload = `${timestamp}.${payloadString}`;
        const timestampedBuffer = await window.crypto.subtle.sign(
          'HMAC',
          cryptoKey,
          enc.encode(timestampedPayload)
        );
        const timestampedHex = Array.from(new Uint8Array(timestampedBuffer))
          .map((b) => b.toString(16).padStart(2, '0'))
          .join('');

        if (!isCancelled) {
          setCalculatedStandardSig(`sha256=${standardHex}`);
          setCalculatedTimestampedSig(`t=${timestamp},v1=${timestampedHex}`);
        }
      } catch (err) {
        console.error('SubtleCrypto calculation error:', err);
      }
    }

    computeHmac();
    return () => {
      isCancelled = true;
    };
  }, [secretKey, timestamp, payloadString]);

  const handleUpdateTimestamp = () => {
    setTimestamp(String(Math.floor(Date.now() / 1000)));
  };

  const fullHttpRequestDisplay = useMemo(() => {
    return `POST /api/webhooks HTTP/1.1
Host: your-receiver.example.com
User-Agent: Playground-API-Webhook-Dispatcher/1.0
Content-Type: application/json
X-Playground-Event: ${PRESET_PAYLOADS[selectedPreset].event}
X-Playground-Delivery: del_e28c5a14-41bf-4c7b-8392-127810bba104
X-Playground-Signature: ${calculatedTimestampedSig || 'calculating...'}

${payloadString}`;
  }, [selectedPreset, calculatedTimestampedSig, payloadString]);

  // Multi-Language Verification Snippets
  const nodeSnippet = `import crypto from 'crypto';

/**
 * Verify Playground API outgoing webhook signature with constant-time equality
 * @param {string|Buffer} rawBody - Raw unprocessed HTTP request body string
 * @param {string} signatureHeader - Value of X-Playground-Signature header
 * @param {string} secret - Webhook endpoint signing secret (whsec_...)
 * @param {number} toleranceSeconds - Max allowed age of webhook in seconds (default 300)
 */
export function verifyWebhookSignature(rawBody, signatureHeader, secret, toleranceSeconds = 300) {
  if (!signatureHeader || !secret) {
    throw new Error('Missing signature header or secret key');
  }

  // Support both standard format (sha256=...) and timestamped format (t=...,v1=...)
  if (signatureHeader.startsWith('sha256=')) {
    const receivedHash = signatureHeader.slice(7);
    const expectedHash = crypto
      .createHmac('sha256', secret)
      .update(rawBody)
      .digest('hex');

    if (receivedHash.length !== expectedHash.length) return false;
    return crypto.timingSafeEqual(Buffer.from(receivedHash), Buffer.from(expectedHash));
  }

  // Timestamped signature verification (t=...,v1=...)
  const parts = signatureHeader.split(',');
  const t = parts.find((p) => p.startsWith('t='))?.split('=')[1];
  const v1 = parts.find((p) => p.startsWith('v1='))?.split('=')[1];

  if (!t || !v1) {
    throw new Error('Malformed timestamped signature header');
  }

  // Replay Attack Defense: Check clock drift
  const now = Math.floor(Date.now() / 1000);
  if (Math.abs(now - parseInt(t, 10)) > toleranceSeconds) {
    throw new Error('Signature timestamp outside tolerance window. Potential replay attack.');
  }

  const signedPayload = \`\${t}.\${rawBody}\`;
  const expectedHash = crypto
    .createHmac('sha256', secret)
    .update(signedPayload)
    .digest('hex');

  if (v1.length !== expectedHash.length) return false;
  return crypto.timingSafeEqual(Buffer.from(v1), Buffer.from(expectedHash));
}`;

  const pythonSnippet = `import hmac
import hashlib
import time

def verify_webhook_signature(raw_body: bytes, signature_header: str, secret: str, tolerance: int = 300) -> bool:
    """
    Verifies HMAC-SHA256 signature for incoming Playground API webhook payloads.
    Uses hmac.compare_digest to prevent timing attacks.
    """
    if not signature_header or not secret:
        return False

    secret_bytes = secret.encode('utf-8')

    # Standard format: sha256=<hex>
    if signature_header.startswith('sha256='):
        received_hash = signature_header.split('sha256=')[1]
        expected_hash = hmac.new(secret_bytes, raw_body, hashlib.sha256).hexdigest()
        return hmac.compare_digest(received_hash, expected_hash)

    # Timestamped format: t=<timestamp>,v1=<hex>
    elements = dict(item.split('=', 1) for item in signature_header.split(','))
    t = elements.get('t')
    v1 = elements.get('v1')

    if not t or not v1:
        return False

    # Check for replay attack
    current_time = int(time.time())
    if abs(current_time - int(t)) > tolerance:
        raise ValueError("Webhook timestamp is expired or too far in the future.")

    # Recompute HMAC SHA-256 over t.raw_body
    signed_payload = f"{t}.".encode('utf-8') + raw_body
    expected_hash = hmac.new(secret_bytes, signed_payload, hashlib.sha256).hexdigest()

    return hmac.compare_digest(v1, expected_hash)`;

  const goSnippet = `package main

import (
	"crypto/hmac"
	"crypto/sha256"
	"crypto/subtle"
	"encoding/hex"
	"errors"
	"math"
	"strconv"
	"strings"
	"time"
)

// VerifyWebhook validates Playground API webhook signatures with constant-time equality
func VerifyWebhook(rawBody []byte, signatureHeader string, secret string, toleranceSeconds int64) (bool, error) {
	if signatureHeader == "" || secret == "" {
		return false, errors.New("empty signature header or secret")
	}

	secretBytes := []byte(secret)

	// Standard sha256= format
	if strings.HasPrefix(signatureHeader, "sha256=") {
		receivedHex := strings.TrimPrefix(signatureHeader, "sha256=")
		h := hmac.New(sha256.New, secretBytes)
		h.Write(rawBody)
		expectedHex := hex.EncodeToString(h.Sum(nil))

		return subtle.ConstantTimeCompare([]byte(receivedHex), []byte(expectedHex)) == 1, nil
	}

	// Timestamped t=...,v1=... format
	parts := strings.Split(signatureHeader, ",")
	var tStr, v1Hex string
	for _, p := range parts {
		if strings.HasPrefix(p, "t=") {
			tStr = strings.TrimPrefix(p, "t=")
		} else if strings.HasPrefix(p, "v1=") {
			v1Hex = strings.TrimPrefix(p, "v1=")
		}
	}

	if tStr == "" || v1Hex == "" {
		return false, errors.New("malformed signature header")
	}

	ts, err := strconv.ParseInt(tStr, 10, 64)
	if err != nil {
		return false, err
	}

	// Replay defense
	if math.Abs(float64(time.Now().Unix()-ts)) > float64(toleranceSeconds) {
		return false, errors.New("timestamp outside allowable window")
	}

	h := hmac.New(sha256.New, secretBytes)
	h.Write([]byte(tStr + "."))
	h.Write(rawBody)
	expectedHex := hex.EncodeToString(h.Sum(nil))

	return subtle.ConstantTimeCompare([]byte(v1Hex), []byte(expectedHex)) == 1, nil
}`;

  return (
    <div className="space-y-12 w-full text-slate-900">
      {/* 1. Header with Eyebrow Badge */}
      <div id="overview" className="space-y-4 scroll-mt-20">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold uppercase tracking-wider border border-indigo-200">
          <Icon icon="ph:fingerprint-bold" className="w-3.5 h-3.5" />
          <span>Outgoing Webhooks</span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-[1.15]">
          HMAC SHA-256 Signatures &amp; Security
        </h1>

        <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-3xl">
          Every outgoing webhook payload sent by Playground API includes a cryptographic signature in the <code className="font-mono text-xs bg-slate-100 px-1.5 py-0.5 rounded text-indigo-600 font-bold">X-Playground-Signature</code> header. Verify signatures in your receiver to authenticate origin, prevent payload tampering, and defend against replay attacks.
        </p>
      </div>

      {/* 2. Interactive Signature Calculator Workbench */}
      <div id="signature-workbench" className="p-6 sm:p-7 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-6 scroll-mt-20">
        <div className="border-b border-slate-100 pb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h2 className="font-bold text-base sm:text-lg text-slate-900">
              Interactive HMAC Signature Workbench
            </h2>
            <p className="text-sm text-slate-600">
              Select an event topic to inspect the raw JSON payload and the corresponding cryptographic signature headers:
            </p>
          </div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 text-xs font-semibold self-start sm:self-auto">
            <Icon icon="ph:cpu-bold" className="w-3.5 h-3.5" />
            SubtleCrypto SHA-256
          </span>
        </div>

        {/* Preset Selector Chips */}
        <div className="flex flex-wrap items-center gap-2">
          {(['posts', 'payment', 'auth'] as const).map((key) => {
            const p = PRESET_PAYLOADS[key];
            const isActive = selectedPreset === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => setSelectedPreset(key)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <Icon icon={isActive ? 'ph:check-bold' : 'ph:tag-bold'} className="w-3 h-3" />
                <span>{p.event}</span>
              </button>
            );
          })}
        </div>

        {/* Input Controls Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              Signing Secret Key
            </label>
            <input
              type="text"
              value={secretKey}
              onChange={(e) => setSecretKey(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 font-mono text-xs text-slate-900 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                Timestamp (Unix Seconds)
              </label>
              <button
                type="button"
                onClick={handleUpdateTimestamp}
                className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-700 cursor-pointer"
              >
                Update to Now
              </button>
            </div>
            <input
              type="text"
              value={timestamp}
              onChange={(e) => setTimestamp(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 font-mono text-xs text-slate-900 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
          </div>
        </div>

        {/* Side-by-Side Unified CodeBlocks (Equal Height & Full Content) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-stretch">
          <CodeBlock
            code={payloadString}
            language="json"
            title={`Raw Request Payload (${PRESET_PAYLOADS[selectedPreset].event})`}
            showHeader={true}
            copyable={true}
            initialWrap={true}
            className="h-full flex flex-col"
          />

          <CodeBlock
            tabs={[
              {
                id: 'fullRequest',
                label: 'Dispatched Request',
                icon: 'ph:paper-plane-tilt-bold',
                language: 'http',
                code: fullHttpRequestDisplay,
              },
              {
                id: 'timestamped',
                label: 'Signature Header Only',
                icon: 'ph:clock-countdown-bold',
                language: 'bash',
                code: `X-Playground-Signature: ${calculatedTimestampedSig}\nX-Playground-Event: ${PRESET_PAYLOADS[selectedPreset].event}\nX-Playground-Delivery: del_e28c5a14-41bf-4c7b-8392-127810bba104`,
              },
              {
                id: 'standard',
                label: 'Standard sha256=',
                icon: 'ph:hash-bold',
                language: 'bash',
                code: `X-Playground-Signature: ${calculatedStandardSig}`,
              },
            ]}
            defaultTab="fullRequest"
            showHeader={true}
            copyable={true}
            initialWrap={true}
            className="h-full flex flex-col"
          />
        </div>
      </div>

      {/* 3. HTTP Header Reference Table */}
      <div id="header-spec" className="space-y-4 scroll-mt-20">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
          Security &amp; Routing Headers Reference
        </h2>
        <p className="text-sm text-slate-600">
          The Playground API includes the following HTTP request headers on every outgoing webhook dispatch:
        </p>

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 border-b border-slate-200 text-xs uppercase tracking-wider text-slate-700 font-bold">
                <tr>
                  <th className="py-3.5 px-4">Header</th>
                  <th className="py-3.5 px-4">Sample Value</th>
                  <th className="py-3.5 px-4">Purpose &amp; Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
                <tr className="hover:bg-slate-50/50">
                  <td className="py-3.5 px-4 font-mono text-xs font-bold text-indigo-700">
                    X-Playground-Signature
                  </td>
                  <td className="py-3.5 px-4 font-mono text-xs text-slate-800">
                    t=1759165200,v1=9a2b8...
                  </td>
                  <td className="py-3.5 px-4 text-slate-600 text-xs">
                    Cryptographic HMAC-SHA256 signature to verify payload authenticity.
                  </td>
                </tr>
                <tr className="hover:bg-slate-50/50">
                  <td className="py-3.5 px-4 font-mono text-xs font-bold text-indigo-700">
                    X-Playground-Event
                  </td>
                  <td className="py-3.5 px-4 font-mono text-xs text-slate-800">
                    posts.created
                  </td>
                  <td className="py-3.5 px-4 text-slate-600 text-xs">
                    Domain event name allowing consumers to filter or route payloads.
                  </td>
                </tr>
                <tr className="hover:bg-slate-50/50">
                  <td className="py-3.5 px-4 font-mono text-xs font-bold text-indigo-700">
                    X-Playground-Delivery
                  </td>
                  <td className="py-3.5 px-4 font-mono text-xs text-slate-800">
                    del_4a9e21...
                  </td>
                  <td className="py-3.5 px-4 text-slate-600 text-xs">
                    Unique transmission UUID for receiver idempotency and de-duplication.
                  </td>
                </tr>
                <tr className="hover:bg-slate-50/50">
                  <td className="py-3.5 px-4 font-mono text-xs font-bold text-indigo-700">
                    User-Agent
                  </td>
                  <td className="py-3.5 px-4 font-mono text-xs text-slate-800">
                    Playground-API-Webhook-Dispatcher/1.0
                  </td>
                  <td className="py-3.5 px-4 text-slate-600 text-xs">
                    Standard User-Agent identifier sent by the dispatcher client.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* 4. Multi-Language Verification Snippets */}
      <div id="code-examples" className="space-y-4 scroll-mt-20">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
          Implementation Code Examples
        </h2>
        <p className="text-sm text-slate-600">
          Production signature verification implementations in Node.js, Python, or Go:
        </p>

        <CodeBlock
          tabs={[
            {
              id: 'node',
              label: 'Node.js / TypeScript',
              icon: 'simple-icons:nodedotjs',
              language: 'typescript',
              code: nodeSnippet,
            },
            {
              id: 'python',
              label: 'Python 3',
              icon: 'simple-icons:python',
              language: 'python',
              code: pythonSnippet,
            },
            {
              id: 'go',
              label: 'Go',
              icon: 'simple-icons:go',
              language: 'go',
              code: goSnippet,
            },
          ]}
          defaultTab="node"
          showHeader={true}
          copyable={true}
        />
      </div>

      {/* 5. Production Security Rules */}
      <div id="security-best-practices" className="space-y-4 scroll-mt-20">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
          Zero-Trust Security Checklist
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-5 rounded-2xl border border-slate-200 bg-white shadow-xs space-y-2">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-amber-50 text-amber-600">
                <Icon icon="ph:shield-warning-bold" className="w-4 h-4" />
              </span>
              <h3 className="font-bold text-sm text-slate-900">Prevent Timing Attacks</h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Never use standard string equality (<code className="font-mono text-slate-800">==</code> or <code className="font-mono text-slate-800">===</code>). Always use constant-time functions like Node&apos;s <code className="font-mono text-indigo-600">crypto.timingSafeEqual</code> or Python&apos;s <code className="font-mono text-indigo-600">hmac.compare_digest</code>.
            </p>
          </div>

          <div className="p-5 rounded-2xl border border-slate-200 bg-white shadow-xs space-y-2">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600">
                <Icon icon="ph:clock-countdown-bold" className="w-4 h-4" />
              </span>
              <h3 className="font-bold text-sm text-slate-900">Replay Attack Tolerance Window</h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Verify that the timestamp <code className="font-mono text-slate-800">t</code> in the header is within 300 seconds (5 minutes) of current server time to reject stale intercepted requests.
            </p>
          </div>

          <div className="p-5 rounded-2xl border border-slate-200 bg-white shadow-xs space-y-2">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600">
                <Icon icon="ph:file-raw-bold" className="w-4 h-4" />
              </span>
              <h3 className="font-bold text-sm text-slate-900">Compute over Raw Unparsed Bytes</h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Do not parse the body to an object and re-stringify it. Key ordering differences will break HMAC verification. Compute HMAC directly over the raw incoming request buffer.
            </p>
          </div>

          <div className="p-5 rounded-2xl border border-slate-200 bg-white shadow-xs space-y-2">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-blue-50 text-blue-600">
                <Icon icon="ph:check-square-offset-bold" className="w-4 h-4" />
              </span>
              <h3 className="font-bold text-sm text-slate-900">Enforce Idempotency</h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Store <code className="font-mono text-indigo-600">X-Playground-Delivery</code> in Redis or a DB unique index. Acknowledge duplicates with HTTP 200 immediately without reprocessing business actions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
