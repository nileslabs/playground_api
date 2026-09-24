'use client';

import React from 'react';
import Link from 'next/link';
import { Icon } from '@iconify/react';
import { apiCatalog } from '@/config/api-catalog';
import { useLiveCounts } from '@/context/CountsContext';

export function ResourceGrid() {
  const { counts } = useLiveCounts();

  const getDynamicBadge = (resId: string, defaultCount: number | string) => {
    if (resId === 'posts') return `${counts.posts} items`;
    if (resId === 'comments') return `${counts.comments} items`;
    if (resId === 'users') return `${counts.users} items`;
    if (resId === 'todos') return `${counts.todos} items`;
    if (resId === 'custom' && typeof counts.custom === 'number' && counts.custom > 0) {
      return `${counts.custom} items`;
    }
    return typeof defaultCount === 'number' ? `${defaultCount} items` : String(defaultCount);
  };

  return (
    <section className="py-20 lg:py-28 bg-bg-canvas border-b border-border-default">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-primary/10 border border-brand-primary/20 text-brand-primary text-xs font-semibold tracking-wide">
            <Icon icon="ph:database-bold" className="w-3.5 h-3.5" />
            <span>Available Mock Datasets</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-text-primary tracking-tight">
            Explore Built-in Mock Datasets
          </h2>
          <p className="text-sm sm:text-base text-text-secondary leading-relaxed">
            Ready-to-use resources with full pagination, filtering, full-text search, and relational child routes.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {apiCatalog.map((res) => {
            const badgeText = getDynamicBadge(res.id, res.itemCount);

            return (
              <Link
                key={res.id}
                href={`/docs/${res.id}`}
                className="p-6 rounded-3xl bg-bg-surface/70 border border-border-default hover:border-brand-primary/50 transition-all duration-300 space-y-4 group block shadow-sm hover:shadow-xl hover:-translate-y-1"
              >
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-2xl bg-brand-primary/10 border border-brand-primary/20 text-brand-primary flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Icon icon={res.icon} className="w-5 h-5" />
                  </div>
                  <span className="text-xs sm:text-sm font-mono font-semibold px-2.5 py-1 rounded-full bg-bg-elevated text-brand-primary border border-border-subtle flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    <span>{badgeText}</span>
                  </span>
                </div>

                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-text-primary group-hover:text-brand-primary transition-colors flex items-center gap-1.5">
                    <span>{res.name}</span>
                    <Icon icon="ph:arrow-right-bold" className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity text-brand-primary" />
                  </h3>
                  <p className="text-sm text-text-secondary mt-1.5 leading-relaxed">{res.description}</p>
                </div>

                <div className="pt-3 border-t border-border-subtle flex items-center justify-between text-xs font-mono text-text-muted">
                  <span>{res.endpoints.length} Endpoints</span>
                  <span className="text-brand-primary font-semibold">/api/v1/{res.id}</span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default ResourceGrid;
