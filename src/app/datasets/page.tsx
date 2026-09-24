import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Icon } from '@iconify/react';
import { ResourceGrid } from '@/components/landing/ResourceGrid';
import { ApiExplorerSection } from '@/components/landing/ApiExplorerSection';
import { siteConfig } from '@/config/site';
import { getBreadcrumbSchema } from '@/lib/json-ld';

export const metadata: Metadata = {
  title: 'Explore Built-in Mock Datasets — Playground API',
  description:
    'Explore comprehensive pre-seeded mock datasets for frontend prototyping: Users, Posts, Comments, Todos, JWT Auth, and Dynamic Custom Collections with real pagination and relational filtering.',
  alternates: {
    canonical: `${siteConfig.url}/datasets`,
  },
  openGraph: {
    title: 'Explore Built-in Mock Datasets — Playground API',
    description:
      'Browse all pre-seeded mock datasets with live record counts, endpoint references, and interactive documentation.',
    url: `${siteConfig.url}/datasets`,
    siteName: 'Playground API',
  },
};

export default function DatasetsPage() {
  const jsonLdBreadcrumbs = getBreadcrumbSchema([
    { name: 'Home', url: siteConfig.url },
    { name: 'Datasets', url: `${siteConfig.url}/datasets` },
  ]);

  return (
    <div className="flex flex-col min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumbs) }}
      />

      {/* Header Banner */}
      <section className="py-16 sm:py-24 bg-gradient-to-b from-accent-light/30 via-bg-primary to-bg-secondary/40 border-b border-border-theme">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent-light text-accent-primary text-xs sm:text-sm font-bold border border-accent-primary/25 shadow-2xs">
            <Icon icon="ph:database-bold" className="w-4 h-4" />
            <span>Pre-Seeded Mock Datasets</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black text-text-primary tracking-tight leading-[1.1]">
            Explore Built-in <span className="text-accent-primary">Mock Datasets</span>
          </h1>

          <p className="text-base sm:text-xl text-text-secondary max-w-3xl mx-auto leading-relaxed">
            Ready-to-use relational mock data models equipped with full CRUD persistence, pagination, filtering, full-text search, and GraphQL schemas.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
            <Link
              href="/docs/introduction"
              className="px-6 py-3 rounded-2xl bg-accent-primary hover:bg-accent-hover text-white font-bold text-sm sm:text-base transition-all shadow-md flex items-center gap-2"
            >
              <span>Read API Documentation</span>
              <Icon icon="ph:arrow-right-bold" className="w-4 h-4" />
            </Link>
            <Link
              href="/docs/graphql"
              className="px-6 py-3 rounded-2xl bg-bg-secondary hover:bg-bg-tertiary border border-border-theme text-text-primary font-bold text-sm sm:text-base transition-colors flex items-center gap-2"
            >
              <Icon icon="simple-icons:graphql" className="w-5 h-5 text-accent-primary" />
              <span>Query via GraphQL</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Full Resource Grid with Live Counts */}
      <ResourceGrid />

      {/* Concise Explorer Cards */}
      <ApiExplorerSection />

      {/* Relational Features Section */}
      <section className="py-16 bg-bg-secondary/50 border-t border-border-theme">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-text-primary">
              Relational Routes & Query Parameters
            </h2>
            <p className="text-text-secondary text-sm sm:text-base">
              All collections seamlessly support nested sub-resources and powerful filtering.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-bg-primary border border-border-theme space-y-3">
              <div className="p-2.5 rounded-xl bg-accent-light text-accent-primary w-fit">
                <Icon icon="ph:git-fork-bold" className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-text-primary">Nested Sub-Resources</h3>
              <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
                Query related entities cleanly: <code className="text-accent-primary font-mono text-xs">/users/1/posts</code>, <code className="text-accent-primary font-mono text-xs">/posts/1/comments</code>, or <code className="text-accent-primary font-mono text-xs">/users/1/todos</code>.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-bg-primary border border-border-theme space-y-3">
              <div className="p-2.5 rounded-xl bg-purple-500/15 text-purple-400 w-fit">
                <Icon icon="ph:funnel-bold" className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-text-primary">Query Filtering</h3>
              <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
                Filter any field with URL params: <code className="text-accent-primary font-mono text-xs">/posts?user_id=1</code> or <code className="text-accent-primary font-mono text-xs">/todos?completed=false</code>.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-bg-primary border border-border-theme space-y-3">
              <div className="p-2.5 rounded-xl bg-blue-500/15 text-blue-400 w-fit">
                <Icon icon="ph:magnifying-glass-bold" className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-text-primary">Search & Pagination</h3>
              <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
                Paginate and search effortlessly: <code className="text-accent-primary font-mono text-xs">?_page=1&_limit=10</code> and <code className="text-accent-primary font-mono text-xs">?q=keyword</code>.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
