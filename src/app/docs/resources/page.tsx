import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Icon } from '@iconify/react';
import { siteConfig } from '@/config/site';

export const metadata: Metadata = {
  title: 'Core REST Resources & Data Architecture — Playground API',
  description:
    'Explore the foundational mock REST collections: Users, Posts, Comments, and Todos. 825 baseline records with copy-on-write persistence and relational joins.',
  alternates: {
    canonical: `${siteConfig.url}/docs/resources`,
  },
  openGraph: {
    title: 'Core REST Resources & Data Architecture — Playground API',
    description:
      'Explore the foundational mock REST collections: Users, Posts, Comments, and Todos with full CRUD and session overlay isolation.',
    url: `${siteConfig.url}/docs/resources`,
  },
};

const RESOURCES = [
  {
    id: 'users',
    name: 'Users Resource',
    count: '25 Profiles',
    icon: 'ph:users-bold',
    color: 'text-indigo-600 bg-indigo-50 border-indigo-200',
    badge: 'Seed & Custom',
    desc: 'Rich user directory records with nested address geo-coordinates, employer company profiles, contact numbers, and deterministic SVG avatar seeds.',
    endpoints: ['GET /api/v1/users', 'POST /api/v1/users', 'GET /api/v1/users/:id/posts'],
    href: '/docs/resources/users',
  },
  {
    id: 'posts',
    name: 'Posts Resource',
    count: '100 Articles',
    icon: 'ph:newspaper-bold',
    color: 'text-emerald-600 bg-emerald-50 border-emerald-200',
    badge: 'Full-Text Search',
    desc: 'Blog post articles containing headlines and body paragraphs indexed for full-text search (?q=...). Directly linked to author users via user_id foreign keys.',
    endpoints: ['GET /api/v1/posts', 'POST /api/v1/posts', 'GET /api/v1/posts/:id/comments'],
    href: '/docs/resources/posts',
  },
  {
    id: 'comments',
    name: 'Comments Resource',
    count: '500 Comments',
    icon: 'ph:chats-circle-bold',
    color: 'text-sky-600 bg-sky-50 border-sky-200',
    badge: 'Relational Joins',
    desc: 'Community discussion threads attached to blog articles via post_id. Features verified author email addresses and commentary text.',
    endpoints: ['GET /api/v1/comments', 'POST /api/v1/comments', 'GET /api/v1/comments/:id/post'],
    href: '/docs/resources/comments',
  },
  {
    id: 'todos',
    name: 'Todos Resource',
    count: '200 Checklists',
    icon: 'ph:check-square-bold',
    color: 'text-amber-600 bg-amber-50 border-amber-200',
    badge: 'Boolean State',
    desc: 'Task management checklist items with boolean completed flags. Ideal for testing interactive checkboxes, task filtering, and optimistic state updates.',
    endpoints: ['GET /api/v1/todos', 'PATCH /api/v1/todos/:id', 'GET /api/v1/todos?completed=false'],
    href: '/docs/resources/todos',
  },
];

const QUERY_PARAMS = [
  { name: 'page', type: 'integer', defaultVal: '1', desc: '1-indexed page number for offset pagination.' },
  { name: 'limit', type: 'integer', defaultVal: '10', desc: 'Max records returned per page (default: 10, max: 200).' },
  { name: 'cursor', type: 'string', defaultVal: '-', desc: 'Opaque base64 cursor token for infinite-scroll pagination.' },
  { name: 'q', type: 'string', defaultVal: '-', desc: 'Full-text search query across searchable text fields.' },
  { name: '_sort', type: 'string', defaultVal: 'id', desc: 'Property key to sort results by (e.g. name, title, created_at).' },
  { name: '_order', type: 'string', defaultVal: 'asc', desc: 'Sort direction: asc (ascending) or desc (descending).' },
];

