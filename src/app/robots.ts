import { MetadataRoute } from 'next';
import { siteConfig } from '@/config/site';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        // Allow all crawlers — including web search engines (Googlebot, Bingbot, Baiduspider, YandexBot, DuckDuckBot)
        // and AI search / LLM training bots (GPTBot, ClaudeBot, PerplexityBot, Google-Extended, Amazonbot, Applebot, OAI-SearchBot, CCBot, cohere-ai)
        userAgent: '*',
        allow: '/',
      },
    ],
    sitemap: `${siteConfig.url}/sitemap.xml`,
    host: siteConfig.url,
  };
}
