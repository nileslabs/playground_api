'use client';

import React, { useEffect, useMemo } from 'react';
import { usePathname } from 'next/navigation';
import { siteConfig } from '@/config/site';

interface SidebarItemMatch {
  groupTitle: string;
  itemTitle: string;
  badge?: string;
  href: string;
}

export function DocStructuredData() {
  const pathname = usePathname();

  const currentMatch = useMemo<SidebarItemMatch | null>(() => {
    for (const group of siteConfig.nestedSidebarGroups) {
      for (const item of group.items) {
        if (item.href === pathname) {
          return {
            groupTitle: group.title,
            itemTitle: item.title,
            badge: item.badge,
            href: item.href,
          };
        }
      }
    }
    return null;
  }, [pathname]);

  // Dynamically update document title if it hasn't been set by an explicit page metadata
  useEffect(() => {
    if (currentMatch && typeof document !== 'undefined') {
      const currentTitle = document.title;
      const defaultRootTitle = 'Playground API — Free Stateful Mock REST & GraphQL Service';
      if (!currentTitle || currentTitle === defaultRootTitle || currentTitle.startsWith('Playground API')) {
        document.title = `${currentMatch.itemTitle} | Playground API Documentation`;
      }
    }
  }, [currentMatch]);

  if (!currentMatch) {
    return null;
  }

  const pageUrl = `${siteConfig.url}${currentMatch.href}`;
  const headline = `${currentMatch.itemTitle} — Playground API Documentation`;
  const description = `${currentMatch.itemTitle} guide in ${currentMatch.groupTitle} for Playground API. Free stateful mock REST and GraphQL API sandbox with private per-session mutation overlays.`;

  const breadcrumbsSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: siteConfig.url,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Docs',
        item: `${siteConfig.url}/docs`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: currentMatch.groupTitle,
        item: `${siteConfig.url}/docs`,
      },
      {
        '@type': 'ListItem',
        position: 4,
        name: currentMatch.itemTitle,
        item: pageUrl,
      },
    ],
  };

  const techArticleSchema = {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline: headline,
    description: description,
    url: pageUrl,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': pageUrl,
    },
    datePublished: '2025-09-01T00:00:00Z',
    dateModified: new Date().toISOString().split('T')[0],
    author: {
      '@type': 'Person',
      name: siteConfig.author.name,
      url: siteConfig.author.website,
    },
    publisher: {
      '@type': 'Organization',
      name: siteConfig.name,
      url: siteConfig.url,
      logo: {
        '@type': 'ImageObject',
        url: `${siteConfig.url}/favicon.svg`,
      },
    },
    inLanguage: 'en-US',
  };

  return (
    <>
      <script
        id="doc-breadcrumbs-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbsSchema) }}
      />
      <script
        id="doc-techarticle-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(techArticleSchema) }}
      />
    </>
  );
}
