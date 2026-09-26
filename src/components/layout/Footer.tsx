import React from 'react';
import Link from 'next/link';
import { LogoIcon } from '@/components/ui/LogoIcon';
import siteConfig from '@/config/site';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-slate-200 bg-slate-50/50 py-12 md:py-16 text-slate-600 transition-colors">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 lg:gap-12 pb-12 border-b border-slate-200/80">
          {/* Brand info */}
          <div className="col-span-2 space-y-4">
            <Link href="/" className="inline-flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 border border-indigo-100 shadow-xs">
                <LogoIcon className="h-4.5 w-4.5 text-indigo-600" size={18} />
              </div>
              <span className="font-bold text-base text-slate-900 tracking-tight">Playground API</span>
            </Link>
            <p className="text-sm text-slate-500 max-w-sm leading-relaxed">
              The free, stateful mock REST & GraphQL API sandbox where visitor mutations actually persist in an isolated session overlay without sign-up.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-emerald-700 bg-emerald-50 rounded-full border border-emerald-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                Public API Online (99.98%)
              </span>
            </div>
          </div>

          {/* Column: Core Endpoints */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-900">Endpoints</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/docs/posts" className="text-slate-500 hover:text-indigo-600 transition-colors">
                  /api/v1/posts
                </Link>
              </li>
              <li>
                <Link href="/docs/users" className="text-slate-500 hover:text-indigo-600 transition-colors">
                  /api/v1/users
                </Link>
              </li>
              <li>
                <Link href="/docs/comments" className="text-slate-500 hover:text-indigo-600 transition-colors">
                  /api/v1/comments
                </Link>
              </li>
              <li>
                <Link href="/docs/todos" className="text-slate-500 hover:text-indigo-600 transition-colors">
                  /api/v1/todos
                </Link>
              </li>
              <li>
                <Link href="/docs/graphql" className="text-slate-500 hover:text-indigo-600 transition-colors">
                  /api/v1/graphql
                </Link>
              </li>
            </ul>
          </div>

          {/* Column: Sandbox Tools */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-900">Simulations</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/docs/auth" className="text-slate-500 hover:text-indigo-600 transition-colors">
                  JWT Auth & Roles
                </Link>
              </li>
              <li>
                <Link href="/docs/payments" className="text-slate-500 hover:text-indigo-600 transition-colors">
                  Stripe Payments
                </Link>
              </li>
              <li>
                <Link href="/docs/inbox" className="text-slate-500 hover:text-indigo-600 transition-colors">
                  Virtual Email & OTP
                </Link>
              </li>
              <li>
                <Link href="/docs/simulation" className="text-slate-500 hover:text-indigo-600 transition-colors">
                  Latency & Chaos
                </Link>
              </li>
              <li>
                <Link href="/docs/webhooks" className="text-slate-500 hover:text-indigo-600 transition-colors">
                  Realtime Webhooks
                </Link>
              </li>
            </ul>
          </div>

          {/* Column: Ecosystem & Docs */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-900">Ecosystem</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/docs/quickstart" className="text-slate-500 hover:text-indigo-600 transition-colors">
                  Quickstart Guide
                </Link>
              </li>
              <li>
                <Link href="/docs/sdk" className="text-slate-500 hover:text-indigo-600 transition-colors">
                  TypeScript SDK
                </Link>
              </li>
              <li>
                <Link href="/docs/collections/openapi" className="text-slate-500 hover:text-indigo-600 transition-colors">
                  OpenAPI Spec
                </Link>
              </li>
              <li>
                <Link href="/docs/collections/postman" className="text-slate-500 hover:text-indigo-600 transition-colors">
                  Postman Collection
                </Link>
              </li>
              <li>
                <Link href={siteConfig.links.github} target="_blank" className="text-slate-500 hover:text-indigo-600 transition-colors">
                  GitHub Repository
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright and attribution */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {currentYear} Playground API. Created by {siteConfig.author.name}. Open source under ISC license.</p>
          <div className="flex items-center gap-6">
            <span>Powered by Express 5, Prisma & Neon PostgreSQL</span>
            <Link href="/llms.txt" className="hover:text-slate-900 transition-colors">
              llms.txt
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
