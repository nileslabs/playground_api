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

## Documentation Pathways & Developer Guides
### Getting Started
- [Overview & Architecture](${site}/docs/introduction): Core design, per-session mutation overlays, and zero-login isolation.
- [30-Second Quickstart](${site}/docs/quickstart): Fast onboarding with cURL, fetch, Axios, and Python.
- [How Sandboxing Works](${site}/docs/how-it-works): Deep dive into virtual overlay lifecycle and memory cleanup.
- [Framework Recipes](${site}/docs/recipes): Step-by-step guides for React, Next.js, Vue, Playwright, and Flutter.
- [Platform Comparisons](${site}/docs/comparisons): Playground API vs JSONPlaceholder vs DummyJSON vs MirageJS.
- [Real-World Project Showcase](${site}/docs/showcase): Live demo apps, e-commerce stores, and test fixtures.

### Core REST Collections
- [Users API](${site}/docs/resources/users): 25 user profiles with relational posts, todos, and company details.
- [Posts API](${site}/docs/resources/posts): 100 blog posts with relational comments and author links.
- [Comments API](${site}/docs/resources/comments): 300 discussion comments filterable by post_id.
- [Todos API](${site}/docs/resources/todos): 125 task checklist items with completed filter.
- [Custom Collections](${site}/docs/query/custom-resources): Schema-less virtual collections with persistent CRUD.

### Auth & Security Simulation
- [JWT Authentication](${site}/docs/auth/jwt-flow): Login simulation, Bearer tokens, and protected routes.
- [Refresh Token Rotation](${site}/docs/auth/refresh-rotation): Sliding window refresh token loops with concurrency protection.
- [RBAC Permission Matrix](${site}/docs/auth/rbac-matrix): Admin, editor, viewer, and guest role enforcement.
- [JWT Expiry Simulator](${site}/docs/auth/expiry-simulation): Rapid token expiration for automated silent refresh testing.
- [Clock Skew Drift](${site}/docs/auth/clock-skew): Simulating network time drift and signature validation.

### Commerce & Billing Sandbox
- [Commerce Architecture](${site}/docs/payments): Overview of mock billing and payment state machine.
- [Payment Intents API](${site}/docs/payments/payment-intents): Stripe-compatible asynchronous payment lifecycle.
- [3DS Challenge Modal](${site}/docs/payments/3ds-authentication): Strong Customer Authentication (SCA) challenges.
- [Deterministic Test Cards](${site}/docs/payments/test-cards): Instant success, card declines, insufficient funds, and velocity limits.
- [Hosted Checkout Sessions](${site}/docs/payments/hosted-checkout): Pre-built Stripe Checkout redirect simulation.
- [Charges & Refunds](${site}/docs/payments/charges-refunds): Full and partial refund simulation with audit logs.

### Virtual Communications Inbox
- [Virtual Channels Hub](${site}/docs/inbox): Overview of mock email and SMS delivery.
- [Virtual Email Mailbox](${site}/docs/inbox/email-mailbox): In-browser mailbox to inspect emails, magic links, and OTP codes.
- [Virtual SMS Terminal](${site}/docs/inbox/sms-terminal): Mobile SMS inbox for 2FA and phone verification tests.
- [In-App Notifications](${site}/docs/inbox/in-app-messages): Bell icon notifications with mark-as-read mutations.

### Realtime, WebSockets & GraphQL
- [Native WebSockets](${site}/docs/realtime/native-ws): Stateful echo bots, room channels, and chat broadcasts.
- [Socket.io Gateway](${site}/docs/realtime/socketio): Socket.io compatible real-time event hub.
- [Server-Sent Events (SSE)](${site}/docs/realtime/sse-notifications): Unidirectional live stream updates.
- [GraphiQL IDE](${site}/docs/graphql/ide): Interactive in-browser GraphQL explorer.
- [GraphQL Subscriptions](${site}/docs/graphql/subscriptions): Real-time GraphQL subscription streams over WebSocket.

### Outgoing Webhooks & Chaos Injection
- [Webhook Subscriptions](${site}/docs/webhooks/subscriptions): Registering receiver URLs for automated mutation events.
- [HMAC SHA-256 Signatures](${site}/docs/webhooks/hmac-verification): Cryptographic webhook signature verification.
- [Network Latency Delay](${site}/docs/chaos/latency): Simulate network delays from 1ms to 5000ms.
- [HTTP Status Codes](${site}/docs/chaos/status-codes): Simulate 400, 401, 403, 404, 500, 502, 503 error boundaries.
- [Rate-Limit Simulator](${site}/docs/chaos/rate-limiting): Simulate 429 Too Many Requests with Retry-After headers.
- [Flaky Network & Jitter](${site}/docs/chaos/flaky-engine): Random chaos failure injections for test robustness.

### Developer Tooling & SDK
- [Official TypeScript SDK](${site}/docs/toolkit/typescript-sdk): Zero-dependency isomorphic SDK (\`playground-api\`).
- [DevTools Chrome Extension](${site}/docs/toolkit/devtools-extension): In-browser network inspector companion.
- [Interactive Studio](${site}/docs/toolkit/studio): Visual API console and mutation manager.
- [Mobile QR Code Sync](${site}/docs/sandbox/mobile-qr-sync): Sync browser sandboxes to mobile devices via QR code.
- [AI Coding Agent Guidelines](${site}/docs/ai): Rules and tips for ChatGPT, Claude, Cursor, and Windsurf.

## Optional & Machine References
- [Full Technical Specification](${site}/llms-full.txt): Complete concatenated technical manual for LLM context windows.
- [Machine Product Manifest](${site}/product.json): Machine-readable capabilities JSON Schema.
- [OpenAPI 3.0 JSON](${site}/openapi.json): Full OpenAPI 3.0 specification.
- [Postman Collection](${publicApi}/downloads/postman.json): Postman v2.1 collection.
- [TypeScript Definitions](${publicApi}/downloads/playground-api.d.ts): Full ambient type declarations.
`;

  return new NextResponse(content, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=86400',
    },
  });
}
