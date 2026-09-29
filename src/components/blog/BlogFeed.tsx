'use client';

import React from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { Icon } from '@iconify/react';
import { BlogPostMeta } from '@/lib/blog';
import { BlogCard } from '@/components/blog/BlogCard';

interface BlogFeedProps {
  posts: BlogPostMeta[];
  tags: { tag: string; count: number }[];
}

export function BlogFeed({ posts, tags }: BlogFeedProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const activeTag = searchParams.get('tag')?.toLowerCase() || null;

  // Filter posts if activeTag is present
  const filteredPosts = activeTag
    ? posts.filter((post) =>
        post.tags.some((t) => t.toLowerCase() === activeTag)
      )
    : posts;

  const handleSelectTag = (tag: string | null) => {
    if (!tag || tag.toLowerCase() === activeTag) {
      router.push('/blog', { scroll: false });
    } else {
      router.push(`/blog?tag=${encodeURIComponent(tag.toLowerCase())}`, { scroll: false });
    }
  };

  const featuredPost = !activeTag ? posts[0] : null;
  const remainingPosts = !activeTag ? posts.slice(1) : filteredPosts;

  return (
    <div className="min-h-screen bg-bg-primary text-text-primary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-10">
        {/* Header Hero */}
        <div className="space-y-4 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-light border border-accent-primary/20 text-accent-primary text-xs font-bold uppercase tracking-wider">
            <Icon icon="ph:newspaper-clipping-bold" className="w-4 h-4" />
            Engineering & Architecture
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-text-primary">
            Stop Waiting for the Backend
          </h1>

          <p className="text-base sm:text-lg text-text-secondary leading-relaxed">
            In-depth technical articles and architectural deep dives explaining how Playground API features work—from stateful overlays and WebSockets to payments, webhooks, and chaos testing. Each article can be read independently.
          </p>
        </div>

        {/* Tag Filters Bar */}
        <div className="space-y-3 pt-2 border-t border-border-theme/60">
          <div className="flex items-center justify-between gap-4">
            <span className="text-xs font-bold text-text-muted uppercase tracking-wider flex items-center gap-1.5">
              <Icon icon="ph:tag-bold" className="w-3.5 h-3.5 text-accent-primary" />
              Filter by Topic:
            </span>

            {activeTag && (
              <button
                type="button"
                onClick={() => handleSelectTag(null)}
                className="text-xs font-semibold text-accent-primary hover:text-accent-secondary inline-flex items-center gap-1 cursor-pointer transition-colors"
              >
                <span>Clear Filter</span>
                <Icon icon="ph:x-circle-bold" className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* 'All Topics' button */}
            <button
              type="button"
              onClick={() => handleSelectTag(null)}
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-all cursor-pointer ${
                !activeTag
                  ? 'bg-accent-primary text-white font-bold shadow-xs'
                  : 'bg-bg-secondary border border-border-theme text-text-secondary hover:border-accent-primary/40 hover:text-accent-primary'
              }`}
            >
              <span>All Topics</span>
              <span
                className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono font-bold ${
                  !activeTag ? 'bg-white/20 text-white' : 'bg-bg-tertiary text-text-muted'
                }`}
              >
                {posts.length}
              </span>
            </button>

            {/* Individual topic tags */}
            {tags.map(({ tag, count }) => {
              const isSelected = activeTag === tag.toLowerCase();

              return (
                <button
                  key={tag}
                  type="button"
                  onClick={() => handleSelectTag(tag)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-accent-primary text-white font-bold shadow-xs ring-2 ring-accent-primary/30'
                      : 'bg-bg-secondary border border-border-theme text-text-secondary hover:border-accent-primary/40 hover:text-accent-primary'
                  }`}
                >
                  <span>#{tag}</span>
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono font-bold ${
                      isSelected ? 'bg-white/20 text-white' : 'bg-bg-tertiary text-text-muted'
                    }`}
                  >
                    {count}
                  </span>
                  {isSelected && (
                    <Icon icon="ph:x-bold" className="w-3 h-3 ml-0.5" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Featured Post (Only displayed on unfiltered view) */}
        {featuredPost && (
          <section className="space-y-4">
            <BlogCard post={featuredPost} featured={true} />
          </section>
        )}

        {/* Articles List / Grid */}
        <section className="space-y-6 pt-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-sm font-bold text-text-primary uppercase tracking-wider">
              <Icon icon="ph:article-bold" className="w-4.5 h-4.5 text-accent-primary" />
              {activeTag ? (
                <span>
                  Articles Tagged #{activeTag} ({filteredPosts.length})
                </span>
              ) : (
                <span>All Feature Articles ({posts.length})</span>
              )}
            </div>

            {activeTag && (
              <button
                type="button"
                onClick={() => handleSelectTag(null)}
                className="text-xs font-medium text-text-muted hover:text-text-primary underline cursor-pointer"
              >
                Show all {posts.length} articles
              </button>
            )}
          </div>

          {filteredPosts.length === 0 ? (
            <div className="py-16 text-center space-y-4 rounded-2xl border border-dashed border-border-theme bg-bg-secondary/40">
              <div className="w-12 h-12 rounded-full bg-accent-light text-accent-primary mx-auto flex items-center justify-center">
                <Icon icon="ph:magnifying-glass-bold" className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-text-primary">
                  No articles found for #{activeTag}
                </h3>
                <p className="text-xs text-text-muted">
                  Try selecting another topic above or view all feature articles.
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleSelectTag(null)}
                className="px-4 py-2 rounded-xl bg-accent-primary text-white text-xs font-bold hover:bg-accent-secondary transition-colors cursor-pointer"
              >
                View All Articles
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {remainingPosts.map((post) => (
                <BlogCard key={post.slug} post={post} />
              ))}
            </div>
          )}
        </section>

        {/* Bottom CTA Card */}
        <section className="p-8 sm:p-12 rounded-3xl border border-accent-primary/30 bg-linear-to-br from-accent-light/50 via-bg-secondary to-bg-secondary text-center space-y-6 shadow-xl">
          <div className="inline-flex p-3 rounded-2xl bg-accent-light text-accent-primary border border-accent-primary/30">
            <Icon icon="ph:lightning-fill" className="w-8 h-8" />
          </div>
          <div className="space-y-2 max-w-2xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-text-primary">
              Ready to start prototyping immediately?
            </h2>
            <p className="text-sm sm:text-base text-text-secondary">
              Zero registration. Zero installation. Persistent private state per identity. Test REST and GraphQL queries in under 30 seconds.
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/docs/quickstart"
              className="px-6 py-3 rounded-xl bg-accent-primary hover:bg-accent-secondary text-white font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center gap-2"
            >
              <Icon icon="ph:rocket-launch-bold" className="w-4.5 h-4.5" />
              Get Started in 30s
            </Link>
            <Link
              href="/docs/toolkit/studio"
              className="px-6 py-3 rounded-xl bg-bg-secondary hover:bg-bg-tertiary border border-border-theme text-text-primary font-bold text-sm transition-all flex items-center gap-2"
            >
              <Icon icon="ph:play-circle-bold" className="w-4.5 h-4.5 text-accent-primary" />
              Launch API Studio
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}

export default BlogFeed;
