'use client';

import React, { useState, useMemo } from 'react';
import { Icon } from '@iconify/react';
import config from '@/config/env';
import { InteractiveConsole } from '@/components/docs/InteractiveConsole';
import { CodeBlock } from '@/components/docs/CodeBlock';

interface TestCard {
  id: string;
  number: string;
  brand: 'Visa' | 'Mastercard' | 'Amex';
  category: 'success' | '3ds' | 'declined' | 'fraud' | 'system';
  outcome: string;
  httpStatus: number;
  errorCode: string | null;
  description: string;
  suggestedAction: string;
}

const TEST_CARDS: TestCard[] = [
  {
    id: 'visa-success',
    number: '4242424242424242',
    brand: 'Visa',
    category: 'success',
    outcome: 'Immediate Success',
    httpStatus: 200,
    errorCode: null,
    description: 'Universal successful charge. Emulates valid card with sufficient liquidity and clean issuer risk score.',
    suggestedAction: 'Fulfill order, send customer receipt, dispatch payment_intent.succeeded webhook.',
  },
  {
    id: 'mc-success',
    number: '5555555555554444',
    brand: 'Mastercard',
    category: 'success',
    outcome: 'Immediate Success',
    httpStatus: 200,
    errorCode: null,
    description: 'Mastercard format successful payment. Validates multi-network bin routing and BIN range matching.',
    suggestedAction: 'Fulfill order, trigger inventory decrement.',
  },
  {
    id: 'amex-success',
    number: '378282246310005',
    brand: 'Amex',
    category: 'success',
    outcome: 'Immediate Success',
    httpStatus: 200,
    errorCode: null,
    description: 'American Express 15-digit card number. Emulates 4-digit CID validation.',
    suggestedAction: 'Fulfill order, record American Express processor reference.',
  },
  {
    id: '3ds-challenge',
    number: '4000000000000341',
    brand: 'Visa',
    category: '3ds',
    outcome: '3DS Challenge Required',
    httpStatus: 200,
    errorCode: 'authentication_required',
    description: 'Requires customer strong authentication (SCA / 3DS 2.2 challenge). Returns redirect / iframe action.',
    suggestedAction: 'Invoke stripe.confirmCardPayment() or display challenge modal for OTP / biometric confirmation.',
  },
  {
    id: '3ds-frictionless',
    number: '4000000000000317',
    brand: 'Visa',
    category: '3ds',
    outcome: '3DS Frictionless Approval',
    httpStatus: 200,
    errorCode: null,
    description: 'SCA exempt or frictionless authorization. Issuer performs silent risk analysis without prompting user.',
    suggestedAction: 'Payment succeeds immediately with 3DS cryptographic liability shift cryptogram.',
  },
  {
    id: 'generic-decline',
    number: '4000000000000002',
    brand: 'Visa',
    category: 'declined',
    outcome: 'Card Declined',
    httpStatus: 402,
    errorCode: 'card_declined',
    description: 'General hard decline from issuing bank without specific reason disclosed.',
    suggestedAction: 'Prompt customer to contact their card issuer or choose an alternate payment instrument.',
  },
  {
    id: 'insufficient-funds',
    number: '4000000000000127',
    brand: 'Visa',
    category: 'declined',
    outcome: 'Insufficient Funds',
    httpStatus: 402,
    errorCode: 'insufficient_funds',
    description: 'Cardholder account balance or available credit line is insufficient for the requested amount.',
    suggestedAction: 'Prompt user to retry with an alternate card or top up account balance.',
  },
  {
    id: 'expired-card',
    number: '4000000000000069',
    brand: 'Visa',
    category: 'declined',
    outcome: 'Expired Card',
    httpStatus: 402,
    errorCode: 'expired_card',
    description: 'Card has passed its valid expiration date.',
    suggestedAction: 'Highlight expiration date field in checkout UI and request updated card details.',
  },
  {
    id: 'incorrect-cvc',
    number: '4000000000000119',
    brand: 'Visa',
    category: 'declined',
    outcome: 'Incorrect Security Code',
    httpStatus: 402,
    errorCode: 'incorrect_cvc',
    description: 'Security code (CVV/CVC) failed issuer cryptographic check.',
    suggestedAction: 'Clear CVC input field and prompt customer to re-enter 3-digit or 4-digit code.',
  },
  {
    id: 'postal-code-fail',
    number: '4000000000000128',
    brand: 'Visa',
    category: 'declined',
    outcome: 'AVS Postal Mismatch',
    httpStatus: 402,
    errorCode: 'postal_code_invalid',
    description: 'Address Verification System (AVS) rejected the zip/postal code provided with billing address.',
    suggestedAction: 'Request customer verify postal code matches credit card monthly statement address.',
  },
  {
    id: 'fraud-blocked',
    number: '4000000000000005',
    brand: 'Visa',
    category: 'fraud',
    outcome: 'High Fraud Risk Blocked',
    httpStatus: 402,
    errorCode: 'fraudulent',
    description: 'Machine learning fraud detection rule blocked charge due to velocity, proxy, or stolen telemetry.',
    suggestedAction: 'Do not automatically retry. Flag customer account for compliance/risk review.',
  },
  {
    id: 'stolen-card',
    number: '4000000000000036',
    brand: 'Visa',
    category: 'fraud',
    outcome: 'Lost / Stolen Card',
    httpStatus: 402,
    errorCode: 'stolen_card',
    description: 'Card has been officially reported as lost or stolen by the primary account holder.',
    suggestedAction: 'Immediate reject. Halt order processing and do not reveal card status to suspicious agent.',
  },
  {
    id: 'velocity-limit',
    number: '4000000000000013',
    brand: 'Visa',
    category: 'system',
    outcome: 'Velocity Rate Limit',
    httpStatus: 429,
    errorCode: 'velocity_limit_exceeded',
    description: 'Card has exceeded frequency limits for consecutive transactions in a short window.',
    suggestedAction: 'Implement exponential backoff. Suggest user wait 15 minutes before retrying.',
  },
  {
    id: 'processing-error',
    number: '4000000000000110',
    brand: 'Visa',
    category: 'system',
    outcome: 'Issuer System Glitch',
    httpStatus: 500,
    errorCode: 'processing_error',
    description: 'Gateway connection dropped or card network interchange switch timed out.',
    suggestedAction: 'Safely retry request with identical Idempotency-Key header.',
  },
];

