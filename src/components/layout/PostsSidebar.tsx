'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
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
  const searchParams = useSearchParams();
  const activeTag = searchParams.get('tag')?.toLowerCase() || null;

  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [searchFilter, setSearchFilter] = useState('');
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Load saved collapse preference
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('pg_blog_sidebar_collapsed');
      if (saved === 'true') {
        setIsCollapsed(true);
      }
    }
  }, []);

  const toggleCollapse = () => {
    setIsCollapsed((prev) => {
      const next = !prev;
      if (typeof window !== 'undefined') {
        localStorage.setItem('pg_blog_sidebar_collapsed', String(next));
      }
      return next;
    });
  };

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

  const filteredPosts = posts.filter((p) => {
    const matchesSearch =
      !searchFilter ||
      p.title.toLowerCase().includes(searchFilter.toLowerCase()) ||
      p.tags.some((t) => t.toLowerCase().includes(searchFilter.toLowerCase()));
    const matchesTag = !activeTag || p.tags.some((t) => t.toLowerCase() === activeTag);
    return matchesSearch && matchesTag;
  });

  const renderContent = (isMobile = false) => (
    <div className="space-y-6">
      {/* Series Header */}
      <div className="space-y-1.5 pb-3 border-b border-slate-100">
        <div className="flex items-center justify-between">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100 text-[11px] font-bold uppercase tracking-wider">
            <Icon icon="ph:newspaper-clipping-bold" className="w-3.5 h-3.5" />
            Feature Deep Dives
          </div>

          {!isMobile && (
            <button
              type="button"
              onClick={toggleCollapse}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              title="Collapse sidebar"
              aria-label="Collapse Sidebar"
            >
              <Icon icon="ph:sidebar-simple-bold" className="w-4 h-4" />
            </button>
          )}
        </div>
        <h3 className="font-bold text-sm text-slate-900">
          Playground API Articles
        </h3>
        <p className="text-xs text-slate-500 font-normal leading-relaxed">
          In-depth technical guides explaining features, stateful architectures, and developer tooling.
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
          placeholder={`Search ${posts.length} articles...`}
          className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-slate-50/70 focus:bg-white focus:border-indigo-300 focus:outline-none placeholder:text-slate-400 text-slate-800 transition-all shadow-2xs"
        />
      </div>

      {/* Articles List */}
      <div className="space-y-1">
        <div className="flex items-center justify-between px-2">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            {activeTag ? `Filtered: #${activeTag}` : 'All Articles'} ({filteredPosts.length})
          </span>
          {activeTag && (
            <Link
              href="/blog"
              className="text-[10px] font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-0.5"
            >
              Clear <Icon icon="ph:x-bold" className="w-2.5 h-2.5" />
            </Link>
          )}
        </div>

        <nav className="space-y-1 pt-1">
          {filteredPosts.length === 0 ? (
            <div className="p-3 rounded-xl bg-slate-50 text-center text-xs text-slate-500 space-y-1">
              <p>No articles found.</p>
              <Link href="/blog" className="text-indigo-600 font-bold hover:underline">
                Clear filter
              </Link>
            </div>
          ) : (
            filteredPosts.map((post) => {
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
                      "text-[10px] p-1 rounded shrink-0 transition-colors flex items-center justify-center",
                      isActive
                        ? "bg-indigo-600 text-white"
                        : "bg-slate-100 text-slate-500 group-hover:bg-slate-200/80"
                    )}
                  >
                    <Icon icon="ph:article" className="w-3 h-3" />
                  </span>

                  <div className="min-w-0 flex-1">
                    <p className="truncate leading-tight font-medium">{post.title}</p>
                    <span className="text-[10px] text-slate-400 font-normal">{post.readingTime}</span>
                  </div>
                </Link>
              );
            })
          )}
        </nav>
      </div>

      {/* Popular Topics / Tags */}
      <div className="space-y-2 pt-2 border-t border-slate-100">
        <div className="flex items-center justify-between px-2">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
            <Icon icon="ph:tag-bold" className="w-3 h-3 text-indigo-600" />
            Popular Topics
          </span>
          {activeTag && (
            <Link
              href="/blog"
              className="text-[10px] font-bold text-indigo-600 hover:text-indigo-800"
            >
              Reset
            </Link>
          )}
        </div>

        <div className="flex flex-wrap gap-1.5 px-1">
          {tags.slice(0, 10).map(({ tag, count }) => {
            const isTagActive = activeTag === tag.toLowerCase();

            return (
              <Link
                key={tag}
                href={isTagActive ? '/blog' : `/blog?tag=${encodeURIComponent(tag.toLowerCase())}`}
                className={cn(
                  "inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors",
                  isTagActive
                    ? "bg-indigo-600 text-white font-semibold shadow-2xs"
                    : "bg-slate-50 hover:bg-indigo-50 hover:text-indigo-700 text-slate-600 border border-slate-200/80"
                )}
              >
                <span>#{tag}</span>
                <span
                  className={cn(
                    "text-[9px] font-mono",
                    isTagActive ? "text-indigo-200 font-bold" : "text-slate-400"
                  )}
                >
                  {count}
                </span>
                {isTagActive && <Icon icon="ph:x-bold" className="w-2.5 h-2.5 ml-0.5 text-indigo-200" />}
              </Link>
            );
          })}
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
          "shrink-0 border-r border-slate-200 bg-white transition-all duration-300 ease-in-out md:sticky md:top-16 md:h-[calc(100vh-4rem)] md:overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden",
          isCollapsed
            ? "w-16 p-2 flex flex-col items-center select-none overflow-x-hidden"
            : "w-full md:w-64 lg:w-72 p-4",
          className
        )}
        aria-label="Blog Navigation"
      >
        {isCollapsed ? (
          /* Collapsed Icon-Only View */
          <div className="w-full flex flex-col items-center space-y-3 pt-1">
            <button
              type="button"
              onClick={toggleCollapse}
              className="w-10 h-10 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 hover:text-indigo-600 flex items-center justify-center transition-colors cursor-pointer"
              title="Expand Sidebar"
              aria-label="Expand Sidebar"
            >
              <Icon icon="ph:sidebar-simple-bold" className="w-4 h-4 text-indigo-600" />
            </button>

            <div className="w-8 h-px bg-slate-200 my-1" />

            {/* Quick Link to All Articles */}
            <div className="relative group flex items-center justify-center">
              <Link
                href="/blog"
                title="All Articles"
                className={cn(
                  "w-10 h-10 rounded-xl flex items-center justify-center transition-all cursor-pointer",
                  pathname === '/blog' && !activeTag
                    ? "bg-indigo-50 text-indigo-700 font-bold border border-indigo-200 shadow-xs"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/70"
                )}
                aria-label="All Articles"
              >
                <Icon icon="ph:newspaper-clipping-bold" className="w-4 h-4 shrink-0" />
              </Link>
              <div className="absolute left-full ml-2 px-2.5 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-semibold whitespace-nowrap shadow-xl border border-slate-800 z-50 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                All Articles ({posts.length})
              </div>
            </div>

            <div className="w-6 h-px bg-slate-200 my-1" />

            {/* Articles Icon Navigation */}
            <nav className="w-full flex flex-col items-center space-y-1.5 max-h-[calc(100vh-14rem)] overflow-y-auto no-scrollbar">
              {posts.map((post) => {
                const href = `/blog/${post.slug}`;
                const isActive = pathname === href;

                return (
                  <div key={post.slug} className="relative group flex items-center justify-center">
                    <Link
                      href={href}
                      title={post.title}
                      className={cn(
                        "w-10 h-10 rounded-xl flex items-center justify-center transition-all cursor-pointer",
                        isActive
                          ? "bg-indigo-50 text-indigo-700 font-bold border border-indigo-200 shadow-xs"
                          : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/70"
                      )}
                      aria-label={post.title}
                    >
                      <Icon icon="ph:article" className="w-4 h-4 shrink-0" />
                    </Link>

                    <div className="absolute left-full ml-2 max-w-xs px-2.5 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-semibold whitespace-normal shadow-xl border border-slate-800 z-50 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                      <p className="line-clamp-2 leading-tight">{post.title}</p>
                      <span className="text-[10px] text-slate-400 font-mono mt-0.5 block">{post.readingTime}</span>
                    </div>
                  </div>
                );
              })}
            </nav>
          </div>
        ) : (
          renderContent(false)
        )}
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
              <span className="font-bold text-sm text-slate-900">Feature Deep Dives</span>
              <button
                type="button"
                onClick={() => setMobileDrawerOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <Icon icon="ph:x-bold" className="w-5 h-5" />
              </button>
            </div>
            {renderContent(true)}
          </div>
        </div>
      )}
    </>
  );
}

export default PostsSidebar;
