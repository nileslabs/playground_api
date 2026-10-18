import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { siteConfig } from '@/config/site';

export const metadata: Metadata = {
  title: 'Playground API Documentation — Stateful Mock REST & GraphQL Service',
  description:
    'Comprehensive documentation, sandbox tools, and architecture guides for Playground API. Test persistent CRUD mutations, JWT auth, Stripe payments, WebSockets, and network latency.',
  alternates: {
    canonical: `${siteConfig.url}/docs`,
  },
  openGraph: {
    title: 'Playground API Documentation — Stateful Mock REST & GraphQL Service',
    description:
      'Comprehensive documentation, sandbox tools, and architecture guides for Playground API. Test persistent CRUD mutations, JWT auth, Stripe payments, WebSockets, and network latency.',
    url: `${siteConfig.url}/docs`,
    siteName: 'Playground API Documentation',
    type: 'website',
    images: [
      {
        url: `${siteConfig.url}/og-image.png`,
        width: 1200,
        height: 630,
        alt: 'Playground API Documentation',
        type: 'image/png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Playground API Documentation — Stateful Mock REST & GraphQL Service',
    description:
      'Comprehensive documentation, sandbox tools, and architecture guides for Playground API. Test persistent CRUD mutations, JWT auth, Stripe payments, WebSockets, and network latency.',
    images: [`${siteConfig.url}/og-image.png`],
  },
};

export default function DocsRootPage() {
  redirect('/docs/introduction');
}
