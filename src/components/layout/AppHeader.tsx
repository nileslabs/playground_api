'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Icon } from '@iconify/react';
import { LogoIcon } from '@/components/ui/LogoIcon';
import siteConfig from '@/config/site';

interface AppHeaderProps {
  onOpenSearch: () => void;
}

export function AppHeader({ onOpenSearch }: AppHeaderProps) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [navigatingTab, setNavigatingTab] = useState<string | null>(null);

  React.useEffect(() => {
    setNavigatingTab(null);
  }, [pathname]);

  const isDocs = pathname.startsWith('/docs') && !pathname.startsWith('/docs/toolkit/studio');
  const isBlog = pathname.startsWith('/blog');
  const isStudio = pathname.startsWith('/docs/toolkit/studio');

  const toggleSidebarMobile = () => {
    // Custom event to trigger mobile sidebar drawer in docs or blog
    window.dispatchEvent(new CustomEvent('toggle-sidebar-mobile'));
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/95 backdrop-blur-md transition-colors">
      <div className="mx-auto flex h-16 items-center justify-between px-3 sm:px-5 lg:px-8 gap-2 sm:gap-4">
        {/* Left Section: Logo */}
        <div className="flex items-center gap-2 sm:gap-4 shrink-0">
          <Link href="/" className="flex items-center gap-2 sm:gap-2.5 group focus:outline-none">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 border border-indigo-100 group-hover:border-indigo-300 transition-colors shadow-xs shrink-0">
              <LogoIcon className="h-4.5 w-4.5 text-indigo-600" size={18} />
            </div>
            <span className="font-bold text-sm sm:text-base text-slate-900 tracking-tight hidden xs:inline sm:inline">
              Playground API
            </span>
          </Link>
        </div>

        {/* Center Section: Search Input Bar (Refined for tablet landscape & desktop) */}
        <div className="flex-1 max-w-xs md:max-w-64 lg:max-w-sm xl:max-w-md mx-2 hidden md:block">
          <button
            type="button"
            onClick={onOpenSearch}
            className="w-full flex items-center justify-between px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50/80 hover:bg-slate-100/80 hover:border-indigo-300 text-slate-500 hover:text-slate-800 transition-all shadow-2xs group cursor-pointer"
          >
            <div className="flex items-center gap-2 truncate">
              <Icon
                icon="ph:magnifying-glass-bold"
                className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 transition-colors shrink-0"
              />
              <span className="text-xs font-normal truncate">Search docs & endpoints...</span>
            </div>
            <kbd className="hidden lg:inline-flex items-center gap-0.5 px-1.5 py-0.5 font-mono text-[10px] font-semibold text-slate-500 bg-white border border-slate-200 rounded-md shadow-2xs shrink-0">
              <span>⌘</span>K
            </kbd>
          </button>
        </div>

        {/* Right Section: Tabs (Desktop/Tablet), Search Icon & Navigation */}
        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          {/* Mobile & Tablet Portrait search icon button */}
          <button
            type="button"
            onClick={onOpenSearch}
            className="md:hidden p-2 text-slate-500 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors shrink-0"
            aria-label="Open Search"
          >
            <Icon icon="ph:magnifying-glass-bold" className="w-5 h-5 text-slate-600" />
          </button>

          {/* Section Switcher Tabs - Shown on md (tablets landscape & desktop), hidden on mobile phones */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-100/80 p-1 rounded-xl border border-slate-200/80 text-xs font-semibold shrink-0">
            <Link
              href="/docs/introduction"
              prefetch={true}
              onClick={() => {
                if (!isDocs) setNavigatingTab('docs');
              }}
              className={`px-3 py-1 rounded-lg transition-all inline-flex items-center gap-1.5 ${
                isDocs
                  ? 'bg-white text-indigo-700 shadow-2xs font-bold border border-slate-200/60'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              } ${navigatingTab === 'docs' ? 'opacity-70 pointer-events-none' : ''}`}
            >
              {navigatingTab === 'docs' && (
                <Icon icon="ph:spinner-gap-bold" className="w-3 h-3 text-indigo-600 animate-spin" />
              )}
              <span>Docs</span>
            </Link>
            <Link
              href="/blog"
              prefetch={true}
              onClick={() => {
                if (!isBlog) setNavigatingTab('blog');
              }}
              className={`px-3 py-1 rounded-lg transition-all inline-flex items-center gap-1.5 ${
                isBlog
                  ? 'bg-white text-indigo-700 shadow-2xs font-bold border border-slate-200/60'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              } ${navigatingTab === 'blog' ? 'opacity-70 pointer-events-none' : ''}`}
            >
              {navigatingTab === 'blog' ? (
                <Icon icon="ph:spinner-gap-bold" className="w-3 h-3 text-indigo-600 animate-spin" />
              ) : (
                <span>Blog</span>
              )}
              <span className="hidden xl:inline-block px-1.5 py-0.2 rounded-full bg-indigo-50 text-[10px] font-bold text-indigo-700 border border-indigo-200/80">
                Deep Dives
              </span>
            </Link>
            <Link
              href="/docs/toolkit/studio"
              prefetch={true}
              onClick={() => {
                if (!isStudio) setNavigatingTab('studio');
              }}
              className={`px-3 py-1 rounded-lg transition-all inline-flex items-center gap-1.5 ${
                isStudio
                  ? 'bg-white text-indigo-700 shadow-2xs font-bold border border-slate-200/60'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              } ${navigatingTab === 'studio' ? 'opacity-70 pointer-events-none' : ''}`}
            >
              {navigatingTab === 'studio' && (
                <Icon icon="ph:spinner-gap-bold" className="w-3 h-3 text-indigo-600 animate-spin" />
              )}
              <span>Studio</span>
            </Link>
          </nav>

          {/* GitHub link */}
          <Link
            href={siteConfig.links.github}
            target="_blank"
            rel="noopener noreferrer"
            className="p-1.5 text-slate-500 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors hidden md:inline-flex"
            title="GitHub Repository"
          >
            <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
              <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
            </svg>
          </Link>

          {/* Mobile Sidebar & Menu Toggle */}
          <div className="flex items-center gap-1 md:hidden">
            <button
              type="button"
              onClick={toggleSidebarMobile}
              className="p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors"
              title="Toggle Sidebar"
              aria-label="Toggle Sidebar"
            >
              <Icon icon="ph:sidebar-simple-bold" className="w-5 h-5 text-indigo-600" />
            </button>

            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors"
              aria-label="Toggle Navigation Menu"
            >
              <Icon icon={mobileMenuOpen ? "ph:x-bold" : "ph:dots-three-vertical-bold"} className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu dropdown for quick links */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 bg-white px-4 py-3 space-y-2 shadow-lg animate-in fade-in slide-in-from-top-2">
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-lg"
          >
            ← Back to Homepage
          </Link>
          <Link
            href="/docs/introduction"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-lg"
          >
            Documentation Home
          </Link>
          <Link
            href="/blog"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-lg"
          >
            Technical Blog & Deep Dives
          </Link>
          <Link
            href="/docs/toolkit/studio"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-lg"
          >
            Interactive API Studio
          </Link>
        </div>
      )}
    </header>
  );
}
