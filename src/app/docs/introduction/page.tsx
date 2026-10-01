import React from 'react';
import type { Metadata } from 'next';
import config from '@/config/env';
import { siteConfig } from '@/config/site';
import { Icon } from '@iconify/react';
import Link from 'next/link';
import { CodeBlock } from '@/components/ui/CodeBlock';

export const metadata: Metadata = {
  title: 'Introduction — Stateful Mock REST & GraphQL Backend Sandbox',
  description:
    'Overview of Playground API: A zero-configuration mock REST and GraphQL backend sandbox with persistent per-visitor CRUD mutations, latency simulation, and JWT auth.',
  alternates: {
    canonical: `${siteConfig.url}/docs/introduction`,
  },
  openGraph: {
    title: 'Introduction to Playground API — Stateful Mock Backend',
    description:
      'Zero-config, stateful mock REST & GraphQL sandbox with persistent CRUD mutations, JWT authentication, and chaos simulation.',
    url: `${siteConfig.url}/docs/introduction`,
  },
};

export default function IntroductionPage() {
  const publicApiUrl = config.publicApiUrl || 'https://playground.nileslabs.com/api/v1';

  const capabilities = [
    {
      title: 'Persistent CRUD Mutations',
      desc: 'POST, PUT, PATCH, and DELETE operations persist across browser reloads in your private visitor sandbox overlay.',
      icon: 'ph:floppy-disk-bold',
      href: '/docs/how-it-works',
      badge: 'Stateful',
    },
    {
      title: 'Core Relational Resources',
      desc: 'Users, Posts, Comments, and Todos pre-populated with relational nested routing (/users/1/posts, /posts/1/comments).',
      icon: 'ph:database-bold',
      href: '/docs/resources/posts',
      badge: 'Relational',
    },
    {
      title: 'Realtime & WebSockets',
      desc: 'Native WebSocket chat hub (/ws), Socket.io gateway, Server-Sent Events (SSE), and automated presence echo bots.',
      icon: 'ph:broadcast-bold',
      href: '/docs/realtime/native-ws',
      badge: 'Realtime',
    },
    {
      title: 'JWT Auth & RBAC Simulation',
      desc: 'Register, login, token refresh rotation with concurrency mutex locks, and simulated 403 role-based permissions.',
      icon: 'ph:shield-check-bold',
      href: '/docs/auth/jwt-flow',
      badge: 'Security',
    },
    {
      title: 'Mock Commerce & 3DS Billing',
      desc: 'Hosted checkout sessions, payment intents, test credit card vaults, and interactive 3D Secure verification modals.',
      icon: 'ph:credit-card-bold',
      href: '/docs/payments/hosted-checkout',
      badge: 'Billing',
    },
    {
      title: 'Virtual Communications',
      desc: 'Integrated virtual email mailbox (Mailtrap-style) and SMS terminal for verifying OTPs and password reset links.',
      icon: 'ph:envelope-simple-bold',
      href: '/docs/inbox/email-mailbox',
      badge: 'In-App',
    },
    {
      title: 'Chaos & Fault Injection',
      desc: 'Configurable artificial latency (0-5000ms), jitter simulation, custom HTTP error status codes, and 429 rate limiting.',
      icon: 'ph:skull-bold',
      href: '/docs/chaos/latency',
      badge: 'Resilience',
    },
    {
      title: 'Dynamic Custom Collections',
      desc: 'Define arbitrary custom schemas on the fly for dynamic E-Commerce, CRM, and SaaS database collections.',
      icon: 'ph:table-bold',
      href: '/docs/query/custom-resources',
      badge: 'Flexible',
    },
    {
      title: 'GraphQL & GraphiQL IDE',
      desc: 'Full GraphQL gateway with schema introspection, nested relational queries, mutations, and realtime subscriptions.',
      icon: 'ph:atom-bold',
      href: '/docs/graphql/ide',
      badge: 'GraphQL',
    },
    {
      title: 'Automated CI/CD Fixtures',
      desc: 'Headless testing support with X-Playground-Identity headers to isolate parallel test runners in Playwright and Cypress.',
      icon: 'ph:git-commit-bold',
      href: '/docs/sandbox/ci-cd-identity',
      badge: 'DevOps',
    },
    {
      title: 'AI Context Standards',
      desc: 'Ready-to-use LLM context rules including llms.txt, llms-full.txt, product.json, and Cursor/Windsurf rule templates.',
      icon: 'ph:robot-bold',
      href: '/docs/ai',
      badge: 'AI Agents',
    },
    {
      title: 'Interactive API Studio',
      desc: 'In-browser visual API workbench to inspect headers, execute live mutations, monitor payloads, and reset sandboxes.',
      icon: 'ph:play-circle-bold',
      href: '/docs/toolkit/studio',
      badge: 'Interactive',
    },
  ];

  const quickVerifyCurl = `# Verify instant connectivity and inspect the baseline catalog
curl -X GET "${publicApiUrl}/posts?_limit=3"`;

  const quickMutateCurl = `# Create a persistent post in your private visitor sandbox overlay
curl -X POST "${publicApiUrl}/posts" \\
  -H "Content-Type: application/json" \\
  -d '{"title": "My First Stateful Post", "body": "Persists on reload!", "user_id": 1}'`;

  return (
    <div className="space-y-12 w-full text-slate-900">
      {/* 1. Header with Eyebrow Badge */}
      <div id="overview" className="space-y-4 scroll-mt-20">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold uppercase tracking-wider border border-indigo-100">
          <Icon icon="ph:sparkle-bold" className="w-3.5 h-3.5" />
          <span>Platform Overview</span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-[1.15]">
          Introduction to <span className="bg-linear-to-r from-indigo-600 via-indigo-700 to-indigo-900 bg-clip-text text-transparent">Playground API</span>
        </h1>

        <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-3xl">
          Playground API is an instant, stateful mock REST and GraphQL backend designed for modern frontend, mobile, and AI development. It gives you realistic backend capabilities—with persistent mutations, auth flows, WebSockets, and fault injection—without writing backend code or managing databases.
        </p>
      </div>

      {/* 2. Base Endpoint Card */}
      <div id="base-url" className="p-6 sm:p-7 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4 scroll-mt-20">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Production API Endpoint</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
              Zero API Keys Needed
            </span>
            <span className="text-xs font-semibold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2.5 py-0.5 rounded-full">
              CORS Enabled
            </span>
          </div>
        </div>

        <div className="p-3.5 bg-slate-900 rounded-xl font-mono text-sm sm:text-base text-indigo-300 font-bold select-all overflow-x-auto flex items-center justify-between border border-slate-800">
          <span>{publicApiUrl}</span>
          <span className="text-xs font-normal text-slate-400 font-sans hidden sm:inline">v1.0 (Live)</span>
        </div>

        <p className="text-sm text-slate-600 leading-relaxed">
          Requests from your browser automatically receive a signed visitor session cookie (<code className="font-mono text-xs bg-slate-100 text-indigo-600 px-1.5 py-0.5 rounded border border-slate-200">pg_identity</code>). For server-side rendering, CI runners, or mobile apps, pass an <code className="font-mono text-xs bg-slate-100 text-indigo-600 px-1.5 py-0.5 rounded border border-slate-200">X-Playground-Identity</code> header.
        </p>
      </div>

      {/* 3. The Problem & The Solution */}
      <div id="why-playground" className="space-y-4 scroll-mt-20">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
          Why Playground API? The Stateful Advantage
        </h2>
        <p className="text-base text-slate-600 leading-relaxed">
          For years, frontend and mobile engineers have had to choose between two frustrating extremes: static dummy APIs where POST requests vanish instantly, or heavy local backend setups requiring Docker, migrations, and seed scripts. Playground API bridges this gap with virtual session overlays.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
          {/* Traditional Mocking */}
          <div className="p-6 rounded-2xl border border-rose-200 bg-rose-50/40 space-y-3.5">
            <div className="flex items-center gap-2 text-rose-700 font-bold text-base">
              <Icon icon="ph:x-circle-bold" className="w-5 h-5 text-rose-600 shrink-0" />
              <span>Traditional Dummy Mock APIs</span>
            </div>
            <ul className="text-sm text-slate-700 space-y-2.5 leading-relaxed">
              <li className="flex items-start gap-2.5">
                <Icon icon="ph:x-bold" className="w-4 h-4 text-rose-500 mt-0.5 shrink-0" />
                <span><strong>Ephemeral mutations:</strong> Calling <code className="font-mono text-xs bg-rose-100 text-rose-800 px-1.5 py-0.5 rounded">POST /posts</code> returns a fake ID, but subsequent GET queries never show your new record.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Icon icon="ph:x-bold" className="w-4 h-4 text-rose-500 mt-0.5 shrink-0" />
                <span><strong>No auth lifecycle:</strong> Cannot simulate login token expiration, refresh rotation, or role permission checks.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Icon icon="ph:x-bold" className="w-4 h-4 text-rose-500 mt-0.5 shrink-0" />
                <span><strong>No real protocols:</strong> Missing WebSockets, SSE streams, webhook dispatchers, or latency simulation.</span>
              </li>
            </ul>
          </div>

          {/* Playground API Solution */}
          <div className="p-6 rounded-2xl border border-indigo-200 bg-indigo-50/40 space-y-3.5">
            <div className="flex items-center gap-2 text-indigo-800 font-bold text-base">
              <Icon icon="ph:check-circle-bold" className="w-5 h-5 text-indigo-600 shrink-0" />
              <span>Playground API Virtual Sandboxes</span>
            </div>
            <ul className="text-sm text-slate-700 space-y-2.5 leading-relaxed">
              <li className="flex items-start gap-2.5">
                <Icon icon="ph:check-bold" className="w-4 h-4 text-indigo-600 mt-0.5 shrink-0" />
                <span><strong>Copy-on-Write (CoW) overlays:</strong> Every create, edit, and delete persists in your private session overlay without touching shared baseline data.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Icon icon="ph:check-bold" className="w-4 h-4 text-indigo-600 mt-0.5 shrink-0" />
                <span><strong>Complete auth & RBAC:</strong> Real JWT access & refresh tokens, concurrent token refresh mutexes, and 403 role guards.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Icon icon="ph:check-bold" className="w-4 h-4 text-indigo-600 mt-0.5 shrink-0" />
                <span><strong>Unified protocol suite:</strong> REST, GraphQL, Native WebSockets, Socket.io, SSE, and simulated chaos built in.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* 4. Quick Verification Snippets */}
      <div id="quick-try" className="space-y-4 scroll-mt-20">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
          Try It in 10 Seconds
        </h2>
        <p className="text-base text-slate-600 leading-relaxed">
          Open your terminal and run these commands right now. No sign-up, no API key, and no configuration required.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
              <Icon icon="ph:terminal-window-bold" className="w-4 h-4 text-indigo-600" />
              1. Fetch Baseline Posts
            </span>
            <CodeBlock code={quickVerifyCurl} language="bash" title="Terminal" />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
              <Icon icon="ph:floppy-disk-bold" className="w-4 h-4 text-emerald-600" />
              2. Perform a Stateful Mutation
            </span>
            <CodeBlock code={quickMutateCurl} language="bash" title="Terminal" />
          </div>
        </div>
      </div>

      {/* 5. Platform Capabilities Grid */}
      <div id="capabilities" className="space-y-6 scroll-mt-20">
        <div className="space-y-1">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
            Comprehensive Platform Capabilities
          </h2>
          <p className="text-base text-slate-600 leading-relaxed">
            Everything modern product teams need to prototype, test, and ship complete frontend applications.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {capabilities.map((item) => (
            <Link
              key={item.title}
              href={item.href}
              className="p-5 sm:p-6 rounded-2xl border border-slate-200 bg-white hover:border-indigo-300 hover:shadow-md transition-all space-y-3 group block"
            >
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 group-hover:bg-indigo-600 border border-indigo-100 group-hover:border-indigo-600 flex items-center justify-center text-indigo-600 group-hover:text-white transition-colors">
                  <Icon icon={item.icon} className="w-5 h-5" />
                </div>
                <span className="text-xs font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-700 group-hover:bg-indigo-50 group-hover:text-indigo-700 transition-colors">
                  {item.badge}
                </span>
              </div>
              <h3 className="font-bold text-base text-slate-900 group-hover:text-indigo-600 transition-colors flex items-center gap-1.5">
                <span>{item.title}</span>
                <Icon icon="ph:arrow-up-right-bold" className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed font-normal">{item.desc}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* 6. Next Steps Pathway */}
      <div id="next-steps" className="p-8 rounded-3xl bg-linear-to-br from-indigo-50 via-white to-slate-50 border border-indigo-100 shadow-xs space-y-6 scroll-mt-20">
        <div className="space-y-1.5">
          <h3 className="text-xl font-bold text-slate-900">Next Steps</h3>
          <p className="text-sm sm:text-base text-slate-600">
            Select a pathway to start integrating Playground API into your workflow.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link
            href="/docs/quickstart"
            className="p-5 rounded-xl bg-white border border-slate-200 hover:border-indigo-300 hover:shadow-xs transition-all space-y-2 group"
          >
            <div className="flex items-center gap-2 text-indigo-600 font-bold text-sm sm:text-base">
              <Icon icon="ph:lightning-bold" className="w-4 h-4" />
              <span>5-Minute Quickstart</span>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed">Step-by-step tutorial with interactive health checks and fetch examples.</p>
          </Link>

          <Link
            href="/docs/how-it-works"
            className="p-5 rounded-xl bg-white border border-slate-200 hover:border-indigo-300 hover:shadow-xs transition-all space-y-2 group"
          >
            <div className="flex items-center gap-2 text-indigo-600 font-bold text-sm sm:text-base">
              <Icon icon="ph:gear-six-bold" className="w-4 h-4" />
              <span>How It Works</span>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed">Learn how Copy-on-Write overlays and session isolation engine function.</p>
          </Link>

          <Link
            href="/docs/recipes"
            className="p-5 rounded-xl bg-white border border-slate-200 hover:border-indigo-300 hover:shadow-xs transition-all space-y-2 group"
          >
            <div className="flex items-center gap-2 text-indigo-600 font-bold text-sm sm:text-base">
              <Icon icon="ph:cooking-pot-bold" className="w-4 h-4" />
              <span>Recipes & Cookbooks</span>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed">Copy-paste integration code for React, Next.js, Vue, Axios, and Playwright.</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
