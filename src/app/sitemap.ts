import { MetadataRoute } from 'next';
import { siteConfig } from '@/config/site';

export default function sitemap(): MetadataRoute.Sitemap {
  const routes: { path: string; priority: number; changeFrequency: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' }[] = [
    { path: '', priority: 1.0, changeFrequency: 'daily' },
    { path: '/docs', priority: 0.9, changeFrequency: 'daily' },
    { path: '/docs/introduction', priority: 0.9, changeFrequency: 'daily' },
    { path: '/docs/quickstart', priority: 0.9, changeFrequency: 'daily' },
    { path: '/docs/how-it-works', priority: 0.85, changeFrequency: 'weekly' },
    { path: '/docs/recipes', priority: 0.85, changeFrequency: 'weekly' },
    { path: '/docs/filtering', priority: 0.85, changeFrequency: 'weekly' },
    { path: '/docs/errors', priority: 0.85, changeFrequency: 'weekly' },
    { path: '/docs/comparisons', priority: 0.9, changeFrequency: 'weekly' },
    { path: '/docs/ai', priority: 0.95, changeFrequency: 'weekly' },
    { path: '/docs/studio', priority: 0.9, changeFrequency: 'daily' },
    { path: '/docs/simulation', priority: 0.85, changeFrequency: 'weekly' },
    { path: '/docs/export-import', priority: 0.8, changeFrequency: 'weekly' },
    { path: '/docs/stats', priority: 0.8, changeFrequency: 'weekly' },
    { path: '/docs/showcase', priority: 0.85, changeFrequency: 'weekly' },
    // REST Collections
    { path: '/docs/posts', priority: 0.85, changeFrequency: 'weekly' },
    { path: '/docs/comments', priority: 0.85, changeFrequency: 'weekly' },
    { path: '/docs/users', priority: 0.85, changeFrequency: 'weekly' },
    { path: '/docs/todos', priority: 0.85, changeFrequency: 'weekly' },
    { path: '/docs/auth', priority: 0.85, changeFrequency: 'weekly' },
    { path: '/docs/custom', priority: 0.85, changeFrequency: 'weekly' },
    { path: '/docs/avatars', priority: 0.85, changeFrequency: 'weekly' },
    // GraphQL Gateway & Schemas
    { path: '/docs/graphql', priority: 0.9, changeFrequency: 'daily' },
    { path: '/docs/graphql/posts', priority: 0.8, changeFrequency: 'weekly' },
    { path: '/docs/graphql/comments', priority: 0.8, changeFrequency: 'weekly' },
    { path: '/docs/graphql/users', priority: 0.8, changeFrequency: 'weekly' },
    { path: '/docs/graphql/todos', priority: 0.8, changeFrequency: 'weekly' },
    { path: '/docs/graphql/auth', priority: 0.8, changeFrequency: 'weekly' },
    // Client Collections & Downloads
    { path: '/docs/collections/openapi', priority: 0.8, changeFrequency: 'monthly' },
    { path: '/docs/collections/postman', priority: 0.8, changeFrequency: 'monthly' },
    { path: '/docs/collections/bruno', priority: 0.8, changeFrequency: 'monthly' },
    { path: '/docs/collections/insomnia', priority: 0.8, changeFrequency: 'monthly' },
    { path: '/docs/collections/typescript', priority: 0.8, changeFrequency: 'monthly' },
    // Machine & AI Specs
    { path: '/product.json', priority: 0.8, changeFrequency: 'weekly' },
    { path: '/llms.txt', priority: 0.95, changeFrequency: 'daily' },
    { path: '/llms-full.txt', priority: 0.95, changeFrequency: 'daily' },
  ];

  return routes.map((r) => ({
    url: `${siteConfig.url}${r.path}`,
    lastModified: new Date(),
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }));
}
