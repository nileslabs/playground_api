'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { LandingHeader } from './LandingHeader';
import { AppHeader } from './AppHeader';
import { SearchModal } from './SearchModal';

export function Header() {
  const pathname = usePathname();
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Listen to global open-search-modal event
  useEffect(() => {
    const handleOpen = () => setIsSearchOpen(true);
    window.addEventListener('open-search-modal', handleOpen);
    return () => window.removeEventListener('open-search-modal', handleOpen);
  }, []);

  const isLandingPage = pathname === '/';

  return (
    <>
      {isLandingPage ? (
        <LandingHeader onOpenSearch={() => setIsSearchOpen(true)} />
      ) : (
        <AppHeader onOpenSearch={() => setIsSearchOpen(true)} />
      )}

      {/* Global Command+K Search Palette */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}

export default Header;
