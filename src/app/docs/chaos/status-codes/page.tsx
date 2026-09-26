'use client';

import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import config from '@/config/env';
import { InteractiveConsole } from '@/components/docs/InteractiveConsole';

export default function StatusCodesPage() {
  const publicApiUrl = config.publicApiUrl || 'https://playground.nileslabs.com/api/v1';
  const [statusCode, setStatusCode] = useState(500);

  const codes = [400, 401, 403, 404, 500, 502, 503, 504];

  return (
    <div className="space-y-12 w-full text-slate-900">
      {/* 1. Header */}
      <div id="overview" className="space-y-4 scroll-mt-20">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold uppercase tracking-wider border border-indigo-100">
          <Icon icon="ph:warning-octagon-bold" className="w-3.5 h-3.5" />
          <span>Chaos & Fault Injection</span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-[1.15]">
          Arbitrary HTTP Status Code Injection
        </h1>

        <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-3xl">
          Force the API to return any standard HTTP error code using <code className="font-mono text-xs bg-slate-100 px-1 py-0.5 rounded text-indigo-600">?_status=...</code> or header <code className="font-mono text-xs bg-slate-100 px-1 py-0.5 rounded text-indigo-600">X-Simulate-Status</code>. Test React error boundaries, form validation errors, and maintenance fallbacks.
        </p>
      </div>

      {/* 2. Interactive Status Runner */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <h3 className="font-bold text-base text-slate-900">Select Injected Status Code</h3>
            <p className="text-xs text-slate-500">Pick a code to simulate server-side error response:</p>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            {codes.map((code) => (
              <button
                key={code}
                type="button"
                onClick={() => setStatusCode(code)}
                className={`px-2.5 py-1 rounded-xl text-xs font-mono font-bold transition-all ${
                  statusCode === code
                    ? 'bg-rose-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {code}
              </button>
            ))}
          </div>
        </div>

        <InteractiveConsole
          method="GET"
          path={`/posts?_status=${statusCode}`}
          title={`Simulate HTTP ${statusCode}`}
          description={`Forces server to return HTTP ${statusCode} with RFC-compliant error payload.`}
        />
      </div>
    </div>
  );
}
