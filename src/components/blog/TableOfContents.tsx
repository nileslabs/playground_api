'use client';

import React, { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import { TableOfContentsItem } from '@/lib/blog';

interface TableOfContentsProps {
  headings: TableOfContentsItem[];
}

export function TableOfContents({ headings }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);
  const [scrollProgress, setScrollProgress] = useState<number>(0);

  useEffect(() => {
    if (!headings.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      {
        rootMargin: '-80px 0% -60% 0%',
        threshold: 0.1,
      }
    );

    headings.forEach((heading) => {
      const el = document.getElementById(heading.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [headings]);

  // Track scroll percentage
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const progress = Math.min(100, Math.max(0, Math.round((window.scrollY / totalHeight) * 100)));
        setScrollProgress(progress);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!headings.length) return null;

  return (
    <nav className="p-4 sm:p-5 rounded-2xl border border-slate-200 bg-white/90 backdrop-blur-md space-y-3 shadow-xs">
      <div className="flex items-center justify-between pb-2 border-b border-slate-100">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-900">
          <Icon icon="ph:list-bullets-bold" className="w-4 h-4 text-indigo-600" />
          <span>Table of Contents</span>
        </div>
        <span className="text-[10px] font-mono text-slate-400 font-semibold">{scrollProgress}%</span>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-100 h-1 rounded-full overflow-hidden">
        <div
          className="bg-indigo-600 h-full rounded-full transition-all duration-150"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      <ul className="space-y-1 text-xs max-h-[50vh] overflow-y-auto pr-1">
        {headings.map((h) => {
          const isActive = activeId === h.id;
          return (
            <li
              key={h.id}
              style={{ paddingLeft: `${(h.level - 2) * 12}px` }}
              className="leading-snug"
            >
              <a
                href={`#${h.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  const target = document.getElementById(h.id);
                  if (target) {
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    setActiveId(h.id);
                  }
                }}
                className={`block py-1 px-2 rounded-lg transition-colors truncate ${
                  isActive
                    ? 'bg-indigo-50 text-indigo-700 font-bold border-l-2 border-indigo-600 pl-2.5 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
                title={h.text}
              >
                {h.text}
              </a>
            </li>
          );
        })}
      </ul>

      {/* Quick Action Buttons */}
      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
        <button
          type="button"
          onClick={handleCopyLink}
          className="inline-flex items-center gap-1.5 hover:text-slate-900 transition-colors cursor-pointer"
        >
          <Icon icon={copied ? "ph:check-bold" : "ph:link-bold"} className={copied ? "text-emerald-600" : "text-slate-400"} />
          <span>{copied ? 'Copied' : 'Share link'}</span>
        </button>

        <button
          type="button"
          onClick={handleScrollToTop}
          className="inline-flex items-center gap-1 hover:text-slate-900 transition-colors cursor-pointer"
        >
          <Icon icon="ph:arrow-up-bold" className="text-slate-400" />
          <span>Top</span>
        </button>
      </div>
    </nav>
  );
}

export default TableOfContents;
