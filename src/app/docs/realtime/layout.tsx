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
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Realtime Studio — Playground API',
    description:
      'Test native WebSocket connections, Socket.io, Server-Sent Events (SSE), and presence bots.',
  },
};

export default function RealtimeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
