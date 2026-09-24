import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Icon } from '@iconify/react';
import { FeatureGrid } from '@/components/landing/FeatureGrid';
import { HowItWorksSteps } from '@/components/landing/HowItWorksSteps';
import { ProblemSolution } from '@/components/landing/ProblemSolution';
import { siteConfig } from '@/config/site';
import { getBreadcrumbSchema } from '@/lib/json-ld';

export const metadata: Metadata = {
  title: 'Engineered for Real-World Prototyping — Playground API',
  description:
    'Discover how Playground API delivers developer superpowers for rapid prototyping: persistent mutation overlays, dual REST & GraphQL gateways, fake JWT auth, network simulation, and zero-conflict multi-user isolation.',
  alternates: {
    canonical: `${siteConfig.url}/prototyping`,
  },
  openGraph: {
    title: 'Engineered for Real-World Prototyping — Playground API',
    description:
      'Everything frontend developers, QA suites, and AI model agents need to prototype, test, and ship applications without managing servers.',
    url: `${siteConfig.url}/prototyping`,
    siteName: 'Playground API',
  },
};

export default function PrototypingPage() {
  const jsonLdBreadcrumbs = getBreadcrumbSchema([
    { name: 'Home', url: siteConfig.url },
    { name: 'Prototyping', url: `${siteConfig.url}/prototyping` },
  ]);

  return (
    <div className="flex flex-col min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumbs) }}
      />

      {/* Hero Banner for Prototyping Page */}
      <section className="py-16 sm:py-24 bg-gradient-to-b from-accent-light/30 via-bg-primary to-bg-secondary/40 border-b border-border-theme">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent-light text-accent-primary text-xs sm:text-sm font-bold border border-accent-primary/25 shadow-2xs">
            <Icon icon="ph:sparkle-bold" className="w-4 h-4" />
            <span>Developer Superpowers</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black text-text-primary tracking-tight leading-[1.1]">
            Engineered for <span className="text-accent-primary">Real-World Prototyping</span>
          </h1>

          <p className="text-base sm:text-xl text-text-secondary max-w-3xl mx-auto leading-relaxed">
            Everything frontend developers, QA suites, and AI model agents need to prototype, test, and ship applications without waiting on backend teams or running local servers.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
            <Link
              href="/docs/introduction"
              className="px-6 py-3 rounded-2xl bg-accent-primary hover:bg-accent-hover text-white font-bold text-sm sm:text-base transition-all shadow-md hover:shadow-lg flex items-center gap-2"
            >
              <span>Explore Quickstart</span>
              <Icon icon="ph:arrow-right-bold" className="w-4 h-4" />
            </Link>
            <Link
              href="/docs/studio"
              className="px-6 py-3 rounded-2xl bg-bg-secondary hover:bg-bg-tertiary border border-border-theme text-text-primary font-bold text-sm sm:text-base transition-colors flex items-center gap-2"
            >
              <Icon icon="ph:play-circle-bold" className="w-5 h-5 text-accent-primary" />
              <span>Interactive API Studio</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Core Feature Grid */}
      <FeatureGrid />

      {/* Why Traditional Mocks Fail vs Playground API */}
      <ProblemSolution />

      {/* 3 Step Workflow */}
      <HowItWorksSteps />

      {/* Bottom CTA */}
      <section className="py-16 bg-bg-primary text-center border-t border-border-theme">
        <div className="max-w-3xl mx-auto px-4 space-y-4">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-text-primary">
            Ready to supercharge your prototype?
          </h2>
          <p className="text-text-secondary text-sm sm:text-base">
            Start sending requests in 30 seconds. No account, no API keys, and no credit card required.
          </p>
          <div className="pt-2">
            <Link
              href="/docs/quickstart"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-accent-primary text-white font-bold text-sm hover:bg-accent-hover transition-colors shadow-sm"
            >
              <span>Read the 30-Second Quickstart</span>
              <Icon icon="ph:lightning-fill" className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
