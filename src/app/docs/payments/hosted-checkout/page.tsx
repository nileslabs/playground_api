'use client';

import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import { InteractiveConsole } from '@/components/docs/InteractiveConsole';
import { CodeBlock } from '@/components/docs/CodeBlock';

interface CartItem {
  id: string;
  name: string;
  unitAmount: number;
  quantity: number;
}

export default function HostedCheckoutPage() {
  const [items, setItems] = useState<CartItem[]>([
    { id: '1', name: 'Developer Pro SaaS (Monthly)', unitAmount: 2900, quantity: 1 },
    { id: '2', name: 'Dedicated Dedicated IP Add-on', unitAmount: 1500, quantity: 1 },
  ]);

  const [simulatedSessionId, setSimulatedSessionId] = useState('cs_test_92e8fa3914bc');
  const [checkoutModalOpen, setCheckoutModalOpen] = useState(false);
  const [checkoutStatus, setCheckoutStatus] = useState<'idle' | 'processing' | 'paid' | 'expired'>('idle');

  const subtotal = items.reduce((acc, item) => acc + item.unitAmount * item.quantity, 0);

  const updateQuantity = (id: string, delta: number) => {
    setItems((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const nextQty = Math.max(1, item.quantity + delta);
            return { ...item, quantity: nextQty };
          }
          return item;
        })
    );
  };

  const openSimulatedCheckout = () => {
    setCheckoutStatus('idle');
    setCheckoutModalOpen(true);
  };

  const handleSimulatePayment = () => {
    setCheckoutStatus('processing');
    setTimeout(() => {
      setCheckoutStatus('paid');
    }, 1200);
  };

  return (
    <div className="space-y-12 w-full text-slate-900 pb-16">
      {/* 1. Page Header */}
      <div id="overview" className="space-y-4 scroll-mt-20">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold uppercase tracking-wider border border-indigo-100">
          <Icon icon="ph:shopping-bag-open-bold" className="w-3.5 h-3.5" />
          <span>Mock Commerce & Billing</span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-[1.15]">
          Hosted Checkout Sessions
        </h1>

        <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-4xl">
          Integrate zero-PCI hosted checkout pages modeled directly after Stripe Checkout. Generate hosted session URLs,
          handle dynamic multi-line item carts, test success/cancel callback redirects, and trigger automated webhook fulfillment.
        </p>

        <div className="flex flex-wrap gap-2 pt-2">
          <button
            type="button"
            onClick={openSimulatedCheckout}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600 text-white hover:bg-indigo-700 transition-colors shadow-xs cursor-pointer"
          >
            <Icon icon="ph:browsers-bold" className="w-4 h-4" />
            Launch Simulated Hosted Checkout
          </button>
          <a
            href="#interactive-playground"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors border border-slate-200"
          >
            <Icon icon="ph:terminal-window-bold" className="w-4 h-4" />
            API Playground
          </a>
          <a
            href="#lifecycle"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors border border-slate-200"
          >
            <Icon icon="ph:arrows-clockwise-bold" className="w-4 h-4" />
            Lifecycle & Webhooks
          </a>
        </div>
      </div>

      {/* 2. Interactive Hosted Checkout Builder & Simulator */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Interactive Cart Builder</h2>
            <p className="text-xs text-slate-500">
              Configure line items and preview the generated Stripe-like hosted session.
            </p>
          </div>
          <button
            type="button"
            onClick={openSimulatedCheckout}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors cursor-pointer shadow-xs"
          >
            <Icon icon="ph:credit-card-bold" className="w-4 h-4 text-emerald-400" />
            Preview Checkout Window (${(subtotal / 100).toFixed(2)})
          </button>
        </div>

        {/* Cart Line Items */}
        <div className="divide-y divide-slate-100">
          {items.map((item) => (
            <div key={item.id} className="py-3 flex items-center justify-between gap-4 text-xs">
              <div className="space-y-0.5">
                <span className="font-semibold text-slate-900 text-sm">{item.name}</span>
                <p className="text-slate-500 font-mono">${(item.unitAmount / 100).toFixed(2)} USD each</p>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-slate-50">
                  <button
                    type="button"
                    onClick={() => updateQuantity(item.id, -1)}
                    className="px-2 py-1 hover:bg-slate-200 text-slate-600 font-bold"
                  >
                    -
                  </button>
                  <span className="px-3 py-1 font-mono font-bold text-slate-900 bg-white">{item.quantity}</span>
                  <button
                    type="button"
                    onClick={() => updateQuantity(item.id, 1)}
                    className="px-2 py-1 hover:bg-slate-200 text-slate-600 font-bold"
                  >
                    +
                  </button>
                </div>
                <div className="font-mono font-bold text-slate-900 w-16 text-right">
                  ${((item.unitAmount * item.quantity) / 100).toFixed(2)}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Cart Total Summary */}
        <div className="pt-3 border-t border-slate-200 flex items-center justify-between text-sm">
          <span className="font-bold text-slate-700">Subtotal & Total Due</span>
          <span className="font-mono font-extrabold text-base text-slate-900">${(subtotal / 100).toFixed(2)} USD</span>
        </div>
      </div>

      {/* 3. Simulated Hosted Checkout Modal */}
      {checkoutModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Browser Bar */}
            <div className="px-4 py-3 bg-slate-900 text-white flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                </div>
                <div className="ml-2 font-mono text-[11px] text-slate-300 bg-slate-800 px-3 py-0.5 rounded-md flex items-center gap-1.5">
                  <Icon icon="ph:lock-simple-fill" className="w-3 h-3 text-emerald-400" />
                  <span>https://playground.nileslabs.com/checkout?session_id={simulatedSessionId}</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setCheckoutModalOpen(false)}
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                <Icon icon="ph:x-bold" className="w-4 h-4" />
              </button>
            </div>

            {/* Split Screen Checkout Body */}
            <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-100">
              {/* Left Column: Order Summary */}
              <div className="p-6 bg-slate-50 space-y-4">
                <div className="flex items-center gap-2 text-indigo-700">
                  <Icon icon="ph:shopping-bag-bold" className="w-5 h-5" />
                  <span className="font-bold text-sm">Playground Store</span>
                </div>

                <div className="space-y-1">
                  <div className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Amount Due</div>
                  <div className="text-3xl font-extrabold text-slate-900 font-mono">${(subtotal / 100).toFixed(2)}</div>
                </div>

                <div className="space-y-2 pt-2 border-t border-slate-200">
                  {items.map((i) => (
                    <div key={i.id} className="flex justify-between text-xs text-slate-600">
                      <span>{i.name} × {i.quantity}</span>
                      <span className="font-mono font-medium">${((i.unitAmount * i.quantity) / 100).toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-2 text-[11px] text-slate-400">
                  Simulated hosted checkout session. PCI-DSS compliant boundary.
                </div>
              </div>

              {/* Right Column: Payment Form */}
              <div className="p-6 space-y-4">
                {checkoutStatus === 'idle' && (
                  <>
                    <h3 className="text-sm font-bold text-slate-900">Pay with Card</h3>

                    <div className="space-y-3 text-xs">
                      <div>
                        <label className="font-semibold text-slate-700 block mb-1">Email address</label>
                        <input
                          type="email"
                          defaultValue="developer@example.com"
                          className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-slate-800"
                        />
                      </div>

                      <div>
                        <label className="font-semibold text-slate-700 block mb-1">Card information</label>
                        <div className="border border-slate-300 rounded-lg p-2.5 bg-white space-y-2">
                          <input
                            type="text"
                            defaultValue="4242 4242 4242 4242"
                            className="w-full font-mono text-xs focus:outline-none"
                            placeholder="Card number"
                          />
                          <div className="flex gap-2 pt-1 border-t border-slate-100">
                            <input
                              type="text"
                              defaultValue="12/28"
                              className="w-1/2 font-mono text-xs focus:outline-none"
                              placeholder="MM / YY"
                            />
                            <input
                              type="text"
                              defaultValue="123"
                              className="w-1/2 font-mono text-xs focus:outline-none"
                              placeholder="CVC"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleSimulatePayment}
                      className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer"
                    >
                      Pay ${(subtotal / 100).toFixed(2)} USD
                    </button>
                  </>
                )}

                {checkoutStatus === 'processing' && (
                  <div className="py-16 text-center space-y-3">
                    <Icon icon="ph:spinner-bold" className="w-8 h-8 text-indigo-600 animate-spin mx-auto" />
                    <p className="text-xs font-semibold text-slate-700">Authorizing card charge...</p>
                  </div>
                )}

                {checkoutStatus === 'paid' && (
                  <div className="py-8 text-center space-y-4">
                    <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                      <Icon icon="ph:check-bold" className="w-6 h-6" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-base font-bold text-slate-900">Payment Succeeded!</h4>
                      <p className="text-xs text-slate-500">
                        Webhook <code className="font-mono text-indigo-600">checkout.session.completed</code> dispatched.
                      </p>
                      <p className="text-xs text-emerald-700 font-medium">
                        Redirecting to: <span className="font-mono text-[11px]">/success?session_id={simulatedSessionId}</span>
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setCheckoutModalOpen(false)}
                      className="w-full py-2 rounded-xl bg-slate-900 text-white text-xs font-bold cursor-pointer"
                    >
                      Close Simulation Window
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. Interactive Consoles for Checkout Endpoints */}
      <div id="interactive-playground" className="space-y-6 scroll-mt-20">
        <div className="border-b border-slate-200 pb-3">
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
            Interactive Checkout Endpoints
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Test creating sessions, inspecting state, and simulating completion against your active sandbox.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Create Session */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-900">
              1. Create Checkout Session
            </h3>
            <InteractiveConsole
              method="POST"
              path="/checkout/sessions"
              title="Create Checkout Session"
              initialBody={JSON.stringify(
                {
                  line_items: [
                    { name: 'Developer Pro SaaS', amount: 2900, currency: 'usd', quantity: 1 },
                    { name: 'Dedicated IP Addon', amount: 1500, currency: 'usd', quantity: 1 },
                  ],
                  mode: 'payment',
                  customer_email: 'buyer@example.com',
                  success_url: 'https://example.com/checkout/success?session_id={CHECKOUT_SESSION_ID}',
                  cancel_url: 'https://example.com/checkout/cancel',
                  metadata: {
                    user_id: 'usr_98124',
                    plan: 'pro_monthly',
                  },
                },
                null,
                2
              )}
            />
          </div>

          {/* Complete Session */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-900">
              2. Complete Session Simulation
            </h3>
            <InteractiveConsole
              method="POST"
              path={`/checkout/sessions/${simulatedSessionId}/complete`}
              title="Simulate Buyer Completing Checkout"
              initialBody={JSON.stringify(
                {
                  payment_status: 'paid',
                },
                null,
                2
              )}
            />
          </div>
        </div>
      </div>

      {/* 5. Production Integration Recipes */}
      <div id="lifecycle" className="space-y-6 scroll-mt-20">
        <div className="border-b border-slate-200 pb-3">
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
            Production Integration Recipes
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Server-side session generation and webhook fulfillment architecture.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <Icon icon="logos:nextjs-icon" className="w-4 h-4" />
              Next.js / Node Route (Create Session & Redirect)
            </h3>
            <CodeBlock
              language="typescript"
              code={`// app/api/checkout/route.ts
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { cartItems, userId } = await req.json();

  const session = await fetch('https://playground.nileslabs.com/api/v1/checkout/sessions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      line_items: cartItems.map((item: any) => ({
        name: item.title,
        amount: item.priceCents,
        quantity: item.qty,
      })),
      mode: 'payment',
      success_url: \`\${process.env.APP_URL}/dashboard?payment=success&session_id={CHECKOUT_SESSION_ID}\`,
      cancel_url: \`\${process.env.APP_URL}/cart\`,
      metadata: { userId },
    }),
  }).then(res => res.json());

  // Redirect buyer to the hosted checkout page
  return NextResponse.json({ url: session.url });
}`}
            />
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <Icon icon="logos:nodejs-icon" className="w-4 h-4" />
              Webhook Fulfillment Handler
            </h3>
            <CodeBlock
              language="javascript"
              code={`// Listen for checkout.session.completed
export async function handleWebhook(event) {
  if (event.type === 'checkout.session.completed') {
    const session = event.data;
    const userId = session.metadata?.userId;
    const totalAmount = session.amount_total;

    console.log(\`Order fulfilled for user \${userId}, total: \${totalAmount}\`);
    // 1. Grant entitlements in your database
    await grantProSubscription(userId);
    // 2. Receipt email was already dispatched to Virtual Inbox!
  }
}`}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
