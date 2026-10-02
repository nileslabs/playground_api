'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Icon } from '@iconify/react';
import config from '@/config/env';
import { InteractiveConsole } from '@/components/docs/InteractiveConsole';
import { CodeBlock } from '@/components/ui/CodeBlock';

export default function StatusCodesPage() {
  const publicApiUrl = config.publicApiUrl || 'https://playground.nileslabs.com/api/v1';

  const [statusCode, setStatusCode] = useState<number>(500);
  const [activeRecipeTab, setActiveRecipeTab] = useState<'boundary' | 'interceptor'>('boundary');

  const clientCodes = [
    { code: 400, label: 'Bad Request' },
    { code: 401, label: 'Unauthorized' },
    { code: 403, label: 'Forbidden' },
    { code: 404, label: 'Not Found' },
    { code: 409, label: 'Conflict' },
    { code: 422, label: 'Unprocessable' },
    { code: 429, label: 'Rate Limited' },
  ];

  const serverCodes = [
    { code: 500, label: 'Internal Server Error' },
    { code: 502, label: 'Bad Gateway' },
    { code: 503, label: 'Service Unavailable' },
    { code: 504, label: 'Gateway Timeout' },
  ];

  const errorBoundarySnippet = `// React 19 / Next.js Error Boundary (error.tsx)
'use client';

import { useEffect } from 'react';

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string; status?: number };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Captured by Error Boundary:', error);
  }, [error]);

  return (
    <div className="p-8 max-w-lg mx-auto text-center space-y-4">
      <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
        ⚠️
      </div>
      <h2 className="text-xl font-bold text-slate-900">Something went wrong!</h2>
      <p className="text-sm text-slate-600">
        {error.message || 'An unexpected server error occurred.'}
      </p>
      <button
        onClick={() => reset()}
        className="px-4 py-2 bg-indigo-600 text-white text-sm font-semibold rounded-xl"
      >
        Try Again
      </button>
    </div>
  );
}`;

  const interceptorSnippet = `// Axios response interceptor for global error handling
import axios from 'axios';

const api = axios.create({
  baseURL: '${publicApiUrl}',
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    if (status === 401) {
      // Session expired or unauthenticated -> Redirect to login
      window.location.href = '/login?expired=true';
    } else if (status === 403) {
      // Forbidden action -> Show permission modal
      alert('You do not have permission to perform this mutation.');
    } else if (status >= 500) {
      // Server outage -> Display toast banner
      console.error('Server error reported:', error.response?.data);
    }

    return Promise.reject(error);
  }
);`;

  return (
    <div className="space-y-12 w-full text-slate-900">
      {/* 1. Header with Eyebrow Badge */}
      <div id="overview" className="space-y-4 scroll-mt-20">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-rose-700 text-xs font-semibold uppercase tracking-wider border border-rose-200">
          <Icon icon="ph:warning-octagon-bold" className="w-3.5 h-3.5" />
          <span>Chaos &amp; Fault Injection</span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-[1.15]">
          Arbitrary HTTP Status Code Injection
        </h1>

        <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-3xl">
          Force the API to return any standard HTTP error code using <code className="font-mono text-xs bg-slate-100 px-1.5 py-0.5 rounded text-indigo-600 font-bold">?_status=...</code> or the <code className="font-mono text-xs bg-slate-100 px-1.5 py-0.5 rounded text-indigo-600 font-bold">X-Simulate-Status</code> header. Test React error boundaries, form validation errors, authorization fallbacks, and server outage alerts.
        </p>
      </div>

      {/* 2. Interactive Status Workbench */}
      <div id="workbench" className="p-6 sm:p-7 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-6 scroll-mt-20">
        <div className="border-b border-slate-100 pb-4">
          <h2 className="font-bold text-base sm:text-lg text-slate-900">
            Interactive Status Code Runner
          </h2>
          <p className="text-sm text-slate-600">
            Select a target status code and click &quot;Send&quot; to inspect the generated RFC-compliant error payload:
          </p>
        </div>

        {/* Code Selector Chips */}
        <div className="space-y-4">
          <div className="space-y-1.5">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              4xx Client Error Simulations
            </span>
            <div className="flex flex-wrap items-center gap-2">
              {clientCodes.map((item) => (
                <button
                  key={item.code}
                  type="button"
                  onClick={() => setStatusCode(item.code)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                    statusCode === item.code
                      ? 'bg-amber-600 text-white shadow-xs'
                      : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span className="font-mono font-bold">{item.code}</span>
                  <span className="text-[11px] opacity-90">{item.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              5xx Server Error Simulations
            </span>
            <div className="flex flex-wrap items-center gap-2">
              {serverCodes.map((item) => (
                <button
                  key={item.code}
                  type="button"
                  onClick={() => setStatusCode(item.code)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                    statusCode === item.code
                      ? 'bg-rose-600 text-white shadow-xs'
                      : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span className="font-mono font-bold">{item.code}</span>
                  <span className="text-[11px] opacity-90">{item.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <InteractiveConsole
          key={statusCode}
          method="GET"
          path={`/posts?_status=${statusCode}`}
          title={`Simulate HTTP ${statusCode}`}
          description={`Forces server to return HTTP ${statusCode} with RFC-compliant error payload.`}
        />
      </div>

      {/* 3. RFC Status Reference Table */}
      <div id="status-reference" className="space-y-4 scroll-mt-20">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
          Supported HTTP Status Code Reference
        </h2>

        <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-xs">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold">
              <tr>
                <th className="py-3.5 px-4">Code</th>
                <th className="py-3.5 px-4">Standard Name</th>
                <th className="py-3.5 px-4">Typical Trigger Scenario</th>
                <th className="py-3.5 px-4">Recommended Frontend Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700 text-xs sm:text-sm">
              <tr>
                <td className="py-3.5 px-4 font-mono font-bold text-amber-600">400</td>
                <td className="py-3.5 px-4 font-semibold text-slate-900">Bad Request</td>
                <td className="py-3.5 px-4 text-slate-600">Malformed JSON body or invalid query syntax.</td>
                <td className="py-3.5 px-4 text-slate-600">Display inline form field validation errors.</td>
              </tr>
              <tr>
                <td className="py-3.5 px-4 font-mono font-bold text-amber-600">401</td>
                <td className="py-3.5 px-4 font-semibold text-slate-900">Unauthorized</td>
                <td className="py-3.5 px-4 text-slate-600">Missing or expired JWT bearer token.</td>
                <td className="py-3.5 px-4 text-slate-600">Trigger token refresh or redirect to login.</td>
              </tr>
              <tr>
                <td className="py-3.5 px-4 font-mono font-bold text-amber-600">403</td>
                <td className="py-3.5 px-4 font-semibold text-slate-900">Forbidden</td>
                <td className="py-3.5 px-4 text-slate-600">User lacks required RBAC role permissions.</td>
                <td className="py-3.5 px-4 text-slate-600">Show &quot;Upgrade Plan&quot; or permissions banner.</td>
              </tr>
              <tr>
                <td className="py-3.5 px-4 font-mono font-bold text-amber-600">404</td>
                <td className="py-3.5 px-4 font-semibold text-slate-900">Not Found</td>
                <td className="py-3.5 px-4 text-slate-600">Target resource ID does not exist in dataset.</td>
                <td className="py-3.5 px-4 text-slate-600">Render 404 empty state page with navigation.</td>
              </tr>
              <tr>
                <td className="py-3.5 px-4 font-mono font-bold text-amber-600">429</td>
                <td className="py-3.5 px-4 font-semibold text-slate-900">Too Many Requests</td>
                <td className="py-3.5 px-4 text-slate-600">Rate limit window exceeded.</td>
                <td className="py-3.5 px-4 text-slate-600">Read <code className="font-mono text-xs">Retry-After</code> and pause requests.</td>
              </tr>
              <tr>
                <td className="py-3.5 px-4 font-mono font-bold text-rose-600">500</td>
                <td className="py-3.5 px-4 font-semibold text-slate-900">Internal Server Error</td>
                <td className="py-3.5 px-4 text-slate-600">Uncaught backend exception or database failure.</td>
                <td className="py-3.5 px-4 text-slate-600">Trigger React Error Boundary fallback view.</td>
              </tr>
              <tr>
                <td className="py-3.5 px-4 font-mono font-bold text-rose-600">503</td>
                <td className="py-3.5 px-4 font-semibold text-slate-900">Service Unavailable</td>
                <td className="py-3.5 px-4 text-slate-600">Scheduled maintenance or downstream outage.</td>
                <td className="py-3.5 px-4 text-slate-600">Activate circuit breaker and retry with backoff.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. Frontend Resilience Recipes */}
      <div id="frontend-recipes" className="space-y-4 scroll-mt-20">
        <div className="space-y-1">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
            Frontend Error Handling Recipes
          </h2>
          <p className="text-sm sm:text-base text-slate-600">
            Production patterns for catching simulated errors gracefully in modern web apps:
          </p>
        </div>

        <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
          <button
            type="button"
            onClick={() => setActiveRecipeTab('boundary')}
            className={`px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              activeRecipeTab === 'boundary'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            React Error Boundary (error.tsx)
          </button>

          <button
            type="button"
            onClick={() => setActiveRecipeTab('interceptor')}
            className={`px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              activeRecipeTab === 'interceptor'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            Axios Response Interceptor
          </button>
        </div>

        <CodeBlock
          code={activeRecipeTab === 'boundary' ? errorBoundarySnippet : interceptorSnippet}
          language="typescript"
          title={activeRecipeTab === 'boundary' ? 'error.tsx' : 'apiClient.ts'}
          maxHeight="max-h-96"
        />
      </div>

      {/* 5. Navigation Footer */}
      <div className="p-6 sm:p-7 rounded-2xl border border-indigo-100 bg-indigo-50/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h3 className="font-bold text-base text-slate-900">Testing quota boundaries and rate limiting?</h3>
          <p className="text-sm text-slate-600">Simulate HTTP 429 Too Many Requests and parse compliant Retry-After headers.</p>
        </div>
        <Link
          href="/docs/chaos/rate-limiting"
          className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm transition-all shrink-0"
        >
          View Rate-Limit Simulator
        </Link>
      </div>
    </div>
  );
}
