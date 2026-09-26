'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import { Icon } from '@iconify/react';
import { cn } from '@/lib/utils';
import siteConfig from '@/config/site';

export interface TocItem {
  id: string;
  title: string;
  level: number;
}

interface OnThisPageProps {
  className?: string;
  contentSelector?: string;
}

export function OnThisPage({ className = '', contentSelector = '#docs-content' }: OnThisPageProps) {
  const pathname = usePathname();
  const [headings, setHeadings] = useState<TocItem[]>([]);
  const [activeId, setActiveId] = useState<string>('');
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [scrollProgress, setScrollProgress] = useState<number>(0);

  // Load saved collapse preference
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('pg_toc_collapsed');
      if (saved === 'true') {
        setIsCollapsed(true);
      }
    }
  }, []);

  const toggleCollapse = () => {
    setIsCollapsed((prev) => {
      const next = !prev;
      if (typeof window !== 'undefined') {
        localStorage.setItem('pg_toc_collapsed', String(next));
      }
      return next;
    });
  };

  // Copy current URL to clipboard
  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Scroll to top
  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Extract table of contents headings from the active documentation page
  const parseHeadings = useCallback(() => {
    const content = document.querySelector(contentSelector);
    if (!content) return;

    const items: TocItem[] = [];
    const seenIds = new Set<string>();

    const topHeader = content.querySelector('h1');
    const overviewEl = document.getElementById('overview');
    if (topHeader || overviewEl) {
      items.push({
        id: 'overview',
        title: 'Overview',
        level: 2,
      });
      seenIds.add('overview');
    }

    const queryElements = content.querySelectorAll(
      'h2[id], h3[id], [data-toc-id], .scroll-mt-20[id]'
    );

    queryElements.forEach((el) => {
      const id = el.getAttribute('data-toc-id') || el.id;
      if (!id || seenIds.has(id) || id === 'overview' || id === 'docs-content') return;

      let title = el.getAttribute('data-toc-title') || '';
      if (!title) {
        const innerHeading = el.querySelector('h2, h3');
        if (innerHeading && innerHeading.textContent) {
          title = innerHeading.textContent.trim();
        } else if (el.textContent) {
          title = el.textContent.trim();
        }
      }

      if (title && title.length > 0 && title.length < 80) {
        title = title.replace(/^#\s*/, '').replace(/^[A-Z]+\s+\//, '').trim();
        const tagName = el.tagName.toLowerCase();
        const level = tagName === 'h3' ? 3 : 2;

        items.push({ id, title, level });
        seenIds.add(id);
      }
    });

    setHeadings(items);
    if (items.length > 0 && !activeId) {
      setActiveId(items[0].id);
    }
  }, [contentSelector, activeId]);

  useEffect(() => {
    const timer = setTimeout(parseHeadings, 150);
    const observer = new MutationObserver(() => parseHeadings());
    const contentNode = document.querySelector(contentSelector);
    if (contentNode) {
      observer.observe(contentNode, { childList: true, subtree: true });
    }

    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, [pathname, parseHeadings, contentSelector]);

  // Track active heading & scroll percentage on scroll
  useEffect(() => {
    const handleScroll = () => {
      // Calculate reading progress
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const progress = Math.min(100, Math.max(0, Math.round((window.scrollY / totalHeight) * 100)));
        setScrollProgress(progress);
      }

      if (headings.length === 0) return;

      const scrollPos = window.scrollY + 140;

      if (window.scrollY < 100 && headings.length > 0) {
        setActiveId(headings[0].id);
        return;
      }

      let currentActive = headings[0]?.id || '';
      for (const item of headings) {
        const el = document.getElementById(item.id);
        if (el) {
          const top = el.getBoundingClientRect().top + window.scrollY;
          if (top <= scrollPos) {
            currentActive = item.id;
          }
        }
      }

      if (currentActive) {
        setActiveId(currentActive);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [headings]);

  const scrollToHeading = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    setActiveId(id);

    if (id === 'overview') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      window.history.replaceState(null, '', window.location.pathname);
      return;
    }

    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      window.history.replaceState(null, '', `#${id}`);
    }
  };

  if (headings.length === 0) {
    return null;
  }

  return (
    <aside
      className={cn(
        "shrink-0 border-l border-slate-200 bg-white transition-all duration-300 ease-in-out xl:sticky xl:top-16 xl:h-[calc(100vh-4rem)] xl:overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden flex flex-col justify-between",
        isCollapsed ? "w-12 p-2.5 flex flex-col items-center select-none overflow-x-hidden" : "w-60 lg:w-64 p-5",
        className
      )}
      aria-label="Table of contents"
    >
      {isCollapsed ? (
        <div className="flex flex-col items-center space-y-4 pt-1">
          <button
            type="button"
            onClick={toggleCollapse}
            className="p-2 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-500 hover:text-indigo-600 border border-slate-200 transition-colors cursor-pointer"
            title="Expand Table of Contents"
            aria-label="Expand Table of Contents"
          >
            <Icon icon="ph:sidebar-simple-bold" className="w-4 h-4 rotate-180 text-indigo-600" />
          </button>

          <button
            type="button"
            onClick={toggleCollapse}
            className="text-[11px] font-bold text-slate-400 hover:text-slate-800 tracking-widest uppercase py-2 cursor-pointer transition-colors"
            style={{ writingMode: 'vertical-rl' }}
            title="Click to expand Table of Contents"
          >
            On this page ({scrollProgress}%)
          </button>
        </div>
      ) : (
        <div className="space-y-4 flex flex-col h-full justify-between">
          <div className="space-y-3">
            {/* Header & Collapse Button */}
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-1.5">
                <Icon icon="ph:list-bullets-bold" className="w-3.5 h-3.5 text-indigo-600" />
                <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
                  On this page
                </h4>
              </div>

              <button
                type="button"
                onClick={toggleCollapse}
                className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                title="Collapse Table of Contents"
                aria-label="Collapse Table of Contents"
              >
                <Icon icon="ph:sidebar-simple-bold" className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Reading Scroll Progress Line */}
            <div className="w-full bg-slate-100 h-1 rounded-full overflow-hidden">
              <div
                className="bg-indigo-600 h-full rounded-full transition-all duration-150"
                style={{ width: `${scrollProgress}%` }}
              />
            </div>

            {/* Headings List */}
            <nav className="max-h-[calc(100vh-16rem)] overflow-y-auto pr-1 space-y-0.5">
              <ul className="space-y-0.5 text-xs">
                {headings.map((item) => {
                  const isActive = activeId === item.id;

                  return (
                    <li key={item.id}>
                      <a
                        href={`#${item.id}`}
                        onClick={(e) => scrollToHeading(item.id, e)}
                        className={cn(
                          "block py-1 px-2.5 rounded-lg transition-all truncate cursor-pointer",
                          item.level === 3 && "pl-5 text-slate-400 text-[11px]",
                          isActive
                            ? "text-indigo-700 font-semibold bg-indigo-50 border-l-2 border-indigo-600 shadow-2xs"
                            : "text-slate-600 hover:text-slate-900 hover:bg-slate-50 font-normal"
                        )}
                        title={item.title}
                      >
                        {item.title}
                      </a>
                    </li>
                  );
                })}
              </ul>
            </nav>
          </div>

          {/* Quick Actions Bar */}
          <div className="pt-3 border-t border-slate-100 space-y-1.5 text-xs text-slate-500">
            <button
              type="button"
              onClick={handleCopyLink}
              className="w-full flex items-center justify-between p-1.5 rounded-lg hover:bg-slate-50 hover:text-slate-800 transition-colors cursor-pointer"
            >
              <span className="flex items-center gap-1.5">
                <Icon icon={copied ? "ph:check-bold" : "ph:link-bold"} className={copied ? "text-emerald-600" : "text-slate-400"} />
                <span>{copied ? 'Link Copied!' : 'Copy page URL'}</span>
              </span>
              <kbd className="text-[10px] font-mono text-slate-400">URL</kbd>
            </button>

            <button
              type="button"
              onClick={handleScrollToTop}
              className="w-full flex items-center justify-between p-1.5 rounded-lg hover:bg-slate-50 hover:text-slate-800 transition-colors cursor-pointer"
            >
              <span className="flex items-center gap-1.5">
                <Icon icon="ph:arrow-up-bold" className="text-slate-400" />
                <span>Scroll to top</span>
              </span>
              <span className="text-[10px] font-mono text-slate-400">{scrollProgress}%</span>
            </button>

            <a
              href={`${siteConfig.links.github}/blob/main/playground_api_fe/src/app${pathname}/page.tsx`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-between p-1.5 rounded-lg hover:bg-slate-50 hover:text-slate-800 transition-colors"
            >
              <span className="flex items-center gap-1.5">
                <Icon icon="ph:pencil-simple-line-bold" className="text-slate-400" />
                <span>Edit on GitHub</span>
              </span>
              <Icon icon="ph:arrow-square-out-bold" className="w-3 h-3 text-slate-400" />
            </a>
          </div>
        </div>
      )}
    </aside>
  );
}

export default OnThisPage;
