'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Icon } from '@iconify/react';
import { useTheme } from '@/components/theme/ThemeProvider';
import { useLiveCounts } from '@/context/CountsContext';
import { LogoIcon } from '@/components/ui/LogoIcon';
import { SandboxPill } from '@/components/dashboard/SandboxPill';
import { StatsModal } from '@/components/dashboard/StatsModal';
import { ShareSandboxModal } from '@/components/dashboard/ShareSandboxModal';
import { SearchModal } from '@/components/layout/SearchModal';
import { Sidebar } from '@/components/layout/Sidebar';
import { siteConfig } from '@/config/site';

export function Header() {
  const pathname = usePathname();
  const { counts, totalGlobalRecords } = useLiveCounts();
  const [statsOpen, setStatsOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Global keyboard shortcut listener for Cmd+K / Ctrl+K and '/'
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isMac = typeof navigator !== 'undefined' && /Mac|iPod|iPhone|iPad/.test(navigator.platform);
      const isCmdK = (isMac ? e.metaKey : e.ctrlKey) && e.key.toLowerCase() === 'k';
      const isSlash = e.key === '/' && !['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement)?.tagName);

      if (isCmdK || isSlash) {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const totalRecords =
    totalGlobalRecords ||
    (Number(counts.users) || 0) +
    (Number(counts.posts) || 0) +
    (Number(counts.comments) || 0) +
    (Number(counts.todos) || 0);

  return (
    <>
      <header className="sticky top-0 z-40 w-full glass-header backdrop-blur-md transition-colors">
        <div className="w-full px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2 sm:gap-4">
          {/* Left: Brand Logo, Title & Version */}
          <div className="flex items-center gap-3 sm:gap-6 min-w-0">
            {/* Mobile Hamburger Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl bg-bg-surface-elevated hover:bg-bg-surface-subtle border border-border-default text-text-primary transition-colors cursor-pointer md:hidden shrink-0"
              aria-label="Toggle navigation menu"
            >
              <Icon icon={mobileMenuOpen ? 'ph:x-bold' : 'ph:list-bold'} className="w-5 h-5" />
            </button>

            <Link href="/" className="flex items-center gap-2.5 sm:gap-3 group shrink-0">
              <LogoIcon size={32} className="group-hover:scale-105 transition-transform shrink-0" />
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-sm sm:text-base tracking-tight text-text-primary truncate">
                    Playground API
                  </span>
                  <span className="bg-brand-primary/10 text-brand-primary text-[10px] sm:text-xs font-bold font-mono px-1.5 py-0.5 rounded-md border border-brand-primary/20 hidden xs:inline-block">
                    {siteConfig.apiVersion}
                  </span>
                </div>
                <span className="text-[11px] text-text-muted hidden md:inline leading-tight">
                  Stateful Mock REST & GraphQL
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden xl:flex items-center gap-1 ml-2">
              <Link
                href="/docs/introduction"
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  pathname.startsWith('/docs') && !pathname.startsWith('/docs/studio') && !pathname.startsWith('/docs/graphql')
                    ? 'text-brand-primary font-semibold bg-brand-primary/10'
                    : 'text-text-secondary hover:text-text-primary hover:bg-bg-surface-elevated'
                }`}
              >
                Docs
              </Link>
              <Link
                href="/docs/studio"
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  pathname === '/docs/studio'
                    ? 'text-brand-primary font-semibold bg-brand-primary/10'
                    : 'text-text-secondary hover:text-text-primary hover:bg-bg-surface-elevated'
                }`}
              >
                API Studio
              </Link>
              <Link
                href="/docs/graphql"
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  pathname.startsWith('/docs/graphql')
                    ? 'text-brand-primary font-semibold bg-brand-primary/10'
                    : 'text-text-secondary hover:text-text-primary hover:bg-bg-surface-elevated'
                }`}
              >
                GraphQL
              </Link>
              <Link
                href="/docs/collections/openapi"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-text-secondary hover:text-text-primary hover:bg-bg-surface-elevated transition-all"
              >
                Collections
              </Link>
              <Link
                href="/blog"
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  pathname.startsWith('/blog')
                    ? 'text-brand-primary font-semibold bg-brand-primary/10'
                    : 'text-text-secondary hover:text-text-primary hover:bg-bg-surface-elevated'
                }`}
              >
                Blog
              </Link>
            </nav>
          </div>

          {/* Right: Search, Live Telemetry, Sandbox Pill & Actions */}
          <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
            {/* Search Trigger Button */}
            <button
              onClick={() => setSearchOpen(true)}
              className="flex items-center gap-2 px-2.5 sm:px-3.5 py-1.5 rounded-xl bg-bg-surface-elevated/70 hover:bg-bg-surface-elevated border border-border-default hover:border-brand-primary/40 text-xs text-text-muted hover:text-text-primary transition-all cursor-pointer group shadow-2xs"
              title="Search documentation and endpoints (⌘K or Ctrl+K)"
              aria-label="Search documentation and endpoints"
            >
              <Icon icon="ph:magnifying-glass-bold" className="w-3.5 h-3.5 text-brand-primary group-hover:scale-110 transition-transform" />
              <span className="hidden sm:inline font-medium text-text-secondary group-hover:text-text-primary">
                Search docs & endpoints...
              </span>
              <kbd className="hidden md:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-mono font-bold text-text-muted bg-bg-surface-subtle border border-border-default rounded-md group-hover:border-brand-primary/40 group-hover:text-brand-primary transition-colors">
                <span className="text-[11px]">⌘</span>K
              </kbd>
            </button>

            {/* Live Database Stats Pill */}
            <button
              onClick={() => setStatsOpen(true)}
              className="hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-bg-surface-elevated/70 hover:bg-bg-surface-elevated border border-border-default hover:border-border-hover text-xs font-medium text-text-secondary hover:text-text-primary transition-all cursor-pointer"
              title="View Live Session Quotas & Record Counts"
            >
              <Icon icon="ph:database-bold" className="w-3.5 h-3.5 text-brand-primary" />
              <span className="font-mono text-[11px] font-semibold text-text-primary">
                {totalRecords > 0 ? `${totalRecords} rows` : 'DB Live'}
              </span>
            </button>

            {/* Sandbox Identity Pill */}
            <div className="hidden xs:block">
              <SandboxPill onOpenShare={() => setShareOpen(true)} />
            </div>

            {/* Theme Selector */}
            <ThemeSelector />

            {/* GitHub Repo Button */}
            <a
              href={siteConfig.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-xl bg-bg-surface-elevated/70 hover:bg-bg-surface-elevated border border-border-default hover:border-border-hover text-text-secondary hover:text-text-primary transition-colors"
              title="View GitHub Repository"
              aria-label="View GitHub Repository"
            >
              <Icon icon="simple-icons:github" className="w-4 h-4" />
            </a>
          </div>
        </div>
      </header>

      {/* Mobile Slide-Over Navigation Drawer */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 top-16 z-50 bg-black/75 backdrop-blur-sm flex flex-col md:hidden animate-in fade-in duration-200"
          onClick={(e) => {
            if (e.target === e.currentTarget) setMobileMenuOpen(false);
          }}
        >
          <div className="bg-bg-surface border-b border-border-default shadow-2xl p-4 max-h-[calc(100vh-4rem)] overflow-y-auto space-y-4 w-full">
            <div className="flex items-center justify-between pb-3 border-b border-border-subtle">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-text-muted">
                <Icon icon="ph:compass-bold" className="w-4 h-4 text-brand-primary" />
                Documentation Menu
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-1 rounded-lg hover:bg-bg-surface-elevated text-text-muted hover:text-text-primary cursor-pointer"
                aria-label="Close menu"
              >
                <Icon icon="ph:x-bold" className="w-5 h-5" />
              </button>
            </div>

            {/* Mobile Sidebar Navigation Links */}
            <Sidebar onSelect={() => setMobileMenuOpen(false)} className="border-r-0 p-0 shadow-none" />

            {/* Mobile Search Button */}
            <div className="pt-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setSearchOpen(true);
                }}
                className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-bg-surface-subtle border border-border-default text-xs font-semibold text-text-primary hover:border-brand-primary/40 transition-colors cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <Icon icon="ph:magnifying-glass-bold" className="w-4 h-4 text-brand-primary" />
                  Search Documentation...
                </span>
                <kbd className="px-1.5 py-0.5 rounded bg-bg-surface-elevated border border-border-default text-[10px] text-text-muted font-mono">
                  ⌘K
                </kbd>
              </button>
            </div>

            {/* Mobile Footer Extra Actions */}
            <div className="pt-4 border-t border-border-subtle space-y-3">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs text-text-muted font-medium">Theme Mode</span>
                <MobileThemeToggle />
              </div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs text-text-muted font-medium">Sandbox Session</span>
                <SandboxPill onOpenShare={() => setShareOpen(true)} />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Stats Modal */}
      <StatsModal
        isOpen={statsOpen}
        onClose={() => setStatsOpen(false)}
        onOpenShare={() => {
          setStatsOpen(false);
          setShareOpen(true);
        }}
      />

      {/* Share & QR Sync Modal */}
      <ShareSandboxModal isOpen={shareOpen} onClose={() => setShareOpen(false)} />

      {/* Command+K Search Modal */}
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}

function MobileThemeToggle() {
  const { theme, setTheme } = useTheme();
  return (
    <div className="flex items-center gap-1 bg-bg-surface-subtle p-1 rounded-xl border border-border-default">
      <button
        onClick={() => setTheme('light')}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
          theme === 'light'
            ? 'bg-brand-primary text-white shadow-xs'
            : 'text-text-secondary hover:text-text-primary'
        }`}
      >
        <Icon icon="ph:sun-bold" className="w-3.5 h-3.5" /> Light
      </button>
      <button
        onClick={() => setTheme('dark')}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
          theme === 'dark'
            ? 'bg-brand-primary text-white shadow-xs'
            : 'text-text-secondary hover:text-text-primary'
        }`}
      >
        <Icon icon="ph:moon-bold" className="w-3.5 h-3.5" /> Dark
      </button>
    </div>
  );
}

function ThemeSelector() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  const [isOpen, setIsOpen] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent | TouchEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isOpen]);

  const activeTheme = mounted ? theme : 'dark';

  return (
    <div className="relative" ref={dropdownRef} suppressHydrationWarning>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center gap-1.5 p-2 rounded-xl bg-bg-surface-elevated/70 hover:bg-bg-surface-elevated border border-border-default hover:border-border-hover text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
        aria-label="Toggle theme selection"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <Icon
          icon={activeTheme === 'dark' ? 'ph:moon-bold' : 'ph:sun-bold'}
          className="w-4 h-4 text-brand-primary"
        />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 top-full pt-2 z-50">
          <div className="w-36 flex flex-col gap-1 bg-bg-surface-elevated border border-border-default rounded-xl shadow-2xl p-1.5 animate-in fade-in zoom-in-95 duration-150">
            <button
              type="button"
              onClick={() => {
                setTheme('light');
                setIsOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                activeTheme === 'light'
                  ? 'bg-brand-primary/10 text-brand-primary font-bold'
                  : 'text-text-secondary hover:text-text-primary hover:bg-bg-surface-subtle'
              }`}
            >
              <span className="flex items-center gap-2">
                <Icon icon="ph:sun-bold" className="w-4 h-4 text-amber-500" /> Light
              </span>
              {activeTheme === 'light' && <Icon icon="ph:check-bold" className="w-3.5 h-3.5 text-brand-primary" />}
            </button>
            <button
              type="button"
              onClick={() => {
                setTheme('dark');
                setIsOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                activeTheme === 'dark'
                  ? 'bg-brand-primary/10 text-brand-primary font-bold'
                  : 'text-text-secondary hover:text-text-primary hover:bg-bg-surface-subtle'
              }`}
            >
              <span className="flex items-center gap-2">
                <Icon icon="ph:moon-bold" className="w-4 h-4 text-brand-primary" /> Dark
              </span>
              {activeTheme === 'dark' && <Icon icon="ph:check-bold" className="w-3.5 h-3.5 text-brand-primary" />}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
