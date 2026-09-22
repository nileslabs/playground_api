'use client';

import React from 'react';
import Link from 'next/link';
import { Icon } from '@iconify/react';
import { useLiveCounts } from '@/context/CountsContext';

export function ApiExplorerSection() {
  const { counts } = useLiveCounts();

  const resources = [
    {
      name: 'Users',
      endpoint: 'GET /users',
      description: 'User profiles, addresses, and dynamic SVG avatars.',
      count: `${counts.users || 25} records`,
      href: '/docs/users',
      icon: 'ph:users-bold',
    },
    {
      name: 'Posts',
      endpoint: 'GET /posts',
      description: 'Blog articles with authors and per-session mutations.',
      count: `${counts.posts || 100} records`,
      href: '/docs/posts',
      icon: 'ph:article-bold',
    },
    {
      name: 'Comments',
      endpoint: 'GET /comments',
      description: 'Threaded discussion comments linked to post IDs.',
      count: `${counts.comments || 300} records`,
      href: '/docs/comments',
      icon: 'ph:chats-circle-bold',
    },
    {
      name: 'Todos',
      endpoint: 'GET /todos',
      description: 'Task checklists with boolean completion flags.',
      count: `${counts.todos || 125} records`,
      href: '/docs/todos',
      icon: 'ph:check-square-bold',
    },
    {
      name: 'Authentication',
      endpoint: 'POST /auth/login',
      description: 'Fake JWT authentication simulation with Bearer loops.',
      count: 'JWT Loops',
      href: '/docs/auth',
      icon: 'ph:lock-key-bold',
    },
    {
      name: 'Custom Collections',
      endpoint: 'ANY /custom/:resource',
      description: 'Dynamic mock tables with instant private persistence.',
      count: 'Dynamic',
      href: '/docs/custom',
      icon: 'ph:plus-circle-bold',
    },
  ];

  return (
    <section className="py-16 sm:py-20 bg-bg-primary border-b border-border-theme">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Section Header */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-black text-text-primary tracking-tight">
            Explore the API
          </h2>
          <p className="text-base text-text-secondary">
            Pre-seeded relational datasets ready for instant queries and mutations.
          </p>
        </div>

        {/* 6 Concise Resource Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {resources.map((res) => (
            <Link
              key={res.name}
              href={res.href}
              className="p-5 sm:p-6 rounded-2xl bg-bg-secondary hover:bg-bg-tertiary/80 border border-border-theme hover:border-accent-primary/50 transition-all flex flex-col justify-between space-y-4 group shadow-xs hover:shadow-md"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-accent-light text-accent-primary group-hover:scale-105 transition-transform">
                      <Icon icon={res.icon} className="w-4 h-4" />
                    </div>
                    <span className="font-bold text-lg text-text-primary group-hover:text-accent-primary transition-colors">
                      {res.name}
                    </span>
                  </div>
                  <span className="text-xs font-mono font-semibold px-2.5 py-0.5 rounded-full bg-bg-primary text-text-muted border border-border-theme">
                    {res.count}
                  </span>
                </div>

                <div className="font-mono text-xs font-bold text-accent-primary bg-bg-primary px-2.5 py-1 rounded-lg border border-border-theme/70 w-fit">
                  {res.endpoint}
                </div>

                <p className="text-sm text-text-secondary leading-normal">
                  {res.description}
                </p>
              </div>

              <div className="pt-2 border-t border-border-theme/60 flex items-center justify-between text-xs sm:text-sm font-bold text-accent-primary group-hover:underline">
                <span>Explore {res.name}</span>
                <Icon icon="ph:arrow-right-bold" className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
}

export default ApiExplorerSection;
