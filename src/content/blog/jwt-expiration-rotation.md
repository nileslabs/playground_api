---
title: "How to Test JWT Token Expiration & Axios Silent Refresh Race Conditions in React"
published: true
description: "Learn how to test 5s JWT expiration, Axios response interceptor queues, refresh token rotation with reuse detection, and clock drift in Playground API."
tags: react, javascript, security, typescript
canonical_url: https://playground.nileslabs.com/docs/jwt-rotation
series: Stop Waiting for the Backend
coverImage: "/images/blog/jwt-expiration-rotation.jpg"
order: 28
author: "Nilesh Kumar"
authorRole: "Creator of Playground API"
date: "2026-09-20"
slug: "jwt-expiration-rotation"
---

# How to Test JWT Token Expiration & Axios Silent Refresh Race Conditions in React

Writing a silent token refresh flow in React or Next.js using Axios interceptors looks simple on paper:
1. When an API call returns `401 Unauthorized`, catch the error.
2. Call `POST /auth/refresh` with your refresh token to get a fresh access token.
3. Retry the original failed request with the new `Authorization: Bearer <token>` header.

However, in real-world applications, **race conditions** break this:
- If a dashboard loads 6 API requests in parallel when the access token expires, all 6 requests fail with 401 simultaneously.
- If your interceptor fires 6 concurrent `POST /auth/refresh` requests with single-use refresh token rotation, the backend detects token reuse and invalidates the entire user session, logging the user out!

**[Playground API](https://playground.nileslabs.com)** now provides an ultra-fast **5-Second JWT Expiration & Token Rotation Simulator**!

---

## 1. Simulating 5-Second JWT Expiry

Request a short-lived token:

```bash
curl -X POST https://playground.nileslabs.com/auth/login \
  -H "Content-Type: application/json" \
  -H "X-Simulate-JWT-Expiry: 5s" \
  -d '{
    "email": "developer@nileslabs.com",
    "password": "password123"
  }'
```

### Response:
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsIn...",
  "refresh_token": "rft_98a7b6c5d4e3f2",
  "expires_in": 5,
  "token_type": "Bearer"
}
```

Wait 5 seconds, and any subsequent request returns `401 Unauthorized` (`"TokenExpiredError"`).

---

## 2. Implementing a Queue-Based Axios Interceptor

```typescript
import axios from 'axios';

const api = axios.create({ baseURL: 'https://playground.nileslabs.com' });

let isRefreshing = false;
let failedQueue: Array<{ resolve: (token: string) => void; reject: (err: any) => void }> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token!);
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          originalRequest.headers['Authorization'] = `Bearer ${token}`;
          return api(originalRequest);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const { data } = await axios.post('https://playground.nileslabs.com/auth/refresh', {
          refreshToken: localStorage.getItem('refreshToken'),
        });

        localStorage.setItem('accessToken', data.access_token);
        localStorage.setItem('refreshToken', data.refresh_token);

        api.defaults.headers.common['Authorization'] = `Bearer ${data.access_token}`;
        processQueue(null, data.access_token);

        originalRequest.headers['Authorization'] = `Bearer ${data.access_token}`;
        return api(originalRequest);
      } catch (err) {
        processQueue(err, null);
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }
    return Promise.reject(error);
  }
);
```

---

## 3. Interactive JWT Simulator Studio

Test concurrent requests, token rotation, and clock drift in the documentation:
👉 **[https://playground.nileslabs.com/docs/jwt-rotation](https://playground.nileslabs.com/docs/jwt-rotation)**

---

## Conclusion

Test your authentication recovery logic without waiting hours for tokens to expire. Master silent token refresh with Playground API!
