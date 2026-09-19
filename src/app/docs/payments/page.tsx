import React from 'react';
import type { Metadata } from 'next';
import { Icon } from '@iconify/react';
import { CodeBlock } from '@/components/ui/CodeBlock';
import config from '@/config/env';
import { siteConfig } from '@/config/site';
import { LivePaymentStudio } from '@/components/docs/LivePaymentStudio';

export const metadata: Metadata = {
  title: 'Mock Payment Gateway & Checkout Simulation (Stripe Parity) — Playground API',
  description:
    'Simulate end-to-end payment flows with deterministic test cards, 3D Secure modal challenges, direct charges, hosted checkout sessions, refund ledgers, and receipt inbox integration.',
  keywords: [
    'mock payment gateway api',
    'stripe parity mock api',
    'test credit card numbers mock',
    '3d secure authentication simulation',
    'hosted checkout session mock api',
    'fake stripe payment intents',
    'payment refunds sandbox api',
    'mock receipt emails'
  ],
  alternates: {
    canonical: `${siteConfig.url}/docs/payments`,
  },
  openGraph: {
    title: 'Mock Payment Gateway & Checkout Simulation — Playground API',
    description:
      'Zero-risk payment sandbox with test credit cards, 3DS challenge popups, hosted checkout sessions, and automated receipt emails.',
    url: `${siteConfig.url}/docs/payments`,
    type: 'article',
  },
};

