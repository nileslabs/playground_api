'use client';

import React from 'react';

export function ComparisonSection() {
  return (
    <section id="compare" className="py-20 md:py-28 bg-white border-b border-slate-200/80">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Section Header */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold uppercase tracking-wider border border-slate-200">
            Why Playground API
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">
            Built for modern developers who need real state
          </h2>
          <p className="text-base sm:text-lg text-slate-600 font-normal leading-relaxed">
            Stop dealing with fake echo mocks that disappear when you refresh your browser.
          </p>
        </div>

        {/* Side by side comparison cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
          {/* Traditional Mock APIs Card */}
          <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-6 sm:p-8 space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Legacy Approach
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-200/80 text-slate-700">
                  JSONPlaceholder / DummyJSON
                </span>
              </div>
              <h3 className="text-xl font-bold text-slate-900">Fake Echo APIs</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Great for a 5-minute tutorial, but breaks as soon as you build a real CRUD UI, pagination test, or automated Playwright suite.
              </p>
            </div>

            <ul className="space-y-3.5 text-sm text-slate-600 border-t border-slate-200/80 pt-6">
              <li className="flex items-start gap-3">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-rose-100 text-rose-600 font-bold text-xs mt-0.5">
                  ✕
                </span>
                <span><strong>No real persistence:</strong> POST and PUT return a static dummy ID like 101, but the record is never saved.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-rose-100 text-rose-600 font-bold text-xs mt-0.5">
                  ✕
                </span>
                <span><strong>Disappears on refresh:</strong> State vanishes immediately; list views never show your created items.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-rose-100 text-rose-600 font-bold text-xs mt-0.5">
                  ✕
                </span>
                <span><strong>No visitor sandboxing:</strong> Either everyone shares the same read-only data, or mutations pollute everyone.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-rose-100 text-rose-600 font-bold text-xs mt-0.5">
                  ✕
                </span>
                <span><strong>Missing modern protocols:</strong> No GraphQL gateway, no subscriptions, no payment simulation.</span>
              </li>
            </ul>
          </div>

          {/* Playground API Card */}
          <div className="rounded-2xl border-2 border-indigo-500 bg-white p-6 sm:p-8 space-y-6 shadow-md relative flex flex-col justify-between">
            {/* Highlight badge */}
            <div className="absolute -top-3 right-6 px-3 py-1 rounded-full bg-indigo-600 text-white text-xs font-bold uppercase tracking-wider shadow-xs">
              Next Generation
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
                  Playground API
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100">
                  Stateful Sandbox
                </span>
              </div>
              <h3 className="text-xl font-bold text-slate-900">Virtual Session Overlay</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Execute full CRUD mutations that persist in your private visitor sandbox across reloads, without modifying shared database baselines.
              </p>
            </div>

            <ul className="space-y-3.5 text-sm text-slate-700 border-t border-indigo-100 pt-6">
              <li className="flex items-start gap-3">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 font-bold text-xs mt-0.5">
                  ✓
                </span>
                <span><strong>Real persistent CRUD:</strong> Created items appear at the top of your lists; updates apply in-place; deletes vanish.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 font-bold text-xs mt-0.5">
                  ✓
                </span>
                <span><strong>Zero-login isolation:</strong> Automatic HMAC-signed session cookie or header isolates your mutations privately.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 font-bold text-xs mt-0.5">
                  ✓
                </span>
                <span><strong>State management controls:</strong> Export your sandbox snapshot to JSON, import it anytime, or click reset to baseline.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 font-bold text-xs mt-0.5">
                  ✓
                </span>
                <span><strong>Full developer suite:</strong> GraphQL gateway, Stripe checkout simulation, virtual OTP email inbox, and chaos delay.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
