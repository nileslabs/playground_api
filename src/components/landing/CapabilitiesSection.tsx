'use client';

import React from 'react';
import Link from 'next/link';
import { Icon } from '@iconify/react';

export function CapabilitiesSection() {
  const pillars = [
    {
      group: 'BUILD',
      icon: 'ph:wrench-bold',
      color: 'text-emerald-600 dark:text-emerald-400',
      badge: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20',
      items: [
        { name: 'REST Endpoints', href: '/docs/posts' },
        { name: 'GraphQL Gateway', href: '/docs/graphql' },
        { name: 'Stateful CRUD', href: '/docs/introduction' },
        { name: 'Custom Collections', href: '/docs/custom' },
      ],
    },
    {
      group: 'BEHAVE',
      icon: 'ph:cpu-bold',
      color: 'text-blue-600 dark:text-blue-400',
      badge: 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-500/20',
      items: [
        { name: 'Session Persistence', href: '/docs/how-it-works' },
        { name: 'Fake JWT Auth', href: '/docs/auth' },
        { name: 'Relational Routes', href: '/docs/posts' },
        { name: 'Pagination & Search', href: '/docs/filtering' },
      ],
    },
    {
      group: 'BREAK',
      icon: 'ph:warning-circle-bold',
      color: 'text-amber-600 dark:text-amber-400',
      badge: 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-500/20',
      items: [
        { name: 'Network Latency', href: '/docs/simulation' },
        { name: 'HTTP Errors (500/400)', href: '/docs/simulation' },
        { name: 'JWT Expiration Loops', href: '/docs/auth' },
        { name: 'Instant Sandbox Purge', href: '/docs/sandbox' },
      ],
    },
    {
      group: 'SHIP',
      icon: 'ph:rocket-launch-bold',
      color: 'text-purple-600 dark:text-purple-400',
      badge: 'bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-400 border-purple-200 dark:border-purple-500/20',
      items: [
        { name: 'TypeScript SDK', href: '/docs/typescript-sdk' },
        { name: 'OpenAPI 3.0 Specs', href: '/docs/collections/openapi' },
        { name: 'Postman & Bruno Collections', href: '/docs/collections/postman' },
        { name: 'JSON State Snapshots', href: '/docs/export-import' },
      ],
    },
  ];

  return (
    <section className="py-12 sm:py-16 bg-bg-secondary/30 border-b border-border-theme">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Compact Section Header */}
        <div className="text-center space-y-2 max-w-xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-black text-text-primary tracking-tight">
            Four mental models. Zero complexity.
          </h2>
        </div>

        {/* Compact 4-Column Capability Map */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {pillars.map((pillar) => (
            <div
              key={pillar.group}
              className="p-5 rounded-2xl bg-bg-primary border border-border-theme space-y-3.5 shadow-xs"
            >
              {/* Group Name & Icon */}
              <div className="flex items-center justify-between pb-2.5 border-b border-border-theme">
                <span className={`text-base sm:text-lg font-mono font-black tracking-widest ${pillar.color}`}>
                  {pillar.group}
                </span>
              </div>

              {/* Compact Clickable Item List */}
              <ul className="space-y-2 text-xs sm:text-sm font-semibold">
                {pillar.items.map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className="text-text-secondary hover:text-text-primary hover:translate-x-1 transition-all flex items-center justify-between group py-0.5"
                    >
                      <span className="truncate">{item.name}</span>
                      <Icon icon="ph:arrow-right-bold" className="w-3 h-3 text-text-muted opacity-0 group-hover:opacity-100 group-hover:text-accent-primary transition-all shrink-0 ml-1" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

export default CapabilitiesSection;
