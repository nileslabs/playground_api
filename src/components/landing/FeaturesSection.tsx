'use client';

import React from 'react';
import Link from 'next/link';

interface FeatureItem {
  iconSvg: React.ReactNode;
  category: string;
  title: string;
  description: string;
  docLink: string;
}

const features: FeatureItem[] = [
  {
    category: 'Persistence',
    title: 'Zero-Login Session Sandbox',
    description:
      'Perform real POST, PUT, and DELETE calls that persist in your private visitor sandbox across browser tabs and reloads.',
    docLink: '/docs/quickstart',
    iconSvg: (
      <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      </svg>
    ),
  },
  {
    category: 'REST Core',
    title: 'Relational Sub-Resources',
    description:
      'Query nested relationships such as /users/1/posts and /posts/1/comments with full-text search (?q=) and multi-field sorting.',
    docLink: '/docs/filtering',
    iconSvg: (
      <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
      </svg>
    ),
  },
  {
    category: 'GraphQL',
    title: 'Unified GraphQL Gateway',
    description:
      'Run queries and mutations at /api/v1/graphql. Supports field selection, nested sub-queries, and schema introspection out of the box.',
    docLink: '/docs/graphql',
    iconSvg: (
      <svg className="w-5 h-5 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5" />
      </svg>
    ),
  },
  {
    category: 'Chaos Testing',
    title: 'Latency & Error Simulation',
    description:
      'Test frontend loading skeletons and error boundaries with parameters like ?_delay=1500 (0–20s) and ?_status=500 (400–599).',
    docLink: '/docs/simulation',
    iconSvg: (
      <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
  },
  {
    category: 'Security',
    title: 'Mock JWT Auth & RBAC',
    description:
      'Simulate real login and registration workflows with access tokens, refresh tokens, /auth/me profile, and role-based guards.',
    docLink: '/docs/auth',
    iconSvg: (
      <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
      </svg>
    ),
  },
  {
    category: 'Comms',
    title: 'Virtual Email & SMS Inbox',
    description:
      'Receive simulated signup verification emails and SMS OTP codes in a live virtual inbox to test end-to-end user onboarding.',
    docLink: '/docs/inbox',
    iconSvg: (
      <svg className="w-5 h-5 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    category: 'E-Commerce',
    title: 'Stripe Payment Simulation',
    description:
      'Create checkout sessions, test card charges, simulate webhook confirmations, and manage mock customer payment methods.',
    docLink: '/docs/payments',
    iconSvg: (
      <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
      </svg>
    ),
  },
  {
    category: 'Realtime',
    title: 'SSE Streaming & WebSockets',
    description:
      'Connect to Server-Sent Events (SSE) at /api/v1/stream and live WebSockets to prototype real-time feeds, chats, and live alerts.',
    docLink: '/docs/webhooks',
    iconSvg: (
      <svg className="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
      </svg>
    ),
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="py-20 md:py-28 bg-white border-b border-slate-200/80">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Section Header */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold uppercase tracking-wider border border-slate-200">
            Capabilities
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">
            Everything your frontend needs to build and ship
          </h2>
          <p className="text-base sm:text-lg text-slate-600 font-normal leading-relaxed">
            A comprehensive suite of mock backend services designed specifically for frontend engineers.
          </p>
        </div>

        {/* 8 Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f) => (
            <div
              key={f.title}
              className="rounded-2xl border border-slate-200 bg-white p-6 space-y-4 hover:border-indigo-300 hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50 border border-slate-200/80 group-hover:bg-indigo-50 group-hover:border-indigo-100 transition-colors">
                    {f.iconSvg}
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200/60">
                    {f.category}
                  </span>
                </div>
                <h3 className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                  {f.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed font-normal">
                  {f.description}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-100">
                <Link
                  href={f.docLink}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-700 transition-colors"
                >
                  <span>Learn more</span>
                  <svg className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
