'use client';

import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import config from '@/config/env';

export default function CodeGeneratorsPage() {
  const publicApiUrl = config.publicApiUrl || 'https://playground.nileslabs.com/api/v1';
  const [lang, setLang] = useState<'curl' | 'js' | 'python' | 'go' | 'php'>('curl');
  const [copied, setCopied] = useState(false);

  const snippets = {
    curl: `curl -X POST "${publicApiUrl}/posts" \\
  -H "Content-Type: application/json" \\
  -H "X-Playground-Identity: dev-session-123" \\
  -d '{"title": "My Post", "body": "Lorem ipsum dolor", "userId": 1}'`,

    js: `const res = await fetch('${publicApiUrl}/posts', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-Playground-Identity': 'dev-session-123',
  },
  body: JSON.stringify({
    title: 'My Post',
    body: 'Lorem ipsum dolor',
    userId: 1,
  }),
});

const data = await res.json();
console.log('Created:', data);`,

    python: `import requests

url = "${publicApiUrl}/posts"
headers = {
    "Content-Type": "application/json",
    "X-Playground-Identity": "dev-session-123",
}
payload = {
    "title": "My Post",
    "body": "Lorem ipsum dolor",
    "userId": 1,
}

response = requests.post(url, json=payload, headers=headers)
print("Created:", response.json())`,

    go: `package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"
)

func main() {
	url := "${publicApiUrl}/posts"
	payload, _ := json.Marshal(map[string]interface{}{
		"title":  "My Post",
		"body":   "Lorem ipsum dolor",
		"userId": 1,
	})

	req, _ := http.NewRequest("POST", url, bytes.NewBuffer(payload))
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("X-Playground-Identity", "dev-session-123")

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		panic(err)
	}
	defer resp.Body.Close()

	fmt.Println("Status:", resp.Status)
}`,

    php: `<?php

$url = '${publicApiUrl}/posts';
$data = [
    'title' => 'My Post',
    'body' => 'Lorem ipsum dolor',
    'userId' => 1
];

$ch = curl_init($url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Content-Type: application/json',
    'X-Playground-Identity: dev-session-123'
]);

$response = curl_exec($ch);
curl_close($ch);

echo $response;`,
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(snippets[lang]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-12 w-full text-slate-900">
      {/* 1. Header */}
      <div id="overview" className="space-y-4 scroll-mt-20">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold uppercase tracking-wider border border-indigo-100">
          <Icon icon="ph:brackets-angle-bold" className="w-3.5 h-3.5" />
          <span>Developer Toolkit</span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-[1.15]">
          Multi-Language Code Generators
        </h1>

        <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-3xl">
          Instantly generate production-ready HTTP client code in cURL, JavaScript, Python, Go, and PHP. Includes headers, JSON serialization, and session identity wiring.
        </p>
      </div>

      {/* 2. Interactive Code Snippet Tabs */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-xs overflow-hidden">
        <div className="border-b border-slate-100 bg-slate-50/70 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <span className="font-bold text-xs text-slate-700 uppercase tracking-wider">Select Language</span>

          <div className="flex flex-wrap items-center gap-1.5">
            {(['curl', 'js', 'python', 'go', 'php'] as const).map((l) => (
              <button
                key={l}
                type="button"
                onClick={() => setLang(l)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                  lang === l
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-white border border-slate-200 text-slate-600 hover:text-slate-900'
                }`}
              >
                {l}
              </button>
            ))}
          </div>
        </div>

        <div className="p-5 bg-slate-900 relative">
          <button
            type="button"
            onClick={handleCopy}
            className="absolute top-4 right-4 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-all flex items-center gap-1 cursor-pointer"
          >
            <Icon icon={copied ? 'ph:check-bold' : 'ph:copy-bold'} className="w-3.5 h-3.5 text-indigo-400" />
            <span>{copied ? 'Copied' : 'Copy Snippet'}</span>
          </button>

          <pre className="font-mono text-xs sm:text-sm text-slate-100 overflow-x-auto leading-relaxed py-2">
            {snippets[lang]}
          </pre>
        </div>
      </div>
    </div>
  );
}
