import type { Metadata, Viewport } from 'next';
import React, { Suspense } from 'react';
import '@/styles/globals.css';
import Script from 'next/script';
import { ThemeProvider } from '@/components/theme/ThemeProvider';
import { CountsProvider } from '@/context/CountsContext';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { siteConfig } from '@/config/site';
import { getWebApiSchema } from '@/lib/json-ld';
import { GoogleAnalytics } from '@/components/analytics/GoogleAnalytics';
import config from '@/config/env';

import { SandboxSyncHandler } from '@/components/dashboard/SandboxSyncHandler';
import { NavigationProgressBar } from '@/components/layout/NavigationProgressBar';

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0f172a' },
  ],
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  applicationName: siteConfig.name,
  title: {
    default: 'Playground API — Free Stateful Mock REST & GraphQL Service',
    template: `%s | Playground API`,
  },
  description:
    'Free, instant, stateful mock REST & GraphQL API sandbox for web & mobile development. Features persistent per-session CRUD mutation overlays, JWT auth loops, custom collections, and network latency simulation.',
  alternates: {
    types: {
      'text/plain': [
        { url: '/llms.txt', title: 'LLM Documentation' },
        { url: '/llms-full.txt', title: 'Full LLM Reference' },
      ],
      'application/json': [
        { url: '/product.json', title: 'Machine-Readable Product Manifest' },
      ],
    },
  },
  keywords: [
    'mock api',
    'fake api',
    'stateful mock api',
    'jsonplaceholder alternative',
    'platzi fake api alternative',
    'dummyjson alternative',
    'mock rest api',
    'mock graphql api',
    'mock graphql subscriptions',
    'fake rest api with auth',
    'persistent mock api',
    'api sandbox for react',
    'mock api for nextjs',
    'mock backend for flutter',
    'mock stripe api sandbox',
    'mock payment gateway simulation',
    'virtual email inbox for otp',
    'mock sms verification api',
    'mock websocket server',
    'mock file upload api',
    'fake rbac permissions api',
    'playground-api typescript sdk',
    'playwright mock api',
    'cypress test backend sandbox',
    'network delay simulation api',
    'chaos engineering api testing',
    'dynamic custom collections api',
    'vector avatar generator api',
    'developer tools',
  ],
  authors: [{ name: 'Nilesh Kumar', url: 'https://nileslabs.com' }],
  creator: 'Niles Kumar',
  publisher: 'Playground API by Nilesh Kumar',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteConfig.url,
    title: 'Playground API — Free Stateful Mock REST & GraphQL Service',
    description:
      'Stateful mock REST and GraphQL API for testing API integrations, featuring persistent per-session sandbox data where CRUD mutations actually persist.',
    siteName: siteConfig.name,
    images: [
      {
        url: `${siteConfig.url}/og-image.png`,
        secureUrl: `${siteConfig.url}/og-image.png`,
        width: 1200,
        height: 630,
        alt: 'Playground API — Free Stateful Mock REST & GraphQL Service',
        type: 'image/png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Playground API — Free Stateful Mock REST & GraphQL Service',
    description:
      'Stateful mock REST and GraphQL API for testing API integrations, featuring persistent per-session sandbox data where CRUD mutations actually persist.',
    images: [
      {
        url: `${siteConfig.url}/og-image.png`,
        alt: 'Playground API — Free Stateful Mock REST & GraphQL Service',
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/icon', sizes: '48x48', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
    apple: [
      { url: '/apple-icon', sizes: '180x180', type: 'image/png' },
    ],
  },
  manifest: '/site.webmanifest',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = getWebApiSchema();

  return (
    <html lang="en" data-theme="light" className="scroll-smooth" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Plus+Jakarta+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,400;1,600;1,700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        suppressHydrationWarning
        className="flex flex-col min-h-screen antialiased selection:bg-brand-primary selection:text-white font-sans bg-bg-canvas text-text-primary"
      >
        <Script
          id="json-ld"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <ThemeProvider>
          <CountsProvider>
            <Suspense fallback={null}>
              <NavigationProgressBar />
              <SandboxSyncHandler />
            </Suspense>
            <Header />
            <main className="flex-1 w-full">{children}</main>
            <Footer />
          </CountsProvider>
        </ThemeProvider>

        <Suspense fallback={null}>
          <GoogleAnalytics gaId={config.googleAnalyticsId} />
        </Suspense>
      </body>
    </html>
  );
}
