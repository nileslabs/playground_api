import { siteConfig } from './site';
import { searchSynonyms } from './search-synonyms';

export interface SearchIndexItem {
  id: string;
  title: string;
  description: string;
  category: 'Documentation' | 'Endpoints' | 'Features & Tools' | 'Quick Actions';
  href: string;
  icon?: string;
  badge?: string;
  section?: string;
  keywords?: string[];
  method?: string;
}

export function buildSearchIndex(): SearchIndexItem[] {
  const index: SearchIndexItem[] = [];
  const seenIds = new Set<string>();

  // 1. Index All Documentation Pages from siteConfig.nestedSidebarGroups
  siteConfig.nestedSidebarGroups.forEach((group) => {
    group.items.forEach((item) => {
      const id = `doc-${item.href.replace(/[/:]/g, '-').replace(/^-+/, '')}`;
      if (!seenIds.has(id)) {
        seenIds.add(id);

        const synonyms = searchSynonyms[item.href] || [];

        index.push({
          id,
          title: item.title,
          description: `${group.title} — ${item.title} interactive guide, simulator, and documentation.`,
          category: 'Documentation',
          href: item.href,
          icon: item.icon || group.icon || 'ph:book-open-bold',
          badge: item.badge || group.title,
          section: group.title,
          keywords: [
            item.title.toLowerCase(),
            group.title.toLowerCase(),
            item.href.toLowerCase(),
            ...synonyms,
          ],
        });
      }
    });
  });

  // 2. Index Common Quick Actions
  const quickActions: SearchIndexItem[] = [
    {
      id: 'action-reset-sandbox',
      title: 'Reset Sandbox State',
      description: 'Clear all session mutations and restore baseline fake data.',
      category: 'Quick Actions',
      href: '/docs/sandbox/reset',
      icon: 'ph:arrow-counter-clockwise-bold',
      badge: 'Action',
      section: 'Sandbox State',
      keywords: ['reset', 'clear', 'purge mutations', 'clean slate', 'delete data'],
    },
    {
      id: 'action-studio',
      title: 'Launch Interactive API Studio',
      description: 'Run HTTP requests in-browser with headers, body parameters, and response headers.',
      category: 'Quick Actions',
      href: '/docs/toolkit/studio',
      icon: 'ph:play-circle-bold',
      badge: 'Action',
      section: 'Developer Toolkit',
      keywords: ['studio', 'runner', 'postman', 'in-browser runner', 'test request'],
    },
    {
      id: 'action-graphiql',
      title: 'Open GraphiQL Studio',
      description: 'Interactive GraphQL IDE with schema documentation and overlay mutations.',
      category: 'Quick Actions',
      href: '/docs/graphql/ide',
      icon: 'ph:atom-bold',
      badge: 'Action',
      section: 'GraphQL Gateway',
      keywords: ['graphql ide', 'graphiql', 'run query', 'test mutation', 'graphql playground'],
    },
    {
      id: 'action-copy-identity',
      title: 'View Active Session Identity',
      description: 'Inspect your active X-Playground-Identity header and storage quotas.',
      category: 'Quick Actions',
      href: '/docs/sandbox/dashboard',
      icon: 'ph:fingerprint-bold',
      badge: 'Action',
      section: 'Sandbox State',
      keywords: ['identity', 'session id', 'x-playground-identity', 'session stats'],
    },
  ];

  quickActions.forEach((action) => {
    if (!seenIds.has(action.id)) {
      seenIds.add(action.id);
      index.push(action);
    }
  });

  // 3. Index Blog Articles
  const blogArticles: SearchIndexItem[] = [
    {
      id: 'blog-index',
      title: 'Blog & Technical Articles',
      description: 'Stop Waiting for the Backend: A technical masterclass series on stateful mock APIs.',
      category: 'Documentation',
      href: '/blog',
      icon: 'ph:newspaper-clipping-bold',
      badge: 'Series',
      section: 'Blog',
      keywords: ['blog', 'articles', 'tutorials', 'handbook', 'series', 'posts'],
    },
    {
      id: 'blog-01-react-crud',
      title: 'How to Build a React CRUD App Without Building a Backend',
      description: 'Part 1: Build and test a full React CRUD app with persistent mutations.',
      category: 'Documentation',
      href: '/blog/react-crud-without-backend',
      icon: 'ph:article-bold',
      badge: 'Blog #1',
      section: 'Blog Series',
      keywords: ['react crud', 'react tutorial', 'crud without backend', 'stateful prototype'],
    },
    {
      id: 'blog-02-static-mock',
      title: "Why Static Mock APIs Aren't Enough for Modern Frontend Development",
      description: 'Part 2: Why read-only mocks fall short and how stateful sandbox overlays solve it.',
      category: 'Documentation',
      href: '/blog/why-static-mock-apis-arent-enough',
      icon: 'ph:article-bold',
      badge: 'Blog #2',
      section: 'Blog Series',
      keywords: ['static mock api', 'mocking limitations', 'stateful mock api', 'jsonplaceholder comparison'],
    },
    {
      id: 'blog-03-mock-post',
      title: 'What If Your Mock API Actually Remembered Your POST Requests?',
      description: 'Part 3: Solving the non-persistent POST request problem in frontend development.',
      category: 'Documentation',
      href: '/blog/mock-api-remember-post-requests',
      icon: 'ph:article-bold',
      badge: 'Blog #3',
      section: 'Blog Series',
      keywords: ['mock post request', 'persistent post', 'overlay engine', 'session mutations'],
    },
  ];

  blogArticles.forEach((article) => {
    if (!seenIds.has(article.id)) {
      seenIds.add(article.id);
      index.push(article);
    }
  });

  return index;
}

export const staticSearchIndex = buildSearchIndex();
export default staticSearchIndex;
