'use client';

import React from 'react';
import Link from 'next/link';
import { Icon } from '@iconify/react';
import { siteConfig } from '@/config/site';
import { LogoIcon } from '@/components/ui/LogoIcon';

export function Footer() {
  return (
    <footer className="w-full border-t border-border-subtle bg-bg-surface/50 text-text-primary transition-colors py-12 mt-auto">
      <div className="mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Main 5-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Col 1: Brand Information */}
          <div className="space-y-4 lg:col-span-2">
            <div className="flex items-center gap-3">
              <LogoIcon size={34} className="w-8.5 h-8.5 shrink-0" />
              <div>
                <span className="font-extrabold text-xl sm:text-2xl tracking-tight text-text-primary block leading-tight">
                  Playground API
                </span>
                <span className="text-xs text-text-muted">Sandboxed Mock REST & GraphQL Service</span>
              </div>
            </div>

            <p className="text-sm text-text-secondary leading-relaxed max-w-sm">
              Free, instant mock REST and GraphQL backend for web & mobile prototyping. Features isolated per-user state persistence, JWT authentication, and network simulation.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <a
                href={siteConfig.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-bg-surface-elevated hover:bg-bg-surface-subtle text-text-secondary hover:text-text-primary text-xs font-semibold border border-border-default transition-colors"
                title="View GitHub Repository"
              >
                <Icon icon="simple-icons:github" className="w-4 h-4" />
                <span>GitHub Repository</span>
              </a>

              <a
                href={siteConfig.author.website}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-bg-surface-elevated hover:bg-bg-surface-subtle text-text-secondary hover:text-text-primary text-xs font-semibold border border-border-default transition-colors"
                title="Developer Website"
              >
                <Icon icon="ph:globe-bold" className="w-4 h-4 text-brand-primary" />
                <span>By {siteConfig.author.name}</span>
              </a>
            </div>
          </div>

          {/* Col 2: Getting Started */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-text-muted">
              Getting Started
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm text-text-secondary">
              <li>
                <Link href="/docs/introduction" className="hover:text-brand-primary transition-colors">
                  Overview & Features
                </Link>
              </li>
              <li>
                <Link href="/docs/quickstart" className="hover:text-brand-primary transition-colors">
                  30-Second Quickstart
                </Link>
              </li>
              <li>
                <Link href="/docs/how-it-works" className="hover:text-brand-primary transition-colors">
                  How Sandboxing Works
                </Link>
              </li>
              <li>
                <Link href="/docs/recipes" className="hover:text-brand-primary transition-colors">
                  Framework Recipes
                </Link>
              </li>
              <li>
                <Link href="/docs/comparisons" className="hover:text-brand-primary transition-colors">
                  Alternatives Comparison
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: REST Collections */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-text-muted">
              REST Collections
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm text-text-secondary">
              <li>
                <Link href="/docs/posts" className="hover:text-brand-primary transition-colors">
                  Posts Collection (100)
                </Link>
              </li>
              <li>
                <Link href="/docs/comments" className="hover:text-brand-primary transition-colors">
                  Comments Collection (300)
                </Link>
              </li>
              <li>
                <Link href="/docs/users" className="hover:text-brand-primary transition-colors">
                  Users & Avatars (25)
                </Link>
              </li>
              <li>
                <Link href="/docs/todos" className="hover:text-brand-primary transition-colors">
                  Todos Collection (125)
                </Link>
              </li>
              <li>
                <Link href="/docs/auth" className="hover:text-brand-primary transition-colors">
                  JWT Authentication
                </Link>
              </li>
              <li>
                <Link href="/docs/custom" className="hover:text-brand-primary transition-colors">
                  Custom Dynamic APIs
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Tools & Downloads */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-text-muted">
              Tools & Specs
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm text-text-secondary">
              <li>
                <Link href="/docs/studio" className="hover:text-brand-primary transition-colors">
                  Interactive API Studio
                </Link>
              </li>
              <li>
                <Link href="/docs/simulation" className="hover:text-brand-primary transition-colors">
                  Network & Chaos Sim
                </Link>
              </li>
              <li>
                <Link href="/docs/graphql" className="hover:text-brand-primary transition-colors">
                  GraphQL Gateway
                </Link>
              </li>
              <li>
                <Link href="/docs/collections/openapi" className="hover:text-brand-primary transition-colors">
                  OpenAPI 3.0 Specification
                </Link>
              </li>
              <li>
                <Link href="/docs/collections/postman" className="hover:text-brand-primary transition-colors">
                  Postman Collection
                </Link>
              </li>
              <li>
                <Link href="/docs/sdk" className="hover:text-brand-primary transition-colors">
                  TypeScript SDK
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-border-subtle flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-text-muted">
          <div className="flex items-center gap-2 flex-wrap text-center sm:text-left">
            <span>© {new Date().getFullYear()} Playground API. Released under MIT License. Built by</span>
            <a
              href={siteConfig.author.website}
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-text-primary hover:text-brand-primary transition-colors underline"
            >
              {siteConfig.author.name}
            </a>
          </div>

          <div className="flex items-center gap-3">
            <a
              href={siteConfig.healthUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono font-semibold hover:bg-emerald-500/15 transition-colors"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              API: Operational
            </a>

            <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-bg-surface-elevated text-xs font-mono text-text-secondary border border-border-default">
              {siteConfig.apiVersion}
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
