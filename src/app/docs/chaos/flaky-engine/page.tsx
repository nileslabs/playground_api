'use client';

import React from 'react';
import { Icon } from '@iconify/react';
import config from '@/config/env';
import { InteractiveConsole } from '@/components/docs/InteractiveConsole';

export default function FlakyEnginePage() {
  const publicApiUrl = config.publicApiUrl || 'https://playground.nileslabs.com/api/v1';

  return (
    <div className="space-y-12 w-full text-slate-900">
      {/* 1. Header */}
      <div id="overview" className="space-y-4 scroll-mt-20">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold uppercase tracking-wider border border-indigo-100">
          <Icon icon="ph:cloud-lightning-bold" className="w-3.5 h-3.5" />
          <span>Chaos & Fault Injection</span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-[1.15]">
          Flaky Network & Probabilistic Jitter
        </h1>

        <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-3xl">
          Subject your frontend to real-world network instability. Randomly fail requests with probabilistic failure rates (e.g. 50% chance of failure) using <code className="font-mono text-xs bg-slate-100 px-1 py-0.5 rounded text-indigo-600">?_chaos=0.5</code> to test TanStack Query retries and circuit breakers.
        </p>
      </div>

      {/* 2. Interactive Flaky Runner */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-6">
        <div className="border-b border-slate-100 pb-4">
          <h3 className="font-bold text-base text-slate-900">Test 50% Probabilistic Chaos Rate</h3>
          <p className="text-xs text-slate-500">
            Click &quot;Send&quot; multiple times. Half the requests will succeed (200 OK) while half will randomly throw 500 or 503 errors:
          </p>
        </div>

        <InteractiveConsole
          method="GET"
          path="/posts?_chaos=0.5"
          title="Flaky Request Runner (50% Chaos)"
          description="Send repeatedly to observe intermittent failures and verify client recovery."
        />
      </div>

      {/* 3. Parameters Reference */}
      <div id="parameters" className="space-y-4 scroll-mt-20">
        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
          Chaos Modifiers Reference
        </h2>

        <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-xs">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-semibold">
              <tr>
                <th className="py-3 px-4">Parameter</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Allowed Range</th>
                <th className="py-3 px-4">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-600">
              <tr>
                <td className="py-3 px-4 font-mono font-bold text-indigo-600">_chaos</td>
                <td className="py-3 px-4 font-mono">Float</td>
                <td className="py-3 px-4 font-mono text-xs">0.0 to 1.0</td>
                <td className="py-3 px-4">Probability of request failure (e.g. 0.25 = 25% failure chance).</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-mono font-bold text-indigo-600">_chaos_errors</td>
                <td className="py-3 px-4 font-mono">String</td>
                <td className="py-3 px-4 font-mono text-xs">Comma-separated HTTP codes</td>
                <td className="py-3 px-4">Target error codes to randomly pick from (e.g. <code className="font-mono text-xs bg-slate-100 px-1 py-0.5 rounded">500,502,503</code>).</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
