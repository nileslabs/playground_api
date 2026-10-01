'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { LandingFooter } from './LandingFooter';

export function Footer() {
  const pathname = usePathname();
  const isDocs = pathname?.startsWith('/docs');

  // Do not render full 6-column marketing mega-footer in docs reading workspace
  if (isDocs) {
    return null;
  }

  return <LandingFooter />;
}

export default Footer;
