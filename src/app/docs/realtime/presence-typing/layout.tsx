import React from 'react';
import type { Metadata } from 'next';
import { getDocMetadata } from '@/config/docs-metadata';

export const metadata: Metadata = getDocMetadata('/docs/realtime/presence-typing');

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
