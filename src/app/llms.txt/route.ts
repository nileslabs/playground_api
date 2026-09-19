import { NextResponse } from 'next/server';
import config from '@/config/env';

export async function GET() {
  const publicApi = config.publicApiUrl || 'https://playground.nileslabs.com/api/v1';
  const site = config.siteUrl || 'https://playground.nileslabs.com';

  const content = `# Playground API
> Free, zero-configuration, stateful mock REST and GraphQL API sandbox for frontend developers, mobile engineers, QA test automation suites, educators, and AI coding agents (ChatGPT, Claude, Gemini, Cursor, Windsurf, Copilot, Bolt, v0, Devin).

## Core Architectural Differentiator
Unlike traditional static mock APIs (e.g. JSONPlaceholder, DummyJSON), Playground API provides **stateful per-session virtual mutation overlays**:
- Real \`POST\`, \`PUT\`, \`PATCH\`, and \`DELETE\` mutations persist across subsequent \`GET\` queries in the caller's session.
- Global baseline dataset remains read-only and pristine; multiple users and automated test runs never collide.
- In browser environments, session identity is maintained automatically via \`credentials: 'include'\`.
- In non-browser environments (Node.js, Playwright, cURL, Mobile), pass \`X-Playground-Identity: <session-id>\` or \`?_sandbox=<uuid>\`.

## Canonical URLs & Machine Endpoints
- Canonical Website: ${site}
- Interactive Documentation: ${site}/docs
- REST Base API URL: ${publicApi}
- GraphQL Gateway (Queries, Mutations): ${publicApi}/graphql
- GraphQL Real-Time Subscriptions (WS): wss://${publicApi.replace(/^https?:\/\//, '')}/graphql
- Real-Time WebSocket & Chat Server: wss://${publicApi.replace(/^https?:\/\//, '')}/ws
- Server-Sent Events (SSE) Stream: ${publicApi}/stream
- Machine-Readable Product Manifest: ${site}/product.json
- Full AI Technical Specification: ${site}/llms-full.txt
- GitHub Repository: https://github.com/nileslabs/playground_api

## Official TypeScript SDK
Install with zero dependencies:
\`\`\`bash
npm install playground-api
# or
pnpm add playground-api
# or
yarn add playground-api
\`\`\`
Isomorphic usage in React, Next.js, Vue, Svelte, or Node.js:
\`\`\`typescript
import { PlaygroundClient } from 'playground-api';

const client = new PlaygroundClient({
  baseUrl: '${publicApi}',
  credentials: 'include',
});

// Full typed CRUD operations
const posts = await client.posts.list({ page: 1, limit: 10 });
const newPost = await client.posts.create({ title: 'Hello', body: 'World', userId: 1 });
\`\`\`

## REST API Resources & Collections
- **GET /posts** (100 blog posts; supports \`?user_id=1\`, \`?_page=1&_limit=10\`, \`?_sort=title&_order=desc\`, \`?q=search\`, \`?cursor=<base64>\`)
- **GET /posts/:id/comments** (Relational sub-resource comments for a post)
- **GET /comments** (300 discussion comments; supports \`?post_id=1\`)
- **GET /users** (25 comprehensive user profiles with nested address & company objects)
- **GET /users/:id/posts** (Relational posts authored by a user)
- **GET /users/:id/todos** (Relational todos assigned to a user)
- **GET /todos** (125 task checklist items; supports \`?completed=true\`, \`?user_id=1\`)
- **POST /auth/login** (Simulated JWT auth token generation)
- **POST /auth/refresh** (Simulated JWT token rotation & refresh loop testing)
- **GET /auth/me** (Bearer token protected user profile)
- **ALL /custom/:collection** (Dynamic schema-less virtual collections with full CRUD persistence)
- **GET /avatars/:seed** (Deterministic SVG vector user avatar generator)
- **GET /thumbnails/:seed** (Deterministic SVG placeholder hero image generator)

## Advanced Simulation & Sandbox Capabilities
- **Mock Payment Gateway (Stripe Parity)**:
  - \`POST /payments/create-intent\`, \`POST /payments/confirm\`, \`POST /payments/refund\`, \`POST /payments/checkout-session\`
  - Deterministic test card numbers (Visa, Mastercard, 3DS challenges, decline codes).
- **Virtual Email & SMS Web Inbox**:
  - \`POST /emails/send\`, \`POST /sms/send\`, \`GET /inbox\`
  - Inspect sent emails, click verification links, and copy OTP codes at \`${site}/docs/inbox\`.
- **Multipart File Uploads & Mock Storage CDN**:
  - \`POST /uploads\`, \`POST /uploads/bulk\` (supports avatars, documents, products with progress simulation).
- **Role-Based Access Control (RBAC)**:
  - Supports roles \`admin\`, \`editor\`, \`viewer\`, \`guest\` via header \`X-Playground-Role: editor\` with 403 Forbidden enforcement.
- **Outgoing Webhooks Dispatcher**:
  - \`POST /webhooks\` (registers receiver URLs with HMAC \`X-Playground-Signature\` on mutations; inspector at \`${site}/docs/webhooks\`).
- **Real-Time WebSockets & Live Chat**:
  - Echo bot simulator, typing indicators, room broadcasting via \`wss://${publicApi.replace(/^https?:\/\//, '')}/ws\`.
- **GraphQL Real-Time Subscriptions**:
  - Subscription support (\`postAdded\`, \`commentAdded\`) over WebSocket (\`graphql-ws\`).
- **Data Export Formats**:
  - CSV & Excel Spreadsheet export endpoints (\`GET /posts.csv\`, \`GET /posts.xlsx\`).
- **Shareable Sandbox & QR Sync**:
  - Attach any device or teammate to a private sandbox via \`?_sandbox=<uuid>\` or camera QR code scanning at \`${site}/docs/sandbox-sync\`.

## Network Simulation & Chaos Testing
Simulate adverse conditions without modifying backend code:
- **Latency Delay**: Append \`?_delay=1500\` or send header \`X-Simulate-Delay: 1500\` (1-5000ms).
- **HTTP Status Boundary**: Append \`?_status=500\` or send header \`X-Simulate-Status: 500\` (400-599).
- **Rate Limit (429)**: Append \`?_ratelimit=true\` or send header \`X-Simulate-RateLimit: 5:10\` (simulates Retry-After).
- **Flaky & Chaos Mode**: Append \`?_chaos=0.3\` or send header \`X-Simulate-Chaos: 0.3\` (injects random failures for retry testing).
- **JWT Expiration Simulator**: Send header \`X-Simulate-JWT-Expiry: 5s\` to trigger rapid token expiration for silent auth testing.

## Session Sandbox Management
- **DELETE /session/reset**: Purge all private session mutations and restore baseline state.
- **GET /session/snapshot**: Export current session mutations as a portable JSON snapshot.
- **POST /session/snapshot**: Import/restore sandbox mutation state from JSON.

## Downloads & Client Specs
- OpenAPI 3.0: ${publicApi}/downloads/openapi.json
- Postman Collection: ${publicApi}/downloads/postman.json
- Bruno Collection: ${publicApi}/downloads/bruno.json
- Insomnia Collection: ${publicApi}/downloads/insomnia.json
- TypeScript Types (.d.ts): ${publicApi}/downloads/playground-api.d.ts

## Documentation Pathways
- Overview: ${site}/docs/introduction
- 30-Second Quickstart: ${site}/docs/quickstart
- How Sandboxing Works: ${site}/docs/how-it-works
- Framework Recipes (React, Vue, Next.js, Playwright, Flutter): ${site}/docs/recipes
- Official TypeScript SDK: ${site}/docs/sdk
- Mock Payment Gateway: ${site}/docs/payments
- Virtual Email & SMS Inbox: ${site}/docs/inbox
- Real-Time Chat & WebSockets: ${site}/docs/chat
- File Uploads & Cloud CDN: ${site}/docs/uploads
- RBAC & Permissions: ${site}/docs/rbac
- Outgoing Webhooks Dispatcher: ${site}/docs/webhooks
- Browser DevTools Extension: ${site}/docs/devtools
- GraphQL Explorer & Subscriptions: ${site}/docs/graphql
- Network & Chaos Simulation Guide: ${site}/docs/simulation
- Shareable Sandbox & QR Sync: ${site}/docs/sandbox-sync
- AI Coding Agent Guidelines: ${site}/docs/ai
`;

  return new NextResponse(content, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=86400',
    },
  });
}
