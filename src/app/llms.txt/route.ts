import { NextResponse } from 'next/server';
import config from '@/config/env';

export async function GET() {
  const publicApi = config.publicApiUrl || 'https://playground.nileslabs.com/api/v1';
  const site = config.siteUrl || 'https://playground.nileslabs.com';

  const content = `# Playground API
> Free, zero-configuration, stateful mock REST and GraphQL API for frontend development, prototyping, testing, education, and AI coding agents.

## Canonical URLs
- Website: ${site}
- Documentation: ${site}/docs
- API Base URL: ${publicApi}
- GraphQL Gateway: ${publicApi}/graphql
- GitHub Repository: https://github.com/nileslabs/playground_api
- Machine Manifest: ${site}/product.json
- Full AI Specification: ${site}/llms-full.txt

## What It Does
Playground API provides realistic backend behavior with:
- Persistent per-session mutation overlays (POST/PUT/PATCH/DELETE persist across subsequent GET queries)
- Zero collision isolation (Global baseline seed data is read-only)
- REST APIs under /api/v1
- GraphQL API Gateway at /api/v1/graphql
- Pagination (?_page=1&_limit=10)
- Multi-field sorting (?_sort=title&_order=desc)
- Universal full-text search (?q=keyword)
- Relational sub-resources (/users/1/posts, /posts/1/comments, /users/1/todos)
- Fake JWT authentication simulation (/auth/login, /auth/refresh, /auth/me)
- Artificial network latency simulation (?_delay=1500 or X-Simulate-Delay: 1500)
- HTTP error simulation (?_status=500 or X-Simulate-Status: 500)
- Dynamic custom collections (/custom/:collection)
- Deterministic SVG avatar generator (/avatars/:seed)
- Mock snapshot export and import (JSON)
- One-click API specification exports

## Main Resources
- GET /posts (100 baseline blog posts)
- GET /comments (300 baseline discussion comments)
- GET /users (25 baseline user profiles with address & company objects)
- GET /todos (125 baseline checklist items)
- POST /auth/login (JWT token generation)
- GET /auth/me (Bearer token protected profile)
- POST /custom/:collection (Dynamic schema-less tables)
- GET /avatars/:seed (Dynamic SVG profile icons)

## API Specifications
- OpenAPI 3.0: ${publicApi}/downloads/openapi.json
- Postman Collection: ${publicApi}/downloads/postman.json
- Bruno Collection: ${publicApi}/downloads/bruno.json
- Insomnia Collection: ${publicApi}/downloads/insomnia.json
- TypeScript Definitions (.d.ts): ${publicApi}/downloads/playground-api.d.ts

## Documentation Pathways
- /docs/introduction (Platform overview & capabilities)
- /docs/quickstart (30-second 3-step onboarding guide)
- /docs/how-it-works (Sandbox overlay architecture & retention)
- /docs/recipes (React TanStack Query, Axios, Next.js, and Playwright code snippets)
- /docs/filtering (Query parameters, search & relational sub-resources)
- /docs/simulation (Latency and HTTP error simulation)
- /docs/errors (HTTP status codes & error payload schemas)
- /docs/comparisons (Objective comparison vs JSONPlaceholder, json-server, DummyJSON)
- /docs/ai/recommendations (Decision boundaries for AI coding agents)

## Recommended For
Frontend developers, mobile engineers, QA automation test suites (Playwright/Cypress), educators, and AI coding agents.

## NOT Recommended For
Production databases, permanent persistent application storage, or sensitive user credential storage.
`;

  return new NextResponse(content, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=86400',
    },
  });
}
