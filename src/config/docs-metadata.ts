import type { Metadata } from 'next';
import { siteConfig } from '@/config/site';

export interface DocRouteMeta {
  title: string;
  description: string;
}

export const DOCS_METADATA_MAP: Record<string, DocRouteMeta> = {
  // --- Getting Started ---
  '/docs/introduction': {
    title: 'Introduction — Stateful Mock REST & GraphQL Backend Sandbox',
    description: 'Overview of Playground API: A zero-configuration mock REST and GraphQL backend sandbox with persistent per-visitor CRUD mutations, latency simulation, and JWT auth.',
  },
  '/docs/quickstart': {
    title: 'Quickstart — 5-Minute Guide to Stateful Mock APIs',
    description: 'Make your first persistent REST and GraphQL requests in under 5 minutes. Learn how to query, mutate, and isolate test data with zero setup.',
  },
  '/docs/how-it-works': {
    title: 'How Sandboxing Works — Copy-on-Write Virtual Mutation Overlays',
    description: 'Deep-dive into the Playground API architecture: Read-time virtual overlay engine, session cookie auto-recovery, HMAC signed identity, and non-colliding mutation isolation.',
  },
  '/docs/recipes': {
    title: 'Framework Recipes & Cookbooks — React, Next.js, Vue, Playwright',
    description: 'Copy-paste code recipes for React Query, Next.js App Router, Axios, Vue, Playwright E2E tests, and Svelte integration with isolated visitor sandboxes.',
  },
  '/docs/comparisons': {
    title: 'Platform Comparisons — Playground API vs Architectural Alternatives',
    description: 'An objective engineering comparison evaluating Stateful Cloud Virtual Sandboxes against Static Mock APIs, Client-Side Interceptors, Local Mock Daemons, and Docker Staging.',
  },
  '/docs/showcase': {
    title: 'Real-World Project Showcase & Demo Applications',
    description: 'Explore live web applications, e-commerce stores, automated test fixtures, and architectural recipes built on Playground API stateful sandboxes.',
  },

  // --- Live Studio & Playground ---
  '/docs/toolkit/studio': {
    title: 'Interactive Studio — Live API Request Console',
    description: 'Test live REST and GraphQL endpoints in your browser. Inspect headers, payload mutations, cookies, and network delay simulation in real time.',
  },
  '/docs/graphql/ide': {
    title: 'GraphiQL Interactive IDE — Relational Query Explorer',
    description: 'In-browser GraphiQL IDE to explore the full GraphQL schema, test relational queries with nested authors and comments, and execute stateful mutations.',
  },
  '/docs/sandbox/dashboard': {
    title: 'Session Quotas & Mutation Activity Dashboard',
    description: 'Inspect active visitor session state, monitor mutation quotas, track API request telemetry, and review stored overlay changes in real time.',
  },
  '/docs/chaos/latency': {
    title: 'Network Latency Delay Simulator — Chaos Engineering',
    description: 'Simulate artificial latency, jitter, slow 3G networks, and timeout boundaries to stress-test UI loading states and skeleton spinners.',
  },
  '/docs/sandbox/reset': {
    title: 'Atomic Sandbox Reset & Session Clean-up',
    description: 'Instantly purge all private session mutations and restore the pristine baseline dataset with a single click or API call.',
  },

  // --- Core REST Resources ---
  '/docs/resources': {
    title: 'Core REST Resources & Data Architecture',
    description: 'Explore the foundational mock REST collections: Users, Posts, Comments, and Todos. 825 baseline records with copy-on-write persistence and relational joins.',
  },
  '/docs/query/custom-resources': {
    title: 'Custom Collections & Virtual Schemas',
    description: 'Create and persist arbitrary, schema-less virtual collections with full CRUD capabilities and automatic session isolation.',
  },

  // --- Media & Binary Assets ---
  '/docs/media/file-uploads': {
    title: 'Multipart File Uploads & Mock Storage CDN',
    description: 'Simulate multipart form file uploads, binary file handling, storage CDN URLs, and upload progress events without real cloud storage costs.',
  },
  '/docs/media/svg-avatars': {
    title: 'Dynamic SVG Avatar Generator',
    description: 'Generate deterministic, colorful vector SVG user avatars based on usernames, emails, or seeds with zero external dependencies.',
  },
  '/docs/media/image-thumbnails': {
    title: 'Placeholder Image & Thumbnail CDN Service',
    description: 'Deterministic placeholder hero images and product thumbnails with configurable dimensions, color themes, and categories.',
  },

  // --- Data & Query Engine ---
  '/docs/query/filtering': {
    title: 'Relational Filtering & Query Operators',
    description: 'Filter REST collections using nested relational keys, equality comparisons, range checks, and boolean operators.',
  },
  '/docs/query/search': {
    title: 'Full-Text Search Across Collections',
    description: 'Execute multi-field full-text search queries across mock resources using the ?q= search parameter.',
  },
  '/docs/query/sorting': {
    title: 'Dynamic Multi-Field Sorting',
    description: 'Sort mock records ascending or descending by single or multiple fields using ?_sort and ?_order parameters.',
  },
  '/docs/query/pagination-offset': {
    title: 'Numbered Offset Pagination & RFC 5988 Link Headers',
    description: 'Standard page-based navigation using ?_page and ?_limit with complete pagination metadata and RFC 5988 Link response headers.',
  },
  '/docs/query/pagination-cursor': {
    title: 'Base64 Cursor-Based Pagination for Infinite Scrolling',
    description: 'High-performance keyset cursor pagination using opaque Base64 tokens, ideal for infinite scrolling feeds and mobile apps.',
  },
  '/docs/query/csv-excel-export': {
    title: 'CSV & Excel Spreadsheet Export and Ingestion',
    description: 'Download mock collections directly as formatted CSV and Microsoft Excel (.xlsx) files or import custom datasets into your sandbox.',
  },

  // --- Auth & Security ---
  '/docs/auth': {
    title: 'Auth & Security Architecture — JWT, RBAC & Tokens',
    description: 'JWT login, mock user registration, silent token refresh rotation, RBAC permission matrix, and cryptographic session security.',
  },
  '/docs/auth/jwt-flow': {
    title: 'JWT Authentication Flow & Lifecycle',
    description: 'Standard JSON Web Token (JWT) issuance, verification, and role resolution. Authenticate against built-in developer test personas with Bearer tokens.',
  },
  '/docs/auth/refresh-rotation': {
    title: 'Refresh Token Rotation & Concurrency Mutex',
    description: 'Simulate sliding-window refresh token rotation with single-use tokens, automated reuse detection, and concurrency race-condition mutex locks.',
  },
  '/docs/auth/rbac-matrix': {
    title: 'Role-Based Access Control (RBAC) Permission Matrix',
    description: 'Test permission-based access control with preconfigured Admin, Editor, Viewer, and Guest roles enforcing HTTP 403 Forbidden boundaries.',
  },
  '/docs/auth/expiry-simulation': {
    title: 'Token Expiration Simulator for Silent Refresh Testing',
    description: 'Simulate rapid JWT access token expiration (1s to 60s) to stress-test Axios and Fetch silent token renewal interceptors without waiting hours.',
  },
  '/docs/auth/clock-skew': {
    title: 'Clock Skew Drift & Time-Shift Simulation',
    description: 'Simulate server clock drifts, timezone skews, and expired signature edge cases to ensure robust client-side time handling.',
  },
  '/docs/auth/account-recovery': {
    title: 'Password Recovery & Magic Link Authentication Loop',
    description: 'Test forgot password flows, magic link login emails, and secure password reset token verification in an isolated sandbox.',
  },
  '/docs/auth/dual-sandboxing': {
    title: 'Dual-Mode Sandboxing — Browser vs Non-Browser Clients',
    description: 'Understand how Playground API seamlessly isolates browser visitors via cookies and headless CI/CD automation via custom identity headers.',
  },

  // --- GraphQL Gateway ---
  '/docs/graphql/queries': {
    title: 'Relational GraphQL Queries & Filtering',
    description: 'Query nested data graphs across posts, authors, and comments in a single round-trip with pagination and search arguments.',
  },
  '/docs/graphql/mutations': {
    title: 'Stateful GraphQL Mutations with Virtual Overlays',
    description: 'Execute addPost, updateComment, and deleteUser mutations via GraphQL with persistent session overlay state.',
  },
  '/docs/graphql/subscriptions': {
    title: 'GraphQL Real-Time Subscriptions over WebSocket',
    description: 'Subscribe to postAdded and commentAdded real-time events over graphql-ws protocol for live UI updates.',
  },

  // --- Mock Commerce & Billing ---
  '/docs/payments': {
    title: 'Mock Commerce & Billing Architecture',
    description: 'Complete mock billing ecosystem supporting Stripe-compatible Payment Intents, 3D Secure modal simulation, magic test cards, and receipts.',
  },
  '/docs/payments/hosted-checkout': {
    title: 'Hosted Checkout Sessions Simulation',
    description: 'Simulate redirect-based hosted checkout sessions with order line items, customer details, success URLs, and cancel flows.',
  },
  '/docs/payments/payment-intents': {
    title: 'Payment Intents API & Asynchronous States',
    description: 'Stripe-compatible Payment Intents lifecycle: create, confirm, capture, and handle requires_action authentication states.',
  },
  '/docs/payments/3ds-authentication': {
    title: '3D Secure (3DS) Challenge Modal Simulator',
    description: 'Test Strong Customer Authentication (SCA) challenges with interactive OTP input modals that resolve or fail payment authorizations.',
  },
  '/docs/payments/customers-vault': {
    title: 'Customer Vault & Tokenized Instruments',
    description: 'Store buyer identities, tokenized payment instruments, billing preferences, and custom customer metadata.',
  },
  '/docs/payments/charges-refunds': {
    title: 'Direct Charges & Full/Partial Refunds API',
    description: 'Execute single-step charges and issue full or partial refunds against settled transactions with automatic ledger balance auditing.',
  },
  '/docs/payments/test-cards': {
    title: 'Deterministic Test Cards Catalog — Success, Declines & 3DS',
    description: 'Simulate every real-world checkout event deterministically with 14+ magic test card numbers, dynamic expiry validations, and decline codes.',
  },

  // --- Virtual Communications ---
  '/docs/inbox': {
    title: 'Virtual Communications Hub — Email, SMS & OTP Sandboxes',
    description: 'Test transactional emails, SMS verification, OTP codes, and in-app notifications with persistent virtual mailboxes and instant API dispatchers.',
  },
  '/docs/inbox/email-mailbox': {
    title: 'Virtual Email Mailbox & OTP Inspector',
    description: 'An isolated, Mailtrap-style virtual inbox that intercepts transactional emails sent from your application with OTP extraction and magic links.',
  },
  '/docs/inbox/sms-terminal': {
    title: 'Virtual SMS Terminal & 2FA Simulator',
    description: 'Test mobile phone number verifications, SMS-based two-factor authentication (2FA), and critical security alerts with auto OTP copying.',
  },
  '/docs/inbox/in-app-messages': {
    title: 'In-App Notifications & Alerts Feed',
    description: 'Simulate in-app notification centers, toast alert streams, and persistent announcement banners with read/unread status mutations.',
  },
  '/docs/inbox/dispatcher': {
    title: 'Template Engine & Notification Dispatcher',
    description: 'Manage reusable Mustache-style template blueprints with dynamic variable compilation and test dispatches to email or SMS.',
  },

  // --- Realtime & WebSockets ---
  '/docs/realtime': {
    title: 'Realtime Studio — WebSockets, SSE & Live Pub/Sub Simulation',
    description: 'Test native WebSocket connections, Socket.io rooms, Server-Sent Events (SSE), and live presence tickers in an interactive studio sandbox.',
  },
  '/docs/realtime/native-ws': {
    title: 'Native WebSocket Server (/ws) & Room Multiplexing',
    description: 'Connect to the native browser WebSocket server at /ws with room multiplexing, peer-to-peer event broadcasts, and automated @bot echoers.',
  },
  '/docs/realtime/socketio': {
    title: 'Socket.io Gateway & Event Bus Simulator',
    description: 'Integrate with the built-in Socket.io server with automatic fallback to HTTP long-polling, room multiplexing, and heartbeats.',
  },
  '/docs/realtime/presence-typing': {
    title: 'Presence Tracking & Keystroke Typing Indicators',
    description: 'Simulate real-time user presence (online/away/offline), keystroke typing indicators, and automated response echo bots.',
  },
  '/docs/realtime/sse-notifications': {
    title: 'Server-Sent Events (SSE) Unidirectional Stream',
    description: 'Lightweight HTTP-based unidirectional streaming to subscribe to live server notifications and background task updates.',
  },
  '/docs/realtime/analytics-telemetry': {
    title: 'Real-Time Analytics & Telemetry Ingestion',
    description: 'Track pageviews, button clicks, user conversion funnels, and performance beacons with single or batched event ingestion.',
  },

  // --- Outgoing Webhooks ---
  '/docs/webhooks/subscriptions': {
    title: 'Webhook Subscriptions & Event Routing',
    description: 'Register HTTP callback URLs to receive real-time JSON webhooks whenever resources change in your session overlay.',
  },
  '/docs/webhooks/hmac-verification': {
    title: 'HMAC SHA-256 Webhook Signatures & Security',
    description: 'Verify cryptographic HMAC-SHA256 signatures in the X-Playground-Signature header to authenticate incoming webhook deliveries.',
  },
  '/docs/webhooks/delivery-logs': {
    title: 'Webhook Delivery Logs & Telemetry History',
    description: 'Inspect transmission history for dispatched webhook events, review delivery attempts, response codes, and round-trip latency.',
  },
  '/docs/webhooks/manual-retry': {
    title: 'Manual Webhook Retry & Synthetic Event Dispatcher',
    description: 'Trigger immediate synthetic webhook events on demand to test receiver handlers or replay previously failed dispatches.',
  },

  // --- Chaos & Fault Injection ---
  '/docs/chaos/status-codes': {
    title: 'Arbitrary HTTP Status Code Injection (4xx & 5xx)',
    description: 'Force any API endpoint to return specified HTTP status boundaries (400, 401, 403, 404, 422, 500, 502, 503) to test error handling.',
  },
  '/docs/chaos/rate-limiting': {
    title: 'Rate-Limit Simulation & Retry-After (HTTP 429)',
    description: 'Test client-side exponential backoff, retry throttles, and user toast notifications when API quotas are exceeded.',
  },
  '/docs/chaos/flaky-engine': {
    title: 'Flaky Network & Probabilistic Jitter Engine',
    description: 'Subject your frontend to real-world network instability by randomly dropping requests with configurable failure rates.',
  },

  // --- Sandbox State & Health ---
  '/docs/sandbox/snapshots': {
    title: 'JSON State Snapshots — Export & Import Test Fixtures',
    description: 'Capture your active session state into portable JSON fixtures and restore stateful test fixtures on demand.',
  },
  '/docs/sandbox/ci-cd-identity': {
    title: 'Headless CI/CD Sandboxing with Custom Identity',
    description: 'Execute dozens of parallel automated test jobs without state collisions by passing custom X-Playground-Identity headers.',
  },
  '/docs/sandbox/mobile-qr-sync': {
    title: 'Mobile QR Code State Synchronization',
    description: 'Sync your active desktop sandbox state to mobile devices, iOS Safari, and Android Chrome by scanning a live QR code.',
  },
  '/docs/sandbox/system-health': {
    title: 'System Metrics & Health Status Telemetry',
    description: 'Live availability, server uptime, round-trip network latency, and memory telemetry for the Playground API cluster.',
  },

  // --- Developer Toolkit & Specs ---
  '/docs/toolkit/typescript-sdk': {
    title: 'Official TypeScript SDK — Typed Client for Playground API',
    description: 'Fully typed TypeScript/JavaScript SDK with automatic session cookie forwarding, query builders, and zero-config client integration.',
  },
  '/docs/toolkit/code-generators': {
    title: 'Multi-Language API Code Generators',
    description: 'Generate copy-pasteable request snippets across cURL, JavaScript Fetch, Axios, Python, Go, and Ruby with session credentials.',
  },
  '/docs/toolkit/devtools-extension': {
    title: 'Browser DevTools Companion Extension',
    description: 'An integrated browser developer panel for Chrome, Firefox, and Edge to inspect mutation overlays and monitor rate limits.',
  },
  '/docs/collections/openapi': {
    title: 'OpenAPI 3.1 & 3.0 Specification Download',
    description: 'Download the complete, schema-validated OpenAPI specification for Playground API to generate typed clients and SDKs.',
  },
  '/docs/collections/postman': {
    title: 'Postman Collection v2.1 Download',
    description: 'Import a full, organized workspace into Postman with pre-configured environment variables and Bearer token capture scripts.',
  },
  '/docs/collections/bruno': {
    title: 'Bruno Collection Export',
    description: 'Export preconfigured requests for Bruno, the fast, open-source, Git-friendly API client with automated assertion tests.',
  },
  '/docs/collections/insomnia': {
    title: 'Kong Insomnia Workspace Export',
    description: 'Import preconfigured request trees, environment profiles, and Bearer token chaining into Kong Insomnia Desktop.',
  },
  '/docs/collections/typescript': {
    title: 'TypeScript Ambient Declarations (.d.ts) Download',
    description: 'Get complete IntelliSense, strict type inference, and compile-time validation without installing any third-party npm packages.',
  },

  // --- AI & Machine Integration ---
  '/docs/ai': {
    title: 'AI Prompt Rules & LLM Machine Integration',
    description: 'Rules and context indexes (llms.txt, product.json, OpenAPI 3.1) for Cursor, Claude, ChatGPT, Gemini, and Devin.',
  },
};

/**
 * Returns standardized, high-quality Next.js metadata for any documentation route.
 */
export function getDocMetadata(route: string): Metadata {
  const item = DOCS_METADATA_MAP[route];
  const title = item ? item.title : 'Documentation';
  const description = item
    ? item.description
    : 'Comprehensive documentation, sandbox tools, and architecture guides for Playground API.';
  const canonicalUrl = `${siteConfig.url}${route}`;
  const ogImageUrl = `${siteConfig.url}/og-image.png`;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: `${title} | Playground API Documentation`,
      description,
      url: canonicalUrl,
      siteName: 'Playground API Documentation',
      type: 'article',
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: `${title} — Playground API`,
          type: 'image/png',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} | Playground API Documentation`,
      description,
      images: [ogImageUrl],
    },
  };
}
