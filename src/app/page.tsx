import type { Metadata } from 'next';
import React from 'react';
import { HeroSection } from '@/components/landing/HeroSection';
import { WhyPlaygroundSection } from '@/components/landing/WhyPlaygroundSection';
import { QuickstartSection } from '@/components/landing/QuickstartSection';
import { CapabilitiesSection } from '@/components/landing/CapabilitiesSection';
import { ApiExplorerSection } from '@/components/landing/ApiExplorerSection';
import { UseCasesSection } from '@/components/landing/UseCasesSection';
import { DeveloperToolkitSection } from '@/components/landing/DeveloperToolkitSection';
import { FinalCtaSection } from '@/components/landing/FinalCtaSection';
import { FAQAccordion } from '@/components/landing/FAQAccordion';
import { siteConfig } from '@/config/site';
import { getBreadcrumbSchema } from '@/lib/json-ld';

export const metadata: Metadata = {
  title: {
    absolute: 'Playground API — The Mock Backend That Remembers',
  },
  description:
    'Free, instant, stateful mock REST & GraphQL API sandbox for web & mobile development. Persistent per-session mutations, JWT auth loops, custom collections, and network latency simulation.',
  alternates: {
    canonical: siteConfig.url,
  },
  openGraph: {
    title: 'Playground API — The Mock Backend That Remembers',
    description:
      'Build realistic frontend applications with a stateful REST & GraphQL API — without building a backend first.',
    url: siteConfig.url,
    siteName: 'Playground API',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Playground API — The Mock Backend That Remembers',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Playground API — The Mock Backend That Remembers',
    description:
      'Build realistic frontend applications with a stateful REST & GraphQL API — without building a backend first.',
    images: ['/og-image.png'],
  },
};

export default function LandingPage() {
  const jsonLdBreadcrumbs = getBreadcrumbSchema([
    { name: 'Home', url: siteConfig.url },
  ]);

  return (
    <div className="flex flex-col min-h-screen">
      {/* BreadcrumbList JSON-LD — FAQPage JSON-LD is injected by FAQAccordion */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumbs) }}
      />
      
      {/* 1. Hero & Live API Demonstration */}
      <HeroSection />

      {/* 2. Why Playground API (Side-by-Side Comparison) */}
      <WhyPlaygroundSection />

      {/* 3. 30-Second Quickstart */}
      <QuickstartSection />

      {/* 4. Core Capabilities (BUILD, BEHAVE, BREAK, SHIP) */}
      <CapabilitiesSection />

      {/* 5. Explore the API (Resource Cards) */}
      <ApiExplorerSection />

      {/* 6. Concise Use Cases */}
      <UseCasesSection />

      {/* 7. Developer Toolkit (GraphQL, OpenAPI, Postman, SDK, Snapshots, Webhooks) */}
      <DeveloperToolkitSection />

      {/* 8. FAQ & Rich Snippets */}
      <FAQAccordion />

      {/* 9. Final Developer Call to Action */}
      <FinalCtaSection />
    </div>
  );
}
