'use client';

import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Icon } from '@iconify/react';
import { SearchIndexItem, staticSearchIndex } from '@/config/search-index';
import { executeSearch, SearchResult } from '@/utils/searchEngine';
import { HighlightMatch } from '@/components/ui/HighlightMatch';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const RECENT_SEARCHES_KEY = 'pg_recent_searches_v1';
const MAX_RECENT_SEARCHES = 5;

const POPULAR_QUICK_LINKS: SearchIndexItem[] = [
  {
    id: 'quick-quickstart',
    title: '30-Second Quickstart',
    description: 'Make your first mock API request in 30 seconds with curl, fetch, or Axios.',
    category: 'Getting Started',
    href: '/docs/quickstart',
    icon: 'ph:lightning-fill',
    section: 'Getting Started',
    keywords: ['quickstart', 'start', 'first request'],
  },
  {
    id: 'quick-studio',
    title: 'Interactive API Studio',
    description: 'Live in-browser REST API runner and visual inspector.',
    category: 'Features & Tools',
    href: '/docs/studio',
    icon: 'ph:play-circle-bold',
    section: 'Sandbox Tools',
    keywords: ['studio', 'tester', 'run'],
  },
  {
    id: 'quick-posts',
    title: 'Posts Collection (100 items)',
    description: 'Paginated blog posts with full CRUD overlay mutations & relational filtering.',
    category: 'REST Collections',
    href: '/docs/posts',
    icon: 'ph:newspaper-bold',
    badge: '100 items',
    section: 'REST API Collections',
    keywords: ['posts', 'blogs', 'articles'],
  },
  {
    id: 'quick-auth',
    title: 'Authentication (JWT Simulation)',
    description: 'Simulated JSON Web Token login, registration, and protected route testing.',
    category: 'REST Collections',
    href: '/docs/auth',
    icon: 'ph:lock-key-bold',
    badge: 'Auth',
    section: 'REST API Collections',
    keywords: ['auth', 'jwt', 'login', 'token'],
  },
  {
    id: 'quick-graphql',
    title: 'GraphiQL IDE & Gateway',
    description: 'Interactive GraphQL playground querying and mutating sandboxed overlays.',
    category: 'GraphQL API',
    href: '/docs/graphql',
    icon: 'simple-icons:graphql',
    section: 'GraphQL Gateway',
    keywords: ['graphql', 'ide', 'query'],
  },
  {
    id: 'quick-openapi',
    title: 'OpenAPI 3.0 & Postman Specs',
    description: 'Download one-click collection files for Postman, Bruno, Insomnia, and OpenAPI.',
    category: 'API Downloads',
    href: '/docs/collections/openapi',
    icon: 'ph:download-simple-bold',
    section: 'API Downloads & Specs',
    keywords: ['openapi', 'postman', 'swagger', 'download'],
  },
];

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [recentItems, setRecentItems] = useState<SearchIndexItem[]>([]);

  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Load recent searches from localStorage
  useEffect(() => {
    if (isOpen) {
      try {
        const saved = localStorage.getItem(RECENT_SEARCHES_KEY);
        if (saved) {
          setRecentItems(JSON.parse(saved));
        }
      } catch (err) {
        console.error('Failed to parse recent searches:', err);
      }
      setQuery('');
      setSelectedIndex(0);
      // Auto-focus input on open
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    }
  }, [isOpen]);

  // Execute search query
  const searchResults = useMemo(() => {
    if (!query.trim()) return [];
    return executeSearch(query, staticSearchIndex, 30);
  }, [query]);

  // Compute active list of items currently navigable by keyboard
  const activeItems: SearchIndexItem[] = useMemo(() => {
    if (query.trim()) {
      return searchResults.map((r) => r.item);
    }
    if (recentItems.length > 0) {
      return [...recentItems, ...POPULAR_QUICK_LINKS.filter((p) => !recentItems.some((r) => r.id === p.id))];
    }
    return POPULAR_QUICK_LINKS;
  }, [query, searchResults, recentItems]);

  // Reset selected index when search result count changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  // Handle item navigation & saving to recent searches
  const handleSelect = useCallback(
    (item: SearchIndexItem) => {
      // Save to recent searches
      try {
        const updated = [item, ...recentItems.filter((r) => r.id !== item.id)].slice(0, MAX_RECENT_SEARCHES);
        setRecentItems(updated);
        localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
      } catch (err) {
        console.error('Failed to save recent search:', err);
      }

      onClose();
      router.push(item.href);
    },
    [recentItems, onClose, router]
  );

  // Clear recent searches
  const handleClearRecents = (e: React.MouseEvent) => {
    e.stopPropagation();
    setRecentItems([]);
    try {
      localStorage.removeItem(RECENT_SEARCHES_KEY);
    } catch {
      // ignore
    }
  };

  // Keyboard navigation inside modal
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < activeItems.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : activeItems.length - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (activeItems[selectedIndex]) {
        handleSelect(activeItems[selectedIndex]);
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
    }
  };

  // Scroll active item into view when keyboard selection moves
  useEffect(() => {
    if (listRef.current) {
      const activeEl = listRef.current.querySelector(`[data-search-index="${selectedIndex}"]`);
      if (activeEl) {
        activeEl.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      }
    }
  }, [selectedIndex]);

  // Close when clicking outside modal backdrop
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  // Group search results by category
  const groupedResults: { [category: string]: SearchResult[] } = {};
  if (query.trim()) {
    searchResults.forEach((res) => {
      const cat = res.item.category;
      if (!groupedResults[cat]) groupedResults[cat] = [];
      groupedResults[cat].push(res);
    });
  }

  // Method badge color helper
  const getMethodBadgeClass = (method?: string) => {
    switch (method) {
      case 'GET':
        return 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30';
      case 'POST':
        return 'bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/30';
      case 'PUT':
      case 'PATCH':
        return 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30';
      case 'DELETE':
        return 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/30';
      default:
        return 'bg-accent-light text-accent-primary border-accent-primary/20';
    }
  };

  let itemCounter = -1;

  return (
    <div
      onClick={handleBackdropClick}
      className="fixed inset-0 z-50 flex items-start justify-center p-3 sm:p-4 md:p-6 pt-12 sm:pt-16 md:pt-20 bg-black/65 backdrop-blur-md animate-fade-in"
    >
      <div
        onKeyDown={handleKeyDown}
        className="w-full max-w-2xl bg-bg-primary rounded-2xl border border-border-theme shadow-2xl overflow-hidden flex flex-col max-h-[82vh] transition-all transform animate-scale-in"
      >
        {/* Top Search Input Bar */}
        <div className="relative flex items-center px-4 py-3.5 border-b border-border-theme bg-bg-secondary/70">
          <Icon icon="ph:magnifying-glass-bold" className="w-5 h-5 text-accent-primary shrink-0 mr-3" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search docs, endpoints (e.g. GET /posts), JWT auth, simulations..."
            className="w-full bg-transparent text-sm sm:text-base text-text-primary placeholder:text-text-muted focus:outline-none"
            aria-label="Search documentation and endpoints"
          />
          {query ? (
            <button
              onClick={() => {
                setQuery('');
                inputRef.current?.focus();
              }}
              className="p-1 rounded-lg hover:bg-bg-tertiary text-text-muted hover:text-text-primary transition-colors cursor-pointer mr-1.5"
              aria-label="Clear search input"
            >
              <Icon icon="ph:x-circle-fill" className="w-4 h-4" />
            </button>
          ) : null}
          <kbd className="hidden sm:inline-flex items-center px-2 py-0.5 text-[11px] font-bold text-text-muted bg-bg-tertiary border border-border-theme rounded-md select-none">
            ESC
          </kbd>
        </div>

        {/* Scrollable Results Container */}
        <div ref={listRef} className="flex-1 overflow-y-auto p-3 space-y-4 custom-scrollbar max-h-[58vh]">
          {/* 1. Results Mode (Query entered) */}
          {query.trim() ? (
            searchResults.length > 0 ? (
              Object.entries(groupedResults).map(([category, items]) => (
                <div key={category} className="space-y-1.5">
                  <div className="flex items-center gap-2 px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-text-muted">
                    <span>{category}</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-bg-tertiary border border-border-theme">
                      {items.length}
                    </span>
                  </div>

                  <div className="space-y-1">
                    {items.map(({ item }) => {
                      itemCounter++;
                      const currentIndex = itemCounter;
                      const isSelected = selectedIndex === currentIndex;

                      return (
                        <div
                          key={item.id}
                          data-search-index={currentIndex}
                          onClick={() => handleSelect(item)}
                          onMouseEnter={() => setSelectedIndex(currentIndex)}
                          className={`group flex items-start gap-3 p-2.5 sm:p-3 rounded-xl cursor-pointer transition-all border ${
                            isSelected
                              ? 'bg-accent-light border-accent-primary/40 shadow-xs'
                              : 'bg-bg-secondary/40 hover:bg-bg-secondary border-transparent'
                          }`}
                        >
                          {/* Item Icon or Method Badge */}
                          <div className="shrink-0 mt-0.5">
                            {item.method ? (
                              <span
                                className={`text-[10px] sm:text-xs font-mono font-black px-1.5 py-0.5 rounded-md border ${getMethodBadgeClass(
                                  item.method
                                )}`}
                              >
                                {item.method}
                              </span>
                            ) : (
                              <div
                                className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                                  isSelected ? 'bg-accent-primary text-white' : 'bg-bg-tertiary text-text-secondary'
                                }`}
                              >
                                <Icon icon={item.icon} className="w-4 h-4" />
                              </div>
                            )}
                          </div>

                          {/* Item Title, Section & Description */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span
                                className={`text-xs sm:text-sm font-bold truncate ${
                                  isSelected ? 'text-accent-primary' : 'text-text-primary'
                                }`}
                              >
                                <HighlightMatch text={item.title} query={query} />
                              </span>
                              {item.section && (
                                <span className="text-[11px] text-text-muted hidden sm:inline truncate">
                                  in {item.section}
                                </span>
                              )}
                              {item.badge && !item.method && (
                                <span className="text-[10px] px-1.5 py-0.5 rounded font-semibold bg-bg-tertiary text-text-muted border border-border-theme">
                                  {item.badge}
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-text-muted line-clamp-1 mt-0.5">
                              <HighlightMatch text={item.description} query={query} />
                            </p>
                          </div>

                          {/* Navigation Indicator Arrow */}
                          <div className="shrink-0 mt-1">
                            <Icon
                              icon="ph:arrow-elbow-down-right-bold"
                              className={`w-3.5 h-3.5 transition-transform ${
                                isSelected ? 'text-accent-primary translate-x-0.5' : 'text-text-muted/40 opacity-0 group-hover:opacity-100'
                              }`}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))
            ) : (
              /* No Search Results Found */
              <div className="py-10 text-center space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-bg-secondary border border-border-theme mx-auto flex items-center justify-center text-text-muted">
                  <Icon icon="ph:magnifying-glass-slash-bold" className="w-6 h-6 text-accent-primary/60" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-sm sm:text-base font-bold text-text-primary">
                    No results for &ldquo;<span className="text-accent-primary">{query}</span>&rdquo;
                  </h3>
                  <p className="text-xs text-text-muted max-w-sm mx-auto">
                    Try searching for common terms like <button onClick={() => setQuery('posts')} className="underline hover:text-accent-primary cursor-pointer">posts</button>, <button onClick={() => setQuery('auth')} className="underline hover:text-accent-primary cursor-pointer">auth</button>, <button onClick={() => setQuery('delay')} className="underline hover:text-accent-primary cursor-pointer">slow down</button>, <button onClick={() => setQuery('graphql')} className="underline hover:text-accent-primary cursor-pointer">graphql</button>, or <button onClick={() => setQuery('reset')} className="underline hover:text-accent-primary cursor-pointer">reset</button>.
                  </p>
                </div>
              </div>
            )
          ) : (
            /* 2. Empty Query State: Recent Searches & Quick Suggested Links */
            <div className="space-y-4">
              {/* Recent Searches (if any) */}
              {recentItems.length > 0 && (
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between px-2.5 py-1">
                    <span className="text-xs font-bold uppercase tracking-wider text-text-muted flex items-center gap-1.5">
                      <Icon icon="ph:clock-counter-clockwise-bold" className="w-3.5 h-3.5 text-accent-primary" />
                      Recent Searches
                    </span>
                    <button
                      onClick={handleClearRecents}
                      className="text-[11px] text-text-muted hover:text-rose-500 font-medium cursor-pointer transition-colors"
                    >
                      Clear History
                    </button>
                  </div>

                  <div className="space-y-1">
                    {recentItems.map((item) => {
                      itemCounter++;
                      const currentIndex = itemCounter;
                      const isSelected = selectedIndex === currentIndex;

                      return (
                        <div
                          key={`recent-${item.id}`}
                          data-search-index={currentIndex}
                          onClick={() => handleSelect(item)}
                          onMouseEnter={() => setSelectedIndex(currentIndex)}
                          className={`group flex items-center justify-between gap-3 p-2.5 rounded-xl cursor-pointer transition-all border ${
                            isSelected
                              ? 'bg-accent-light border-accent-primary/40 shadow-xs'
                              : 'bg-bg-secondary/40 hover:bg-bg-secondary border-transparent'
                          }`}
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="w-6 h-6 rounded-lg bg-bg-tertiary flex items-center justify-center text-text-secondary shrink-0">
                              <Icon icon={item.icon || 'ph:clock-bold'} className="w-3.5 h-3.5" />
                            </div>
                            <span className="text-xs sm:text-sm font-semibold text-text-primary truncate">
                              {item.title}
                            </span>
                            {item.method && (
                              <span className={`text-[10px] font-mono font-bold px-1.5 py-0.2 rounded border ${getMethodBadgeClass(item.method)}`}>
                                {item.method}
                              </span>
                            )}
                          </div>
                          <Icon icon="ph:arrow-right-bold" className="w-3.5 h-3.5 text-text-muted group-hover:text-accent-primary shrink-0" />
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Popular & Suggested Quick Links */}
              <div className="space-y-1.5">
                <div className="px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-text-muted flex items-center gap-1.5">
                  <Icon icon="ph:sparkle-bold" className="w-3.5 h-3.5 text-accent-primary" />
                  Popular Quick Links
                </div>

                <div className="space-y-1">
                  {POPULAR_QUICK_LINKS.map((item) => {
                    itemCounter++;
                    const currentIndex = itemCounter;
                    const isSelected = selectedIndex === currentIndex;

                    return (
                      <div
                        key={item.id}
                        data-search-index={currentIndex}
                        onClick={() => handleSelect(item)}
                        onMouseEnter={() => setSelectedIndex(currentIndex)}
                        className={`group flex items-start gap-3 p-2.5 sm:p-3 rounded-xl cursor-pointer transition-all border ${
                          isSelected
                            ? 'bg-accent-light border-accent-primary/40 shadow-xs'
                            : 'bg-bg-secondary/40 hover:bg-bg-secondary border-transparent'
                        }`}
                      >
                        <div
                          className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                            isSelected ? 'bg-accent-primary text-white' : 'bg-bg-tertiary text-text-secondary'
                          }`}
                        >
                          <Icon icon={item.icon} className="w-4 h-4" />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span
                              className={`text-xs sm:text-sm font-bold truncate ${
                                isSelected ? 'text-accent-primary' : 'text-text-primary'
                              }`}
                            >
                              {item.title}
                            </span>
                            {item.badge && (
                              <span className="text-[10px] px-1.5 py-0.5 rounded font-semibold bg-bg-tertiary text-text-muted border border-border-theme">
                                {item.badge}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-text-muted line-clamp-1 mt-0.5">{item.description}</p>
                        </div>

                        <Icon
                          icon="ph:arrow-elbow-down-right-bold"
                          className={`w-3.5 h-3.5 shrink-0 mt-1 ${
                            isSelected ? 'text-accent-primary' : 'text-text-muted/40 opacity-0 group-hover:opacity-100'
                          }`}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Action Footer Bar */}
        <div className="px-4 py-2.5 border-t border-border-theme bg-bg-secondary/60 flex items-center justify-between text-[11px] text-text-muted">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded bg-bg-tertiary border border-border-theme font-mono text-[10px]">↑↓</kbd>
              <span className="hidden xs:inline">Navigate</span>
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded bg-bg-tertiary border border-border-theme font-mono text-[10px]">↵</kbd>
              <span className="hidden xs:inline">Select</span>
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded bg-bg-tertiary border border-border-theme font-mono text-[10px]">ESC</kbd>
              <span className="hidden xs:inline">Close</span>
            </span>
          </div>

          <div className="flex items-center gap-1 text-[11px] font-semibold text-accent-primary">
            <Icon icon="ph:sparkle-fill" className="w-3.5 h-3.5" />
            <span>Instant Spotlight</span>
          </div>
        </div>
      </div>
    </div>
  );
}
