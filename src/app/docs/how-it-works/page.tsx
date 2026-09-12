import React from 'react';
import type { Metadata } from 'next';
import { CodeBlock } from '@/components/ui/CodeBlock';
import config from '@/config/env';
import { siteConfig } from '@/config/site';
import { getDocArticleSchema, getBreadcrumbSchema } from '@/lib/json-ld';

export const metadata: Metadata = {
  title: 'How Sandboxing Works — Per-Session Virtual Mutation Overlays',
  description:
    'Deep-dive into the Playground API architecture: Read-time virtual overlay engine, session cookie auto-recovery, HMAC signed identity, and non-colliding mutation isolation.',
  keywords: [
    'mock api architecture',
    'stateful sandbox design',
    'virtual mutation overlay',
    'session isolation api',
    'x-playground-identity header',
  ],
  alternates: {
    canonical: `${siteConfig.url}/docs/how-it-works`,
  },
  openGraph: {
    title: 'How Sandboxing Works — Playground API Architecture',
    description:
      'Learn how virtual mutation overlays allow persistent state in a mock REST and GraphQL API without mutating shared datasets or requiring logins.',
    url: `${siteConfig.url}/docs/how-it-works`,
    type: 'article',
  },
};

export default function HowItWorksPage() {
  const publicApiUrl = config.publicApiUrl || 'https://playground.nileslabs.com/api/v1';

  const headerSample = `// Header Identification for Mobile / CI Test Runs
fetch('${publicApiUrl}/posts', {
  headers: {
    'X-Playground-Identity': 'test-run-session-id',
  },
});`;

  const jsonLdArticle = getDocArticleSchema({
    title: 'How Sandboxing Works — Playground API Architecture',
    description: 'Learn how virtual mutation overlays provide persistent per-session mocking.',
    url: `${siteConfig.url}/docs/how-it-works`,
  });

  const jsonLdBreadcrumbs = getBreadcrumbSchema([
    { name: 'Home', url: siteConfig.url },
    { name: 'Docs', url: `${siteConfig.url}/docs` },
    { name: 'How Sandboxing Works', url: `${siteConfig.url}/docs/how-it-works` },
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
          How Sandboxing Works
        </h1>
        <p className="text-base text-text-secondary leading-relaxed">
          Learn how Playground API isolates mutations to your private session while preserving pristine baseline data for all users.
        </p>
      </div>

      {/* 2. Architecture */}
      <div id="overlay-engine" className="space-y-3 pt-6 border-t border-border-theme scroll-mt-20">
        <h2 className="text-xl font-bold text-text-primary">
          The Overlay Merging Engine
        </h2>
        <p className="text-sm text-text-secondary leading-relaxed">
          Playground API utilizes a read-time virtual overlay engine:
        </p>
        <ul className="space-y-2 text-sm text-text-secondary list-disc pl-5 leading-relaxed">
          <li><strong>Layer 1 (Baseline Seed):</strong> Read-only global dataset shared by all users.</li>
          <li><strong>Layer 2 (Private Overlay):</strong> Your POST creates, PUT updates, and DELETE removals stored against your session ID.</li>
          <li><strong>Layer 3 (Merged Output):</strong> When you call <code className="font-mono text-accent-primary">GET /posts</code>, the server overlays your changes onto the seed data dynamically.</li>
        </ul>
      </div>

      {/* 3. Session Identification */}
      <div id="identity" className="space-y-3 pt-6 border-t border-border-theme scroll-mt-20">
        <h2 className="text-xl font-bold text-text-primary">
          Session Identification
        </h2>
        <p className="text-sm text-text-secondary leading-relaxed">
          Your session is identified using two flexible mechanisms:
        </p>
        <ul className="space-y-2 text-sm text-text-secondary list-disc pl-5 leading-relaxed">
          <li><strong>HTTP Cookies (Browser):</strong> Automatically managed via <code className="font-mono text-xs">pg_identity</code> signed cookie with <code className="font-mono text-xs">credentials: &apos;include&apos;</code>.</li>
          <li><strong>X-Playground-Identity Header (Mobile/CI):</strong> Explicitly pass any custom session string for isolated automated test runs.</li>
        </ul>
        <CodeBlock code={headerSample} language="javascript" title="Custom Header Example" />
      </div>

      {/* 4. TTL & Cleanup */}
      <div id="lifecycle" className="space-y-3 pt-6 border-t border-border-theme scroll-mt-20">
        <h2 className="text-xl font-bold text-text-primary">
          Sandbox Lifecycle & Reset
        </h2>
        <p className="text-sm text-text-secondary leading-relaxed">
          Sessions expire automatically after <strong>10 days</strong> of inactivity. You can also manually purge your sandbox at any time via <code className="font-mono text-accent-primary">DELETE /session/reset</code>.
        </p>
      </div>
    </div>
  );
}
