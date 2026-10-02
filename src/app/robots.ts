import { MetadataRoute } from 'next';
import { siteConfig } from '@/config/site';

export default function robots(): MetadataRoute.Robots {
  // Extract clean hostname without protocol for RFC 9309 Host directive compliance
  const domainHost = siteConfig.url.replace(/^https?:\/\//, '').replace(/\/$/, '');

  return {
    rules: [
      {
        // Standard Web Crawlers (Googlebot, Bingbot, Applebot, DuckDuckBot, Baiduspider, YandexBot)
        userAgent: '*',
        allow: '/',
        disallow: ['/api/'],
      },
      {
        // LLM Search & AI Retrieval Crawlers (ChatGPT, Claude, Perplexity, Gemini, Cursor, Copilot)
        userAgent: [
          'GPTBot',
          'ClaudeBot',
          'PerplexityBot',
          'Google-Extended',
          'Amazonbot',
          'Applebot-Extended',
          'OAI-SearchBot',
          'CCBot',
          'cohere-ai',
          'Meta-ExternalAgent',
          'Bytespider',
          'Diffbot',
        ],
        allow: '/',
        disallow: ['/api/'],
      },
    ],
    sitemap: `${siteConfig.url}/sitemap.xml`,
    host: domainHost,
  };
}


