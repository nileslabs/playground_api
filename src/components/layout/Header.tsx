'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { LandingHeader } from './headers/LandingHeader';
import { DocsHeader } from './headers/DocsHeader';
import { GeneralHeader } from './headers/GeneralHeader';

/**
 * Header Dispatcher Component
 * Dynamically routes to the specialized header for each context:
 * 1. Landing Page ('/') -> LandingHeader (revamped aesthetic & full landing actions)
 * 2. Documentation ('/docs/*') -> DocsHeader (sidebar drawer, sandbox pill, share & stats modals)
 * 3. Rest of the pages ('/blog', '/prototyping', '/comparisons', etc.) -> GeneralHeader
 */
export function Header() {
  const pathname = usePathname();

  // 1. Landing Page
  if (pathname === '/') {
    return <LandingHeader />;
  }

  // 2. Documentation Pages
  if (pathname.startsWith('/docs')) {
    return <DocsHeader />;
  }

  // 3. Rest of the pages (Blog, Prototyping, Comparisons, Datasets, etc.)
  return <GeneralHeader />;
}

export default Header;
