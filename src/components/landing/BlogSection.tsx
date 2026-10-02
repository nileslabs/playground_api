'use client';

import React from 'react';
import Link from 'next/link';
import { Icon } from '@iconify/react';

interface FeaturedArticle {
  title: string;
  slug: string;
  part: number;
  readingTime: string;
  description: string;
  tags: string[];
}

const featuredArticles: FeaturedArticle[] = [
  {
    part: 1,
    title: 'React CRUD Without a Backend: Build Real Apps Today',
    slug: 'react-crud-without-backend',
    readingTime: '8 min read',
    description:
      'Build a complete production-grade React CRUD interface with optimistic UI updates and persistent state overlays without running any local database.',
    tags: ['React', 'CRUD', 'Frontend'],
  },
  {
    part: 2,
    title: "Why Static Mock APIs Aren't Enough for Frontend Dev",
    slug: 'why-static-mock-apis-arent-enough',
    readingTime: '6 min read',
    description:
      'Explore why traditional read-only mock servers fail during integration tests, and how stateful copy-on-write session sandboxes bridge the gap.',
    tags: ['Architecture', 'Testing', 'Stateful'],
  },
  {
    part: 3,
    title: 'Mock APIs That Remember POST Requests',
    slug: 'mock-api-remember-post-requests',
    readingTime: '7 min read',
    description:
      'How to test real authentication loops, multi-step checkout forms, and user profiles with mock APIs that persist mutations per browser session.',
    tags: ['Stateful', 'POST', 'Sessions'],
  },
];

export function BlogSection() {
  return (
    <section id="articles" className="scroll-mt-16 sm:scroll-mt-20 py-20 md:py-28 bg-slate-50/50 border-b border-slate-200/80">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold uppercase tracking-wider border border-indigo-100">
              <Icon icon="ph:newspaper-clipping-bold" className="w-3.5 h-3.5 text-indigo-600" />
              <span>Engineering & Architecture</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">
              Stop Waiting for the Backend
            </h2>
            <p className="text-base sm:text-lg text-slate-600 font-normal leading-relaxed">
              In-depth technical articles explaining Playground API features, stateful architectures, WebSockets, payment intents, and frontend autonomy.
            </p>
          </div>

          <Link
            href="/blog"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-800 hover:text-indigo-600 font-semibold text-sm border border-slate-200 shadow-2xs transition-all shrink-0 group self-start md:self-auto cursor-pointer"
          >
            <span>Explore All Articles</span>
            <Icon icon="ph:arrow-right-bold" className="w-4 h-4 text-indigo-600 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {/* 3 Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredArticles.map((article) => (
            <Link
              key={article.slug}
              href={`/blog/${article.slug}`}
              className="group rounded-2xl border border-slate-200 bg-white p-6 space-y-4 hover:border-indigo-300 hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-100">
                    #{article.tags[0]}
                  </span>
                  <span className="text-[11px] font-medium text-slate-400 flex items-center gap-1">
                    <Icon icon="ph:clock-bold" className="w-3 h-3 text-slate-400" />
                    {article.readingTime}
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors leading-snug">
                  {article.title}
                </h3>

                <p className="text-xs text-slate-600 leading-relaxed font-normal">
                  {article.description}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  {article.tags.map((t) => (
                    <span key={t} className="text-[10px] text-slate-400 font-medium">
                      #{t}
                    </span>
                  ))}
                </div>

                <span className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 group-hover:translate-x-0.5 transition-transform">
                  <span>Read</span>
                  <Icon icon="ph:arrow-right-bold" className="w-3 h-3" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export default BlogSection;
