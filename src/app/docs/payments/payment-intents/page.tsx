'use client';

import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import { InteractiveConsole } from '@/components/docs/InteractiveConsole';
import { CodeBlock } from '@/components/docs/CodeBlock';

export default function PaymentIntentsPage() {
  const [activeTab, setActiveTab] = useState<'create' | 'confirm' | 'capture' | 'cancel' | 'list'>('create');
  const [sampleIntentId, setSampleIntentId] = useState<string>('pi_test_7f9c2d1e8a0b');

  return (
    <div className="space-y-12 w-full text-slate-900 pb-16">
      {/* 1. Page Header */}
      <div id="overview" className="space-y-4 scroll-mt-20">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold uppercase tracking-wider border border-indigo-100">
          <Icon icon="ph:receipt-bold" className="w-3.5 h-3.5" />
          <span>Mock Commerce & Billing</span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-[1.15]">
          Payment Intents API
        </h1>

        <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-4xl">
          Model production payment lifecycles with stateful intents, client secrets, two-phase authorizations, and automated webhook events.
          Supports both automatic immediate capture and manual two-step authorization/capture workflows.
        </p>

        <div className="flex flex-wrap gap-2 pt-2">
          <a
            href="#lifecycle"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600 text-white hover:bg-indigo-700 transition-colors shadow-xs"
          >
            <Icon icon="ph:git-commit-bold" className="w-4 h-4" />
            State Machine Lifecycle
          </a>
          <a
            href="#interactive-playground"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors border border-slate-200"
          >
            <Icon icon="ph:terminal-window-bold" className="w-4 h-4" />
            Interactive Playground
          </a>
          <a
            href="#idempotency"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors border border-slate-200"
          >
            <Icon icon="ph:shield-check-bold" className="w-4 h-4" />
            Idempotency Keys
          </a>
        </div>
      </div>

      {/* 2. Lifecycle State Machine */}
      <div id="lifecycle" className="space-y-6 scroll-mt-20">
        <div className="border-b border-slate-200 pb-3">
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
            Payment Intent State Machine
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Every PaymentIntent transitions through well-defined, immutable terminal or transitional states.
          </p>
        </div>

        {/* State Flow Visual Steps */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">Step 1</span>
              <Icon icon="ph:circle-dashed-bold" className="w-4 h-4 text-indigo-400" />
            </div>
            <h3 className="font-bold font-mono text-xs sm:text-sm text-slate-900 break-all">requires_payment_method</h3>
            <p className="text-xs text-slate-500">
              Intent created on backend. Safe <code className="font-mono text-[11px] text-slate-700 break-all">client_secret</code> returned to frontend UI.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded">Action</span>
              <Icon icon="ph:shield-warning-bold" className="w-4 h-4 text-amber-500" />
            </div>
            <h3 className="font-bold font-mono text-xs sm:text-sm text-slate-900 break-all">requires_action</h3>
            <p className="text-xs text-slate-500">
              3DS 2.0 challenge or biometric authorization required before the bank approves funds.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">Auth</span>
              <Icon icon="ph:lock-key-open-bold" className="w-4 h-4 text-blue-500" />
            </div>
            <h3 className="font-bold font-mono text-xs sm:text-sm text-slate-900 break-all">requires_capture</h3>
            <p className="text-xs text-slate-500">
              Card authorized for two-step fulfillment (<code className="font-mono text-[11px] text-slate-700 break-all">capture_method: &quot;manual&quot;</code>). Awaiting capture.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-200 shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">Final</span>
              <Icon icon="ph:check-circle-bold" className="w-4 h-4 text-emerald-600" />
            </div>
            <h3 className="font-bold font-mono text-xs sm:text-sm text-emerald-950 break-all">succeeded</h3>
            <p className="text-xs text-emerald-800">
              Funds debited. Email receipt delivered to Virtual Inbox. Webhook dispatched.
            </p>
          </div>
        </div>
      </div>

      {/* 3. Interactive Multi-Step Console */}
      <div id="interactive-playground" className="space-y-6 scroll-mt-20">
        <div className="border-b border-slate-200 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
              Interactive Intent Execution
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Test every step of the payment pipeline directly against your live isolated visitor sandbox.
            </p>
          </div>

          {/* Tab buttons */}
          <div className="flex flex-wrap gap-1.5 p-1 bg-slate-100 rounded-xl">
            {[
              { id: 'create', label: '1. Create Intent' },
              { id: 'confirm', label: '2. Confirm Intent' },
              { id: 'capture', label: '3. Capture (Manual)' },
              { id: 'cancel', label: '4. Cancel' },
              { id: 'list', label: 'List All' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                  activeTab === tab.id
                    ? 'bg-white text-slate-900 shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab 1: Create Intent */}
        {activeTab === 'create' && (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600">
              <strong>Workflow:</strong> Backend invokes this endpoint when user initializes checkout. Amount is in the smallest currency unit (e.g. <code className="font-mono text-indigo-600">4900</code> = $49.00 USD).
            </div>
            <InteractiveConsole
              method="POST"
              path="/payments/intents"
              title="Create Payment Intent"
              initialBody={JSON.stringify(
                {
                  amount: 4900,
                  currency: 'usd',
                  description: 'Cloud Pro Annual Subscription',
                  receipt_email: 'alex.smith@example.com',
                  capture_method: 'automatic',
                  metadata: {
                    order_id: 'ord_live_8912',
                    user_tier: 'enterprise',
                  },
                },
                null,
                2
              )}
            />
          </div>
        )}

        {/* Tab 2: Confirm Intent */}
        {activeTab === 'confirm' && (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <strong>Workflow:</strong> Pass a test card number to complete authorization.
                Substitute the target ID in the path or use the default sandbox intent below.
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold text-slate-500">Target ID:</span>
                <input
                  type="text"
                  value={sampleIntentId}
                  onChange={(e) => setSampleIntentId(e.target.value)}
                  className="font-mono text-xs px-2 py-1 bg-white border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            </div>
            <InteractiveConsole
              method="POST"
              path={`/payments/intents/${sampleIntentId}/confirm`}
              title="Confirm Payment Intent"
              initialBody={JSON.stringify(
                {
                  payment_method: {
                    type: 'card',
                    card_number: '4242424242424242',
                    exp_month: 12,
                    exp_year: 2028,
                    cvc: '123',
                  },
                  receipt_email: 'customer@example.com',
                },
                null,
                2
              )}
            />
          </div>
        )}

        {/* Tab 3: Capture Intent */}
        {activeTab === 'capture' && (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200 text-xs text-blue-900">
              <strong>Two-Phase Settlement:</strong> If the intent was created with <code className="font-mono text-blue-700">capture_method: &quot;manual&quot;</code>, funds remain in <code className="font-mono text-blue-700">requires_capture</code> state until your logistics or delivery worker calls this capture endpoint.
            </div>
            <InteractiveConsole
              method="POST"
              path={`/payments/intents/${sampleIntentId}/capture`}
              title="Capture Authorized Intent"
              initialBody={JSON.stringify(
                {
                  amount_to_capture: 4900,
                },
                null,
                2
              )}
            />
          </div>
        )}

        {/* Tab 4: Cancel Intent */}
        {activeTab === 'cancel' && (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600">
              <strong>Cancellation:</strong> Cancels an open intent that has not yet succeeded. Unlocks reserved authorization holds on the customer bank account.
            </div>
            <InteractiveConsole
              method="POST"
              path={`/payments/intents/${sampleIntentId}/cancel`}
              title="Cancel Payment Intent"
              initialBody={JSON.stringify(
                {
                  cancellation_reason: 'abandoned',
                },
                null,
                2
              )}
            />
          </div>
        )}

        {/* Tab 5: List Intents */}
        {activeTab === 'list' && (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600">
              <strong>Query History:</strong> Returns all payment intents created within your active isolated visitor sandbox session.
            </div>
            <InteractiveConsole
              method="GET"
              path="/payments/intents"
              title="List Sandbox Payment Intents"
            />
          </div>
        )}
      </div>

      {/* 4. Idempotency Deep Dive */}
      <div id="idempotency" className="space-y-6 scroll-mt-20">
        <div className="border-b border-slate-200 pb-3">
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
            Idempotency & Replay Protection
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Prevent double-billing on network drops, mobile connection switching, and client retries.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center gap-2 text-indigo-600">
              <Icon icon="ph:fingerprint-bold" className="w-5 h-5" />
              <h3 className="font-bold text-base text-slate-900">How Idempotency Works</h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Attach a unique <code className="font-mono text-indigo-600">Idempotency-Key: &lt;uuid&gt;</code> header to any <code className="font-mono text-slate-800">POST</code> request. If a retry occurs with the exact same key:
            </p>
            <ul className="text-xs text-slate-600 space-y-1.5 list-disc pl-4">
              <li>No duplicate charges or cards are processed.</li>
              <li>The initial response payload is replayed verbatim.</li>
              <li>The response includes header <code className="font-mono text-emerald-600">Idempotent-Replay: true</code>.</li>
              <li>Keys are cached per visitor sandbox for 24 hours.</li>
            </ul>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center gap-2 text-indigo-600">
              <Icon icon="ph:arrow-clockwise-bold" className="w-5 h-5" />
              <h3 className="font-bold text-base text-slate-900">Recommended Key Generation</h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Always tie your idempotency key to a specific checkout cart ID or user action attempt rather than a generic random string:
            </p>
            <div className="p-3 rounded-lg bg-slate-900 text-slate-200 font-mono text-[11px] leading-relaxed">
              const idempotencyKey = `pay_${`{`}cartId{`}`}_${`{`}attemptIndex{`}`}`;
            </div>
          </div>
        </div>
      </div>

      {/* 5. Production Integration Recipes */}
      <div id="recipes" className="space-y-6 scroll-mt-20">
        <div className="border-b border-slate-200 pb-3">
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
            Production Integration Recipes
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Complete client-side and server-side code samples for modern frameworks.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <Icon icon="logos:react" className="w-4 h-4" />
              Frontend React Hook (Custom / Stripe Elements)
            </h3>
            <CodeBlock
              language="typescript"
              code={`import { useState } from 'react';

export function usePaymentIntent() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const processPayment = async (amount: number, cardDetails: any) => {
    setLoading(true);
    setError(null);

    try {
      // 1. Create intent on your backend
      const res = await fetch('/api/create-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount }),
      });
      const { clientSecret, intentId } = await res.json();

      // 2. Confirm intent with card data
      const confirmRes = await fetch(\`https://playground.nileslabs.com/api/v1/payments/intents/\${intentId}/confirm\`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Idempotency-Key': \`idem_\${intentId}\`,
        },
        body: JSON.stringify({ payment_method: cardDetails }),
      });

      const result = await confirmRes.json();
      return result;
    } catch (err: any) {
      setError(err.message || 'Payment failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { processPayment, loading, error };
}`}
            />
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <Icon icon="logos:python" className="w-4 h-4" />
              Python Backend Client
            </h3>
            <CodeBlock
              language="python"
              code={`import requests
import uuid

API_BASE = "https://playground.nileslabs.com/api/v1"

def create_and_confirm_payment(amount_cents: int, card_num: str):
    idempotency_key = f"order_py_{uuid.uuid4().hex[:12]}"
    
    # 1. Create Intent
    intent = requests.post(
        f"{API_BASE}/payments/intents",
        json={
            "amount": amount_cents,
            "currency": "usd",
            "capture_method": "automatic",
            "description": "Python SDK Test Order"
        },
        headers={"Idempotency-Key": idempotency_key}
    ).json()

    intent_id = intent["id"]
    
    # 2. Confirm Intent
    confirmed = requests.post(
        f"{API_BASE}/payments/intents/{intent_id}/confirm",
        json={
            "payment_method": {
                "card_number": card_num,
                "exp_month": 12,
                "exp_year": 2028,
                "cvc": "123"
            }
        }
    ).json()
    
    return confirmed`}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
