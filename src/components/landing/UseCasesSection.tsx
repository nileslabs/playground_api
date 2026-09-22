'use client';

import React from 'react';
import Link from 'next/link';
import { Icon } from '@iconify/react';

export function UseCasesSection() {
  const useCases = [
    {
      title: 'Frontend Development',
      description: 'Build realistic React, Vue, Next.js, and mobile interfaces before backend APIs exist. Data persists in your browser session across page reloads.',
      icon: 'ph:layout-bold',
      href: '/docs/showcase',
      linkText: 'Explore React Showcase',
    },
    {
      title: 'QA & Testing',
      description: 'Run deterministic Playwright, Cypress, or Jest suites. Test slow network spinners with ?_delay=1500 and verify 500 error boundaries on demand.',
      icon: 'ph:flask-bold',
      href: '/docs/simulation',
      linkText: 'Test Latency & Errors',
    },
    {
      title: 'AI Coding Agents',
      description: 'Give Cursor, Claude, ChatGPT, and Copilot tools a predictable, persistent mock backend with machine-readable specs at /llms.txt.',
      icon: 'ph:robot-bold',
      href: '/docs/ai',
      linkText: 'View AI Knowledge Docs',
    },
    {
      title: 'Learning & Workshops',
      description: 'Teach web development to dozens of students simultaneously without local database setups, Docker containers, or conflicting data.',
      icon: 'ph:graduation-cap-bold',
      href: '/docs/recipes',
      linkText: 'Framework Recipes',
    },
  ];

  return (
    <section className="py-16 sm:py-20 bg-bg-secondary/40 border-b border-border-theme">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Section Header */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-black text-text-primary tracking-tight">
            Built for modern engineering workflows
          </h2>
          <p className="text-base text-text-secondary">
            From solo frontend prototypes to automated test suites and workshops.
          </p>
        </div>

        {/* 4 Concise Cards (Responsive Grid) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {useCases.map((uc) => (
            <div
              key={uc.title}
              className="p-6 rounded-2xl bg-bg-primary border border-border-theme space-y-4 flex flex-col justify-between group hover:border-accent-primary/50 transition-all shadow-xs"
            >
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-accent-light text-accent-primary flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Icon icon={uc.icon} className="w-5 h-5" />
                </div>

                <h3 className="text-lg font-bold text-text-primary group-hover:text-accent-primary transition-colors">
                  {uc.title}
                </h3>

                <p className="text-sm text-text-secondary leading-relaxed">
                  {uc.description}
                </p>
              </div>

              <div className="pt-3 border-t border-border-theme/60">
                <Link
                  href={uc.href}
                  className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-accent-primary hover:underline"
                >
                  <span>{uc.linkText}</span>
                  <Icon icon="ph:arrow-right-bold" className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

export default UseCasesSection;
