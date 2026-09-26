'use client';

import React from 'react';
import { Icon } from '@iconify/react';
import config from '@/config/env';
import { InteractiveConsole } from '@/components/docs/InteractiveConsole';

export default function CustomersVaultPage() {
  const publicApiUrl = config.publicApiUrl || 'https://playground.nileslabs.com/api/v1';

  return (
    <div className="space-y-12 w-full text-slate-900">
      {/* 1. Header */}
      <div id="overview" className="space-y-4 scroll-mt-20">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold uppercase tracking-wider border border-indigo-100">
          <Icon icon="ph:address-book-bold" className="w-3.5 h-3.5" />
          <span>Mock Commerce & Billing</span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-[1.15]">
          Customer Vault & Payment Methods
        </h1>

        <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-3xl">
          Attach saved payment methods, billing emails, and default credit card tokens to customer objects. Manage recurring subscriptions or 1-click checkout profiles.
        </p>
      </div>

      {/* 2. Interactive Customer Creator */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-6">
        <div className="border-b border-slate-100 pb-4">
          <h3 className="font-bold text-base text-slate-900">Step 1: Save Customer in Vault</h3>
          <p className="text-xs text-slate-500">
            Create a customer with contact details and a default tokenized card:
          </p>
        </div>

        <InteractiveConsole
          method="POST"
          path="/customers"
          title="Create Vaulted Customer"
          initialBody={JSON.stringify(
            {
              name: 'Sarah Connor',
              email: 'sarah.connor@example.com',
              phone: '+1-555-019-2834',
              default_payment_method: 'pm_card_visa',
              metadata: { tier: 'enterprise' },
            },
            null,
            2
          )}
        />
      </div>

      {/* 3. List Customers */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-6">
        <div className="border-b border-slate-100 pb-4">
          <h3 className="font-bold text-base text-slate-900">Step 2: List Saved Customers</h3>
          <p className="text-xs text-slate-500">
            Fetch all customer profiles stored in your active visitor sandbox:
          </p>
        </div>

        <InteractiveConsole
          method="GET"
          path="/customers"
          title="List Customers"
        />
      </div>
    </div>
  );
}
