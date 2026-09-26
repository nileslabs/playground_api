import React from 'react';
import Link from 'next/link';
import { Icon } from '@iconify/react';
import siteConfig from '@/config/site';

export function BlogFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-slate-200/80 bg-white py-10 text-slate-500 text-xs">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-6 border-b border-slate-100">
          {/* Series Note */}
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 text-[11px] font-bold uppercase">
              <Icon icon="ph:stack-bold" className="w-3.5 h-3.5" />
              Technical Masterclass
            </div>
            <h4 className="font-bold text-sm text-slate-900">Stop Waiting for the Backend</h4>
            <p className="text-xs text-slate-500 leading-relaxed font-normal">
              A 12-part deep dive into practical API mocking, WebSockets, payment intents, and frontend resilience.
            </p>
          </div>

          {/* Quick Resources */}
          <div className="space-y-2">
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-800">Developer Specs</h4>
            <ul className="space-y-1.5 text-xs">
              <li>
                <Link href="/docs/getting-started/quickstart" className="hover:text-indigo-600 transition-colors">
                  Quickstart Guide →
                </Link>
              </li>
              <li>
                <Link href="/docs/collections/openapi" className="hover:text-indigo-600 transition-colors">
                  Download OpenAPI 3.0 Spec →
                </Link>
              </li>
              <li>
                <Link href="/docs/collections/postman" className="hover:text-indigo-600 transition-colors">
                  Download Postman Collection →
                </Link>
              </li>
            </ul>
          </div>

          {/* Author */}
          <div className="space-y-2">
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-800">Created by</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Nilesh Kumar — Fullstack & API Architect. Passionate about empowering frontend developers to build without backend bottlenecks.
            </p>
            <div className="flex items-center gap-3 pt-1">
              <Link
                href={siteConfig.links.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-indigo-600 hover:text-indigo-800 font-semibold"
              >
                <Icon icon="simple-icons:github" className="w-3.5 h-3.5" />
                <span>GitHub</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Minimal Copyright */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-400">
          <p>© {currentYear} Playground API by {siteConfig.author.name}. All tutorials and code snippets open source.</p>
          <div className="flex items-center gap-4">
            <Link href="/" className="hover:text-slate-900 transition-colors">
              Homepage
            </Link>
            <Link href="/docs/introduction" className="hover:text-slate-900 transition-colors">
              Docs
            </Link>
            <Link href="/llms.txt" className="hover:text-slate-900 transition-colors">
              llms.txt
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default BlogFooter;
