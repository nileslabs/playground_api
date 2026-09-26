'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Icon } from '@iconify/react';
import { siteConfig } from '@/config/site';
import { cn } from '@/lib/utils';

interface SidebarProps {
  className?: string;
  onSelect?: () => void;
}

export function Sidebar({ className, onSelect }: SidebarProps) {
  const pathname = usePathname();
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    const initial: Record<string, boolean> = {};
    siteConfig.nestedSidebarGroups.forEach((group) => {
      const hasActive = group.items.some((item) => item.href === pathname);
      initial[group.title] = hasActive ? true : (openGroups[group.title] ?? true);
    });
    setOpenGroups((prev) => ({ ...initial, ...prev }));
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

  return (
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
        /* Full Expanded Sidebar View (Clean Landing Page Style) */
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <span className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <Icon icon="ph:compass-bold" className="w-3.5 h-3.5 text-indigo-600" />
              <span>Documentation</span>
            </span>

            <button
              type="button"
              onClick={toggleCollapse}
              className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              title="Collapse Sidebar"
              aria-label="Collapse Sidebar"
            >
              <Icon icon="ph:sidebar-simple-bold" className="w-3.5 h-3.5" />
            </button>
          </div>

          {siteConfig.nestedSidebarGroups.map((group) => {
            const isOpen = openGroups[group.title] !== false;

            return (
              <div key={group.title} className="space-y-1">
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
                  <ul className="space-y-0.5 ml-2.5 pl-2 border-l border-slate-200 pt-0.5">
                    {group.items.map((item) => {
                      const isActive = pathname === item.href;

                      return (
                        <li key={item.href}>
                          <Link
                            href={item.href}
                            onClick={() => onSelect?.()}
                            className={cn(
                              "flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-all gap-2",
                              isActive
                                ? "bg-indigo-50 text-indigo-700 font-semibold border border-indigo-200/80 shadow-2xs"
                                : "text-slate-600 hover:text-slate-900 hover:bg-slate-50 font-normal"
                            )}
                          >
                            <div className="flex items-center gap-2 min-w-0">
                              <Icon icon={item.icon} className="w-3.5 h-3.5 shrink-0 opacity-70" />
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
          })}
        </div>
      )}
    </aside>
  );
}

export default Sidebar;