export default function TestCardsCatalogPage() {
  const [selectedCard, setSelectedCard] = useState<TestCard>(TEST_CARDS[0]);
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);

  // Filtered Cards
  const filteredCards = useMemo(() => {
    return TEST_CARDS.filter((card) => {
      const matchesFilter =
        activeFilter === 'all' ||
        (activeFilter === 'success' && card.category === 'success') ||
        (activeFilter === '3ds' && card.category === '3ds') ||
        (activeFilter === 'declined' && (card.category === 'declined' || card.category === 'fraud')) ||
        (activeFilter === 'system' && card.category === 'system');

      const matchesSearch =
        card.number.includes(searchQuery.replace(/\s+/g, '')) ||
        card.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
        card.outcome.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (card.errorCode && card.errorCode.toLowerCase().includes(searchQuery.toLowerCase())) ||
        card.description.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesFilter && matchesSearch;
    });
  }, [activeFilter, searchQuery]);

  const handleCopy = (card: TestCard) => {
    navigator.clipboard.writeText(card.number);
    setCopiedId(card.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const formatCardNumber = (num: string) => {
    if (num.length === 15) {
      return `${num.slice(0, 4)} ${num.slice(4, 10)} ${num.slice(10)}`;
    }
    return num.replace(/(\d{4})/g, '$1 ').trim();
  };

  return (
    <div className="space-y-12 w-full text-slate-900 pb-16">
      {/* 1. Page Header */}
      <div id="overview" className="space-y-4 scroll-mt-20">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold uppercase tracking-wider border border-emerald-100">
          <Icon icon="ph:cards-bold" className="w-3.5 h-3.5" />
          <span>Mock Commerce & Billing</span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-[1.15]">
          Deterministic Test Cards Catalog
        </h1>

        <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-4xl">
          Simulate every real-world checkout event deterministically. Playground API includes 14+ magic test card numbers,
          dynamic expiry validations, AVS postal address verification, and dynamic CVC security checks—zero real money charged.
        </p>

        <div className="flex flex-wrap gap-2 pt-2">
          <a
            href="#catalog"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600 text-white hover:bg-indigo-700 transition-colors shadow-xs"
          >
            <Icon icon="ph:table-bold" className="w-4 h-4" />
            Jump to Cards Catalog
          </a>
          <a
            href="#dynamic-simulations"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors border border-slate-200"
          >
            <Icon icon="ph:magic-wand-bold" className="w-4 h-4" />
            Dynamic AVS & CVC Rules
          </a>
          <a
            href="/docs/payments/payment-intents"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors border border-slate-200"
          >
            <Icon icon="ph:receipt-bold" className="w-4 h-4" />
            Payment Intents API
          </a>
        </div>
      </div>

      {/* 2. Interactive Virtual Card Tester */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Virtual Card Representation */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Selected Test Instrument</span>
            <button
              type="button"
              onClick={() => setIsFlipped(!isFlipped)}
              className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold inline-flex items-center gap-1 cursor-pointer"
            >
              <Icon icon="ph:arrow-clockwise-bold" className="w-3.5 h-3.5" />
              {isFlipped ? 'View Front' : 'Flip to CVC'}
            </button>
          </div>

          <div
            onClick={() => setIsFlipped(!isFlipped)}
            className={`w-full h-56 rounded-2xl p-6 text-white shadow-xl cursor-pointer transition-transform duration-500 relative select-none flex flex-col justify-between overflow-hidden ${
              selectedCard.category === 'success'
                ? 'bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 border border-indigo-500/30'
                : selectedCard.category === '3ds'
                ? 'bg-gradient-to-br from-amber-950 via-slate-900 to-amber-900 border border-amber-500/30'
                : selectedCard.category === 'fraud'
                ? 'bg-gradient-to-br from-rose-950 via-slate-900 to-rose-900 border border-rose-500/30'
                : 'bg-gradient-to-br from-slate-800 via-slate-900 to-zinc-950 border border-slate-700/50'
            }`}
          >
            {/* Ambient Glow */}
            <div className="absolute -top-12 -right-12 w-40 h-40 bg-white/5 rounded-full blur-2xl pointer-events-none" />

            {!isFlipped ? (
              <>
                <div className="flex items-center justify-between relative z-10">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-7 rounded bg-amber-400/80 border border-amber-300 flex items-center justify-center">
                      <div className="w-6 h-4 border border-amber-600/40 rounded-sm grid grid-cols-2 gap-0.5">
                        <div className="border-r border-amber-600/40" />
                        <div />
                      </div>
                    </div>
                    <Icon icon="ph:contactless-payment-bold" className="w-5 h-5 text-white/70" />
                  </div>
                  <div className="text-right">
                    <span className="font-extrabold text-base tracking-widest uppercase">{selectedCard.brand}</span>
                    <p className="text-[10px] text-white/60 tracking-wider">TEST MODE</p>
                  </div>
                </div>

                <div className="space-y-1 relative z-10 my-auto">
                  <div className="font-mono text-xl sm:text-2xl font-bold tracking-widest text-slate-100 drop-shadow-sm">
                    {formatCardNumber(selectedCard.number)}
                  </div>
                  <div className="text-[11px] text-white/70 font-sans">
                    Outcome: <span className="font-semibold text-white">{selectedCard.outcome}</span>
                  </div>
                </div>

                <div className="flex items-end justify-between relative z-10 text-xs">
                  <div>
                    <div className="text-[9px] uppercase tracking-wider text-white/50">Cardholder</div>
                    <div className="font-mono font-semibold tracking-wider text-slate-200">ALEXANDER TESTER</div>
                  </div>
                  <div className="text-right">
                    <div className="text-[9px] uppercase tracking-wider text-white/50">Expires</div>
                    <div className="font-mono font-semibold tracking-wider text-slate-200">12/28</div>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="relative z-10 -mx-6 -mt-6">
                  <div className="w-full h-10 bg-black/80" />
                </div>
                <div className="space-y-2 relative z-10">
                  <div className="text-[9px] uppercase tracking-wider text-white/60 text-right">Security Code (CVC)</div>
                  <div className="h-8 bg-white/90 rounded text-slate-900 font-mono font-bold text-right px-3 flex items-center justify-end text-sm">
                    {selectedCard.brand === 'Amex' ? '1234' : '123'}
                  </div>
                </div>
                <div className="text-[10px] text-white/50 relative z-10 leading-tight">
                  This virtual card is for development & CI test suites only. No monetary balance exists.
                </div>
              </>
            )}
          </div>

          {/* Quick Selection Actions */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
            <span className="text-slate-600 font-medium">Click card to flip • Ready to run</span>
            <button
              type="button"
              onClick={() => handleCopy(selectedCard)}
              className="inline-flex items-center gap-1.5 font-bold text-indigo-600 hover:text-indigo-800 cursor-pointer"
            >
              <Icon icon={copiedId === selectedCard.id ? 'ph:check-bold' : 'ph:copy-bold'} className="w-4 h-4" />
              {copiedId === selectedCard.id ? 'Copied Number!' : 'Copy Card Number'}
            </button>
          </div>
        </div>

        {/* Live Interactive Console */}
        <div className="lg:col-span-7">
          <InteractiveConsole
            method="POST"
            path="/payments/charge"
            title="Charge Test Card (Live Gateway Execution)"
            initialBody={JSON.stringify(
              {
                amount: 3500,
                currency: 'usd',
                card_number: selectedCard.number,
                exp_month: 12,
                exp_year: 2028,
                cvc: selectedCard.brand === 'Amex' ? '1234' : '123',
                description: `Dev test run for ${selectedCard.outcome}`,
              },
              null,
              2
            )}
          />
        </div>
      </div>

      {/* 3. Cards Catalog Section */}
      <div id="catalog" className="space-y-6 scroll-mt-20">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
          <div>
            <h2 className="text-2xl font-extrabold text-slate-900">Deterministic Card Catalog</h2>
            <p className="text-xs sm:text-sm text-slate-500">
              14 official test card credentials mapped to specific payment gateway outcomes.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5">
            {[
              { id: 'all', label: 'All Cards' },
              { id: 'success', label: 'Success (200)' },
              { id: '3ds', label: '3D Secure (SCA)' },
              { id: 'declined', label: 'Declines (402)' },
              { id: 'system', label: 'System (429/500)' },
            ].map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setActiveFilter(f.id)}
                className={`px-3 py-1 rounded-full text-xs font-semibold cursor-pointer transition-colors ${
                  activeFilter === f.id
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Search input */}
        <div className="relative max-w-md">
          <Icon icon="ph:magnifying-glass-bold" className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by card suffix, decline code, or brand..."
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 bg-white text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
          />
        </div>

        {/* Catalog Table */}
        <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-semibold">
                <tr>
                  <th className="py-3 px-4">Card Number</th>
                  <th className="py-3 px-4">Brand</th>
                  <th className="py-3 px-4">Outcome</th>
                  <th className="py-3 px-4">HTTP & Error Code</th>
                  <th className="py-3 px-4">Description & Handler Advice</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-600">
                {filteredCards.map((card) => {
                  const isSelected = selectedCard.id === card.id;
                  return (
                    <tr
                      key={card.id}
                      className={`hover:bg-slate-50/70 transition-colors ${isSelected ? 'bg-indigo-50/40' : ''}`}
                    >
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-900 tracking-wider whitespace-nowrap">
                        {formatCardNumber(card.number)}
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-slate-700 whitespace-nowrap">
                        <span className="inline-flex items-center gap-1.5">
                          <Icon
                            icon={
                              card.brand === 'Visa'
                                ? 'logos:visa'
                                : card.brand === 'Mastercard'
                                ? 'logos:mastercard'
                                : 'simple-icons:americanexpress'
                            }
                            className="w-5 h-5"
                          />
                          {card.brand}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-0.5 rounded text-[11px] font-bold border ${
                            card.httpStatus === 200 && card.category === 'success'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : card.category === '3ds'
                              ? 'bg-amber-50 text-amber-700 border-amber-200'
                              : card.httpStatus === 429
                              ? 'bg-orange-50 text-orange-700 border-orange-200'
                              : card.httpStatus === 500
                              ? 'bg-purple-50 text-purple-700 border-purple-200'
                              : 'bg-rose-50 text-rose-700 border-rose-200'
                          }`}
                        >
                          {card.outcome}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-mono text-[11px] whitespace-nowrap">
                        <span className="font-bold text-slate-900">{card.httpStatus}</span>
                        {card.errorCode && (
                          <span className="ml-1.5 px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                            {card.errorCode}
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-xs text-slate-600 max-w-md">
                        <div className="font-medium text-slate-800">{card.description}</div>
                        <div className="text-[11px] text-slate-500 mt-0.5 italic">
                          Advice: {card.suggestedAction}
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div className="inline-flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => setSelectedCard(card)}
                            className={`px-2.5 py-1 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                              isSelected
                                ? 'bg-indigo-600 text-white'
                                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                            }`}
                          >
                            {isSelected ? 'Loaded' : 'Load in Tester'}
                          </button>
                          <button
                            type="button"
                            onClick={() => handleCopy(card)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
                            title="Copy card number"
                          >
                            <Icon
                              icon={copiedId === card.id ? 'ph:check-bold' : 'ph:copy-bold'}
                              className={`w-4 h-4 ${copiedId === card.id ? 'text-emerald-600' : ''}`}
                            />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* 4. Dynamic Simulations & Input Heuristics */}
      <div id="dynamic-simulations" className="space-y-6 scroll-mt-20">
        <div className="border-b border-slate-200 pb-3">
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
            Dynamic Verification & Heuristic Overrides
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            In addition to magic card numbers, the engine evaluates field-level metadata in real time without requiring test card swapping.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-sm">
              <Icon icon="ph:calendar-x-bold" className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-slate-900">Dynamic Date Expiry</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Supply any <code className="font-mono text-indigo-600">exp_year</code> prior to the current calendar year (or current year with a past month), and the engine returns <code className="font-mono text-rose-600">expired_card</code> automatically.
            </p>
            <div className="p-2.5 rounded-lg bg-slate-50 font-mono text-[11px] text-slate-700">
              exp_month: 01, exp_year: 2020
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold text-sm">
              <Icon icon="ph:lock-key-bold" className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-slate-900">Magic CVC <code className="text-amber-700">000</code></h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Keep your normal success card (<code className="font-mono text-slate-800">4242...</code>) but pass <code className="font-mono text-indigo-600">cvc: &quot;000&quot;</code>. The gateway will simulate a security code mismatch (<code className="font-mono text-rose-600">incorrect_cvc</code>).
            </p>
            <div className="p-2.5 rounded-lg bg-slate-50 font-mono text-[11px] text-slate-700">
              cvc: &quot;000&quot; → 402 incorrect_cvc
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
            <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold text-sm">
              <Icon icon="ph:map-pin-bold" className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-slate-900">Magic Postal <code className="text-rose-700">99999</code></h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Pass postal code <code className="font-mono text-indigo-600">&quot;99999&quot;</code> in billing address details to simulate an Address Verification System (AVS) mismatch (<code className="font-mono text-rose-600">postal_code_invalid</code>).
            </p>
            <div className="p-2.5 rounded-lg bg-slate-50 font-mono text-[11px] text-slate-700">
              postal_code: &quot;99999&quot; → 402 AVS
            </div>
          </div>
        </div>
      </div>

      {/* 5. Production Integration Recipes */}
      <div id="recipes" className="space-y-6 scroll-mt-20">
        <div className="border-b border-slate-200 pb-3">
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
            Integration Handling Recipes
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            How to structure frontend and backend exception handling for decline codes in your application.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <Icon icon="logos:typescript-icon" className="w-4 h-4" />
              Frontend Decline Mapping (React / Next.js)
            </h3>
            <CodeBlock
              language="typescript"
              code={`// Map payment error codes to user-friendly form messages
export function mapPaymentError(error: { code?: string; message: string }): string {
  switch (error.code) {
    case 'card_declined':
      return 'Your card was declined by your bank. Please try another card.';
    case 'insufficient_funds':
      return 'Insufficient funds. Please check your balance or use another card.';
    case 'expired_card':
      return 'Your card has expired. Please check the expiration date.';
    case 'incorrect_cvc':
      return 'The CVC security code is incorrect. Check the back of your card.';
    case 'postal_code_invalid':
      return 'The postal code does not match your billing address.';
    case 'authentication_required':
      return '3D Secure authorization required. Opening bank challenge...';
    case 'velocity_limit_exceeded':
      return 'Too many payment attempts. Please wait a few minutes.';
    default:
      return error.message || 'Payment could not be completed. Please try again.';
  }
}`}
            />
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <Icon icon="logos:nodejs-icon" className="w-4 h-4" />
              Backend Intent Confirmation (Node.js / Express)
            </h3>
            <CodeBlock
              language="javascript"
              code={`import axios from 'axios';

// Confirm Payment Intent with Idempotency Key
export async function confirmIntent(intentId, paymentMethod, idempotencyKey) {
  try {
    const response = await axios.post(
      \`https://playground.nileslabs.com/api/v1/payments/intents/\${intentId}/confirm\`,
      { payment_method: paymentMethod },
      { headers: { 'Idempotency-Key': idempotencyKey } }
    );

    if (response.data.status === 'requires_action') {
      // Return client secret to frontend for 3DS challenge
      return { requiresAction: true, clientSecret: response.data.client_secret };
    }

    return { success: true, payment: response.data };
  } catch (err) {
    const errorDetails = err.response?.data?.error || {};
    console.error('Payment confirmation error:', errorDetails.code);
    throw errorDetails;
  }
}`}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
