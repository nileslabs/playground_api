'use client';

import React from 'react';
import { Icon } from '@iconify/react';
import config from '@/config/env';
import { InteractiveConsole } from '@/components/docs/InteractiveConsole';

export default function ThreeDSAuthenticationPage() {
  const publicApiUrl = config.publicApiUrl || 'https://playground.nileslabs.com/api/v1';

  return (
    <div className="space-y-12 w-full text-slate-900">
      {/* 1. Header */}
      <div id="overview" className="space-y-4 scroll-mt-20">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold uppercase tracking-wider border border-indigo-100">
          <Icon icon="ph:shield-warning-bold" className="w-3.5 h-3.5" />
          <span>Mock Commerce & Billing</span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-[1.15]">
          3D Secure (3DS) Challenge Flow
        </h1>

        <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-3xl">
          Simulate Strong Customer Authentication (SCA) and 3DS modal challenge verification. Test how your frontend handles the <code className="font-mono text-xs bg-slate-100 px-1 py-0.5 rounded text-amber-600">requires_action</code> status and completes post-challenge confirmation.
        </p>
      </div>

      {/* 2. Step 1: Trigger 3DS with Special Card */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-6">
        <div className="border-b border-slate-100 pb-4">
          <h3 className="font-bold text-base text-slate-900">Step 1: Direct Charge with 3DS Test Card</h3>
          <p className="text-xs text-slate-500">
            Submit a charge using the dedicated 3DS card <code className="font-mono text-xs text-indigo-600 font-bold">4000 0000 0000 0341</code> to trigger a challenge:
          </p>
        </div>

        <InteractiveConsole
          method="POST"
          path="/payments/charge"
          title="Charge Triggering 3DS"
          initialBody={JSON.stringify(
            {
              amount: 5000,
              currency: 'usd',
              card_number: '4000000000000341',
              exp_month: 12,
              exp_year: 2028,
              cvc: '123',
            },
            null,
            2
          )}
        />
      </div>

      {/* 3. Step 2: Confirm 3DS Outcome */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-6">
        <div className="border-b border-slate-100 pb-4">
          <h3 className="font-bold text-base text-slate-900">Step 2: Confirm 3DS Challenge Result</h3>
          <p className="text-xs text-slate-500">
            Simulate the user completing biometric or SMS OTP challenge in your app:
          </p>
        </div>

        <InteractiveConsole
          method="POST"
          path="/payments/intents/sample-intent-id/confirm-3ds"
          title="Confirm 3DS Challenge"
          initialBody={JSON.stringify(
            {
              challenge_status: 'authenticated',
            },
            null,
            2
          )}
        />
      </div>

      {/* 4. 3DS Card Reference */}
      <div id="card-reference" className="space-y-4 scroll-mt-20">
        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
          3DS Simulation Mechanics
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="p-5 rounded-2xl border border-slate-200 bg-white shadow-xs space-y-2">
            <h3 className="font-bold text-sm text-slate-900">Status: requires_action</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              When 3DS is required, the intent returns HTTP 200 with status <code className="font-mono text-amber-600">requires_action</code> and a challenge URL inside <code className="font-mono text-indigo-600">next_action.redirect_to_url</code>.
            </p>
          </div>

          <div className="p-5 rounded-2xl border border-slate-200 bg-white shadow-xs space-y-2">
            <h3 className="font-bold text-sm text-slate-900">Simulate Failure</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              To test the customer canceling or failing the SMS challenge, pass <code className="font-mono text-rose-600">&#123; challenge_status: &apos;failed&apos; &#125;</code> to receive a clean decline status.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
