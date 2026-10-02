import { NextResponse } from 'next/server';
import config from '@/config/env';

export async function GET() {
  const site = config.siteUrl || 'https://playground.nileslabs.com';

  const pluginManifest = {
    schema_version: 'v1',
    name_for_model: 'playground_api',
    name_for_human: 'Playground API',
    description_for_model:
      'Free, zero-configuration, stateful mock REST and GraphQL API sandbox for web and mobile development. Provides persistent per-session CRUD mutation overlays, JWT auth loops, mock Stripe payments, virtual email/SMS OTP inboxes, WebSocket chat servers, and network latency/chaos simulation.',
    description_for_human:
      'Stateful mock REST & GraphQL API sandbox with private per-session persistence for prototyping and testing.',
    auth: {
      type: 'none',
    },
    api: {
      type: 'openapi',
      url: `${site}/openapi.json`,
    },
    logo_url: `${site}/favicon.svg`,
    contact_email: 'support@nileslabs.com',
    legal_info_url: `${site}/docs/introduction`,
  };

  return NextResponse.json(pluginManifest, {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'public, max-age=86400, s-maxage=604800',
    },
  });
}
