import React, { Suspense } from 'react';
import { Metadata } from 'next';
import { getAllPosts, getAllTags } from '@/lib/blog';
import { BlogFeed } from '@/components/blog/BlogFeed';
import { siteConfig } from '@/config/site';

export const metadata: Metadata = {
  title: 'Blog & Feature Deep Dives — Playground API',
  description:
    'In-depth technical guides, feature explanations, and architectural deep dives on stateful mock APIs, WebSockets, sandboxes, and modern frontend tooling.',
  openGraph: {
    title: 'Playground API Blog — Feature Deep Dives & Engineering Architecture',
    description:
      'In-depth technical articles explaining Playground API features, stateful session sandboxes, and developer tooling.',
    url: `${siteConfig.url}/blog`,
    siteName: siteConfig.name,
    type: 'website',
  },
};

export default function BlogIndexPage() {
  const posts = getAllPosts();
  const tags = getAllTags();

  return (
    <Suspense
      fallback={
        <div className="min-h-screen py-16 text-center text-text-muted">
          <div className="inline-block animate-spin w-6 h-6 border-2 border-accent-primary border-t-transparent rounded-full mb-3" />
          <p className="text-sm">Loading articles...</p>
        </div>
      }
    >
      <BlogFeed posts={posts} tags={tags} />
    </Suspense>
  );
}
