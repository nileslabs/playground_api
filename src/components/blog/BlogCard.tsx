'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Icon } from '@iconify/react';
import { BlogPostMeta } from '@/lib/blog';

interface BlogCardProps {
  post: BlogPostMeta;
  featured?: boolean;
}

export function BlogCard({ post, featured = false }: BlogCardProps) {
  if (featured) {
    return (
      <article className="group relative rounded-2xl border border-border-theme bg-bg-secondary/60 hover:bg-bg-secondary hover:border-accent-primary/40 transition-all duration-300 overflow-hidden shadow-lg hover:shadow-xl hover:shadow-accent-primary/5">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 p-6 sm:p-8 items-center">
          {/* Cover Image */}
          <div className="lg:col-span-7 relative aspect-[16/9] w-full rounded-xl overflow-hidden bg-bg-tertiary border border-border-theme/60">
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              sizes="(max-width: 1024px) 100vw, 55vw"
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              priority
            />
            <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-[11px] font-bold text-white uppercase tracking-wider">
              <Icon icon="ph:star-fill" className="w-3 h-3 text-amber-400" />
              Featured Post #{post.order}
            </div>
          </div>

          {/* Content */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              {/* Tags & Meta */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-0.5 text-xs font-semibold rounded-md bg-accent-light text-accent-primary border border-accent-primary/20">
                  Part {post.order}
                </span>
                <span className="flex items-center gap-1 text-xs text-text-muted">
                  <Icon icon="ph:clock-bold" className="w-3.5 h-3.5 text-accent-primary" />
                  {post.readingTime}
                </span>
                <span className="text-text-muted text-xs">•</span>
                <span className="text-xs text-text-muted">{post.date}</span>
              </div>

              {/* Title */}
              <Link href={`/blog/${post.slug}`}>
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-text-primary group-hover:text-accent-primary transition-colors line-clamp-2 leading-tight">
                  {post.title}
                </h2>
              </Link>

              {/* Description */}
              <p className="text-sm text-text-secondary line-clamp-3 leading-relaxed">
                {post.description}
              </p>
            </div>

            {/* Author & CTA */}
            <div className="pt-4 border-t border-border-theme flex items-center justify-between gap-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-accent-light border border-accent-primary/30 flex items-center justify-center text-accent-primary font-bold text-xs">
                  NK
                </div>
                <div>
                  <div className="text-xs font-bold text-text-primary">{post.author}</div>
                  <div className="text-[11px] text-text-muted">{post.authorRole}</div>
                </div>
              </div>

              <Link
                href={`/blog/${post.slug}`}
                className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-accent-primary group-hover:translate-x-1 transition-transform"
              >
                Read Article
                <Icon icon="ph:arrow-right-bold" className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </article>
    );
  }

  return (
    <article className="group flex flex-col justify-between rounded-2xl border border-border-theme bg-bg-secondary/60 hover:bg-bg-secondary hover:border-accent-primary/40 transition-all duration-300 overflow-hidden shadow-sm hover:shadow-md hover:shadow-accent-primary/5">
      <div>
        {/* Cover Image */}
        <div className="relative aspect-[16/9] w-full overflow-hidden bg-bg-tertiary border-b border-border-theme/60">
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute top-3 left-3 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-[10px] font-bold text-white uppercase tracking-wider">
            Part {post.order}
          </div>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 space-y-3">
          {/* Tags & Meta */}
          <div className="flex flex-wrap items-center gap-2 text-xs text-text-muted">
            <span className="flex items-center gap-1 text-accent-primary font-medium">
              <Icon icon="ph:clock-bold" className="w-3.5 h-3.5" />
              {post.readingTime}
            </span>
            <span>•</span>
            <span>{post.date}</span>
          </div>

          {/* Title */}
          <Link href={`/blog/${post.slug}`}>
            <h3 className="text-base sm:text-lg font-bold text-text-primary group-hover:text-accent-primary transition-colors line-clamp-2 leading-snug">
              {post.title}
            </h3>
          </Link>

          {/* Description */}
          <p className="text-xs sm:text-sm text-text-secondary line-clamp-3 leading-relaxed">
            {post.description}
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="px-5 sm:px-6 pb-5 pt-3 border-t border-border-theme/50 flex items-center justify-between gap-2">
        <div className="flex flex-wrap gap-1.5 max-w-[65%]">
          {post.tags.slice(0, 2).map((tag) => (
            <span
              key={tag}
              className="text-[11px] px-2 py-0.5 rounded bg-bg-tertiary text-text-muted border border-border-theme/60"
            >
              #{tag}
            </span>
          ))}
        </div>

        <Link
          href={`/blog/${post.slug}`}
          className="inline-flex items-center gap-1 text-xs font-semibold text-accent-primary group-hover:translate-x-1 transition-transform"
        >
          Read
          <Icon icon="ph:arrow-right-bold" className="w-3.5 h-3.5" />
        </Link>
      </div>
    </article>
  );
}
