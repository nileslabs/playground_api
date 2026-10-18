import React from 'react';
import type { Metadata } from 'next';
import { siteConfig } from '@/config/site';

export const metadata: Metadata = {
  title: 'Virtual Communications Hub — Email, SMS & OTP Sandboxes',
  description:
    'Test transactional emails, SMS verification, OTP codes, and in-app notifications with persistent virtual mailboxes and instant API dispatchers.',
  alternates: {
    canonical: `${siteConfig.url}/docs/inbox`,
  },
  openGraph: {
    title: 'Virtual Communications Hub — Playground API',
    description:
      'Test transactional emails, SMS verification, OTP codes, and in-app notifications in an isolated sandbox.',
    url: `${siteConfig.url}/docs/inbox`,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Virtual Communications Hub — Playground API',
    description:
      'Test transactional emails, SMS verification, OTP codes, and in-app notifications in an isolated sandbox.',
  },
};

export default function InboxLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
