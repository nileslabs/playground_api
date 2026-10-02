'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Icon } from '@iconify/react';
import config from '@/config/env';
import { CodeBlock } from '@/components/ui/CodeBlock';

type LanguageKey = 'curl' | 'typescript' | 'python' | 'go' | 'php' | 'axios';
type ScenarioKey = 'query' | 'create' | 'auth' | 'chaos';

export default function CodeGeneratorsPage() {
  const publicApiUrl = config.publicApiUrl || 'https://playground.nileslabs.com/api/v1';

  const [activeLang, setActiveLang] = useState<LanguageKey>('curl');
  const [activeScenario, setActiveScenario] = useState<ScenarioKey>('query');

  const languages: { key: LanguageKey; label: string; icon: string; langCode: string }[] = [
    { key: 'curl', label: 'cURL', icon: 'ph:terminal-window-bold', langCode: 'bash' },
    { key: 'typescript', label: 'TypeScript (Fetch)', icon: 'simple-icons:typescript', langCode: 'typescript' },
    { key: 'python', label: 'Python (requests)', icon: 'simple-icons:python', langCode: 'python' },
    { key: 'go', label: 'Go (net/http)', icon: 'simple-icons:go', langCode: 'go' },
    { key: 'php', label: 'PHP (cURL)', icon: 'simple-icons:php', langCode: 'php' },
    { key: 'axios', label: 'Node.js (Axios)', icon: 'simple-icons:axios', langCode: 'javascript' },
  ];

  const scenarios: { key: ScenarioKey; label: string; description: string; method: string }[] = [
    { key: 'query', label: 'Filtered GET Query', description: 'Retrieve paginated posts with search and sorting', method: 'GET' },
    { key: 'create', label: 'Stateful POST Record', description: 'Create new post isolated to session identity', method: 'POST' },
    { key: 'auth', label: 'JWT Login Auth', description: 'Authenticate user & receive Bearer access token', method: 'POST' },
    { key: 'chaos', label: 'Chaos Injection', description: 'Simulate 1800ms latency and 500 status code', method: 'GET' },
  ];

  const getSnippet = (lang: LanguageKey, scenario: ScenarioKey): string => {
    switch (lang) {
      case 'curl':
        if (scenario === 'query') {
          return `# Fetch 5 latest posts sorted descending
curl -X GET "${publicApiUrl}/posts?_limit=5&_sort=id&_order=desc" \\
  -H "Accept: application/json"`;
        }
        if (scenario === 'create') {
          return `# Create a post in your isolated sandbox session
curl -X POST "${publicApiUrl}/posts" \\
  -H "Content-Type: application/json" \\
  -H "X-Playground-Identity: test-runner-1" \\
  -d '{
    "title": "Stateful Sandbox Post",
    "body": "Mutations persist for my session identity",
    "userId": 1
  }'`;
        }
        if (scenario === 'auth') {
          return `# Authenticate with seeded user credentials
curl -X POST "${publicApiUrl}/auth/login" \\
  -H "Content-Type: application/json" \\
  -d '{
    "username": "kminchelle",
    "password": "password123"
  }'`;
        }
        return `# Simulate 1800ms network latency and an HTTP 500 error
curl -X GET "${publicApiUrl}/posts?_delay=1800&_status=500" \\
  -H "Accept: application/json"`;

      case 'typescript':
        if (scenario === 'query') {
          return `// Fetch paginated posts using standard Fetch API
const response = await fetch('${publicApiUrl}/posts?_limit=5&_sort=id&_order=desc', {
  headers: { 'Accept': 'application/json' },
  credentials: 'include', // Preserves browser cookie session
});

if (!response.ok) throw new Error(\`HTTP error: \${response.status}\`);
const { data, pagination } = await response.json();
console.log('Posts:', data);`;
        }
        if (scenario === 'create') {
          return `// Create a record with stateful session isolation
const response = await fetch('${publicApiUrl}/posts', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-Playground-Identity': 'test-runner-1', // Or use credentials: 'include'
  },
  body: JSON.stringify({
    title: 'Stateful Sandbox Post',
    body: 'Mutations persist for my session identity',
    userId: 1,
  }),
});

const createdRecord = await response.json();
console.log('Created record ID:', createdRecord.id);`;
        }
        if (scenario === 'auth') {
          return `// JWT Authentication flow
const response = await fetch('${publicApiUrl}/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    username: 'kminchelle',
    password: 'password123',
  }),
});

const { token, user } = await response.json();
console.log('Access token:', token);
console.log('Welcome,', user.name);`;
        }
        return `// Chaos simulation: tests loading skeletons & error handling
try {
  const response = await fetch('${publicApiUrl}/posts?_delay=1800&_status=500');
  if (!response.ok) {
    console.error('Triggered intentional chaos error:', response.status);
  }
} catch (err) {
  console.error('Network failure:', err);
}`;

      case 'python':
        if (scenario === 'query') {
          return `import requests

url = "${publicApiUrl}/posts"
params = {
    "_limit": 5,
    "_sort": "id",
    "_order": "desc"
}

response = requests.get(url, params=params)
response.raise_for_status()

result = response.json()
print("Retrieved posts:", len(result.get("data", [])))`;
        }
        if (scenario === 'create') {
          return `import requests

url = "${publicApiUrl}/posts"
headers = {
    "Content-Type": "application/json",
    "X-Playground-Identity": "test-runner-1"
}
payload = {
    "title": "Stateful Sandbox Post",
    "body": "Mutations persist for my session identity",
    "userId": 1
}

response = requests.post(url, json=payload, headers=headers)
response.raise_for_status()

print("Created post ID:", response.json().get("id"))`;
        }
        if (scenario === 'auth') {
          return `import requests

url = "${publicApiUrl}/auth/login"
credentials = {
    "username": "kminchelle",
    "password": "password123"
}

response = requests.post(url, json=credentials)
response.raise_for_status()

data = response.json()
print("Access token:", data.get("token"))`;
        }
        return `import requests

# Test retry logic with simulated network chaos
try:
    response = requests.get("${publicApiUrl}/posts?_delay=1800&_status=500")
    print("Status:", response.status_code)
except requests.exceptions.RequestException as err:
    print("Error:", err)`;

      case 'go':
        if (scenario === 'query') {
          return `package main

import (
	"encoding/json"
	"fmt"
	"net/http"
)

func main() {
	url := "${publicApiUrl}/posts?_limit=5&_sort=id&_order=desc"
	resp, err := http.Get(url)
	if err != nil {
		panic(err)
	}
	defer resp.Body.Close()

	var result map[string]interface{}
	json.NewDecoder(resp.Body).Decode(&result)
	fmt.Println("Status:", resp.Status)
}`;
        }
        if (scenario === 'create') {
          return `package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"
)

func main() {
	payload, _ := json.Marshal(map[string]interface{}{
		"title":  "Stateful Sandbox Post",
		"body":   "Mutations persist for my session identity",
		"userId": 1,
	})

	req, _ := http.NewRequest("POST", "${publicApiUrl}/posts", bytes.NewBuffer(payload))
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("X-Playground-Identity", "test-runner-1")

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		panic(err)
	}
	defer resp.Body.Close()

	fmt.Println("Record created. Status:", resp.Status)
}`;
        }
        if (scenario === 'auth') {
          return `package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"
)

func main() {
	body, _ := json.Marshal(map[string]string{
		"username": "kminchelle",
		"password": "password123",
	})

	resp, err := http.Post("${publicApiUrl}/auth/login", "application/json", bytes.NewBuffer(body))
	if err != nil {
		panic(err)
	}
	defer resp.Body.Close()

	fmt.Println("Auth Status:", resp.Status)
}`;
        }
        return `package main

import (
	"fmt"
	"net/http"
	"time"
)

func main() {
	client := &http.Client{Timeout: 3 * time.Second}
	resp, err := client.Get("${publicApiUrl}/posts?_delay=1800&_status=500")
	if err != nil {
		fmt.Println("Network or timeout error:", err)
		return
	}
	defer resp.Body.Close()

	fmt.Println("Chaos status:", resp.Status)
}`;

      case 'php':
        if (scenario === 'query') {
          return `<?php

$ch = curl_init('${publicApiUrl}/posts?_limit=5&_sort=id&_order=desc');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ['Accept: application/json']);

$response = curl_exec($ch);
curl_close($ch);

$data = json_decode($response, true);
echo "Fetched " . count($data['data']) . " posts";`;
        }
        if (scenario === 'create') {
          return `<?php

$payload = json_encode([
    'title' => 'Stateful Sandbox Post',
    'body' => 'Mutations persist for my session identity',
    'userId' => 1
]);

$ch = curl_init('${publicApiUrl}/posts');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, $payload);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Content-Type: application/json',
    'X-Playground-Identity: test-runner-1'
]);

$response = curl_exec($ch);
curl_close($ch);

echo "Created Post: " . $response;`;
        }
        if (scenario === 'auth') {
          return `<?php

$credentials = json_encode([
    'username' => 'kminchelle',
    'password' => 'password123'
]);

$ch = curl_init('${publicApiUrl}/auth/login');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, $credentials);
curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);

$response = curl_exec($ch);
curl_close($ch);

$auth = json_decode($response, true);
echo "Token: " . $auth['token'];`;
        }
        return `<?php

$ch = curl_init('${publicApiUrl}/posts?_delay=1800&_status=500');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_TIMEOUT, 5);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

echo "Chaos Status Code: " . $httpCode;`;

      case 'axios':
        if (scenario === 'query') {
          return `import axios from 'axios';

const { data } = await axios.get('${publicApiUrl}/posts', {
  params: {
    _limit: 5,
    _sort: 'id',
    _order: 'desc',
  },
  withCredentials: true, // Forwards cookies in browser environments
});

console.log('Retrieved posts:', data.data);`;
        }
        if (scenario === 'create') {
          return `import axios from 'axios';

const { data } = await axios.post(
  '${publicApiUrl}/posts',
  {
    title: 'Stateful Sandbox Post',
    body: 'Mutations persist for my session identity',
    userId: 1,
  },
  {
    headers: {
      'X-Playground-Identity': 'test-runner-1',
    },
  }
);

console.log('Created record ID:', data.id);`;
        }
        if (scenario === 'auth') {
          return `import axios from 'axios';

const { data } = await axios.post('${publicApiUrl}/auth/login', {
  username: 'kminchelle',
  password: 'password123',
});

console.log('Access token:', data.token);
console.log('User:', data.user.name);`;
        }
        return `import axios from 'axios';

try {
  await axios.get('${publicApiUrl}/posts', {
    params: { _delay: 1800, _status: 500 },
  });
} catch (error) {
  if (axios.isAxiosError(error)) {
    console.error('Simulated chaos status:', error.response?.status); // 500
  }
}`;
    }
  };

  const selectedLangObj = languages.find((l) => l.key === activeLang) || languages[0];

  return (
    <div className="space-y-12 w-full text-slate-900">
      {/* 1. Header with Eyebrow Badge */}
      <div id="overview" className="space-y-4 scroll-mt-20">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold uppercase tracking-wider border border-indigo-100">
          <Icon icon="ph:brackets-angle-bold" className="w-3.5 h-3.5" />
          <span>Developer Toolkit</span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-[1.15]">
          Multi-Language Code Generators
        </h1>

        <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-3xl">
          Instantly generate copy-pasteable request snippets across 6 popular languages and HTTP clients. Each snippet is pre-configured with session identity headers, relational queries, and chaos engineering flags.
        </p>
      </div>

      {/* 2. Interactive Generator Controls */}
      <div id="generator" className="space-y-6 scroll-mt-20">
        {/* Step A: Choose Scenario */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
            Step 1: Select API Action Scenario
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {scenarios.map((sc) => (
              <button
                key={sc.key}
                type="button"
                onClick={() => setActiveScenario(sc.key)}
                className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                  activeScenario === sc.key
                    ? 'bg-indigo-50/80 border-indigo-300 ring-2 ring-indigo-500/20 shadow-xs'
                    : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/60 shadow-2xs'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span
                    className={`px-2 py-0.5 rounded text-[11px] font-bold font-mono ${
                      sc.method === 'GET' ? 'bg-emerald-100 text-emerald-800' : 'bg-indigo-100 text-indigo-800'
                    }`}
                  >
                    {sc.method}
                  </span>
                </div>
                <h3 className="font-bold text-sm text-slate-900">{sc.label}</h3>
                <p className="text-xs text-slate-600 mt-1 line-clamp-2">{sc.description}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Step B: Choose Language */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
            Step 2: Choose Client Language / HTTP Library
          </label>
          <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-2">
            {languages.map((l) => (
              <button
                key={l.key}
                type="button"
                onClick={() => setActiveLang(l.key)}
                className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer flex items-center gap-2 ${
                  activeLang === l.key
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <Icon icon={l.icon} className="w-4 h-4" />
                <span>{l.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Render Generated CodeBlock */}
        <div className="pt-1">
          <CodeBlock
            code={getSnippet(activeLang, activeScenario)}
            language={selectedLangObj.langCode}
            title={`${activeScenario}-request.${selectedLangObj.key === 'curl' ? 'sh' : selectedLangObj.key === 'python' ? 'py' : selectedLangObj.key === 'go' ? 'go' : selectedLangObj.key === 'php' ? 'php' : 'ts'}`}
            subtitle={selectedLangObj.label}
            maxHeight="max-h-115"
          />
        </div>
      </div>

      {/* 3. Essential Headers & Flags Reference */}
      <div id="headers-reference" className="space-y-4 scroll-mt-20">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
          Key Request Parameters &amp; Headers
        </h2>

        <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-xs">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold">
              <tr>
                <th className="py-3.5 px-4">Modifier / Header</th>
                <th className="py-3.5 px-4">Type</th>
                <th className="py-3.5 px-4">Example</th>
                <th className="py-3.5 px-4">Purpose</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono text-xs">
              <tr>
                <td className="py-3 px-4 font-bold text-indigo-700">X-Playground-Identity</td>
                <td className="py-3 px-4 text-slate-500 font-sans">HTTP Header</td>
                <td className="py-3 px-4 text-slate-700 font-mono">runner-ci-42</td>
                <td className="py-3 px-4 text-slate-600 font-sans text-xs">
                  Isolates stateful mutations (POST/PUT/DELETE) to a specific test runner or user key.
                </td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-bold text-indigo-700">?_delay=ms</td>
                <td className="py-3 px-4 text-slate-500 font-sans">Query Param</td>
                <td className="py-3 px-4 text-slate-700 font-mono">?_delay=1500</td>
                <td className="py-3 px-4 text-slate-600 font-sans text-xs">
                  Artificially injects latency in milliseconds before sending the HTTP response.
                </td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-bold text-indigo-700">?_status=code</td>
                <td className="py-3 px-4 text-slate-500 font-sans">Query Param</td>
                <td className="py-3 px-4 text-slate-700 font-mono">?_status=500</td>
                <td className="py-3 px-4 text-slate-600 font-sans text-xs">
                  Forces the API to return the specified HTTP status code (e.g., 400, 401, 404, 429, 500).
                </td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-bold text-indigo-700">X-Chaos-Flaky</td>
                <td className="py-3 px-4 text-slate-500 font-sans">HTTP Header</td>
                <td className="py-3 px-4 text-slate-700 font-mono">0.35</td>
                <td className="py-3 px-4 text-slate-600 font-sans text-xs">
                  Simulates flaky network jitter (35% probability of dropped connection or failure).
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. Navigation Footer */}
      <div className="p-6 sm:p-7 rounded-2xl border border-indigo-100 bg-indigo-50/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h3 className="font-bold text-base text-slate-900">Want to inspect mutations live in Chrome DevTools?</h3>
          <p className="text-sm text-slate-600">Install the official browser extension companion for real-time telemetry.</p>
        </div>
        <Link
          href="/docs/toolkit/devtools-extension"
          className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm transition-all shrink-0"
        >
          View DevTools Companion
        </Link>
      </div>
    </div>
  );
}
