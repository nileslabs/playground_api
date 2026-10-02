'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Icon } from '@iconify/react';
import config from '@/config/env';
import { InteractiveConsole } from '@/components/docs/InteractiveConsole';
import { CodeBlock } from '@/components/ui/CodeBlock';

export default function RateLimitingPage() {
  const publicApiUrl = config.publicApiUrl || 'https://playground.nileslabs.com/api/v1';

  const [ratePreset, setRatePreset] = useState<'immediate' | 'burst' | 'strict'>('immediate');

  const presets = {
    immediate: {
      query: '?_ratelimit=1',
      label: 'Immediate 429',
      desc: 'Breaches limit on the first call to immediately trigger rejection',
    },
    burst: {
      query: '?_ratelimit=3/10',
      label: '3 calls / 10s window',
      desc: 'Allows 3 rapid calls before throttling subsequent attempts',
    },
    strict: {
      query: '?_ratelimit=5/60',
      label: '5 calls / 60s window',
      desc: 'Standard production API quota rate for user testing',
    },
  };

  const backoffSnippet = `// Client-side fetch wrapper that honors Retry-After headers
async function fetchWithRetry(url: string, options: RequestInit = {}, maxRetries = 3): Promise<Response> {
  let attempt = 0;

  while (attempt < maxRetries) {
    const response = await fetch(url, options);

    if (response.status === 429) {
      attempt++;
      // Parse standard Retry-After header (in seconds), fallback to exponential backoff
      const retryAfterHeader = response.headers.get('Retry-After');
      const waitSeconds = retryAfterHeader ? parseInt(retryAfterHeader, 10) : Math.pow(2, attempt);

      console.warn(\`Rate limited (429)! Retrying after \${waitSeconds}s (attempt \${attempt}/\${maxRetries})...\`);
      await new Promise((resolve) => setTimeout(resolve, waitSeconds * 1000));
      continue;
    }

    return response;
  }

  throw new Error('Request failed after maximum rate limit retries.');
}`;

  return (
    <div className="space-y-12 w-full text-slate-900">
      {/* 1. Header with Eyebrow Badge */}
      <div id="overview" className="space-y-4 scroll-mt-20">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-700 text-xs font-semibold uppercase tracking-wider border border-amber-200">
          <Icon icon="ph:traffic-cone-bold" className="w-3.5 h-3.5" />
          <span>Chaos &amp; Fault Injection</span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-[1.15]">
          Rate-Limit Simulation (HTTP 429)
        </h1>

        <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-3xl">
          Test client-side exponential backoff, retry throttles, and user toast notifications when API quotas are exceeded. Simulates sliding-window rate limiters and returns compliant <code className="font-mono text-xs bg-slate-100 px-1.5 py-0.5 rounded text-indigo-600 font-bold">Retry-After</code> and <code className="font-mono text-xs bg-slate-100 px-1.5 py-0.5 rounded text-indigo-600 font-bold">X-RateLimit-*</code> headers.
        </p>
      </div>

      {/* 2. Interactive Rate-Limit Runner */}
      <div id="interactive-runner" className="p-6 sm:p-7 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-6 scroll-mt-20">
        <div className="border-b border-slate-100 pb-4">
          <h2 className="font-bold text-base sm:text-lg text-slate-900">
            Interactive Rate-Limit Workbench
          </h2>
          <p className="text-sm text-slate-600">
            Choose a quota preset and send repeated requests to observe rate limiting in action:
          </p>
        </div>

        {/* Preset Selector */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {(['immediate', 'burst', 'strict'] as const).map((key) => {
            const p = presets[key];
            const isActive = ratePreset === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => setRatePreset(key)}
                className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                  isActive
                    ? 'bg-amber-50/80 border-amber-300 ring-2 ring-amber-500/20 shadow-xs'
                    : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/60 shadow-2xs'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-mono text-xs font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded">
                    {p.query}
                  </span>
                </div>
                <h3 className="font-bold text-sm text-slate-900">{p.label}</h3>
                <p className="text-xs text-slate-600 mt-1 line-clamp-2">{p.desc}</p>
              </button>
            );
          })}
        </div>

        <InteractiveConsole
          key={ratePreset}
          method="GET"
          path={`/posts${presets[ratePreset].query}`}
          title={`Rate-Limited Request (${presets[ratePreset].label})`}
          description="Send repeatedly to exhaust remaining calls and observe HTTP 429 response."
        />
      </div>

      {/* 3. Headers Reference */}
      <div id="headers-table" className="space-y-4 scroll-mt-20">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
          Rate-Limit Response Headers Reference
        </h2>

        <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-xs">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold">
              <tr>
                <th className="py-3.5 px-4">Header</th>
                <th className="py-3.5 px-4">Format</th>
                <th className="py-3.5 px-4">Example</th>
                <th className="py-3.5 px-4">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700 text-xs sm:text-sm">
              <tr>
                <td className="py-3.5 px-4 font-mono font-bold text-indigo-700">Retry-After</td>
                <td className="py-3.5 px-4 font-mono text-slate-500">Integer (seconds)</td>
                <td className="py-3.5 px-4 font-mono text-slate-800">3</td>
                <td className="py-3.5 px-4 text-slate-600">
                  Recommended pause duration in seconds before the client should attempt a retry.
                </td>
              </tr>
              <tr>
                <td className="py-3.5 px-4 font-mono font-bold text-indigo-700">X-RateLimit-Limit</td>
                <td className="py-3.5 px-4 font-mono text-slate-500">Integer</td>
                <td className="py-3.5 px-4 font-mono text-slate-800">5</td>
                <td className="py-3.5 px-4 text-slate-600">
                  The maximum permitted request ceiling within the configured time window.
                </td>
              </tr>
              <tr>
                <td className="py-3.5 px-4 font-mono font-bold text-indigo-700">X-RateLimit-Remaining</td>
                <td className="py-3.5 px-4 font-mono text-slate-500">Integer</td>
                <td className="py-3.5 px-4 font-mono text-slate-800">0</td>
                <td className="py-3.5 px-4 text-slate-600">
                  The number of remaining permitted calls before rejection occurs.
                </td>
              </tr>
              <tr>
                <td className="py-3.5 px-4 font-mono font-bold text-indigo-700">X-RateLimit-Reset</td>
                <td className="py-3.5 px-4 font-mono text-slate-500">Unix Timestamp</td>
                <td className="py-3.5 px-4 font-mono text-slate-800">1759165200</td>
                <td className="py-3.5 px-4 text-slate-600">
                  Epoch timestamp in seconds marking when the sliding window resets.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. Client-side Backoff Recipe */}
      <div id="backoff-recipe" className="space-y-4 scroll-mt-20">
        <div className="space-y-1">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
            Client-Side Exponential Backoff Recipe
          </h2>
          <p className="text-sm sm:text-base text-slate-600">
            A resilient TypeScript implementation that parses <code className="font-mono text-xs">Retry-After</code> and retries automatically:
          </p>
        </div>

        <CodeBlock
          code={backoffSnippet}
          language="typescript"
          title="fetchWithRetry.ts"
          maxHeight="max-h-96"
        />
      </div>

      {/* 5. Navigation Footer */}
      <div className="p-6 sm:p-7 rounded-2xl border border-indigo-100 bg-indigo-50/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h3 className="font-bold text-base text-slate-900">Need to test intermittent packet drops?</h3>
          <p className="text-sm text-slate-600">Simulate probabilistic failure rates and randomized network jitter.</p>
        </div>
        <Link
          href="/docs/chaos/flaky-engine"
          className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm transition-all shrink-0"
        >
          View Flaky Network Engine
        </Link>
      </div>
    </div>
  );
}
