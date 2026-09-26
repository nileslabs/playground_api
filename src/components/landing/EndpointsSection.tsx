'use client';

import React, { useState } from 'react';
import Link from 'next/link';

interface ResourceItem {
  method: 'GET' | 'POST' | 'ALL';
  path: string;
  countBadge: string;
  description: string;
  linkUrl: string;
}

const resources: ResourceItem[] = [
  {
    method: 'ALL',
    path: '/api/v1/posts',
    countBadge: '100 posts',
    description: 'Blog posts with user relations, pagination, search (?q=) and full CRUD.',
    linkUrl: 'https://playground.nileslabs.com/api/v1/posts',
  },
  {
    method: 'ALL',
    path: '/api/v1/comments',
    countBadge: '500 comments',
    description: 'Post comments with post_id relations, email authors and search.',
    linkUrl: 'https://playground.nileslabs.com/api/v1/comments',
  },
  {
    method: 'ALL',
    path: '/api/v1/users',
    countBadge: '10 users',
    description: 'User profiles with address, company, nested geo and avatar SVGs.',
    linkUrl: 'https://playground.nileslabs.com/api/v1/users',
  },
  {
    method: 'ALL',
    path: '/api/v1/todos',
    countBadge: '200 todos',
    description: 'Checklist tasks with completed boolean filters and user_id filtering.',
    linkUrl: 'https://playground.nileslabs.com/api/v1/todos',
  },
  {
    method: 'POST',
    path: '/api/v1/graphql',
    countBadge: 'GraphQL',
    description: 'Unified GraphQL gateway supporting queries, mutations and introspection.',
    linkUrl: 'https://playground.nileslabs.com/api/v1/graphql',
  },
  {
    method: 'POST',
    path: '/api/v1/auth/login',
    countBadge: 'JWT Auth',
    description: 'Returns realistic JWT access and refresh tokens with Bearer profile.',
    linkUrl: 'https://playground.nileslabs.com/api/v1/auth/login',
  },
  {
    method: 'GET',
    path: '/api/v1/inbox',
    countBadge: 'Virtual Inbox',
    description: 'Real-time virtual inbox capturing simulated signup OTPs and email notifications.',
    linkUrl: 'https://playground.nileslabs.com/api/v1/inbox',
  },
  {
    method: 'POST',
    path: '/api/v1/checkout',
    countBadge: 'Stripe Mock',
    description: 'Simulate e-commerce checkout sessions, line items, and payment intents.',
    linkUrl: 'https://playground.nileslabs.com/api/v1/checkout',
  },
];

export function EndpointsSection() {
  const [copiedPath, setCopiedPath] = useState<string | null>(null);

  const handleCopy = (path: string) => {
    navigator.clipboard.writeText(`https://playground.nileslabs.com${path}`);
    setCopiedPath(path);
    setTimeout(() => setCopiedPath(null), 1800);
  };

  const getMethodBadge = (m: string) => {
    if (m === 'GET') return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    if (m === 'POST') return 'bg-indigo-50 text-indigo-700 border-indigo-200';
    return 'bg-purple-50 text-purple-700 border-purple-200';
  };

  return (
    <section id="resources" className="py-20 md:py-28 bg-slate-50/50 border-b border-slate-200/80">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Section Header */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold uppercase tracking-wider border border-indigo-100">
            Resource Catalog
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">
            Available endpoints & resources
          </h2>
          <p className="text-base sm:text-lg text-slate-600 font-normal leading-relaxed">
            All endpoints support JSON, and core resources also support <code className="font-mono text-xs bg-slate-200/60 px-1 py-0.5 rounded text-slate-800">.csv</code> and <code className="font-mono text-xs bg-slate-200/60 px-1 py-0.5 rounded text-slate-800">.xlsx</code> exports.
          </p>
        </div>

        {/* Endpoints Table Container */}
        <div className="rounded-2xl border border-slate-200 bg-white shadow-xs overflow-hidden">
          <div className="divide-y divide-slate-100">
            {resources.map((r) => {
              const isCopied = copiedPath === r.path;
              return (
                <div
                  key={r.path}
                  className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/80 transition-colors"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                    <div className="flex items-center gap-2">
                      <span
                        className={`font-mono text-[11px] font-bold px-2 py-0.5 rounded border ${getMethodBadge(
                          r.method
                        )}`}
                      >
                        {r.method}
                      </span>
                      <Link
                        href={r.linkUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-mono text-sm font-semibold text-slate-900 hover:text-indigo-600 transition-colors underline-offset-2 hover:underline"
                      >
                        {r.path}
                      </Link>
                    </div>

                    <span className="hidden sm:inline text-slate-300">•</span>

                    <span className="text-xs text-slate-500 font-medium">
                      {r.description}
                    </span>
                  </div>

                  <div className="flex items-center gap-2.5 shrink-0 self-end sm:self-center">
                    <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                      {r.countBadge}
                    </span>

                    <button
                      type="button"
                      onClick={() => handleCopy(r.path)}
                      className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                      title="Copy full URL"
                    >
                      {isCopied ? (
                        <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                      )}
                    </button>

                    <Link
                      href={r.linkUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg border border-indigo-100 transition-colors"
                    >
                      <span>Open JSON</span>
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
