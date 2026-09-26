import React from 'react';
import type { Metadata } from 'next';
import config from '@/config/env';
import { siteConfig } from '@/config/site';
import { Icon } from '@iconify/react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Introduction — Stateful Mock REST & GraphQL Sandbox',
  description:
    'Overview of Playground API: A free, zero-configuration mock REST and GraphQL backend sandbox with persistent per-visitor CRUD mutations, latency simulation, and JWT auth.',
};

export default function IntroductionPage() {
  const publicApiUrl = config.publicApiUrl || 'https://playground.nileslabs.com/api/v1';

  const capabilities = [
    {
      title: 'Persistent CRUD Mutations',
      desc: 'POST, PUT, and DELETE mutations persist across your browser reloads in an isolated visitor sandbox.',
      icon: 'ph:floppy-disk-bold',
    },
    {
      title: 'Standard Core Resources',
      desc: 'Users, Posts, Comments, and Todos with relational nested sub-resources (/users/1/posts).',
      icon: 'ph:database-bold',
    },
    {
      title: 'Realtime & WebSockets',
      desc: 'Native WebSocket chat hub, Socket.io gateway, SSE notifications, and live presence bot.',
      icon: 'ph:broadcast-bold',
    },
    {
      title: 'JWT Auth & RBAC',
      desc: 'Register, login, token rotation with mutex locks, and simulated 403 Forbidden roles.',
      icon: 'ph:shield-check-bold',
    },
    {
      title: 'Mock Commerce & 3DS',
      desc: 'Hosted checkout sessions, custom payment intents, test credit card vault, and 3D Secure challenge modals.',
      icon: 'ph:credit-card-bold',
    },
    {
      title: 'Virtual Inboxes',
      desc: 'In-app Mailtrap-style email viewer and virtual phone SMS terminal for OTP verification codes.',
      icon: 'ph:envelope-simple-bold',
    },
    {
      title: 'Chaos & Fault Injection',
      desc: 'Artificial network latency sliders (0-5000ms), 429 rate-limiting, and flaky jitter simulation.',
      icon: 'ph:skull-bold',
    },
    {
      title: 'Dynamic Custom Collections',
      desc: 'Build arbitrary endpoints on the fly with 1-click domain seeders for E-Commerce, CRM, and Blog.',
      icon: 'ph:sparkle-bold',
    },
    {
      title: 'AI Agent Context Files',
      desc: 'Pre-configured .cursorrules, .windsurfrules, and context-window standards (llms.txt, product.json).',
      icon: 'ph:robot-bold',
    },
  ];

  return (
    <div className="space-y-12 w-full text-slate-900">
      {/* 1. Header with Eyebrow Badge */}
      <div id="overview" className="space-y-4 scroll-mt-20">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold uppercase tracking-wider border border-indigo-100">
          <Icon icon="ph:sparkle-bold" className="w-3.5 h-3.5" />
          <span>Architecture & Overview</span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-[1.15]">
          Introduction to <span className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-indigo-900 bg-clip-text text-transparent">Playground API</span>
        </h1>

        <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-3xl">
          Playground API is a free, instant mock REST and GraphQL backend sandbox where mutations actually persist in your isolated visitor sandbox—without requiring accounts, databases, or local Docker setups.
        </p>
      </div>

      {/* 2. Base Endpoint Card */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Base API Endpoint (v1)</span>
          </div>
          <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full w-fit">
            Zero API Keys Required
          </span>
        </div>

        <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl font-mono text-sm sm:text-base text-indigo-600 font-bold select-all overflow-x-auto">
          {publicApiUrl}
        </div>
      </div>

      {/* 3. Comparison: Ephemeral Mock APIs vs Playground API */}
      <div className="space-y-4">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
          How Playground API Differs
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="p-6 rounded-2xl border border-slate-200 bg-slate-50/60 space-y-3">
            <div className="flex items-center gap-2 text-rose-600 font-bold text-sm">
              <Icon icon="ph:x-circle-bold" className="w-4 h-4" />
              <span>Standard Mock APIs (JSONPlaceholder)</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Read-only dummy data. When you call <code className="font-mono text-xs bg-slate-200 px-1 py-0.5 rounded">POST /posts</code>, you get a fake ID back, but subsequent <code className="font-mono text-xs bg-slate-200 px-1 py-0.5 rounded">GET /posts</code> requests completely forget your changes.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-indigo-200 bg-indigo-50/40 space-y-3">
            <div className="flex items-center gap-2 text-indigo-700 font-bold text-sm">
              <Icon icon="ph:check-circle-bold" className="w-4 h-4" />
              <span>Playground API Virtual Overlays</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
              Stateful Copy-on-Write overlays. Every create, edit, or delete stays in your private visitor session overlay without database migrations or race conditions with other users.
            </p>
          </div>
        </div>
      </div>

      {/* 4. Full Capabilities Grid */}
      <div className="space-y-6">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
          Core Platform Capabilities
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {capabilities.map((item) => (
            <div
              key={item.title}
              className="p-5 rounded-2xl border border-slate-200 bg-white hover:border-slate-300 shadow-xs hover:shadow-sm transition-all space-y-2.5"
            >
              <div className="w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
                <Icon icon={item.icon} className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-slate-900">{item.title}</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-normal">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 5. Next Steps Call to Action */}
      <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="space-y-1 max-w-xl">
          <h3 className="text-lg font-bold text-slate-900">Ready to start building?</h3>
          <p className="text-xs sm:text-sm text-slate-600">
            Check out the 5-minute quickstart guide with interactive curl and fetch snippets.
          </p>
        </div>
        <Link
          href="/docs/quickstart"
          className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-xs transition-all flex items-center gap-2 shrink-0"
        >
          <span>5-Minute Quickstart</span>
          <Icon icon="ph:arrow-right-bold" className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
