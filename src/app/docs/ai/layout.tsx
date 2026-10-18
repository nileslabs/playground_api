import React from 'react';
import type { Metadata } from 'next';
import { siteConfig } from '@/config/site';

export const metadata: Metadata = {
  title: 'AI Prompt Rules & LLM Machine Integration',
  description:
    'Rules and context indexes (llms.txt, product.json, OpenAPI 3.1) for Cursor, Claude, ChatGPT, Gemini, and Devin to generate frontend apps against stateful mock APIs.',
  alternates: {
    canonical: `${siteConfig.url}/docs/ai`,
  },
  openGraph: {
    title: 'AI Prompt Rules & LLM Integration — Playground API',
    description:
      'Instructions and context indexes for AI agents and LLMs to reliably build and test full frontend applications.',
    url: `${siteConfig.url}/docs/ai`,
    siteName: 'Playground API Documentation',
    type: 'article',
    images: [
      {
        url: `${siteConfig.url}/og-image.png`,
        width: 1200,
        height: 630,
        alt: 'AI Prompt Rules & LLM Integration — Playground API',
        type: 'image/png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Prompt Rules & LLM Integration — Playground API',
    description:
      'Instructions and context indexes for AI agents and LLMs to reliably build and test full frontend applications.',
    images: [`${siteConfig.url}/og-image.png`],
  },
};

export default function AiLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
