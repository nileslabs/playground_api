'use client';

import React, { useState, useEffect, useRef } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

export function NavigationProgressBar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const resetTimerRef = useRef<NodeJS.Timeout | null>(null);

  const startProgress = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (resetTimerRef.current) clearTimeout(resetTimerRef.current);

    setIsVisible(true);
    setProgress(20);

    timerRef.current = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 85) {
          if (timerRef.current) clearInterval(timerRef.current);
          return 85;
        }
        // Smooth asymptotic easing towards 85%
        const diff = 85 - prev;
        const step = Math.max(1, diff * 0.15);
        return prev + step;
      });
    }, 120);
  };

  const completeProgress = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setProgress(100);

    resetTimerRef.current = setTimeout(() => {
      setIsVisible(false);
      resetTimerRef.current = setTimeout(() => {
        setProgress(0);
      }, 250);
    }, 150);
  };

  // Complete progress on any route or search param update
  useEffect(() => {
    completeProgress();
  }, [pathname, searchParams]);

  // Intercept click on internal links across the whole document
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      // Find closest anchor tag
      const anchor = (e.target as HTMLElement)?.closest('a');
      if (!anchor) return;

      const href = anchor.getAttribute('href');
      const target = anchor.getAttribute('target');

      // Ignore external, anchor hashes, mailto, tel, or special key combinations
      if (
        !href ||
        href.startsWith('#') ||
        href.startsWith('mailto:') ||
        href.startsWith('tel:') ||
        href.startsWith('javascript:') ||
        href.startsWith('http://') ||
        href.startsWith('https://') ||
        target === '_blank' ||
        e.metaKey ||
        e.ctrlKey ||
        e.shiftKey ||
        e.altKey ||
        e.defaultPrevented
      ) {
        return;
      }

      // Compare target path with current location
      const currentPath = window.location.pathname;
      const targetPath = href.split('?')[0].split('#')[0];

      // If navigating to a different page, trigger progress bar immediately
      if (targetPath && targetPath !== currentPath) {
        startProgress();
      }
    };

    document.addEventListener('click', handleClick, { capture: true });
    return () => {
      document.removeEventListener('click', handleClick, { capture: true });
      if (timerRef.current) clearInterval(timerRef.current);
      if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
    };
  }, []);

  if (!isVisible && progress === 0) return null;

  return (
    <div
      aria-hidden="true"
      className="fixed top-0 left-0 right-0 z-[9999] pointer-events-none h-[2.5px] bg-transparent"
    >
      <div
        className="h-full bg-linear-to-r from-indigo-500 via-indigo-600 to-violet-600 shadow-[0_0_10px_rgba(99,102,241,0.7)]"
        style={{
          width: `${progress}%`,
          opacity: isVisible ? 1 : 0,
          transition:
            progress === 100
              ? 'width 150ms ease-out, opacity 250ms ease-in'
              : 'width 250ms ease-out',
        }}
      />
    </div>
  );
}

export default NavigationProgressBar;
