'use client';

import React from 'react';
import Link from 'next/link';
import { Icon } from '@iconify/react';

export function WhyPlaygroundSection() {
  return (
    <section className="py-16 sm:py-20 bg-bg-secondary/40 border-b border-border-theme">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Section Header */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <h2 className="text-3xl sm:text-5xl font-black text-text-primary tracking-tight">
            Why is a stateful mock API different?
          </h2>
        </div>

        {/* Side-by-Side Comparison */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-7 items-stretch">
          
          {/* TRADITIONAL MOCK */}
          <div className="rounded-2xl border border-rose-300 dark:border-rose-500/25 bg-bg-primary p-6 sm:p-7 flex flex-col justify-between space-y-6 shadow-sm">
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-border-theme">
                <span className="text-sm font-mono font-bold tracking-wider text-rose-600 dark:text-rose-400 uppercase">
                  Traditional Mock
                </span>
                <span className="text-xs font-mono font-bold text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-500/10 px-3 py-1 rounded-md border border-rose-200 dark:border-rose-500/20">
                  Stateless
                </span>
              </div>

              {/* Execution Flow */}
              <div className="space-y-2.5 font-mono text-sm sm:text-base">
                <div className="p-3.5 rounded-xl bg-bg-secondary border border-border-theme flex items-center justify-between">
                  <span className="text-text-primary font-bold">POST /posts</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-extrabold">201 Created</span>
                </div>
                <div className="flex justify-center text-text-muted">
                  <Icon icon="ph:arrow-down-bold" className="w-4 h-4" />
                </div>
                <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/25 flex items-center justify-between">
                  <span className="text-text-primary font-bold">GET /posts</span>
                  <span className="text-rose-600 dark:text-rose-400 font-extrabold flex items-center gap-1.5">
                    <Icon icon="ph:x-bold" className="w-4 h-4" /> Data disappeared
                  </span>
                </div>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-text-muted pt-3 border-t border-border-theme leading-relaxed">
              Mutations vanish on page refresh. Impossible to test real forms, shopping carts, or lists.
            </p>
          </div>

          {/* PLAYGROUND API */}
          <div className="rounded-2xl border border-accent-primary/50 bg-bg-primary p-6 sm:p-7 flex flex-col justify-between space-y-6 shadow-md ring-1 ring-accent-primary/20">
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-border-theme">
                <span className="text-sm font-mono font-bold tracking-wider text-accent-primary uppercase">
                  Playground API
                </span>
                <span className="text-xs font-mono font-bold text-accent-primary bg-accent-light px-3 py-1 rounded-md border border-accent-primary/25">
                  Stateful Session
                </span>
              </div>

              {/* Execution Flow */}
              <div className="space-y-2.5 font-mono text-sm sm:text-base">
                <div className="p-3.5 rounded-xl bg-bg-secondary border border-border-theme flex items-center justify-between">
                  <span className="text-text-primary font-bold">POST /posts</span>
                  <span className="text-accent-primary font-extrabold">201 Created</span>
                </div>
                <div className="flex justify-center text-accent-primary">
                  <Icon icon="ph:arrow-down-bold" className="w-4 h-4" />
                </div>
                <div className="p-3.5 rounded-xl bg-accent-light/40 border border-accent-primary/30 flex items-center justify-between">
                  <span className="text-text-primary font-bold">GET /posts</span>
                  <span className="text-accent-primary font-extrabold flex items-center gap-1.5">
                    <Icon icon="ph:check-bold" className="w-4 h-4" /> Data persisted
                  </span>
                </div>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-text-muted pt-3 border-t border-border-theme leading-relaxed">
              Mutations persist in your isolated session. Baseline seed records remain untouched.
            </p>
          </div>

        </div>

        {/* Takeaway Sentence & CTA */}
        <div className="text-center space-y-3 pt-2">
          <p className="text-lg sm:text-xl font-bold text-text-primary">
            Your frontend can behave like it is connected to a real backend.
          </p>
          <div>
            <Link
              href="/docs/studio"
              className="inline-flex items-center gap-1.5 text-sm sm:text-base font-bold text-accent-primary hover:underline"
            >
              <span>Try Playground</span>
              <Icon icon="ph:arrow-right-bold" className="w-4 h-4" />
            </Link>
          </div>
        </div>

      </div>
    </section>
  );
}

export default WhyPlaygroundSection;
