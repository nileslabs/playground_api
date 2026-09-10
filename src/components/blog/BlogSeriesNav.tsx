import React from 'react';
import Link from 'next/link';
import { Icon } from '@iconify/react';
import { BlogPostMeta } from '@/lib/blog';

interface BlogSeriesNavProps {
  prev: BlogPostMeta | null;
  next: BlogPostMeta | null;
  series?: string;
  order: number;
}

export function BlogSeriesNav({ prev, next, series, order }: BlogSeriesNavProps) {
  return (
    <div className="space-y-4 pt-8 border-t border-border-theme">
      {series && (
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-text-muted">
            <Icon icon="ph:stack-bold" className="w-4 h-4 text-accent-primary" />
            Series: {series}
          </div>
          <span className="text-xs px-2.5 py-0.5 rounded-full bg-accent-light text-accent-primary border border-accent-primary/20 font-bold">
            Part {order} of 12
          </span>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Previous Post */}
        {prev ? (
          <Link
            href={`/blog/${prev.slug}`}
            className="group flex flex-col justify-between p-4 rounded-xl border border-border-theme bg-bg-secondary/40 hover:bg-bg-secondary hover:border-accent-primary/40 transition-all text-left space-y-2"
          >
            <div className="flex items-center gap-1.5 text-xs text-text-muted">
              <Icon icon="ph:arrow-left-bold" className="w-3.5 h-3.5 text-accent-primary group-hover:-translate-x-1 transition-transform" />
              <span>Previous Article (#{prev.order})</span>
            </div>
            <div className="text-sm font-bold text-text-primary group-hover:text-accent-primary transition-colors line-clamp-2">
              {prev.title}
            </div>
          </Link>
        ) : (
          <div className="p-4 rounded-xl border border-border-theme/30 bg-bg-secondary/20 text-xs text-text-muted flex items-center justify-center">
            First article in this series
          </div>
        )}

        {/* Next Post */}
        {next ? (
          <Link
            href={`/blog/${next.slug}`}
            className="group flex flex-col justify-between p-4 rounded-xl border border-border-theme bg-bg-secondary/40 hover:bg-bg-secondary hover:border-accent-primary/40 transition-all text-right space-y-2"
          >
            <div className="flex items-center justify-end gap-1.5 text-xs text-text-muted">
              <span>Next Article (#{next.order})</span>
              <Icon icon="ph:arrow-right-bold" className="w-3.5 h-3.5 text-accent-primary group-hover:translate-x-1 transition-transform" />
            </div>
            <div className="text-sm font-bold text-text-primary group-hover:text-accent-primary transition-colors line-clamp-2">
              {next.title}
            </div>
          </Link>
        ) : (
          <div className="p-4 rounded-xl border border-border-theme/30 bg-bg-secondary/20 text-xs text-text-muted flex items-center justify-center">
            You reached the end of the series!
          </div>
        )}
      </div>
    </div>
  );
}
