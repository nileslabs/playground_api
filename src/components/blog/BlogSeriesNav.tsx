import React from 'react';
import Link from 'next/link';
import { Icon } from '@iconify/react';
import { BlogPostMeta } from '@/lib/blog';

interface BlogSeriesNavProps {
  prev: BlogPostMeta | null;
  next: BlogPostMeta | null;
  series?: string;
  order?: number;
}

export function BlogSeriesNav({ prev, next }: BlogSeriesNavProps) {
  if (!prev && !next) return null;

  return (
    <div className="space-y-4 pt-8 border-t border-border-theme">
      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-text-muted">
        <Icon icon="ph:article-bold" className="w-4 h-4 text-accent-primary" />
        <span>Continue Reading</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Previous Post */}
        {prev ? (
          <Link
            href={`/blog/${prev.slug}`}
            className="group flex flex-col justify-between p-4 rounded-xl border border-border-theme bg-bg-secondary/40 hover:bg-bg-secondary hover:border-accent-primary/40 transition-all text-left space-y-2"
          >
            <div className="flex items-center gap-1.5 text-xs text-text-muted">
              <Icon icon="ph:arrow-left-bold" className="w-3.5 h-3.5 text-accent-primary group-hover:-translate-x-1 transition-transform" />
              <span>Previous Article</span>
            </div>
            <div className="text-sm font-bold text-text-primary group-hover:text-accent-primary transition-colors line-clamp-2">
              {prev.title}
            </div>
          </Link>
        ) : (
          <div />
        )}

        {/* Next Post */}
        {next ? (
          <Link
            href={`/blog/${next.slug}`}
            className="group flex flex-col justify-between p-4 rounded-xl border border-border-theme bg-bg-secondary/40 hover:bg-bg-secondary hover:border-accent-primary/40 transition-all text-right space-y-2"
          >
            <div className="flex items-center justify-end gap-1.5 text-xs text-text-muted">
              <span>Next Article</span>
              <Icon icon="ph:arrow-right-bold" className="w-3.5 h-3.5 text-accent-primary group-hover:translate-x-1 transition-transform" />
            </div>
            <div className="text-sm font-bold text-text-primary group-hover:text-accent-primary transition-colors line-clamp-2">
              {next.title}
            </div>
          </Link>
        ) : (
          <div />
        )}
      </div>
    </div>
  );
}
