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
    docs: '/docs/introduction',
    studio: '/docs/toolkit/studio',
    blog: '/blog',
    twitter: 'https://twitter.com/nileslabs',
  },
  nestedSidebarGroups: [
    {
      title: 'Getting Started',
      icon: 'ph:rocket-launch-bold',
      items: [
        { title: 'Introduction', href: '/docs/introduction', icon: 'ph:book-open-text-bold' },
        { title: 'Quickstart', href: '/docs/quickstart', icon: 'ph:lightning-bold', badge: '5 min' },
        { title: 'How It Works', href: '/docs/how-it-works', icon: 'ph:gear-six-bold' },
        { title: 'Recipes & Cookbooks', href: '/docs/recipes', icon: 'ph:cooking-pot-bold' },
        { title: 'Platform Comparisons', href: '/docs/comparisons', icon: 'ph:scales-bold' },
        { title: 'Real-World Showcase', href: '/docs/showcase', icon: 'ph:browsers-bold' },
      ],
    },
    {
      title: 'Live Studio & Playground',
      icon: 'ph:play-circle-bold',
      items: [
        { title: 'Interactive Studio', href: '/docs/toolkit/studio', icon: 'ph:play-circle-bold', badge: 'Studio' },
        { title: 'GraphiQL IDE', href: '/docs/graphql/ide', icon: 'ph:terminal-window-bold', badge: 'IDE' },
        { title: 'Session Quotas & Activity', href: '/docs/sandbox/dashboard', icon: 'ph:gauge-bold' },
        { title: 'Network Chaos Simulator', href: '/docs/chaos/latency', icon: 'ph:hourglass-medium-bold' },
        { title: 'Atomic Sandbox Reset', href: '/docs/sandbox/reset', icon: 'ph:arrow-counter-clockwise-bold' },
      ],
    },
    {
      title: 'Core REST Resources',
      icon: 'ph:database-bold',
      items: [
        { title: 'Overview & Models', href: '/docs/resources', icon: 'ph:stack-bold', badge: 'Hub' },
        { title: 'Users Resource', href: '/docs/resources/users', icon: 'ph:users-bold' },
        { title: 'Posts Resource', href: '/docs/resources/posts', icon: 'ph:newspaper-bold' },
        { title: 'Comments Resource', href: '/docs/resources/comments', icon: 'ph:chats-circle-bold' },
        { title: 'Todos Resource', href: '/docs/resources/todos', icon: 'ph:check-square-bold' },
        { title: 'Custom Collections', href: '/docs/query/custom-resources', icon: 'ph:table-bold', badge: 'Custom' },
      ],
    },
    {
      title: 'Media & Binary Assets',
      icon: 'ph:image-bold',
      items: [
        { title: 'Multipart File Uploads', href: '/docs/media/file-uploads', icon: 'ph:upload-simple-bold', badge: 'Upload' },
        { title: 'Dynamic SVG Avatars', href: '/docs/media/svg-avatars', icon: 'ph:smiley-bold', badge: 'SVG' },
        { title: 'Image Thumbnails', href: '/docs/media/image-thumbnails', icon: 'ph:frame-corners-bold', badge: 'CDN' },
      ],
    },
    {
      title: 'Data & Query Engine',
      icon: 'ph:sliders-horizontal-bold',
      items: [
        { title: 'Relational Filtering', href: '/docs/query/filtering', icon: 'ph:funnel-bold' },
        { title: 'Full-Text Search', href: '/docs/query/search', icon: 'ph:magnifying-glass-bold' },
        { title: 'Dynamic Sorting', href: '/docs/query/sorting', icon: 'ph:arrows-down-up-bold' },
        { title: 'Offset Pagination', href: '/docs/query/pagination-offset', icon: 'ph:number-circle-two-bold' },
        { title: 'Cursor Pagination', href: '/docs/query/pagination-cursor', icon: 'ph:infinite-bold', badge: 'Scroll' },
        { title: 'CSV & Excel Export & Import', href: '/docs/query/csv-excel-export', icon: 'ph:file-xls-bold', badge: 'IO' },
        { title: 'Custom Collections', href: '/docs/query/custom-resources', icon: 'ph:table-bold', badge: 'CRUD' },
      ],
    },
    {
      title: 'Auth & Security',
      icon: 'ph:shield-check-bold',
      items: [
        { title: 'JWT Auth Flow', href: '/docs/auth/jwt-flow', icon: 'ph:key-bold' },
        { title: 'Refresh Token Rotation', href: '/docs/auth/refresh-rotation', icon: 'ph:arrows-clockwise-bold', badge: 'Mutex' },
        { title: 'RBAC Permission Matrix', href: '/docs/auth/rbac-matrix', icon: 'ph:identification-badge-bold', badge: 'Roles' },
        { title: 'Expiry Simulation', href: '/docs/auth/expiry-simulation', icon: 'ph:timer-bold' },
        { title: 'Clock Skew Drift', href: '/docs/auth/clock-skew', icon: 'ph:clock-countdown-bold' },
        { title: 'Password Recovery Loop', href: '/docs/auth/account-recovery', icon: 'ph:lock-key-open-bold' },
        { title: 'Dual-Mode Sandboxing', href: '/docs/auth/dual-sandboxing', icon: 'ph:intersect-bold' },
      ],
    },
    {
      title: 'GraphQL Gateway',
      icon: 'ph:atom-bold',
      items: [
        { title: 'GraphiQL IDE', href: '/docs/graphql/ide', icon: 'ph:terminal-window-bold', badge: 'IDE' },
        { title: 'Relational Queries', href: '/docs/graphql/queries', icon: 'ph:tree-structure-bold' },
        { title: 'Stateful Mutations', href: '/docs/graphql/mutations', icon: 'ph:pencil-line-bold' },
        { title: 'Realtime Subscriptions', href: '/docs/graphql/subscriptions', icon: 'ph:waveform-bold' },
      ],
    },
    {
      title: 'Mock Commerce & Billing',
      icon: 'ph:credit-card-bold',
      items: [
        { title: 'Hosted Checkout', href: '/docs/payments/hosted-checkout', icon: 'ph:shopping-bag-open-bold', badge: 'Stripe' },
        { title: 'Payment Intents API', href: '/docs/payments/payment-intents', icon: 'ph:receipt-bold' },
        { title: '3DS Challenge Modal', href: '/docs/payments/3ds-authentication', icon: 'ph:shield-warning-bold', badge: 'Modal' },
        { title: 'Customers Vault', href: '/docs/payments/customers-vault', icon: 'ph:address-book-bold' },
        { title: 'Charges & Refunds', href: '/docs/payments/charges-refunds', icon: 'ph:arrow-u-down-left-bold' },
        { title: 'Test Cards Catalog', href: '/docs/payments/test-cards', icon: 'ph:cards-bold' },
      ],
    },
    {
      title: 'Virtual Communications',
      icon: 'ph:envelope-simple-bold',
      items: [
        { title: 'Virtual Email Mailbox', href: '/docs/inbox/email-mailbox', icon: 'ph:mailbox-bold', badge: 'Mailtrap' },
        { title: 'Virtual SMS Terminal', href: '/docs/inbox/sms-terminal', icon: 'ph:device-mobile-bold', badge: 'Phone' },
        { title: 'In-App Notifications', href: '/docs/inbox/in-app-messages', icon: 'ph:bell-ringing-bold' },
        { title: 'Message Dispatcher', href: '/docs/inbox/dispatcher', icon: 'ph:paper-plane-tilt-bold' },
      ],
    },
    {
      title: 'Realtime & WebSockets',
      icon: 'ph:broadcast-bold',
      items: [
        { title: 'Native WebSocket (/ws)', href: '/docs/realtime/native-ws', icon: 'ph:plugs-connected-bold' },
        { title: 'Socket.io Gateway', href: '/docs/realtime/socketio', icon: 'ph:network-bold' },
        { title: 'Presence & Echo Bot', href: '/docs/realtime/presence-typing', icon: 'ph:user-circle-gear-bold' },
        { title: 'Server-Sent Events (SSE)', href: '/docs/realtime/sse-notifications', icon: 'ph:stream-bold', badge: 'SSE' },
        { title: 'Analytics Telemetry', href: '/docs/realtime/analytics-telemetry', icon: 'ph:chart-line-up-bold' },
      ],
    },
    {
      title: 'Outgoing Webhooks',
      icon: 'ph:webhooks-logo-bold',
      items: [
        { title: 'Webhook Subscriptions', href: '/docs/webhooks/subscriptions', icon: 'ph:link-bold' },
        { title: 'HMAC SHA-256 Signatures', href: '/docs/webhooks/hmac-verification', icon: 'ph:fingerprint-bold' },
        { title: 'Delivery Logs', href: '/docs/webhooks/delivery-logs', icon: 'ph:list-bullets-bold' },
        { title: 'Manual Retry Simulator', href: '/docs/webhooks/manual-retry', icon: 'ph:arrow-clockwise-bold' },
      ],
    },
    {
      title: 'Chaos & Fault Injection',
      icon: 'ph:skull-bold',
      items: [
        { title: 'Network Latency Delay', href: '/docs/chaos/latency', icon: 'ph:hourglass-medium-bold' },
        { title: 'HTTP Status Codes', href: '/docs/chaos/status-codes', icon: 'ph:warning-octagon-bold' },
        { title: 'Rate-Limit Simulator', href: '/docs/chaos/rate-limiting', icon: 'ph:traffic-cone-bold', badge: '429' },
        { title: 'Flaky Network & Jitter', href: '/docs/chaos/flaky-engine', icon: 'ph:cloud-lightning-bold', badge: 'Chaos' },
      ],
    },
    {
      title: 'Sandbox State & Health',
      icon: 'ph:faders-horizontal-bold',
      items: [
        { title: 'Session Quotas & Activity', href: '/docs/sandbox/dashboard', icon: 'ph:gauge-bold' },
        { title: 'JSON Snapshots', href: '/docs/sandbox/snapshots', icon: 'ph:file-arrow-down-bold', badge: 'JSON' },
        { title: 'Headless CI/CD Testing', href: '/docs/sandbox/ci-cd-identity', icon: 'ph:git-commit-bold', badge: 'CI' },
        { title: 'Mobile QR Code Sync', href: '/docs/sandbox/mobile-qr-sync', icon: 'ph:qr-code-bold' },
        { title: 'System Metrics & Health', href: '/docs/sandbox/system-health', icon: 'ph:heartbeat-bold' },
        { title: 'Atomic Sandbox Reset', href: '/docs/sandbox/reset', icon: 'ph:arrow-counter-clockwise-bold' },
      ],
    },
    {
      title: 'Developer Toolkit & Specs',
      icon: 'ph:wrench-bold',
      items: [
        { title: 'Official TypeScript SDK', href: '/docs/toolkit/typescript-sdk', icon: 'ph:code-bold' },
        { title: 'Multi-Language Generators', href: '/docs/toolkit/code-generators', icon: 'ph:brackets-angle-bold' },
        { title: 'DevTools Extension', href: '/docs/toolkit/devtools-extension', icon: 'ph:puzzle-piece-bold' },
        { title: 'OpenAPI 3.1 Spec', href: '/docs/collections/openapi', icon: 'ph:file-doc-bold', badge: 'JSON' },
        { title: 'Postman Collection v2.1', href: '/docs/collections/postman', icon: 'ph:paper-plane-bold' },
        { title: 'Bruno Collection', href: '/docs/collections/bruno', icon: 'ph:dog-bold' },
        { title: 'Insomnia Workspace', href: '/docs/collections/insomnia', icon: 'ph:moon-stars-bold' },
        { title: 'TypeScript .d.ts', href: '/docs/collections/typescript', icon: 'ph:file-ts-bold', badge: '.d.ts' },
      ],
    },
    {
      title: 'AI & Machine Integration',
      icon: 'ph:robot-bold',
      items: [
        { title: 'AI Prompt Rules', href: '/docs/ai', icon: 'ph:cpu-bold', badge: 'Rules' },
        { title: 'Context Index (llms.txt)', href: '/llms.txt', icon: 'ph:file-text-bold' },
        { title: 'Full Schema (llms-full.txt)', href: '/llms-full.txt', icon: 'ph:file-code-bold' },
        { title: 'Manifest (product.json)', href: '/product.json', icon: 'ph:brackets-curly-bold' },
      ],
    },
    {
      title: 'Articles & Deep Dives',
      icon: 'ph:newspaper-clipping-bold',
      items: [
        { title: 'All Feature Articles', href: '/blog', icon: 'ph:stack-bold', badge: 'Blog' },
        { title: 'React CRUD Without Backend', href: '/blog/react-crud-without-backend', icon: 'ph:code-bold', badge: 'Deep Dive' },
        { title: 'Why Static APIs Fail', href: '/blog/why-static-mock-apis-arent-enough', icon: 'ph:warning-circle-bold' },
        { title: 'Mocking Stateful Auth', href: '/blog/mock-api-remember-post-requests', icon: 'ph:key-bold' },
        { title: 'WebSockets & SSE Guide', href: '/blog/mock-websockets-and-sse-guide', icon: 'ph:broadcast-bold' },
      ],
    },
  ],
};

export default siteConfig;
