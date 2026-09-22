'use client';

import React from 'react';
import Link from 'next/link';
import { Icon } from '@iconify/react';

export function DeveloperToolkitSection() {
  const tools = [
    {
      title: 'GraphQL Gateway',
      description: 'In-browser GraphiQL IDE to test queries and mutations.',
      icon: 'simple-icons:graphql',
      iconColor: 'text-[#e10098]',
      href: '/docs/graphql',
    },
    {
      title: 'OpenAPI 3.0 Specs',
      description: 'Standard schema to generate typed client models and Swagger docs.',
      icon: 'simple-icons:openapiinitiative',
      iconColor: 'text-emerald-600 dark:text-emerald-400',
      href: '/docs/collections/openapi',
    },
    {
      title: 'Postman & Bruno',
      description: '1-click importable collections with pre-configured assertions.',
      icon: 'simple-icons:postman',
      iconColor: 'text-[#ff6c37]',
      href: '/docs/collections/postman',
    },
    {
      title: 'TypeScript SDK',
      description: 'Zero-dependency typed client library for React, Vue, and Node.',
      icon: 'simple-icons:typescript',
      iconColor: 'text-[#3178c6]',
      href: '/docs/typescript-sdk',
    },
    {
      title: 'Sandbox Snapshots',
      description: 'Export and restore your full private sandbox as portable JSON.',
      icon: 'ph:file-arrow-down-bold',
      iconColor: 'text-purple-600 dark:text-purple-400',
      href: '/docs/export-import',
    },
    {
      title: 'Webhooks Dispatcher',
      description: 'Dispatch real outgoing webhook payloads with HMAC signatures.',
      icon: 'ph:webhooks-logo-bold',
      iconColor: 'text-indigo-600 dark:text-indigo-400',
      href: '/docs/webhooks',
    },
  ];

  return (
    <section className="py-14 sm:py-18 bg-bg-primary border-b border-border-theme">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-9">
        
        {/* Compact Section Header */}
        <div className="text-center space-y-2 max-w-xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-black text-text-primary tracking-tight">
            Developer Toolkit
          </h2>
          <p className="text-sm sm:text-base text-text-secondary">
            Utilities and schemas designed to plug directly into your workflow.
          </p>
        </div>

        {/* Compact 6-Item Grid (Takes ~50% previous height) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {tools.map((tool) => (
            <Link
              key={tool.title}
              href={tool.href}
              className="p-4 sm:p-5 rounded-xl bg-bg-secondary hover:bg-bg-tertiary border border-border-theme hover:border-accent-primary/50 transition-all flex items-center justify-between gap-3 group shadow-2xs hover:shadow-xs"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="p-2 rounded-lg bg-bg-primary border border-border-theme shrink-0 group-hover:scale-105 transition-transform">
                  <Icon icon={tool.icon} className={`w-5 h-5 ${tool.iconColor}`} />
                </div>
                <div className="min-w-0">
                  <h3 className="font-bold text-sm sm:text-base text-text-primary group-hover:text-accent-primary transition-colors truncate">
                    {tool.title}
                  </h3>
                  <p className="text-xs text-text-secondary truncate mt-0.5">
                    {tool.description}
                  </p>
                </div>
              </div>

              <Icon icon="ph:arrow-right-bold" className="w-4 h-4 text-text-muted group-hover:text-accent-primary group-hover:translate-x-1 transition-all shrink-0" />
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
}

export default DeveloperToolkitSection;
