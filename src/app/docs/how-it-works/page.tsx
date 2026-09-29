import React from 'react';
import type { Metadata } from 'next';
import config from '@/config/env';
import { siteConfig } from '@/config/site';
import { Icon } from '@iconify/react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'How Sandboxing Works — Copy-on-Write Virtual Mutation Overlays',
  description:
    'Deep-dive into the Playground API architecture: Read-time virtual overlay engine, session cookie auto-recovery, HMAC signed identity, and non-colliding mutation isolation.',
  alternates: {
    canonical: `${siteConfig.url}/docs/how-it-works`,
  },
  openGraph: {
    title: 'How Playground API Sandboxing Works — Copy-on-Write Architecture',
    description:
      'Learn how private visitor mutation overlays allow persistent CRUD operations without polluting baseline mock data.',
    url: `${siteConfig.url}/docs/how-it-works`,
  },
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
          Playground API combines an immutable global seed catalog with high-performance Copy-on-Write (CoW) session overlays. Discover how thousands of concurrent developers mutate endpoints independently without collisions or database maintenance.
        </p>
      </div>

      {/* 2. Visual 3-Layer Copy-on-Write Architecture */}
      <div id="cow-architecture" className="space-y-4 scroll-mt-20">
        <div className="space-y-1">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
            The 3-Layer Copy-on-Write (CoW) Architecture
          </h2>
          <p className="text-base text-slate-600 leading-relaxed">
            Every read request dynamically executes a three-stage pipeline to construct your realistic view of the world:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-2">
          {/* Layer 1 */}
          <div className="p-6 rounded-2xl border border-slate-200 bg-white shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="w-7 h-7 rounded-lg bg-slate-100 border border-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center">
                1
              </span>
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded">
                Read-Only
              </span>
            </div>
            <h3 className="font-bold text-base text-slate-900">Immutable Baseline Seed</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Global seed database containing 100 posts, 10 users, 500 comments, and 200 todos. It serves as the baseline blueprint and is never modified by any visitor.
            </p>
          </div>

          {/* Layer 2 */}
          <div className="p-6 rounded-2xl border border-indigo-200 bg-indigo-50/40 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="w-7 h-7 rounded-lg bg-indigo-100 border border-indigo-200 text-indigo-700 font-bold text-xs flex items-center justify-center">
                2
              </span>
              <span className="text-xs font-semibold uppercase tracking-wider text-indigo-700 bg-indigo-100 px-2.5 py-0.5 rounded">
                Private Overlay
              </span>
            </div>
            <h3 className="font-bold text-base text-slate-900">Visitor Mutation Delta</h3>
            <p className="text-sm text-slate-700 leading-relaxed">
              When you call <code className="font-mono text-xs bg-indigo-100 text-indigo-800 px-1 py-0.5 rounded">POST</code>, <code className="font-mono text-xs bg-indigo-100 text-indigo-800 px-1 py-0.5 rounded">PUT</code>, or <code className="font-mono text-xs bg-indigo-100 text-indigo-800 px-1 py-0.5 rounded">DELETE</code>, your changes are stored in a private diff dictionary keyed by your unique session identity hash.
            </p>
          </div>

          {/* Layer 3 */}
          <div className="p-6 rounded-2xl border border-emerald-200 bg-emerald-50/40 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="w-7 h-7 rounded-lg bg-emerald-100 border border-emerald-200 text-emerald-800 font-bold text-xs flex items-center justify-center">
                3
              </span>
              <span className="text-xs font-semibold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded">
                Merged View
              </span>
            </div>
            <h3 className="font-bold text-base text-slate-900">Virtual Query Resolver</h3>
            <p className="text-sm text-slate-800 leading-relaxed">
              When querying <code className="font-mono text-xs bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded">GET /posts</code>, the resolver merges Layer 1 + Layer 2 in memory. Deleted items are filtered out, updated records are patched, and newly created items are prepended in &lt;1ms.
            </p>
          </div>
        </div>
      </div>

      {/* 3. Observable Mutation Guarantees */}
      <div id="mutation-guarantees" className="space-y-4 scroll-mt-20">
        <div className="space-y-1">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
            What Happens When You Mutate
          </h2>
          <p className="text-base text-slate-600 leading-relaxed">
            Here are the concrete behavioral guarantees provided by your sandbox overlay:
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-1">
          <div className="p-6 rounded-2xl border border-slate-200 bg-white shadow-xs space-y-2.5">
            <div className="flex items-center gap-2 text-emerald-700 font-bold text-base">
              <Icon icon="ph:plus-circle-bold" className="w-5 h-5 text-emerald-600" />
              <span>Creating Records (POST)</span>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed">
              Newly created items are assigned an auto-incremented ID and saved to your private delta overlay. They immediately appear in subsequent <code className="font-mono text-xs bg-slate-100 text-indigo-600 px-1.5 py-0.5 rounded border border-slate-200">GET /posts</code> queries and increase total pagination counts.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-slate-200 bg-white shadow-xs space-y-2.5">
            <div className="flex items-center gap-2 text-indigo-700 font-bold text-base">
              <Icon icon="ph:pencil-simple-bold" className="w-5 h-5 text-indigo-600" />
              <span>Updating Records (PUT / PATCH)</span>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed">
              Modifying an existing seed item (e.g. changing title on post #1) stores only your field patch in your overlay. The baseline record remains untouched for everyone else in the world.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-slate-200 bg-white shadow-xs space-y-2.5">
            <div className="flex items-center gap-2 text-rose-700 font-bold text-base">
              <Icon icon="ph:trash-bold" className="w-5 h-5 text-rose-600" />
              <span>Deleting Records (DELETE)</span>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed">
              Deleting an item masks its ID in your visitor overlay. Subsequent collection queries filter it out, and single-item requests to <code className="font-mono text-xs bg-slate-100 text-indigo-600 px-1.5 py-0.5 rounded border border-slate-200">GET /posts/:id</code> return a realistic <code className="font-mono text-xs text-rose-600">404 Not Found</code>.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-slate-200 bg-white shadow-xs space-y-2.5">
            <div className="flex items-center gap-2 text-purple-700 font-bold text-base">
              <Icon icon="ph:arrows-down-up-bold" className="w-5 h-5 text-purple-600" />
              <span>Pagination & Sorting Integrity</span>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed">
              Filters (<code className="font-mono text-xs text-slate-700">?userId=1</code>), full-text search (<code className="font-mono text-xs text-slate-700">?q=keyword</code>), and sorting (<code className="font-mono text-xs text-slate-700">?_sort=id&amp;_order=desc</code>) execute on the merged dataset seamlessly.
            </p>
          </div>
        </div>
      </div>

      {/* 4. Session Resolution Mechanisms */}
      <div id="identity-resolution" className="space-y-4 scroll-mt-20">
        <div className="space-y-1">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
            Visitor Identity Resolution
          </h2>
          <p className="text-base text-slate-600 leading-relaxed">
            How does the server route mutations to your private overlay? The API inspects incoming requests using a deterministic waterfall:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-1">
          <div className="p-6 rounded-2xl border border-slate-200 bg-white shadow-xs space-y-2.5">
            <div className="flex items-center gap-2 text-indigo-700 font-bold text-base">
              <Icon icon="ph:cookie-bold" className="w-5 h-5" />
              <span>1. Browser Cookie</span>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed">
              For web browsers, an HMAC-signed <code className="font-mono text-xs bg-slate-100 text-indigo-600 px-1.5 py-0.5 rounded border border-slate-200">pg_identity</code> cookie is automatically assigned on the first HTTP handshake with <code className="font-mono text-xs">credentials: &apos;include&apos;</code>.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-slate-200 bg-white shadow-xs space-y-2.5">
            <div className="flex items-center gap-2 text-indigo-700 font-bold text-base">
              <Icon icon="ph:identification-card-bold" className="w-5 h-5" />
              <span>2. CI / Mobile Header</span>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed">
              Pass an <code className="font-mono text-xs bg-slate-100 text-indigo-600 px-1.5 py-0.5 rounded border border-slate-200">X-Playground-Identity</code> header to isolate parallel test runners or mobile apps without cookies.
            </p>
            <div className="pt-1">
              <Link
                href="/docs/sandbox/ci-cd-identity"
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 inline-flex items-center gap-1"
              >
                <span>View CI/CD testing guide</span>
                <Icon icon="ph:arrow-right-bold" className="w-3 h-3" />
              </Link>
            </div>
          </div>

          <div className="p-6 rounded-2xl border border-slate-200 bg-white shadow-xs space-y-2.5">
            <div className="flex items-center gap-2 text-indigo-700 font-bold text-base">
              <Icon icon="ph:shield-check-bold" className="w-5 h-5" />
              <span>3. JWT Token Claims</span>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed">
              Attaching <code className="font-mono text-xs bg-slate-100 text-indigo-600 px-1.5 py-0.5 rounded border border-slate-200">Authorization: Bearer &lt;token&gt;</code> routes requests to the authenticated user account sandbox with role-based permissions.
            </p>
          </div>
        </div>
      </div>

      {/* 5. Lifecycle, Quotas & Cleanup */}
      <div id="lifecycle-and-cleanup" className="space-y-4 scroll-mt-20">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
          Sandbox Lifecycle & Data Retention
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-1">
          <div className="p-6 rounded-2xl border border-slate-200 bg-white shadow-xs space-y-2.5">
            <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
              <Icon icon="ph:timer-bold" className="w-5 h-5 text-indigo-600" />
              <span>10-Day Sliding Inactivity Window</span>
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Visitor sandboxes are kept alive as long as they receive requests. If a sandbox remains untouched for 10 consecutive days, the overlay is automatically recycled to keep the cluster pristine.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-slate-200 bg-white shadow-xs space-y-2.5">
            <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
              <Icon icon="ph:arrows-counter-clockwise-bold" className="w-5 h-5 text-emerald-600" />
              <span>Instant Atomic Reset</span>
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Whenever you want to restart your application state from zero, make a <code className="font-mono text-xs bg-slate-100 text-indigo-600 px-1.5 py-0.5 rounded border border-slate-200">DELETE /session/reset</code> call. The server discards the session delta in microseconds.
            </p>
          </div>
        </div>

        <div className="p-6 rounded-2xl border border-indigo-100 bg-indigo-50/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h4 className="font-bold text-base text-slate-900">Want to inspect your current session state?</h4>
            <p className="text-sm text-slate-600">Check your current memory quota, active mutations count, and session age in the Sandbox Dashboard.</p>
          </div>
          <Link
            href="/docs/sandbox/dashboard"
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm transition-all shrink-0"
          >
            Open Sandbox Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
