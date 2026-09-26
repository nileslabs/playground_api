'use client';

import React from 'react';
import { Icon } from '@iconify/react';
import config from '@/config/env';
import { InteractiveConsole } from '@/components/docs/InteractiveConsole';

export default function ChargesRefundsPage() {
  const publicApiUrl = config.publicApiUrl || 'https://playground.nileslabs.com/api/v1';

  return (
    <div className="space-y-12 w-full text-slate-900">
      {/* 1. Header */}
      <div id="overview" className="space-y-4 scroll-mt-20">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold uppercase tracking-wider border border-indigo-100">
          <Icon icon="ph:arrow-u-down-left-bold" className="w-3.5 h-3.5" />
          <span>Mock Commerce & Billing</span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-[1.15]">
          Direct Charges & Refunds
        </h1>

        <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-3xl">
          Execute single-step charges with card details and issue full or partial refunds against completed transactions. Automatic ledger updates and receipt dispatching included.
        </p>
      </div>

      {/* 2. Step 1: Direct 1-Step Charge */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-6">
        <div className="border-b border-slate-100 pb-4">
          <h3 className="font-bold text-base text-slate-900">Step 1: Execute Direct Card Charge</h3>
          <p className="text-xs text-slate-500">
            Submit a single-call charge without creating an intent first:
          </p>
        </div>

        <InteractiveConsole
          method="POST"
          path="/payments/charge"
          title="Direct Charge"
          initialBody={JSON.stringify(
            {
              amount: 2500,
              currency: 'usd',
              card_number: '4242424242424242',
              exp_month: 8,
              exp_year: 2027,
              cvc: '314',
              customer_email: 'buyer@example.com',
            },
            null,
            2
          )}
        />
      </div>

      {/* 3. Step 2: Issue Refund */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-6">
        <div className="border-b border-slate-100 pb-4">
          <h3 className="font-bold text-base text-slate-900">Step 2: Issue Partial or Full Refund</h3>
          <p className="text-xs text-slate-500">
            Submit a refund request with amount (leave empty for full refund) and reason:
          </p>
        </div>

        <InteractiveConsole
          method="POST"
          path="/payments/refunds"
          title="Create Refund"
          initialBody={JSON.stringify(
            {
              charge_id: 'ch_sample_charge_id',
              amount: 1000,
              reason: 'requested_by_customer',
            },
            null,
            2
          )}
        />
      </div>
    </div>
  );
}
