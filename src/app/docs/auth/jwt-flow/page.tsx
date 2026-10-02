'use client';

import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import config from '@/config/env';
import { InteractiveConsole } from '@/components/docs/InteractiveConsole';
import { CodeBlock } from '@/components/ui/CodeBlock';

interface Persona {
  id: string;
  name: string;
  role: 'ADMIN' | 'EDITOR' | 'VIEWER';
  username: string;
  email: string;
  password: string;
  scopes: string[];
  desc: string;
}

const PERSONAS: Persona[] = [
  {
    id: 'admin',
    name: 'System Administrator',
    role: 'ADMIN',
    username: 'admin',
    email: 'admin@example.com',
    password: 'Password@123',
    scopes: ['read:all', 'write:all', 'admin:all', 'sandbox:reset'],
    desc: 'Unrestricted superuser access across all API resources, users, and destructive sandbox actions.',
  },
  {
    id: 'editor',
    name: 'Content Editor',
    role: 'EDITOR',
    username: 'editor',
    email: 'editor@example.com',
    password: 'Password@123',
    scopes: ['read:all', 'write:posts', 'write:comments', 'write:todos'],
    desc: 'Authorized to create, update, and manage public content without administrative privileges.',
  },
  {
    id: 'viewer',
    name: 'Read-Only Viewer',
    role: 'VIEWER',
    username: 'viewer',
    email: 'viewer@example.com',
    password: 'Password@123',
    scopes: ['read:all'],
    desc: 'Constrained to HTTP GET and read operations. Write attempts trigger HTTP 403 Forbidden.',
  },
];

