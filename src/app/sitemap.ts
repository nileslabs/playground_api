import { MetadataRoute } from 'next';
import { siteConfig } from '@/config/site';
import { getAllPosts } from '@/lib/blog';

export default function sitemap(): MetadataRoute.Sitemap {
  const routes: {
    path: string;
    priority: number;
    changeFrequency: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly';
  }[] = [
    // Landing & High-Traffic Pages
    { path: '', priority: 1.0, changeFrequency: 'daily' },
    { path: '/blog', priority: 0.95, changeFrequency: 'weekly' },
    { path: '/docs', priority: 0.95, changeFrequency: 'daily' },
    { path: '/docs/introduction', priority: 0.95, changeFrequency: 'daily' },
    { path: '/docs/quickstart', priority: 0.95, changeFrequency: 'daily' },
    { path: '/docs/how-it-works', priority: 0.9, changeFrequency: 'weekly' },
    { path: '/docs/recipes', priority: 0.9, changeFrequency: 'weekly' },
    { path: '/docs/filtering', priority: 0.9, changeFrequency: 'weekly' },
    { path: '/docs/errors', priority: 0.9, changeFrequency: 'weekly' },
    { path: '/docs/comparisons', priority: 0.95, changeFrequency: 'weekly' },
    { path: '/docs/ai', priority: 0.95, changeFrequency: 'weekly' },
    { path: '/docs/studio', priority: 0.95, changeFrequency: 'daily' },

    // Features & Developer Sandbox Tools
    { path: '/docs/rbac', priority: 0.95, changeFrequency: 'weekly' },
    { path: '/docs/payments', priority: 0.95, changeFrequency: 'daily' },
    { path: '/docs/inbox', priority: 0.95, changeFrequency: 'daily' },
    { path: '/docs/analytics', priority: 0.9, changeFrequency: 'weekly' },
    { path: '/docs/uploads', priority: 0.9, changeFrequency: 'weekly' },
    { path: '/docs/chat', priority: 0.95, changeFrequency: 'daily' },
    { path: '/docs/webhooks', priority: 0.9, changeFrequency: 'weekly' },
    { path: '/docs/simulation', priority: 0.9, changeFrequency: 'weekly' },
    { path: '/docs/export-import', priority: 0.85, changeFrequency: 'weekly' },
    { path: '/docs/sandbox-sync', priority: 0.9, changeFrequency: 'weekly' },
    { path: '/docs/stats', priority: 0.85, changeFrequency: 'weekly' },
    { path: '/docs/showcase', priority: 0.9, changeFrequency: 'weekly' },

    // Core REST Collections
    { path: '/docs/posts', priority: 0.9, changeFrequency: 'weekly' },
    { path: '/docs/comments', priority: 0.9, changeFrequency: 'weekly' },
    { path: '/docs/users', priority: 0.9, changeFrequency: 'weekly' },
    { path: '/docs/todos', priority: 0.9, changeFrequency: 'weekly' },
    { path: '/docs/auth', priority: 0.9, changeFrequency: 'weekly' },
    { path: '/docs/custom', priority: 0.9, changeFrequency: 'weekly' },
    { path: '/docs/avatars', priority: 0.9, changeFrequency: 'weekly' },

    // GraphQL Gateway & Sub-Schemas
    { path: '/docs/graphql', priority: 0.95, changeFrequency: 'daily' },
    { path: '/docs/graphql/subscriptions', priority: 0.9, changeFrequency: 'weekly' },
    { path: '/docs/graphql/posts', priority: 0.85, changeFrequency: 'weekly' },
    { path: '/docs/graphql/comments', priority: 0.85, changeFrequency: 'weekly' },
    { path: '/docs/graphql/users', priority: 0.85, changeFrequency: 'weekly' },
    { path: '/docs/graphql/todos', priority: 0.85, changeFrequency: 'weekly' },
    { path: '/docs/graphql/auth', priority: 0.85, changeFrequency: 'weekly' },

    // Client Collections, SDK & Specs Downloads
    { path: '/docs/sdk', priority: 0.95, changeFrequency: 'daily' },
    { path: '/docs/devtools', priority: 0.9, changeFrequency: 'weekly' },
    { path: '/docs/collections/openapi', priority: 0.85, changeFrequency: 'monthly' },
    { path: '/docs/collections/postman', priority: 0.85, changeFrequency: 'monthly' },
    { path: '/docs/collections/bruno', priority: 0.85, changeFrequency: 'monthly' },
    { path: '/docs/collections/insomnia', priority: 0.85, changeFrequency: 'monthly' },
    { path: '/docs/collections/typescript', priority: 0.85, changeFrequency: 'monthly' },
    { path: '/docs/collections/csv-excel', priority: 0.85, changeFrequency: 'monthly' },

    // Machine-Readable AI Endpoints
    { path: '/product.json', priority: 0.85, changeFrequency: 'weekly' },
    { path: '/llms.txt', priority: 0.95, changeFrequency: 'daily' },
    { path: '/llms-full.txt', priority: 0.95, changeFrequency: 'daily' },
  ];

  // Dynamically append all blog posts
  const blogPosts = getAllPosts();
  blogPosts.forEach((post) => {
    routes.push({
      path: `/blog/${post.slug}`,
      priority: 0.9,
      changeFrequency: 'monthly',
    });
  });

  return routes.map((r) => ({
    url: `${siteConfig.url}${r.path}`,
    lastModified: new Date(),
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }));
}
