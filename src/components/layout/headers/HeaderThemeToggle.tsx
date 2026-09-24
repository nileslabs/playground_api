'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Icon } from '@iconify/react';
import { useTheme } from '@/components/theme/ThemeProvider';

export function HeaderThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
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

  const activeTheme = mounted ? theme : 'light';

  // Toggle directly when clicked, or open dropdown
  const toggleTheme = () => {
    setTheme(activeTheme === 'dark' ? 'light' : 'dark');
  };

  return (
    <div className="relative inline-flex items-center" ref={dropdownRef} suppressHydrationWarning>
      <button
        type="button"
        onClick={toggleTheme}
        onContextMenu={(e) => {
          e.preventDefault();
          setIsOpen((prev) => !prev);
        }}
        className="flex items-center justify-center p-2 rounded-xl bg-bg-secondary/80 hover:bg-bg-tertiary border border-border-theme hover:border-accent-primary/40 text-text-secondary hover:text-text-primary transition-all cursor-pointer group shadow-2xs"
        aria-label={`Current theme is ${activeTheme}. Click to switch theme.`}
        title={`Theme: ${activeTheme === 'dark' ? 'Dark' : 'Light'} (Click to toggle, right-click for menu)`}
      >
        <Icon
          icon={activeTheme === 'dark' ? 'ph:moon-stars-bold' : 'ph:sun-dim-bold'}
          className="w-4 h-4 text-accent-primary transition-transform group-hover:rotate-12 group-hover:scale-110"
        />
      </button>

      {/* Optional dropdown menu */}
      {isOpen && (
        <div className="absolute right-0 top-full pt-2 z-50">
          <div className="w-36 flex flex-col gap-1 bg-bg-secondary border border-border-theme rounded-xl shadow-2xl p-1.5 animate-in fade-in zoom-in-95 duration-150 backdrop-blur-md">
            <button
              type="button"
              onClick={() => {
                setTheme('light');
                setIsOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                activeTheme === 'light'
                  ? 'bg-accent-light text-accent-primary'
                  : 'text-text-secondary hover:text-text-primary hover:bg-bg-tertiary'
              }`}
            >
              <span className="flex items-center gap-2">
                <Icon icon="ph:sun-bold" className="w-4 h-4 text-amber-500" /> Light
              </span>
              {activeTheme === 'light' && <Icon icon="ph:check-bold" className="w-3.5 h-3.5 text-accent-primary" />}
            </button>
            <button
              type="button"
              onClick={() => {
                setTheme('dark');
                setIsOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                activeTheme === 'dark'
                  ? 'bg-accent-light text-accent-primary'
                  : 'text-text-secondary hover:text-text-primary hover:bg-bg-tertiary'
              }`}
            >
              <span className="flex items-center gap-2">
                <Icon icon="ph:moon-bold" className="w-4 h-4 text-indigo-400" /> Dark
              </span>
              {activeTheme === 'dark' && <Icon icon="ph:check-bold" className="w-3.5 h-3.5 text-accent-primary" />}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export function MobileThemeSwitch() {
  const { theme, setTheme } = useTheme();
  return (
    <div className="flex items-center gap-1 bg-bg-tertiary p-1 rounded-xl border border-border-theme w-full">
      <button
        onClick={() => setTheme('light')}
        className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
          theme === 'light'
            ? 'bg-accent-primary text-white shadow-xs'
            : 'text-text-secondary hover:text-text-primary'
        }`}
      >
        <Icon icon="ph:sun-bold" className="w-4 h-4" /> Light
      </button>
      <button
        onClick={() => setTheme('dark')}
        className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
          theme === 'dark'
            ? 'bg-accent-primary text-white shadow-xs'
            : 'text-text-secondary hover:text-text-primary'
        }`}
      >
        <Icon icon="ph:moon-bold" className="w-4 h-4" /> Dark
      </button>
    </div>
  );
}
