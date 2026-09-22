'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Icon } from '@iconify/react';
import { getFaqSchema } from '@/lib/json-ld';

const faqs = [
  {
    question: 'What is Playground API?',
    answer: 'Playground API is a free, instant mock backend for frontend development. It lets developers build realistic React, Vue, Next.js, and mobile applications before the real backend is ready.',
  },
  {
    question: 'Does my data persist?',
    answer: 'Yes! Mutations (POST, PUT, PATCH, DELETE) are stored in an isolated browser session overlay. Your created items persist across page refreshes without modifying global baseline records.',
  },
  {
    question: 'Do I need an API key or account?',
    answer: 'No. Playground API requires zero signup, zero credit card, and zero API keys. Simply send requests directly to the endpoints.',
  },
  {
    question: 'Can I use both REST and GraphQL?',
    answer: 'Yes. You can query standard REST resources under /api/v1 or execute GraphQL queries and mutations at /api/v1/graphql with our built-in GraphiQL IDE.',
  },
  {
    question: 'Can I create custom collections?',
    answer: 'Yes. Send requests to /api/v1/custom/:resource (e.g. /custom/products) to automatically create and persist custom prototype schemas on the fly.',
  },
  {
    question: 'How is Playground API different from JSONPlaceholder?',
    answer: 'Traditional mock APIs return fake IDs and discard your mutations immediately. Playground API saves your mutations to a private session overlay so subsequent GET requests actually return your newly created data.',
  },
];

export function FAQAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const faqLd = getFaqSchema(faqs);

  return (
    <section className="py-16 sm:py-20 bg-bg-secondary/40 border-b border-border-theme">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
      />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-4xl font-black text-text-primary tracking-tight">
            Frequently Asked Questions
          </h2>
        </div>

        {/* 6 Collapsed Accordion Items */}
        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;

            return (
              <div
                key={faq.question}
                className="rounded-xl glass-panel overflow-hidden transition-all border border-border-theme shadow-2xs"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full flex items-center justify-between p-4 sm:p-5 text-left text-sm sm:text-base font-bold text-text-primary hover:bg-bg-tertiary transition-colors cursor-pointer"
                >
                  <span>{faq.question}</span>
                  <Icon
                    icon="ph:caret-down-bold"
                    className={`w-4 h-4 text-accent-primary transition-transform duration-200 shrink-0 ml-2 ${
                      isOpen ? 'rotate-180' : 'rotate-0'
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="p-4 sm:p-5 pt-0 text-sm sm:text-base text-text-secondary leading-relaxed border-t border-border-theme/40 bg-bg-secondary/40">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Link to Full Documentation */}
        <div className="text-center pt-2">
          <Link
            href="/docs/introduction"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-accent-primary hover:underline"
          >
            <span>Have more questions? Read the complete documentation</span>
            <Icon icon="ph:arrow-right-bold" className="w-3.5 h-3.5" />
          </Link>
        </div>

      </div>
    </section>
  );
}

export default FAQAccordion;
