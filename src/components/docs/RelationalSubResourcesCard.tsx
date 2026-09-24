'use client';

import React from 'react';
import Link from 'next/link';
import { Icon } from '@iconify/react';
import config from '@/config/env';

interface SubResourceRoute {
  method: 'GET' | 'POST';
  path: string;
  title: string;
  description: string;
  targetDocHref?: string;
}

const RELATIONAL_MAP: Record<string, SubResourceRoute[]> = {
  posts: [
    {
      method: 'GET',
      path: '/posts/1/comments',
      title: 'Nested Post Comments',
      description: 'Retrieve all comments directly associated with post #1 via foreign key relationship.',
      targetDocHref: '/docs/comments',
    },
    {
      method: 'GET',
      path: '/comments?post_id=1',
      title: 'Filter Comments by Post ID',
      description: 'Alternative query-param based approach to retrieve comments for a specific post.',
      targetDocHref: '/docs/comments',
    },
  ],
  users: [
    {
      method: 'GET',
      path: '/users/1/posts',
      title: 'User Authored Posts',
      description: 'Retrieve all blog articles and posts created by user #1.',
      targetDocHref: '/docs/posts',
    },
    {
      method: 'GET',
      path: '/users/1/todos',
      title: 'User Todo Tasks',
      description: 'Retrieve all pending and completed checklist items assigned to user #1.',
      targetDocHref: '/docs/todos',
    },
    {
      method: 'GET',
      path: '/users/1/carts',
      title: 'User Shopping Cart',
      description: 'Retrieve active e-commerce shopping carts belonging to user #1.',
    },
  ],
  comments: [
    {
      method: 'GET',
      path: '/posts/1/comments',
      title: 'Comments Under Post',
      description: 'Access comments through the hierarchical post route.',
      targetDocHref: '/docs/posts',
    },
    {
      method: 'GET',
      path: '/comments?post_id=1',
      title: 'Query Filter by Post',
      description: 'Filter comment records using the post_id query parameter.',
    },
  ],
  todos: [
    {
      method: 'GET',
      path: '/users/1/todos',
      title: 'Nested User Todos',
      description: 'Access todos owned by a specific user via the parent user entity.',
      targetDocHref: '/docs/users',
    },
    {
      method: 'GET',
      path: '/todos?user_id=1',
      title: 'Filter by User ID',
      description: 'Filter checklist items by user foreign key query parameter.',
    },
  ],
};

interface RelationalSubResourcesCardProps {
  resource: string;
}

export function RelationalSubResourcesCard({ resource }: RelationalSubResourcesCardProps) {
  const routes = RELATIONAL_MAP[resource];

  if (!routes || routes.length === 0) {
    return null;
  }

  const baseApi = config.apiUrl || '/api/v1';

  return (
    <div className="rounded-2xl border border-indigo-500/25 bg-bg-surface/80 p-5 space-y-4 shadow-sm relative overflow-hidden">
      <div className="flex items-center justify-between pb-3 border-b border-border-subtle">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-indigo-500/15 text-indigo-400 flex items-center justify-center">
            <Icon icon="ph:tree-structure-bold" className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-text-primary">
              Relational Sub-Resource Routes
            </h3>
            <p className="text-xs text-text-secondary">
              Direct hierarchical routes linking {resource} with associated child and parent resources
            </p>
          </div>
        </div>

        <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
          Foreign Key Joins
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {routes.map((r, idx) => {
          const fullRawUrl = `${baseApi}${r.path}`;

          return (
            <div
              key={idx}
              className="p-3 rounded-xl border border-border-default bg-bg-canvas hover:border-brand-primary/40 transition-colors flex flex-col justify-between gap-2"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-1.5">
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/20">
                      {r.method}
                    </span>
                    <span className="font-mono text-xs font-semibold text-text-primary">
                      {r.path}
                    </span>
                  </div>

                  <a
                    href={fullRawUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] font-mono text-brand-primary hover:underline flex items-center gap-1 shrink-0"
                    title="Open live JSON"
                  >
                    <span>Raw JSON</span>
                    <Icon icon="ph:arrow-square-out-bold" className="w-3 h-3" />
                  </a>
                </div>

                <p className="text-xs text-text-secondary leading-relaxed">
                  {r.description}
                </p>
              </div>

              {r.targetDocHref && (
                <div className="pt-2 border-t border-border-subtle/60 flex items-center justify-between text-[11px]">
                  <Link
                    href={r.targetDocHref}
                    className="text-text-muted hover:text-brand-primary transition-colors flex items-center gap-1"
                  >
                    <span>View {r.title} Documentation</span>
                    <Icon icon="ph:arrow-right-bold" className="w-3 h-3" />
                  </Link>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default RelationalSubResourcesCard;
