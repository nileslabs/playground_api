import { siteConfig } from './site';
import { apiCatalog } from './api-catalog';
import { searchSynonyms } from './search-synonyms';

export interface SearchIndexItem {
  id: string;
  title: string;
  description: string;
  category: 'Getting Started' | 'Features & Tools' | 'REST Endpoints' | 'REST Collections' | 'GraphQL API' | 'API Downloads' | 'Documentation';
  href: string;
  icon: string;
  badge?: string;
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  path?: string;
  keywords: string[];
  section?: string;
}

/**
 * Automatically builds the comprehensive search index by combining:
 * 1. All sidebar documentation groups and pages from siteConfig
 * 2. All REST resource endpoints from apiCatalog
 * 3. Semantic synonym & beginner intent dictionary
 */
export function buildSearchIndex(): SearchIndexItem[] {
  const index: SearchIndexItem[] = [];
  const seenIds = new Set<string>();

  // 1. Index All Documentation Pages from siteConfig.nestedSidebarGroups
  siteConfig.nestedSidebarGroups.forEach((group) => {
    group.items.forEach((page) => {
      const pageId = `page-${page.href.replace(/[^a-zA-Z0-9_-]/g, '-')}`;
      if (seenIds.has(pageId)) return;
      seenIds.add(pageId);

      // Collect synonyms for this path
      const pathSynonyms = searchSynonyms[page.href] || [];

      // Categorize properly
      let category: SearchIndexItem['category'] = 'Documentation';
      if (group.title.includes('Getting Started')) category = 'Getting Started';
      else if (group.title.includes('Features')) category = 'Features & Tools';
      else if (group.title.includes('REST')) category = 'REST Collections';
      else if (group.title.includes('GraphQL')) category = 'GraphQL API';
      else if (group.title.includes('Downloads')) category = 'API Downloads';

      index.push({
        id: pageId,
        title: page.title,
        description: `Documentation & interactive guide for ${page.title}.`,
        category,
        href: page.href,
        icon: page.icon || group.icon || 'ph:file-text-bold',
        badge: (page as { badge?: string }).badge,
        section: group.title,
        keywords: [
          ...pathSynonyms,
          page.title.toLowerCase(),
          group.title.toLowerCase(),
          page.href.toLowerCase(),
        ],
      });
    });
  });

  // 2. Automatically Index All REST Endpoints from apiCatalog
  apiCatalog.forEach((resource) => {
    const resourcePageHref = `/docs/${resource.id}`;
    const resourceSynonyms = searchSynonyms[resourcePageHref] || [];

    resource.endpoints.forEach((ep) => {
      const endpointId = `ep-${resource.id}-${ep.id}`;
      if (seenIds.has(endpointId)) return;
      seenIds.add(endpointId);

      // Deep link to specific endpoint anchor on the resource page
      const endpointHref = `/docs/${resource.id}#${ep.id}`;

      const queryParamNames = ep.queryParams?.map((q) => q.name) || [];

      const endpointKeywords = [
        ...resourceSynonyms,
        ep.method.toLowerCase(),
        ep.path.toLowerCase(),
        `${ep.method.toLowerCase()} ${ep.path.toLowerCase()}`,
        ep.title.toLowerCase(),
        resource.name.toLowerCase(),
        resource.singular.toLowerCase(),
        ...queryParamNames,
        ...queryParamNames.map((q) => `?${q}`),
      ];

      // Add common intents based on HTTP method
      if (ep.method === 'GET') {
        endpointKeywords.push('fetch', 'read', 'list', 'retrieve', 'query', 'find');
      } else if (ep.method === 'POST') {
        endpointKeywords.push('create', 'add', 'new', 'insert', 'submit', 'save', 'store');
      } else if (ep.method === 'PUT' || ep.method === 'PATCH') {
        endpointKeywords.push('update', 'edit', 'modify', 'change', 'patch');
      } else if (ep.method === 'DELETE') {
        endpointKeywords.push('delete', 'remove', 'destroy', 'clear');
      }

      index.push({
        id: endpointId,
        title: `${ep.method} ${ep.path}`,
        description: ep.description || ep.title,
        category: 'REST Endpoints',
        href: endpointHref,
        icon: resource.icon || 'ph:code-bold',
        badge: ep.method,
        method: ep.method,
        path: ep.path,
        section: `${resource.name} Collection`,
        keywords: endpointKeywords,
      });
    });
  });

  // 3. Quick Utility Actions & Common Developer Shortcuts
  const quickActions: SearchIndexItem[] = [
    {
      id: 'action-reset-sandbox',
      title: 'Reset Session Sandbox',
      description: 'Clear all session overlay creations, updates, and deletes back to baseline global data.',
      category: 'Features & Tools',
      href: '/docs/stats#reset',
      icon: 'ph:arrows-counter-clockwise-bold',
      badge: 'Action',
      section: 'Session Tools',
      keywords: ['reset data', 'clear changes', 'start fresh', 'wipe database', 'restore original', 'clean sandbox', 'delete session'],
    },
    {
      id: 'action-copy-session',
      title: 'Copy Active Session ID',
      description: 'Copy your unique signed session token for use in Postman, Playwright, or Cypress.',
      category: 'Features & Tools',
      href: '/docs/stats',
      icon: 'ph:copy-bold',
      badge: 'Action',
      section: 'Session Tools',
      keywords: ['copy token', 'session token', 'x-playground-identity', 'bearer token', 'identity id', 'e2e token'],
    },
    {
      id: 'action-network-delay',
      title: 'Simulate Network Delay (?_delay=2000)',
      description: 'Slow down responses by specifying simulated latency in milliseconds.',
      category: 'Features & Tools',
      href: '/docs/simulation',
      icon: 'ph:timer-bold',
      badge: 'Simulation',
      section: 'Network Simulator',
      keywords: ['slow api', 'fake lag', 'delay response', 'loading skeleton', 'latency test', '_delay', 'throttle'],
    },
    {
      id: 'action-status-error',
      title: 'Simulate HTTP Error Codes (?_status=500)',
      description: 'Force any endpoint to return custom HTTP error codes (400, 401, 403, 404, 422, 500).',
      category: 'Features & Tools',
      href: '/docs/errors',
      icon: 'ph:warning-circle-bold',
      badge: 'Simulation',
      section: 'Network Simulator',
      keywords: ['make fail', 'force 500', 'simulate 404', 'test errors', 'server error', '_status', 'catch error'],
    },
  ];

  quickActions.forEach((action) => {
    if (!seenIds.has(action.id)) {
      seenIds.add(action.id);
      index.push(action);
    }
  });

  // 4. Index Blog & Technical Handbook Articles
  const blogArticles: SearchIndexItem[] = [
    {
      id: 'blog-index',
      title: 'Blog & Technical Articles',
      description: 'Stop Waiting for the Backend: A 12-part technical handbook on stateful mock APIs.',
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
      keywords: ['react crud', 'react tutorial', 'crud without backend', 'react post request', 'stateful prototype'],
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
    {
      id: 'blog-04-error-states',
      title: 'How to Test API Error States in React Without a Real Backend',
      description: 'Part 4: Test 400, 401, 404, and 500 error boundaries cleanly with _status headers.',
      category: 'Documentation',
      href: '/blog/test-api-error-states-in-react',
      icon: 'ph:article-bold',
      badge: 'Blog #4',
      section: 'Blog Series',
      keywords: ['test errors in react', 'error boundary test', 'simulate 500', 'simulate 404', 'http status test'],
    },
    {
      id: 'blog-05-slow-apis',
      title: 'How to Test Slow APIs and Network Latency in Frontend Applications',
      description: 'Part 5: Stress test loading skeletons and debounced inputs with latency simulation.',
      category: 'Documentation',
      href: '/blog/test-slow-apis-network-latency',
      icon: 'ph:article-bold',
      badge: 'Blog #5',
      section: 'Blog Series',
      keywords: ['test slow api', 'network delay', 'simulate latency', 'skeleton loader testing', 'throttle api'],
    },
    {
      id: 'blog-06-prototyping-guide',
      title: "Stop Waiting for the Backend: A Frontend Developer's Guide to API Prototyping",
      description: 'Part 6: Decouple frontend velocity from backend sprints with stateful prototyping.',
      category: 'Documentation',
      href: '/blog/frontend-api-prototyping-guide',
      icon: 'ph:article-bold',
      badge: 'Blog #6',
      section: 'Blog Series',
      keywords: ['frontend prototyping', 'stop waiting backend', 'api contract first', 'frontend velocity'],
    },
    {
      id: 'blog-07-ai-react',
      title: 'AI Can Build Your React UI in Seconds. What About the Backend?',
      description: 'Part 7: Power v0, Cursor, and Claude generated React apps with an instant sandbox backend.',
      category: 'Documentation',
      href: '/blog/ai-generated-react-app-backend-gap',
      icon: 'ph:article-bold',
      badge: 'Blog #7',
      section: 'Blog Series',
      keywords: ['ai generated react', 'v0 backend', 'cursor react api', 'ai coding backend', 'claude react app'],
    },
    {
      id: 'blog-08-crud-rest-graphql',
      title: 'Building a React CRUD Application With a REST API and GraphQL',
      description: 'Part 8: Dual protocol comparison: fetch, axios vs Apollo Client and urql.',
      category: 'Documentation',
      href: '/blog/react-crud-rest-and-graphql',
      icon: 'ph:article-bold',
      badge: 'Blog #8',
      section: 'Blog Series',
      keywords: ['rest vs graphql', 'react graphql crud', 'apollo client prototype', 'graphql mutations'],
    },
    {
      id: 'blog-09-no-backend-team',
      title: 'How to Build a Frontend Prototype Without a Backend Team',
      description: 'Part 9: Indie builder handbook for presenting investor demos with real CRUD data.',
      category: 'Documentation',
      href: '/blog/frontend-prototype-without-backend-team',
      icon: 'ph:article-bold',
      badge: 'Blog #9',
      section: 'Blog Series',
      keywords: ['prototype without backend', 'mvp demo', 'investor demo mock data', 'indie hacker prototyping'],
    },
    {
      id: 'blog-10-teaching-rest',
      title: 'Teaching REST APIs With a Real Backend Sandbox Instead of Static JSON',
      description: 'Part 10: Computer science pedagogy guide for student labs and coding bootcamps.',
      category: 'Documentation',
      href: '/blog/teaching-rest-apis-sandbox-vs-static-json',
      icon: 'ph:article-bold',
      badge: 'Blog #10',
      section: 'Blog Series',
      keywords: ['teaching rest api', 'bootcamp mock api', 'coding education', 'rest vs static json'],
    },
    {
      id: 'blog-11-jwt-auth',
      title: 'How to Test JWT Authentication and Silent Token Refresh in React Without a Backend',
      description: 'Part 11: End-to-end guide on testing login, refresh tokens, and 401 axios interceptors.',
      category: 'Documentation',
      href: '/blog/test-jwt-auth-and-token-refresh-in-react',
      icon: 'ph:article-bold',
      badge: 'Blog #11',
      section: 'Blog Series',
      keywords: ['test jwt in react', 'axios interceptor refresh', 'silent refresh test', 'mock auth tokens'],
    },
    {
      id: 'blog-12-graphql-nested',
      title: 'Zero-Config GraphQL Prototyping: Nested Queries, Relations & State Mutations',
      description: 'Part 12: Prototyping relational schemas with GraphQL queries, mutations, and aliases.',
      category: 'Documentation',
      href: '/blog/graphql-prototyping-nested-queries-and-mutations',
      icon: 'ph:article-bold',
      badge: 'Blog #12',
      section: 'Blog Series',
      keywords: ['graphql prototyping', 'nested queries mock', 'graphql relations', 'stateful graphql'],
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

