'use client';

import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import config from '@/config/env';
import { InteractiveConsole } from '@/components/docs/InteractiveConsole';

export default function TestCardsCatalogPage() {
  const publicApiUrl = config.publicApiUrl || 'https://playground.nileslabs.com/api/v1';
  const [selectedCard, setSelectedCard] = useState('4242424242424242');
  const [copiedCard, setCopiedCard] = useState<string | null>(null);

  const testCards = [
    { number: '4242424242424242', brand: 'Visa', outcome: 'Success (200)', status: 'success', description: 'Standard successful charge.' },
    { number: '5555555555554444', brand: 'Mastercard', outcome: 'Success (200)', status: 'success', description: 'Mastercard successful payment.' },
    { number: '378282246310005', brand: 'Amex', outcome: 'Success (200)', status: 'success', description: 'American Express format card.' },
    { number: '4000000000000002', brand: 'Visa', outcome: 'Declined (402)', status: 'failed', description: 'General card decline simulation.' },
    { number: '4000000000000127', brand: 'Visa', outcome: 'Insufficient Funds (402)', status: 'failed', description: 'Account balance insufficient.' },
    { number: '4000000000000069', brand: 'Visa', outcome: 'Expired Card (402)', status: 'failed', description: 'Card expired validation error.' },
    { number: '4000000000000341', brand: 'Visa', outcome: '3DS Required (200)', status: 'requires_action', description: 'Triggers 3D Secure authentication challenge.' },
    { number: '4000000000000110', brand: 'Visa', outcome: 'Processing Error (500)', status: 'error', description: 'Simulates gateway outage / processing glitch.' },
  ];

  const handleCopy = (num: string) => {
    navigator.clipboard.writeText(num);
    setCopiedCard(num);
    setTimeout(() => setCopiedCard(null), 2000);
  };

  return (
    <div className="space-y-12 w-full text-slate-900">
      {/* 1. Header */}
      <div id="overview" className="space-y-4 scroll-mt-20">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold uppercase tracking-wider border border-indigo-100">
          <Icon icon="ph:cards-bold" className="w-3.5 h-3.5" />
          <span>Mock Commerce & Billing</span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-[1.15]">
          Deterministic Test Cards Catalog
        </h1>

        <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-3xl">
          Use these preconfigured card numbers to test every checkout outcome: successful charges, 3DS authentication triggers, and realistic payment failures.
        </p>
      </div>

      {/* 2. Interactive Card Tester */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-6">
        <div className="border-b border-slate-100 pb-4">
          <h3 className="font-bold text-base text-slate-900">Test Selected Card Number</h3>
          <p className="text-xs text-slate-500">
            Selected Card: <code className="font-mono text-xs font-bold text-indigo-600">{selectedCard}</code>
          </p>
        </div>

        <InteractiveConsole
          method="POST"
          path="/payments/charge"
          title="Charge Test Card"
          initialBody={JSON.stringify(
            {
              amount: 2900,
              currency: 'usd',
              card_number: selectedCard,
              exp_month: 12,
              exp_year: 2028,
              cvc: '123',
            },
            null,
            2
          )}
        />
      </div>

      {/* 3. Cards Catalog Table */}
      <div id="catalog" className="space-y-4 scroll-mt-20">
        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
          Available Test Numbers
        </h2>

        <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-xs">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-semibold">
              <tr>
                <th className="py-3 px-4">Card Number</th>
                <th className="py-3 px-4">Brand</th>
                <th className="py-3 px-4">Simulated Outcome</th>
                <th className="py-3 px-4">Description</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-600">
              {testCards.map((card) => (
                <tr key={card.number} className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-slate-900 tracking-wider">
                    {card.number.replace(/(\d{4})/g, '$1 ').trim()}
                  </td>
                  <td className="py-3 px-4">{card.brand}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-0.5 rounded text-[11px] font-bold border ${
                        card.status === 'success'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : card.status === 'requires_action'
                          ? 'bg-amber-50 text-amber-700 border-amber-200'
                          : 'bg-rose-50 text-rose-700 border-rose-200'
                      }`}
                    >
                      {card.outcome}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-xs text-slate-500">{card.description}</td>
                  <td className="py-3 px-4 text-right">
                    <div className="inline-flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => setSelectedCard(card.number)}
                        className="px-2.5 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold cursor-pointer"
                      >
                        Use in Tester
                      </button>
                      <button
                        type="button"
                        onClick={() => handleCopy(card.number)}
                        className="p-1 rounded-lg text-slate-400 hover:text-slate-700 cursor-pointer"
                        title="Copy card number"
                      >
                        <Icon
                          icon={copiedCard === card.number ? 'ph:check-bold' : 'ph:copy-bold'}
                          className="w-4 h-4"
                        />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