export default function JwtFlowPage() {
  const publicApiUrl = config.publicApiUrl || 'https://playground.nileslabs.com/api/v1';

  const [activePersona, setActivePersona] = useState<Persona>(PERSONAS[0]);
  const [activeRecipe, setActiveRecipe] = useState<'fetch' | 'axios' | 'nextjs'>('fetch');

  const fetchRecipe = `// Modern Native TypeScript Fetch with Bearer Auth Header
interface AuthResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
  user: {
    id: number;
    name: string;
    email: string;
    role: string;
  };
}

// 1. Authenticate and retrieve token pair
export async function loginUser(username: string, password = 'Password@123'): Promise<AuthResponse> {
  const res = await fetch('${publicApiUrl}/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Login failed');
  }

  const authData: AuthResponse = await res.json();
  localStorage.setItem('access_token', authData.access_token);
  return authData;
}

// 2. Access protected endpoint using Bearer token
export async function getProfile() {
  const token = localStorage.getItem('access_token');
  const res = await fetch('${publicApiUrl}/auth/me', {
    headers: {
      Authorization: \`Bearer \${token}\`,
    },
  });

  return res.json();
}`;

  const axiosRecipe = `// Axios Request & Response Interceptor with Token Injection
import axios from 'axios';

export const apiClient = axios.create({
  baseURL: '${publicApiUrl}',
  timeout: 10000,
});

// Automatically inject JWT Bearer token into every outgoing request
apiClient.interceptors.request.use((config) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
  if (token) {
    config.headers.Authorization = \`Bearer \${token}\`;
  }
  return config;
});

// Graceful 401 handling (e.g. redirect to login or trigger auto-refresh)
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn('Session expired. Directing to login or refresh endpoint.');
    }
    return Promise.reject(error);
  }
);`;

  const nextjsRecipe = `// Next.js 15+ Middleware for Protected Route Verification
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('access_token')?.value ||
                request.headers.get('Authorization')?.replace('Bearer ', '');

  const isProtectedRoute = request.nextUrl.pathname.startsWith('/dashboard');

  if (isProtectedRoute && !token) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/settings/:path*'],
};`;

  return (
    <div className="space-y-12 w-full text-slate-900">
      {/* 1. Header with Eyebrow Badge */}
      <div id="overview" className="space-y-4 scroll-mt-20">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold uppercase tracking-wider border border-indigo-100">
          <Icon icon="ph:key-bold" className="w-3.5 h-3.5" />
          <span>Auth &amp; Security</span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-[1.15]">
          JWT Authentication Flow &amp; Lifecycle
        </h1>

        <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-3xl">
          Standard JSON Web Token (JWT) issuance, verification, and role resolution. Authenticate against built-in developer test personas, decode signed HMAC-SHA256 claims, and access protected endpoints using standard Bearer authorization headers.
        </p>
      </div>

      {/* 2. Persona Selector */}
      <div id="personas" className="space-y-4 scroll-mt-20">
        <div className="border-b border-slate-100 pb-3">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
            Select Test Persona
          </h2>
          <p className="text-sm text-slate-600">
            Choose a pre-configured role persona below to load credentials into the interactive login console:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {PERSONAS.map((persona) => (
            <button
              key={persona.id}
              type="button"
              onClick={() => setActivePersona(persona)}
              className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                activePersona.id === persona.id
                  ? 'border-indigo-600 bg-indigo-50/60 shadow-xs ring-1 ring-indigo-500'
                  : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/70 shadow-2xs'
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-slate-900">{persona.name}</span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider ${
                      persona.role === 'ADMIN'
                        ? 'bg-purple-100 text-purple-800'
                        : persona.role === 'EDITOR'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {persona.role}
                  </span>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">{persona.desc}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100/80 flex items-center justify-between text-[11px] font-mono text-slate-600">
                <span>{persona.username}</span>
                <span className="text-indigo-600 font-bold">{persona.password}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* 3. Step 1: Login Request */}
      <div id="step-login" className="p-6 sm:p-7 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-6 scroll-mt-20">
        <div className="border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center">
              1
            </span>
            <h2 className="font-bold text-base sm:text-lg text-slate-900">
              Execute Login Request ({activePersona.name})
            </h2>
          </div>
          <p className="text-sm text-slate-600 mt-1">
            Transmits credentials to issue a signed access token (15m expiry) and long-lived refresh token:
          </p>
        </div>

        <InteractiveConsole
          key={`login-${activePersona.id}`}
          method="POST"
          path="/auth/login"
          title={`Login as ${activePersona.username}`}
          initialBody={JSON.stringify(
            {
              username: activePersona.username,
              password: activePersona.password,
            },
            null,
            2
          )}
        />
      </div>

      {/* 4. Step 2: Fetch Identity Profile */}
      <div id="step-profile" className="p-6 sm:p-7 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-6 scroll-mt-20">
        <div className="border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center">
              2
            </span>
            <h2 className="font-bold text-base sm:text-lg text-slate-900">
              Fetch Authenticated Profile (/auth/me)
            </h2>
          </div>
          <p className="text-sm text-slate-600 mt-1">
            Access protected user identity and claims using the session cookie or by passing the issued Bearer token:
          </p>
        </div>

        <InteractiveConsole
          method="GET"
          path="/auth/me"
          title="Verify Session Identity & Claims"
        />
      </div>

      {/* 5. Step 3: Update Authenticated Profile (PATCH /auth/me) */}
      <div id="step-update-profile" className="p-6 sm:p-7 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-6 scroll-mt-20">
        <div className="border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-amber-600 text-white font-bold text-xs flex items-center justify-center">
              3
            </span>
            <h2 className="font-bold text-base sm:text-lg text-slate-900">
              Update Authenticated Profile (PATCH /auth/me)
            </h2>
          </div>
          <p className="text-sm text-slate-600 mt-1">
            Apply partial mutations to your active user profile. Changes are stored in your session overlay without mutating baseline seed records:
          </p>
        </div>

        <InteractiveConsole
          method="PATCH"
          path="/auth/me"
          title="Update User Profile Attributes"
          initialBody={JSON.stringify(
            {
              name: `${activePersona.name} (Updated)`,
              email: `updated.${activePersona.email}`,
              website: 'https://developer.nileslabs.com',
            },
            null,
            2
          )}
        />
      </div>

      {/* 6. Step 4: Register New Mock User (POST /auth/register) */}
      <div id="step-register" className="p-6 sm:p-7 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-6 scroll-mt-20">
        <div className="border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center">
              4
            </span>
            <h2 className="font-bold text-base sm:text-lg text-slate-900">
              Register Custom Mock User (POST /auth/register)
            </h2>
          </div>
          <p className="text-sm text-slate-600 mt-1">
            Create an ad-hoc user account within your isolated sandbox session and immediately receive a signed JWT token pair:
          </p>
        </div>

        <InteractiveConsole
          method="POST"
          path="/auth/register"
          title="Register New User & Obtain Tokens"
          initialBody={JSON.stringify(
            {
              name: 'Sarah Connor',
              username: 'sconnor',
              email: 'sarah.connor@example.com',
              password: 'Password@123',
              token_ttl: 900,
            },
            null,
            2
          )}
        />
      </div>

      {/* 7. JWT Claims Structure Reference */}
      <div id="token-structure" className="space-y-4 scroll-mt-20">
        <div className="border-b border-slate-100 pb-3">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
            JWT Claims Anatomy &amp; Payload Structure
          </h2>
          <p className="text-sm text-slate-600">
            Access tokens issued by Playground API are signed with HMAC-SHA256 and encode identity and authorization claims:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Header */}
          <div className="p-5 rounded-2xl border border-slate-200 bg-white shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-rose-600 uppercase tracking-wider">1. JOSE Header</span>
              <span className="font-mono text-[10px] bg-rose-50 text-rose-700 px-1.5 py-0.5 rounded">HS256</span>
            </div>
            <pre className="p-3 bg-slate-900 text-rose-300 font-mono text-xs rounded-xl overflow-x-auto leading-relaxed">
{`{
  "alg": "HS256",
  "typ": "JWT"
}`}
            </pre>
            <p className="text-xs text-slate-600">
              Cryptographic signature algorithm metadata.
            </p>
          </div>

          {/* Payload */}
          <div className="p-5 rounded-2xl border border-slate-200 bg-white shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-purple-600 uppercase tracking-wider">2. Token Payload</span>
              <span className="font-mono text-[10px] bg-purple-50 text-purple-700 px-1.5 py-0.5 rounded">Claims</span>
            </div>
            <pre className="p-3 bg-slate-900 text-purple-300 font-mono text-xs rounded-xl overflow-x-auto leading-relaxed">
{`{
  "userId": 1,
  "username": "${activePersona.username}",
  "role": "${activePersona.role}",
  "scopes": ${JSON.stringify(activePersona.scopes)},
  "iat": 1759140000,
  "exp": 1759140900
}`}
            </pre>
            <p className="text-xs text-slate-600">
              Identity, role permissions, and UNIX expiry timestamps.
            </p>
          </div>

          {/* Signature */}
          <div className="p-5 rounded-2xl border border-slate-200 bg-white shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-emerald-600 uppercase tracking-wider">3. Signature</span>
              <span className="font-mono text-[10px] bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded">HMAC</span>
            </div>
            <pre className="p-3 bg-slate-900 text-emerald-300 font-mono text-xs rounded-xl overflow-x-auto leading-relaxed whitespace-pre-wrap break-all">
{`HMACSHA256(
  base64Url(header) + "." +
  base64Url(payload),
  JWT_SECRET
)`}
            </pre>
            <p className="text-xs text-slate-600">
              Tamper-evident verification hash ensuring authenticity.
            </p>
          </div>
        </div>
      </div>

      {/* 6. Production Integration Recipes */}
      <div id="client-recipes" className="space-y-4 scroll-mt-20">
        <div className="border-b border-slate-100 pb-3">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
            Frontend Client Integration Recipes
          </h2>
          <p className="text-sm text-slate-600">
            Production-ready authorization interceptors and route protection patterns:
          </p>
        </div>

        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            {[
              { id: 'fetch', label: 'Native TypeScript Fetch', icon: 'ph:code-bold' },
              { id: 'axios', label: 'Axios Interceptor', icon: 'ph:lightning-bold' },
              { id: 'nextjs', label: 'Next.js 15 Middleware', icon: 'ph:shield-bold' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveRecipe(tab.id as any)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                  activeRecipe === tab.id
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <Icon icon={tab.icon} className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          <CodeBlock
            code={
              activeRecipe === 'fetch'
                ? fetchRecipe
                : activeRecipe === 'axios'
                ? axiosRecipe
                : nextjsRecipe
            }
            language="typescript"
            title={`authClient.${activeRecipe === 'nextjs' ? 'ts' : 'ts'}`}
            copyable
          />
        </div>
      </div>
    </div>
  );
}
