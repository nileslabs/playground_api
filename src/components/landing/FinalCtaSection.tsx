'use client';

import React from 'react';
import Link from 'next/link';
import { Icon } from '@iconify/react';

export function FinalCtaSection() {
  return (
    <section className="py-20 sm:py-24 bg-bg-secondary border-b border-border-theme relative overflow-hidden">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-7 relative">
        
        {/* Subtle Ambient Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-48 bg-accent-primary/10 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="space-y-3">
          <h2 className="text-3xl sm:text-5xl font-black text-text-primary tracking-tight">
            Don&apos;t read about Playground API.{' '}
            <span className="text-accent-primary underline decoration-accent-primary/35 decoration-wavy underline-offset-6">
              Try it.
            </span>
          </h2>
          <p className="text-base sm:text-lg text-text-secondary max-w-xl mx-auto leading-relaxed">
            Create your first mock API request in seconds.
          </p>
        </div>

        {/* Action Buttons: Unified Hierarchy */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-1">
          <Link
            href="/docs/studio"
            className="inline-flex items-center gap-2.5 px-8 py-3.5 sm:py-4 rounded-xl bg-accent-primary hover:bg-accent-hover text-white text-base sm:text-lg font-bold shadow-lg shadow-accent-primary/25 transition-all hover:scale-[1.02]"
          >
            <Icon icon="ph:play-circle-bold" className="w-5 h-5" />
            <span>Try Playground</span>
          </Link>
          <Link
            href="/docs/introduction"
            className="inline-flex items-center gap-2.5 px-7 py-3.5 sm:py-4 rounded-xl bg-bg-primary hover:bg-bg-tertiary border border-border-theme text-text-primary text-base sm:text-lg font-bold transition-all hover:scale-[1.02]"
          >
            <Icon icon="ph:book-open-text-bold" className="w-5 h-5 text-accent-primary" />
            <span>Read Docs</span>
          </Link>
        </div>

        {/* Value Points */}
        <div className="flex flex-wrap items-center justify-center gap-6 text-xs sm:text-sm text-text-secondary pt-2 font-medium">
          <span className="flex items-center gap-1.5">
            <Icon icon="ph:check-bold" className="w-4 h-4 text-accent-primary" />
            <span>Zero signup</span>
          </span>
          <span className="flex items-center gap-1.5">
            <Icon icon="ph:check-bold" className="w-4 h-4 text-accent-primary" />
            <span>No API key required</span>
          </span>
          <span className="flex items-center gap-1.5">
            <Icon icon="ph:check-bold" className="w-4 h-4 text-accent-primary" />
            <span>Instant session persistence</span>
          </span>
        </div>

      </div>
    </section>
  );
}

export default FinalCtaSection;
