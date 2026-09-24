import type { Metadata } from 'next';
import React from 'react';
import { HeroSection } from '@/components/landing/HeroSection';
import { TryItConsole } from '@/components/landing/TryItConsole';
import { RoutesTable } from '@/components/landing/RoutesTable';
import { StatefulnessProof } from '@/components/landing/StatefulnessProof';
import { SchemaRelationsVisualizer } from '@/components/landing/SchemaRelationsVisualizer';
import { FeatureGrid } from '@/components/landing/FeatureGrid';
import { ProblemSolution } from '@/components/landing/ProblemSolution';
import { HowItWorksSteps } from '@/components/landing/HowItWorksSteps';
import { CompareTable } from '@/components/landing/CompareTable';
import { FAQAccordion } from '@/components/landing/FAQAccordion';
import { siteConfig } from '@/config/site';
import { getBreadcrumbSchema } from '@/lib/json-ld';

export const metadata: Metadata = {
  // Use `absolute` so the root layout template ("%s | Playground API") is NOT
  // appended — the home page title already contains the full brand name.
  title: {
    absolute: 'Playground API — Free Stateful Mock REST & GraphQL Service',
  },
  description:
    'Free, instant, stateful mock REST & GraphQL API sandbox for web & mobile development. Features persistent per-session CRUD mutation overlays, JWT auth loops, custom collections, and network latency simulation.',
  alternates: {
    canonical: siteConfig.url,
  },
  openGraph: {
    title: 'Playground API — Free Stateful Mock REST & GraphQL Service',
    description:
      'The modern JSONPlaceholder alternative where mutations actually persist in an isolated, zero-login per-visitor sandbox overlay.',
    url: siteConfig.url,
    siteName: 'Playground API',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Playground API — Free Stateful Mock REST & GraphQL Service',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Playground API — Free Stateful Mock REST & GraphQL Service',
    description:
      'The modern JSONPlaceholder alternative where mutations actually persist in an isolated, zero-login per-visitor sandbox overlay.',
    images: ['/og-image.png'],
  },
};

export default function LandingPage() {
  // BreadcrumbList for the home page — helps Google display breadcrumb rich results
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
      {/* 1. Hero Section: Headline, CTA & Value Proposition */}
      <HeroSection />

      {/* 2. Interactive Live Script Console (JSONPlaceholder + DummyJSON style) */}
      <TryItConsole />

      {/* 3. Live Routes & Resources Table with direct JSON links and live counts */}
      <RoutesTable />

      {/* 4. Statefulness Proof: Persistent Session Overlay vs Fake Echo Mock APIs */}
      <StatefulnessProof />

      {/* 5. Relational Resource Schema Visualizer (MockAPI style) */}
      <SchemaRelationsVisualizer />

      {/* 6. Feature Capabilities Grid */}
      <FeatureGrid />

      {/* 7. Problem & Solution Context */}
      <ProblemSolution />

      {/* 8. How It Works 3-Step Flow */}
      <HowItWorksSteps />

      {/* 9. Feature Comparison Matrix */}
      <CompareTable />

      {/* 10. Frequently Asked Questions & FAQPage Schema */}
      <FAQAccordion />
    </div>
  );
}


