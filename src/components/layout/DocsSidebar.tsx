'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Icon } from '@iconify/react';
import { siteConfig } from '@/config/site';
import { cn } from '@/lib/utils';

interface DocsSidebarProps {
  className?: string;
  onSelect?: () => void;
}

export function DocsSidebar({ className, onSelect }: DocsSidebarProps) {
  const pathname = usePathname();
  const [filterText, setFilterText] = useState('');
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  // Listen to mobile toggle from AppHeader
  useEffect(() => {
    const handleToggle = () => setMobileDrawerOpen((prev) => !prev);
    window.addEventListener('toggle-sidebar-mobile', handleToggle);
    return () => window.removeEventListener('toggle-sidebar-mobile', handleToggle);
  }, []);

  // Auto-expand group that contains active route
  useEffect(() => {
    const initial: Record<string, boolean> = {};
    siteConfig.nestedSidebarGroups.forEach((group) => {
      const hasActive = group.items.some((item) => item.href === pathname);
      initial[group.title] = hasActive ? true : (openGroups[group.title] ?? true);
    });
    setOpenGroups((prev) => ({ ...initial, ...prev }));
    // Close mobile drawer on route change
    setMobileDrawerOpen(false);
  }, [pathname]);

  const toggleGroup = (title: string) => {
    setOpenGroups((prev) => ({
      ...prev,
      [title]: prev[title] === false ? true : false,
    }));
  };

  const toggleCollapse = () => {
    setIsCollapsed((prev) => !prev);
  };

  // Filter sidebar groups based on text search
  const filteredGroups = useMemo(() => {
    const query = filterText.trim().toLowerCase();
    if (!query) return siteConfig.nestedSidebarGroups;

    return siteConfig.nestedSidebarGroups
      .map((group) => {
        const matchingItems = group.items.filter(
          (item) =>
            item.title.toLowerCase().includes(query) ||
            item.href.toLowerCase().includes(query) ||
            (item.badge && item.badge.toLowerCase().includes(query))
        );
        const groupMatches = group.title.toLowerCase().includes(query);

        if (groupMatches) return group;
        if (matchingItems.length > 0) {
          return {
            ...group,
            items: matchingItems,
          };
        }
        return null;
      })
      .filter(Boolean) as typeof siteConfig.nestedSidebarGroups;
  }, [filterText]);

  const renderContent = (isMobile = false) => (
    <div className="space-y-4">
      {/* Sidebar Header & Controls */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse" />
          <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            Documentation Tree
          </span>
        </div>

        {!isMobile && (
          <button
            type="button"
            onClick={toggleCollapse}
            className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            title="Collapse to icons"
            aria-label="Collapse Sidebar"
          >
            <Icon icon="ph:sidebar-simple-bold" className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Quick Filter Box */}
      <div className="relative">
        <Icon
          icon="ph:magnifying-glass-bold"
          className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none"
        />
        <input
          type="text"
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
          placeholder="Filter 15 categories..."
          className="w-full pl-8 pr-7 py-1.5 text-xs rounded-xl border border-slate-200 bg-slate-50/70 focus:bg-white focus:border-indigo-300 focus:outline-none placeholder:text-slate-400 text-slate-800 transition-all shadow-2xs"
        />
        {filterText && (
          <button
            type="button"
            onClick={() => setFilterText('')}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
            aria-label="Clear filter"
          >
            <Icon icon="ph:x-circle-fill" className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* 15 Accordion Groups */}
      <div className="space-y-1">
        {filteredGroups.length === 0 ? (
          <div className="py-8 text-center text-xs text-slate-400 space-y-1">
            <p>No endpoints match &ldquo;{filterText}&rdquo;</p>
            <button
              type="button"
              onClick={() => setFilterText('')}
              className="text-indigo-600 hover:underline font-medium"
            >
              Clear filter
            </button>
          </div>
        ) : (
          filteredGroups.map((group) => {
            const isOpen = filterText ? true : openGroups[group.title] !== false;

            return (
              <div key={group.title} className="space-y-0.5">
                <button
                  type="button"
                  onClick={() => toggleGroup(group.title)}
                  className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-50 transition-all cursor-pointer group select-none"
                >
                  <div className="flex items-center gap-2 truncate">
                    {group.icon && (
                      <Icon
                        icon={group.icon}
                        className="w-3.5 h-3.5 text-indigo-600 group-hover:scale-105 transition-transform shrink-0"
                      />
                    )}
                    <span className="truncate">{group.title}</span>
                  </div>
                  <Icon
                    icon="ph:caret-down-bold"
                    className={`w-3 h-3 text-slate-400 group-hover:text-slate-600 transition-transform duration-200 shrink-0 ${
                      isOpen ? 'rotate-0' : '-rotate-90'
                    }`}
                  />
                </button>

                {isOpen && (
                  <ul className="space-y-0.5 ml-2.5 pl-2 border-l border-slate-200/90 pt-0.5">
                    {group.items.map((item) => {
                      const isActive = pathname === item.href;

                      return (
                        <li key={item.href}>
                          <Link
                            href={item.href}
                            onClick={() => {
                              onSelect?.();
                              if (isMobile) setMobileDrawerOpen(false);
                            }}
                            className={cn(
                              "flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-all gap-2 group",
                              isActive
                                ? "bg-indigo-50 text-indigo-700 font-semibold border border-indigo-200/80 shadow-2xs"
                                : "text-slate-600 hover:text-slate-900 hover:bg-slate-50 font-normal"
                            )}
                          >
                            <div className="flex items-center gap-2 min-w-0">
                              <Icon
                                icon={item.icon}
                                className={cn(
                                  "w-3.5 h-3.5 shrink-0 transition-opacity",
                                  isActive ? "text-indigo-600 opacity-100" : "opacity-60 group-hover:opacity-100"
                                )}
                              />
                              <span className="truncate">{item.title}</span>
                            </div>
                            {item.badge && (
                              <span
                                className={cn(
                                  "text-[10px] px-1.5 py-0.2 rounded font-mono shrink-0 ml-1.5",
                                  isActive
                                    ? "bg-indigo-600 text-white font-medium"
                                    : "bg-slate-100 text-slate-500 border border-slate-200"
                                )}
                              >
                                {item.badge}
                              </span>
                            )}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sticky Sidebar */}
      <aside
        className={cn(
          "shrink-0 border-r border-slate-200 bg-white transition-all duration-300 ease-in-out md:sticky md:top-16 md:h-[calc(100vh-4rem)] md:overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden",
          isCollapsed
            ? "w-16 p-2 flex flex-col items-center select-none overflow-x-hidden"
            : "w-full md:w-64 lg:w-72 p-4",
          className
        )}
        aria-label="Documentation Navigation"
      >
        {isCollapsed ? (
          /* Collapsed Icon-Only View */
          <div className="w-full flex flex-col items-center space-y-3 pt-1">
            <button
              type="button"
              onClick={toggleCollapse}
              className="w-10 h-10 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 hover:text-indigo-600 flex items-center justify-center transition-colors cursor-pointer"
              title="Expand Sidebar"
              aria-label="Expand Sidebar"
            >
              <Icon icon="ph:sidebar-simple-bold" className="w-4 h-4 text-indigo-600" />
            </button>

            <div className="w-8 h-px bg-slate-200 my-1" />

            <nav className="w-full flex flex-col items-center space-y-4">
              {siteConfig.nestedSidebarGroups.map((group, gIdx) => (
                <div key={group.title} className="w-full flex flex-col items-center space-y-1.5">
                  {group.items.map((item) => {
                    const isActive = pathname === item.href;

                    return (
                      <div key={item.href} className="relative group flex items-center justify-center">
                        <Link
                          href={item.href}
                          onClick={() => onSelect?.()}
                          title={item.badge ? `${item.title} (${item.badge})` : item.title}
                          className={cn(
                            "w-10 h-10 rounded-xl flex items-center justify-center transition-all cursor-pointer",
                            isActive
                              ? "bg-indigo-50 text-indigo-700 font-bold border border-indigo-200 shadow-xs"
                              : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/70"
                          )}
                          aria-label={item.title}
                        >
                          <Icon icon={item.icon} className="w-4 h-4 shrink-0" />
                        </Link>

                        <div className="absolute left-full ml-2 px-2.5 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-semibold whitespace-nowrap shadow-xl border border-slate-800 z-50 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-150 flex items-center gap-1.5">
                          <span>{item.title}</span>
                          {item.badge && (
                            <span className="text-[10px] px-1 py-0.2 rounded font-mono bg-indigo-500 text-white">
                              {item.badge}
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}

                  {gIdx < siteConfig.nestedSidebarGroups.length - 1 && (
                    <div className="w-6 h-px bg-slate-200 my-1" />
                  )}
                </div>
              ))}
            </nav>
          </div>
        ) : (
          renderContent(false)
        )}
      </aside>

      {/* Mobile Drawer Overlay */}
      {mobileDrawerOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs animate-fade-in"
            onClick={() => setMobileDrawerOpen(false)}
          />
          <div className="relative w-80 max-w-[85vw] bg-white h-full shadow-2xl p-4 overflow-y-auto animate-in slide-in-from-left duration-200">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
              <span className="font-bold text-sm text-slate-900">API Documentation</span>
              <button
                type="button"
                onClick={() => setMobileDrawerOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <Icon icon="ph:x-bold" className="w-5 h-5" />
              </button>
            </div>
            {renderContent(true)}
          </div>
        </div>
      )}
    </>
  );
}

export default DocsSidebar;