export default function PaymentsDocsPage() {
  const publicApiUrl = config.publicApiUrl || 'https://playground.nileslabs.com/api/v1';

  const directChargeSdkExample = `// 1. Direct Payment Intent Charge with TypeScript SDK
import { PlaygroundClient } from 'playground-api';

const client = new PlaygroundClient({
  identityToken: 'your_sandbox_token'
});

// Direct Charge Helper (Create & Confirm in 1-step)
const payment = await client.payments.charge({
  amount: 4900, // $49.00 in cents
  currency: 'usd',
  cardNumber: '4242424242424242',
  expMonth: 12,
  expYear: 2028,
  cvc: '123',
  receipt_email: 'buyer@example.com',
  description: 'Pro Subscription - Monthly'
});

console.log('Status:', payment.status); // 'succeeded'
console.log('Payment ID:', payment.id); // 'pi_test_...'`;

  const threeDsSdkExample = `// 2. Handling 3D Secure Authentication Challenge
const intent = await client.payments.confirmIntent('pi_test_12345', {
  cardNumber: '4000000000000341', // Triggers 3DS challenge
  expMonth: 12,
  expYear: 2028,
  cvc: '123'
});

if (intent.status === 'requires_action') {
  console.log('Redirecting customer to 3DS Challenge:', intent.next_action?.redirect_to_url?.url);

  // Once customer confirms OTP in iframe/modal:
  const verifiedIntent = await client.payments.confirm3DS(intent.id);
  console.log('Verified Status:', verifiedIntent.status); // 'succeeded'
}`;

  const checkoutSdkExample = `// 3. Hosted Checkout Session
const session = await client.checkout.createSession({
  customer_email: 'customer@example.com',
  mode: 'payment',
  line_items: [
    {
      name: 'Design System Masterclass',
      amount: 19900, // $199.00
      quantity: 1,
      currency: 'usd'
    }
  ],
  success_url: 'https://myapp.com/checkout/success?session_id={CHECKOUT_SESSION_ID}',
  cancel_url: 'https://myapp.com/checkout/canceled'
});

console.log('Redirect user to checkout:', session.url);`;

  const refundSdkExample = `// 4. Processing Full or Partial Refund
const refund = await client.payments.createRefund({
  payment_intent: 'pi_test_12345',
  amount: 2500, // $25.00 partial refund (omit for full refund)
  reason: 'requested_by_customer'
});

console.log('Refund Status:', refund.status); // 'succeeded'
console.log('Refund ID:', refund.id); // 're_test_...'`;

  const curlChargeExample = `curl -X POST "${publicApiUrl}/payments/charge" \\
  -H "Content-Type: application/json" \\
  -H "X-Playground-Identity: your_session_token" \\
  -d '{
    "amount": 2999,
    "currency": "usd",
    "cardNumber": "4242424242424242",
    "expMonth": 12,
    "expYear": 2028,
    "cvc": "123",
    "receipt_email": "customer@example.com",
    "description": "Premium License"
  }'`;

  return (
    <div className="max-w-5xl mx-auto space-y-12 pb-16">
      {/* Hero Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-xs font-semibold text-brand-600 dark:text-brand-400 uppercase tracking-wider">
          <Icon icon="lucide:credit-card" className="w-4 h-4" />
          <span>Payment Gateway & Checkout API</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-zinc-900 dark:text-zinc-50">
          Mock Payment Gateway & Hosted Checkout
        </h1>
        <p className="text-base text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-3xl">
          Simulate realistic payment flows with 100% Stripe parity. Test deterministic card outcomes (instant success, declines, insufficient funds, card expired), 3D Secure modal challenges, payment intents, refunds, and hosted checkout sessions with automated receipt email delivery.
        </p>
      </div>

      {/* Interactive Payment Studio Sandbox */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Icon icon="lucide:sparkles" className="w-5 h-5 text-amber-500" />
            <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
              Live Interactive Payment Studio
            </h2>
          </div>
          <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold border border-emerald-500/20">
            Active Identity Sandbox
          </span>
        </div>
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          Try direct charges, flip the 3D card preview, test 3D Secure authentication challenges, create hosted checkout sessions, and issue refunds directly in your browser.
        </p>
        <LivePaymentStudio />
      </section>

      {/* Feature Highlights Grid */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 space-y-2.5">
          <div className="w-9 h-9 rounded-xl bg-brand-500/10 text-brand-600 dark:text-brand-400 flex items-center justify-center font-bold">
            <Icon icon="lucide:credit-card" className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">Deterministic Card Numbers</h3>
          <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
            Test 8+ dedicated card numbers triggering instant success, insufficient funds (402), generic decline, expired cards, 3DS authentication, and 500 processing errors.
          </p>
        </div>

        <div className="p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 space-y-2.5">
          <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
            <Icon icon="lucide:shield-check" className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">3D Secure 2.0 Challenge Flow</h3>
          <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
            Full support for <code className="text-amber-600 dark:text-amber-400 font-mono text-[11px]">requires_action</code> state with interactive authorization challenge modal and confirm-3ds endpoint.
          </p>
        </div>

        <div className="p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 space-y-2.5">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
            <Icon icon="lucide:inbox" className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">Automatic Inbox Receipt Email</h3>
          <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
            When <code className="text-emerald-600 dark:text-emerald-400 font-mono text-[11px]">receipt_email</code> is provided, an itemized HTML invoice receipt is dispatched to your virtual Sandbox Inbox (<code className="font-mono text-[11px]">/docs/inbox</code>).
          </p>
        </div>
      </section>

      {/* Code Integration Examples */}
      <section className="space-y-6">
        <div className="flex items-center gap-2">
          <Icon icon="lucide:code-2" className="w-5 h-5 text-brand-500" />
          <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
            TypeScript SDK & API Integration
          </h2>
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">1. Direct 1-Step Payment Charge</h3>
          <CodeBlock code={directChargeSdkExample} language="typescript" />
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">2. 3D Secure Verification Challenge</h3>
          <CodeBlock code={threeDsSdkExample} language="typescript" />
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">3. Hosted Checkout Session Creation</h3>
          <CodeBlock code={checkoutSdkExample} language="typescript" />
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">4. Issuing Full or Partial Refunds</h3>
          <CodeBlock code={refundSdkExample} language="typescript" />
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">5. cURL Direct Request</h3>
          <CodeBlock code={curlChargeExample} language="bash" />
        </div>
      </section>

      {/* REST Endpoints Reference Table */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <Icon icon="lucide:database" className="w-5 h-5 text-brand-500" />
          <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
            Payment & Checkout Endpoints Reference
          </h2>
        </div>

        <div className="border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-zinc-50 dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 text-zinc-500 font-semibold">
              <tr>
                <th className="p-3">Method</th>
                <th className="p-3">Endpoint</th>
                <th className="p-3">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800 font-mono">
              <tr>
                <td className="p-3 font-bold text-emerald-600 dark:text-emerald-400">POST</td>
                <td className="p-3 text-zinc-900 dark:text-zinc-100">/api/v1/payments/charge</td>
                <td className="p-3 font-sans text-zinc-600 dark:text-zinc-400">Direct 1-step charge helper (creates & confirms intent).</td>
              </tr>
              <tr>
                <td className="p-3 font-bold text-emerald-600 dark:text-emerald-400">POST</td>
                <td className="p-3 text-zinc-900 dark:text-zinc-100">/api/v1/payments/intents</td>
                <td className="p-3 font-sans text-zinc-600 dark:text-zinc-400">Create new payment intent (requires_payment_method).</td>
              </tr>
              <tr>
                <td className="p-3 font-bold text-emerald-600 dark:text-emerald-400">POST</td>
                <td className="p-3 text-zinc-900 dark:text-zinc-100">/api/v1/payments/intents/:id/confirm</td>
                <td className="p-3 font-sans text-zinc-600 dark:text-zinc-400">Confirm payment intent with test card credentials.</td>
              </tr>
              <tr>
                <td className="p-3 font-bold text-emerald-600 dark:text-emerald-400">POST</td>
                <td className="p-3 text-zinc-900 dark:text-zinc-100">/api/v1/payments/intents/:id/confirm-3ds</td>
                <td className="p-3 font-sans text-zinc-600 dark:text-zinc-400">Authorize and complete 3D Secure verification challenge.</td>
              </tr>
              <tr>
                <td className="p-3 font-bold text-emerald-600 dark:text-emerald-400">POST</td>
                <td className="p-3 text-zinc-900 dark:text-zinc-100">/api/v1/payments/intents/:id/cancel</td>
                <td className="p-3 font-sans text-zinc-600 dark:text-zinc-400">Cancel uncaptured or pending payment intent.</td>
              </tr>
              <tr>
                <td className="p-3 font-bold text-blue-600 dark:text-blue-400">GET</td>
                <td className="p-3 text-zinc-900 dark:text-zinc-100">/api/v1/payments/intents</td>
                <td className="p-3 font-sans text-zinc-600 dark:text-zinc-400">List all sandbox payment intents.</td>
              </tr>
              <tr>
                <td className="p-3 font-bold text-blue-600 dark:text-blue-400">GET</td>
                <td className="p-3 text-zinc-900 dark:text-zinc-100">/api/v1/payments/intents/:id</td>
                <td className="p-3 font-sans text-zinc-600 dark:text-zinc-400">Get single payment intent by ID.</td>
              </tr>
              <tr>
                <td className="p-3 font-bold text-emerald-600 dark:text-emerald-400">POST</td>
                <td className="p-3 text-zinc-900 dark:text-zinc-100">/api/v1/payments/refunds</td>
                <td className="p-3 font-sans text-zinc-600 dark:text-zinc-400">Issue full or partial refund for succeeded payment.</td>
              </tr>
              <tr>
                <td className="p-3 font-bold text-emerald-600 dark:text-emerald-400">POST</td>
                <td className="p-3 text-zinc-900 dark:text-zinc-100">/api/v1/checkout/sessions</td>
                <td className="p-3 font-sans text-zinc-600 dark:text-zinc-400">Create hosted checkout session with line items.</td>
              </tr>
              <tr>
                <td className="p-3 font-bold text-emerald-600 dark:text-emerald-400">POST</td>
                <td className="p-3 text-zinc-900 dark:text-zinc-100">/api/v1/checkout/sessions/:id/complete</td>
                <td className="p-3 font-sans text-zinc-600 dark:text-zinc-400">Simulate customer checkout submission & payment.</td>
              </tr>
              <tr>
                <td className="p-3 font-bold text-emerald-600 dark:text-emerald-400">POST</td>
                <td className="p-3 text-zinc-900 dark:text-zinc-100">/api/v1/customers</td>
                <td className="p-3 font-sans text-zinc-600 dark:text-zinc-400">Create mock customer profile.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
