'use client';

import React, { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import { TableOfContentsItem } from '@/lib/blog';

interface TableOfContentsProps {
  headings: TableOfContentsItem[];
}

export function TableOfContents({ headings }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>('');

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

  if (!headings.length) return null;

  return (
    <nav className="p-4 sm:p-5 rounded-2xl border border-border-theme bg-bg-secondary/60 backdrop-blur-md space-y-3 shadow-xs">
      <div className="flex items-center gap-2 pb-2.5 border-b border-border-theme text-xs font-bold uppercase tracking-wider text-text-muted">
        <Icon icon="ph:list-bullets-bold" className="w-4 h-4 text-accent-primary" />
        Table of Contents
      </div>

      <ul className="space-y-1.5 text-xs max-h-[70vh] overflow-y-auto pr-1">
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
                className={`block py-1 px-2 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-accent-light text-accent-primary font-bold border-l-2 border-accent-primary pl-2.5'
                    : 'text-text-secondary hover:text-text-primary hover:bg-bg-tertiary'
                }`}
              >
                {h.text}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
