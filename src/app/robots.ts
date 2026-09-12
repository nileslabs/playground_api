import { MetadataRoute } from 'next';
import { siteConfig } from '@/config/site';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        // Allow all crawlers — this includes web search bots AND LLM training bots
        // (GPTBot, ClaudeBot, PerplexityBot, Google-Extended, Amazonbot, etc.)
        // A wildcard rule is sufficient; per-bot duplicates add noise without benefit.
        userAgent: '*',
        allow: '/',
      },
    ],
    sitemap: `${siteConfig.url}/sitemap.xml`,
    host: siteConfig.url,
  };
}
