'use client';

import React from 'react';
import { Icon } from '@iconify/react';
import config from '@/config/env';
import { InteractiveConsole } from '@/components/docs/InteractiveConsole';

export default function ClockSkewPage() {
  const publicApiUrl = config.publicApiUrl || 'https://playground.nileslabs.com/api/v1';

  return (
    <div className="space-y-12 w-full text-slate-900">
      {/* 1. Header */}
      <div id="overview" className="space-y-4 scroll-mt-20">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold uppercase tracking-wider border border-indigo-100">
          <Icon icon="ph:clock-countdown-bold" className="w-3.5 h-3.5" />
          <span>Auth & Security</span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-[1.15]">
          Clock Skew & Drift Simulation
        </h1>

        <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-3xl">
          Simulate device time discrepancies between client devices and the server. Inject positive or negative time offsets using the <code className="font-mono text-xs bg-slate-100 px-1 py-0.5 rounded text-indigo-600">X-Simulate-Clock-Skew</code> header.
        </p>
      </div>

      {/* 2. Interactive Skew Runner */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-6">
        <div className="border-b border-slate-100 pb-4">
          <h3 className="font-bold text-base text-slate-900">Simulate +120 Seconds Clock Offset</h3>
          <p className="text-xs text-slate-500">
            Request token generation with simulated future client drift to test leeway tolerance:
          </p>
        </div>

        <InteractiveConsole
          method="POST"
          path="/auth/login"
          title="Login with Clock Drift (+120s)"
          initialHeaders={[{ key: 'X-Simulate-Clock-Skew', value: '+120' }]}
          initialBody={JSON.stringify(
            {
              username: 'admin',
              password: 'Password@123',
            },
            null,
            2
          )}
        />
      </div>

      {/* 3. Common Failure Modes */}
      <div id="failure-modes" className="space-y-4 scroll-mt-20">
        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
          Why Test Clock Drift?
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="p-5 rounded-2xl border border-slate-200 bg-white shadow-xs space-y-2">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <Icon icon="ph:warning-circle-bold" className="w-4 h-4 text-amber-500" />
              <span>Token Used Before Issued (nbf error)</span>
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              If client time is behind the server, tokens generated on the server might appear to be issued in the future, triggering premature token rejection.
            </p>
          </div>

          <div className="p-5 rounded-2xl border border-slate-200 bg-white shadow-xs space-y-2">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <Icon icon="ph:shield-check-bold" className="w-4 h-4 text-emerald-600" />
              <span>Configuring JWT Leeway</span>
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Ensure your client decoder or verification middleware passes a clock tolerance parameter (e.g. <code className="font-mono text-indigo-600">clockTolerance: 60</code> in jsonwebtoken) to absorb small differences.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
