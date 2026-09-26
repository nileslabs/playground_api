import React from 'react';
import type { Metadata } from 'next';
import config from '@/config/env';
import { Icon } from '@iconify/react';

export const metadata: Metadata = {
  title: 'How Sandboxing Works — Per-Session Virtual Mutation Overlays',
  description:
    'Deep-dive into the Playground API architecture: Read-time virtual overlay engine, session cookie auto-recovery, HMAC signed identity, and non-colliding mutation isolation.',
};

export default function HowItWorksPage() {
  const publicApiUrl = config.publicApiUrl || 'https://playground.nileslabs.com/api/v1';

  return (
    <div className="space-y-12 w-full text-slate-900">
      {/* 1. Header with Eyebrow Badge */}
      <div id="overview" className="space-y-4 scroll-mt-20">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold uppercase tracking-wider border border-indigo-100">
          <Icon icon="ph:gear-six-bold" className="w-3.5 h-3.5" />
          <span>Under the Hood</span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-[1.15]">
          How Sandboxing Works
        </h1>

        <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-3xl">
          Learn how Playground API isolates mutations to your private session while preserving pristine baseline data for all users across the world.
        </p>
      </div>

      {/* 2. Visual 3-Layer Overlay Architecture */}
      <div className="space-y-4">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
          The 3-Layer Copy-on-Write (CoW) Overlay
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="p-6 rounded-2xl border border-slate-200 bg-white shadow-xs space-y-3">
            <div className="flex items-center gap-2 text-indigo-700 font-bold text-xs uppercase tracking-wider">
              <span className="w-6 h-6 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-xs">1</span>
              <span>Baseline Seed Layer</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Global read-only database. Contains the standard 100 posts, 10 users, 500 comments, and 200 todos. It is never directly mutated by any visitor.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-indigo-200 bg-indigo-50/40 shadow-xs space-y-3">
            <div className="flex items-center gap-2 text-indigo-700 font-bold text-xs uppercase tracking-wider">
              <span className="w-6 h-6 rounded-lg bg-indigo-100 border border-indigo-200 flex items-center justify-center text-xs">2</span>
              <span>Visitor Mutation Overlay</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
              Your private session diff. Stores your newly created records, edited fields, and deleted IDs tagged by your identity token.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-emerald-200 bg-emerald-50/40 shadow-xs space-y-3">
            <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs uppercase tracking-wider">
              <span className="w-6 h-6 rounded-lg bg-emerald-100 border border-emerald-200 flex items-center justify-center text-xs">3</span>
              <span>Merged Realtime Output</span>
            </div>
            <p className="text-xs sm:text-sm text-emerald-900 leading-relaxed">
              When you query <code className="font-mono text-xs bg-emerald-100 px-1 py-0.5 rounded text-emerald-800">GET /posts</code>, the server dynamically merges Layer 1 + Layer 2 in memory at sub-millisecond speeds.
            </p>
          </div>
        </div>
      </div>

      {/* 3. Session Resolution Mechanisms */}
      <div className="space-y-4">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
          How Sessions Are Identified
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="p-6 rounded-2xl border border-slate-200 bg-white shadow-xs space-y-3">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
              <Icon icon="ph:cookie-bold" className="w-4 h-4 text-indigo-600" />
              <span>1. Browser Cookie (Automatic)</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              In browser environments, requests with <code className="font-mono text-xs bg-slate-100 px-1 py-0.5 rounded text-indigo-600">credentials: &apos;include&apos;</code> receive an HMAC-signed <code className="font-mono text-xs bg-slate-100 px-1 py-0.5 rounded text-slate-800">pg_identity</code> cookie automatically.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-slate-200 bg-white shadow-xs space-y-3">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
              <Icon icon="ph:fingerprint-bold" className="w-4 h-4 text-indigo-600" />
              <span>2. X-Playground-Identity Header (CI / Mobile)</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              For Playwright, Cypress, mobile apps, or Postman, pass <code className="font-mono text-xs bg-slate-100 px-1 py-0.5 rounded text-indigo-600">X-Playground-Identity: test-run-101</code> to isolate each test run cleanly.
            </p>
          </div>
        </div>
      </div>

      {/* 4. Code Example */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-xs overflow-hidden space-y-0">
        <div className="border-b border-slate-200 bg-slate-50/70 px-4 sm:px-6 py-3 flex items-center justify-between">
          <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Header Isolation in Playwright or Fetch
          </span>
          <span className="text-xs font-mono text-slate-400">JavaScript</span>
        </div>
        <div className="p-4 sm:p-6 bg-slate-900">
          <pre className="font-mono text-xs sm:text-sm text-emerald-400 overflow-x-auto">
{`// Pass a custom identity header to isolate parallel test workers
const response = await fetch('${publicApiUrl}/posts', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-Playground-Identity': 'ci-build-worker-4',
  },
  body: JSON.stringify({
    title: 'Automated Test Post',
    body: 'Verified via Playwright runner',
    user_id: 1,
  }),
});`}
          </pre>
        </div>
      </div>

      {/* 5. TTL & Reset */}
      <div className="p-6 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-2">
        <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
          <Icon icon="ph:timer-bold" className="w-4 h-4 text-indigo-600" />
          <span>Automatic 10-Day Cleanup & Instant Reset</span>
        </h3>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          Inactive session sandboxes are automatically purged after 10 days of inactivity. If you ever want to wipe your changes instantly and start fresh, make a <code className="font-mono text-xs bg-slate-200 px-1 py-0.5 rounded text-slate-800">DELETE /api/v1/session/reset</code> request.
        </p>
      </div>
    </div>
  );
}
