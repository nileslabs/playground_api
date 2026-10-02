'use client';

import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import { InteractiveConsole } from '@/components/docs/InteractiveConsole';
import { CodeBlock } from '@/components/docs/CodeBlock';

export default function ChargesRefundsPage() {
  const [chargeTotal] = useState(8000); // $80.00
  const [refundAmount, setRefundAmount] = useState(3000); // $30.00
  const [refundReason, setRefundReason] = useState('requested_by_customer');
  const [sampleIntentId, setSampleIntentId] = useState('pi_test_88f01b2c4d');

  const remaining = chargeTotal - refundAmount;
  const isFull = refundAmount === chargeTotal;

  return (
    <div className="space-y-12 w-full text-slate-900 pb-16">
      {/* 1. Page Header */}
      <div id="overview" className="space-y-4 scroll-mt-20">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold uppercase tracking-wider border border-indigo-100">
          <Icon icon="ph:arrow-u-down-left-bold" className="w-3.5 h-3.5" />
          <span>Mock Commerce & Billing</span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-[1.15]">
          Direct Charges & Refunds API
        </h1>

        <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-4xl">
          Execute single-step charges without client-side tokenization, and issue full or partial refunds against settled transactions.
          Includes automatic ledger recalculations, status transitions (<code className="font-mono text-xs text-amber-700">partially_refunded</code> vs <code className="font-mono text-xs text-rose-700">refunded</code>),
          and webhook dispatching.
        </p>

        <div className="flex flex-wrap gap-2 pt-2">
          <a
            href="#refund-calculator"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600 text-white hover:bg-indigo-700 transition-colors shadow-xs"
          >
            <Icon icon="ph:calculator-bold" className="w-4 h-4" />
            Partial Refund Calculator
          </a>
          <a
            href="#interactive-consoles"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors border border-slate-200"
          >
            <Icon icon="ph:terminal-window-bold" className="w-4 h-4" />
            API Consoles
          </a>
          <a
            href="#recipes"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors border border-slate-200"
          >
            <Icon icon="ph:code-bold" className="w-4 h-4" />
            Code Recipes
          </a>
        </div>
      </div>

      {/* 2. Interactive Partial Refund Calculator */}
      <div id="refund-calculator" className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-6">
        <div className="border-b border-slate-100 pb-4">
          <h2 className="text-lg font-bold text-slate-900">Interactive Partial Refund Simulator</h2>
          <p className="text-xs text-slate-500">
            Slide to adjust the refund amount and inspect ledger updates and terminal status tags in real time.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          {/* Slider & Input */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-700">Refund Amount Slider</span>
              <span className="font-mono font-bold text-indigo-600">${(refundAmount / 100).toFixed(2)} USD</span>
            </div>

            <input
              type="range"
              min={100}
              max={chargeTotal}
              step={100}
              value={refundAmount}
              onChange={(e) => setRefundAmount(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            />

            <div className="grid grid-cols-2 gap-4 text-xs pt-2">
              <div>
                <label className="block text-slate-500 mb-1">Refund Reason</label>
                <select
                  value={refundReason}
                  onChange={(e) => setRefundReason(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-slate-800 bg-white"
                >
                  <option value="requested_by_customer">requested_by_customer</option>
                  <option value="duplicate">duplicate</option>
                  <option value="fraudulent">fraudulent</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-500 mb-1">Target Intent ID</label>
                <input
                  type="text"
                  value={sampleIntentId}
                  onChange={(e) => setSampleIntentId(e.target.value)}
                  className="w-full font-mono px-3 py-1.5 rounded-lg border border-slate-300 text-slate-800"
                />
              </div>
            </div>
          </div>

          {/* Ledger Breakdown Card */}
          <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-3 text-xs">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">Ledger State</span>

            <div className="space-y-1.5 divide-y divide-slate-200/60">
              <div className="flex justify-between py-1 text-slate-600">
                <span>Original Charged:</span>
                <span className="font-mono font-semibold text-slate-900">${(chargeTotal / 100).toFixed(2)}</span>
              </div>
              <div className="flex justify-between py-1 text-rose-600">
                <span>Amount to Refund:</span>
                <span className="font-mono font-bold">-${(refundAmount / 100).toFixed(2)}</span>
              </div>
              <div className="flex justify-between py-1 text-slate-700">
                <span>Remaining Net:</span>
                <span className="font-mono font-bold text-slate-900">${(remaining / 100).toFixed(2)}</span>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between border-t border-slate-200">
              <span className="text-slate-500">Resulting Status:</span>
              <span
                className={`px-2 py-0.5 rounded text-[11px] font-bold border ${
                  isFull
                    ? 'bg-rose-50 text-rose-700 border-rose-200'
                    : 'bg-amber-50 text-amber-700 border-amber-200'
                }`}
              >
                {isFull ? 'refunded' : 'partially_refunded'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Interactive API Consoles */}
      <div id="interactive-consoles" className="space-y-6 scroll-mt-20">
        <div className="border-b border-slate-200 pb-3">
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
            Interactive API Consoles
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Execute direct card transactions and refund requests against your isolated visitor sandbox.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Step 1: Direct 1-Step Charge */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-900">
              1. Direct 1-Step Card Charge
            </h3>
            <InteractiveConsole
              method="POST"
              path="/payments/charge"
              title="Process Direct Charge"
              initialBody={JSON.stringify(
                {
                  amount: 8000,
                  currency: 'usd',
                  card_number: '4242424242424242',
                  exp_month: 12,
                  exp_year: 2028,
                  cvc: '123',
                  description: 'Annual Software License',
                  receipt_email: 'buyer@example.com',
                },
                null,
                2
              )}
            />
          </div>

          {/* Step 2: Issue Refund */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-900">
              2. Issue Full or Partial Refund
            </h3>
            <InteractiveConsole
              method="POST"
              path="/payments/refunds"
              title="Issue Refund Against Payment Intent"
              initialBody={JSON.stringify(
                {
                  payment_intent: sampleIntentId,
                  amount: refundAmount,
                  reason: refundReason,
                },
                null,
                2
              )}
            />
          </div>
        </div>

        {/* List Refunds Console */}
        <div className="space-y-3 pt-4">
          <h3 className="text-sm font-bold text-slate-900">
            3. List All Processed Refunds
          </h3>
          <InteractiveConsole
            method="GET"
            path="/payments/refunds"
            title="List Sandbox Refunds"
          />
        </div>
      </div>

      {/* 4. Production Integration Recipes */}
      <div id="recipes" className="space-y-6 scroll-mt-20">
        <div className="border-b border-slate-200 pb-3">
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
            Production Integration Recipes
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Safe idempotency patterns and customer service refund workflows.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <Icon icon="logos:nodejs-icon" className="w-4 h-4" />
              Idempotent Refund Helper (Node.js)
            </h3>
            <CodeBlock
              language="javascript"
              code={`import axios from 'axios';

// Safely refund an order with duplicate-click protection
export async function refundOrder(paymentIntentId, amountCents, reason = 'requested_by_customer') {
  const idempotencyKey = \`rf_\${paymentIntentId}_\${amountCents}\`;

  try {
    const res = await axios.post(
      'https://playground.nileslabs.com/api/v1/payments/refunds',
      {
        payment_intent: paymentIntentId,
        amount: amountCents,
        reason,
      },
      {
        headers: { 'Idempotency-Key': idempotencyKey },
      }
    );

    console.log('Refund successful:', res.data.id, 'Status:', res.data.status);
    return res.data;
  } catch (err) {
    console.error('Refund failed:', err.response?.data?.error?.message);
    throw err;
  }
}`}
            />
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <Icon icon="logos:python" className="w-4 h-4" />
              Automated Refund Worker (Python)
            </h3>
            <CodeBlock
              language="python"
              code={`import requests

def issue_partial_refund(intent_id: str, amount_cents: int, reason: str = "requested_by_customer"):
    url = "https://playground.nileslabs.com/api/v1/payments/refunds"
    headers = {"Idempotency-Key": f"ref_{intent_id}_{amount_cents}"}
    payload = {
        "payment_intent": intent_id,
        "amount": amount_cents,
        "reason": reason
    }
    
    response = requests.post(url, json=payload, headers=headers)
    response.raise_for_status()
    
    data = response.json()
    print(f"Issued refund {data['id']} for {data['amount']} cents")
    return data`}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
