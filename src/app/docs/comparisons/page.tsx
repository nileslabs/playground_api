import React from 'react';
import type { Metadata } from 'next';
import { Icon } from '@iconify/react';
import { siteConfig } from '@/config/site';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Architectural Comparisons — Playground API vs Mock Tool Archetypes',
  description:
    'An objective engineering comparison evaluating Stateful Cloud Virtual Sandboxes against Static Mock APIs, Client-Side Interceptors, Local Mock Daemons, and Docker Staging.',
  alternates: {
    canonical: `${siteConfig.url}/docs/comparisons`,
  },
  openGraph: {
    title: 'Playground API vs Architectural Alternatives',
    description:
      'Compare stateful cloud sandboxes against static mock endpoints, in-browser interceptors, and local mock daemons.',
    url: `${siteConfig.url}/docs/comparisons`,
  },
};

export default function ComparisonsPage() {
  const comparisonRows = [
    {
      feature: 'CRUD Mutation Statefulness',
      description: 'POST, PUT, DELETE operations persist across subsequent GET queries and page reloads.',
      playground: 'Yes (Per-Session CoW)',
      staticMock: 'No (Ephemeral echo only)',
      clientInterceptor: 'Memory Only (Lost on reload)',
      localDaemon: 'Partial (Requires local file sync)',
      dockerStaging: 'Yes (Full DB state)',
    },
    {
      feature: 'Zero-Install & Zero-Config',
      description: 'Can be queried immediately from any browser or curl without installing packages or daemons.',
      playground: 'Yes (Instant URL)',
      staticMock: 'Yes (Instant URL)',
      clientInterceptor: 'No (NPM package & worker setup)',
      localDaemon: 'No (Desktop app or CLI daemon)',
      dockerStaging: 'No (Docker compose & migrations)',
    },
    {
      feature: 'Cross-Device & Mobile Testing',
      description: 'Works seamlessly on real iOS/Android devices and physical test phones without proxying.',
      playground: 'Yes (Public cloud endpoint)',
      staticMock: 'Yes',
      clientInterceptor: 'No (Browser/Node JS only)',
      localDaemon: 'Requires Ngrok / Port forwarding',
      dockerStaging: 'Requires Cloud VPC / Tunnel',
    },
    {
      feature: 'JWT Auth & Refresh Lifecycle',
      description: 'Issues valid JWTs, enforces token expiry, rotates refresh tokens, and simulates 403 roles.',
      playground: 'Yes (Built-in Auth Loop)',
      staticMock: 'No (Fake static string)',
      clientInterceptor: 'Requires manual mock handlers',
      localDaemon: 'Requires custom rule configuration',
      dockerStaging: 'Yes (Real auth service)',
    },
    {
      feature: 'Realtime WebSockets & SSE',
      description: 'Live WebSocket gateway (/ws), Socket.io hub, presence bots, and Server-Sent Events.',
      playground: 'Yes (Native WS + SSE)',
      staticMock: 'No',
      clientInterceptor: 'No (HTTP mocking only)',
      localDaemon: 'Limited / Plugin dependent',
      dockerStaging: 'Yes (Full WS server)',
    },
    {
      feature: 'Outgoing Webhook Dispatching',
      description: 'Dispatches signed HMAC SHA-256 webhooks to public URLs when resources mutate.',
      playground: 'Yes (With delivery logs)',
      staticMock: 'No',
      clientInterceptor: 'No (Runs entirely client-side)',
      localDaemon: 'Requires public tunneling',
      dockerStaging: 'Yes (Requires worker queue)',
    },
    {
      feature: 'Chaos & Latency Injection',
      description: 'On-demand latency (?_delay=1500), simulated 5xx status codes, and network jitter.',
      playground: 'Yes (Query params & headers)',
      staticMock: 'Fixed delay parameter only',
      clientInterceptor: 'Requires manual code timers',
      localDaemon: 'Yes (Rule based)',
      dockerStaging: 'Requires proxy / Toxiproxy',
    },
    {
      feature: 'Parallel CI/CD Isolation',
      description: 'Multiple test runners or PR builds can execute concurrently without colliding with each other.',
      playground: 'Yes (X-Playground-Identity header)',
      staticMock: 'Yes (Because read-only)',
      clientInterceptor: 'Yes (In-memory runner)',
      localDaemon: 'Difficult on headless CI',
      dockerStaging: 'Expensive (Requires multi-tenant DB)',
    },
    {
      feature: 'Infrastructure & Running Cost',
      description: 'Operational overhead, hosting cost, and maintenance burden.',
      playground: '100% Free (Zero Infra)',
      staticMock: 'Free',
      clientInterceptor: 'Free (Runs locally)',
      localDaemon: 'Free / Desktop license',
      dockerStaging: 'High AWS/GCP bills + DB ops',
    },
  ];

  return (
    <div className="space-y-12 w-full text-slate-900">
      {/* 1. Header with Eyebrow Badge */}
      <div id="overview" className="space-y-4 scroll-mt-20">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold uppercase tracking-wider border border-indigo-100">
          <Icon icon="ph:scales-bold" className="w-3.5 h-3.5" />
          <span>Architectural Analysis</span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-[1.15]">
          Playground API vs Architectural Alternatives
        </h1>

        <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-3xl">
          An objective engineering comparison evaluating Stateful Cloud Virtual Sandboxes against traditional Static Mock APIs, Client-Side Interceptors, Local Mock Daemons, and Dedicated Staging Environments.
        </p>
      </div>

      {/* 2. Archetypes Grid */}
      <div id="archetypes" className="space-y-4 scroll-mt-20">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
          Understanding the 5 Mocking Archetypes
        </h2>
        <p className="text-base text-slate-600 leading-relaxed">
          Different development stages call for different architectures. Here is how each category operates under the hood:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 pt-2">
          {/* Archetype 1 */}
          <div className="p-6 rounded-2xl border border-slate-200 bg-white shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700">
              <Icon icon="ph:file-code-bold" className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-slate-900">1. Static Read-Only Mock APIs</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Public HTTP endpoints serving hardcoded JSON fixtures. Great for simple read tutorials, but mutations vanish into thin air, and they cannot simulate real auth or protocols.
            </p>
          </div>

          {/* Archetype 2 */}
          <div className="p-6 rounded-2xl border border-slate-200 bg-white shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700">
              <Icon icon="ph:browser-bold" className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-slate-900">2. Client-Side Interceptors</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Browser Service Workers or in-process fetch monkeypatching. Ideal for offline unit testing in Jest/Vitest, but cannot be shared with real mobile devices or external webhooks.
            </p>
          </div>

          {/* Archetype 3 */}
          <div className="p-6 rounded-2xl border border-slate-200 bg-white shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700">
              <Icon icon="ph:desktop-bold" className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-slate-900">3. Local Desktop & CLI Daemons</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Standalone applications running on localhost. Excellent for offline local development, but requires local software installation, port management, and complex CI/CD container setups.
            </p>
          </div>

          {/* Archetype 4 */}
          <div className="p-6 rounded-2xl border border-slate-200 bg-white shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700">
              <Icon icon="ph:hard-drives-bold" className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-slate-900">4. Dedicated Staging / Docker</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Cloning real backend microservices and databases into staging environments. 100% realistic, but entails massive cloud bills, slow cold starts, and continuous database migrations.
            </p>
          </div>

          {/* Archetype 5: Playground API */}
          <div className="p-6 rounded-2xl border border-indigo-200 bg-indigo-50/40 shadow-xs space-y-3 md:col-span-2 lg:col-span-2">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center">
                <Icon icon="ph:sparkle-bold" className="w-5 h-5" />
              </div>
              <span className="text-xs font-semibold uppercase tracking-wider text-indigo-700 bg-indigo-100 px-2.5 py-0.5 rounded">
                The Best of Both Worlds
              </span>
            </div>
            <h3 className="font-bold text-base sm:text-lg text-slate-900">5. Playground API: Stateful Cloud Virtual Overlays</h3>
            <p className="text-sm text-slate-700 leading-relaxed">
              Combines the zero-configuration simplicity of cloud mock APIs with the stateful fidelity of real backends. Every visitor receives an isolated Copy-on-Write sandbox where mutations persist across reloads without touching baseline data or spinning up heavy databases.
            </p>
          </div>
        </div>
      </div>

      {/* 3. Comprehensive Feature Comparison Table */}
      <div id="feature-matrix" className="space-y-4 scroll-mt-20">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
          Capability Matrix
        </h2>

        <div className="rounded-2xl border border-slate-200 bg-white shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-700 border-b border-slate-200">
                <tr>
                  <th className="py-4 px-4 font-bold text-sm min-w-55">Capability</th>
                  <th className="py-4 px-4 font-bold text-sm text-indigo-700 bg-indigo-50/70 min-w-[170px]">
                    Playground API
                  </th>
                  <th className="py-4 px-4 font-semibold text-sm text-slate-600 min-w-[150px]">
                    Static Mock APIs
                  </th>
                  <th className="py-4 px-4 font-semibold text-sm text-slate-600 min-w-[150px]">
                    Client Interceptors
                  </th>
                  <th className="py-4 px-4 font-semibold text-sm text-slate-600 min-w-[150px]">
                    Local Daemons
                  </th>
                  <th className="py-4 px-4 font-semibold text-sm text-slate-600 min-w-[150px]">
                    Docker / Staging
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {comparisonRows.map((row) => (
                  <tr key={row.feature} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-4 px-4">
                      <div className="font-bold text-slate-900 text-sm sm:text-base">{row.feature}</div>
                      <div className="text-xs text-slate-500 leading-relaxed pt-0.5">{row.description}</div>
                    </td>

                    {/* Playground API */}
                    <td className="py-4 px-4 bg-indigo-50/20 font-bold text-indigo-700">
                      <div className="inline-flex items-center gap-1.5 text-emerald-600">
                        <Icon icon="ph:check-circle-fill" className="w-4 h-4 shrink-0" />
                        <span className="text-sm font-semibold">{row.playground}</span>
                      </div>
                    </td>

                    {/* Static Mock */}
                    <td className="py-4 px-4 text-slate-600">
                      {row.staticMock.startsWith('No') ? (
                        <div className="inline-flex items-center gap-1.5 text-rose-500">
                          <Icon icon="ph:x-circle-bold" className="w-4 h-4 shrink-0" />
                          <span className="text-sm">{row.staticMock}</span>
                        </div>
                      ) : (
                        <span className="text-sm text-slate-700 font-medium">{row.staticMock}</span>
                      )}
                    </td>

                    {/* Client Interceptor */}
                    <td className="py-4 px-4 text-slate-600">
                      {row.clientInterceptor.startsWith('No') ? (
                        <div className="inline-flex items-center gap-1.5 text-rose-500">
                          <Icon icon="ph:x-circle-bold" className="w-4 h-4 shrink-0" />
                          <span className="text-sm">{row.clientInterceptor}</span>
                        </div>
                      ) : (
                        <span className="text-sm text-slate-700 font-medium">{row.clientInterceptor}</span>
                      )}
                    </td>

                    {/* Local Daemon */}
                    <td className="py-4 px-4 text-slate-600">
                      {row.localDaemon.startsWith('No') ? (
                        <div className="inline-flex items-center gap-1.5 text-rose-500">
                          <Icon icon="ph:x-circle-bold" className="w-4 h-4 shrink-0" />
                          <span className="text-sm">{row.localDaemon}</span>
                        </div>
                      ) : (
                        <span className="text-sm text-slate-700 font-medium">{row.localDaemon}</span>
                      )}
                    </td>

                    {/* Docker Staging */}
                    <td className="py-4 px-4 text-slate-600">
                      {row.dockerStaging.startsWith('No') ? (
                        <div className="inline-flex items-center gap-1.5 text-rose-500">
                          <Icon icon="ph:x-circle-bold" className="w-4 h-4 shrink-0" />
                          <span className="text-sm">{row.dockerStaging}</span>
                        </div>
                      ) : (
                        <span className="text-sm text-slate-700 font-medium">{row.dockerStaging}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* 4. Decision Matrix: When to Use What */}
      <div id="when-to-use-what" className="space-y-4 scroll-mt-20">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
          When to Choose What
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-1">
          <div className="p-6 rounded-2xl border border-slate-200 bg-white shadow-xs space-y-3">
            <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
              <Icon icon="ph:check-bold" className="w-5 h-5 text-emerald-600" />
              <span>Use Client-Side Interceptors when:</span>
            </h3>
            <ul className="text-sm text-slate-600 space-y-2 leading-relaxed list-disc list-inside">
              <li>Writing isolated unit tests in Vitest or Jest without internet access.</li>
              <li>You need to mock specific hardcoded third-party error responses inside component tests.</li>
              <li>You only support in-browser JavaScript rendering without external clients.</li>
            </ul>
          </div>

          <div className="p-6 rounded-2xl border border-slate-200 bg-white shadow-xs space-y-3">
            <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
              <Icon icon="ph:check-bold" className="w-5 h-5 text-indigo-600" />
              <span>Use Playground API when:</span>
            </h3>
            <ul className="text-sm text-slate-600 space-y-2 leading-relaxed list-disc list-inside">
              <li>Building interactive frontends, demos, or portfolio apps where CRUD needs to persist.</li>
              <li>Testing real mobile apps (iOS, Android, React Native) that cannot run Service Workers.</li>
              <li>Testing real auth loops (JWT login, refresh token rotation, simulated 403 roles).</li>
              <li>Prototyping WebSockets, chat rooms, or live Server-Sent Events (SSE).</li>
              <li>Running parallel CI/CD test runners without spinning up database containers.</li>
            </ul>
          </div>
        </div>
      </div>

      {/* 5. Call to action */}
      <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="space-y-1.5 max-w-xl">
          <h3 className="text-lg sm:text-xl font-bold text-slate-900">Experience the difference firsthand</h3>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            Open the 5-minute quickstart guide and test stateful persistence in your browser or terminal right now.
          </p>
        </div>
        <Link
          href="/docs/quickstart"
          className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm shadow-xs transition-all flex items-center gap-2 shrink-0"
        >
          <span>Open Quickstart</span>
          <Icon icon="ph:arrow-right-bold" className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
