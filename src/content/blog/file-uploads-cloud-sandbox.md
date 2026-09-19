---
title: "How to Test Multipart File Uploads & Cloud Storage CDN in React Without an S3 Bucket"
published: true
description: "Learn how to test multipart/form-data file uploads, progress bars, image previews, latency simulation, and bulk uploads using Playground API."
tags: webdev, react, javascript, cloud
canonical_url: https://playground.nileslabs.com/docs/uploads
series: Stop Waiting for the Backend
coverImage: "/images/blog/file-uploads-cloud-sandbox.jpg"
order: 15
author: "Nilesh Kumar"
authorRole: "Creator of Playground API"
date: "2026-09-20"
slug: "file-uploads-cloud-sandbox"
---

# How to Test Multipart File Uploads & Cloud Storage CDN in React Without an S3 Bucket

Building drag-and-drop file upload interfaces in React often hits a major hurdle during development: where do the files actually go?

Setting up AWS S3 pre-signed URLs or Cloudinary credentials just to test if your progress bar animates or if image thumbnails render properly is tedious. Worse, when you need to test edge cases—like uploading a 15MB file over a slow 3G connection, or handling unsupported file types (415 Unsupported Media Type)—mocking `FormData` requests in client-side code feels impossible.

**[Playground API](https://playground.nileslabs.com)** provides a dedicated **Multipart File Upload & Cloud Storage Sandbox** (`POST /api/v1/uploads` and `POST /api/v1/uploads/bulk`) with simulated upload latency and CDN media URLs!

---

## 1. Uploading a Single File with `FormData`

Send standard `multipart/form-data` requests:

```typescript
const formData = new FormData();
formData.append('file', selectedFile);
formData.append('folder', 'avatars');

const res = await fetch('https://playground.nileslabs.com/api/v1/uploads', {
  method: 'POST',
  body: formData,
});

const data = await res.json();
console.log('CDN URL:', data.url);
```

### JSON Response:
```json
{
  "id": "upl_9f8a7b6c5d",
  "filename": "avatar.png",
  "mimetype": "image/png",
  "size": 245912,
  "url": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop",
  "thumbnail_url": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop",
  "folder": "avatars",
  "created_at": "2026-09-20T00:00:00.000Z"
}
```

---

## 2. Simulating Upload Latency & Progress Bars

To test your UI progress bars and loading spinners under real-world conditions, pass the `_delay` query parameter or `X-Simulate-Delay` header:

```bash
curl -X POST "https://playground.nileslabs.com/api/v1/uploads?_delay=2000" \
  -F "file=@sample.pdf"
```

Playground API holds the connection and streams progress events before completing with the CDN asset metadata.

---

## 3. Bulk Uploads & Multi-File Validation

Need to test multi-file upload zones? Use `POST /api/v1/uploads/bulk`:

```typescript
const formData = new FormData();
files.forEach((file) => formData.append('files', file));

const res = await fetch('https://playground.nileslabs.com/api/v1/uploads/bulk', {
  method: 'POST',
  body: formData,
});
const { items, total_files, total_size } = await res.json();
```

---

## 4. Live Interactive Upload Studio

Test drag-and-drop uploads, inspect CDN response URLs, and preview image thumbnails directly inside the docs:
👉 **[https://playground.nileslabs.com/docs/uploads](https://playground.nileslabs.com/docs/uploads)**

---

## Conclusion

Say goodbye to dummy file upload mocks. Test real `FormData` requests, simulated bandwidth, and CDN responses with Playground API today!
