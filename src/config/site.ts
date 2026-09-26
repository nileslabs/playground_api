/**
 * Central Site Configuration
 */
export const siteConfig = {
  name: 'Playground API',
  shortName: 'Playground API',
  description:
    'Free, instant, stateful mock REST & GraphQL API sandbox for web & mobile development. Features persistent per-session CRUD mutation overlays, JWT auth loops, custom collections, and network latency simulation.',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://playground.nileslabs.com',
  apiUrl: process.env.NEXT_PUBLIC_API_URL || 'https://playground.nileslabs.com/api/v1',
  githubUrl: 'https://github.com/nileslabs/playground_api',
  author: {
    name: 'Nilesh Kumar',
    website: 'https://nileslabs.com',
    url: 'https://nileslabs.com',
  },
  authorUrl: 'https://nileslabs.com',
  links: {
    github: 'https://github.com/nileslabs/playground_api',
    docs: '/docs',
    studio: '/docs/studio',
    twitter: 'https://twitter.com/nileslabs',
  },
  nestedSidebarGroups: [
    {
      title: 'Getting Started',
      items: [
        { title: 'Introduction', href: '/docs/introduction' },
        { title: 'Quickstart', href: '/docs/quickstart' },
        { title: 'How It Works', href: '/docs/how-it-works' },
        { title: 'Recipes & Guides', href: '/docs/recipes' },
      ],
    },
    {
      title: 'Core REST Resources',
      items: [
        { title: 'Posts', href: '/docs/posts' },
        { title: 'Comments', href: '/docs/comments' },
        { title: 'Users', href: '/docs/users' },
        { title: 'Todos', href: '/docs/todos' },
        { title: 'Filtering & Search', href: '/docs/filtering' },
        { title: 'Errors & Statuses', href: '/docs/errors' },
      ],
    },
    {
      title: 'Advanced Features',
      items: [
        { title: 'Auth & JWT', href: '/docs/auth' },
        { title: 'RBAC Simulation', href: '/docs/rbac' },
        { title: 'Mock Payments', href: '/docs/payments' },
        { title: 'Virtual Inbox', href: '/docs/inbox' },
        { title: 'File Uploads', href: '/docs/uploads' },
        { title: 'Webhooks & Events', href: '/docs/webhooks' },
        { title: 'Real-time Chat', href: '/docs/chat' },
        { title: 'Latency Simulation', href: '/docs/simulation' },
      ],
    },
    {
      title: 'GraphQL Gateway',
      items: [
        { title: 'Overview', href: '/docs/graphql' },
        { title: 'Subscriptions', href: '/docs/graphql/subscriptions' },
      ],
    },
    {
      title: 'Developer Tools',
      items: [
        { title: 'Interactive Studio', href: '/docs/studio' },
        { title: 'TypeScript SDK', href: '/docs/sdk' },
        { title: 'Sandbox Sync', href: '/docs/sandbox-sync' },
        { title: 'Export & Import', href: '/docs/export-import' },
        { title: 'System Stats', href: '/docs/stats' },
        { title: 'DevTools Extension', href: '/docs/devtools' },
      ],
    },
  ],
};

export default siteConfig;
