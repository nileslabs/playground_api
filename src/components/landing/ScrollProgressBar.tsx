'use client';

import React, { useEffect, useRef } from 'react';

export function ScrollProgressBar() {
  const barRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let ticking = false;

    const updateScrollProgress = () => {
      const el = barRef.current;
      if (!el) return;

      const scrollY = window.scrollY || document.documentElement.scrollTop;
      const totalScrollableHeight = document.documentElement.scrollHeight - window.innerHeight;

      if (totalScrollableHeight > 0) {
        const progress = Math.min(1, Math.max(0, scrollY / totalScrollableHeight));
        // GPU-accelerated transform: zero layout recalc, zero repaint, runs on GPU compositor
        el.style.transform = `scaleX(${progress})`;
        el.style.opacity = progress > 0.003 ? '1' : '0';
      } else {
        el.style.transform = 'scaleX(0)';
        el.style.opacity = '0';
      }

      ticking = false;
    };

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateScrollProgress);
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });
    updateScrollProgress();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="fixed top-0 left-0 right-0 z-9998 pointer-events-none h-[2.5px] sm:h-0.75 bg-transparent"
    >
      <div
        ref={barRef}
        className="h-full w-full origin-left bg-linear-to-r from-indigo-500 via-indigo-600 to-violet-600 shadow-[0_0_12px_rgba(99,102,241,0.85)] transition-opacity duration-200 ease-out will-change-transform"
        style={{
          transform: 'scaleX(0)',
          opacity: 0,
        }}
      />
    </div>
  );
}

export default ScrollProgressBar;
