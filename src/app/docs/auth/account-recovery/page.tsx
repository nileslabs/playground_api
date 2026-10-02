'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Icon } from '@iconify/react';
import config from '@/config/env';
import { InteractiveConsole } from '@/components/docs/InteractiveConsole';
import { CodeBlock } from '@/components/ui/CodeBlock';

interface RecoveryPreset {
  id: string;
  label: string;
  email: string;
  desc: string;
}

const PRESETS: RecoveryPreset[] = [
  {
    id: 'admin-recovery',
    label: 'Admin Account Recovery',
    email: 'admin@example.com',
    desc: 'Dispatches a password reset link for the System Administrator persona.',
  },
  {
    id: 'editor-recovery',
    label: 'Editor Account Recovery',
    email: 'editor@example.com',
    desc: 'Generates a 15-minute single-use OTP reset token for the Content Editor.',
  },
  {
    id: 'viewer-recovery',
    label: 'Viewer Account Recovery',
    email: 'viewer@example.com',
    desc: 'Sends a branded HTML recovery notification directly to your isolated virtual inbox.',
  },
];

export default function AccountRecoveryPage() {
  const publicApiUrl = config.publicApiUrl || 'https://playground.nileslabs.com/api/v1';

  const [activePreset, setActivePreset] = useState<RecoveryPreset>(PRESETS[0]);
  const [activeRecipe, setActiveRecipe] = useState<'recoveryHook' | 'serverAction'>('recoveryHook');

  const recoveryHookRecipe = `// React 19 Custom Password Reset Hook
import { useState } from 'react';

export function usePasswordRecovery() {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'email_sent' | 'reset_success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  // 1. Initiate password reset (sends email to virtual mailbox)
  const requestReset = async (email: string) => {
    setLoading(true);
    setErrorMessage('');
    try {
      const res = await fetch('${publicApiUrl}/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) throw new Error('Password reset request failed');
      setStatus('email_sent');
    } catch (err: any) {
      setErrorMessage(err.message);
      setStatus('error');
    } finally {
      setLoading(false);
    }
  };

  // 2. Submit new password with received token
  const completeReset = async (token: string, newPassword: string) => {
    setLoading(true);
    setErrorMessage('');
    try {
      const res = await fetch('${publicApiUrl}/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, new_password: newPassword }),
      });

      if (!res.ok) throw new Error('Invalid or expired reset token');
      setStatus('reset_success');
    } catch (err: any) {
      setErrorMessage(err.message);
      setStatus('error');
    } finally {
      setLoading(false);
    }
  };

  return { requestReset, completeReset, loading, status, errorMessage };
}`;

  const serverActionRecipe = `// Next.js 15+ Server Action Pattern
'use server';

export async function requestPasswordResetAction(formData: FormData) {
  const email = formData.get('email') as string;

  const res = await fetch('${publicApiUrl}/auth/forgot-password', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });

  // Always return success to prevent email enumeration timing attacks
  return { success: true, message: 'If an account exists, a reset link has been dispatched.' };
}

export async function resetPasswordAction(formData: FormData) {
  const token = formData.get('token') as string;
  const newPassword = formData.get('new_password') as string;

  const res = await fetch('${publicApiUrl}/auth/reset-password', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token, new_password: newPassword }),
  });

  if (!res.ok) {
    const error = await res.json();
    return { success: false, message: error.message };
  }

  return { success: true, message: 'Password updated successfully. Please log in.' };
}`;

  return (
    <div className="space-y-12 w-full text-slate-900">
      {/* 1. Header with Eyebrow Badge */}
      <div id="overview" className="space-y-4 scroll-mt-20">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold uppercase tracking-wider border border-indigo-100">
          <Icon icon="ph:lock-key-open-bold" className="w-3.5 h-3.5" />
          <span>Auth &amp; Security</span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-[1.15]">
          Password Recovery &amp; Reset Loop
        </h1>

        <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-3xl">
          Test end-to-end account recovery flows with real-time virtual email delivery. Initiating a password reset triggers an authentic HTML recovery email delivered straight into your isolated <Link href="/docs/inbox/email-mailbox" className="text-indigo-600 underline font-semibold hover:text-indigo-700">Virtual Mailbox</Link> without third-party email service credentials.
        </p>
      </div>

      {/* 2. Three-Step Recovery Flow Walkthrough */}
      <div id="recovery-flow" className="space-y-6 scroll-mt-20">
        <div className="border-b border-slate-100 pb-3">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
            End-to-End Recovery Flow
          </h2>
          <p className="text-sm text-slate-600">
            Execute the complete password reset lifecycle in 3 intuitive steps:
          </p>
        </div>

        {/* Step 1: Request Password Reset */}
        <div className="p-6 sm:p-7 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center gap-2.5">
              <span className="w-6 h-6 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center">
                1
              </span>
              <h3 className="font-bold text-base sm:text-lg text-slate-900">
                Step 1: Request Recovery Link (/auth/forgot-password)
              </h3>
            </div>

            <div className="flex items-center gap-2">
              {PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => setActivePreset(preset)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activePreset.id === preset.id
                      ? 'bg-indigo-600 text-white shadow-2xs'
                      : 'bg-slate-100 text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {preset.label.split(' ')[0]}
                </button>
              ))}
            </div>
          </div>

          <p className="text-sm text-slate-600">
            Submits the user email address. The backend generates a secure single-use recovery token and renders an email:
          </p>

          <InteractiveConsole
            key={`forgot-${activePreset.id}`}
            method="POST"
            path="/auth/forgot-password"
            title={`Dispatch Reset Link to ${activePreset.email}`}
            initialBody={JSON.stringify(
              {
                email: activePreset.email,
              },
              null,
              2
            )}
          />
        </div>

        {/* Step 2: Virtual Inbox Bridge */}
        <div className="p-6 sm:p-7 rounded-2xl border border-indigo-200 bg-indigo-50/40 space-y-4">
          <div className="flex items-center gap-2.5 text-indigo-900">
            <span className="w-6 h-6 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center">
              2
            </span>
            <h3 className="font-bold text-base sm:text-lg text-slate-900">
              Step 2: Inspect Dispatched Email in Virtual Inbox
            </h3>
          </div>

          <p className="text-sm text-indigo-950/80 leading-relaxed">
            Navigate to the virtual mailbox to view the rendered HTML email template, extract the recovery token, or copy the direct password reset URL.
          </p>

          <div className="pt-1">
            <Link
              href="/docs/inbox/email-mailbox"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs transition-all"
            >
              <Icon icon="ph:mailbox-bold" className="w-4 h-4" />
              <span>Open Virtual Mailbox (/docs/inbox/email-mailbox)</span>
            </Link>
          </div>
        </div>

        {/* Step 3: Complete Password Reset */}
        <div className="p-6 sm:p-7 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-5">
          <div className="flex items-center gap-2.5 border-b border-slate-100 pb-4">
            <span className="w-6 h-6 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center">
              3
            </span>
            <h3 className="font-bold text-base sm:text-lg text-slate-900">
              Step 3: Submit New Password (/auth/reset-password)
            </h3>
          </div>

          <p className="text-sm text-slate-600">
            Submits the reset token from the email along with the updated password:
          </p>

          <InteractiveConsole
            method="POST"
            path="/auth/reset-password"
            title="Complete Password Reset"
            initialBody={JSON.stringify(
              {
                token: 'sample-token-from-virtual-mailbox',
                newPassword: 'MyNewSecurePassword!2026',
              },
              null,
              2
            )}
          />
        </div>
      </div>

      {/* 3. Security Best Practices Matrix */}
      <div id="security-best-practices" className="space-y-4 scroll-mt-20">
        <div className="border-b border-slate-100 pb-3">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
            Recovery Security Best Practices
          </h2>
          <p className="text-sm text-slate-600">
            Critical defensive patterns modeled by the Playground API authentication gateway:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="p-5 rounded-2xl border border-slate-200 bg-white shadow-xs space-y-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold text-xs">
              01
            </div>
            <h3 className="font-bold text-sm sm:text-base text-slate-900">Email Enumeration Defense</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              The <code className="font-mono text-xs bg-slate-100 px-1 py-0.5 rounded text-indigo-600">/auth/forgot-password</code> endpoint returns HTTP 200 regardless of whether the email exists, preventing user enumeration.
            </p>
          </div>

          <div className="p-5 rounded-2xl border border-slate-200 bg-white shadow-xs space-y-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-xs">
              02
            </div>
            <h3 className="font-bold text-sm sm:text-base text-slate-900">Strict Token Expiration</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Reset tokens expire after 15 minutes. Once consumed to update a password, the token is permanently invalidated.
            </p>
          </div>

          <div className="p-5 rounded-2xl border border-slate-200 bg-white shadow-xs space-y-2.5">
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center font-bold text-xs">
              03
            </div>
            <h3 className="font-bold text-sm sm:text-base text-slate-900">Automatic Session Invalidation</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Upon successful password reset, all existing refresh token families and active sessions are revoked across all client devices.
            </p>
          </div>
        </div>
      </div>

      {/* 4. Production Integration Recipes */}
      <div id="client-recipes" className="space-y-4 scroll-mt-20">
        <div className="border-b border-slate-100 pb-3">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
            Frontend Recovery Recipes
          </h2>
          <p className="text-sm text-slate-600">
            Production-ready React 19 hooks and Next.js Server Action patterns:
          </p>
        </div>

        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            {[
              { id: 'recoveryHook', label: 'React 19 Recovery Hook', icon: 'ph:code-bold' },
              { id: 'serverAction', label: 'Next.js 15 Server Action', icon: 'ph:lightning-bold' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveRecipe(tab.id as any)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                  activeRecipe === tab.id
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <Icon icon={tab.icon} className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          <CodeBlock
            code={activeRecipe === 'recoveryHook' ? recoveryHookRecipe : serverActionRecipe}
            language="typescript"
            title={`passwordRecovery.${activeRecipe === 'serverAction' ? 'ts' : 'ts'}`}
            copyable
          />
        </div>
      </div>
    </div>
  );
}
