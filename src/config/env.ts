/**
 * Environment Configuration Module
 * Rule: NEVER access process.env directly outside this file.
 */

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://playground.nileslabs.com';
const API_URL = process.env.NEXT_PUBLIC_API_URL || '/api/v1';

const cleanSite = (SITE_URL || 'https://playground.nileslabs.com').replace(/\/+$/, '');
const cleanApi = API_URL.startsWith('/') ? API_URL : `/${API_URL}`;
const PUBLIC_API_URL = API_URL.startsWith('http') ? API_URL : `${cleanSite}${cleanApi}`;

/**
 * Returns the HTTP origin/URL of the backend server.
 * In local development, the backend server runs on port 3001 while Next.js runs on 3000.
 */
export const getBackendBaseUrl = (): string => {
  if (process.env.NEXT_PUBLIC_BACKEND_URL) {
    return process.env.NEXT_PUBLIC_BACKEND_URL.replace(/\/+$/, '');
  }
  if (typeof window !== 'undefined') {
    const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    if (isLocal) {
      return `${window.location.protocol}//${window.location.hostname}:3001`;
    }
    return window.location.origin;
  }
  return 'http://localhost:3001';
};

/**
 * Returns the WebSocket endpoint URL (ws:// or wss://) for the given path.
 */
export const getWebSocketUrl = (path: string = '/ws'): string => {
  if (process.env.NEXT_PUBLIC_WS_URL) {
    const base = process.env.NEXT_PUBLIC_WS_URL.replace(/\/+$/, '');
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    if (base.endsWith('/ws') && cleanPath === '/ws') {
      return base;
    }
    return `${base}${cleanPath}`;
  }
  const httpBase = getBackendBaseUrl();
  const wsBase = httpBase.replace(/^http/, 'ws');
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${wsBase}${cleanPath}`;
};

const envConfig = {
  env: process.env.NODE_ENV || 'development',
  isDevelopment: process.env.NODE_ENV !== 'production',
  isProduction: process.env.NODE_ENV === 'production',
  port: 3000,
  siteUrl: cleanSite,
  apiUrl: cleanApi,
  publicApiUrl: PUBLIC_API_URL,
  backendUrl: process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001',
  wsUrl: process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:3001/ws',
  apiVersion: 'v1',
  googleAnalyticsId: process.env.NEXT_PUBLIC_GA_ID || 'G-V71LLWPW9J',
  getBackendBaseUrl,
  getWebSocketUrl,
};

export default envConfig;

