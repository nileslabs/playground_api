import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { apiCatalog } from '@/config/api-catalog';
import { siteConfig } from '@/config/site';
import { getApiReferenceSchema, getBreadcrumbSchema } from '@/lib/json-ld';
import { ResourceClient } from '@/components/docs/ResourceClient';

interface ResourcePageProps {
  params: Promise<{ resource: string }>;
}

export function generateStaticParams() {
  return apiCatalog.map((r) => ({
    resource: r.id,
  }));
}

export async function generateMetadata({ params }: ResourcePageProps): Promise<Metadata> {
  const { resource } = await params;
  const res = apiCatalog.find((r) => r.id === resource);

  if (!res) {
    return {
      title: 'Resource Not Found — Playground API',
    };
  }

  const url = `${siteConfig.url}/docs/${resource}`;
  const fullTitle = `${res.name} — Mock REST API Endpoints`;

  return {
    title: fullTitle,
    description: `${res.description} Free, stateful REST mock API endpoints with real CRUD persistence in an isolated per-visitor session.`,
    keywords: [
      `mock ${res.name.toLowerCase()}`,
      `fake ${res.name.toLowerCase()} api`,
      `rest api ${res.id}`,
      `free mock ${res.id} json`,
      'stateful mock rest endpoints',
    ],
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: `${fullTitle} — Playground API`,
      description: `${res.description} Explore persistent mock endpoints with full CRUD simulation.`,
      url,
      type: 'article',
    },
  };
}

export default async function ResourcePage({ params }: ResourcePageProps) {
  const { resource } = await params;
  const res = apiCatalog.find((r) => r.id === resource);

  if (!res) {
    notFound();
  }

  const jsonLdApi = getApiReferenceSchema({
    title: `${res.name} — Mock REST API`,
    description: res.description,
    url: `${siteConfig.url}/docs/${resource}`,
    endpoints: res.endpoints.map((ep) => ({
      method: ep.method,
      path: ep.path,
      description: ep.description,
    })),
  });

  const jsonLdBreadcrumbs = getBreadcrumbSchema([
    { name: 'Home', url: siteConfig.url },
    { name: 'Docs', url: `${siteConfig.url}/docs` },
    { name: res.name, url: `${siteConfig.url}/docs/${resource}` },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdApi) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumbs) }}
      />
      <ResourceClient
        resource={resource}
        name={res.name}
        description={res.description}
        initialEndpoints={res.endpoints}
      />
    </>
  );
}
