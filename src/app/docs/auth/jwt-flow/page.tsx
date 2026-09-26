'use client';

import React from 'react';
import { Icon } from '@iconify/react';
import config from '@/config/env';
import { InteractiveConsole } from '@/components/docs/InteractiveConsole';

export default function JwtFlowPage() {
  const publicApiUrl = config.publicApiUrl || 'https://playground.nileslabs.com/api/v1';

  return (
    <div className="space-y-12 w-full text-slate-900">
      {/* 1. Header */}
      <div id="overview" className="space-y-4 scroll-mt-20">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold uppercase tracking-wider border border-indigo-100">
          <Icon icon="ph:key-bold" className="w-3.5 h-3.5" />
          <span>Auth & Security</span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-[1.15]">
          JWT Authentication Lifecycle
        </h1>

        <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-3xl">
          Standard JSON Web Token (JWT) issuance and verification. Test login authentication, inspect signed claims, and access protected endpoints using Bearer tokens.
        </p>
      </div>

      {/* 2. Interactive Login Runner */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-6">
        <div className="border-b border-slate-100 pb-4">
          <h3 className="font-bold text-base text-slate-900">Step 1: Authenticate with Login Credentials</h3>
          <p className="text-xs text-slate-500">
            Submit user credentials to receive a cryptographically signed Access Token & Refresh Token pair:
          </p>
        </div>

        <InteractiveConsole
          method="POST"
          path="/auth/login"
          title="Login Request"
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

      {/* 3. Get Authenticated User Profile */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-6">
        <div className="border-b border-slate-100 pb-4">
          <h3 className="font-bold text-base text-slate-900">Step 2: Fetch Current Identity (/auth/me)</h3>
          <p className="text-xs text-slate-500">
            Access protected user claims. Supports either the session cookie or the Bearer token:
          </p>
        </div>

        <InteractiveConsole
          method="GET"
          path="/auth/me"
          title="Verify Session Identity"
        />
      </div>

      {/* 4. Token Architecture Reference */}
      <div id="jwt-specs" className="space-y-4 scroll-mt-20">
        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
          Token Architecture Specifications
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="p-5 rounded-2xl border border-slate-200 bg-white shadow-xs space-y-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
              <Icon icon="ph:shield-check-bold" className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-sm text-slate-900">Access Token (Short-Lived)</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Carries user ID, role, permissions, and session ID. Default expiration is 15 minutes. Pass in the <code className="font-mono text-indigo-600 bg-slate-50 px-1 py-0.5 rounded">Authorization: Bearer &lt;token&gt;</code> header.
            </p>
          </div>

          <div className="p-5 rounded-2xl border border-slate-200 bg-white shadow-xs space-y-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
              <Icon icon="ph:arrows-clockwise-bold" className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-sm text-slate-900">Refresh Token (Long-Lived)</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Opaque or signed token used strictly to rotate expired access tokens via <code className="font-mono text-indigo-600 bg-slate-50 px-1 py-0.5 rounded">POST /auth/refresh</code>. Features reuse detection.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