export default function ResourcesIndexPage() {
  return (
    <div className="space-y-12 w-full text-slate-900 pb-16">
      {/* 1. Hero Header */}
      <div id="overview" className="space-y-4 scroll-mt-20">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold uppercase tracking-wider border border-indigo-100">
          <Icon icon="ph:database-bold" className="w-3.5 h-3.5" />
          <span>Core REST Architecture</span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-[1.15]">
          Core REST Resources & Data Models
        </h1>

        <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-3xl">
          Four foundational relational collections providing 825 baseline seed fixtures with isolated copy-on-write session persistence, relational sub-resource traversal, and full CRUD simulation.
        </p>

        {/* Global Metrics Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          <div className="p-4 rounded-2xl border border-slate-200 bg-white shadow-2xs space-y-1">
            <span className="text-xs text-slate-500 font-medium">Total Fixtures</span>
            <p className="text-2xl font-extrabold text-slate-900">825</p>
            <span className="text-[11px] text-emerald-600 font-semibold">Ready out of the box</span>
          </div>
          <div className="p-4 rounded-2xl border border-slate-200 bg-white shadow-2xs space-y-1">
            <span className="text-xs text-slate-500 font-medium">Core Collections</span>
            <p className="text-2xl font-extrabold text-slate-900">4</p>
            <span className="text-[11px] text-indigo-600 font-semibold">Users, Posts, Comments, Todos</span>
          </div>
          <div className="p-4 rounded-2xl border border-slate-200 bg-white shadow-2xs space-y-1">
            <span className="text-xs text-slate-500 font-medium">Mutation Mode</span>
            <p className="text-2xl font-extrabold text-slate-900">CoW</p>
            <span className="text-[11px] text-purple-600 font-semibold">Copy-on-write overlay</span>
          </div>
          <div className="p-4 rounded-2xl border border-slate-200 bg-white shadow-2xs space-y-1">
            <span className="text-xs text-slate-500 font-medium">Session Reset</span>
            <p className="text-2xl font-extrabold text-slate-900">&lt;5ms</p>
            <span className="text-[11px] text-amber-600 font-semibold">Instant atomic restore</span>
          </div>
        </div>
      </div>

      {/* 2. Collection Cards Grid */}
      <div id="collections" className="space-y-4 scroll-mt-20">
        <div className="space-y-1">
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
            Foundational REST Collections
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            Click any resource to explore its live data explorer, field dictionary, TypeScript interface, and interactive consoles:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {RESOURCES.map((r) => (
            <Link
              key={r.id}
              href={r.href}
              className="p-6 rounded-2xl border border-slate-200 bg-white hover:border-indigo-400 hover:shadow-xs transition-all group flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${r.color} shadow-2xs`}>
                      <Icon icon={r.icon} className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-base text-slate-900 group-hover:text-indigo-600 transition-colors">
                        {r.name}
                      </h3>
                      <p className="text-xs text-slate-400 font-medium">{r.count}</p>
                    </div>
                  </div>

                  <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold">
                    {r.badge}
                  </span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  {r.desc}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 space-y-1.5">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Common Endpoints:</span>
                <div className="space-y-1">
                  {r.endpoints.map((ep) => (
                    <div key={ep} className="font-mono text-[11px] text-indigo-600 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-100 truncate">
                      {ep}
                    </div>
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* 3. Relational Architecture Diagram */}
      <div id="relational-model" className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-6">
        <div className="border-b border-slate-100 pb-4">
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
            <Icon icon="ph:tree-structure-bold" className="w-5 h-5 text-indigo-600" />
            Entity Relationship Architecture
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            How foundational entities relate through foreign keys and nested sub-resource routing.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-slate-900 text-slate-100 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
            {/* Users Card */}
            <div className="p-4 rounded-xl bg-slate-800/90 border border-slate-700 space-y-2 text-center">
              <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 text-[10px] font-mono font-bold">PRIMARY ENTITY</span>
              <h4 className="text-base font-bold text-white">Users (id: 1..25)</h4>
              <p className="text-xs text-slate-400">Author & Assignee Profile Root</p>
            </div>

            {/* Connecting arrows */}
            <div className="hidden md:flex flex-col items-center justify-center space-y-4 text-slate-400">
              <div className="flex items-center gap-2 text-xs font-mono">
                <span>hasMany (1:N)</span>
                <Icon icon="ph:arrow-right-bold" className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="flex items-center gap-2 text-xs font-mono">
                <span>hasMany (1:N)</span>
                <Icon icon="ph:arrow-right-bold" className="w-4 h-4 text-amber-400" />
              </div>
            </div>

            {/* Posts & Todos Targets */}
            <div className="space-y-3">
              <div className="p-3.5 rounded-xl bg-slate-800/90 border border-slate-700 flex items-center justify-between">
                <div>
                  <h5 className="text-sm font-bold text-emerald-400">Posts (user_id)</h5>
                  <p className="text-[11px] text-slate-400">GET /users/:id/posts</p>
                </div>
                <Icon icon="ph:newspaper-bold" className="w-5 h-5 text-emerald-400" />
              </div>

              <div className="p-3.5 rounded-xl bg-slate-800/90 border border-slate-700 flex items-center justify-between">
                <div>
                  <h5 className="text-sm font-bold text-amber-400">Todos (user_id)</h5>
                  <p className="text-[11px] text-slate-400">GET /users/:id/todos</p>
                </div>
                <Icon icon="ph:check-square-bold" className="w-5 h-5 text-amber-400" />
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <Icon icon="ph:chats-circle-bold" className="w-4 h-4 text-sky-400" />
              <span className="text-slate-300">
                <strong>Comments (post_id)</strong> cascade naturally under Posts: <code className="font-mono text-sky-300">GET /posts/:id/comments</code>
              </span>
            </div>
            <Link
              href="/docs/resources/comments"
              className="text-indigo-400 hover:text-indigo-300 font-semibold underline shrink-0"
            >
              Explore Comments →
            </Link>
          </div>
        </div>
      </div>

      {/* 4. Universal Query Parameters Reference */}
      <div id="query-params" className="space-y-4 scroll-mt-20">
        <div className="space-y-1">
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
            Universal Collection Query Modifiers
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            Standard query string parameters supported across all four collection endpoints:
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-xs">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-semibold">
              <tr>
                <th className="py-3 px-4">Parameter</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Default</th>
                <th className="py-3 px-4">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-600">
              {QUERY_PARAMS.map((p) => (
                <tr key={p.name}>
                  <td className="py-3 px-4 font-mono font-bold text-indigo-600">{p.name}</td>
                  <td className="py-3 px-4 font-mono text-purple-600">{p.type}</td>
                  <td className="py-3 px-4 font-mono text-slate-400">{p.defaultVal}</td>
                  <td className="py-3 px-4">{p.desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 5. Custom Collections Callout */}
      <div className="p-6 rounded-2xl bg-linear-to-r from-indigo-500/10 via-purple-500/10 to-transparent border border-indigo-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1 text-xs font-bold text-indigo-700 uppercase tracking-wider">
            <Icon icon="ph:sparkle-bold" className="w-3.5 h-3.5" />
            Dynamic Schema Capability
          </div>
          <h3 className="text-lg font-bold text-slate-900">Need Custom Entities Beyond Core Resources?</h3>
          <p className="text-xs text-slate-600 max-w-2xl">
            Playground API also supports ad-hoc user-defined collections like <code className="font-mono text-indigo-600">/api/v1/custom/products</code> or <code className="font-mono text-indigo-600">/api/v1/custom/invoices</code> with on-the-fly table creation and spreadsheet export.
          </p>
        </div>

        <Link
          href="/docs/query/custom-resources"
          className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-xs transition-all shrink-0 self-start sm:self-auto flex items-center gap-1.5"
        >
          <span>Explore Custom Collections</span>
          <Icon icon="ph:arrow-right-bold" className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
