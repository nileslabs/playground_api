import { NextResponse } from 'next/server';
import config from '@/config/env';

export async function GET() {
  const publicApi = config.publicApiUrl || 'https://playground.nileslabs.com/api/v1';
  const site = config.siteUrl || 'https://playground.nileslabs.com';

  const content = `# Playground API
> Free, zero-configuration, stateful mock REST and GraphQL API for frontend development, prototyping, testing, education, and AI coding agents.

## Canonical URLs & Resources
- Website: ${site}
- Documentation: ${site}/docs
- API Base URL: ${publicApi}
- GraphQL Gateway: ${publicApi}/graphql
- GitHub Repository: https://github.com/nileslabs/playground_api
- Machine Manifest: ${site}/product.json
- Full AI Technical Specification: ${site}/llms-full.txt

## Key Architectural Differentiators
- Stateful Mutation Overlays: Real POST, PUT, PATCH, and DELETE operations persist across subsequent GET queries in the caller's session.
- Zero-Login Sandbox Isolation: Global baseline datasets remain pristine and read-only; no user collisions.
- Dual Protocol Support: REST APIs under /api/v1 and GraphQL Explorer at /api/v1/graphql.
- Network Simulation: Latency injection (?_delay=1500 or X-Simulate-Delay: 1500) & Error code simulation (?_status=500 or X-Simulate-Status: 500).
- Session Sandbox Management: 1-click token copy, session quotas, and instant purge (DELETE /api/v1/session/reset).

## Core REST API Endpoints
- GET /posts (100 baseline blog posts with user_id relational filtering)
- GET /comments (300 discussion comments with post_id relational filtering)
- GET /users (25 comprehensive user profiles with nested address & company objects)
- GET /todos (125 task checklist items with completed & user_id filtering)
- POST /auth/login (Simulated JWT authentication token generation)
- POST /auth/refresh (JWT token rotation & refresh loop testing)
- GET /auth/me (Bearer token protected user profile)
- POST /custom/:collection (Dynamic schema-less virtual collections)
- GET /avatars/:seed (Deterministic SVG user avatar generator)
- GET /thumbnails/:seed (Dynamic SVG placeholder hero images)
- GET /session/snapshot (Export session sandbox state as JSON)
- POST /session/snapshot (Import/restore session sandbox state)
- DELETE /session/reset (Instant sandbox purge & reset to baseline)

## Client Downloads & SDK Specs
- OpenAPI 3.0: ${publicApi}/downloads/openapi.json
- Postman Collection v2.1: ${publicApi}/downloads/postman.json
- Bruno Collection: ${publicApi}/downloads/bruno.json
- Insomnia Collection: ${publicApi}/downloads/insomnia.json
- TypeScript SDK Definitions (.d.ts): ${publicApi}/downloads/playground-api.d.ts

## Documentation Pathways
- /docs/introduction (Platform overview & architecture)
- /docs/quickstart (30-second onboarding guide)
- /docs/how-it-works (Stateful mutation overlay lifecycle)
- /docs/recipes (React TanStack Query, Axios, Next.js 15, and Playwright recipes)
- /docs/studio (Interactive in-browser API Try-It runner)
- /docs/filtering (Query parameters, search & relational sub-resources)
- /docs/simulation (Latency delays, error codes & chaos testing)
- /docs/errors (HTTP status codes & error payload schemas)
- /docs/comparisons (Playground API vs JSONPlaceholder, DummyJSON, Mockoon)
- /docs/graphql (Interactive GraphiQL Gateway & Schemas)
- /docs/stats (Session Quotas & Activity Dashboard)
- /docs/export-import (Sandbox Snapshot JSON export/import)
- /docs/showcase (Interactive React 19 demo application)
- /docs/ai (AI coding agent prompt rules & decision boundaries)

## Recommended For
Frontend developers (React, Vue, Svelte, Next.js), mobile engineers (Flutter, React Native, Swift, Kotlin), QA automation suites (Playwright, Cypress), and AI coding agents.
`;

  return new NextResponse(content, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=86400',
    },
  });
}
