'use client';

import React from 'react';
import { Icon } from '@iconify/react';
import config from '@/config/env';
import { InteractiveConsole } from '@/components/docs/InteractiveConsole';

export default function ExpirySimulationPage() {
  const publicApiUrl = config.publicApiUrl || 'https://playground.nileslabs.com/api/v1';

  return (
    <div className="space-y-12 w-full text-slate-900">
      {/* 1. Header */}
      <div id="overview" className="space-y-4 scroll-mt-20">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold uppercase tracking-wider border border-indigo-100">
          <Icon icon="ph:timer-bold" className="w-3.5 h-3.5" />
          <span>Auth & Security</span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-[1.15]">
          Token Expiry Simulation
        </h1>

        <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-3xl">
          Don&apos;t wait 15 minutes to test your token refresh interceptor. Request real JWTs with short lifespans (e.g. 5 seconds) using headers or request body parameters.
        </p>
      </div>

      {/* 2. Interactive Expiry Runner */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-6">
        <div className="border-b border-slate-100 pb-4">
          <h3 className="font-bold text-base text-slate-900">Test 5-Second Expiry Token</h3>
          <p className="text-xs text-slate-500">
            Login with <code className="font-mono text-xs">token_ttl: 5</code> or header <code className="font-mono text-xs">X-Simulate-JWT-Expiry: 5s</code>. Wait 5 seconds and attempt to use it to see a clean 401 response:
          </p>
        </div>

        <InteractiveConsole
          method="POST"
          path="/auth/login"
          title="Login with 5-Second Expiry Token"
          initialHeaders={[{ key: 'X-Simulate-JWT-Expiry', value: '5s' }]}
          initialBody={JSON.stringify(
            {
              username: 'admin',
              password: 'Password@123',
              token_ttl: 5,
            },
            null,
            2
          )}
        />
      </div>

      {/* 3. Simulation Parameters Reference */}
      <div id="expiry-options" className="space-y-4 scroll-mt-20">
        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
          Supported Expiry Modifiers
        </h2>

        <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-xs">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-semibold">
              <tr>
                <th className="py-3 px-4">Method</th>
                <th className="py-3 px-4">Key / Field</th>
                <th className="py-3 px-4">Example Values</th>
                <th className="py-3 px-4">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-600">
              <tr>
                <td className="py-3 px-4 font-semibold text-slate-900">HTTP Header</td>
                <td className="py-3 px-4 font-mono font-bold text-indigo-600">X-Simulate-JWT-Expiry</td>
                <td className="py-3 px-4 font-mono text-xs text-slate-800">&quot;5s&quot;, &quot;10s&quot;, &quot;1m&quot;</td>
                <td className="py-3 px-4">Overrides JWT token expiration time via request header.</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-semibold text-slate-900">JSON Body</td>
                <td className="py-3 px-4 font-mono font-bold text-indigo-600">token_ttl</td>
                <td className="py-3 px-4 font-mono text-xs text-slate-800">5, 10, 60</td>
                <td className="py-3 px-4">Sets access token lifetime in seconds inside the login body.</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-semibold text-slate-900">JSON Body</td>
                <td className="py-3 px-4 font-mono font-bold text-indigo-600">expiresIn</td>
                <td className="py-3 px-4 font-mono text-xs text-slate-800">&quot;5s&quot;, &quot;30s&quot;</td>
                <td className="py-3 px-4">String-based duration format compatible with jsonwebtoken library.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
