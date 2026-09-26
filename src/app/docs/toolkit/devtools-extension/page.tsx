'use client';

import React from 'react';
import { Icon } from '@iconify/react';
import config from '@/config/env';

export default function DevtoolsExtensionPage() {
  const publicApiUrl = config.publicApiUrl || 'https://playground.nileslabs.com/api/v1';

  return (
    <div className="space-y-12 w-full text-slate-900">
      {/* 1. Header */}
      <div id="overview" className="space-y-4 scroll-mt-20">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold uppercase tracking-wider border border-indigo-100">
          <Icon icon="ph:puzzle-piece-bold" className="w-3.5 h-3.5" />
          <span>Developer Toolkit</span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-[1.15]">
          Browser DevTools Companion
        </h1>

        <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-3xl">
          An integrated browser developer panel for Chrome and Firefox. Inspect session mutations, monitor active rate-limits, preview incoming webhooks, and trigger atomic sandbox resets without leaving your app.
        </p>
      </div>

      {/* 2. Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="p-6 rounded-2xl border border-slate-200 bg-white shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold">
            <Icon icon="ph:tree-structure-bold" className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-base text-slate-900">Mutation Timeline</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Time-travel debugging that visualizes every POST, PUT, and DELETE call executed against your active visitor session overlay.
          </p>
        </div>

        <div className="p-6 rounded-2xl border border-slate-200 bg-white shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
            <Icon icon="ph:cloud-arrow-down-bold" className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-base text-slate-900">Instant Snapshots</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Export session state to JSON fixtures and restore deterministic states during local development with a single click.
          </p>
        </div>

        <div className="p-6 rounded-2xl border border-slate-200 bg-white shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-700 flex items-center justify-center font-bold">
            <Icon icon="ph:arrow-counter-clockwise-bold" className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-base text-slate-900">Atomic Reset Button</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Quickly purge visitor overlays to restore pristine baseline database records whenever tests become polluted.
          </p>
        </div>
      </div>
    </div>
  );
}
