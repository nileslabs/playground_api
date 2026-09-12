import React from 'react';
import type { Metadata } from 'next';
import { CodeBlock } from '@/components/ui/CodeBlock';
import { siteConfig } from '@/config/site';
import { getDocArticleSchema, getBreadcrumbSchema } from '@/lib/json-ld';

export const metadata: Metadata = {
  title: 'HTTP Status Codes & Error Payloads — REST & GraphQL Reference',
  description:
    'Comprehensive reference for Playground API HTTP status codes (200, 201, 204, 400, 401, 403, 404, 429, 500), JSON error schemas, and UI error boundary handling.',
  keywords: [
    'mock api error codes',
    'http status codes reference',
    'rest api error format',
    '429 too many requests simulation',
    'react error boundary testing',
  ],
  alternates: {
    canonical: `${siteConfig.url}/docs/errors`,
  },
  openGraph: {
    title: 'HTTP Status Codes & Error Payloads — Playground API',
    description:
      'Reference guide for HTTP status codes, error payload schemas, and UI error handling with Playground API.',
    url: `${siteConfig.url}/docs/errors`,
    type: 'article',
  },
};

export default function ErrorsPage() {
  const errorJson = `{
  "status": 404,
  "error": "Not Found",
  "message": "Post with ID 999 does not exist in baseline or session overlay.",
  "timestamp": "2026-08-18T00:00:00.000Z"
}`;

  const jsonLdArticle = getDocArticleSchema({
    title: 'HTTP Status Codes & Errors — Playground API',
    description: 'Learn about Playground API HTTP status codes and error responses.',
    url: `${siteConfig.url}/docs/errors`,
  });

  const jsonLdBreadcrumbs = getBreadcrumbSchema([
    { name: 'Home', url: siteConfig.url },
    { name: 'Docs', url: `${siteConfig.url}/docs` },
    { name: 'Errors & Status Codes', url: `${siteConfig.url}/docs/errors` },
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
          HTTP Status Codes & Errors
        </h1>
        <p className="text-base text-text-secondary leading-relaxed">
          Playground API returns standard HTTP status codes and consistent JSON error responses across all REST and custom endpoints.
        </p>
      </div>

      {/* 2. Status Codes Table */}
      <div id="status-codes" className="space-y-3 pt-6 border-t border-border-theme scroll-mt-20">
        <h2 className="text-xl font-bold text-text-primary">
          Supported HTTP Status Codes
        </h2>
        <div className="overflow-x-auto rounded-xl border border-border-theme bg-bg-secondary">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-border-theme bg-bg-tertiary/40 text-text-muted font-semibold">
                <th className="p-3">Status</th>
                <th className="p-3 font-sans">Meaning</th>
                <th className="p-3 font-sans">Trigger Scenario</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-theme text-text-secondary">
              <tr>
                <td className="p-3 font-bold text-emerald-600 dark:text-emerald-400">200 OK</td>
                <td className="p-3 font-sans">Successful request</td>
                <td className="p-3 font-sans">Standard GET, PUT, PATCH responses</td>
              </tr>
              <tr>
                <td className="p-3 font-bold text-emerald-600 dark:text-emerald-400">201 Created</td>
                <td className="p-3 font-sans">Resource created</td>
                <td className="p-3 font-sans">POST /posts, /comments, /todos, etc.</td>
              </tr>
              <tr>
                <td className="p-3 font-bold text-blue-600 dark:text-blue-400">204 No Content</td>
                <td className="p-3 font-sans">Resource deleted</td>
                <td className="p-3 font-sans">DELETE requests</td>
              </tr>
              <tr>
                <td className="p-3 font-bold text-amber-600 dark:text-amber-400">400 Bad Request</td>
                <td className="p-3 font-sans">Invalid payload</td>
                <td className="p-3 font-sans">Missing required fields or invalid JSON</td>
              </tr>
              <tr>
                <td className="p-3 font-bold text-amber-600 dark:text-amber-400">401 Unauthorized</td>
                <td className="p-3 font-sans">Missing token</td>
                <td className="p-3 font-sans">Accessing /auth/me without valid Bearer token</td>
              </tr>
              <tr>
                <td className="p-3 font-bold text-rose-600 dark:text-rose-400">404 Not Found</td>
                <td className="p-3 font-sans">Resource missing</td>
                <td className="p-3 font-sans">Querying non-existent entity ID</td>
              </tr>
              <tr>
                <td className="p-3 font-bold text-purple-600 dark:text-purple-400">429 Too Many Requests</td>
                <td className="p-3 font-sans">Rate limit exceeded</td>
                <td className="p-3 font-sans">Exceeding hourly rate limits or using ?_ratelimit=true</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* 3. Error Payload Example */}
      <div id="error-schema" className="space-y-3 pt-6 border-t border-border-theme scroll-mt-20">
        <h2 className="text-xl font-bold text-text-primary">
          Standard Error Payload Schema
        </h2>
        <p className="text-sm text-text-secondary leading-relaxed">
          Every error response conforms to this consistent JSON structure:
        </p>
        <CodeBlock code={errorJson} language="json" title="404 Error Example" />
      </div>
    </div>
  );
}
