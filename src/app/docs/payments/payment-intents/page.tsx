'use client';

import React from 'react';
import { Icon } from '@iconify/react';
import config from '@/config/env';
import { InteractiveConsole } from '@/components/docs/InteractiveConsole';

export default function PaymentIntentsPage() {
  const publicApiUrl = config.publicApiUrl || 'https://playground.nileslabs.com/api/v1';

  return (
    <div className="space-y-12 w-full text-slate-900">
      {/* 1. Header */}
      <div id="overview" className="space-y-4 scroll-mt-20">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold uppercase tracking-wider border border-indigo-100">
          <Icon icon="ph:receipt-bold" className="w-3.5 h-3.5" />
          <span>Mock Commerce & Billing</span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-[1.15]">
          Payment Intents API
        </h1>

        <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-3xl">
          Model multi-step Stripe-compatible payment flows with explicit creation, confirmation, and status tracking. Seamlessly test status transitions from <code className="font-mono text-xs bg-slate-100 px-1 py-0.5 rounded text-indigo-600">requires_payment_method</code> to <code className="font-mono text-xs bg-slate-100 px-1 py-0.5 rounded text-emerald-600">succeeded</code>.
        </p>
      </div>

      {/* 2. Interactive Intent Creator */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-6">
        <div className="border-b border-slate-100 pb-4">
          <h3 className="font-bold text-base text-slate-900">Step 1: Create a Payment Intent</h3>
          <p className="text-xs text-slate-500">
            Create an intent specifying amount (in smallest currency unit, e.g., cents) and currency:
          </p>
        </div>

        <InteractiveConsole
          method="POST"
          path="/payments/intents"
          title="Create Intent"
          initialBody={JSON.stringify(
            {
              amount: 4900,
              currency: 'usd',
              description: 'Annual Cloud Subscription',
              metadata: { orderId: 'ord_9872' },
            },
            null,
            2
          )}
        />
      </div>

      {/* 3. Query All Payment Intents */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-6">
        <div className="border-b border-slate-100 pb-4">
          <h3 className="font-bold text-base text-slate-900">Step 2: List Created Intents</h3>
          <p className="text-xs text-slate-500">
            Fetch transaction history recorded in your isolated visitor sandbox:
          </p>
        </div>

        <InteractiveConsole
          method="GET"
          path="/payments/intents"
          title="List Payment Intents"
        />
      </div>
    </div>
  );
}
