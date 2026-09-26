'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { LandingFooter } from './LandingFooter';
import { DocsFooter } from './DocsFooter';
import { BlogFooter } from './BlogFooter';

export function Footer() {
  const pathname = usePathname();

  if (pathname === '/') {
    return <LandingFooter />;
  }

  if (pathname.startsWith('/blog')) {
    return <BlogFooter />;
  }

  // Default to DocsFooter for /docs and other inner pages
  return <DocsFooter />;
}

export default Footer;
