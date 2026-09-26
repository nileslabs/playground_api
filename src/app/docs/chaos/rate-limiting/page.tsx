'use client';

import React from 'react';
import { Icon } from '@iconify/react';
import config from '@/config/env';
import { InteractiveConsole } from '@/components/docs/InteractiveConsole';

export default function RateLimitingPage() {
  const publicApiUrl = config.publicApiUrl || 'https://playground.nileslabs.com/api/v1';

  return (
    <div className="space-y-12 w-full text-slate-900">
      {/* 1. Header */}
      <div id="overview" className="space-y-4 scroll-mt-20">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold uppercase tracking-wider border border-indigo-100">
          <Icon icon="ph:traffic-cone-bold" className="w-3.5 h-3.5" />
          <span>Chaos & Fault Injection</span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-[1.15]">
          Rate-Limit Simulation (HTTP 429)
        </h1>

        <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-3xl">
          Test client-side exponential backoff, retry throttles, and user toast notifications when API quotas are exceeded. Generates compliant <code className="font-mono text-xs bg-slate-100 px-1 py-0.5 rounded text-indigo-600">Retry-After</code> and <code className="font-mono text-xs bg-slate-100 px-1 py-0.5 rounded text-indigo-600">X-RateLimit-*</code> headers.
        </p>
      </div>

      {/* 2. Interactive Rate-Limit Runner */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-6">
        <div className="border-b border-slate-100 pb-4">
          <h3 className="font-bold text-base text-slate-900">Simulate 429 Too Many Requests</h3>
          <p className="text-xs text-slate-500">
            Append <code className="font-mono text-xs text-indigo-600 font-bold">?_ratelimit=1</code> to immediately trigger rate limiting on this request:
          </p>
        </div>

        <InteractiveConsole
          method="GET"
          path="/posts?_ratelimit=1"
          title="Rate-Limited Request"
          description="Returns HTTP 429 with standard quota headers."
        />
      </div>

      {/* 3. Headers Reference */}
      <div id="headers-table" className="space-y-4 scroll-mt-20">
        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
          Rate-Limit Response Headers
        </h2>

        <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-xs">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-semibold">
              <tr>
                <th className="py-3 px-4">Header</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-600">
              <tr>
                <td className="py-3 px-4 font-mono font-bold text-indigo-600">Retry-After</td>
                <td className="py-3 px-4 font-mono text-xs">Seconds</td>
                <td className="py-3 px-4">Recommended number of seconds client must wait before retrying (e.g. 60).</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-mono font-bold text-indigo-600">X-RateLimit-Limit</td>
                <td className="py-3 px-4 font-mono text-xs">Integer</td>
                <td className="py-3 px-4">The maximum permitted requests in the quota window.</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-mono font-bold text-indigo-600">X-RateLimit-Remaining</td>
                <td className="py-3 px-4 font-mono text-xs">Integer</td>
                <td className="py-3 px-4">Remaining calls available before rejection (drops to 0).</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-mono font-bold text-indigo-600">X-RateLimit-Reset</td>
                <td className="py-3 px-4 font-mono text-xs">Timestamp</td>
                <td className="py-3 px-4">Unix epoch timestamp when the current rate quota resets.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
