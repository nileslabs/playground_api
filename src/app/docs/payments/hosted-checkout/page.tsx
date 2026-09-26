'use client';

import React from 'react';
import { Icon } from '@iconify/react';
import config from '@/config/env';
import { InteractiveConsole } from '@/components/docs/InteractiveConsole';

export default function HostedCheckoutPage() {
  const publicApiUrl = config.publicApiUrl || 'https://playground.nileslabs.com/api/v1';

  return (
    <div className="space-y-12 w-full text-slate-900">
      {/* 1. Header */}
      <div id="overview" className="space-y-4 scroll-mt-20">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold uppercase tracking-wider border border-indigo-100">
          <Icon icon="ph:shopping-bag-open-bold" className="w-3.5 h-3.5" />
          <span>Mock Commerce & Billing</span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-[1.15]">
          Hosted Checkout Sessions
        </h1>

        <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-3xl">
          Simulate Stripe Checkout sessions with line items, tax calculations, customer details, and redirect URLs. Test successful completion and cancellation workflows without real credit cards.
        </p>
      </div>

      {/* 2. Interactive Session Creator */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-6">
        <div className="border-b border-slate-100 pb-4">
          <h3 className="font-bold text-base text-slate-900">Step 1: Create a Checkout Session</h3>
          <p className="text-xs text-slate-500">
            Send line items, currency, and success/cancel callback URLs to generate a mock checkout session:
          </p>
        </div>

        <InteractiveConsole
          method="POST"
          path="/checkout/sessions"
          title="Create Checkout Session"
          initialBody={JSON.stringify(
            {
              line_items: [
                {
                  price_data: {
                    currency: 'usd',
                    product_data: { name: 'Pro Developer Plan (Monthly)' },
                    unit_amount: 2900,
                  },
                  quantity: 1,
                },
              ],
              mode: 'payment',
              success_url: 'https://example.com/success?session_id={CHECKOUT_SESSION_ID}',
              cancel_url: 'https://example.com/cancel',
              customer_email: 'customer@example.com',
            },
            null,
            2
          )}
        />
      </div>

      {/* 3. Session Endpoints */}
      <div id="endpoints" className="space-y-4 scroll-mt-20">
        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
          Checkout Lifecycle Endpoints
        </h2>

        <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-xs">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-semibold">
              <tr>
                <th className="py-3 px-4">Method</th>
                <th className="py-3 px-4">Endpoint</th>
                <th className="py-3 px-4">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-600">
              <tr>
                <td className="py-3 px-4"><span className="px-2 py-0.5 rounded text-[11px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">POST</span></td>
                <td className="py-3 px-4 font-mono font-bold text-slate-900">/api/v1/checkout/sessions</td>
                <td className="py-3 px-4">Create a new checkout session with line items and callback URLs.</td>
              </tr>
              <tr>
                <td className="py-3 px-4"><span className="px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">GET</span></td>
                <td className="py-3 px-4 font-mono font-bold text-slate-900">/api/v1/checkout/sessions/:id</td>
                <td className="py-3 px-4">Retrieve current status and line items for an existing session.</td>
              </tr>
              <tr>
                <td className="py-3 px-4"><span className="px-2 py-0.5 rounded text-[11px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">POST</span></td>
                <td className="py-3 px-4 font-mono font-bold text-slate-900">/api/v1/checkout/sessions/:id/complete</td>
                <td className="py-3 px-4">Simulate buyer completing the checkout payment successfully.</td>
              </tr>
              <tr>
                <td className="py-3 px-4"><span className="px-2 py-0.5 rounded text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-200">POST</span></td>
                <td className="py-3 px-4 font-mono font-bold text-slate-900">/api/v1/checkout/sessions/:id/expire</td>
                <td className="py-3 px-4">Simulate checkout session abandonment or expiration.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
