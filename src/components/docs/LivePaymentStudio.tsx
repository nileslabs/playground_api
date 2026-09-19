'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Icon } from '@iconify/react';
import Link from 'next/link';

interface PaymentIntentRecord {
  id: string;
  amount: number;
  currency: string;
  status: string;
  client_secret?: string;
  description?: string;
  receipt_email?: string | null;
  payment_method?: {
    card?: {
      brand: string;
      last4: string;
      exp_month: number;
      exp_year: number;
    };
  } | null;
  created_at?: string;
  next_action?: any;
}

interface TestCardPreset {
  number: string;
  brand: string;
  exp: string;
  cvc: string;
  title: string;
  outcome: 'success' | 'challenge' | 'declined' | 'insufficient_funds' | 'expired' | 'error';
  badgeColor: string;
  description: string;
}

const TEST_CARDS: TestCardPreset[] = [
  {
    number: '4242424242424242',
    brand: 'visa',
    exp: '12/28',
    cvc: '123',
    title: 'Visa (Success)',
    outcome: 'success',
    badgeColor: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
    description: 'Always succeeds immediately with 200 OK.',
  },
  {
    number: '5555555555554444',
    brand: 'mastercard',
    exp: '11/27',
    cvc: '456',
    title: 'Mastercard (Success)',
    outcome: 'success',
    badgeColor: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
    description: 'Succeeds with Mastercard brand detection.',
  },
  {
    number: '378282246310005',
    brand: 'amex',
    exp: '09/26',
    cvc: '8888',
    title: 'Amex (Success)',
    outcome: 'success',
    badgeColor: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
    description: '4-digit CVC American Express test card.',
  },
  {
    number: '4000000000000341',
    brand: 'visa',
    exp: '12/28',
    cvc: '123',
    title: '3DS Challenge (Verified)',
    outcome: 'challenge',
    badgeColor: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
    description: 'Triggers requires_action with 3D Secure modal challenge.',
  },
  {
    number: '4000000000000127',
    brand: 'visa',
    exp: '12/28',
    cvc: '123',
    title: 'Insufficient Funds',
    outcome: 'insufficient_funds',
    badgeColor: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20',
    description: 'Declined with code: insufficient_funds (HTTP 402).',
  },
  {
    number: '4000000000000002',
    brand: 'visa',
    exp: '12/28',
    cvc: '123',
    title: 'Generic Decline',
    outcome: 'declined',
    badgeColor: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20',
    description: 'Declined with code: card_declined (HTTP 402).',
  },
  {
    number: '4000000000000069',
    brand: 'visa',
    exp: '10/22',
    cvc: '123',
    title: 'Expired Card',
    outcome: 'expired',
    badgeColor: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20',
    description: 'Declined with code: expired_card (HTTP 402).',
  },
  {
    number: '4000000000000110',
    brand: 'visa',
    exp: '12/28',
    cvc: '123',
    title: 'Processing Error 500',
    outcome: 'error',
    badgeColor: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20',
    description: 'Simulates upstream bank timeout or 500 server fault.',
  },
];

