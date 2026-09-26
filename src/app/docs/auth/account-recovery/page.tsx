'use client';

import React from 'react';
import Link from 'next/link';
import { Icon } from '@iconify/react';
import config from '@/config/env';
import { InteractiveConsole } from '@/components/docs/InteractiveConsole';

export default function AccountRecoveryPage() {
  const publicApiUrl = config.publicApiUrl || 'https://playground.nileslabs.com/api/v1';

  return (
    <div className="space-y-12 w-full text-slate-900">
      {/* 1. Header */}
      <div id="overview" className="space-y-4 scroll-mt-20">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold uppercase tracking-wider border border-indigo-100">
          <Icon icon="ph:lock-key-open-bold" className="w-3.5 h-3.5" />
          <span>Auth & Security</span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-[1.15]">
          Password Recovery & Reset Loop
        </h1>

        <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-3xl">
          Test end-to-end forgot password flows with live virtual email delivery. Initiating a recovery request dispatches a real HTML reset email directly into your isolated <Link href="/docs/inbox/email-mailbox" className="text-indigo-600 underline font-semibold">Virtual Mailbox</Link>.
        </p>
      </div>

      {/* 2. Step 1: Request Password Reset */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-6">
        <div className="border-b border-slate-100 pb-4">
          <h3 className="font-bold text-base text-slate-900">Step 1: Request Reset Token</h3>
          <p className="text-xs text-slate-500">
            Submit an email address to dispatch a password reset link:
          </p>
        </div>

        <InteractiveConsole
          method="POST"
          path="/auth/forgot-password"
          title="Dispatch Password Reset Email"
          initialBody={JSON.stringify(
            {
              email: 'admin@example.com',
            },
            null,
            2
          )}
        />
      </div>

      {/* 3. Step 2: Submit New Password */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-6">
        <div className="border-b border-slate-100 pb-4">
          <h3 className="font-bold text-base text-slate-900">Step 2: Complete Password Reset</h3>
          <p className="text-xs text-slate-500">
            Submit the OTP or reset token received in your virtual inbox alongside your new password:
          </p>
        </div>

        <InteractiveConsole
          method="POST"
          path="/auth/reset-password"
          title="Submit New Password"
          initialBody={JSON.stringify(
            {
              token: 'sample-reset-token-from-inbox',
              newPassword: 'MyNewSecurePassword!2026',
            },
            null,
            2
          )}
        />
      </div>

      {/* 4. Virtual Mailbox Integration Note */}
      <div className="p-6 rounded-2xl border border-indigo-100 bg-indigo-50/50 space-y-3">
        <div className="flex items-center gap-2">
          <Icon icon="ph:envelope-simple-open-bold" className="w-5 h-5 text-indigo-700" />
          <h3 className="font-bold text-sm text-indigo-950">Inspect Sent Emails in Real Time</h3>
        </div>
        <p className="text-xs text-indigo-800 leading-relaxed">
          Reset tokens are never sent to external email providers. Instead, view the exact HTML email rendered inside the <Link href="/docs/inbox/email-mailbox" className="font-bold underline text-indigo-900">Virtual Email Mailbox (/docs/inbox/email-mailbox)</Link> to copy the token directly into your test runner.
        </p>
      </div>
    </div>
  );
}
