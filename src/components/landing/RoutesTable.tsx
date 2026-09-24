'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Icon } from '@iconify/react';
import { useLiveCounts } from '@/context/CountsContext';
import config from '@/config/env';

export interface RouteEntry {
  id: string;
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  path: string;
  countKey?: string;
  defaultCount?: string;
  description: string;
  category: 'core' | 'relational' | 'auth' | 'simulation';
  docsHref: string;
}

const ROUTES_DATA: RouteEntry[] = [
  // Core Resources
  {
    id: 'get-posts',
    method: 'GET',
    path: '/posts',
    countKey: 'posts',
    defaultCount: '100 posts',
    description: 'List all blog posts with author metadata and tags',
    category: 'core',
    docsHref: '/docs/posts',
  },
  {
    id: 'get-posts-id',
    method: 'GET',
    path: '/posts/1',
    description: 'Retrieve a single post by ID',
    category: 'core',
    docsHref: '/docs/posts',
  },
  {
    id: 'post-posts',
    method: 'POST',
    path: '/posts',
    description: 'Create a new post (persists in your private session overlay)',
    category: 'core',
    docsHref: '/docs/posts',
  },
  {
    id: 'put-posts-id',
    method: 'PUT',
    path: '/posts/1',
    description: 'Full update of post #1',
    category: 'core',
    docsHref: '/docs/posts',
  },
  {
    id: 'patch-posts-id',
    method: 'PATCH',
    path: '/posts/1',
    description: 'Partial update of post fields',
    category: 'core',
    docsHref: '/docs/posts',
  },
  {
    id: 'delete-posts-id',
    method: 'DELETE',
    path: '/posts/1',
    description: 'Delete post #1 from session overlay',
    category: 'core',
    docsHref: '/docs/posts',
  },

  // Relational Sub-resources (JSONPlaceholder style)
  {
    id: 'get-post-comments',
    method: 'GET',
    path: '/posts/1/comments',
    description: 'Direct relational sub-resource: all comments for post #1',
    category: 'relational',
    docsHref: '/docs/posts',
  },
  {
    id: 'get-comments-filter',
    method: 'GET',
    path: '/comments?post_id=1',
    description: 'Filter comments by query parameter post_id=1',
    category: 'relational',
    docsHref: '/docs/comments',
  },
  {
    id: 'get-user-posts',
    method: 'GET',
    path: '/users/1/posts',
    description: 'All posts authored by user #1',
    category: 'relational',
    docsHref: '/docs/users',
  },
  {
    id: 'get-user-todos',
    method: 'GET',
    path: '/users/1/todos',
    description: 'All todo checklist items assigned to user #1',
    category: 'relational',
    docsHref: '/docs/users',
  },

  // Other Core Datasets
  {
    id: 'get-comments',
    method: 'GET',
    path: '/comments',
    countKey: 'comments',
    defaultCount: '300 comments',
    description: 'List user comments with email and body',
    category: 'core',
    docsHref: '/docs/comments',
  },
  {
    id: 'get-users',
    method: 'GET',
    path: '/users',
    countKey: 'users',
    defaultCount: '25 users',
    description: 'User profiles with geo coordinates and company details',
    category: 'core',
    docsHref: '/docs/users',
  },
  {
    id: 'get-todos',
    method: 'GET',
    path: '/todos',
    countKey: 'todos',
    defaultCount: '125 todos',
    description: 'Task items with completion boolean flags',
    category: 'core',
    docsHref: '/docs/todos',
  },
  {
    id: 'get-products',
    method: 'GET',
    path: '/products',
    defaultCount: '100 products',
    description: 'E-commerce products with categories, prices, and ratings',
    category: 'core',
    docsHref: '/docs/custom',
  },
  {
    id: 'get-carts',
    method: 'GET',
    path: '/carts',
    defaultCount: '20 carts',
    description: 'Shopping carts with nested item line arrays',
    category: 'core',
    docsHref: '/docs/custom',
  },

  // Auth & Payments
  {
    id: 'post-auth-login',
    method: 'POST',
    path: '/auth/login',
    description: 'Authenticate and receive signed Bearer token',
    category: 'auth',
    docsHref: '/docs/auth',
  },
  {
    id: 'get-auth-me',
    method: 'GET',
    path: '/auth/me',
    description: 'Verify current JWT identity in Authorization header',
    category: 'auth',
    docsHref: '/docs/auth',
  },
  {
    id: 'post-payments-charge',
    method: 'POST',
    path: '/payments/charge',
    description: 'Simulate 3DS credit card charging with card number verification',
    category: 'auth',
    docsHref: '/docs/auth',
  },

  // Simulations
  {
    id: 'get-simulation-delay',
    method: 'GET',
    path: '/posts?_delay=1000',
    description: 'Inject artificial 1-second network latency',
    category: 'simulation',
    docsHref: '/docs/sandbox',
  },
  {
    id: 'get-simulation-status',
    method: 'GET',
    path: '/posts?_status=429',
    description: 'Simulate HTTP 429 Too Many Requests rate-limiting fault',
    category: 'simulation',
    docsHref: '/docs/sandbox',
  },
];

