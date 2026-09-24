'use client';

import React, { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import { CodeBlock } from '@/components/ui/CodeBlock';
import config from '@/config/env';

export function QuickstartTabs() {
  const [baseUrl, setBaseUrl] = useState<string>(config.publicApiUrl || 'https://playground.nileslabs.com/api/v1');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const origin = window.location.origin;
      const apiPrefix = config.apiUrl.startsWith('http')
        ? config.apiUrl
        : `${origin}${config.apiUrl.startsWith('/') ? '' : '/'}${config.apiUrl}`;
      setBaseUrl(apiPrefix);
    }
  }, []);

  const snippets: Record<string, string> = {
    sdk: `// Official TypeScript / JavaScript SDK
import { PlaygroundClient } from '@playground-api/sdk';

const client = new PlaygroundClient({
  identityToken: 'your_sandbox_token' // Optional: auto-persists in cookies
});

// 1. Fetch paginated posts with live overlays
const { data: posts } = await client.posts.list({ limit: 5 });
console.log('Posts:', posts);

// 2. Create a sandboxed post (persists for your session)
const newPost = await client.posts.create({
  title: 'Next.js 16 Prototype Article',
  body: 'Persists in private browser session overlay',
  user_id: 1
});
console.log('Created Post:', newPost.id);`,

    javascript: `// Fetch posts using standard native JavaScript Fetch
const response = await fetch('${baseUrl}/posts?_limit=5', {
  credentials: 'include' // Persists per-session sandbox mutations
});
const posts = await response.json();
console.log('Posts:', posts);

// Create a new post in your isolated session overlay
const createRes = await fetch('${baseUrl}/posts', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  credentials: 'include',
  body: JSON.stringify({
    title: 'New Prototype Article',
    user_id: 1
  })
});
const newPost = await createRes.json();
console.log('Created post:', newPost);`,

    axios: `import axios from 'axios';

// Configure Axios client with credentials for session persistence
const api = axios.create({
  baseURL: '${baseUrl}',
  withCredentials: true
});

// Fetch posts
const { data: posts } = await api.get('/posts', {
  params: { _limit: 5 }
});
console.log('Fetched posts:', posts);

// Create a new sandboxed post
const { data: newPost } = await api.post('/posts', {
  title: 'New Prototype Article',
  user_id: 1
});
console.log('Created post:', newPost);`,

    python: `import requests

session = requests.Session()

# Fetch paginated posts
url = "${baseUrl}/posts"
response = session.get(url, params={"_limit": 5})
posts = response.json()
print("Posts:", posts)

# Create a new sandboxed post
new_post = {
    "title": "New Prototype Article",
    "user_id": 1
}
created = session.post(url, json=new_post).json()
print("Created Post:", created)`,

    go: `package main

import (
\t"bytes"
\t"encoding/json"
\t"fmt"
\t"io"
\t"net/http"
)

func main() {
\tclient := &http.Client{}

\t// 1. Fetch paginated posts
\tresp, err := client.Get("${baseUrl}/posts?_limit=5")
\tif err != nil {
\t\tpanic(err)
\t}
\tdefer resp.Body.Close()

\tbody, _ := io.ReadAll(resp.Body)
\tfmt.Println("Posts:", string(body))
}`,

    curl: `# Fetch paginated posts with baseline and virtual overlays
curl -X GET "${baseUrl}/posts?_limit=5"

# Create a new sandboxed post
curl -X POST "${baseUrl}/posts" \\
  -H "Content-Type: application/json" \\
  -d '{"title": "New Prototype Article", "user_id": 1}'

# Simulate slow 3G latency (1500ms)
curl -X GET "${baseUrl}/posts" \\
  -H "X-Simulate-Delay: 1500"`,
  };

  return (
    <section className="py-20 lg:py-28 bg-bg-surface/40 border-b border-border-default">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-primary/10 border border-brand-primary/20 text-brand-primary text-xs font-semibold tracking-wide">
            <Icon icon="ph:code-bold" className="w-3.5 h-3.5" />
            <span>Developer Quickstart</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-text-primary tracking-tight">
            Plug & Play Integration Code
          </h2>
          <p className="text-sm sm:text-base text-text-secondary leading-relaxed">
            Copy and paste battle-tested snippets for TypeScript SDK, Fetch, Axios, Python, Go, or cURL.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <CodeBlock
            snippets={snippets}
            defaultTab="sdk"
            maxHeight="max-h-[32rem]"
            className="shadow-2xl rounded-2xl border border-border-default"
          />
        </div>
      </div>
    </section>
  );
}

export default QuickstartTabs;
