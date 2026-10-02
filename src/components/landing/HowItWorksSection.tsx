'use client';

import React from 'react';

const steps = [
  {
    step: '01',
    title: 'Automatic Visitor Session',
    description:
      'The moment you or your test runner calls the API, an HMAC-SHA256 session token is assigned via an HTTP-only cookie or request header. No accounts, API keys, or sign-ups.',
    badge: 'Cookie or Header',
  },
  {
    step: '02',
    title: 'Virtual Mutation Overlay',
    description:
      'Any POST, PUT, or DELETE request saves directly to your isolated session records. The global baseline database is never permanently modified or polluted.',
    badge: 'Isolated Database Overlay',
  },
  {
    step: '03',
    title: 'Smart Merged Responses',
    description:
      'All GET operations slice and merge the baseline with your mutations: created records appear at the top, updates reflect in-place, and deletes are filtered out.',
    badge: 'Instant Consistency',
  },
];

export function HowItWorksSection() {
  return (
    <section className="py-20 md:py-28 bg-slate-50/50 border-b border-slate-200/80">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Section Header */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold uppercase tracking-wider border border-indigo-100">
            Architecture
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">
            How stateful sandboxing works
          </h2>
          <p className="text-base sm:text-lg text-slate-600 font-normal leading-relaxed">
            A zero-configuration virtual layer powered by PostgreSQL and Express.
          </p>
        </div>

        {/* 3 Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {steps.map((s, index) => (
            <div
              key={s.step}
              className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 space-y-4 shadow-xs relative flex flex-col justify-between hover:border-indigo-200 hover:shadow-sm transition-all"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-3xl font-extrabold text-indigo-600/90 tracking-tight">
                    {s.step}
                  </span>
                  <span className="text-[11px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                    {s.badge}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-900">{s.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed font-normal">
                  {s.description}
                </p>
              </div>

              {/* Step indicator arrow for desktop */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute -right-4 top-1/2 -translate-y-1/2 z-10">
                  <div className="h-7 w-7 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400 shadow-2xs">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
