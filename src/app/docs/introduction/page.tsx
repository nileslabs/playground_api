import React from 'react';
import type { Metadata } from 'next';
import config from '@/config/env';
import { siteConfig } from '@/config/site';
import { getDocArticleSchema, getBreadcrumbSchema } from '@/lib/json-ld';

export const metadata: Metadata = {
  title: 'Introduction & Key Features — Stateful Mock REST & GraphQL Sandbox',
  description:
    'Overview of Playground API: A free, zero-configuration mock REST and GraphQL backend sandbox with persistent per-visitor CRUD mutations, latency simulation, and JWT auth.',
  keywords: [
    'mock api introduction',
    'stateful mock rest api',
    'mock graphql api gateway',
    'jsonplaceholder alternative with persistence',
    'fake rest api features',
    'zero config mock backend',
  ],
  alternates: {
    canonical: `${siteConfig.url}/docs/introduction`,
  },
  openGraph: {
    title: 'Introduction & Key Features — Playground API',
    description:
      'Explore Playground API: Zero-config stateful mock REST & GraphQL API sandbox with mutation persistence, JWT auth, custom collections, and latency simulation.',
    url: `${siteConfig.url}/docs/introduction`,
    type: 'article',
  },
};

export default function IntroductionPage() {
  const publicApiUrl = config.publicApiUrl || 'https://playground.nileslabs.com/api/v1';

  const keyFeatures = [
    {
      title: 'Complete CRUD Operations',
      desc: 'Create, read, update, and delete resources with persistent sandbox overlay state.',
    },
    {
      title: 'Standard REST API',
      desc: 'Standard RESTful endpoints for all resources (/posts, /comments, /users, /todos).',
    },
    {
      title: 'GraphQL Gateway Support',
      desc: 'Modern GraphQL schema and interactive GraphiQL IDE at /api/v1/graphql.',
    },
    {
      title: 'Built-in Pagination & Sorting',
      desc: 'Built-in ?_page=1&_limit=10 and ?_sort=title&_order=desc parameters for infinite scroll.',
    },
    {
      title: 'Fake JWT Authentication',
      desc: 'Secure token simulation with access and refresh tokens via /auth/login and /auth/me.',
    },
    {
      title: 'Network & Chaos Simulation',
      desc: 'Test UI loading skeletons (?_delay=1500) and error boundaries (?_status=500).',
    },
    {
      title: 'Dynamic Custom Collections',
      desc: 'Create arbitrary schema-less collections on the fly (/custom/products, /custom/orders).',
    },
    {
      title: 'Universal Full-Text Search',
      desc: 'Search keywords across titles and body contents using ?q=keyword.',
    },
    {
      title: 'Deterministic SVG Avatars',
      desc: 'Vector user avatars and thumbnail placeholders dynamically generated via /avatars/:seed.',
    },
    {
      title: 'Snapshot Export & Import',
      desc: 'Download sandbox state as a JSON file or restore snapshots for automated E2E tests.',
    },
    {
      title: 'Ready-to-Use Client Collections',
      desc: 'OpenAPI 3.0, Postman, Bruno, Insomnia, and TypeScript .d.ts downloads included.',
    },
  ];

  const jsonLdArticle = getDocArticleSchema({
    title: 'Introduction & Key Features — Playground API',
    description:
      'Learn about Playground API, a stateful mock REST & GraphQL API sandbox for frontend developers and AI coding agents.',
    url: `${siteConfig.url}/docs/introduction`,
  });

  const jsonLdBreadcrumbs = getBreadcrumbSchema([
    { name: 'Home', url: siteConfig.url },
    { name: 'Docs', url: `${siteConfig.url}/docs` },
    { name: 'Introduction', url: `${siteConfig.url}/docs/introduction` },
  ]);

  return (
    <div className="space-y-12 w-full max-w-none text-text-primary">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdArticle) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumbs) }}
      />

      {/* 1. Page Title */}
      <div id="overview" className="space-y-3 scroll-mt-20">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-text-primary">
          Key Features
        </h1>
        <p className="text-base text-text-secondary leading-relaxed">
          Playground API offers a comprehensive, zero-setup mock backend for web & mobile development:
        </p>
      </div>

      {/* 2. Base Endpoint Box */}
      <div className="p-5 rounded-2xl bg-bg-secondary dark:bg-code-bg border border-border-theme space-y-2">
        <div className="flex items-center justify-between text-xs text-text-muted font-semibold uppercase tracking-wider">
          <span>Base API URL (v1)</span>
          <span className="text-emerald-700 dark:text-emerald-400 font-mono font-bold">No API Key Required</span>
        </div>
        <div className="font-mono text-sm sm:text-base text-emerald-700 dark:text-emerald-400 font-bold select-all">
          {publicApiUrl}
        </div>
      </div>

      {/* 3. Checklist */}
      <div id="features" className="space-y-4 scroll-mt-20">
        <ul className="space-y-3 text-sm sm:text-base">
          {keyFeatures.map((item) => (
            <li key={item.title} className="flex items-start gap-3 text-text-secondary">
              <span className="text-emerald-600 dark:text-emerald-400 text-lg leading-none shrink-0 mt-0.5">✅</span>
              <div>
                <strong className="text-text-primary font-semibold">{item.title}</strong>
                <span className="text-text-secondary"> — {item.desc}</span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
