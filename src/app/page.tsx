import type { Metadata } from 'next';
import React from 'react';
import { HeroSection } from '@/components/landing/HeroSection';
import { TryItConsole } from '@/components/landing/TryItConsole';
import { ComparisonSection } from '@/components/landing/ComparisonSection';
import { HowItWorksSection } from '@/components/landing/HowItWorksSection';
import { FeaturesSection } from '@/components/landing/FeaturesSection';
import { EndpointsSection } from '@/components/landing/EndpointsSection';
import { DownloadsSection } from '@/components/landing/DownloadsSection';
import { FaqSection } from '@/components/landing/FaqSection';
import { CtaSection } from '@/components/landing/CtaSection';
import { siteConfig } from '@/config/site';
import { getBreadcrumbSchema } from '@/lib/json-ld';

export const metadata: Metadata = {
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
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Playground API — Free Stateful Mock REST & GraphQL Service',
    description:
      'The modern JSONPlaceholder alternative where mutations actually persist in an isolated, zero-login per-visitor sandbox overlay.',
  },
};

export default function LandingPage() {
  const jsonLdBreadcrumbs = getBreadcrumbSchema([
    { name: 'Home', url: siteConfig.url },
  ]);

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Structured Breadcrumbs */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumbs) }}
      />

      {/* 1. Hero Section: Headline, quick cURL, and value prop */}
      <HeroSection />

      {/* 2. Interactive Try-It Live Console */}
      <TryItConsole />

      {/* 3. Why Playground API: Side-by-side comparison */}
      <ComparisonSection />

      {/* 4. Architecture: How it works in 3 clear steps */}
      <HowItWorksSection />

      {/* 5. Capabilities: 8 Visual Feature Cards */}
      <FeaturesSection />

      {/* 6. Resource Catalog & Endpoints Explorer */}
      <EndpointsSection />

      {/* 7. Client SDK & Collections Downloads */}
      <DownloadsSection />

      {/* 8. Frequently Asked Questions */}
      <FaqSection />

      {/* 9. Bottom Call to Action */}
      <CtaSection />
    </div>
  );
}
