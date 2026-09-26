'use client';

import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import config from '@/config/env';

export default function FileUploadsPage() {
  const publicApiUrl = config.publicApiUrl || 'https://playground.nileslabs.com/api/v1';
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<any>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setUploading(true);
    setUploadResult(null);

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);

      const res = await fetch(`${config.apiUrl}/uploads`, {
        method: 'POST',
        credentials: 'include',
        body: formData,
      });

      const data = await res.json();
      setUploadResult(data);
    } catch (err: any) {
      setUploadResult({ error: err.message });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-12 w-full text-slate-900">
      {/* 1. Header */}
      <div id="overview" className="space-y-4 scroll-mt-20">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold uppercase tracking-wider border border-indigo-100">
          <Icon icon="ph:upload-simple-bold" className="w-3.5 h-3.5" />
          <span>Media & File Uploads</span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-[1.15]">
          Multipart Form-Data File Uploads
        </h1>

        <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-3xl">
          Test profile picture uploads, document attachments, and media file pipelines. Accepts <code className="font-mono text-xs bg-slate-100 px-1 py-0.5 rounded text-indigo-600">multipart/form-data</code> payloads and returns CDN URLs with image dimension metadata.
        </p>
      </div>

      {/* 2. Interactive File Upload Tester */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-6">
        <div className="border-b border-slate-100 pb-4">
          <h3 className="font-bold text-base text-slate-900">Live File Upload Runner</h3>
          <p className="text-xs text-slate-500">
            Pick any image, PDF, or text file from your computer and upload it to <code className="font-mono text-xs">POST /uploads</code>:
          </p>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <input
            type="file"
            onChange={handleFileChange}
            className="text-xs text-slate-600 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 cursor-pointer"
          />

          <button
            type="button"
            onClick={handleUpload}
            disabled={!selectedFile || uploading}
            className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-xs transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {uploading ? (
              <>
                <Icon icon="ph:spinner-bold" className="w-3.5 h-3.5 animate-spin" />
                <span>Uploading...</span>
              </>
            ) : (
              <>
                <Icon icon="ph:cloud-arrow-up-bold" className="w-3.5 h-3.5" />
                <span>Upload to Server</span>
              </>
            )}
          </button>
        </div>

        {uploadResult && (
          <div className="rounded-xl border border-slate-200 bg-slate-900 p-4 font-mono text-xs text-emerald-400 overflow-x-auto shadow-inner">
            <pre>{JSON.stringify(uploadResult, null, 2)}</pre>
          </div>
        )}
      </div>

      {/* 3. Upload Specifications */}
      <div id="specs" className="space-y-4 scroll-mt-20">
        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
          Upload Payload Specifications
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="p-5 rounded-2xl border border-slate-200 bg-white shadow-xs space-y-2">
            <h3 className="font-bold text-sm text-slate-900">Field Name: file or media</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Accepts multipart form fields named either <code className="font-mono text-indigo-600">file</code> or <code className="font-mono text-indigo-600">media</code>. Maximum upload limit is 15MB.
            </p>
          </div>

          <div className="p-5 rounded-2xl border border-slate-200 bg-white shadow-xs space-y-2">
            <h3 className="font-bold text-sm text-slate-900">Returned Metadata</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Successful uploads return file name, MIME type, size in bytes, public CDN URL, and auto-generated thumbnail URLs.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
