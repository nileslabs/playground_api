import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Icon } from '@iconify/react';
import { CompareTable } from '@/components/landing/CompareTable';
import { WhyPlaygroundSection } from '@/components/landing/WhyPlaygroundSection';
import { siteConfig } from '@/config/site';
import { getBreadcrumbSchema } from '@/lib/json-ld';

export const metadata: Metadata = {
  title: 'How Playground API Compares to Alternatives — JSONPlaceholder, DummyJSON, Mockoon',
  description:
    'Detailed feature-by-feature comparison of Playground API vs JSONPlaceholder, Platzi Fake API, DummyJSON, and Mockoon. See why virtual mutation overlays provide the ultimate mock developer experience.',
  alternates: {
    canonical: `${siteConfig.url}/comparisons`,
  },
  openGraph: {
    title: 'How Playground API Compares to Alternatives — Playground API',
    description:
      'Compare Playground API with traditional mock services across state persistence, multi-user isolation, GraphQL gateway, latency simulation, and snapshot exports.',
    url: `${siteConfig.url}/comparisons`,
    siteName: 'Playground API',
  },
};

export default function ComparisonsPage() {
  const jsonLdBreadcrumbs = getBreadcrumbSchema([
    { name: 'Home', url: siteConfig.url },
    { name: 'Comparisons', url: `${siteConfig.url}/comparisons` },
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
            <Icon icon="ph:scales-bold" className="w-4 h-4" />
            <span>Platform Evaluation</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black text-text-primary tracking-tight leading-[1.1]">
            How Playground API <span className="text-accent-primary">Compares to Alternatives</span>
          </h1>

          <p className="text-base sm:text-xl text-text-secondary max-w-3xl mx-auto leading-relaxed">
            Legacy mock APIs return static JSON echo responses that discard your mutations on page refresh. See why developers choose Playground API for realistic prototyping.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
            <Link
              href="/docs/introduction"
              className="px-6 py-3 rounded-2xl bg-accent-primary hover:bg-accent-hover text-white font-bold text-sm sm:text-base transition-all shadow-md flex items-center gap-2"
            >
              <span>Explore All Features</span>
              <Icon icon="ph:arrow-right-bold" className="w-4 h-4" />
            </Link>
            <Link
              href="/docs/comparisons"
              className="px-6 py-3 rounded-2xl bg-bg-secondary hover:bg-bg-tertiary border border-border-theme text-text-primary font-bold text-sm sm:text-base transition-colors flex items-center gap-2"
            >
              <Icon icon="ph:book-open-bold" className="w-5 h-5 text-accent-primary" />
              <span>In-Depth Docs Comparison</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Visual Execution Flow: Traditional vs Playground API */}
      <WhyPlaygroundSection />

      {/* In-depth Matrix Comparison Table */}
      <CompareTable />

      {/* Feature Deep Dive FAQ */}
      <section className="py-16 bg-bg-primary border-t border-border-theme">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-text-primary">
              Frequently Asked Architectural Questions
            </h2>
            <p className="text-text-secondary text-sm sm:text-base">
              Key differences that make virtual overlays fundamentally superior to in-memory mocks.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="p-6 rounded-2xl bg-bg-secondary border border-border-theme space-y-3">
              <h3 className="font-bold text-base text-text-primary flex items-center gap-2">
                <Icon icon="ph:shield-check-bold" className="w-5 h-5 text-accent-primary shrink-0" />
                Will my changes affect other developers?
              </h3>
              <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
                No. All mutations are stored in an isolated database overlay keyed to your anonymous HMAC session token. Multiple developers and CI pipelines test simultaneously without data collision.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-bg-secondary border border-border-theme space-y-3">
              <h3 className="font-bold text-base text-text-primary flex items-center gap-2">
                <Icon icon="ph:arrow-counter-clockwise-bold" className="w-5 h-5 text-accent-primary shrink-0" />
                How do I reset back to seed data?
              </h3>
              <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
                Hit the Reset button in the UI or send a <code className="text-accent-primary font-mono text-xs">DELETE /session/reset</code> request. Your mutations will be wiped instantly, restoring baseline seed records.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
