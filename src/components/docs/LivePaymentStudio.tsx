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
    badgeColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    description: 'Always succeeds immediately with 200 OK.',
  },
  {
    number: '5555555555554444',
    brand: 'mastercard',
    exp: '11/27',
    cvc: '456',
    title: 'Mastercard (Success)',
    outcome: 'success',
    badgeColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    description: 'Succeeds with Mastercard brand detection.',
  },
  {
    number: '378282246310005',
    brand: 'amex',
    exp: '09/26',
    cvc: '8888',
    title: 'Amex (Success)',
    outcome: 'success',
    badgeColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    description: '4-digit CVC American Express test card.',
  },
  {
    number: '4000000000000341',
    brand: 'visa',
    exp: '12/28',
    cvc: '123',
    title: '3DS Challenge (Verified)',
    outcome: 'challenge',
    badgeColor: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    description: 'Triggers requires_action with 3D Secure modal challenge.',
  },
  {
    number: '4000000000000127',
    brand: 'visa',
    exp: '12/28',
    cvc: '123',
    title: 'Insufficient Funds',
    outcome: 'insufficient_funds',
    badgeColor: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
    description: 'Declined with code: insufficient_funds (HTTP 402).',
  },
  {
    number: '4000000000000002',
    brand: 'visa',
    exp: '12/28',
    cvc: '123',
    title: 'Generic Decline',
    outcome: 'declined',
    badgeColor: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
    description: 'Declined with code: card_declined (HTTP 402).',
  },
  {
    number: '4000000000000069',
    brand: 'visa',
    exp: '10/22',
    cvc: '123',
    title: 'Expired Card',
    outcome: 'expired',
    badgeColor: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
    description: 'Declined with code: expired_card (HTTP 402).',
  },
  {
    number: '4000000000000110',
    brand: 'visa',
    exp: '12/28',
    cvc: '123',
    title: 'Processing Error 500',
    outcome: 'error',
    badgeColor: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
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
          cardNumber,
          cardHolder,
          expMonth: parseInt(expMonth, 10),
          expYear: parseInt(expYear, 10),
          cvc,
          receipt_email: receiptEmail || null,
          description: `Direct charge via Live Payment Studio (${currency} $${amount})`,
        }),
      });

      const data = await res.json();
      setLastResponse({ status: res.status, data });

      if (res.ok) {
        if (data.status === 'requires_action') {
          setActive3dsIntent(data);
          setStatusMessage({
            type: 'info',
            text: 'Payment requires 3D Secure verification. Please complete the challenge modal.',
          });
        } else {
          setStatusMessage({
            type: 'success',
            text: `Payment of $${amount} ${currency} succeeded! Intent ID: ${data.id}. Receipt auto-dispatched to Inbox.`,
          });
          fetchIntents();
        }
      } else {
        setStatusMessage({
          type: 'error',
          text: data.error || data.message || 'Payment simulation declined or failed.',
        });
      }
    } catch (err: any) {
      setStatusMessage({
        type: 'error',
        text: `Network failure connecting to payment engine: ${err.message}`,
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // Submit 3DS Challenge
  const handleComplete3DS = async (authorize: boolean) => {
    if (!active3dsIntent) return;
    setIs3dsSubmitting(true);

    try {
      const res = await fetch(`/api/v1/payments/intents/${active3dsIntent.id}/confirm`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          challenge_outcome: authorize ? 'authenticated' : 'failed',
        }),
      });

      const data = await res.json();
      setLastResponse({ status: res.status, data });
      setActive3dsIntent(null);

      if (res.ok && data.status === 'succeeded') {
        setStatusMessage({
          type: 'success',
          text: `3DS Challenge passed! Payment intent ${data.id} has succeeded. Receipt auto-sent to Inbox.`,
        });
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
        text: `Error completing checkout: ${err.message}`,
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // Submit Refund
  const handleRefundSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!refundTarget) return;
    setIsRefunding(true);

    const parsedRefundAmount = Math.round(parseFloat(refundAmount || '0') * 100);

    try {
      const res = await fetch('/api/v1/payments/refunds', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          payment_intent: refundTarget.id,
          amount: parsedRefundAmount,
        }),
      });

      const data = await res.json();
      setLastResponse({ status: res.status, data });
      setRefundTarget(null);

      if (res.ok) {
        setStatusMessage({
          type: 'success',
          text: `Refund of $${refundAmount} successfully processed for intent ${data.payment_intent}!`,
        });
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
    <div className="space-y-6 text-text-primary">
      {/* Top Banner Navigation Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-1.5 bg-bg-terminal border border-border-default rounded-xl">
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            type="button"
            onClick={() => setActiveTab('card')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'card'
                ? 'bg-bg-surface text-brand-primary shadow-xs border border-border-default font-bold'
                : 'text-text-muted hover:text-text-primary'
            }`}
          >
            <Icon icon="lucide:credit-card" className="w-4 h-4" />
            Direct Card Charge
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('checkout')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'checkout'
                ? 'bg-bg-surface text-brand-primary shadow-xs border border-border-default font-bold'
                : 'text-text-muted hover:text-text-primary'
            }`}
          >
            <Icon icon="lucide:shopping-bag" className="w-4 h-4" />
            Hosted Checkout
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab('ledger');
              fetchIntents();
            }}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'ledger'
                ? 'bg-bg-surface text-brand-primary shadow-xs border border-border-default font-bold'
                : 'text-text-muted hover:text-text-primary'
            }`}
          >
            <Icon icon="lucide:layers" className="w-4 h-4" />
            Sandbox Ledger
            {intentsList.length > 0 && (
              <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-brand-primary/10 text-brand-primary font-bold border border-brand-primary/20">
                {intentsList.length}
              </span>
            )}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('testcards')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'testcards'
                ? 'bg-bg-surface text-brand-primary shadow-xs border border-border-default font-bold'
                : 'text-text-muted hover:text-text-primary'
            }`}
          >
            <Icon icon="lucide:shield-check" className="w-4 h-4" />
            Test Card Directory
          </button>
        </div>

        <div className="flex items-center gap-2 pr-2">
          <Link
            href="/docs/inbox"
            className="flex items-center gap-1.5 text-xs font-medium text-text-muted hover:text-brand-primary transition-colors"
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
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
              : statusMessage.type === 'error'
              ? 'bg-rose-500/10 border-rose-500/30 text-rose-300'
              : 'bg-brand-primary/10 border-brand-primary/30 text-brand-primary'
          }`}
        >
          {statusMessage.type === 'success' && <Icon icon="lucide:check-circle-2" className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />}
          {statusMessage.type === 'error' && <Icon icon="lucide:x-circle" className="w-4 h-4 text-rose-400 mt-0.5 shrink-0" />}
          {statusMessage.type === 'info' && <Icon icon="lucide:sparkles" className="w-4 h-4 text-brand-primary mt-0.5 shrink-0" />}
          <div className="flex-1">{statusMessage.text}</div>
          <button
            type="button"
            onClick={() => setStatusMessage(null)}
            className="text-text-muted hover:text-text-primary text-xs cursor-pointer"
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
                className={`relative w-full h-full duration-500 transform-style-3d transition-transform rounded-2xl shadow-2xl overflow-hidden border border-border-default/60 ${
                  isFlipped ? 'rotate-y-180' : ''
                }`}
                style={{
                  transformStyle: 'preserve-3d',
                  transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
                  background: 'linear-gradient(135deg, #1e1b4b 0%, #0f172a 50%, #08090c 100%)',
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
                      <div className="text-[10px] font-mono tracking-widest text-text-muted uppercase">
                        Playground Card
                      </div>
                    </div>
                    <span className="text-sm font-bold tracking-wider px-2 py-0.5 rounded bg-white/10 backdrop-blur-sm uppercase">
                      {brandName}
                    </span>
                  </div>

                  <div className="font-mono text-lg sm:text-xl tracking-widest text-text-primary font-semibold drop-shadow-md">
                    {formattedCardNumber(cardNumber) || '•••• •••• •••• ••••'}
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <div>
                      <div className="text-[9px] uppercase tracking-wider text-text-muted">Cardholder</div>
                      <div className="font-medium tracking-wide truncate max-w-42.5 uppercase text-text-primary">
                        {cardHolder || 'CARDHOLDER NAME'}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-[9px] uppercase tracking-wider text-text-muted">Expires</div>
                      <div className="font-mono font-medium text-text-primary">
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
                  <div className="w-full h-10 bg-bg-canvas mt-2 border-y border-border-default" />
                  <div className="px-6 space-y-1">
                    <div className="text-[9px] text-right uppercase text-text-muted tracking-wider">CVV / CVC</div>
                    <div className="w-full bg-bg-surface text-text-primary border border-border-default font-mono text-right px-3 py-1.5 rounded text-sm font-bold tracking-widest">
                      {cvc || '•••'}
                    </div>
                  </div>
                  <div className="px-6 text-[9px] text-text-muted text-center">
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
                className="inline-flex items-center gap-1.5 text-xs text-text-muted hover:text-text-primary transition-colors cursor-pointer"
              >
                <Icon icon="lucide:rotate-ccw" className="w-3.5 h-3.5" />
                {isFlipped ? 'Show Card Front' : 'Show Card Back (CVC)'}
              </button>
            </div>

            {/* Quick 1-Click Test Card Presets */}
            <div className="p-4 bg-bg-surface border border-border-default rounded-xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-text-primary flex items-center gap-1.5">
                  <Icon icon="lucide:sparkles" className="w-3.5 h-3.5 text-brand-primary" />
                  <span>1-Click Test Card Presets</span>
                </span>
                <span className="text-[10px] text-text-muted">Click to autofill</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {TEST_CARDS.slice(0, 6).map((tc) => (
                  <button
                    key={tc.title}
                    type="button"
                    onClick={() => applyTestCard(tc)}
                    className="p-2 text-left bg-bg-terminal border border-border-default hover:border-brand-primary rounded-lg transition-all group cursor-pointer"
                  >
                    <div className="flex items-center justify-between text-[11px] font-semibold text-text-primary">
                      <span>{tc.title}</span>
                    </div>
                    <div className="font-mono text-[10px] text-text-muted mt-0.5 truncate">
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
              className="p-5 bg-bg-surface border border-border-default rounded-2xl space-y-4 shadow-sm"
            >
              <div className="flex items-center justify-between border-b border-border-default pb-3">
                <h3 className="text-sm font-semibold text-text-primary flex items-center gap-2">
                  <Icon icon="lucide:lock" className="w-4 h-4 text-emerald-400" />
                  <span>Simulate Direct Charge (`POST /payments/charge`)</span>
                </h3>
                <span className="text-xs font-bold text-brand-primary bg-brand-primary/10 px-2.5 py-1 rounded-full border border-brand-primary/20">
                  {currency} ${amount}
                </span>
              </div>

              {/* Amount & Currency */}
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <label className="block text-[11px] font-medium text-text-secondary mb-1">
                    Charge Amount
                  </label>
                  <div className="relative">
                    <Icon icon="lucide:dollar-sign" className="w-4 h-4 text-text-muted absolute left-3 top-2.5" />
                    <input
                      type="number"
                      step="0.01"
                      min="0.50"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="w-full pl-8 pr-3 py-2 bg-bg-terminal border border-border-default rounded-lg text-xs font-semibold text-text-primary focus:outline-none focus:border-brand-primary"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-text-secondary mb-1">
                    Currency
                  </label>
                  <select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className="w-full px-3 py-2 bg-bg-terminal border border-border-default rounded-lg text-xs font-semibold text-text-primary focus:outline-none focus:border-brand-primary cursor-pointer"
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
                <label className="block text-[11px] font-medium text-text-secondary mb-1">
                  Cardholder Name
                </label>
                <input
                  type="text"
                  value={cardHolder}
                  onChange={(e) => setCardHolder(e.target.value)}
                  className="w-full px-3 py-2 bg-bg-terminal border border-border-default rounded-lg text-xs font-medium text-text-primary focus:outline-none focus:border-brand-primary"
                  placeholder="e.g. Jane Doe"
                  required
                />
              </div>

              {/* Card Number */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[11px] font-medium text-text-secondary">
                    Card Number
                  </label>
                  <span className="text-[10px] text-text-muted font-mono">Brand: {brandName}</span>
                </div>
                <div className="relative">
                  <Icon icon="lucide:credit-card" className="w-4 h-4 text-text-muted absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={cardNumber}
                    onFocus={() => setIsFlipped(false)}
                    onChange={(e) => setCardNumber(e.target.value.replace(/\s+/g, ''))}
                    className="w-full pl-9 pr-3 py-2 bg-bg-terminal border border-border-default rounded-lg text-xs font-mono font-medium text-text-primary focus:outline-none focus:border-brand-primary"
                    placeholder="4242 •••• •••• ••••"
                    required
                  />
                </div>
              </div>

              {/* Expiration & CVC */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-medium text-text-secondary mb-1">
                    Exp Month
                  </label>
                  <input
                    type="text"
                    maxLength={2}
                    value={expMonth}
                    onFocus={() => setIsFlipped(false)}
                    onChange={(e) => setExpMonth(e.target.value)}
                    className="w-full px-3 py-2 bg-bg-terminal border border-border-default rounded-lg text-xs font-mono text-center text-text-primary focus:outline-none focus:border-brand-primary"
                    placeholder="MM"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-text-secondary mb-1">
                    Exp Year
                  </label>
                  <input
                    type="text"
                    maxLength={2}
                    value={expYear}
                    onFocus={() => setIsFlipped(false)}
                    onChange={(e) => setExpYear(e.target.value)}
                    className="w-full px-3 py-2 bg-bg-terminal border border-border-default rounded-lg text-xs font-mono text-center text-text-primary focus:outline-none focus:border-brand-primary"
                    placeholder="YY"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-text-secondary mb-1">
                    CVC / CVV
                  </label>
                  <input
                    type="password"
                    maxLength={4}
                    value={cvc}
                    onFocus={() => setIsFlipped(true)}
                    onBlur={() => setIsFlipped(false)}
                    onChange={(e) => setCvc(e.target.value)}
                    className="w-full px-3 py-2 bg-bg-terminal border border-border-default rounded-lg text-xs font-mono text-center text-text-primary focus:outline-none focus:border-brand-primary"
                    placeholder="123"
                    required
                  />
                </div>
              </div>

              {/* Receipt Email Auto-Dispatch */}
              <div>
                <label className="block text-[11px] font-medium text-text-secondary mb-1">
                  Receipt Email (Auto-dispatched to `/docs/inbox`)
                </label>
                <input
                  type="email"
                  value={receiptEmail}
                  onChange={(e) => setReceiptEmail(e.target.value)}
                  className="w-full px-3 py-2 bg-bg-terminal border border-border-default rounded-lg text-xs font-medium text-text-primary focus:outline-none focus:border-brand-primary"
                  placeholder="customer@example.com"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isProcessing}
                className="w-full py-2.5 px-4 bg-brand-primary hover:bg-brand-primary/90 text-white rounded-xl text-xs font-semibold shadow-md shadow-brand-primary/20 flex items-center justify-center gap-2 transition-all disabled:opacity-50 cursor-pointer"
              >
                {isProcessing ? (
                  <>
                    <Icon icon="lucide:refresh-cw" className="w-4 h-4 animate-spin" />
                    <span>Simulating Bank Processing...</span>
                  </>
                ) : (
                  <>
                    <Icon icon="lucide:lock" className="w-4 h-4" />
                    <span>Charge {currency} ${amount} (Sandbox)</span>
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
              className="p-5 bg-bg-surface border border-border-default rounded-2xl space-y-4 shadow-sm"
            >
              <h3 className="text-sm font-semibold text-text-primary flex items-center gap-2">
                <Icon icon="lucide:shopping-bag" className="w-4 h-4 text-brand-primary" />
                <span>Create Hosted Checkout Session (`POST /checkout/sessions`)</span>
              </h3>

              <div>
                <label className="block text-[11px] font-medium text-text-secondary mb-1">
                  Product / Plan Name
                </label>
                <input
                  type="text"
                  value={checkoutItemName}
                  onChange={(e) => setCheckoutItemName(e.target.value)}
                  className="w-full px-3 py-2 bg-bg-terminal border border-border-default rounded-lg text-xs font-medium text-text-primary focus:outline-none focus:border-brand-primary"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-medium text-text-secondary mb-1">
                    Price (USD)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={checkoutItemAmount}
                    onChange={(e) => setCheckoutItemAmount(e.target.value)}
                    className="w-full px-3 py-2 bg-bg-terminal border border-border-default rounded-lg text-xs font-medium text-text-primary focus:outline-none focus:border-brand-primary"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-text-secondary mb-1">
                    Customer Email
                  </label>
                  <input
                    type="email"
                    value={checkoutCustomerEmail}
                    onChange={(e) => setCheckoutCustomerEmail(e.target.value)}
                    className="w-full px-3 py-2 bg-bg-terminal border border-border-default rounded-lg text-xs font-medium text-text-primary focus:outline-none focus:border-brand-primary"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isCreatingCheckout}
                className="w-full py-2.5 px-4 bg-brand-primary hover:bg-brand-primary/90 text-white rounded-xl text-xs font-semibold shadow-md shadow-brand-primary/20 flex items-center justify-center gap-2 transition-all disabled:opacity-50 cursor-pointer"
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
              <div className="p-5 bg-bg-surface border border-border-default rounded-2xl space-y-4 shadow-sm">
                <div className="flex items-center justify-between border-b border-border-default pb-3">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-text-muted">
                      Hosted Checkout Simulation
                    </span>
                    <h4 className="text-sm font-bold text-text-primary">
                      {activeCheckoutSession.id}
                    </h4>
                  </div>
                  <span
                    className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${
                      activeCheckoutSession.payment_status === 'paid'
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                        : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                    }`}
                  >
                    {activeCheckoutSession.payment_status === 'paid' ? 'PAID' : 'UNPAID'}
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between text-text-secondary">
                    <span>Customer:</span>
                    <span className="font-medium text-text-primary">
                      {activeCheckoutSession.customer_email}
                    </span>
                  </div>
                  <div className="flex justify-between text-text-secondary">
                    <span>Total Amount:</span>
                    <span className="font-bold text-text-primary text-sm">
                      ${((activeCheckoutSession.amount_total || 0) / 100).toFixed(2)} USD
                    </span>
                  </div>
                  <div className="flex justify-between text-text-secondary">
                    <span>Checkout URL:</span>
                    <span className="font-mono text-[11px] text-text-muted truncate max-w-50">
                      {activeCheckoutSession.url}
                    </span>
                  </div>
                </div>

                {activeCheckoutSession.payment_status !== 'paid' ? (
                  <button
                    type="button"
                    onClick={handlePayCheckoutSession}
                    disabled={isProcessing}
                    className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold shadow-md shadow-emerald-500/20 flex items-center justify-center gap-2 transition-all disabled:opacity-50 cursor-pointer"
                  >
                    {isProcessing ? (
                      <Icon icon="lucide:refresh-cw" className="w-4 h-4 animate-spin" />
                    ) : (
                      <Icon icon="lucide:check-circle-2" className="w-4 h-4" />
                    )}
                    Simulate Customer Payment Submission (Complete Session)
                  </button>
                ) : (
                  <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-xs text-emerald-300 flex items-center justify-between">
                    <span className="flex items-center gap-1.5 font-medium">
                      <Icon icon="lucide:check-circle-2" className="w-4 h-4 text-emerald-400" />
                      Session Completed!
                    </span>
                    <Link
                      href="/docs/inbox"
                      className="underline font-semibold hover:text-emerald-200"
                    >
                      View Receipt in Inbox →
                    </Link>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-8 border-2 border-dashed border-border-default rounded-2xl flex flex-col items-center justify-center text-center text-text-muted space-y-2">
                <Icon icon="lucide:shopping-bag" className="w-8 h-8 text-text-muted" />
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
            <h3 className="text-sm font-semibold text-text-primary flex items-center gap-2">
              <Icon icon="lucide:layers" className="w-4 h-4 text-brand-primary" />
              <span>Sandbox Payment Intents Ledger</span>
            </h3>
            <button
              type="button"
              onClick={fetchIntents}
              className="flex items-center gap-1 text-xs text-text-muted hover:text-text-primary cursor-pointer transition-colors"
            >
              <Icon icon="lucide:refresh-cw" className="w-3.5 h-3.5" />
              Refresh
            </button>
          </div>

          {intentsList.length === 0 ? (
            <div className="p-8 border border-border-default rounded-xl text-center text-text-muted text-xs bg-bg-surface">
              No payment intents in sandbox yet. Charge a card or create a checkout session above!
            </div>
          ) : (
            <div className="overflow-x-auto border border-border-default rounded-xl bg-bg-surface">
              <table className="w-full text-left text-xs">
                <thead className="bg-bg-terminal border-b border-border-default text-text-muted font-semibold uppercase text-[11px]">
                  <tr>
                    <th className="p-3">Intent ID</th>
                    <th className="p-3">Amount</th>
                    <th className="p-3">Card / Method</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Receipt Email</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-subtle">
                  {intentsList.map((pi) => (
                    <tr key={pi.id} className="hover:bg-bg-elevated/40 transition-colors">
                      <td className="p-3 font-mono font-medium text-text-primary">
                        {pi.id}
                      </td>
                      <td className="p-3 font-semibold text-text-primary">
                        ${((pi.amount || 0) / 100).toFixed(2)} {pi.currency?.toUpperCase()}
                      </td>
                      <td className="p-3 text-text-muted font-mono">
                        {pi.payment_method?.card
                          ? `${pi.payment_method.card.brand?.toUpperCase()} •••• ${pi.payment_method.card.last4}`
                          : '—'}
                      </td>
                      <td className="p-3">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                            pi.status === 'succeeded'
                              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                              : pi.status === 'requires_action'
                              ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                              : pi.status === 'refunded'
                              ? 'bg-purple-500/10 text-purple-400 border-purple-500/30'
                              : 'bg-bg-terminal text-text-muted border-border-default'
                          }`}
                        >
                          {pi.status}
                        </span>
                      </td>
                      <td className="p-3 text-text-muted">
                        {pi.receipt_email ? (
                          <Link
                            href="/docs/inbox"
                            className="text-brand-primary hover:underline flex items-center gap-1"
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
                            type="button"
                            onClick={() => {
                              setRefundTarget(pi);
                              setRefundAmount(((pi.amount || 0) / 100).toFixed(2));
                            }}
                            className="px-2 py-1 text-[11px] font-medium text-rose-400 hover:bg-rose-500/10 rounded border border-rose-500/30 transition-colors cursor-pointer"
                          >
                            Refund
                          </button>
                        )}
                        {pi.status === 'requires_action' && (
                          <button
                            type="button"
                            onClick={() => setActive3dsIntent(pi)}
                            className="px-2 py-1 text-[11px] font-medium text-amber-400 hover:bg-amber-500/10 rounded border border-amber-500/30 transition-colors cursor-pointer"
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
          <div className="border border-border-default rounded-xl overflow-hidden bg-bg-surface">
            <table className="w-full text-left text-xs">
              <thead className="bg-bg-terminal border-b border-border-default text-text-muted font-semibold uppercase text-[11px]">
                <tr>
                  <th className="p-3">Scenario / Title</th>
                  <th className="p-3">Card Number</th>
                  <th className="p-3">Expiry / CVC</th>
                  <th className="p-3">Expected Outcome</th>
                  <th className="p-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle">
                {TEST_CARDS.map((tc) => (
                  <tr key={tc.number} className="hover:bg-bg-elevated/40 transition-colors">
                    <td className="p-3 font-semibold text-text-primary">
                      {tc.title}
                    </td>
                    <td className="p-3 font-mono font-medium text-accent-cyan">{tc.number}</td>
                    <td className="p-3 font-mono text-text-muted">
                      {tc.exp} / {tc.cvc}
                    </td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${tc.badgeColor}`}>
                        {tc.description}
                      </span>
                    </td>
                    <td className="p-3 text-right space-x-2">
                      <button
                        type="button"
                        onClick={() => handleCopy(tc.number)}
                        className="p-1.5 text-text-muted hover:text-text-primary rounded cursor-pointer"
                        title="Copy Card Number"
                      >
                        {copiedText === tc.number ? <Icon icon="lucide:check" className="w-3.5 h-3.5 text-emerald-400" /> : <Icon icon="lucide:copy" className="w-3.5 h-3.5" />}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          applyTestCard(tc);
                          setActiveTab('card');
                        }}
                        className="px-2 py-1 bg-brand-primary/10 text-brand-primary border border-brand-primary/20 hover:bg-brand-primary/20 rounded font-medium text-[11px] cursor-pointer"
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
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-bg-surface border border-border-default rounded-2xl shadow-2xl p-6 space-y-5 animate-in fade-in zoom-in-95 duration-200 text-text-primary">
            <div className="flex items-center justify-between border-b border-border-default pb-3">
              <div className="flex items-center gap-2">
                <Icon icon="lucide:shield-check" className="w-5 h-5 text-amber-400" />
                <h4 className="text-sm font-bold text-text-primary">
                  3D Secure 2.0 Identity Verification
                </h4>
              </div>
              <button
                type="button"
                onClick={() => handleComplete3DS(false)}
                className="text-text-muted hover:text-text-primary cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-4 bg-bg-terminal border border-border-default rounded-xl space-y-2 text-xs">
              <div className="flex justify-between text-text-secondary">
                <span>Merchant:</span>
                <span className="font-semibold text-text-primary">Playground API Store</span>
              </div>
              <div className="flex justify-between text-text-secondary">
                <span>Amount:</span>
                <span className="font-bold text-text-primary">
                  ${((active3dsIntent.amount || 0) / 100).toFixed(2)} {active3dsIntent.currency?.toUpperCase()}
                </span>
              </div>
              <div className="flex justify-between text-text-secondary">
                <span>Payment Intent:</span>
                <span className="font-mono text-[11px] text-text-muted">{active3dsIntent.id}</span>
              </div>
            </div>

            <p className="text-xs text-text-secondary">
              A simulated One-Time Passcode challenge was sent to the test cardholder. Authorize the transaction to advance the intent from `requires_action` to `succeeded`.
            </p>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={() => handleComplete3DS(false)}
                disabled={is3dsSubmitting}
                className="py-2.5 px-4 bg-bg-terminal hover:bg-bg-elevated border border-border-default text-text-secondary rounded-xl text-xs font-semibold transition-all disabled:opacity-50 cursor-pointer"
              >
                Cancel / Reject
              </button>
              <button
                type="button"
                onClick={() => handleComplete3DS(true)}
                disabled={is3dsSubmitting}
                className="py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold shadow-md shadow-emerald-500/20 flex items-center justify-center gap-2 transition-all disabled:opacity-50 cursor-pointer"
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
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4">
          <form
            onSubmit={handleRefundSubmit}
            className="w-full max-w-md bg-bg-surface border border-border-default rounded-2xl shadow-2xl p-6 space-y-4 animate-in fade-in zoom-in-95 duration-200 text-text-primary"
          >
            <div className="flex items-center justify-between border-b border-border-default pb-3">
              <div className="flex items-center gap-2">
                <Icon icon="lucide:rotate-ccw" className="w-5 h-5 text-rose-400" />
                <h4 className="text-sm font-bold text-text-primary">
                  Issue Refund (`POST /payments/refunds`)
                </h4>
              </div>
              <button
                type="button"
                onClick={() => setRefundTarget(null)}
                className="text-text-muted hover:text-text-primary cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="text-xs space-y-1 text-text-secondary">
              <div>Target Intent: <span className="font-mono text-text-primary font-semibold">{refundTarget.id}</span></div>
              <div>Original Amount: <span className="font-semibold text-text-primary">${((refundTarget.amount || 0) / 100).toFixed(2)}</span></div>
            </div>

            <div>
              <label className="block text-[11px] font-medium text-text-secondary mb-1">
                Refund Amount ($)
              </label>
              <input
                type="number"
                step="0.01"
                max={((refundTarget.amount || 0) / 100).toFixed(2)}
                value={refundAmount}
                onChange={(e) => setRefundAmount(e.target.value)}
                className="w-full px-3 py-2 bg-bg-terminal border border-border-default rounded-lg text-xs font-semibold text-text-primary focus:outline-none focus:border-brand-primary"
                required
              />
              <span className="text-[10px] text-text-muted">Leave full amount for complete refund, or reduce for partial.</span>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={() => setRefundTarget(null)}
                className="py-2 px-4 bg-bg-terminal hover:bg-bg-elevated border border-border-default text-text-secondary rounded-xl text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isRefunding}
                className="py-2 px-4 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-semibold shadow-md shadow-rose-500/20 flex items-center justify-center gap-1.5 disabled:opacity-50 cursor-pointer"
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
        <div className="p-4 bg-bg-terminal text-text-primary rounded-xl font-mono text-xs border border-border-default space-y-2">
          <div className="flex items-center justify-between text-[11px] text-text-muted">
            <span>Last API Response ({lastResponse.status} {lastResponse.status === 200 || lastResponse.status === 201 ? 'OK' : 'ERROR'})</span>
            <button
              type="button"
              onClick={() => handleCopy(JSON.stringify(lastResponse.data, null, 2))}
              className="text-text-muted hover:text-text-primary flex items-center gap-1 cursor-pointer"
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