export function LivePaymentStudio() {
  const [activeTab, setActiveTab] = useState<'card' | 'checkout' | 'ledger' | 'testcards'>('card');
  
  // Card Form State
  const [cardNumber, setCardNumber] = useState('4242424242424242');
  const [cardHolder, setCardHolder] = useState('Alex Taylor');
  const [expMonth, setExpMonth] = useState('12');
  const [expYear, setExpYear] = useState('28');
  const [cvc, setCvc] = useState('123');
  const [amount, setAmount] = useState('29.99');
  const [currency, setCurrency] = useState('USD');
  const [receiptEmail, setReceiptEmail] = useState('customer@example.com');
  const [isFlipped, setIsFlipped] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // 3DS Challenge Modal State
  const [active3dsIntent, setActive3dsIntent] = useState<PaymentIntentRecord | null>(null);
  const [is3dsSubmitting, setIs3dsSubmitting] = useState(false);
  
  // Checkout Session State
  const [checkoutItemName, setCheckoutItemName] = useState('Pro Subscription (Monthly)');
  const [checkoutItemAmount, setCheckoutItemAmount] = useState('49.00');
  const [checkoutCustomerEmail, setCheckoutCustomerEmail] = useState('buyer@startup.io');
  const [activeCheckoutSession, setActiveCheckoutSession] = useState<any | null>(null);
  const [isCreatingCheckout, setIsCreatingCheckout] = useState(false);
  
  // Ledger & Response State
  const [intentsList, setIntentsList] = useState<PaymentIntentRecord[]>([]);
  const [lastResponse, setLastResponse] = useState<any | null>(null);
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);
  
  // Refund Modal
  const [refundTarget, setRefundTarget] = useState<PaymentIntentRecord | null>(null);
  const [refundAmount, setRefundAmount] = useState('');
  const [isRefunding, setIsRefunding] = useState(false);

  // Detect Card Brand
  const detectBrand = (num: string): string => {
    const clean = num.replace(/\s+/g, '');
    if (/^4/.test(clean)) return 'Visa';
    if (/^(5[1-5]|222[1-9]|22[3-9][0-9]|2[3-6][0-9]{2}|27[01][0-9]|2720)/.test(clean)) return 'Mastercard';
    if (/^3[47]/.test(clean)) return 'Amex';
    if (/^6(?:011|5[0-9]{2})/.test(clean)) return 'Discover';
    if (/^(?:2131|1800|35\d{3})/.test(clean)) return 'JCB';
    return 'Card';
  };

  const formattedCardNumber = (num: string) => {
    const clean = num.replace(/\D/g, '').slice(0, 16);
    return clean.replace(/(\d{4})/g, '$1 ').trim();
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(text);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const applyTestCard = (card: TestCardPreset) => {
    setCardNumber(card.number);
    const [m, y] = card.exp.split('/');
    setExpMonth(m);
    setExpYear(y);
    setCvc(card.cvc);
    setStatusMessage({
      type: 'info',
      text: `Preset applied: ${card.title} (${card.description})`,
    });
  };

  const fetchIntents = useCallback(async () => {
    try {
      const res = await fetch('/api/v1/payments/intents');
      if (res.ok) {
        const data = await res.json();
        const list = Array.isArray(data) ? data : data.data || [];
        setIntentsList(list);
      }
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    fetchIntents();
  }, [fetchIntents]);

  // Execute Direct Charge
  const handleProcessPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setStatusMessage(null);
    setLastResponse(null);

    const parsedAmount = Math.round(parseFloat(amount || '0') * 100);

    try {
      const res = await fetch('/api/v1/payments/charge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: parsedAmount,
          currency: currency.toLowerCase(),
          cardNumber: cardNumber.replace(/\s+/g, ''),
          expMonth: parseInt(expMonth, 10),
          expYear: parseInt(`20${expYear}`, 10),
          cvc,
          receipt_email: receiptEmail || undefined,
          description: `Direct payment simulation by ${cardHolder}`,
          billing_details: {
            name: cardHolder,
            email: receiptEmail || undefined,
          },
        }),
      });

      const data = await res.json();
      setLastResponse({ status: res.status, data });

      if (res.status === 200 && data.status === 'succeeded') {
        setStatusMessage({
          type: 'success',
          text: `Payment successful! $${amount} charged (${data.id}). Receipt sent to inbox.`,
        });
        fetchIntents();
      } else if (res.status === 200 && data.status === 'requires_action') {
        setStatusMessage({
          type: 'info',
          text: `3D Secure authentication required! Opening verification challenge...`,
        });
        setActive3dsIntent(data);
        fetchIntents();
      } else {
        const errorMsg = data.error || (data.last_payment_error && data.last_payment_error.message) || 'Payment failed';
        setStatusMessage({
          type: 'error',
          text: `Payment declined (${res.status}): ${errorMsg}`,
        });
      }
    } catch (err: any) {
      setStatusMessage({
        type: 'error',
        text: `Network error: ${err.message}`,
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // Complete 3DS Challenge
  const handleComplete3DS = async (authorize: boolean) => {
    if (!active3dsIntent) return;
    setIs3dsSubmitting(true);

    if (!authorize) {
      setActive3dsIntent(null);
      setIs3dsSubmitting(false);
      setStatusMessage({
        type: 'error',
        text: '3D Secure authentication was canceled by the customer.',
      });
      return;
    }

    try {
      const res = await fetch(`/api/v1/payments/intents/${active3dsIntent.id}/confirm-3ds`, {
        method: 'POST',
      });
      const data = await res.json();
      setLastResponse({ status: res.status, data });

      if (res.ok && data.status === 'succeeded') {
        setStatusMessage({
          type: 'success',
          text: `3D Secure verification passed! Payment intent ${data.id} is succeeded.`,
        });
        setActive3dsIntent(null);
        fetchIntents();
      } else {
        setStatusMessage({
          type: 'error',
          text: data.error || 'Failed to complete 3DS challenge.',
        });
      }
    } catch (err: any) {
      setStatusMessage({
        type: 'error',
        text: `3DS Challenge Error: ${err.message}`,
      });
    } finally {
      setIs3dsSubmitting(false);
    }
  };

  // Create Hosted Checkout Session
  const handleCreateCheckoutSession = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreatingCheckout(true);
    setStatusMessage(null);

    const parsedAmount = Math.round(parseFloat(checkoutItemAmount || '0') * 100);

    try {
      const res = await fetch('/api/v1/checkout/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer_email: checkoutCustomerEmail,
          mode: 'payment',
          line_items: [
            {
              name: checkoutItemName,
              amount: parsedAmount,
              quantity: 1,
              currency: 'usd',
            },
          ],
        }),
      });

      const data = await res.json();
      setLastResponse({ status: res.status, data });

      if (res.ok) {
        setActiveCheckoutSession(data);
        setStatusMessage({
          type: 'success',
          text: `Hosted Checkout Session created (${data.id})! Ready for simulated customer submission.`,
        });
      } else {
        setStatusMessage({
          type: 'error',
          text: data.error || 'Failed to create checkout session.',
        });
      }
    } catch (err: any) {
      setStatusMessage({
        type: 'error',
        text: `Error creating checkout session: ${err.message}`,
      });
    } finally {
      setIsCreatingCheckout(false);
    }
  };

  // Pay / Complete Checkout Session
  const handlePayCheckoutSession = async () => {
    if (!activeCheckoutSession) return;
    setIsProcessing(true);

    try {
      const res = await fetch(`/api/v1/checkout/sessions/${activeCheckoutSession.id}/complete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cardNumber: '4242424242424242',
          expMonth: 12,
          expYear: 2028,
          cvc: '123',
        }),
      });

      const data = await res.json();
      setLastResponse({ status: res.status, data });

      if (res.ok) {
        setStatusMessage({
          type: 'success',
          text: `Checkout Session completed! Payment Intent (${data.payment_intent}) created and receipt emailed.`,
        });
        setActiveCheckoutSession(data);
        fetchIntents();
      } else {
        setStatusMessage({
          type: 'error',
          text: data.error || 'Failed to complete checkout session.',
        });
      }
    } catch (err: any) {
      setStatusMessage({
        type: 'error',
        text: `Error completing checkout session: ${err.message}`,
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle Refund Submit
  const handleRefundSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!refundTarget) return;
    setIsRefunding(true);

    const parsedAmount = refundAmount ? Math.round(parseFloat(refundAmount) * 100) : undefined;

    try {
      const res = await fetch('/api/v1/payments/refunds', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          payment_intent: refundTarget.id,
          amount: parsedAmount,
          reason: 'requested_by_customer',
        }),
      });

      const data = await res.json();
      setLastResponse({ status: res.status, data });

      if (res.ok) {
        setStatusMessage({
          type: 'success',
          text: `Refund (${data.id}) issued successfully for $${((data.amount || 0) / 100).toFixed(2)}.`,
        });
        setRefundTarget(null);
        setRefundAmount('');
        fetchIntents();
      } else {
        setStatusMessage({
          type: 'error',
          text: data.error || 'Failed to create refund.',
        });
      }
    } catch (err: any) {
      setStatusMessage({
        type: 'error',
        text: `Refund error: ${err.message}`,
      });
    } finally {
      setIsRefunding(false);
    }
  };

  const brandName = detectBrand(cardNumber);

  return (
    <div className="space-y-6">
      {/* Top Banner Navigation Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-1.5 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl">
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            onClick={() => setActiveTab('card')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'card'
                ? 'bg-white dark:bg-zinc-800 text-brand-600 dark:text-brand-400 shadow-sm border border-zinc-200/80 dark:border-zinc-700/80'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
            }`}
          >
            <Icon icon="lucide:credit-card" className="w-4 h-4" />
            Direct Card Charge
          </button>
          <button
            onClick={() => setActiveTab('checkout')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'checkout'
                ? 'bg-white dark:bg-zinc-800 text-brand-600 dark:text-brand-400 shadow-sm border border-zinc-200/80 dark:border-zinc-700/80'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
            }`}
          >
            <Icon icon="lucide:shopping-bag" className="w-4 h-4" />
            Hosted Checkout
          </button>
          <button
            onClick={() => {
              setActiveTab('ledger');
              fetchIntents();
            }}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'ledger'
                ? 'bg-white dark:bg-zinc-800 text-brand-600 dark:text-brand-400 shadow-sm border border-zinc-200/80 dark:border-zinc-700/80'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
            }`}
          >
            <Icon icon="lucide:layers" className="w-4 h-4" />
            Sandbox Ledger
            {intentsList.length > 0 && (
              <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-brand-500/10 text-brand-600 dark:text-brand-400 font-bold">
                {intentsList.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('testcards')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'testcards'
                ? 'bg-white dark:bg-zinc-800 text-brand-600 dark:text-brand-400 shadow-sm border border-zinc-200/80 dark:border-zinc-700/80'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
            }`}
          >
            <Icon icon="lucide:shield-check" className="w-4 h-4" />
            Test Card Directory
          </button>
        </div>

        <div className="flex items-center gap-2 pr-2">
          <Link
            href="/docs/inbox"
            className="flex items-center gap-1.5 text-xs font-medium text-zinc-500 hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
          >
            <Icon icon="lucide:inbox" className="w-3.5 h-3.5" />
            Receipts in Inbox
          </Link>
        </div>
      </div>

      {/* Global Status Alert */}
      {statusMessage && (
        <div
          className={`flex items-start gap-3 p-4 rounded-xl border text-xs font-medium transition-all ${
            statusMessage.type === 'success'
              ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-500/30 text-emerald-800 dark:text-emerald-300'
              : statusMessage.type === 'error'
              ? 'bg-rose-50 dark:bg-rose-950/30 border-rose-500/30 text-rose-800 dark:text-rose-300'
              : 'bg-blue-50 dark:bg-blue-950/30 border-blue-500/30 text-blue-800 dark:text-blue-300'
          }`}
        >
          {statusMessage.type === 'success' && <Icon icon="lucide:check-circle-2" className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />}
          {statusMessage.type === 'error' && <Icon icon="lucide:x-circle" className="w-4 h-4 text-rose-600 mt-0.5 shrink-0" />}
          {statusMessage.type === 'info' && <Icon icon="lucide:sparkles" className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />}
          <div className="flex-1">{statusMessage.text}</div>
          <button
            onClick={() => setStatusMessage(null)}
            className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 text-xs"
          >
            ✕
          </button>
        </div>
      )}

      {/* TAB 1: DIRECT CARD CHARGE */}
      {activeTab === 'card' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: 3D Credit Card & Preset Quick Buttons */}
          <div className="lg:col-span-6 space-y-5">
            {/* Visual Credit Card Preview */}
            <div className="relative w-full aspect-[1.586/1] max-w-105 mx-auto perspective-1000">
              <div
                className={`relative w-full h-full duration-500 transform-style-3d transition-transform rounded-2xl shadow-xl overflow-hidden ${
                  isFlipped ? 'rotate-y-180' : ''
                }`}
                style={{
                  transformStyle: 'preserve-3d',
                  transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
                  background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
                }}
              >
                {/* FRONT OF CARD */}
                <div
                  className="absolute inset-0 p-6 flex flex-col justify-between text-white backface-hidden"
                  style={{ backfaceVisibility: 'hidden' }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-7 rounded bg-amber-400/80 border border-amber-300/40 relative overflow-hidden shadow-inner flex items-center justify-center">
                        <div className="w-8 h-4 border border-amber-600/40 rounded-sm grid grid-cols-2" />
                      </div>
                      <div className="text-[10px] font-mono tracking-widest text-zinc-400 uppercase">
                        Playground Card
                      </div>
                    </div>
                    <span className="text-sm font-bold tracking-wider px-2 py-0.5 rounded bg-white/10 backdrop-blur-sm uppercase">
                      {brandName}
                    </span>
                  </div>

                  <div className="font-mono text-lg sm:text-xl tracking-widest text-zinc-100 font-semibold drop-shadow-md">
                    {formattedCardNumber(cardNumber) || '•••• •••• •••• ••••'}
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <div>
                      <div className="text-[9px] uppercase tracking-wider text-zinc-400">Cardholder</div>
                      <div className="font-medium tracking-wide truncate max-w-42.5 uppercase">
                        {cardHolder || 'CARDHOLDER NAME'}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-[9px] uppercase tracking-wider text-zinc-400">Expires</div>
                      <div className="font-mono font-medium">
                        {expMonth || 'MM'}/{expYear || 'YY'}
                      </div>
                    </div>
                  </div>
                </div>

                {/* BACK OF CARD */}
                <div
                  className="absolute inset-0 py-6 flex flex-col justify-between text-white backface-hidden"
                  style={{
                    backfaceVisibility: 'hidden',
                    transform: 'rotateY(180deg)',
                  }}
                >
                  <div className="w-full h-10 bg-zinc-950 mt-2" />
                  <div className="px-6 space-y-1">
                    <div className="text-[9px] text-right uppercase text-zinc-400 tracking-wider">CVV / CVC</div>
                    <div className="w-full bg-zinc-200 text-zinc-900 font-mono text-right px-3 py-1.5 rounded text-sm font-bold tracking-widest">
                      {cvc || '•••'}
                    </div>
                  </div>
                  <div className="px-6 text-[9px] text-zinc-400 text-center">
                    Simulated Sandbox Payment Gateway • Zero Real Funds Charged
                  </div>
                </div>
              </div>
            </div>

            {/* Flip Card Helper Button */}
            <div className="flex justify-center">
              <button
                type="button"
                onClick={() => setIsFlipped(!isFlipped)}
                className="inline-flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 transition-colors"
              >
                <Icon icon="lucide:rotate-ccw" className="w-3.5 h-3.5" />
                {isFlipped ? 'Show Card Front' : 'Show Card Back (CVC)'}
              </button>
            </div>

            {/* Quick 1-Click Test Card Presets */}
            <div className="p-4 bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 rounded-xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
                  <Icon icon="lucide:sparkles" className="w-3.5 h-3.5 text-brand-500" />
                  1-Click Test Card Presets
                </span>
                <span className="text-[10px] text-zinc-400">Click to autofill</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {TEST_CARDS.slice(0, 6).map((tc) => (
                  <button
                    key={tc.title}
                    type="button"
                    onClick={() => applyTestCard(tc)}
                    className="p-2 text-left bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 hover:border-brand-500 dark:hover:border-brand-500 rounded-lg transition-all group"
                  >
                    <div className="flex items-center justify-between text-[11px] font-semibold text-zinc-800 dark:text-zinc-200">
                      <span>{tc.title}</span>
                    </div>
                    <div className="font-mono text-[10px] text-zinc-500 dark:text-zinc-400 mt-0.5 truncate">
                      {tc.number}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Payment Form */}
          <div className="lg:col-span-6">
            <form
              onSubmit={handleProcessPayment}
              className="p-5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl space-y-4 shadow-sm"
            >
              <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-3">
                <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                  <Icon icon="lucide:lock" className="w-4 h-4 text-emerald-500" />
                  Simulate Direct Charge (`POST /payments/charge`)
                </h3>
                <span className="text-xs font-bold text-brand-600 dark:text-brand-400 bg-brand-500/10 px-2.5 py-1 rounded-full">
                  {currency} ${amount}
                </span>
              </div>

              {/* Amount & Currency */}
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <label className="block text-[11px] font-medium text-zinc-600 dark:text-zinc-400 mb-1">
                    Charge Amount
                  </label>
                  <div className="relative">
                    <Icon icon="lucide:dollar-sign" className="w-4 h-4 text-zinc-400 absolute left-3 top-2.5" />
                    <input
                      type="number"
                      step="0.01"
                      min="0.50"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="w-full pl-8 pr-3 py-2 bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 rounded-lg text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-brand-500"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-zinc-600 dark:text-zinc-400 mb-1">
                    Currency
                  </label>
                  <select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 rounded-lg text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-brand-500"
                  >
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="GBP">GBP (£)</option>
                    <option value="INR">INR (₹)</option>
                  </select>
                </div>
              </div>

              {/* Cardholder Name */}
              <div>
                <label className="block text-[11px] font-medium text-zinc-600 dark:text-zinc-400 mb-1">
                  Cardholder Name
                </label>
                <input
                  type="text"
                  value={cardHolder}
                  onChange={(e) => setCardHolder(e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 rounded-lg text-xs font-medium focus:outline-none focus:ring-2 focus:ring-brand-500"
                  placeholder="e.g. Jane Doe"
                  required
                />
              </div>

              {/* Card Number */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[11px] font-medium text-zinc-600 dark:text-zinc-400">
                    Card Number
                  </label>
                  <span className="text-[10px] text-zinc-400 font-mono">Brand: {brandName}</span>
                </div>
                <div className="relative">
                  <Icon icon="lucide:credit-card" className="w-4 h-4 text-zinc-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={cardNumber}
                    onFocus={() => setIsFlipped(false)}
                    onChange={(e) => setCardNumber(e.target.value.replace(/\s+/g, ''))}
                    className="w-full pl-9 pr-3 py-2 bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 rounded-lg text-xs font-mono font-medium focus:outline-none focus:ring-2 focus:ring-brand-500"
                    placeholder="4242 •••• •••• ••••"
                    required
                  />
                </div>
              </div>

              {/* Expiration & CVC */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-medium text-zinc-600 dark:text-zinc-400 mb-1">
                    Exp Month
                  </label>
                  <input
                    type="text"
                    maxLength={2}
                    value={expMonth}
                    onFocus={() => setIsFlipped(false)}
                    onChange={(e) => setExpMonth(e.target.value)}
                    className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 rounded-lg text-xs font-mono text-center focus:outline-none focus:ring-2 focus:ring-brand-500"
                    placeholder="MM"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-zinc-600 dark:text-zinc-400 mb-1">
                    Exp Year
                  </label>
                  <input
                    type="text"
                    maxLength={2}
                    value={expYear}
                    onFocus={() => setIsFlipped(false)}
                    onChange={(e) => setExpYear(e.target.value)}
                    className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 rounded-lg text-xs font-mono text-center focus:outline-none focus:ring-2 focus:ring-brand-500"
                    placeholder="YY"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-zinc-600 dark:text-zinc-400 mb-1">
                    CVC / CVV
                  </label>
                  <input
                    type="password"
                    maxLength={4}
                    value={cvc}
                    onFocus={() => setIsFlipped(true)}
                    onBlur={() => setIsFlipped(false)}
                    onChange={(e) => setCvc(e.target.value)}
                    className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 rounded-lg text-xs font-mono text-center focus:outline-none focus:ring-2 focus:ring-brand-500"
                    placeholder="123"
                    required
                  />
                </div>
              </div>

              {/* Receipt Email Auto-Dispatch */}
              <div>
                <label className="block text-[11px] font-medium text-zinc-600 dark:text-zinc-400 mb-1">
                  Receipt Email (Auto-dispatched to `/docs/inbox`)
                </label>
                <input
                  type="email"
                  value={receiptEmail}
                  onChange={(e) => setReceiptEmail(e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 rounded-lg text-xs font-medium focus:outline-none focus:ring-2 focus:ring-brand-500"
                  placeholder="customer@example.com"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isProcessing}
                className="w-full py-2.5 px-4 bg-brand-600 hover:bg-brand-500 text-white rounded-xl text-xs font-semibold shadow-md shadow-brand-500/20 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
              >
                {isProcessing ? (
                  <>
                    <Icon icon="lucide:refresh-cw" className="w-4 h-4 animate-spin" />
                    Simulating Bank Processing...
                  </>
                ) : (
                  <>
                    <Icon icon="lucide:lock" className="w-4 h-4" />
                    Charge {currency} ${amount} (Sandbox)
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* TAB 2: HOSTED CHECKOUT */}
      {activeTab === 'checkout' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-6 space-y-4">
            <form
              onSubmit={handleCreateCheckoutSession}
              className="p-5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl space-y-4 shadow-sm"
            >
              <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                <Icon icon="lucide:shopping-bag" className="w-4 h-4 text-brand-500" />
                Create Hosted Checkout Session (`POST /checkout/sessions`)
              </h3>

              <div>
                <label className="block text-[11px] font-medium text-zinc-600 dark:text-zinc-400 mb-1">
                  Product / Plan Name
                </label>
                <input
                  type="text"
                  value={checkoutItemName}
                  onChange={(e) => setCheckoutItemName(e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 rounded-lg text-xs font-medium focus:outline-none focus:ring-2 focus:ring-brand-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-medium text-zinc-600 dark:text-zinc-400 mb-1">
                    Price (USD)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={checkoutItemAmount}
                    onChange={(e) => setCheckoutItemAmount(e.target.value)}
                    className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 rounded-lg text-xs font-medium focus:outline-none focus:ring-2 focus:ring-brand-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-zinc-600 dark:text-zinc-400 mb-1">
                    Customer Email
                  </label>
                  <input
                    type="email"
                    value={checkoutCustomerEmail}
                    onChange={(e) => setCheckoutCustomerEmail(e.target.value)}
                    className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 rounded-lg text-xs font-medium focus:outline-none focus:ring-2 focus:ring-brand-500"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isCreatingCheckout}
                className="w-full py-2.5 px-4 bg-brand-600 hover:bg-brand-500 text-white rounded-xl text-xs font-semibold shadow-md shadow-brand-500/20 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
              >
                {isCreatingCheckout ? (
                  <Icon icon="lucide:refresh-cw" className="w-4 h-4 animate-spin" />
                ) : (
                  <Icon icon="lucide:shopping-bag" className="w-4 h-4" />
                )}
                Generate Checkout Session
              </button>
            </form>
          </div>

          {/* Active Checkout Session Simulator Preview */}
          <div className="lg:col-span-6">
            {activeCheckoutSession ? (
              <div className="p-5 bg-linear-to-br from-zinc-50 to-zinc-100 dark:from-zinc-900 dark:to-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl space-y-4 shadow-sm">
                <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-3">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400">
                      Hosted Checkout Simulation
                    </span>
                    <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                      {activeCheckoutSession.id}
                    </h4>
                  </div>
                  <span
                    className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                      activeCheckoutSession.payment_status === 'paid'
                        ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                        : 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                    }`}
                  >
                    {activeCheckoutSession.payment_status === 'paid' ? 'PAID' : 'UNPAID'}
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
                    <span>Customer:</span>
                    <span className="font-medium text-zinc-900 dark:text-zinc-100">
                      {activeCheckoutSession.customer_email}
                    </span>
                  </div>
                  <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
                    <span>Total Amount:</span>
                    <span className="font-bold text-zinc-900 dark:text-zinc-100 text-sm">
                      ${((activeCheckoutSession.amount_total || 0) / 100).toFixed(2)} USD
                    </span>
                  </div>
                  <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
                    <span>Checkout URL:</span>
                    <span className="font-mono text-[11px] truncate max-w-50">
                      {activeCheckoutSession.url}
                    </span>
                  </div>
                </div>

                {activeCheckoutSession.payment_status !== 'paid' ? (
                  <button
                    onClick={handlePayCheckoutSession}
                    disabled={isProcessing}
                    className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold shadow-md shadow-emerald-500/20 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                  >
                    {isProcessing ? (
                      <Icon icon="lucide:refresh-cw" className="w-4 h-4 animate-spin" />
                    ) : (
                      <Icon icon="lucide:check-circle-2" className="w-4 h-4" />
                    )}
                    Simulate Customer Payment Submission (Complete Session)
                  </button>
                ) : (
                  <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-500/20 rounded-xl text-xs text-emerald-700 dark:text-emerald-300 flex items-center justify-between">
                    <span className="flex items-center gap-1.5 font-medium">
                      <Icon icon="lucide:check-circle-2" className="w-4 h-4 text-emerald-500" />
                      Session Completed!
                    </span>
                    <Link
                      href="/docs/inbox"
                      className="underline font-semibold hover:text-emerald-900 dark:hover:text-emerald-100"
                    >
                      View Receipt in Inbox →
                    </Link>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-8 border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl flex flex-col items-center justify-center text-center text-zinc-400 space-y-2">
                <Icon icon="lucide:shopping-bag" className="w-8 h-8 text-zinc-300 dark:text-zinc-700" />
                <p className="text-xs">No active checkout session. Create one to test the hosted flow.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: SANDBOX LEDGER & REFUNDS */}
      {activeTab === 'ledger' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
              <Icon icon="lucide:layers" className="w-4 h-4 text-brand-500" />
              Sandbox Payment Intents Ledger
            </h3>
            <button
              onClick={fetchIntents}
              className="flex items-center gap-1 text-xs text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200"
            >
              <Icon icon="lucide:refresh-cw" className="w-3.5 h-3.5" />
              Refresh
            </button>
          </div>

          {intentsList.length === 0 ? (
            <div className="p-8 border border-zinc-200 dark:border-zinc-800 rounded-xl text-center text-zinc-400 text-xs">
              No payment intents in sandbox yet. Charge a card or create a checkout session above!
            </div>
          ) : (
            <div className="overflow-x-auto border border-zinc-200 dark:border-zinc-800 rounded-xl">
              <table className="w-full text-left text-xs">
                <thead className="bg-zinc-50 dark:bg-zinc-900/80 border-b border-zinc-200 dark:border-zinc-800 text-zinc-500 font-semibold">
                  <tr>
                    <th className="p-3">Intent ID</th>
                    <th className="p-3">Amount</th>
                    <th className="p-3">Card / Method</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Receipt Email</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                  {intentsList.map((pi) => (
                    <tr key={pi.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-900/50">
                      <td className="p-3 font-mono font-medium text-zinc-900 dark:text-zinc-100">
                        {pi.id}
                      </td>
                      <td className="p-3 font-semibold">
                        ${((pi.amount || 0) / 100).toFixed(2)} {pi.currency?.toUpperCase()}
                      </td>
                      <td className="p-3 text-zinc-500">
                        {pi.payment_method?.card
                          ? `${pi.payment_method.card.brand?.toUpperCase()} •••• ${pi.payment_method.card.last4}`
                          : '—'}
                      </td>
                      <td className="p-3">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            pi.status === 'succeeded'
                              ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                              : pi.status === 'requires_action'
                              ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                              : pi.status === 'refunded'
                              ? 'bg-purple-500/10 text-purple-600 dark:text-purple-400'
                              : 'bg-zinc-500/10 text-zinc-600 dark:text-zinc-400'
                          }`}
                        >
                          {pi.status}
                        </span>
                      </td>
                      <td className="p-3 text-zinc-500">
                        {pi.receipt_email ? (
                          <Link
                            href="/docs/inbox"
                            className="text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1"
                          >
                            <Icon icon="lucide:inbox" className="w-3 h-3" />
                            {pi.receipt_email}
                          </Link>
                        ) : (
                          '—'
                        )}
                      </td>
                      <td className="p-3 text-right space-x-2">
                        {pi.status === 'succeeded' && (
                          <button
                            onClick={() => {
                              setRefundTarget(pi);
                              setRefundAmount(((pi.amount || 0) / 100).toFixed(2));
                            }}
                            className="px-2 py-1 text-[11px] font-medium text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded"
                          >
                            Refund
                          </button>
                        )}
                        {pi.status === 'requires_action' && (
                          <button
                            onClick={() => setActive3dsIntent(pi)}
                            className="px-2 py-1 text-[11px] font-medium text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/30 rounded"
                          >
                            Complete 3DS
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* TAB 4: TEST CARD DIRECTORY */}
      {activeTab === 'testcards' && (
        <div className="space-y-4">
          <div className="border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-zinc-50 dark:bg-zinc-900/80 border-b border-zinc-200 dark:border-zinc-800 text-zinc-500 font-semibold">
                <tr>
                  <th className="p-3">Scenario / Title</th>
                  <th className="p-3">Card Number</th>
                  <th className="p-3">Expiry / CVC</th>
                  <th className="p-3">Expected Outcome</th>
                  <th className="p-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                {TEST_CARDS.map((tc) => (
                  <tr key={tc.number} className="hover:bg-zinc-50 dark:hover:bg-zinc-900/50">
                    <td className="p-3 font-semibold text-zinc-900 dark:text-zinc-100">
                      {tc.title}
                    </td>
                    <td className="p-3 font-mono font-medium">{tc.number}</td>
                    <td className="p-3 font-mono text-zinc-500">
                      {tc.exp} / {tc.cvc}
                    </td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${tc.badgeColor}`}>
                        {tc.description}
                      </span>
                    </td>
                    <td className="p-3 text-right space-x-2">
                      <button
                        onClick={() => handleCopy(tc.number)}
                        className="p-1.5 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 rounded"
                        title="Copy Card Number"
                      >
                        {copiedText === tc.number ? <Icon icon="lucide:check" className="w-3.5 h-3.5 text-emerald-500" /> : <Icon icon="lucide:copy" className="w-3.5 h-3.5" />}
                      </button>
                      <button
                        onClick={() => {
                          applyTestCard(tc);
                          setActiveTab('card');
                        }}
                        className="px-2 py-1 bg-brand-500/10 text-brand-600 dark:text-brand-400 hover:bg-brand-500/20 rounded font-medium text-[11px]"
                      >
                        Use in Studio
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 3D SECURE CHALLENGE MODAL */}
      {active3dsIntent && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl p-6 space-y-5 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-3">
              <div className="flex items-center gap-2">
                <Icon icon="lucide:shield-check" className="w-5 h-5 text-amber-500" />
                <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                  3D Secure 2.0 Identity Verification
                </h4>
              </div>
              <button
                onClick={() => handleComplete3DS(false)}
                className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
              >
                ✕
              </button>
            </div>

            <div className="p-4 bg-zinc-50 dark:bg-zinc-800/60 rounded-xl space-y-2 text-xs">
              <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
                <span>Merchant:</span>
                <span className="font-semibold text-zinc-900 dark:text-zinc-100">Playground API Store</span>
              </div>
              <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
                <span>Amount:</span>
                <span className="font-bold text-zinc-900 dark:text-zinc-100">
                  ${((active3dsIntent.amount || 0) / 100).toFixed(2)} {active3dsIntent.currency?.toUpperCase()}
                </span>
              </div>
              <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
                <span>Payment Intent:</span>
                <span className="font-mono text-[11px]">{active3dsIntent.id}</span>
              </div>
            </div>

            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              A simulated One-Time Passcode challenge was sent to the test cardholder. Authorize the transaction to advance the intent from `requires_action` to `succeeded`.
            </p>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={() => handleComplete3DS(false)}
                disabled={is3dsSubmitting}
                className="py-2.5 px-4 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 rounded-xl text-xs font-semibold transition-all disabled:opacity-50"
              >
                Cancel / Reject
              </button>
              <button
                type="button"
                onClick={() => handleComplete3DS(true)}
                disabled={is3dsSubmitting}
                className="py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold shadow-md shadow-emerald-500/20 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
              >
                {is3dsSubmitting ? <Icon icon="lucide:refresh-cw" className="w-4 h-4 animate-spin" /> : <Icon icon="lucide:shield-check" className="w-4 h-4" />}
                Authorize Payment
              </button>
            </div>
          </div>
        </div>
      )}

      {/* REFUND MODAL */}
      {refundTarget && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={handleRefundSubmit}
            className="w-full max-w-md bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl p-6 space-y-4 animate-in fade-in zoom-in-95 duration-200"
          >
            <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-3">
              <div className="flex items-center gap-2">
                <Icon icon="lucide:rotate-ccw" className="w-5 h-5 text-rose-500" />
                <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                  Issue Refund (`POST /payments/refunds`)
                </h4>
              </div>
              <button
                type="button"
                onClick={() => setRefundTarget(null)}
                className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
              >
                ✕
              </button>
            </div>

            <div className="text-xs space-y-1 text-zinc-600 dark:text-zinc-400">
              <div>Target Intent: <span className="font-mono text-zinc-900 dark:text-zinc-100 font-semibold">{refundTarget.id}</span></div>
              <div>Original Amount: <span className="font-semibold text-zinc-900 dark:text-zinc-100">${((refundTarget.amount || 0) / 100).toFixed(2)}</span></div>
            </div>

            <div>
              <label className="block text-[11px] font-medium text-zinc-600 dark:text-zinc-400 mb-1">
                Refund Amount ($)
              </label>
              <input
                type="number"
                step="0.01"
                max={((refundTarget.amount || 0) / 100).toFixed(2)}
                value={refundAmount}
                onChange={(e) => setRefundAmount(e.target.value)}
                className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 rounded-lg text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-brand-500"
                required
              />
              <span className="text-[10px] text-zinc-400">Leave full amount for complete refund, or reduce for partial.</span>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={() => setRefundTarget(null)}
                className="py-2 px-4 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 rounded-xl text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isRefunding}
                className="py-2 px-4 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-semibold shadow-md shadow-rose-500/20 flex items-center justify-center gap-1.5 disabled:opacity-50"
              >
                {isRefunding ? <Icon icon="lucide:refresh-cw" className="w-3.5 h-3.5 animate-spin" /> : <Icon icon="lucide:rotate-ccw" className="w-3.5 h-3.5" />}
                Confirm Refund
              </button>
            </div>
          </form>
        </div>
      )}

      {/* JSON Output Viewer */}
      {lastResponse && (
        <div className="p-4 bg-zinc-950 text-zinc-100 rounded-xl font-mono text-xs border border-zinc-800 space-y-2">
          <div className="flex items-center justify-between text-[11px] text-zinc-400">
            <span>Last API Response ({lastResponse.status} {lastResponse.status === 200 || lastResponse.status === 201 ? 'OK' : 'ERROR'})</span>
            <button
              onClick={() => handleCopy(JSON.stringify(lastResponse.data, null, 2))}
              className="text-zinc-400 hover:text-zinc-200 flex items-center gap-1"
            >
              <Icon icon="lucide:copy" className="w-3 h-3" />
              Copy JSON
            </button>
          </div>
          <pre className="overflow-x-auto max-h-48 text-[11px] text-emerald-400 leading-relaxed">
            {JSON.stringify(lastResponse.data, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
