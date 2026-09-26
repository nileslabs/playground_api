'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Icon } from '@iconify/react';
import siteConfig from '@/config/site';

export function DocsFooter() {
  const pathname = usePathname();
  const currentYear = new Date().getFullYear();
  const [feedback, setFeedback] = useState<'yes' | 'no' | null>(null);

  return (
    <footer className="w-full border-t border-slate-200/80 bg-white py-8 text-slate-500 text-xs">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Helpful Feedback Widget */}
        <div className="p-4 sm:p-5 rounded-2xl border border-slate-200/80 bg-slate-50/50 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-0.5 text-center sm:text-left">
            <h5 className="font-semibold text-slate-800 text-xs">Was this documentation page helpful?</h5>
            <p className="text-[11px] text-slate-500">Your feedback helps us continuously improve the API specifications.</p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {feedback ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 font-medium text-xs border border-emerald-200 animate-in fade-in">
                <Icon icon="ph:check-circle-fill" className="w-4 h-4 text-emerald-600" />
                <span>Thank you for your feedback!</span>
              </span>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => setFeedback('yes')}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 font-semibold border border-slate-200 transition-colors shadow-2xs cursor-pointer active:scale-95"
                >
                  <Icon icon="ph:thumbs-up-bold" className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Yes</span>
                </button>
                <button
                  type="button"
                  onClick={() => setFeedback('no')}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 font-semibold border border-slate-200 transition-colors shadow-2xs cursor-pointer active:scale-95"
                >
                  <Icon icon="ph:thumbs-down-bold" className="w-3.5 h-3.5 text-rose-500" />
                  <span>No</span>
                </button>
              </>
            )}
          </div>
        </div>

        {/* Quick Links & GitHub Actions */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-slate-100">
          <div className="flex items-center gap-4">
            <a
              href={`${siteConfig.links.github}/issues/new`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 hover:text-slate-900 transition-colors"
            >
              <Icon icon="ph:bug-bold" className="w-3.5 h-3.5 text-slate-400" />
              <span>Report an issue</span>
            </a>

            <a
              href={`${siteConfig.links.github}/blob/main/playground_api_fe/src/app${pathname}/page.tsx`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 hover:text-slate-900 transition-colors"
            >
              <Icon icon="ph:pencil-simple-bold" className="w-3.5 h-3.5 text-slate-400" />
              <span>Suggest edit on GitHub</span>
            </a>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/llms.txt" className="hover:text-slate-900 transition-colors">
              llms.txt
            </Link>
            <span>•</span>
            <Link href="/product.json" className="hover:text-slate-900 transition-colors">
              product.json
            </Link>
          </div>
        </div>

        {/* Minimal Copyright */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-400">
          <p>© {currentYear} Playground API by {siteConfig.author.name}. Open source under ISC license.</p>
          <p>Mock state is kept in browser memory and local session overlay.</p>
        </div>
      </div>
    </footer>
  );
}

export default DocsFooter;
