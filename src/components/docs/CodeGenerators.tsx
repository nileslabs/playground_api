'use client';

import React, { useState, useEffect } from 'react';
import { EndpointDef } from '@/config/api-catalog';
import { CodeBlock } from '@/components/ui/CodeBlock';
import config from '@/config/env';

interface CodeGeneratorsProps {
  endpoint: EndpointDef;
}

export function CodeGenerators({ endpoint }: CodeGeneratorsProps) {
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

  const fullUrl = `${baseUrl}${endpoint.path}`;
  const hasBody = ['POST', 'PUT', 'PATCH'].includes(endpoint.method) && endpoint.requestBody;
  const bodyStr = hasBody ? JSON.stringify(endpoint.requestBody, null, 2) : '';

  const snippets: Record<string, string> = {
    curl: `curl -X ${endpoint.method} "${fullUrl}" \\
  -H "Content-Type: application/json" \\
  -H "X-Playground-Identity: local-visitor"${
    hasBody ? ` \\\n  -d '${JSON.stringify(endpoint.requestBody)}'` : ''
  }`,

    typescript: `import { PlaygroundClient } from '@playground-api/sdk';

// Initialize the client with isolated session identity
const client = new PlaygroundClient({
  baseUrl: '${baseUrl}',
  identity: 'local-visitor', // Injected from browser cookie or localStorage
});

async function main() {
  const data = await client.${endpoint.method.toLowerCase()}('${endpoint.path}'${
    hasBody ? `, ${bodyStr}` : ''
  });
  console.log(data);
}

main().catch(console.error);`,

    javascript: `// Modern Fetch with isolated session tracking
fetch('${fullUrl}', {
  method: '${endpoint.method}',
  headers: {
    'Content-Type': 'application/json',
    'X-Playground-Identity': 'local-visitor'
  }${hasBody ? `,\n  body: JSON.stringify(${bodyStr})` : ''}
})
  .then(res => res.json())
  .then(data => console.log(data))
  .catch(err => console.error(err));`,

    axios: `import axios from 'axios';

axios.${endpoint.method.toLowerCase()}('${fullUrl}'${
      hasBody ? `, ${bodyStr}` : ''
    }, {
  headers: {
    'Content-Type': 'application/json',
    'X-Playground-Identity': 'local-visitor'
  }
})
  .then(response => console.log(response.data))
  .catch(error => console.error(error));`,

    python: `import requests

url = "${fullUrl}"
headers = {
    "Content-Type": "application/json",
    "X-Playground-Identity": "local-visitor"
}

response = requests.${endpoint.method.toLowerCase()}(
    url,
    headers=headers${hasBody ? `, json=${JSON.stringify(endpoint.requestBody)}` : ''}
)
print(response.json())`,

    go: `package main

import (
\t"fmt"
\t"io"
\t"net/http"${hasBody ? '\n\t"strings"' : ''}
)

func main() {
\treq, err := http.NewRequest("${endpoint.method}", "${fullUrl}", ${
      hasBody ? `strings.NewReader(\`${bodyStr}\`)` : 'nil'
    })
\tif err != nil {
\t\tpanic(err)
\t}

\treq.Header.Set("Content-Type", "application/json")
\treq.Header.Set("X-Playground-Identity", "local-visitor")

\tresp, err := http.DefaultClient.Do(req)
\tif err != nil {
\t\tpanic(err)
\t}
\tdefer resp.Body.Close()

\tbody, _ := io.ReadAll(resp.Body)
\tfmt.Println(string(body))
}`,

    swift: `import Foundation

var request = URLRequest(url: URL(string: "${fullUrl}")!)
request.httpMethod = "${endpoint.method}"
request.setValue("application/json", forHTTPHeaderField: "Content-Type")
request.setValue("local-visitor", forHTTPHeaderField: "X-Playground-Identity")${
      hasBody
        ? `\nrequest.httpBody = """\n${bodyStr}\n""".data(using: .utf8)`
        : ''
    }

let task = URLSession.shared.dataTask(with: request) { data, response, error in
    if let data = data, let str = String(data: data, encoding: .utf8) {
        print(str)
    }
}
task.resume()`,

    rust: `use reqwest;

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let client = reqwest::Client::new();
    let res = client.${endpoint.method.toLowerCase()}("${fullUrl}")
        .header("Content-Type", "application/json")
        .header("X-Playground-Identity", "local-visitor")${
          hasBody ? `\n        .body(r#"${bodyStr}"#)` : ''
        }
        .send()
        .await?
        .text()
        .await?;

    println!("{}", res);
    Ok(())
}`,

    php: `<?php
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, "${fullUrl}");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "${endpoint.method}");
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Content-Type: application/json',
    'X-Playground-Identity: local-visitor'
]);${
      hasBody
        ? `\ncurl_setopt($ch, CURLOPT_POSTFIELDS, '${JSON.stringify(endpoint.requestBody)}');`
        : ''
    }

$response = curl_exec($ch);
curl_close($ch);
echo $response;`,
  };

  return <CodeBlock snippets={snippets} defaultTab="curl" maxHeight="max-h-72" />;
}
