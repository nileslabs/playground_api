'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Icon } from '@iconify/react';
import { cn } from '@/lib/utils';
import { BlogPostMeta } from '@/lib/blog';
import siteConfig from '@/config/site';

interface PostsSidebarProps {
  posts: BlogPostMeta[];
  tags: { tag: string; count: number }[];
  className?: string;
}

export function PostsSidebar({ posts, tags, className }: PostsSidebarProps) {
  const pathname = usePathname();
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [searchFilter, setSearchFilter] = useState('');

  // Listen to mobile toggle from AppHeader
  useEffect(() => {
    const handleToggle = () => setMobileDrawerOpen((prev) => !prev);
    window.addEventListener('toggle-sidebar-mobile', handleToggle);
    return () => window.removeEventListener('toggle-sidebar-mobile', handleToggle);
  }, []);

  // Close drawer on navigation
  useEffect(() => {
    setMobileDrawerOpen(false);
  }, [pathname]);

  const filteredPosts = posts.filter(
    (p) =>
      p.title.toLowerCase().includes(searchFilter.toLowerCase()) ||
      p.tags.some((t) => t.toLowerCase().includes(searchFilter.toLowerCase()))
  );

  const renderContent = () => (
    <div className="space-y-6">
      {/* Series Header */}
      <div className="space-y-1.5 pb-3 border-b border-slate-100">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100 text-[11px] font-bold uppercase tracking-wider">
          <Icon icon="ph:stack-bold" className="w-3.5 h-3.5" />
          Masterclass Series
        </div>
        <h3 className="font-bold text-sm text-slate-900">
          Stop Waiting for the Backend
        </h3>
        <p className="text-xs text-slate-500 font-normal leading-relaxed">
          12 comprehensive practical workflows for frontend engineers.
        </p>
      </div>

      {/* Search Filter for Articles */}
      <div className="relative">
        <Icon
          icon="ph:magnifying-glass-bold"
          className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none"
        />
        <input
          type="text"
          value={searchFilter}
          onChange={(e) => setSearchFilter(e.target.value)}
          placeholder="Filter 12 articles..."
          className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-slate-50/70 focus:bg-white focus:border-indigo-300 focus:outline-none placeholder:text-slate-400 text-slate-800 transition-all shadow-2xs"
        />
      </div>

      {/* Series Articles List */}
      <div className="space-y-1">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2">
          Curriculum ({filteredPosts.length})
        </span>

        <nav className="space-y-1 pt-1">
          {filteredPosts.map((post) => {
            const href = `/blog/${post.slug}`;
            const isActive = pathname === href;

            return (
              <Link
                key={post.slug}
                href={href}
                className={cn(
                  "flex items-start gap-2.5 p-2 rounded-xl text-xs transition-all group",
                  isActive
                    ? "bg-indigo-50 text-indigo-900 font-semibold border border-indigo-200/80 shadow-2xs"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50 font-normal"
                )}
              >
                <span
                  className={cn(
                    "text-[10px] font-mono font-bold px-1.5 py-0.5 rounded shrink-0 transition-colors",
                    isActive
                      ? "bg-indigo-600 text-white"
                      : "bg-slate-100 text-slate-500 group-hover:bg-slate-200/80"
                  )}
                >
                  P{post.order}
                </span>

                <div className="min-w-0 flex-1">
                  <p className="truncate leading-tight font-medium">{post.title}</p>
                  <span className="text-[10px] text-slate-400 font-normal">{post.readingTime}</span>
                </div>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Popular Topics / Tags */}
      <div className="space-y-2 pt-2 border-t border-slate-100">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 flex items-center gap-1">
          <Icon icon="ph:tag-bold" className="w-3 h-3 text-indigo-600" />
          Popular Topics
        </span>

        <div className="flex flex-wrap gap-1.5 px-1">
          {tags.slice(0, 10).map(({ tag, count }) => (
            <Link
              key={tag}
              href={`/blog?tag=${tag}`}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-medium bg-slate-50 hover:bg-indigo-50 hover:text-indigo-700 text-slate-600 border border-slate-200/80 transition-colors"
            >
              <span>#{tag}</span>
              <span className="text-[9px] font-mono text-slate-400">{count}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Author Profile Spotlight */}
      <div className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50/60 space-y-2.5">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-indigo-100 border border-indigo-200 flex items-center justify-center text-xs font-bold text-indigo-700 shrink-0">
            NK
          </div>
          <div className="min-w-0">
            <h4 className="text-xs font-bold text-slate-900 truncate">Nilesh Kumar</h4>
            <p className="text-[11px] text-slate-500 truncate">Creator, Playground API</p>
          </div>
        </div>
        <p className="text-[11px] text-slate-600 leading-relaxed font-normal">
          Building developer tools and stateful mock infrastructures for high-velocity teams.
        </p>
        <div className="flex items-center gap-3 pt-1 text-xs">
          <Link
            href={siteConfig.links.github}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-indigo-600 hover:text-indigo-800 font-semibold"
          >
            <Icon icon="simple-icons:github" className="w-3.5 h-3.5" />
            <span>GitHub</span>
          </Link>
        </div>
      </div>

      {/* Developer Toolkit Quick Downloads */}
      <div className="space-y-1.5 pt-1">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2">
          Ecosystem Specs
        </span>
        <div className="space-y-1 text-xs">
          <Link
            href="/docs/collections/openapi"
            className="flex items-center justify-between p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-colors"
          >
            <div className="flex items-center gap-2">
              <Icon icon="ph:file-code-bold" className="w-3.5 h-3.5 text-indigo-600" />
              <span>OpenAPI 3.0 Spec</span>
            </div>
            <Icon icon="ph:arrow-square-out-bold" className="w-3 h-3 text-slate-400" />
          </Link>
          <Link
            href="/docs/collections/postman"
            className="flex items-center justify-between p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-colors"
          >
            <div className="flex items-center gap-2">
              <Icon icon="ph:lightning-bold" className="w-3.5 h-3.5 text-amber-600" />
              <span>Postman Collection</span>
            </div>
            <Icon icon="ph:arrow-square-out-bold" className="w-3 h-3 text-slate-400" />
          </Link>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sticky Sidebar */}
      <aside
        className={cn(
          "shrink-0 border-r border-slate-200 bg-white transition-all duration-300 ease-in-out md:sticky md:top-16 md:h-[calc(100vh-4rem)] md:overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden w-full md:w-64 lg:w-72 p-4",
          className
        )}
        aria-label="Blog Series Navigation"
      >
        {renderContent()}
      </aside>

      {/* Mobile Drawer Overlay */}
      {mobileDrawerOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs animate-fade-in"
            onClick={() => setMobileDrawerOpen(false)}
          />
          <div className="relative w-80 max-w-[85vw] bg-white h-full shadow-2xl p-4 overflow-y-auto animate-in slide-in-from-left duration-200">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
              <span className="font-bold text-sm text-slate-900">Blog Masterclass Series</span>
              <button
                type="button"
                onClick={() => setMobileDrawerOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <Icon icon="ph:x-bold" className="w-5 h-5" />
              </button>
            </div>
            {renderContent()}
          </div>
        </div>
      )}
    </>
  );
}

export default PostsSidebar;
