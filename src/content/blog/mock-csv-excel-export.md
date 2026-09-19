---
title: "How to Test CSV & Excel Export Buttons in React Without Writing Backend Exporters"
published: true
description: "Generate and test CSV, Excel (.xlsx), and JSON spreadsheet downloads with nested field flattening directly from Playground API endpoints."
tags: webdev, react, javascript, frontend
canonical_url: https://playground.nileslabs.com/docs/exports
series: Stop Waiting for the Backend
coverImage: "/images/blog/mock-csv-excel-export.jpg"
order: 26
author: "Nilesh Kumar"
authorRole: "Creator of Playground API"
date: "2026-09-20"
slug: "mock-csv-excel-export"
---

# How to Test CSV & Excel Export Buttons in React Without Writing Backend Exporters

Almost every dashboard or administrative table interface requires an **"Export to CSV"** or **"Download Excel Spreadsheet"** button.

However, during frontend development, testing spreadsheet download buttons is surprisingly tricky:
- You need realistic tabular data with headers.
- Nested JSON objects (e.g. `user.address.city` or `tags: ['react', 'api']`) need to be cleanly flattened into columns.
- Correct MIME headers (`text/csv`, `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`) and `Content-Disposition` attachment headers must be set so the browser triggers a native file download.

**[Playground API](https://playground.nileslabs.com)** now provides native **CSV and Excel (.xlsx) file exports** on all standard REST collections!

---

## 1. Export Endpoints

Simply append `.csv` or `.xlsx` to any collection route:

- `GET https://playground.nileslabs.com/posts.csv`
- `GET https://playground.nileslabs.com/posts.xlsx`
- `GET https://playground.nileslabs.com/users.csv`
- `GET https://playground.nileslabs.com/todos.xlsx`

You can also pass standard filtering, search, and sorting parameters:
```bash
curl "https://playground.nileslabs.com/posts.csv?_limit=25&_sort=id&_order=desc"
```

---

## 2. Implementing a React Export Button

Here is a clean React component that downloads the spreadsheet directly:

```tsx
export function ExportButton({ resource = 'posts', format = 'csv' }) {
  const [downloading, setDownloading] = useState(false);

  const handleDownload = async () => {
    setDownloading(true);
    try {
      const url = `https://playground.nileslabs.com/${resource}.${format}`;
      const response = await fetch(url);
      const blob = await response.blob();
      
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = `${resource}_export.${format}`;
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error('Export failed', err);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <button onClick={handleDownload} disabled={downloading}>
      {downloading ? 'Generating...' : `Export to ${format.toUpperCase()}`}
    </button>
  );
}
```

---

## 3. Nested Data Flattening

Playground API automatically transforms complex nested JSON structures into spreadsheet columns:
- `user.company.name` -> `company_name`
- `tags: ["tech", "api"]` -> `"tech, api"`

---

## 4. Live Interactive Export Studio

Test spreadsheet downloads and preview raw CSV outputs in the documentation:
👉 **[https://playground.nileslabs.com/docs/exports](https://playground.nileslabs.com/docs/exports)**

---

## Conclusion

Save hours of backend mocking. Test real spreadsheet export buttons in your React dashboards with Playground API!