export function RoutesTable() {
  const { counts } = useLiveCounts();
  const [activeTab, setActiveTab] = useState<'all' | 'core' | 'relational' | 'auth' | 'simulation'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedPath, setCopiedPath] = useState<string | null>(null);

  // Compute base API url for direct raw JSON links
  const apiPrefix = config.apiUrl?.startsWith('http')
    ? config.apiUrl
    : `${config.siteUrl || ''}${config.apiUrl || '/api/v1'}`;

  // Filter routes based on tab and search
  const filteredRoutes = useMemo(() => {
    return ROUTES_DATA.filter((route) => {
      const matchesTab = activeTab === 'all' || route.category === activeTab;
      const matchesSearch =
        searchQuery.trim() === '' ||
        route.path.toLowerCase().includes(searchQuery.toLowerCase()) ||
        route.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        route.method.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesTab && matchesSearch;
    });
  }, [activeTab, searchQuery]);

  // Dynamic live count lookup
  const getDynamicCount = (route: RouteEntry) => {
    if (route.countKey && counts[route.countKey as keyof typeof counts]) {
      const val = counts[route.countKey as keyof typeof counts];
      return `${val} items`;
    }
    return route.defaultCount || null;
  };

  const handleCopy = (path: string) => {
    const fullUrl = `${apiPrefix}${path}`;
    navigator.clipboard.writeText(fullUrl);
    setCopiedPath(path);
    setTimeout(() => setCopiedPath(null), 2000);
  };

  const handleTryInConsole = (route: RouteEntry) => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('playground:try-route', {
          detail: {
            endpoint: route.path,
            method: route.method,
          },
        })
      );
    }
  };

  const getMethodBadgeClass = (method: string) => {
    switch (method) {
      case 'GET':
        return 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20';
      case 'POST':
        return 'bg-indigo-500/15 text-indigo-400 border-indigo-500/20';
      case 'PUT':
      case 'PATCH':
        return 'bg-amber-500/15 text-amber-400 border-amber-500/20';
      case 'DELETE':
        return 'bg-rose-500/15 text-rose-400 border-rose-500/20';
      default:
        return 'bg-bg-elevated text-text-secondary border-border-default';
    }
  };

  return (
    <section id="routes-directory" className="py-16 bg-bg-canvas border-b border-border-default">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-2">
              <Icon icon="ph:list-bullets-bold" className="w-4 h-4" />
              <span>JSONPlaceholder & DummyJSON Inspired</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-text-primary tracking-tight">
              Routes & Resources Directory
            </h2>
            <p className="mt-2 text-sm text-text-secondary max-w-2xl leading-relaxed">
              All HTTP methods supported with zero setup. Click any route to open raw JSON, or run it instantly in the console.
            </p>
          </div>

          {/* Quick Search Bar */}
          <div className="relative w-full md:w-72">
            <Icon icon="ph:magnifying-glass-bold" className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter routes (e.g. /comments)..."
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-bg-surface border border-border-default text-xs font-mono text-text-primary placeholder:text-text-muted outline-none focus:border-brand-primary transition-colors"
            />
          </div>
        </div>

        {/* Filter Category Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-4 scrollbar-none border-b border-border-subtle">
          {[
            { id: 'all', label: 'All Routes' },
            { id: 'core', label: 'Core Resources' },
            { id: 'relational', label: 'Relational Sub-resources' },
            { id: 'auth', label: 'Auth & Payments' },
            { id: 'simulation', label: 'Network Chaos & Delay' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer shrink-0 ${
                activeTab === tab.id
                  ? 'bg-brand-primary text-white shadow-sm'
                  : 'bg-bg-surface hover:bg-bg-elevated text-text-secondary hover:text-text-primary border border-border-default'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Routes Directory Table */}
        <div className="rounded-2xl border border-border-default bg-bg-surface shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-bg-elevated/70 border-b border-border-subtle text-[11px] font-mono uppercase tracking-wider text-text-muted">
                  <th className="py-3 px-4 w-24">Method</th>
                  <th className="py-3 px-4">Endpoint Route</th>
                  <th className="py-3 px-4 hidden sm:table-cell">Live Count / Details</th>
                  <th className="py-3 px-4 hidden md:table-cell">Description</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle text-xs">
                {filteredRoutes.map((route) => {
                  const countLabel = getDynamicCount(route);
                  const isCopied = copiedPath === route.path;
                  const rawUrl = `${apiPrefix}${route.path}`;

                  return (
                    <tr
                      key={route.id}
                      className="hover:bg-bg-elevated/40 transition-colors group"
                    >
                      {/* Method Badge */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-[11px] font-mono font-bold border ${getMethodBadgeClass(
                            route.method
                          )}`}
                        >
                          {route.method}
                        </span>
                      </td>

                      {/* Route Path Link to Raw JSON */}
                      <td className="py-3 px-4 whitespace-nowrap font-mono">
                        <a
                          href={rawUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-text-primary hover:text-brand-primary font-medium hover:underline inline-flex items-center gap-1.5 transition-colors"
                          title="Open raw JSON data in new tab"
                        >
                          <span>{route.path}</span>
                          <Icon icon="ph:arrow-square-out-bold" className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 text-brand-primary transition-opacity" />
                        </a>
                      </td>

                      {/* Live Count Pill */}
                      <td className="py-3 px-4 whitespace-nowrap hidden sm:table-cell">
                        {countLabel ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono text-[11px] font-semibold">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                            <span>{countLabel}</span>
                          </span>
                        ) : (
                          <span className="text-text-muted text-[11px] font-mono">—</span>
                        )}
                      </td>

                      {/* Description */}
                      <td className="py-3 px-4 hidden md:table-cell text-text-secondary truncate max-w-xs">
                        {route.description}
                      </td>

                      {/* Action Buttons */}
                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <div className="inline-flex items-center gap-1.5 justify-end">
                          <button
                            onClick={() => handleTryInConsole(route)}
                            className="px-2.5 py-1 rounded-lg bg-brand-primary/10 hover:bg-brand-primary text-brand-primary hover:text-white border border-brand-primary/20 text-[11px] font-semibold transition-all cursor-pointer inline-flex items-center gap-1"
                            title="Run in interactive console above"
                          >
                            <Icon icon="ph:play-bold" className="w-3 h-3" />
                            <span>Try</span>
                          </button>

                          <button
                            onClick={() => handleCopy(route.path)}
                            className="p-1.5 rounded-lg bg-bg-elevated hover:bg-border-default text-text-secondary hover:text-text-primary border border-border-subtle transition-colors cursor-pointer"
                            title="Copy full endpoint URL"
                          >
                            <Icon icon={isCopied ? 'ph:check-bold' : 'ph:copy-bold'} className="w-3.5 h-3.5 text-brand-primary" />
                          </button>

                          <Link
                            href={route.docsHref}
                            className="p-1.5 rounded-lg bg-bg-elevated hover:bg-border-default text-text-secondary hover:text-text-primary border border-border-subtle transition-colors"
                            title="View detailed documentation"
                          >
                            <Icon icon="ph:book-open-bold" className="w-3.5 h-3.5" />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Directory Summary Footer */}
          <div className="p-4 bg-bg-elevated/40 border-t border-border-subtle flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-text-secondary">
            <div className="flex items-center gap-2">
              <Icon icon="ph:info-bold" className="w-4 h-4 text-brand-primary" />
              <span>
                All <strong className="text-text-primary">GET</strong> requests return live database records. <strong className="text-text-primary">POST</strong>, <strong className="text-text-primary">PUT</strong>, and <strong className="text-text-primary">DELETE</strong> persist in your isolated session overlay.
              </span>
            </div>
            <Link
              href="/docs/introduction"
              className="text-brand-primary hover:underline font-semibold inline-flex items-center gap-1 shrink-0"
            >
              <span>Explore Full API Catalog</span>
              <Icon icon="ph:arrow-right-bold" className="w-3 h-3" />
            </Link>
          </div>
        </div>

      </div>
    </section>
  );
}

export default RoutesTable;
