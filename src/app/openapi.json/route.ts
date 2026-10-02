import { NextResponse } from 'next/server';
import config from '@/config/env';

export async function GET() {
  const backendUrl =
    process.env.BACKEND_URL ||
    process.env.NEXT_PUBLIC_BACKEND_URL ||
    'http://localhost:3001';

  try {
    const res = await fetch(`${backendUrl}/api/v1/downloads/openapi.json`, {
      next: { revalidate: 3600 },
    });

    if (res.ok) {
      const data = await res.json();
      return NextResponse.json(data, {
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          'Content-Disposition': 'inline; filename="playground-api.openapi.json"',
          'Access-Control-Allow-Origin': '*',
          'Cache-Control': 'public, max-age=3600, s-maxage=86400',
        },
      });
    }
  } catch (error) {
    console.error('Failed to proxy openapi.json from backend:', error);
  }

  // Graceful fallback minimal spec if backend is temporarily unreachable
  const siteUrl = config.siteUrl || 'https://playground.nileslabs.com';
  const apiUrl = config.publicApiUrl || 'https://playground.nileslabs.com/api/v1';

  return NextResponse.json(
    {
      openapi: '3.0.0',
      info: {
        title: 'Playground API',
        version: '1.0.0',
        description:
          'Free stateful mock REST & GraphQL API sandbox with session isolation overlays.',
      },
      servers: [{ url: apiUrl, description: 'Playground API Base Endpoint' }],
      paths: {
        '/posts': {
          get: { summary: 'List posts with pagination and filters' },
          post: { summary: 'Create a persistent post in visitor sandbox' },
        },
        '/users': { get: { summary: 'List user profiles' } },
        '/comments': { get: { summary: 'List comments' } },
        '/todos': { get: { summary: 'List todos' } },
        '/session/reset': { delete: { summary: 'Reset visitor sandbox overlay' } },
      },
    },
    {
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Content-Disposition': 'inline; filename="playground-api.openapi.json"',
        'Access-Control-Allow-Origin': '*',
      },
    }
  );
}
