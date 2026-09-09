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

  return index;
}

export const staticSearchIndex = buildSearchIndex();
