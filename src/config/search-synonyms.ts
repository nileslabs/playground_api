/**
 * Search Synonyms and Colloquial Question Mappings
 * Maps common developer queries, slang, and intents to specific documentation routes.
 */
export const searchSynonyms: Record<string, string[]> = {
  // Getting Started
  '/docs/introduction': [
    'what is playground api',
    'why use this instead of jsonplaceholder',
    'stateful mock api',
    'persistent mutations',
    'zero setup api',
    'copy on write',
    'architecture',
  ],
  '/docs/quickstart': [
    'how to start',
    'get started',
    '5 minute setup',
    'curl example',
    'fetch example',
    'base url',
    'test connection',
    'first api call',
    'health check',
  ],
  '/docs/how-it-works': [
    'how it works',
    'under the hood',
    'overlay mutation engine',
    'session isolation',
    'how do mutations persist',
    'database architecture',
    'ephemeral vs stateful',
  ],
  '/docs/recipes': [
    'react recipe',
    'nextjs recipe',
    'tanstack query cookbook',
    'swr tutorial',
    'vue pinia guide',
    'axios interceptor',
    'fullstack cookbook',
  ],
  '/docs/comparisons': [
    'vs jsonplaceholder',
    'vs mockoon',
    'vs dummyjson',
    'vs json server',
    'vs msw',
    'comparison matrix',
    'which mock api is best',
  ],
  '/docs/showcase': [
    'showcase',
    'demo apps',
    'example projects',
    'blueprints',
    'nextjs server actions demo',
    'vue kanban demo',
    'react ecommerce demo',
  ],

  // AI & Machine
  '/docs/ai': [
    'cursorrules',
    'windsurfrules',
    'ai prompt rules',
    'copilot config',
    'devin api',
    'chatgpt prompts',
    'llm prompts',
  ],

  // Core REST
  '/docs/resources/users': [
    'users api',
    'user crud',
    'get users',
    'post users',
    'user profiles',
    '/users/:id/posts',
    '/users/:id/todos',
    'mock users',
  ],
  '/docs/resources/posts': [
    'posts api',
    'articles',
    'blog posts mock',
    'create post',
    '/posts/:id/comments',
    'nested comments',
  ],
  '/docs/resources/comments': [
    'comments api',
    'post comments',
    'create comment',
    'discussion threads',
    'comment replies',
  ],
  '/docs/resources/todos': [
    'todos api',
    'task list',
    'completed todos',
    'todo app backend',
    'toggle completed',
  ],

  // Query Engine
  '/docs/query/filtering': [
    'filter records',
    'query params',
    'filter by user_id',
    'relational filtering',
    'multi-field filter',
  ],
  '/docs/query/search': [
    'search query',
    'full text search',
    '?q=term',
    'keyword search',
    'search highlight',
  ],
  '/docs/query/sorting': [
    'sort data',
    '_sort parameter',
    '_order parameter',
    'ascending descending',
    'sort by date',
    'sort by title',
  ],
  '/docs/query/pagination-offset': [
    'page limit pagination',
    'traditional pagination',
    'page number',
    '?page=1&limit=10',
  ],
  '/docs/query/pagination-cursor': [
    'cursor pagination',
    'infinite scroll',
    'load more',
    '?cursor=',
    'nextCursor',
  ],
  '/docs/query/custom-resources': [
    'custom collections',
    'custom api',
    'dynamic endpoints',
    '/custom/:collection',
    'create own database',
  ],
  '/docs/query/domain-templates': [
    'domain seeders',
    'ecommerce mock data',
    'crm mock data',
    'products and orders',
    '1-click seed',
  ],
  '/docs/query/csv-excel-export': [
    'export csv',
    'export excel',
    '.csv extension',
    '.xlsx extension',
    'download spreadsheet',
  ],

  // Auth & Security
  '/docs/auth/jwt-flow': [
    'jwt login',
    'jwt authentication',
    'access token',
    'refresh token',
    'post /auth/login',
    'get /auth/me',
  ],
  '/docs/auth/refresh-rotation': [
    'refresh token rotation',
    'token mutex',
    'concurrent refresh',
    'axios 401 interceptor',
    'post /auth/refresh',
  ],
  '/docs/auth/expiry-simulation': [
    'jwt expiry test',
    'simulate expired token',
    'short lived jwt',
    'x-simulate-jwt-expiry',
    'token countdown',
  ],
  '/docs/auth/clock-skew': [
    'clock skew drift',
    'x-simulate-clock-skew',
    'system clock drift',
    'expired token skew',
  ],
  '/docs/auth/rbac-matrix': [
    'rbac',
    'roles and permissions',
    'admin editor viewer',
    'simulate 403 forbidden',
    'permission matrix',
  ],
  '/docs/auth/account-recovery': [
    'forgot password',
    'reset password',
    'email otp code',
    'password recovery loop',
  ],
  '/docs/auth/dual-sandboxing': [
    'dual sandboxing',
    'session vs user sandbox',
    'user_id=0',
    'multi tenant mock',
  ],

  // Payments
  '/docs/payments/hosted-checkout': [
    'stripe checkout',
    'hosted checkout session',
    '/checkout/sessions',
    'payment redirect',
  ],
  '/docs/payments/payment-intents': [
    'payment intents api',
    'stripe elements',
    'create payment intent',
    'confirm payment intent',
  ],
  '/docs/payments/3ds-authentication': [
    '3d secure challenge',
    '3ds modal',
    'strong customer authentication',
    'sca challenge',
  ],
  '/docs/payments/customers-vault': [
    'customer vault',
    'saved credit cards',
    'customer profiles',
    '/customers',
  ],
  '/docs/payments/charges-refunds': [
    'direct charge',
    'refunds api',
    'partial refund',
    'full refund',
    'charge ledger',
  ],
  '/docs/payments/test-cards': [
    'test credit cards',
    'fake cards',
    '4242424242424242',
    'declined card numbers',
  ],

  // Virtual Inboxes
  '/docs/inbox/email-mailbox': [
    'virtual mailbox',
    'mailtrap simulator',
    'incoming email viewer',
    'html email preview',
    'verification email',
  ],
  '/docs/inbox/sms-terminal': [
    'virtual phone sms',
    'sms terminal',
    'otp verification code',
    'incoming text message',
  ],
  '/docs/inbox/in-app-messages': [
    'in app messages',
    'notification toasts',
    'badge count',
    '/messages',
  ],
  '/docs/inbox/dispatcher': [
    'send email test',
    'send sms test',
    'trigger email',
    'dispatcher form',
  ],

  // Realtime
  '/docs/realtime/native-ws': [
    'native websocket',
    '/ws endpoint',
    'websocket chat',
    'bi-directional ws',
  ],
  '/docs/realtime/socketio': [
    'socket.io gateway',
    'socketio client',
    '/socket.io',
    'socket reconnect',
  ],
  '/docs/realtime/presence-typing': [
    'presence roster',
    'typing indicator',
    'online users',
    'echo bot simulator',
  ],
  '/docs/realtime/sse-notifications': [
    'server sent events',
    'sse stream',
    '/api/v1/stream/notifications',
    'event source',
  ],
  '/docs/realtime/analytics-telemetry': [
    'analytics telemetry',
    '/analytics/track',
    'event ingestion',
    'live event stream',
  ],

  // Webhooks
  '/docs/webhooks/subscriptions': [
    'webhook subscriptions',
    'register webhook',
    'webhook events',
    'ngrok test',
  ],
  '/docs/webhooks/hmac-verification': [
    'hmac sha256',
    'x-playground-signature',
    'verify webhook signature',
    'webhook security',
  ],
  '/docs/webhooks/delivery-logs': [
    'webhook delivery log',
    'webhook latency',
    'inspect webhook payload',
  ],
  '/docs/webhooks/manual-retry': [
    'retry webhook',
    'redeliver webhook',
    'manual redelivery',
  ],

  // Chaos
  '/docs/chaos/latency': [
    'simulate delay',
    'slow api',
    'x-simulate-delay',
    'artificial latency',
    '?_delay=',
  ],
  '/docs/chaos/rate-limiting': [
    'rate limit simulation',
    'simulate 429',
    'retry-after countdown',
    'x-simulate-ratelimit',
  ],
  '/docs/chaos/status-codes': [
    'simulate error code',
    'x-simulate-status',
    'force 500 error',
    'force 404 error',
    '?_status=',
  ],
  '/docs/chaos/flaky-engine': [
    'chaos monkey',
    'flaky connection',
    'x-simulate-chaos',
    'stochastic jitter',
  ],

  // Media
  '/docs/media/file-uploads': [
    'multipart file upload',
    'upload files',
    'post /uploads',
    'bulk file upload',
  ],
  '/docs/media/svg-avatars': [
    'svg avatar generator',
    '/avatars/:seed',
    'profile picture placeholder',
  ],
  '/docs/media/image-thumbnails': [
    'image thumbnails',
    '/thumbnails/:seed',
    'dynamic placeholder image',
  ],

  // GraphQL
  '/docs/graphql/ide': [
    'graphiql ide',
    'graphql studio',
    'interactive graphql',
    'graphql explorer',
  ],
  '/docs/graphql/queries': [
    'graphql queries',
    'relational graphql',
    'query users posts',
  ],
  '/docs/graphql/mutations': [
    'graphql mutations',
    'mutate overlay via graphql',
    'create user graphql',
  ],
  '/docs/graphql/subscriptions': [
    'graphql subscriptions',
    'graphql-ws',
    'websocket graphql',
    'realtime graphql',
  ],

  // Collections
  '/docs/collections/openapi': [
    'download openapi',
    'swagger json yaml',
    'openapi 3.1 spec',
  ],
  '/docs/collections/postman': [
    'download postman collection',
    'postman v2.1',
    'import to postman',
  ],
  '/docs/collections/bruno': [
    'download bruno collection',
    'bruno api client',
    'offline api testing',
  ],
  '/docs/collections/insomnia': [
    'download insomnia collection',
    'insomnia workspace',
    'kong insomnia',
  ],
  '/docs/collections/typescript': [
    'download typescript types',
    'playground-api.d.ts',
    'typescript interfaces',
  ],

  // Toolkit
  '/docs/toolkit/studio': [
    'interactive api studio',
    'request runner',
    'in-browser http client',
    'try it console',
  ],
  '/docs/toolkit/typescript-sdk': [
    '@playground-api/client',
    'typescript sdk',
    'official client library',
  ],
  '/docs/toolkit/code-generators': [
    'code generator',
    'curl to python',
    'javascript fetch generator',
    'multi language snippet',
  ],
  '/docs/toolkit/devtools-extension': [
    'chrome extension',
    'devtools companion',
    'browser inspect panel',
  ],

  // Sandbox
  '/docs/sandbox/dashboard': [
    'session quotas',
    'active record count',
    'storage meter',
    'session age',
  ],
  '/docs/sandbox/snapshots': [
    'export snapshot',
    'import snapshot json',
    'save state',
    'restore state',
  ],
  '/docs/sandbox/ci-cd-identity': [
    'playwright testing',
    'cypress mock api',
    'jest headless ci',
    'x-playground-identity in tests',
  ],
  '/docs/sandbox/mobile-qr-sync': [
    'scan qr code',
    'mobile test device sync',
    '?_sandbox= link',
    'phone sync',
  ],
  '/docs/sandbox/reset': [
    'reset sandbox',
    'purge mutations',
    'clear session',
    'restore baseline data',
  ],
  '/docs/sandbox/system-health': [
    'system health',
    'server uptime',
    'memory usage',
    'vercel cron cleanup',
  ],
};
