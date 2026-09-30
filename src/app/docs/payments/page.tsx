import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Icon } from '@iconify/react';
import { siteConfig } from '@/config/site';

export const metadata: Metadata = {
  title: 'Mock Commerce & Billing Architecture — Playground API',
  description:
    'Complete mock billing ecosystem supporting Stripe-compatible Payment Intents, 3D Secure modal simulation, magic test cards, hosted checkout, and full/partial refunds.',
  alternates: {
    canonical: `${siteConfig.url}/docs/payments`,
  },
  openGraph: {
    title: 'Mock Commerce & Billing Architecture — Playground API',
    description:
      'Complete mock billing ecosystem supporting Stripe-compatible Payment Intents, 3D Secure modal simulation, magic test cards, and receipts.',
    url: `${siteConfig.url}/docs/payments`,
  },
};

const PAYMENT_MODULES = [
  {
    id: 'payment-intents',
    name: 'Payment Intents API',
    icon: 'ph:receipt-bold',
    badge: 'Stripe API',
    color: 'text-indigo-600 bg-indigo-50 border-indigo-200',
    desc: 'The asynchronous payment lifecycle state machine. Create client secrets, attach payment methods, inspect payment errors, and test two-step authorization & capture.',
    endpoints: ['POST /api/v1/payments/intents', 'POST /api/v1/payments/intents/:id/confirm', 'POST /api/v1/payments/intents/:id/capture'],
    href: '/docs/payments/payment-intents',
  },
  {
    id: 'test-cards',
    name: 'Deterministic Test Cards',
    icon: 'ph:cards-bold',
    badge: '14+ Cards',
    color: 'text-emerald-600 bg-emerald-50 border-emerald-200',
    desc: 'Instant success, insufficient funds, expired cards, incorrect CVC, stolen cards, and velocity limits. Includes dynamic date and CVC evaluations without mock setup.',
    endpoints: ['POST /api/v1/payments/charge', 'POST /api/v1/payments/intents/:id/confirm'],
    href: '/docs/payments/test-cards',
  },
  {
    id: '3ds-authentication',
    name: '3D Secure & SCA Challenge',
    icon: 'ph:shield-warning-bold',
    badge: 'PSD2 / SCA',
    color: 'text-amber-600 bg-amber-50 border-amber-200',
    desc: 'Simulate Strong Customer Authentication (SCA). Handles requires_action status, redirect_to_url challenges, biometric/OTP modals, and post-challenge completion.',
    endpoints: ['POST /api/v1/payments/intents/:id/confirm-3ds'],
    href: '/docs/payments/3ds-authentication',
  },
  {
    id: 'hosted-checkout',
    name: 'Hosted Checkout Sessions',
    icon: 'ph:shopping-bag-open-bold',
    badge: 'Pre-built UI',
    color: 'text-purple-600 bg-purple-50 border-purple-200',
    desc: 'Pre-built Stripe Checkout redirect workflows. Model multi-item carts, quantity multipliers, success and cancel callback URLs, and session fulfillment webhooks.',
    endpoints: ['POST /api/v1/checkout/sessions', 'GET /api/v1/checkout/sessions/:id'],
    href: '/docs/payments/hosted-checkout',
  },
  {
    id: 'charges-refunds',
    name: 'Charges & Partial Refunds',
    icon: 'ph:arrow-u-down-left-bold',
    badge: 'Idempotent',
    color: 'text-rose-600 bg-rose-50 border-rose-200',
    desc: 'Single-step legacy charges, full amount refunds, and incremental partial refunds. Enforces balance caps, reason logging, and Idempotency-Key duplicate guards.',
    endpoints: ['POST /api/v1/payments/charge', 'POST /api/v1/payments/refunds', 'GET /api/v1/payments/refunds'],
    href: '/docs/payments/charges-refunds',
  },
  {
    id: 'customers-vault',
    name: 'Customers & Vault',
    icon: 'ph:address-book-bold',
    badge: 'Tokenization',
    color: 'text-sky-600 bg-sky-50 border-sky-200',
    desc: 'Persist customer profiles, track transaction history, and attach reusable payment method tokens for recurring SaaS subscription simulations.',
    endpoints: ['POST /api/v1/customers', 'GET /api/v1/customers', 'GET /api/v1/customers/:id'],
    href: '/docs/payments/customers-vault',
  },
];

