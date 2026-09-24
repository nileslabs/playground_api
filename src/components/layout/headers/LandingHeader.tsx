'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Icon } from '@iconify/react';
import { LogoIcon } from '@/components/ui/LogoIcon';
import { SearchModal } from '@/components/layout/SearchModal';
import { HeaderThemeToggle, MobileThemeSwitch } from './HeaderThemeToggle';
import { siteConfig } from '@/config/site';

export function LandingHeader() {
  const pathname = usePathname();
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Detect scroll elevation
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 8);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const navLinks = [
    {
      label: 'Prototyping',
      fullLabel: 'Engineered for Real-World Prototyping',
      href: '/prototyping',
      icon: 'ph:wrench-bold',
      description: 'Persistent CRUD overlays & latency simulation',
    },
    {
      label: 'Alternatives',
      fullLabel: 'Compares to Alternatives',
      href: '/comparisons',
      icon: 'ph:scales-bold',
      description: 'Playground API vs JSONPlaceholder & DummyJSON',
    },
    {
      label: 'Mock Datasets',
      fullLabel: 'Explore Built-in Mock Datasets list',
      href: '/datasets',
      icon: 'ph:database-bold',
      description: 'Posts, Users, Comments, Todos, & Auth',
    },
    {
      label: 'Docs',
      fullLabel: 'Documentation',
      href: '/docs/introduction',
      icon: 'ph:book-open-text-bold',
      description: 'Interactive guides, SDKs, and REST catalog',
    },
    {
      label: 'Blogs',
      fullLabel: 'Engineering Blogs',
      href: '/blog',
      icon: 'ph:newspaper-clipping-bold',
      description: 'Deep dives and frontend architecture guides',
    },
    {
      label: 'Stats',
      fullLabel: 'Session Quotas & Stats',
      href: '/docs/stats',
      icon: 'ph:chart-bar-bold',
      description: 'Live quota usage, uptime, & telemetry',
    },
  ];

  return (
    <>
      <header
        className={`sticky top-0 z-40 w-full transition-all duration-200 border-b ${
          scrolled
            ? 'bg-bg-primary/95 backdrop-blur-md border-border-theme shadow-xs'
            : 'bg-bg-primary/85 backdrop-blur-sm border-border-theme/70'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          
          {/* Left: Brand Logo + Primary Nav Row */}
          <div className="flex items-center gap-4 sm:gap-6 min-w-0">
            {/* Mobile Hamburger Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl bg-bg-secondary hover:bg-bg-tertiary border border-border-theme text-text-primary transition-colors cursor-pointer xl:hidden shrink-0"
              aria-label="Toggle navigation menu"
              aria-expanded={mobileMenuOpen}
            >
              <Icon icon={mobileMenuOpen ? 'ph:x-bold' : 'ph:list-bold'} className="w-5 h-5" />
            </button>

            {/* Brand Logo */}
            <Link href="/" className="flex items-center gap-2.5 group shrink-0">
              <LogoIcon size={32} className="group-hover:scale-105 transition-transform shrink-0" />
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <span className="font-extrabold text-sm sm:text-base tracking-tight text-text-primary whitespace-nowrap">
                    Playground API
                  </span>
                  <span className="bg-accent-light text-accent-primary text-[10px] sm:text-xs font-bold px-1.5 py-0.5 rounded-md border border-accent-primary/20 shrink-0">
                    {siteConfig.apiVersion}
                  </span>
                </div>
                <span className="text-[11px] text-text-muted hidden sm:inline leading-none font-medium whitespace-nowrap">
                  Mock REST & GraphQL
                </span>
              </div>
            </Link>

            {/* Vertical Separator on Desktop */}
            <div className="h-6 w-px bg-border-theme hidden xl:block shrink-0" />

            {/* Desktop Navigation Links */}
            <nav className="hidden xl:flex items-center gap-1 shrink-0">
              {navLinks.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs sm:text-[13px] font-semibold whitespace-nowrap transition-all duration-150 group shrink-0 ${
                      isActive
                        ? 'bg-accent-light text-accent-primary border border-accent-primary/30 font-bold shadow-2xs'
                        : 'text-text-secondary hover:text-text-primary hover:bg-bg-secondary border border-transparent'
                    }`}
                    title={item.fullLabel}
                  >
                    <Icon
                      icon={item.icon}
                      className={`w-3.5 h-3.5 transition-colors shrink-0 ${
                        isActive ? 'text-accent-primary' : 'text-text-muted group-hover:text-accent-primary'
                      }`}
                    />
                    <span className="whitespace-nowrap">{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Right: Search, Theme, Studio CTA, GitHub */}
          <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
            {/* Search Trigger Button */}
            <button
              onClick={() => setSearchOpen(true)}
              className="flex items-center gap-2 px-2.5 sm:px-3 py-1.5 rounded-xl bg-bg-secondary hover:bg-bg-tertiary border border-border-theme hover:border-accent-primary/40 text-xs text-text-muted hover:text-text-primary transition-all cursor-pointer group shadow-2xs shrink-0"
              title="Search documentation and endpoints (⌘K or Ctrl+K)"
              aria-label="Search documentation and endpoints"
            >
              <Icon
                icon="ph:magnifying-glass-bold"
                className="w-4 h-4 text-accent-primary group-hover:scale-110 transition-transform shrink-0"
              />
              <span className="hidden md:inline font-medium text-text-secondary group-hover:text-text-primary whitespace-nowrap">
                Search...
              </span>
              <kbd className="hidden lg:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-mono font-bold text-text-muted bg-bg-tertiary border border-border-theme rounded-md group-hover:border-accent-primary/40 group-hover:text-accent-primary transition-colors">
                <span className="text-xs">⌘</span>K
              </kbd>
            </button>

            {/* Theme Toggle */}
            <HeaderThemeToggle />

            {/* GitHub Repo Link */}
            <a
              href={siteConfig.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-xl bg-bg-secondary hover:bg-bg-tertiary border border-border-theme hover:border-accent-primary/40 text-text-secondary hover:text-text-primary transition-colors shrink-0"
              title="View Playground API on GitHub"
              aria-label="GitHub Repository"
            >
              <Icon icon="simple-icons:github" className="w-4 h-4" />
            </a>

            {/* Interactive API Studio CTA Button */}
            <Link
              href="/docs/studio"
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-accent-primary hover:bg-accent-hover text-white text-xs font-bold shadow-xs hover:shadow-sm transition-all shrink-0"
            >
              <Icon icon="ph:play-circle-bold" className="w-4 h-4" />
              <span className="whitespace-nowrap">API Studio</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Mobile Slide-Over Navigation Drawer */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 top-16 z-50 bg-black/60 backdrop-blur-xs flex flex-col xl:hidden animate-in fade-in duration-200"
          onClick={(e) => {
            if (e.target === e.currentTarget) setMobileMenuOpen(false);
          }}
        >
          <div className="bg-bg-primary border-b border-border-theme shadow-2xl p-5 max-h-[calc(100vh-4rem)] overflow-y-auto space-y-4 w-full">
            {/* Drawer Header */}
            <div className="flex items-center justify-between pb-3 border-b border-border-theme">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-text-muted">
                <Icon icon="ph:compass-bold" className="w-4 h-4 text-accent-primary" />
                Navigation Menu
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-1.5 rounded-lg hover:bg-bg-tertiary text-text-muted hover:text-text-primary cursor-pointer"
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

            {/* Navigation Links with Full Context & Descriptions */}
            <div className="space-y-1.5">
              {navLinks.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-start gap-3 p-3 rounded-xl border transition-all ${
                      isActive
                        ? 'bg-accent-light border-accent-primary/40 text-accent-primary'
                        : 'bg-bg-secondary/60 hover:bg-bg-secondary border-border-theme text-text-primary'
                    }`}
                  >
                    <div className="p-2 rounded-lg bg-bg-tertiary text-accent-primary shrink-0 mt-0.5">
                      <Icon icon={item.icon} className="w-4 h-4" />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-xs sm:text-sm font-bold text-text-primary">
                        {item.fullLabel}
                      </span>
                      <span className="text-[11px] text-text-muted truncate">
                        {item.description}
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>

            {/* Mobile Quick API Studio CTA */}
            <div className="pt-2">
              <Link
                href="/docs/studio"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-accent-primary text-white font-bold text-xs shadow-xs hover:bg-accent-hover transition-colors"
              >
                <Icon icon="ph:play-circle-bold" className="w-4 h-4" />
                <span>Launch Interactive API Studio</span>
              </Link>
            </div>

            {/* Theme Controls & Footer */}
            <div className="pt-4 border-t border-border-theme space-y-3">
              <div className="space-y-1.5">
                <span className="text-xs font-semibold text-text-muted uppercase tracking-wider">
                  Theme Appearance
                </span>
                <MobileThemeSwitch />
              </div>

              <div className="pt-2 flex items-center justify-between text-xs text-text-muted">
                <span>Playground API {siteConfig.apiVersion}</span>
                <a
                  href={siteConfig.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-accent-primary hover:underline font-semibold"
                >
                  <Icon icon="simple-icons:github" className="w-3.5 h-3.5" /> GitHub
                </a>
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
