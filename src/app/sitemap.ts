import { MetadataRoute } from 'next';
import { siteConfig } from '@/config/site';
import { getAllPosts } from '@/lib/blog';

export default function sitemap(): MetadataRoute.Sitemap {
  // Use a map to ensure every URL is unique and canonical (HTTP 200)
  const routeMap = new Map<
    string,
    {
      priority: number;
      changeFrequency: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly';
    }
  >();

  // 1. Landing & High-Traffic Hub Pages
  routeMap.set('', { priority: 1.0, changeFrequency: 'daily' });
  routeMap.set('/docs', { priority: 0.95, changeFrequency: 'daily' });
  routeMap.set('/blog', { priority: 0.95, changeFrequency: 'weekly' });

  // 2. Machine-Readable & LLM Endpoints
  routeMap.set('/llms.txt', { priority: 0.95, changeFrequency: 'daily' });
  routeMap.set('/llms-full.txt', { priority: 0.95, changeFrequency: 'daily' });
  routeMap.set('/product.json', { priority: 0.9, changeFrequency: 'weekly' });
  routeMap.set('/.well-known/ai-plugin.json', { priority: 0.85, changeFrequency: 'monthly' });

  // 3. Dynamically extract all canonical documentation pages from sidebar configuration
  siteConfig.nestedSidebarGroups.forEach((group) => {
    group.items.forEach((item) => {
      // Exclude machine endpoints and external URLs handled separately
      if (
        item.href.startsWith('/docs') &&
        !routeMap.has(item.href)
      ) {
        // High-priority hubs and interactive tools
        const isHighPriority =
          item.href === '/docs/introduction' ||
          item.href === '/docs/quickstart' ||
          item.href === '/docs/how-it-works' ||
          item.href === '/docs/toolkit/studio' ||
          item.href === '/docs/payments' ||
          item.href === '/docs/auth' ||
          item.href === '/docs/resources' ||
          item.href === '/docs/toolkit/typescript-sdk';

        routeMap.set(item.href, {
          priority: isHighPriority ? 0.95 : 0.85,
          changeFrequency: isHighPriority ? 'daily' : 'weekly',
        });
      }
    });
  });

  // 4. Dynamically append all blog posts
  try {
    const blogPosts = getAllPosts();
    blogPosts.forEach((post) => {
      const blogPath = `/blog/${post.slug}`;
      if (!routeMap.has(blogPath)) {
        routeMap.set(blogPath, {
          priority: 0.85,
          changeFrequency: 'monthly',
        });
      }
    });
  } catch {
    // Graceful fallback if blog directory is unavailable in certain build environments
  }

  // Convert map to Next.js MetadataRoute.Sitemap format
  const now = new Date();
  return Array.from(routeMap.entries()).map(([path, meta]) => ({
    url: `${siteConfig.url}${path}`,
    lastModified: now,
    changeFrequency: meta.changeFrequency,
    priority: meta.priority,
  }));
}

