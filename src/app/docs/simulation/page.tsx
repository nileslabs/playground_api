import React from 'react';
import type { Metadata } from 'next';
import { Icon } from '@iconify/react';
import { CodeBlock } from '@/components/ui/CodeBlock';
import config from '@/config/env';
import { siteConfig } from '@/config/site';
import { getDocArticleSchema, getBreadcrumbSchema } from '@/lib/json-ld';
import { LiveChaosTester } from '@/components/docs/LiveChaosTester';

export const metadata: Metadata = {
  title: 'Network & Chaos Simulation — Artificial Latency, 429 Rate Limits, & Chaos Mode',
  description:
    'Test frontend loading skeletons, TanStack Query retries, SWR backoff, and offline resilience with stochastic Chaos Mode (?_chaos=0.3), artificial latency (?_delay=1500), and status errors (?_status=500).',
  keywords: [
    'network delay simulation api',
    'chaos network simulation mock api',
    'x-simulate-chaos header',
    'flaky api testing react query',
    'simulate 429 rate limit retry after',
    'simulate 500 internal server error',
    'test loading spinners skeletons mock',
  ],
  alternates: {
    canonical: `${siteConfig.url}/docs/simulation`,
  },
  openGraph: {
    title: 'Network & Chaos Simulation — Playground API',
    description:
      'Simulate flaky connections, stochastic failure rates, artificial latency, and HTTP error codes with headers and query parameters.',
    url: `${siteConfig.url}/docs/simulation`,
    type: 'article',
  },
};

