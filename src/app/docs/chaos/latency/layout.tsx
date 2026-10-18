import React from 'react';
import type { Metadata } from 'next';
import { siteConfig } from '@/config/site';

export const metadata: Metadata = {
  title: 'Network Latency Delay Simulator — Chaos Engineering',
  description:
    'Simulate artificial latency, jitter, slow 3G networks, and timeout boundaries to stress-test UI loading states and skeleton spinners.',
  alternates: {
    canonical: `${siteConfig.url}/docs/chaos/latency`,
  },
  openGraph: {
    title: 'Network Latency Simulator — Playground API',
    description:
      'Inject artificial delay and simulate slow networks to test UI spinners and error boundaries.',
    url: `${siteConfig.url}/docs/chaos/latency`,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Network Latency Simulator — Playground API',
    description:
      'Inject artificial delay and simulate slow networks to test UI spinners and error boundaries.',
  },
};

export default function LatencyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
