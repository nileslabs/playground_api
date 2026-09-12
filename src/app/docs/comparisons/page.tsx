import React from 'react';
import type { Metadata } from 'next';
import { Icon } from '@iconify/react';
import { siteConfig } from '@/config/site';
import { getDocArticleSchema, getBreadcrumbSchema } from '@/lib/json-ld';

export const metadata: Metadata = {
  title: 'Playground API vs Alternatives — JSONPlaceholder, DummyJSON, Mockoon Comparison',
  description:
    'In-depth architectural comparison: Playground API vs JSONPlaceholder, DummyJSON, json-server, Platzi Fake API, and Mockoon. Discover why virtual mutation overlays provide the ultimate mock developer experience.',
  keywords: [
    'jsonplaceholder alternative',
    'dummyjson alternative',
    'platzi fake api alternative',
    'json-server alternative',
    'mockoon alternative',
    'best mock api for react',
    'stateful fake rest api',
  ],
  alternates: {
    canonical: `${siteConfig.url}/docs/comparisons`,
  },
  openGraph: {
    title: 'Playground API vs Alternatives — Mock API Comparison',
    description:
      'Feature-by-feature comparison of Playground API with JSONPlaceholder, DummyJSON, json-server, and Mockoon.',
    url: `${siteConfig.url}/docs/comparisons`,
    type: 'article',
  },
};

export default function ComparisonsPage() {
  const comparisonMatrix = [
    {
      feature: 'Stateful CRUD Persistence',
      playground: 'Yes (Per-Session Overlay)',
      jsonplaceholder: 'No (Static Dummy Return)',
      dummyjson: 'No (Static Dummy Return)',
      jsonServer: 'Yes (Local disk / file)',
    },
    {
      feature: 'Multi-User Collision Isolation',
      playground: 'Yes (Isolated Sandboxes)',
      jsonplaceholder: 'No persistence',
      dummyjson: 'No persistence',
      jsonServer: 'No (Shared local file)',
    },
    {
      feature: 'GraphQL Gateway & IDE',
      playground: 'Yes (/api/v1/graphql)',
      jsonplaceholder: 'No',
      dummyjson: 'No',
      jsonServer: 'No (Requires plugin)',
    },
    {
      feature: 'Artificial Latency Simulation',
      playground: 'Yes (?_delay=1500)',
      jsonplaceholder: 'No',
      dummyjson: 'Yes (?delay=1000)',
      jsonServer: 'CLI flag only',
    },
    {
      feature: 'HTTP Error Simulation',
      playground: 'Yes (?_status=500)',
      jsonplaceholder: 'No',
      dummyjson: 'No',
      jsonServer: 'No',
    },
    {
      feature: 'JWT Auth & Protected Routes',
      playground: 'Yes (/auth/login & /auth/me)',
      jsonplaceholder: 'No',
      dummyjson: 'Yes (Static tokens)',
      jsonServer: 'Requires middleware',
    },
    {
      feature: 'Custom Schema-less Collections',
      playground: 'Yes (/custom/:name)',
      jsonplaceholder: 'No',
      dummyjson: 'No',
      jsonServer: 'Yes (Predefined schema)',
    },
    {
      feature: 'Deterministic SVG Avatars',
      playground: 'Yes (/avatars/:seed)',
      jsonplaceholder: 'No',
      dummyjson: 'External static URLs',
      jsonServer: 'No',
    },
    {
      feature: 'Session Snapshot Import/Export',
      playground: 'Yes (JSON Snapshots)',
      jsonplaceholder: 'No',
      dummyjson: 'No',
      jsonServer: 'Manual file copy',
    },
    {
      feature: 'Zero Installation & Hosting',
      playground: 'Yes (Cloud SaaS)',
      jsonplaceholder: 'Yes',
      dummyjson: 'Yes',
      jsonServer: 'No (Requires Node.js runtime)',
    },
  ];

  const jsonLdArticle = getDocArticleSchema({
    title: 'Playground API vs Alternatives Comparison',
    description: 'Detailed feature comparison between Playground API and other mock API tools.',
    url: `${siteConfig.url}/docs/comparisons`,
  });

  const jsonLdBreadcrumbs = getBreadcrumbSchema([
    { name: 'Home', url: siteConfig.url },
    { name: 'Docs', url: `${siteConfig.url}/docs` },
    { name: 'Comparisons', url: `${siteConfig.url}/docs/comparisons` },
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
          Playground API vs Alternatives
        </h1>
        <p className="text-base text-text-secondary leading-relaxed">
          An objective architectural comparison between Playground API, JSONPlaceholder, DummyJSON, json-server, and Mockoon.
        </p>
      </div>

      {/* 2. Feature Matrix Table */}
      <div id="matrix" className="space-y-3 pt-6 border-t border-border-theme scroll-mt-20">
        <h2 className="text-xl font-bold text-text-primary">
          Feature Matrix
        </h2>
        <div className="overflow-x-auto rounded-xl border border-border-theme bg-bg-secondary">
          <table className="w-full text-left text-xs font-sans">
            <thead>
              <tr className="border-b border-border-theme bg-bg-tertiary/40 text-text-muted font-semibold">
                <th className="p-3">Feature</th>
                <th className="p-3 text-accent-primary font-bold">Playground API</th>
                <th className="p-3">JSONPlaceholder</th>
                <th className="p-3">DummyJSON</th>
                <th className="p-3">json-server</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-theme text-text-secondary">
              {comparisonMatrix.map((row) => (
                <tr key={row.feature} className="hover:bg-bg-tertiary/20">
                  <td className="p-3 font-medium text-text-primary">{row.feature}</td>
                  <td className="p-3 font-semibold text-emerald-600 dark:text-emerald-400">{row.playground}</td>
                  <td className="p-3">{row.jsonplaceholder}</td>
                  <td className="p-3">{row.dummyjson}</td>
                  <td className="p-3">{row.jsonServer}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
