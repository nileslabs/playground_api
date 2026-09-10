import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { Icon } from '@iconify/react';
import { getAllPosts, getAllTags } from '@/lib/blog';
import { BlogCard } from '@/components/blog/BlogCard';
import { siteConfig } from '@/config/site';

export const metadata: Metadata = {
  title: 'Blog & Technical Articles — Stop Waiting for the Backend',
  description:
    'Deep dives, practical tutorials, and architectural guides on building and testing modern React, Vue, Next.js, and GraphQL applications with stateful mock APIs.',
  openGraph: {
    title: 'Playground API Blog — Modern API Prototyping & Frontend Engineering',
    description:
      'Tutorials, architectural guides, and frontend prototyping masterclasses for React, Vue, and Next.js developers.',
    url: `${siteConfig.url}/blog`,
    siteName: siteConfig.name,
    type: 'website',
  },
};

export default function BlogIndexPage() {
  const posts = getAllPosts();
  const tags = getAllTags();
  const featuredPost = posts[0];
  const remainingPosts = posts.slice(1);

  return (
    <div className="min-h-screen bg-bg-primary text-text-primary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-12">
        {/* Header Hero */}
        <div className="space-y-4 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-light border border-accent-primary/20 text-accent-primary text-xs font-bold uppercase tracking-wider">
            <Icon icon="ph:newspaper-clipping-bold" className="w-4 h-4" />
            Official Series
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-text-primary">
            Stop Waiting for the Backend
          </h1>

          <p className="text-base sm:text-lg text-text-secondary leading-relaxed">
            A 12-part technical handbook on stateful mock APIs, React CRUD workflows, GraphQL mutations, JWT authentication loops, and network resilience.
          </p>
        </div>

        {/* Tag Filters */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-border-theme/60">
          <span className="text-xs font-bold text-text-muted uppercase tracking-wider mr-2 flex items-center gap-1.5">
            <Icon icon="ph:tag-bold" className="w-3.5 h-3.5 text-accent-primary" />
            Popular Topics:
          </span>
          {tags.map(({ tag, count }) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-bg-secondary border border-border-theme text-text-secondary hover:border-accent-primary/40 hover:text-accent-primary transition-colors cursor-default"
            >
              #{tag}
              <span className="px-1.5 py-0.2 rounded-full bg-bg-tertiary text-[10px] text-text-muted font-mono font-bold">
                {count}
              </span>
            </span>
          ))}
        </div>

        {/* Featured Post */}
        {featuredPost && (
          <section className="space-y-4">
            <BlogCard post={featuredPost} featured={true} />
          </section>
        )}

        {/* All Articles Grid */}
        <section className="space-y-6 pt-6">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-sm font-bold text-text-primary uppercase tracking-wider">
              <Icon icon="ph:stack-bold" className="w-4.5 h-4.5 text-accent-primary" />
              All Series Articles ({posts.length})
            </div>
            <div className="text-xs text-text-muted">
              Updated weekly with new guides
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {remainingPosts.map((post) => (
              <BlogCard key={post.slug} post={post} />
            ))}
          </div>
        </section>

        {/* Bottom CTA Card */}
        <section className="p-8 sm:p-12 rounded-3xl border border-accent-primary/30 bg-gradient-to-br from-accent-light/50 via-bg-secondary to-bg-secondary text-center space-y-6 shadow-xl">
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
              href="/docs/studio"
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
