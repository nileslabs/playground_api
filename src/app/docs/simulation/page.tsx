import React from 'react';
import type { Metadata } from 'next';
import { CodeBlock } from '@/components/ui/CodeBlock';
import config from '@/config/env';
import { siteConfig } from '@/config/site';
import { getDocArticleSchema, getBreadcrumbSchema } from '@/lib/json-ld';

export const metadata: Metadata = {
  title: 'Network & Chaos Simulation — Artificial Latency, 429 Rate Limits, & 500 Errors',
  description:
    'Test frontend loading skeletons, spinner UI transitions, and React error boundaries by simulating network latency (?_delay=1500) and HTTP status error codes (?_status=500).',
  keywords: [
    'network delay simulation api',
    'http error simulation mock api',
    'simulate 429 rate limit react',
    'simulate 500 internal server error',
    'test loading spinners skeletons mock',
  ],
  alternates: {
    canonical: `${siteConfig.url}/docs/simulation`,
  },
  openGraph: {
    title: 'Network & Chaos Simulation — Playground API',
    description:
      'Simulate slow networks, artificial latency, rate limits, and HTTP error codes with headers and query parameters.',
    url: `${siteConfig.url}/docs/simulation`,
    type: 'article',
  },
};

export default function SimulationPage() {
  const publicApiUrl = config.publicApiUrl || 'https://playground.nileslabs.com/api/v1';

  const querySample = `// 1. Simulate 1.5-second network latency
fetch('${publicApiUrl}/posts?_delay=1500')

// 2. Simulate 500 Internal Server Error
fetch('${publicApiUrl}/posts?_status=500')

// 3. Combined Delay & 404 Not Found
fetch('${publicApiUrl}/users/999?_delay=2000&_status=404')`;

  const headerSample = `// Clean Header-Based Simulation
fetch('${publicApiUrl}/posts', {
  headers: {
    'X-Simulate-Delay': '2000', // 2-second delay
    'X-Simulate-Status': '503', // 503 Service Unavailable
  },
})`;

  const jsonLdArticle = getDocArticleSchema({
    title: 'Network & Chaos Simulation — Playground API',
    description: 'Simulate artificial network latency and HTTP error boundaries in Playground API.',
    url: `${siteConfig.url}/docs/simulation`,
  });

  const jsonLdBreadcrumbs = getBreadcrumbSchema([
    { name: 'Home', url: siteConfig.url },
    { name: 'Docs', url: `${siteConfig.url}/docs` },
    { name: 'Simulation', url: `${siteConfig.url}/docs/simulation` },
  ]);

  return (
    <div className="space-y-10 w-full max-w-none text-text-primary">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdArticle) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumbs) }}
      />

      {/* 1. Header */}
      <div id="overview" className="space-y-2 scroll-mt-20">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-text-primary">
          Network Delay & Error Simulation
        </h1>
        <p className="text-base text-text-secondary leading-relaxed">
          Test frontend loading skeletons, spinner UI transitions, and React error boundaries by simulating network conditions with zero backend changes.
        </p>
      </div>

      {/* 2. Latency Simulation */}
      <div id="delay-simulation" className="space-y-3 pt-6 border-t border-border-theme scroll-mt-20">
        <h2 className="text-xl font-bold text-text-primary">
          Query Parameter Simulation
        </h2>
        <p className="text-sm text-text-secondary leading-relaxed">
          Append <code className="font-mono text-xs">?_delay=ms</code> (up to 5000ms) or <code className="font-mono text-xs">?_status=code</code> (400-599):
        </p>
        <CodeBlock code={querySample} language="javascript" title="Query Param Simulation" />
      </div>

      {/* 3. Header-Based Simulation */}
      <div id="header-simulation" className="space-y-3 pt-6 border-t border-border-theme scroll-mt-20">
        <h2 className="text-xl font-bold text-text-primary">
          Header-Based Simulation
        </h2>
        <p className="text-sm text-text-secondary leading-relaxed">
          Pass headers for cleaner production-like code in integration test runners:
        </p>
        <CodeBlock code={headerSample} language="javascript" title="Header Simulation" />
      </div>
    </div>
  );
}
