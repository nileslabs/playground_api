'use client';

import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import { InteractiveConsole } from '@/components/docs/InteractiveConsole';
import { CodeBlock } from '@/components/docs/CodeBlock';

interface MockVaultCustomer {
  id: string;
  name: string;
  email: string;
  phone: string;
  cardBrand: string;
  last4: string;
  tier: string;
}

export default function CustomersVaultPage() {
  const [selectedCustomerId, setSelectedCustomerId] = useState('cus_test_9fa2b41c0e');

  const demoCustomers: MockVaultCustomer[] = [
    {
      id: 'cus_test_9fa2b41c0e',
      name: 'Sarah Connor',
      email: 'sarah.connor@cyberdyne.io',
      phone: '+1 (555) 019-2834',
      cardBrand: 'Visa',
      last4: '4242',
      tier: 'Enterprise',
    },
    {
      id: 'cus_test_88d103fa7e',
      name: 'Marcus Holloway',
      email: 'marcus@dedsec.net',
      phone: '+1 (555) 014-9921',
      cardBrand: 'Mastercard',
      last4: '5555',
      tier: 'Pro Builder',
    },
  ];

  return (
    <div className="space-y-12 w-full text-slate-900 pb-16">
      {/* 1. Page Header */}
      <div id="overview" className="space-y-4 scroll-mt-20">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold uppercase tracking-wider border border-indigo-100">
          <Icon icon="ph:address-book-bold" className="w-3.5 h-3.5" />
          <span>Mock Commerce & Billing</span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-[1.15]">
          Customer Vault & Tokenized Instruments
        </h1>

        <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-4xl">
          Store buyer identities, tokenized payment instruments, billing preferences, and custom customer metadata.
          Attach customer records to Payment Intents and Checkout Sessions for recurring SaaS subscriptions and 1-click checkout experiences.
        </p>

        <div className="flex flex-wrap gap-2 pt-2">
          <a
            href="#vault-cards"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600 text-white hover:bg-indigo-700 transition-colors shadow-xs"
          >
            <Icon icon="ph:users-three-bold" className="w-4 h-4" />
            Vaulted Profiles Preview
          </a>
          <a
            href="#interactive-consoles"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors border border-slate-200"
          >
            <Icon icon="ph:terminal-window-bold" className="w-4 h-4" />
            API Consoles
          </a>
          <a
            href="#tokenization-rules"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors border border-slate-200"
          >
            <Icon icon="ph:shield-check-bold" className="w-4 h-4" />
            Zero-PCI Tokenization
          </a>
        </div>
      </div>

      {/* 2. Vaulted Profiles Visual Preview */}
      <div id="vault-cards" className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-6">
        <div className="border-b border-slate-100 pb-4">
          <h2 className="text-lg font-bold text-slate-900">Active Customer Vault Profiles</h2>
          <p className="text-xs text-slate-500">
            Click any profile to pre-fill the customer ID across query consoles.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {demoCustomers.map((cust) => {
            const isSelected = selectedCustomerId === cust.id;
            return (
              <div
                key={cust.id}
                onClick={() => setSelectedCustomerId(cust.id)}
                className={`p-5 rounded-2xl border transition-all cursor-pointer space-y-3 ${
                  isSelected
                    ? 'border-indigo-600 bg-indigo-50/30 ring-2 ring-indigo-500/20 shadow-xs'
                    : 'border-slate-200 bg-slate-50/50 hover:border-slate-300'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-600 to-violet-500 text-white flex items-center justify-center font-bold text-sm">
                      {cust.name.split(' ').map((n) => n[0]).join('')}
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-slate-900">{cust.name}</h3>
                      <p className="text-xs text-slate-500 font-mono">{cust.id}</p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                    {cust.tier}
                  </span>
                </div>

                <div className="space-y-1 text-xs text-slate-600">
                  <div className="flex items-center gap-2">
                    <Icon icon="ph:envelope-simple-bold" className="w-4 h-4 text-slate-400" />
                    <span>{cust.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Icon icon="ph:phone-bold" className="w-4 h-4 text-slate-400" />
                    <span>{cust.phone}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-xs">
                  <span className="text-slate-500 text-[11px]">Default Payment Method</span>
                  <div className="flex items-center gap-1.5 font-mono font-bold text-slate-800">
                    <Icon
                      icon={cust.cardBrand === 'Visa' ? 'logos:visa' : 'logos:mastercard'}
                      className="w-4 h-4"
                    />
                    <span>•••• {cust.last4}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Interactive API Consoles */}
      <div id="interactive-consoles" className="space-y-6 scroll-mt-20">
        <div className="border-b border-slate-200 pb-3">
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
            Customer Vault Endpoints
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Create and query customer profiles directly within your isolated sandbox ledger.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Create Customer */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-900">
              1. Create Customer Profile
            </h3>
            <InteractiveConsole
              method="POST"
              path="/customers"
              title="Create Vault Customer"
              initialBody={JSON.stringify(
                {
                  name: 'Elena Rostova',
                  email: 'elena.rostova@example.com',
                  phone: '+1-555-018-7732',
                  metadata: {
                    company: 'Apex Robotics',
                    tier: 'enterprise_pro',
                    account_manager: 'James Chen',
                  },
                },
                null,
                2
              )}
            />
          </div>

          {/* Retrieve Customer */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-900">
              2. Retrieve Customer by ID
            </h3>
            <InteractiveConsole
              method="GET"
              path={`/customers/${selectedCustomerId}`}
              title="Get Customer by ID"
            />
          </div>
        </div>

        {/* List All Customers */}
        <div className="space-y-3 pt-4">
          <h3 className="text-sm font-bold text-slate-900">
            3. List All Saved Customers
          </h3>
          <InteractiveConsole
            method="GET"
            path="/customers"
            title="List Sandbox Customers"
          />
        </div>
      </div>

      {/* 4. Tokenization & PCI Compliance Architecture */}
      <div id="tokenization-rules" className="space-y-6 scroll-mt-20">
        <div className="border-b border-slate-200 pb-3">
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
            Zero-PCI Tokenization Architecture
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            How modern commerce gateways isolate cardholder data to achieve SAQ-A PCI compliance.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-sm">
              <Icon icon="ph:browsers-bold" className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-slate-900">1. Client Tokenization</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Card numbers are submitted directly from the user browser or mobile SDK to the gateway vault.
              Your servers never see, transmit, or store unencrypted Primary Account Numbers (PANs).
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold text-sm">
              <Icon icon="ph:key-bold" className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-slate-900">2. Token Assignment</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              The gateway returns a non-sensitive payment method token (<code className="font-mono text-amber-700">pm_test_...</code>) or links the instrument to a Customer ID (<code className="font-mono text-amber-700">cus_test_...</code>).
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-sm">
              <Icon icon="ph:arrows-clockwise-bold" className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-slate-900">3. Off-Session Billing</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Your backend cron jobs or billing workers pass <code className="font-mono text-emerald-700">{`{ customer: 'cus_...' }`}</code> to charge subscriptions off-session without requiring cardholder presence.
            </p>
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
            Customer onboarding and recurring subscription billing patterns.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <Icon icon="logos:nodejs-icon" className="w-4 h-4" />
              Customer Onboarding & Card Attachment (Node.js)
            </h3>
            <CodeBlock
              language="javascript"
              code={`import axios from 'axios';

// Create customer and charge their first invoice
export async function onboardCustomerAndBill(userData, amountCents) {
  // 1. Create vaulted customer profile
  const custRes = await axios.post('https://playground.nileslabs.com/api/v1/customers', {
    name: userData.fullName,
    email: userData.email,
    metadata: { appUserId: userData.id },
  });
  const customerId = custRes.data.id;

  // 2. Create intent bound to customer
  const intentRes = await axios.post('https://playground.nileslabs.com/api/v1/payments/intents', {
    amount: amountCents,
    currency: 'usd',
    customer: customerId,
    description: 'Initial SaaS subscription charge',
  });

  return { customerId, clientSecret: intentRes.data.client_secret };
}`}
            />
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <Icon icon="logos:python" className="w-4 h-4" />
              Nightly Subscription Worker (Python)
            </h3>
            <CodeBlock
              language="python"
              code={`import requests

def charge_subscription(customer_id: str, plan_amount_cents: int):
    # Charge existing customer off-session
    url = "https://playground.nileslabs.com/api/v1/payments/intents"
    payload = {
        "amount": plan_amount_cents,
        "currency": "usd",
        "customer": customer_id,
        "description": "Monthly recurring plan renewal",
        "capture_method": "automatic"
    }
    
    res = requests.post(url, json=payload)
    intent = res.json()
    print(f"Created renewal intent {intent['id']} for customer {customer_id}")
    return intent`}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
