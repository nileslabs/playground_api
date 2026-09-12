import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Icon } from '@iconify/react';
import { getAllPosts, getPostBySlug, getAdjacentPosts } from '@/lib/blog';
import { BlogPostContent } from '@/components/blog/BlogPostContent';
import { TableOfContents } from '@/components/blog/TableOfContents';
import { BlogSeriesNav } from '@/components/blog/BlogSeriesNav';
import { siteConfig } from '@/config/site';
import { getBreadcrumbSchema } from '@/lib/json-ld';

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    return {
      title: 'Post Not Found — Playground API Blog',
    };
  }

  const postUrl = `${siteConfig.url}/blog/${post.slug}`;
  const ogImageUrl = `${siteConfig.url}${post.coverImage}`;

  return {
    title: `${post.title} — Playground API Blog`,
    description: post.description,
    keywords: post.tags,
    alternates: {
      canonical: post.canonicalUrl || postUrl,
    },
    openGraph: {
      title: post.title,
      description: post.description,
      url: postUrl,
      siteName: siteConfig.name,
      type: 'article',
      publishedTime: post.date,
      authors: [post.author],
      tags: post.tags,
      images: [
        {
          url: ogImageUrl,
          width: 1000,
          height: 420,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
      images: [ogImageUrl],
      creator: '@nileslabs',
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const { prev, next } = getAdjacentPosts(slug);
  const postUrl = `${siteConfig.url}/blog/${post.slug}`;

  // Structured Data (JSON-LD) for Google Rich Snippets
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline: post.title,
    description: post.description,
    image: `${siteConfig.url}${post.coverImage}`,
    datePublished: post.date,
    dateModified: post.date,
    author: {
      '@type': 'Person',
      name: post.author,
      url: siteConfig.author.website,
    },
    publisher: {
      '@type': 'Organization',
      name: siteConfig.name,
      url: siteConfig.url,
      logo: {
        '@type': 'ImageObject',
        url: `${siteConfig.url}/icon.png`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': postUrl,
    },
    keywords: post.tags.join(', '),
  };

  // BreadcrumbList JSON-LD — parsed by Google separately from visible breadcrumb nav
  const jsonLdBreadcrumbs = getBreadcrumbSchema([
    { name: 'Home', url: siteConfig.url },
    { name: 'Blog', url: `${siteConfig.url}/blog` },
    { name: post.title, url: postUrl },
  ]);

  return (
    <div className="min-h-screen bg-bg-primary text-text-primary">
      {/* TechArticle JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* BreadcrumbList JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumbs) }}
      />

      <article className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs sm:text-sm text-text-muted mb-8">
          <Link href="/" className="hover:text-text-primary transition-colors">
            Home
          </Link>
          <Icon icon="ph:caret-right-bold" className="w-3.5 h-3.5" />
          <Link href="/blog" className="hover:text-text-primary transition-colors">
            Blog
          </Link>
          <Icon icon="ph:caret-right-bold" className="w-3.5 h-3.5" />
          <span className="text-text-primary font-medium truncate max-w-50 sm:max-w-xs">
            Part {post.order}: {post.slug}
          </span>
        </nav>

        {/* Article Body & Sidebar Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Main Content Column */}
          <div className="lg:col-span-8 min-w-0 space-y-8">
            {/* Article Header */}
            <header className="space-y-6">
              {/* Series & Part Pill */}
              <div className="flex flex-wrap items-center gap-2">
                <Link
                  href="/blog"
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent-light text-accent-primary border border-accent-primary/20 text-xs font-bold hover:bg-accent-light/80 transition-colors"
                >
                  <Icon icon="ph:stack-bold" className="w-3.5 h-3.5" />
                  {post.series} • Part {post.order} of 12
                </Link>
                <span className="flex items-center gap-1 text-xs text-text-muted">
                  <Icon icon="ph:clock-bold" className="w-3.5 h-3.5 text-accent-primary" />
                  {post.readingTime}
                </span>
                <span className="text-text-muted text-xs">•</span>
                <span className="text-xs text-text-muted">{post.date}</span>
              </div>

              {/* Title */}
              <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-extrabold tracking-tight text-text-primary leading-tight">
                {post.title}
              </h1>

              {/* Description */}
              <p className="text-base sm:text-lg text-text-secondary leading-relaxed">
                {post.description}
              </p>

              {/* Author info & Social Actions */}
              <div className="pt-4 border-t border-border-theme flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-accent-light border border-accent-primary/30 flex items-center justify-center text-accent-primary font-bold text-sm">
                    NK
                  </div>
                  <div>
                    <div className="text-sm font-bold text-text-primary">{post.author}</div>
                    <div className="text-xs text-text-muted">{post.authorRole}</div>
                  </div>
                </div>

                {/* Social Share Buttons */}
                <div className="flex items-center gap-2">
                  <a
                    href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(postUrl)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-xl bg-bg-secondary hover:bg-bg-tertiary border border-border-theme text-text-secondary hover:text-text-primary transition-colors"
                    title="Share on X / Twitter"
                  >
                    <Icon icon="simple-icons:x" className="w-4 h-4" />
                  </a>
                  <a
                    href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(postUrl)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-xl bg-bg-secondary hover:bg-bg-tertiary border border-border-theme text-text-secondary hover:text-text-primary transition-colors"
                    title="Share on LinkedIn"
                  >
                    <Icon icon="simple-icons:linkedin" className="w-4 h-4" />
                  </a>
                  <a
                    href="https://dev.to"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-xl bg-bg-secondary hover:bg-bg-tertiary border border-border-theme text-text-secondary hover:text-text-primary transition-colors"
                    title="View on Dev.to"
                  >
                    <Icon icon="simple-icons:devdotto" className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </header>

            {/* Cover Image Banner */}
            <div className="relative aspect-1000/420 w-full rounded-2xl overflow-hidden bg-bg-tertiary border border-border-theme shadow-md">
              <Image
                src={post.coverImage}
                alt={post.title}
                fill
                sizes="(max-width: 1024px) 100vw, 800px"
                className="object-cover"
                priority
              />
            </div>

            {/* Markdown Content */}
            <BlogPostContent content={post.content} />

            {/* Tags footer */}
            <div className="my-5 pt-6 border-t border-border-theme flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-text-muted uppercase tracking-wider mr-1">Tags:</span>
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2.5 py-1 rounded-lg bg-bg-secondary text-xs font-medium text-text-secondary border border-border-theme"
                >
                  #{tag}
                </span>
              ))}
            </div>

            {/* Series Navigation (Prev / Next) */}
            <BlogSeriesNav prev={prev} next={next} series={post.series} order={post.order} />

            {/* In-Article Try It / Playground CTA */}
            <div className="mt-12 p-6 sm:p-8 rounded-2xl border border-accent-primary/30 bg-linear-to-r from-accent-light/30 via-bg-secondary to-bg-secondary space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-accent-light text-accent-primary border border-accent-primary/30">
                  <Icon icon="ph:lightning-fill" className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-text-primary">
                    Try Playground API in Your Own App
                  </h3>
                  <p className="text-xs sm:text-sm text-text-secondary">
                    Stateful mock REST & GraphQL API with private sandbox overlays.
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Link
                  href="/docs/quickstart"
                  className="px-4 py-2 rounded-xl bg-accent-primary hover:bg-accent-secondary text-white text-xs sm:text-sm font-bold shadow-sm transition-colors flex items-center gap-1.5"
                >
                  <Icon icon="ph:rocket-launch-bold" className="w-4 h-4" />
                  Quickstart Guide
                </Link>
                <Link
                  href="/docs/studio"
                  className="px-4 py-2 rounded-xl bg-bg-secondary hover:bg-bg-tertiary border border-border-theme text-text-primary text-xs sm:text-sm font-semibold transition-colors flex items-center gap-1.5"
                >
                  <Icon icon="ph:play-circle-bold" className="w-4 h-4 text-accent-primary" />
                  Open Interactive Studio
                </Link>
              </div>
            </div>
          </div>

          {/* Sticky Sidebar (Table of Contents & Meta) */}
          <aside className="hidden lg:block lg:col-span-4 sticky top-20 self-start space-y-6">
            <TableOfContents headings={post.headings} />

            {/* Series Overview Sidebar Card */}
            <div className="p-4 sm:p-5 rounded-2xl border border-border-theme bg-bg-secondary/40 space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-text-muted">
                <Icon icon="ph:books-bold" className="w-4 h-4 text-accent-primary" />
                About the Series
              </div>
              <p className="text-xs text-text-secondary leading-relaxed">
                <strong>Stop Waiting for the Backend</strong> covers 12 practical frontend workflows: React CRUD, GraphQL mutations, JWT auth loops, latency & chaos simulation, and more.
              </p>
              <Link
                href="/blog"
                className="inline-flex items-center gap-1 text-xs font-bold text-accent-primary hover:text-accent-secondary transition-colors"
              >
                View All 12 Articles
                <Icon icon="ph:arrow-right-bold" className="w-3.5 h-3.5" />
              </Link>
            </div>
          </aside>
        </div>
      </article>
    </div>
  );
}
