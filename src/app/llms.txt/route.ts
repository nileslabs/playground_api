import { NextResponse } from 'next/server';
import config from '@/config/env';

export async function GET() {
  const publicApi = config.publicApiUrl || 'https://playground.nileslabs.com/api/v1';
  const site = config.siteUrl || 'https://playground.nileslabs.com';

  const content = `# Playground API
> Free, zero-configuration, stateful mock REST and GraphQL API sandbox for frontend developers, mobile engineers, QA test automation, educators, and AI coding agents.

## Core Architectural Differentiator
Unlike traditional static mock APIs (e.g. JSONPlaceholder, DummyJSON), Playground API provides **stateful per-session virtual mutation overlays**:
- Real \`POST\`, \`PUT\`, \`PATCH\`, and \`DELETE\` mutations persist across subsequent \`GET\` queries in the caller's session.
- Global baseline dataset remains read-only and pristine; multiple users and automated test runs never collide.
- In browser environments, session identity is maintained via \`credentials: 'include'\`.
- In non-browser environments (Node.js, Playwright, cURL), pass \`X-Playground-Identity: <session-id>\`.

## Canonical URLs & Machine Endpoints
- Canonical Website: ${site}
- Interactive Documentation: ${site}/docs
- REST Base API URL: ${publicApi}
- GraphQL Gateway: ${publicApi}/graphql
- Machine-Readable Product Manifest: ${site}/product.json
- Full AI Technical Specification: ${site}/llms-full.txt
- GitHub Repository: https://github.com/nileslabs/playground_api

## REST API Resources & Collections
- **GET /posts** (100 blog posts; supports \`?user_id=1\`, \`?_page=1&_limit=10\`, \`?_sort=title&_order=desc\`, \`?q=search\`)
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

## Network Simulation & Chaos Testing
Simulate network conditions without changing your application code:
- **Latency Delay**: Append \`?_delay=1500\` or send header \`X-Simulate-Delay: 1500\` (in milliseconds, 1-5000ms).
- **HTTP Status Code**: Append \`?_status=500\` or send header \`X-Simulate-Status: 500\` (simulates 400-599 error boundaries).
- **Rate Limit (429)**: Append \`?_ratelimit=true\` or send header \`X-Simulate-RateLimit: true\`.

## Session Sandbox Management
- **DELETE /session/reset**: Purge all private session mutations and restore baseline state.
- **GET /session/snapshot**: Export current session mutations as a portable JSON snapshot.
- **POST /session/snapshot**: Import/restore sandbox mutation state from JSON.

## Downloads & Client Specs
- OpenAPI 3.0: ${publicApi}/downloads/openapi.json
- Postman Collection: ${publicApi}/downloads/postman.json
- Bruno Collection: ${publicApi}/downloads/bruno.json
- Insomnia Collection: ${publicApi}/downloads/insomnia.json
- TypeScript SDK (.d.ts): ${publicApi}/downloads/playground-api.d.ts

## Documentation Pathways
- Overview: ${site}/docs/introduction
- Quickstart (30-Sec): ${site}/docs/quickstart
- How Sandboxing Works: ${site}/docs/how-it-works
- Framework Recipes (React, Vue, Next.js, Playwright): ${site}/docs/recipes
- Query Filtering & Relations: ${site}/docs/filtering
- Interactive API Studio: ${site}/docs/studio
- Network Simulation Guide: ${site}/docs/simulation
- HTTP Errors & Status Codes: ${site}/docs/errors
- Playground API vs Alternatives: ${site}/docs/comparisons
- GraphQL Explorer & Schema: ${site}/docs/graphql
- AI Coding Agent Guidelines: ${site}/docs/ai
`;

  return new NextResponse(content, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=86400',
    },
  });
}
