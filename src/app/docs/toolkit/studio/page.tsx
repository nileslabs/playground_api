'use client';

import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import config from '@/config/env';
import { siteConfig } from '@/config/site';
import { InteractiveConsole } from '@/components/docs/InteractiveConsole';
import Link from 'next/link';

export default function ApiStudioPage() {
  const publicApiUrl = config.publicApiUrl || 'https://playground.nileslabs.com/api/v1';

  const [activePreset, setActivePreset] = useState<'posts' | 'auth' | 'chaos' | 'custom'>('posts');

  const presets = {
    posts: {
      method: 'GET' as const,
      path: '/posts?_limit=5',
      title: 'Fetch Posts Catalog',
      description: 'Retrieve baseline posts with pagination limit.',
      body: undefined,
    },
    auth: {
      method: 'POST' as const,
      path: '/auth/login',
      title: 'Simulate User Login',
      description: 'Authenticate with demo credentials to receive signed JWT tokens.',
      body: JSON.stringify({ username: 'admin', password: 'Password@123' }, null, 2),
    },
    chaos: {
      method: 'GET' as const,
      path: '/posts?_delay=1800&_limit=3',
      title: 'Simulate Latency (1.8s)',
      description: 'Inject artificial network latency to test skeleton loaders and timeout guards.',
      body: undefined,
    },
    custom: {
      method: 'POST' as const,
      path: '/custom/products',
      title: 'Create Custom Product',
      description: 'Dynamically instantiate a record in a private custom collection.',
      body: JSON.stringify({ name: 'Mechanical Keyboard', price: 129.99, inStock: true }, null, 2),
    },
  };

  const selectedPreset = presets[activePreset];

  return (
    <div className="space-y-12 w-full text-slate-900">
      {/* 1. Header with Eyebrow Badge */}
      <div id="overview" className="space-y-4 scroll-mt-20">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold uppercase tracking-wider border border-indigo-100">
          <Icon icon="ph:play-circle-bold" className="w-3.5 h-3.5" />
          <span>Interactive Workbench</span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-[1.15]">
          Universal API Studio
        </h1>

        <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-3xl">
          An in-browser API testing workbench built directly into the documentation. Test arbitrary REST endpoints, execute persistent CRUD mutations, inject chaos modifiers, and inspect response headers and JSON payloads in real time.
        </p>
      </div>

      {/* 2. Preset Selectors */}
      <div id="quick-presets" className="space-y-4 scroll-mt-20">
        <div className="flex items-center justify-between">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
            Quick Scenario Presets
          </h2>
          <span className="text-xs text-slate-500 hidden sm:inline">Click a preset to load into the console below</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <button
            type="button"
            onClick={() => setActivePreset('posts')}
            className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
              activePreset === 'posts'
                ? 'bg-indigo-50/80 border-indigo-300 ring-2 ring-indigo-500/20 shadow-xs'
                : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/60 shadow-xs'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="px-2 py-0.5 rounded text-xs font-bold font-mono bg-blue-100 text-blue-800">GET</span>
              <Icon icon="ph:newspaper-bold" className="w-4 h-4 text-indigo-600" />
            </div>
            <h3 className="font-bold text-sm text-slate-900">Posts Catalog</h3>
            <p className="text-xs text-slate-600 mt-1 line-clamp-2">Baseline query with pagination limit</p>
          </button>

          <button
            type="button"
            onClick={() => setActivePreset('auth')}
            className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
              activePreset === 'auth'
                ? 'bg-indigo-50/80 border-indigo-300 ring-2 ring-indigo-500/20 shadow-xs'
                : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/60 shadow-xs'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="px-2 py-0.5 rounded text-xs font-bold font-mono bg-emerald-100 text-emerald-800">POST</span>
              <Icon icon="ph:lock-key-bold" className="w-4 h-4 text-emerald-600" />
            </div>
            <h3 className="font-bold text-sm text-slate-900">JWT Login</h3>
            <p className="text-xs text-slate-600 mt-1 line-clamp-2">Authenticates &amp; returns access tokens</p>
          </button>

          <button
            type="button"
            onClick={() => setActivePreset('chaos')}
            className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
              activePreset === 'chaos'
                ? 'bg-indigo-50/80 border-indigo-300 ring-2 ring-indigo-500/20 shadow-xs'
                : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/60 shadow-xs'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="px-2 py-0.5 rounded text-xs font-bold font-mono bg-amber-100 text-amber-800">CHAOS</span>
              <Icon icon="ph:hourglass-medium-bold" className="w-4 h-4 text-amber-600" />
            </div>
            <h3 className="font-bold text-sm text-slate-900">1800ms Latency</h3>
            <p className="text-xs text-slate-600 mt-1 line-clamp-2">Tests loading skeleton &amp; UI delays</p>
          </button>

          <button
            type="button"
            onClick={() => setActivePreset('custom')}
            className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
              activePreset === 'custom'
                ? 'bg-indigo-50/80 border-indigo-300 ring-2 ring-indigo-500/20 shadow-xs'
                : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/60 shadow-xs'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="px-2 py-0.5 rounded text-xs font-bold font-mono bg-purple-100 text-purple-800">CUSTOM</span>
              <Icon icon="ph:sparkle-bold" className="w-4 h-4 text-purple-600" />
            </div>
            <h3 className="font-bold text-sm text-slate-900">Custom Collection</h3>
            <p className="text-xs text-slate-600 mt-1 line-clamp-2">Creates an arbitrary dynamic resource</p>
          </button>
        </div>
      </div>

      {/* 3. Universal Interactive Studio Runner */}
      <div id="live-console" className="p-6 sm:p-7 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-6 scroll-mt-20">
        <div className="border-b border-slate-100 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="font-bold text-base sm:text-lg text-slate-900">{selectedPreset.title}</h2>
            <p className="text-sm text-slate-600">{selectedPreset.description}</p>
          </div>
          <span className="text-xs font-mono text-indigo-700 bg-indigo-50 border border-indigo-100 px-2.5 py-1 rounded-lg w-fit">
            Visitor Session Connected
          </span>
        </div>

        <InteractiveConsole
          key={activePreset}
          method={selectedPreset.method}
          path={selectedPreset.path}
          title={selectedPreset.title}
          description={selectedPreset.description}
          initialBody={selectedPreset.body}
        />
      </div>

      {/* 4. Studio Features & Capabilities */}
      <div id="studio-capabilities" className="space-y-4 scroll-mt-20">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
          Studio Workbench Capabilities
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-1">
          <div className="p-6 rounded-2xl border border-slate-200 bg-white shadow-xs space-y-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
              <Icon icon="ph:cookie-bold" className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-slate-900">Automatic Session Isolation</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Every request executed in this console passes your browser&apos;s <code className="font-mono text-xs bg-slate-100 px-1 py-0.5 rounded text-indigo-600">pg_identity</code> session cookie. Mutations persist immediately across the entire documentation.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-slate-200 bg-white shadow-xs space-y-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <Icon icon="ph:timer-bold" className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-slate-900">Precision Latency Timer</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Tracks actual network round-trip time in milliseconds. Helpful for measuring latency injection modifiers (<code className="font-mono text-xs bg-slate-100 px-1 py-0.5 rounded text-slate-700">?_delay=1500</code>) and payload overhead.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-slate-200 bg-white shadow-xs space-y-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
              <Icon icon="ph:arrows-counter-clockwise-bold" className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-slate-900">Instant Reset Hook</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Wipe all mutated records anytime using the atomic reset tool without affecting other users or having to restart a local server.
            </p>
          </div>
        </div>
      </div>

      {/* 5. Navigation Links */}
      <div className="p-6 sm:p-7 rounded-2xl border border-indigo-100 bg-indigo-50/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h3 className="font-bold text-base text-slate-900">Prefer querying via GraphQL?</h3>
          <p className="text-sm text-slate-600">Test queries, mutations, and nested relations in our dedicated GraphiQL IDE.</p>
        </div>
        <Link
          href="/docs/graphql/ide"
          className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm transition-all shrink-0"
        >
          Open GraphiQL IDE
        </Link>
      </div>
    </div>
  );
}
