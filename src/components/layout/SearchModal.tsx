'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Icon } from '@iconify/react';
import { staticSearchIndex, SearchIndexItem } from '@/config/search-index';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // Focus input on open
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
      setQuery('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  // Global shortcut (Cmd+K / Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) {
          onClose();
        } else {
          // Open triggered by parent state or custom event
          window.dispatchEvent(new CustomEvent('open-search-modal'));
        }
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Filter items
  const filteredItems = useMemo(() => {
    const q = query.trim().toLowerCase();
    let items = staticSearchIndex;

    if (selectedCategory !== 'All') {
      items = items.filter((item) => item.category === selectedCategory);
    }

    if (!q) {
      // Default recommended / popular items
      return items.slice(0, 10);
    }

    return items
      .filter((item) => {
        const matchTitle = item.title.toLowerCase().includes(q);
        const matchDesc = item.description.toLowerCase().includes(q);
        const matchHref = item.href.toLowerCase().includes(q);
        const matchKeywords = item.keywords?.some((k) => k.toLowerCase().includes(q));
        const matchMethod = item.method?.toLowerCase().includes(q);

        return matchTitle || matchDesc || matchHref || matchKeywords || matchMethod;
      })
      .slice(0, 12);
  }, [query, selectedCategory]);

  // Keyboard navigation through results
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < filteredItems.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : filteredItems.length - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredItems[selectedIndex]) {
        handleSelect(filteredItems[selectedIndex].href);
      }
    }
  };

  const handleSelect = (href: string) => {
    onClose();
    router.push(href);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-slate-900/40 backdrop-blur-xs transition-opacity animate-fade-in">
      {/* Backdrop click to close */}
      <div className="fixed inset-0" onClick={onClose} aria-hidden="true" />

      {/* Modal Dialog */}
      <div
        className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[80vh] transition-all transform animate-in fade-in-0 zoom-in-95 duration-150"
        role="dialog"
        aria-modal="true"
        aria-label="Search Documentation and Resources"
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-200 gap-3 bg-slate-50/50">
          <Icon icon="ph:magnifying-glass-bold" className="w-5 h-5 text-indigo-600 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDown}
            placeholder="Search documentation, REST endpoints, and guides..."
            className="w-full bg-transparent text-sm sm:text-base text-slate-900 placeholder:text-slate-400 focus:outline-none"
          />
          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery('');
                inputRef.current?.focus();
              }}
              className="p-1 rounded text-slate-400 hover:text-slate-600"
            >
              <Icon icon="ph:x-bold" className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-block px-2 py-0.5 text-[11px] font-mono font-semibold text-slate-500 bg-slate-200/60 rounded border border-slate-300">
            ESC
          </kbd>
        </div>

        {/* Filter Category Tabs */}
        <div className="flex items-center gap-1.5 px-4 py-2 border-b border-slate-100 bg-white text-xs overflow-x-auto">
          {['All', 'Documentation', 'Endpoints', 'Features & Tools', 'Quick Actions'].map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => {
                setSelectedCategory(cat);
                setSelectedIndex(0);
              }}
              className={`px-2.5 py-1 rounded-full font-medium transition-colors shrink-0 ${
                selectedCategory === cat
                  ? 'bg-indigo-50 text-indigo-700 font-semibold border border-indigo-200'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search Results List */}
        <div className="overflow-y-auto p-2 divide-y divide-slate-50 flex-1">
          {filteredItems.length === 0 ? (
            <div className="py-12 text-center space-y-2">
              <Icon icon="ph:magnifying-glass-slash-bold" className="w-8 h-8 text-slate-300 mx-auto" />
              <p className="text-sm font-semibold text-slate-700">No results found for &ldquo;{query}&rdquo;</p>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Try searching for colloquial terms like &ldquo;pagination&rdquo;, &ldquo;auth tokens&rdquo;, &ldquo;rate limit&rdquo;, or &ldquo;stripe payment&rdquo;.
              </p>
            </div>
          ) : (
            filteredItems.map((item, idx) => {
              const isSelected = idx === selectedIndex;

              return (
                <div
                  key={item.id}
                  onClick={() => handleSelect(item.href)}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-colors ${
                    isSelected ? 'bg-indigo-50/80 text-indigo-950' : 'hover:bg-slate-50 text-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0 pr-3">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border ${
                        isSelected
                          ? 'bg-indigo-600 text-white border-indigo-600'
                          : 'bg-slate-100 text-slate-600 border-slate-200'
                      }`}
                    >
                      <Icon icon={item.icon || 'ph:file-text-bold'} className="w-4 h-4" />
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold truncate">{item.title}</span>
                        {item.method && (
                          <span
                            className={`font-mono text-[10px] font-bold px-1.5 py-0.2 rounded border ${
                              item.method === 'GET'
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                : item.method === 'POST'
                                ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
                                : 'bg-purple-50 text-purple-700 border-purple-200'
                            }`}
                          >
                            {item.method}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 truncate">{item.description}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                      {item.badge || item.category}
                    </span>
                    <Icon
                      icon="ph:arrow-right-bold"
                      className={`w-3.5 h-3.5 text-indigo-600 transition-transform ${
                        isSelected ? 'translate-x-0.5 opacity-100' : 'opacity-0'
                      }`}
                    />
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer Navigation Hints */}
        <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded bg-white border border-slate-200 font-mono text-[10px] text-slate-700 shadow-2xs">
                ↑
              </kbd>
              <kbd className="px-1.5 py-0.5 rounded bg-white border border-slate-200 font-mono text-[10px] text-slate-700 shadow-2xs">
                ↓
              </kbd>
              <span>to navigate</span>
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded bg-white border border-slate-200 font-mono text-[10px] text-slate-700 shadow-2xs">
                ↵
              </kbd>
              <span>to select</span>
            </span>
            <span className="hidden sm:inline-flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded bg-white border border-slate-200 font-mono text-[10px] text-slate-700 shadow-2xs">
                ESC
              </kbd>
              <span>to close</span>
            </span>
          </div>
          <span className="font-medium text-slate-400">Playground API Search</span>
        </div>
      </div>
    </div>
  );
}
