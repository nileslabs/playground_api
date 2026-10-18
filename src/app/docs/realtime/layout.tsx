import React from 'react';
import type { Metadata } from 'next';
import { siteConfig } from '@/config/site';

export const metadata: Metadata = {
  title: 'Realtime Studio — WebSockets, SSE & Live Pub/Sub Simulation',
  description:
    'Test native WebSocket connections, Socket.io rooms, Server-Sent Events (SSE), and live presence tickers in an interactive studio sandbox.',
  alternates: {
    canonical: `${siteConfig.url}/docs/realtime`,
  },
  openGraph: {
    title: 'Realtime Studio — Playground API',
    description:
      'Test native WebSocket connections, Socket.io, Server-Sent Events (SSE), and presence bots.',
    url: `${siteConfig.url}/docs/realtime`,
    siteName: 'Playground API Documentation',
    type: 'article',
    images: [
      {
        url: `${siteConfig.url}/og-image.png`,
        width: 1200,
        height: 630,
        alt: 'Realtime Studio — Playground API',
        type: 'image/png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Realtime Studio — Playground API',
    description:
      'Test native WebSocket connections, Socket.io, Server-Sent Events (SSE), and presence bots.',
    images: [`${siteConfig.url}/og-image.png`],
  },
};

export default function RealtimeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
