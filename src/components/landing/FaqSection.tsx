'use client';

import React, { useState } from 'react';

interface FaqItem {
  question: string;
  answer: string;
}

const faqs: FaqItem[] = [
  {
    question: 'Is Playground API really free to use?',
    answer:
      'Yes, 100% free and open-source under the ISC license. There are no credit cards, sign-ups, or hidden limits for prototyping, tutorials, and automated tests.',
  },
  {
    question: 'How do my created posts and todos persist without an account?',
    answer:
      'Playground API assigns an HMAC-SHA256 signed session token via an HTTP-only cookie (pg_identity) or custom header (X-Playground-Identity). When you create, update, or delete records, they are stored in a private database overlay tied strictly to your session identity.',
  },
  {
    question: 'Will my changes affect other developers using the API?',
    answer:
      'Never. The global baseline records (100 posts, 10 users, 500 comments, 200 todos) are permanent and read-only. Your mutations are virtualized exclusively for your session.',
  },
  {
    question: 'How do I reset my sandbox back to its original baseline?',
    answer:
      'Simply send a DELETE request to /api/v1/session/reset. All your session overlay records will be permanently purged and your view restored to pristine baseline state.',
  },
  {
    question: 'Can I use this for Playwright, Cypress, and CI/CD automated tests?',
    answer:
      'Yes! By supplying a custom X-Playground-Identity: test-<worker-id> header in your HTTP client or Playwright request context, each parallel test worker gets an isolated sandbox overlay.',
  },
];

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section className="py-20 md:py-28 bg-slate-50/50 border-b border-slate-200/80">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Section Header */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold uppercase tracking-wider border border-indigo-100">
            Common Questions
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">
            Frequently asked questions
          </h2>
          <p className="text-base sm:text-lg text-slate-600 font-normal leading-relaxed">
            Everything you need to know about the sandbox without digging through pages of text.
          </p>
        </div>

        {/* Accordion List */}
        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={faq.question}
                className="rounded-2xl border border-slate-200 bg-white overflow-hidden transition-all shadow-2xs"
              >
                <button
                  type="button"
                  onClick={() => toggle(idx)}
                  className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 font-semibold text-base sm:text-lg text-slate-900 hover:text-indigo-600 transition-colors"
                >
                  <span>{faq.question}</span>
                  <span className={`shrink-0 flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition-transform duration-200 ${isOpen ? 'rotate-180 bg-indigo-50 text-indigo-600' : ''}`}>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </span>
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 sm:px-6 sm:pb-6 pt-0 text-sm text-slate-600 leading-relaxed border-t border-slate-100 mt-1">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
