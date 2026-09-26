'use client';

import React from 'react';
import { Icon } from '@iconify/react';
import config from '@/config/env';
import { InteractiveConsole } from '@/components/docs/InteractiveConsole';

export default function LatencySimulationPage() {
  const publicApiUrl = config.publicApiUrl || 'https://playground.nileslabs.com/api/v1';

  return (
    <div className="space-y-12 w-full text-slate-900">
      {/* 1. Header */}
      <div id="overview" className="space-y-4 scroll-mt-20">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold uppercase tracking-wider border border-indigo-100">
          <Icon icon="ph:hourglass-medium-bold" className="w-3.5 h-3.5" />
          <span>Chaos & Fault Injection</span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-[1.15]">
          Network Latency & Delay Injection
        </h1>

        <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-3xl">
          Test UI loading spinners, skeleton placeholders, and optimistic mutations by injecting controlled server-side delays into any API call using query parameters or HTTP headers.
        </p>
      </div>

      {/* 2. Interactive Latency Runner */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-6">
        <div className="border-b border-slate-100 pb-4">
          <h3 className="font-bold text-base text-slate-900">Test 2000ms Simulated Delay</h3>
          <p className="text-xs text-slate-500">
            Append <code className="font-mono text-xs text-indigo-600 font-bold">?_delay=2000</code> or pass header <code className="font-mono text-xs text-indigo-600 font-bold">X-Simulate-Delay: 2000</code>:
          </p>
        </div>

        <InteractiveConsole
          method="GET"
          path="/posts?_delay=2000"
          title="Delayed API Request (2s)"
          description="Notice latency tracker indicates ~2000ms execution time."
        />
      </div>

      {/* 3. Modifiers Reference */}
      <div id="modifiers" className="space-y-4 scroll-mt-20">
        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
          Supported Delay Modifiers
        </h2>

        <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-xs">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-semibold">
              <tr>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Key</th>
                <th className="py-3 px-4">Allowed Values</th>
                <th className="py-3 px-4">Example</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-600">
              <tr>
                <td className="py-3 px-4 font-semibold text-slate-900">Query Parameter</td>
                <td className="py-3 px-4 font-mono font-bold text-indigo-600">_delay</td>
                <td className="py-3 px-4 font-mono text-xs">100 - 10000 (ms)</td>
                <td className="py-3 px-4 font-mono text-slate-800">/posts?_delay=1500</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-semibold text-slate-900">HTTP Header</td>
                <td className="py-3 px-4 font-mono font-bold text-indigo-600">X-Simulate-Delay</td>
                <td className="py-3 px-4 font-mono text-xs">100 - 10000 (ms)</td>
                <td className="py-3 px-4 font-mono text-slate-800">X-Simulate-Delay: 3000</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
