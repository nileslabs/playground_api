'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Icon } from '@iconify/react';
import { LogoIcon } from '@/components/ui/LogoIcon';
import { SandboxPill } from '@/components/dashboard/SandboxPill';
import { SearchModal } from '@/components/layout/SearchModal';
import { HeaderThemeToggle, MobileThemeSwitch } from './HeaderThemeToggle';
import { siteConfig } from '@/config/site';

export function GeneralHeader() {
  const pathname = usePathname();
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

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const navLinks = [
    { label: 'Prototyping', href: '/prototyping', icon: 'ph:wrench-bold' },
    { label: 'Alternatives', href: '/comparisons', icon: 'ph:scales-bold' },
    { label: 'Datasets', href: '/datasets', icon: 'ph:database-bold' },
    { label: 'Docs', href: '/docs/introduction', icon: 'ph:book-open-text-bold' },
    { label: 'Blog', href: '/blog', icon: 'ph:newspaper-clipping-bold' },
    { label: 'Stats', href: '/docs/stats', icon: 'ph:chart-bar-bold' },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 w-full glass-header transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
          {/* Left: Brand Logo & Title */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Mobile Hamburger Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl bg-bg-secondary hover:bg-bg-tertiary border border-border-theme text-text-primary transition-colors cursor-pointer lg:hidden shrink-0"
              aria-label="Toggle navigation menu"
            >
              <Icon icon={mobileMenuOpen ? 'ph:x-bold' : 'ph:list-bold'} className="w-5 h-5" />
            </button>

            <Link href="/" className="flex items-center gap-2.5 group">
              <LogoIcon size={32} className="group-hover:scale-105 transition-transform shrink-0" />
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <span className="font-extrabold text-sm sm:text-base tracking-tight text-text-primary">
                    Playground API
                  </span>
                  <span className="bg-accent-light text-accent-primary text-[10px] sm:text-xs font-bold px-1.5 py-0.5 rounded-md border border-accent-primary/20">
                    {siteConfig.apiVersion}
                  </span>
                </div>
                <span className="text-[11px] text-text-muted hidden md:inline leading-none font-medium">
                  Mock REST & GraphQL
                </span>
              </div>
            </Link>
          </div>

          {/* Center: Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((item) => {
              const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all group ${
                    isActive
                      ? 'bg-accent-light text-accent-primary border border-accent-primary/30 font-bold shadow-2xs'
                      : 'text-text-secondary hover:text-text-primary hover:bg-bg-secondary border border-transparent hover:border-border-theme'
                  }`}
                >
                  <Icon
                    icon={item.icon}
                    className={`w-3.5 h-3.5 ${
                      isActive ? 'text-accent-primary' : 'text-text-muted group-hover:text-accent-primary'
                    }`}
                  />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right: Search, Sandbox, Theme, GitHub */}
          <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
            {/* Search Trigger Button */}
            <button
              onClick={() => setSearchOpen(true)}
              className="flex items-center gap-2 px-2.5 sm:px-3.5 py-1.5 rounded-xl bg-bg-secondary hover:bg-bg-tertiary border border-border-theme text-xs sm:text-sm text-text-muted hover:text-text-primary transition-all cursor-pointer group shadow-2xs"
              title="Search documentation and endpoints (⌘K or Ctrl+K)"
              aria-label="Search documentation and endpoints"
            >
              <Icon
                icon="ph:magnifying-glass-bold"
                className="w-4 h-4 text-accent-primary group-hover:scale-110 transition-transform"
              />
              <span className="hidden sm:inline font-medium text-text-secondary group-hover:text-text-primary text-xs">
                Search...
              </span>
              <kbd className="hidden md:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-mono font-bold text-text-muted bg-bg-tertiary border border-border-theme rounded-md group-hover:border-accent-primary/40 group-hover:text-accent-primary transition-colors">
                <span className="text-xs">⌘</span>K
              </kbd>
            </button>

            {/* Sandbox Status Pill */}
            <div className="hidden sm:block">
              <SandboxPill />
            </div>

            {/* Theme Toggle */}
            <HeaderThemeToggle />

            {/* GitHub Repo Button */}
            <a
              href={siteConfig.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-xl bg-bg-secondary hover:bg-bg-tertiary border border-border-theme text-text-secondary hover:text-text-primary transition-colors"
              title="GitHub Repository"
            >
              <Icon icon="simple-icons:github" className="w-4 h-4" />
            </a>
          </div>
        </div>
      </header>

      {/* Mobile Slide-Over Drawer */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 top-16 z-50 bg-black/60 backdrop-blur-xs flex flex-col lg:hidden"
          onClick={(e) => {
            if (e.target === e.currentTarget) setMobileMenuOpen(false);
          }}
        >
          <div className="bg-bg-primary border-b border-border-theme shadow-2xl p-5 max-h-[calc(100vh-4rem)] overflow-y-auto space-y-5 w-full">
            <div className="flex items-center justify-between pb-3 border-b border-border-theme">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-text-muted">
                <Icon icon="ph:compass-bold" className="w-4 h-4 text-accent-primary" />
                Navigation Menu
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-1 rounded-lg hover:bg-bg-tertiary text-text-muted hover:text-text-primary cursor-pointer"
                aria-label="Close menu"
              >
                <Icon icon="ph:x-bold" className="w-5 h-5" />
              </button>
            </div>

            {/* Mobile Search Button */}
            <div>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setSearchOpen(true);
                }}
                className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl bg-bg-secondary border border-border-theme text-xs font-semibold text-text-primary hover:border-accent-primary/40 transition-colors cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <Icon icon="ph:magnifying-glass-bold" className="w-4 h-4 text-accent-primary" />
                  Search documents and endpoints...
                </span>
                <kbd className="px-1.5 py-0.5 rounded bg-bg-tertiary border border-border-theme text-[10px] text-text-muted">
                  ⌘K
                </kbd>
              </button>
            </div>

            {/* Navigation Links */}
            <div className="space-y-1.5">
              {navLinks.map((item) => {
                const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
                      isActive
                        ? 'bg-accent-light border-accent-primary/40 text-accent-primary font-bold'
                        : 'bg-bg-secondary/60 hover:bg-bg-secondary border-border-theme text-text-primary'
                    }`}
                  >
                    <div className="p-2 rounded-lg bg-bg-tertiary text-accent-primary">
                      <Icon icon={item.icon} className="w-4 h-4" />
                    </div>
                    <span className="text-sm font-semibold">{item.label}</span>
                  </Link>
                );
              })}
            </div>

            {/* Mobile Theme & Sandbox Controls */}
            <div className="pt-4 border-t border-border-theme space-y-3">
              <div className="space-y-1.5">
                <span className="text-xs font-semibold text-text-muted uppercase tracking-wider">
                  Theme Appearance
                </span>
                <MobileThemeSwitch />
              </div>
              <div className="flex items-center justify-between gap-2 pt-2 border-t border-border-theme/60">
                <span className="text-xs text-text-muted font-medium">Sandbox Session</span>
                <SandboxPill />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Global Command+K Search Modal */}
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