export default function SimulationPage() {
  const publicApiUrl = config.publicApiUrl || 'https://playground.nileslabs.com/api/v1';

  const chaosSample = `// 1. Stochastic Chaos Mode: 30% failure probability with random 504 / 503 / 500 / 429
fetch('${publicApiUrl}/posts?_chaos=0.3')

// 2. Target specific failure types (e.g. only 429 Rate Limit and 504 Gateway Timeout)
fetch('${publicApiUrl}/posts?_chaos=0.4&_chaos_errors=429,504')

// 3. Clean Header-Based Chaos for Axios / TanStack Query
fetch('${publicApiUrl}/posts', {
  headers: {
    'X-Simulate-Chaos': '0.35', // 35% probability of failure
    'X-Simulate-Chaos-Errors': '504,500',
  },
});`;

  const reactQuerySample = `import { useQuery } from '@tanstack/react-query';

export function useResilientPosts() {
  return useQuery({
    queryKey: ['posts'],
    queryFn: async () => {
      const res = await fetch('${publicApiUrl}/posts?limit=10', {
        headers: {
          'X-Simulate-Chaos': '0.3', // 🎲 30% stochastic chaos failure rate
        },
      });

      if (!res.ok) {
        // Reads retry-after header if status was 429
        const retryAfter = res.headers.get('retry-after');
        throw new Error(\`Request failed with status \${res.status} (Retry-After: \${retryAfter || 'none'})\`);
      }

      return res.json();
    },
    // React Query automatically retries on 504 / 500 / 429 with exponential backoff
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 5000),
  });
}`;

  const rateLimitSample = `// 1. Simulate strict rate limit: 5 requests per 10-second sliding window
fetch('${publicApiUrl}/posts?_ratelimit=5:10')

// 2. Clean Header-Based Rate Limit for Axios / Fetch
fetch('${publicApiUrl}/users', {
  headers: {
    'X-Simulate-RateLimit': '3:5', // Max 3 requests per 5-second window
  },
});

// Response on breach (HTTP 429 Too Many Requests):
// Headers:
//   Retry-After: 4
//   X-RateLimit-Limit: 3
//   X-RateLimit-Remaining: 0
//   X-RateLimit-Reset: 1726741234
// Body:
// {
//   "status": 429,
//   "error": "Too Many Requests",
//   "message": "Rate limit threshold breached: 3 requests per 5s window.",
//   "limit": 3,
//   "windowSeconds": 5,
//   "retryAfterSeconds": 4,
//   "resetAt": "2026-09-19T10:20:34.000Z"
// }`;

  const delayAndStatusSample = `// 1. Simulate 1.5-second network latency (0ms to 5,000ms)
fetch('${publicApiUrl}/posts?_delay=1500')

// 2. Simulate 500 Internal Server Error
fetch('${publicApiUrl}/posts?_status=500')

// 3. Combined Delay & 404 Not Found
fetch('${publicApiUrl}/users/999?_delay=2000&_status=404')`;

  const jsonLdArticle = getDocArticleSchema({
    title: 'Network & Chaos Simulation — Playground API',
    description: 'Simulate artificial network latency, flaky chaos mode, and HTTP error boundaries in Playground API.',
    url: `${siteConfig.url}/docs/simulation`,
  });

  const jsonLdBreadcrumbs = getBreadcrumbSchema([
    { name: 'Home', url: siteConfig.url },
    { name: 'Docs', url: `${siteConfig.url}/docs` },
    { name: 'Simulation', url: `${siteConfig.url}/docs/simulation` },
  ]);

  return (
    <div className="space-y-10 w-full max-w-none text-text-primary">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdArticle) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumbs) }}
      />

      {/* 1. Header */}
      <div id="overview" className="space-y-3 border-b border-border-theme pb-6 scroll-mt-20">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-amber-500/15 text-amber-400 text-xs sm:text-sm font-bold border border-amber-500/30">
          <Icon icon="ph:timer-bold" className="w-4 h-4" />
          Network Reliability & Simulation Engine
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-text-primary tracking-tight">
          Network, Chaos & Rate-Limit Simulation
        </h1>
        <p className="text-sm sm:text-base text-text-secondary leading-relaxed">
          Test frontend loading skeletons, TanStack Query retries, SWR revalidation, 429 countdown toasts, and client-side throttle queues with stochastic Chaos Mode (<code className="font-mono text-accent-primary">?_chaos=0.3</code>), sliding-window rate limits (<code className="font-mono text-accent-primary">?_ratelimit=5:10</code>), artificial latency (<code className="font-mono text-accent-primary">?_delay=1500</code>), and status codes (<code className="font-mono text-accent-primary">?_status=500</code>).
        </p>
      </div>

      {/* 2. Interactive Live Chaos Tester */}
      <div id="live-tester" className="space-y-3 scroll-mt-20">
        <LiveChaosTester />
      </div>

      {/* 3. Deep-Dive: Why Chaos Mode is Critical */}
      <div id="why-chaos" className="space-y-4 pt-6 border-t border-border-theme scroll-mt-20">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-lg bg-accent-light text-accent-primary">
            <Icon icon="ph:shield-warning-bold" className="w-5 h-5" />
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-text-primary">
            Why Stochastic Chaos Mode is Essential
          </h2>
        </div>
        <p className="text-sm sm:text-base text-text-secondary leading-relaxed">
          During local development, traditional mock APIs respond with 100% reliability in 5ms. Because the mock API never fails intermittently:
        </p>
        <ul className="space-y-2 text-sm text-text-secondary list-disc pl-5 leading-relaxed">
          <li><strong>Unexercised Retry Logic:</strong> Libraries like <strong>TanStack Query</strong>, <strong>SWR</strong>, and <strong>Axios-Retry</strong> with <code className="font-mono text-xs">retry: 3</code> are never actually exercised.</li>
          <li><strong>Untested Race Conditions:</strong> Rapidly mounting and unmounting components during network delays often causes unhandled state errors.</li>
          <li><strong>Per-Session Isolation:</strong> Chaos simulation is evaluated per-request. When a request is randomly selected to succeed (e.g. 70% of the time), it interacts with your exact session sandbox without data corruption.</li>
        </ul>
      </div>

      {/* 4. Rate Limit Simulation */}
      <div id="rate-limit" className="space-y-4 pt-6 border-t border-border-theme scroll-mt-20">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400">
            <Icon icon="ph:gauge-bold" className="w-5 h-5" />
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-text-primary">
            Sliding-Window Rate-Limit & Quota Violation Simulator
          </h2>
        </div>
        <p className="text-sm sm:text-base text-text-secondary leading-relaxed">
          Simulate strict API rate limits and test how your UI handles <code className="font-mono text-rose-400">429 Too Many Requests</code> status codes, <code className="font-mono text-accent-primary">Retry-After</code> countdown headers, and client-side throttle queues on demand:
        </p>
        <CodeBlock code={rateLimitSample} language="javascript" title="Rate-Limit Simulation Examples (Header & Query Parameter)" />
      </div>

      {/* 5. Chaos Mode Usage & React Query Integration */}
      <div id="chaos-code" className="space-y-4 pt-6 border-t border-border-theme scroll-mt-20">
        <h2 className="text-xl font-bold text-text-primary">
          Chaos Mode Code Examples
        </h2>
        <p className="text-sm text-text-secondary leading-relaxed">
          Set <code className="font-mono text-xs">?_chaos=rate</code> (e.g. 0.3 for 30% probability) or header <code className="font-mono text-xs">X-Simulate-Chaos: 0.3</code>:
        </p>
        <CodeBlock code={chaosSample} language="javascript" title="Chaos Mode Query & Header Examples" />

        <div className="pt-2">
          <h3 className="text-base font-bold text-text-primary pb-1">
            Testing React Query Retries with Exponential Backoff
          </h3>
          <CodeBlock code={reactQuerySample} language="typescript" title="React Query Resilient Hook (TanStack Query)" />
        </div>
      </div>

      {/* 6. Latency & Deterministic Status Codes */}
      <div id="delay-status" className="space-y-4 pt-6 border-t border-border-theme scroll-mt-20">
        <h2 className="text-xl font-bold text-text-primary">
          Deterministic Latency & Status Codes
        </h2>
        <p className="text-sm text-text-secondary leading-relaxed">
          For static, deterministic testing of loading skeletons or specific error handlers:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-text-secondary">
          <div className="p-4 rounded-xl bg-bg-secondary border border-border-theme space-y-2">
            <h4 className="font-bold text-text-primary flex items-center gap-1.5">
              <Icon icon="ph:timer-bold" className="w-4 h-4 text-accent-primary" />
              Latency Simulation
            </h4>
            <p className="text-xs text-text-secondary">
              <code className="font-mono text-accent-primary">?_delay=1500</code> or header <code className="font-mono text-accent-primary">X-Simulate-Delay: 1500</code> clamps between 0ms and 5,000ms.
            </p>
          </div>
          <div className="p-4 rounded-xl bg-bg-secondary border border-border-theme space-y-2">
            <h4 className="font-bold text-text-primary flex items-center gap-1.5">
              <Icon icon="ph:warning-circle-bold" className="w-4 h-4 text-rose-400" />
              Status Code Override
            </h4>
            <p className="text-xs text-text-secondary">
              <code className="font-mono text-rose-400">?_status=500</code> or header <code className="font-mono text-rose-400">X-Simulate-Status: 503</code> overrides the HTTP status (400–599).
            </p>
          </div>
        </div>
        <CodeBlock code={delayAndStatusSample} language="javascript" title="Deterministic Delay & Status Code Examples" />
      </div>

      {/* 7. Supported Headers Summary Table */}
      <div id="headers-reference" className="space-y-3 pt-6 border-t border-border-theme scroll-mt-20">
        <h2 className="text-xl font-bold text-text-primary">
          Simulation Headers & Parameters Reference
        </h2>
        <div className="overflow-x-auto rounded-xl border border-border-theme bg-bg-secondary">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="bg-bg-tertiary border-b border-border-theme text-text-secondary font-bold">
                <th className="p-3">Parameter / Header</th>
                <th className="p-3">Type</th>
                <th className="p-3">Example Values</th>
                <th className="p-3">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-theme font-medium text-text-primary">
              <tr>
                <td className="p-3 font-mono font-bold text-accent-primary">X-Simulate-RateLimit / ?_ratelimit</td>
                <td className="p-3 font-mono text-text-secondary">String</td>
                <td className="p-3 font-mono text-rose-400">5:10 or 3:5</td>
                <td className="p-3 text-text-secondary">Enforces max requests per sliding window seconds. Returns 429 with Retry-After on breach.</td>
              </tr>
              <tr>
                <td className="p-3 font-mono font-bold text-accent-primary">X-RateLimit-Limit / Remaining / Reset</td>
                <td className="p-3 font-mono text-text-secondary">Response Headers</td>
                <td className="p-3 font-mono text-emerald-400">5 / 2 / 1726741234</td>
                <td className="p-3 text-text-secondary">Standard RFC rate-limit headers returned on every request when rate limit simulation is active.</td>
              </tr>
              <tr>
                <td className="p-3 font-mono font-bold text-accent-primary">X-Simulate-Chaos / ?_chaos</td>
                <td className="p-3 font-mono text-text-secondary">Float / Int</td>
                <td className="p-3 font-mono text-amber-400">0.3 or 30</td>
                <td className="p-3 text-text-secondary">Probability of injecting stochastic failure (0.0 to 1.0).</td>
              </tr>
              <tr>
                <td className="p-3 font-mono font-bold text-accent-primary">X-Simulate-Chaos-Errors / ?_chaos_errors</td>
                <td className="p-3 font-mono text-text-secondary">String</td>
                <td className="p-3 font-mono text-amber-400">504,429,500</td>
                <td className="p-3 text-text-secondary">Comma-separated HTTP status codes to restrict chaos errors.</td>
              </tr>
              <tr>
                <td className="p-3 font-mono font-bold text-accent-primary">X-Simulate-Delay / ?_delay</td>
                <td className="p-3 font-mono text-text-secondary">Integer</td>
                <td className="p-3 font-mono text-emerald-400">1500</td>
                <td className="p-3 text-text-secondary">Deterministic delay in milliseconds (0 to 5,000ms).</td>
              </tr>
              <tr>
                <td className="p-3 font-mono font-bold text-accent-primary">X-Simulate-Status / ?_status</td>
                <td className="p-3 font-mono text-text-secondary">Integer</td>
                <td className="p-3 font-mono text-rose-400">404, 500, 503</td>
                <td className="p-3 text-text-secondary">Deterministic HTTP error status code (400 to 599).</td>
              </tr>
              <tr>
                <td className="p-3 font-mono font-bold text-accent-primary">X-Playground-Chaos (Response)</td>
                <td className="p-3 font-mono text-text-secondary">Header</td>
                <td className="p-3 font-mono text-amber-400">injected</td>
                <td className="p-3 text-text-secondary">Returned by server when a request was intercepted by Chaos Engine.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