const COMPARISON_ROWS = [
  {
    feature: 'Recommended Use Case',
    hosted: 'SaaS self-serve upgrades, quick checkouts',
    intents: 'Custom in-app checkout forms, Stripe Elements',
    charge: 'Backend-to-backend migrations, batch jobs',
  },
  {
    feature: 'PCI Compliance Scope',
    hosted: 'SAQ A (Zero card data touches your servers)',
    intents: 'SAQ A-EP (Tokenized by client SDK)',
    charge: 'Requires tokenization or backend proxying',
  },
  {
    feature: '3D Secure (SCA) Handling',
    hosted: 'Handled automatically within checkout redirect',
    intents: 'Dynamic requires_action step-up flow',
    charge: 'Not supported (Immediate failure if 3DS card)',
  },
  {
    feature: 'Authorization & Delayed Capture',
    hosted: 'Automatic capture upon checkout completion',
    intents: 'Supported (capture_method: manual)',
    charge: 'Automatic 1-step capture only',
  },
  {
    feature: 'Client Secret Tokenization',
    hosted: 'Session ID URL redirect',
    intents: 'pi_test_..._secret_... for browser SDKs',
    charge: 'Direct card payload submission',
  },
];

export default function PaymentsOverviewPage() {
  return (
    <div className="space-y-12 w-full text-slate-900 pb-16">
      {/* 1. Hero Header */}
      <div id="overview" className="space-y-4 scroll-mt-20">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold uppercase tracking-wider border border-indigo-100">
          <Icon icon="ph:credit-card-bold" className="w-3.5 h-3.5" />
          <span>Commerce & Billing Engine</span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-[1.15]">
          Mock Commerce & Billing Architecture
        </h1>

        <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-3xl">
          An enterprise-grade, Stripe-compatible billing sandbox supporting multi-step Payment Intent state transitions, 3D Secure modal challenges, deterministic test cards, idempotency protection, and automatic invoice receipt dispatch.
        </p>

        {/* Global Key Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          <div className="p-4 rounded-2xl border border-slate-200 bg-white shadow-2xs space-y-1">
            <span className="text-xs text-slate-500 font-medium">Test Cards</span>
            <p className="text-2xl font-extrabold text-slate-900">14+</p>
            <span className="text-[11px] text-emerald-600 font-semibold">Deterministic outcomes</span>
          </div>
          <div className="p-4 rounded-2xl border border-slate-200 bg-white shadow-2xs space-y-1">
            <span className="text-xs text-slate-500 font-medium">State Machine</span>
            <p className="text-2xl font-extrabold text-slate-900">6 Stages</p>
            <span className="text-[11px] text-indigo-600 font-semibold">requires_action, capture, etc.</span>
          </div>
          <div className="p-4 rounded-2xl border border-slate-200 bg-white shadow-2xs space-y-1">
            <span className="text-xs text-slate-500 font-medium">3DS Support</span>
            <p className="text-2xl font-extrabold text-slate-900">PSD2 / SCA</p>
            <span className="text-[11px] text-amber-600 font-semibold">Simulated challenge modal</span>
          </div>
          <div className="p-4 rounded-2xl border border-slate-200 bg-white shadow-2xs space-y-1">
            <span className="text-xs text-slate-500 font-medium">Receipts</span>
            <p className="text-2xl font-extrabold text-slate-900">Auto Email</p>
            <span className="text-[11px] text-purple-600 font-semibold">Integrated sandbox mailbox</span>
          </div>
        </div>
      </div>

      {/* 2. Six Focused Module Cards */}
      <div id="modules" className="space-y-4 scroll-mt-20">
        <div className="space-y-1">
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
            Commerce & Billing Subsystems
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            Choose a focused module to explore interactive simulators, request consoles, and production code recipes:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {PAYMENT_MODULES.map((mod) => (
            <Link
              key={mod.id}
              href={mod.href}
              className="p-6 rounded-2xl border border-slate-200 bg-white hover:border-indigo-400 hover:shadow-xs transition-all group flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${mod.color} shadow-2xs`}>
                    <Icon icon={mod.icon} className="w-5 h-5" />
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold">
                    {mod.badge}
                  </span>
                </div>

                <div>
                  <h3 className="font-bold text-base text-slate-900 group-hover:text-indigo-600 transition-colors">
                    {mod.name}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed mt-1.5">
                    {mod.desc}
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Primary Endpoint:</span>
                <div className="font-mono text-[11px] text-indigo-600 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-100 truncate">
                  {mod.endpoints[0]}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* 3. Payment Intents State Machine Flowchart */}
      <div id="state-machine" className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-6">
        <div className="border-b border-slate-100 pb-4">
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
            <Icon icon="ph:git-fork-bold" className="w-5 h-5 text-indigo-600" />
            Payment Intent Asynchronous Lifecycle
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            How status moves through creation, card confirmation, 3DS challenge action, delayed capture, and success.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
            <span className="px-2 py-0.5 rounded bg-indigo-100 text-indigo-700 font-mono text-[10px] font-bold">STAGE 1</span>
            <h4 className="text-xs sm:text-sm font-bold font-mono text-slate-900 break-all">requires_payment_method</h4>
            <p className="text-xs text-slate-600">
              Intent created with amount and currency. A <code className="font-mono text-indigo-600 break-all">client_secret</code> is returned for safe frontend form handling.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/50 space-y-2">
            <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-mono text-[10px] font-bold">STAGE 2 (CONDITIONAL)</span>
            <h4 className="text-xs sm:text-sm font-bold font-mono text-slate-900 break-all">requires_action (3DS)</h4>
            <p className="text-xs text-slate-600">
              Triggered if the card requires step-up authentication. Contains <code className="font-mono text-amber-700 break-all">next_action.redirect_to_url</code> for modal verification.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-purple-200 bg-purple-50/50 space-y-2">
            <span className="px-2 py-0.5 rounded bg-purple-100 text-purple-800 font-mono text-[10px] font-bold">STAGE 3 (OPTIONAL)</span>
            <h4 className="text-xs sm:text-sm font-bold font-mono text-slate-900 break-all">requires_capture</h4>
            <p className="text-xs text-slate-600">
              When <code className="font-mono text-purple-700 break-all">capture_method: &apos;manual&apos;</code> is used, funds are authorized and held until explicitly captured by your server.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/50 space-y-2">
            <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-mono text-[10px] font-bold">TERMINAL</span>
            <h4 className="text-xs sm:text-sm font-bold font-mono text-slate-900 break-all">succeeded</h4>
            <p className="text-xs text-slate-600">
              Payment is fully charged. Webhook <code className="font-mono text-emerald-700 break-all">payment_intent.succeeded</code> is triggered and receipt email is dispatched.
            </p>
          </div>
        </div>
      </div>

      {/* 4. Strategy Comparison Matrix */}
      <div id="comparison-matrix" className="space-y-4 scroll-mt-20">
        <div className="space-y-1">
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
            Billing Integration Strategies Compared
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            Compare integration approaches to choose the right architecture for your checkout flow:
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-xs">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-semibold">
              <tr>
                <th className="py-3.5 px-4 w-1/4">Evaluation Dimension</th>
                <th className="py-3.5 px-4 w-1/4 text-indigo-700">Hosted Checkout</th>
                <th className="py-3.5 px-4 w-1/4 text-emerald-700">Payment Intents API</th>
                <th className="py-3.5 px-4 w-1/4 text-slate-700">Direct 1-Step Charge</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-600">
              {COMPARISON_ROWS.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-50/50">
                  <td className="py-3.5 px-4 font-bold text-slate-900">{row.feature}</td>
                  <td className="py-3.5 px-4">{row.hosted}</td>
                  <td className="py-3.5 px-4 text-emerald-800 font-medium">{row.intents}</td>
                  <td className="py-3.5 px-4 text-slate-500">{row.charge}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 5. Currency Units & Idempotency Rules */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl border border-slate-200 bg-white shadow-xs space-y-3">
          <div className="flex items-center gap-2">
            <Icon icon="ph:coin-bold" className="w-5 h-5 text-indigo-600" />
            <h3 className="font-bold text-sm text-slate-900">Currency & Amount Conventions</h3>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            All amounts must be passed in the <strong>smallest currency unit</strong> (e.g. cents for USD, pence for GBP).
          </p>
          <div className="p-3 bg-slate-50 rounded-xl font-mono text-xs text-indigo-600 border border-slate-100 space-y-1">
            <p>amount: 2900, currency: &apos;usd&apos;  →  $29.00 USD</p>
            <p>amount: 4950, currency: &apos;eur&apos;  →  €49.50 EUR</p>
            <p>amount: 1000, currency: &apos;jpy&apos;  →  ¥1,000 JPY (zero-decimal)</p>
          </div>
        </div>

        <div className="p-6 rounded-2xl border border-slate-200 bg-white shadow-xs space-y-3">
          <div className="flex items-center gap-2">
            <Icon icon="ph:repeat-bold" className="w-5 h-5 text-emerald-600" />
            <h3 className="font-bold text-sm text-slate-900">Idempotency & Replay Protection</h3>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Pass an <code className="font-mono text-emerald-600">Idempotency-Key: &lt;uuid&gt;</code> header on payment confirmations or direct charges. Repeated requests return cached results with an <code className="font-mono text-slate-700">Idempotent-Replay: true</code> response header.
          </p>
          <div className="p-3 bg-slate-50 rounded-xl font-mono text-xs text-slate-700 border border-slate-100">
            Idempotency-Key: 7b34f2d1-98a0-4b8c-b01e-c2f689e4719b
          </div>
        </div>
      </div>
    </div>
  );
}
