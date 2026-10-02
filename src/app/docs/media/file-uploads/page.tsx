'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Icon } from '@iconify/react';
import config from '@/config/env';
import { InteractiveConsole } from '@/components/docs/InteractiveConsole';
import { CodeBlock } from '@/components/ui/CodeBlock';

interface UploadedFileRecord {
  id: string;
  filename: string;
  mimetype: string;
  sizeBytes: number;
  category: 'avatars' | 'documents' | 'products' | 'general';
  url: string;
  secure_url: string;
  public_id?: string;
  format?: string;
  dimensions?: { width: number; height: number } | null;
  description?: string | null;
  tags?: string[];
  created_at: string;
  simulated?: boolean;
}

const CATEGORIES = [
  { id: 'general', label: 'General Assets', icon: 'ph:folder-bold', color: 'text-indigo-600 bg-indigo-50 border-indigo-200' },
  { id: 'avatars', label: 'User Avatars', icon: 'ph:user-circle-bold', color: 'text-purple-600 bg-purple-50 border-purple-200' },
  { id: 'products', label: 'Catalog Products', icon: 'ph:shopping-bag-bold', color: 'text-emerald-600 bg-emerald-50 border-emerald-200' },
  { id: 'documents', label: 'PDF Documents', icon: 'ph:file-pdf-bold', color: 'text-rose-600 bg-rose-50 border-rose-200' },
];

const CODE_RECIPES = {
  fetchTs: `// Modern TypeScript Native Fetch with FormData
async function uploadAsset(file: File, category = 'general', tags: string[] = []) {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('category', category);
  formData.append('description', 'User uploaded asset from web app');
  formData.append('tags', tags.join(','));

  const response = await fetch('https://playground.nileslabs.com/api/v1/uploads', {
    method: 'POST',
    credentials: 'include', // Includes visitor sandbox session cookie
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(\`Upload failed (\${response.status}): \${errorData.error}\`);
  }

  const { file: uploadedRecord } = await response.json();
  console.log('Uploaded successfully:', uploadedRecord.secure_url);
  return uploadedRecord;
}`,

  axiosJs: `// Axios with Real-time Upload Progress Bar
import axios from 'axios';

async function uploadWithProgress(file, onProgress) {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('category', 'products');

  const { data } = await axios.post(
    'https://playground.nileslabs.com/api/v1/uploads',
    formData,
    {
      withCredentials: true,
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: (progressEvent) => {
        if (progressEvent.total) {
          const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(percent);
        }
      },
    }
  );

  return data.file;
}`,

  python: `# Python 3.10+ Requests Multipart Upload
import requests

url = "https://playground.nileslabs.com/api/v1/uploads"
files = {
    "file": ("invoice_2026.pdf", open("invoice_2026.pdf", "rb"), "application/pdf")
}
data = {
    "category": "documents",
    "description": "Quarterly cloud infrastructure invoice",
    "tags": "finance,billing,cloud"
}

response = requests.post(url, files=files, data=data)
if response.status_code == 201:
    result = response.json()
    print("Uploaded File CDN URL:", result["file"]["secure_url"])
    print("Dimensions:", result["file"].get("dimensions"))
else:
    print(f"Error {response.status_code}:", response.json())`,

  curl: `# Single File Upload with Category & Tags
curl -X POST "https://playground.nileslabs.com/api/v1/uploads" \\
  -F "file=@avatar.png;type=image/png" \\
  -F "category=avatars" \\
  -F "description=Engineering lead profile photo" \\
  -F "tags=team,engineering"

# Bulk Batch Upload (Up to 10 files)
curl -X POST "https://playground.nileslabs.com/api/v1/uploads/bulk" \\
  -F "files=@photo1.jpg" \\
  -F "files=@photo2.jpg" \\
  -F "files=@document.pdf" \\
  -F "category=general"`,
};

export default function FileUploadsPage() {
  const publicApiUrl = config.publicApiUrl || 'https://playground.nileslabs.com/api/v1';

  // State: Upload Mode
  const [activeTab, setActiveTab] = useState<'single' | 'bulk'>('single');
  const [category, setCategory] = useState<string>('general');
  const [description, setDescription] = useState<string>('Test asset uploaded from documentation sandbox');
  const [tagsInput, setTagsInput] = useState<string>('sandbox,media,test');

  // Single file state
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [singleUploading, setSingleUploading] = useState<boolean>(false);
  const [singleResult, setSingleResult] = useState<any>(null);

  // Bulk files state
  const [bulkFiles, setBulkFiles] = useState<File[]>([]);
  const [bulkUploading, setBulkUploading] = useState<boolean>(false);
  const [bulkResult, setBulkResult] = useState<any>(null);

  // Vault / Explorer state
  const [vaultFiles, setVaultFiles] = useState<UploadedFileRecord[]>([]);
  const [vaultLoading, setVaultLoading] = useState<boolean>(false);
  const [vaultFilter, setVaultFilter] = useState<string>('all');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);

  // Drag and drop state
  const [isDragOver, setIsDragOver] = useState<boolean>(false);
  const singleFileRef = useRef<HTMLInputElement>(null);
  const bulkFileRef = useRef<HTMLInputElement>(null);

  // Load active session files
  const loadVaultFiles = async () => {
    setVaultLoading(true);
    try {
      const res = await fetch(`${config.apiUrl}/uploads`, {
        credentials: 'include',
      });
      if (res.ok) {
        const data = await res.json();
        const list = Array.isArray(data) ? data : data.data || [];
        setVaultFiles(list);
      }
    } catch {
      // ignore
    } finally {
      setVaultLoading(false);
    }
  };

  useEffect(() => {
    loadVaultFiles();
  }, []);

  const handleSingleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      setSingleResult(null);
    }
  };

  const handleBulkFilesSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files).slice(0, 10);
      setBulkFiles((prev) => [...prev, ...filesArray].slice(0, 10));
      setBulkResult(null);
    }
  };

  const handleSingleUpload = async () => {
    if (!selectedFile) return;
    setSingleUploading(true);
    setSingleResult(null);

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('category', category);
      formData.append('description', description);
      formData.append('tags', tagsInput);

      const res = await fetch(`${config.apiUrl}/uploads`, {
        method: 'POST',
        credentials: 'include',
        body: formData,
      });

      const data = await res.json();
      setSingleResult({ status: res.status, ok: res.ok, data });
      if (res.ok) {
        loadVaultFiles();
      }
    } catch (err: any) {
      setSingleResult({ status: 500, ok: false, error: err.message });
    } finally {
      setSingleUploading(false);
    }
  };

  const handleBulkUpload = async () => {
    if (bulkFiles.length === 0) return;
    setBulkUploading(true);
    setBulkResult(null);

    try {
      const formData = new FormData();
      bulkFiles.forEach((file) => {
        formData.append('files', file);
      });
      formData.append('category', category);
      formData.append('description', description);

      const res = await fetch(`${config.apiUrl}/uploads/bulk`, {
        method: 'POST',
        credentials: 'include',
        body: formData,
      });

      const data = await res.json();
      setBulkResult({ status: res.status, ok: res.ok, data });
      if (res.ok) {
        loadVaultFiles();
        setBulkFiles([]);
      }
    } catch (err: any) {
      setBulkResult({ status: 500, ok: false, error: err.message });
    } finally {
      setBulkUploading(false);
    }
  };

  const handleDeleteFile = async (id: string) => {
    setDeletingId(id);
    try {
      const res = await fetch(`${config.apiUrl}/uploads/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (res.ok) {
        setVaultFiles((prev) => prev.filter((f) => f.id !== id));
      }
    } catch {
      // ignore
    } finally {
      setDeletingId(null);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedUrl(text);
    setTimeout(() => setCopiedUrl(null), 2000);
  };

  const filteredVault = vaultFiles.filter((f) => {
    if (vaultFilter === 'all') return true;
    return f.category === vaultFilter;
  });

  const formatFileSize = (bytes: number) => {
    if (!bytes || bytes === 0) return '0 B';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  return (
    <div className="space-y-12 w-full text-slate-900 pb-16">
      {/* 1. Hero Header */}
      <div id="overview" className="space-y-4 scroll-mt-20">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold uppercase tracking-wider border border-indigo-100">
          <Icon icon="ph:upload-simple-bold" className="w-3.5 h-3.5" />
          <span>Media & Binary Assets</span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-[1.15]">
          Multipart File Uploads & Cloud Storage
        </h1>

        <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-3xl">
          An enterprise-grade media ingestion pipeline supporting single and bulk <code className="font-mono text-xs bg-slate-100 px-1 py-0.5 rounded text-indigo-600">multipart/form-data</code> submissions, binary magic bytes integrity validation, Cloudinary CDN delivery with auto-generated metadata, and real-time SSE broadcasts.
        </p>

        {/* Feature Badges */}
        <div className="flex flex-wrap gap-2.5 pt-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-50 text-emerald-700 text-xs font-medium border border-emerald-200">
            <Icon icon="ph:shield-check-bold" className="w-4 h-4 text-emerald-600" />
            Magic Bytes Signature Verification
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-indigo-50 text-indigo-700 text-xs font-medium border border-indigo-200">
            <Icon icon="ph:cloud-check-bold" className="w-4 h-4 text-indigo-600" />
            Cloudinary CDN & Dimensions
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-amber-50 text-amber-700 text-xs font-medium border border-amber-200">
            <Icon icon="ph:broadcast-bold" className="w-4 h-4 text-amber-600" />
            Real-time SSE file.uploaded Event
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-purple-50 text-purple-700 text-xs font-medium border border-purple-200">
            <Icon icon="ph:stack-bold" className="w-4 h-4 text-purple-600" />
            5MB Single / 15 Session File Quota
          </span>
        </div>
      </div>

      {/* 2. Interactive Live Upload Studio */}
      <div id="live-studio" className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
              <Icon icon="ph:cloud-arrow-up-bold" className="w-5 h-5 text-indigo-600" />
              Interactive Upload Sandbox
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Select or drop real files to test the live upload pipeline against your isolated visitor sandbox.
            </p>
          </div>

          {/* Single vs Bulk Mode Switcher */}
          <div className="inline-flex p-1 bg-slate-100 rounded-xl self-start sm:self-auto border border-slate-200/80">
            <button
              type="button"
              onClick={() => setActiveTab('single')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                activeTab === 'single'
                  ? 'bg-white text-indigo-600 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Icon icon="ph:file-arrow-up-bold" className="w-3.5 h-3.5" />
              Single File Upload
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('bulk')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                activeTab === 'bulk'
                  ? 'bg-white text-indigo-600 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Icon icon="ph:files-bold" className="w-3.5 h-3.5" />
              Bulk Batch Upload
            </button>
          </div>
        </div>

        {/* Category & Metadata Selectors */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
              <Icon icon="ph:tag-bold" className="w-3.5 h-3.5 text-indigo-500" />
              Target Category:
            </label>
            <div className="grid grid-cols-2 gap-1.5">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setCategory(cat.id)}
                  className={`px-2.5 py-1.5 rounded-xl border text-xs font-medium text-left flex items-center gap-1.5 transition-all ${
                    category === cat.id
                      ? `${cat.color} font-bold ring-2 ring-indigo-500/20`
                      : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <Icon icon={cat.icon} className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">{cat.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
              <Icon icon="ph:text-align-left-bold" className="w-3.5 h-3.5 text-indigo-500" />
              Asset Description:
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Profile photo for user-42"
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
              <Icon icon="ph:hash-bold" className="w-3.5 h-3.5 text-indigo-500" />
              Tags (Comma separated):
            </label>
            <input
              type="text"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="e.g. profile, avatar, lead"
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
            />
          </div>
        </div>

        {/* Dropzone & Picker: Single Upload */}
        {activeTab === 'single' && (
          <div className="space-y-4">
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragOver(true);
              }}
              onDragLeave={() => setIsDragOver(false)}
              onDrop={(e) => {
                e.preventDefault();
                setIsDragOver(false);
                if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                  setSelectedFile(e.dataTransfer.files[0]);
                  setSingleResult(null);
                }
              }}
              onClick={() => singleFileRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
                isDragOver
                  ? 'border-indigo-500 bg-indigo-50/50 scale-[1.005]'
                  : selectedFile
                  ? 'border-emerald-300 bg-emerald-50/20'
                  : 'border-slate-200 hover:border-indigo-400 bg-slate-50/50 hover:bg-slate-50'
              }`}
            >
              <input
                ref={singleFileRef}
                type="file"
                onChange={handleSingleFileSelect}
                className="hidden"
              />

              <div className="max-w-md mx-auto space-y-3">
                <div className={`w-12 h-12 rounded-2xl mx-auto flex items-center justify-center ${selectedFile ? 'bg-emerald-100 text-emerald-600' : 'bg-indigo-50 text-indigo-600'}`}>
                  <Icon icon={selectedFile ? 'ph:check-circle-bold' : 'ph:cloud-arrow-up-bold'} className="w-6 h-6" />
                </div>

                {selectedFile ? (
                  <div>
                    <p className="text-sm font-bold text-slate-900">{selectedFile.name}</p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {formatFileSize(selectedFile.size)} • {selectedFile.type || 'Unknown MIME'}
                    </p>
                    <span className="inline-block mt-2 text-xs text-indigo-600 font-semibold underline">
                      Click to choose another file
                    </span>
                  </div>
                ) : (
                  <div>
                    <p className="text-sm font-bold text-slate-800">
                      Drag & drop an image, document, or PDF here
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      Or click to browse from your device. Max file size: 5 MB.
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500 flex items-center gap-1.5">
                <Icon icon="ph:info-bold" className="w-3.5 h-3.5 text-slate-400" />
                Executables (.exe, .sh) and scripts (.js, .php) are automatically blocked.
              </span>

              <button
                type="button"
                onClick={handleSingleUpload}
                disabled={!selectedFile || singleUploading}
                className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-xs transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {singleUploading ? (
                  <>
                    <Icon icon="ph:spinner-bold" className="w-4 h-4 animate-spin" />
                    <span>Processing & Uploading...</span>
                  </>
                ) : (
                  <>
                    <Icon icon="ph:cloud-arrow-up-bold" className="w-4 h-4" />
                    <span>Submit to POST /api/v1/uploads</span>
                  </>
                )}
              </button>
            </div>

            {/* Single Upload Response Display */}
            {singleResult && (
              <div className={`p-4 rounded-xl border text-xs font-mono space-y-2 ${singleResult.ok ? 'bg-slate-900 border-slate-800 text-emerald-400' : 'bg-rose-50 border-rose-200 text-rose-800'}`}>
                <div className="flex items-center justify-between pb-2 border-b border-slate-700/50">
                  <span className="font-bold flex items-center gap-1.5">
                    <Icon icon={singleResult.ok ? 'ph:check-circle-bold' : 'ph:warning-circle-bold'} className="w-4 h-4" />
                    HTTP Status: {singleResult.status} {singleResult.ok ? 'Created' : 'Error'}
                  </span>
                  {singleResult.data?.file?.secure_url && (
                    <a
                      href={singleResult.data.file.secure_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indigo-400 hover:underline flex items-center gap-1"
                    >
                      <Icon icon="ph:arrow-square-out-bold" className="w-3.5 h-3.5" />
                      Open CDN Asset
                    </a>
                  )}
                </div>
                <pre className="overflow-x-auto p-2 bg-black/40 rounded-lg text-[11px] leading-relaxed">
                  {JSON.stringify(singleResult.data, null, 2)}
                </pre>
              </div>
            )}
          </div>
        )}

        {/* Dropzone & Picker: Bulk Upload */}
        {activeTab === 'bulk' && (
          <div className="space-y-4">
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragOver(true);
              }}
              onDragLeave={() => setIsDragOver(false)}
              onDrop={(e) => {
                e.preventDefault();
                setIsDragOver(false);
                if (e.dataTransfer.files) {
                  const arr = Array.from(e.dataTransfer.files).slice(0, 10);
                  setBulkFiles((prev) => [...prev, ...arr].slice(0, 10));
                  setBulkResult(null);
                }
              }}
              onClick={() => bulkFileRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${
                isDragOver ? 'border-indigo-500 bg-indigo-50/50' : 'border-slate-200 hover:border-indigo-400 bg-slate-50/50'
              }`}
            >
              <input
                ref={bulkFileRef}
                type="file"
                multiple
                onChange={handleBulkFilesSelect}
                className="hidden"
              />

              <div className="max-w-md mx-auto space-y-2">
                <div className="w-10 h-10 rounded-xl mx-auto flex items-center justify-center bg-indigo-50 text-indigo-600">
                  <Icon icon="ph:files-bold" className="w-5 h-5" />
                </div>
                <p className="text-sm font-bold text-slate-800">
                  Drop up to 10 files for bulk batch processing
                </p>
                <p className="text-xs text-slate-500">
                  Field name: <code className="font-mono text-indigo-600">files</code>. Max 10 items per batch.
                </p>
              </div>
            </div>

            {/* Selected Bulk Files Preview List */}
            {bulkFiles.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-600">
                  <span className="font-bold">Queued Files ({bulkFiles.length} of 10 max):</span>
                  <button
                    type="button"
                    onClick={() => setBulkFiles([])}
                    className="text-rose-600 hover:underline"
                  >
                    Clear All
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {bulkFiles.map((file, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-2 truncate">
                        <Icon icon="ph:file-bold" className="w-4 h-4 text-indigo-500 shrink-0" />
                        <span className="font-medium text-slate-800 truncate">{file.name}</span>
                        <span className="text-slate-400 shrink-0">({formatFileSize(file.size)})</span>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setBulkFiles((prev) => prev.filter((_, i) => i !== idx));
                        }}
                        className="text-slate-400 hover:text-rose-600 p-1"
                      >
                        <Icon icon="ph:x-bold" className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-center justify-end">
              <button
                type="button"
                onClick={handleBulkUpload}
                disabled={bulkFiles.length === 0 || bulkUploading}
                className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-xs transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {bulkUploading ? (
                  <>
                    <Icon icon="ph:spinner-bold" className="w-4 h-4 animate-spin" />
                    <span>Uploading Batch ({bulkFiles.length} files)...</span>
                  </>
                ) : (
                  <>
                    <Icon icon="ph:stack-overflow-logo-bold" className="w-4 h-4" />
                    <span>Submit to POST /api/v1/uploads/bulk</span>
                  </>
                )}
              </button>
            </div>

            {/* Bulk Upload Response Display */}
            {bulkResult && (
              <div className={`p-4 rounded-xl border text-xs font-mono space-y-2 ${bulkResult.ok ? 'bg-slate-900 border-slate-800 text-emerald-400' : 'bg-rose-50 border-rose-200 text-rose-800'}`}>
                <div className="flex items-center justify-between pb-2 border-b border-slate-700/50">
                  <span className="font-bold flex items-center gap-1.5">
                    <Icon icon={bulkResult.ok ? 'ph:check-circle-bold' : 'ph:warning-circle-bold'} className="w-4 h-4" />
                    Batch Result: {bulkResult.data?.summary?.accepted || 0} Accepted, {bulkResult.data?.summary?.rejected || 0} Rejected
                  </span>
                </div>
                <pre className="overflow-x-auto p-2 bg-black/40 rounded-lg text-[11px] leading-relaxed">
                  {JSON.stringify(bulkResult.data, null, 2)}
                </pre>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 3. Active Session File Explorer (Live Vault) */}
      <div id="vault" className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
                <Icon icon="ph:vault-bold" className="w-5 h-5 text-indigo-600" />
                Session File Vault & CDN Explorer
              </h2>
              <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold">
                {vaultFiles.length} / 15 files
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Live items persisted in your visitor overlay sandbox. Queryable via <code className="font-mono text-xs">GET /api/v1/uploads</code>.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={loadVaultFiles}
              className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 text-xs font-medium flex items-center gap-1.5"
              title="Refresh vault"
            >
              <Icon icon="ph:arrows-clockwise-bold" className={`w-3.5 h-3.5 ${vaultLoading ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Refresh</span>
            </button>
          </div>
        </div>

        {/* Quota Progress Bar */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs text-slate-500">
            <span>Sandbox Session Quota</span>
            <span className="font-semibold text-slate-700">{vaultFiles.length} of 15 max active files</span>
          </div>
          <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
            <div
              className={`h-full transition-all duration-300 ${
                vaultFiles.length >= 13 ? 'bg-rose-500' : vaultFiles.length >= 8 ? 'bg-amber-500' : 'bg-indigo-600'
              }`}
              style={{ width: `${Math.min(100, (vaultFiles.length / 15) * 100)}%` }}
            />
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-2">
          {['all', 'avatars', 'documents', 'products', 'general'].map((filter) => (
            <button
              key={filter}
              type="button"
              onClick={() => setVaultFilter(filter)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium capitalize transition-all ${
                vaultFilter === filter
                  ? 'bg-slate-900 text-white font-bold shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* File Cards Gallery */}
        {filteredVault.length === 0 ? (
          <div className="p-12 text-center border border-dashed border-slate-200 rounded-2xl bg-slate-50/50 space-y-3">
            <Icon icon="ph:folder-open-bold" className="w-10 h-10 text-slate-300 mx-auto" />
            <p className="text-sm font-bold text-slate-700">No uploaded files in this category</p>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Use the live upload sandbox above to upload an image, document, or PDF to see it appear here instantly.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredVault.map((file) => {
              const isImage = file.mimetype?.startsWith('image/') || ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(file.format || '');
              return (
                <div
                  key={file.id}
                  className="rounded-2xl border border-slate-200 bg-white p-4 space-y-3 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    {/* Thumbnail / File Icon Preview */}
                    <div className="h-32 rounded-xl bg-slate-100 overflow-hidden flex items-center justify-center border border-slate-200/60 relative group">
                      {isImage ? (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img
                          src={file.secure_url || file.url}
                          alt={file.filename}
                          className="w-full h-full object-cover group-hover:scale-105 transition-all duration-300"
                        />
                      ) : (
                        <div className="text-center space-y-1">
                          <Icon icon="ph:file-pdf-bold" className="w-10 h-10 text-rose-500 mx-auto" />
                          <span className="text-[10px] font-mono text-slate-500 uppercase">{file.format || 'DOC'}</span>
                        </div>
                      )}

                      {/* Dimension Badge if available */}
                      {file.dimensions && (
                        <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-xs text-[10px] font-mono text-white">
                          {file.dimensions.width} × {file.dimensions.height}
                        </span>
                      )}

                      <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-white/90 backdrop-blur-xs text-[10px] font-semibold text-slate-700 capitalize shadow-xs border border-slate-200/50">
                        {file.category}
                      </span>
                    </div>

                    {/* Metadata Details */}
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 truncate" title={file.filename}>
                        {file.filename}
                      </h4>
                      <p className="text-[11px] text-slate-500 flex items-center gap-1.5 mt-0.5">
                        <span>{formatFileSize(file.sizeBytes)}</span>
                        <span>•</span>
                        <span className="font-mono text-[10px] truncate max-w-30">{file.mimetype}</span>
                      </p>
                    </div>

                    {file.description && (
                      <p className="text-xs text-slate-600 line-clamp-2 italic bg-slate-50 p-2 rounded-lg border border-slate-100">
                        &quot;{file.description}&quot;
                      </p>
                    )}
                  </div>

                  {/* Actions Bar */}
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => copyToClipboard(file.secure_url || file.url)}
                      className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium flex items-center gap-1 transition-all"
                    >
                      <Icon icon={copiedUrl === (file.secure_url || file.url) ? 'ph:check-bold' : 'ph:link-bold'} className="w-3.5 h-3.5" />
                      <span>{copiedUrl === (file.secure_url || file.url) ? 'Copied' : 'Copy CDN'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDeleteFile(file.id)}
                      disabled={deletingId === file.id}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-all disabled:opacity-50"
                      title="Delete asset"
                    >
                      <Icon icon={deletingId === file.id ? 'ph:spinner-bold' : 'ph:trash-bold'} className={`w-4 h-4 ${deletingId === file.id ? 'animate-spin' : ''}`} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 4. Interactive Request Consoles */}
      <div id="consoles" className="space-y-6 scroll-mt-20">
        <div className="space-y-1">
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
            Interactive Uploads API Consoles
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            Query, inspect, and delete media files directly against the running API endpoint:
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6">
          <InteractiveConsole
            method="GET"
            path="/uploads"
            title="List Session Uploaded Files"
            description="Fetches all active uploaded records in your isolated visitor sandbox with filtering."
          />

          <InteractiveConsole
            method="GET"
            path="/uploads?category=avatars"
            title="Filter Uploads by Category"
            description="Query uploaded files restricted to a specific category (avatars, documents, products, general)."
          />
        </div>
      </div>

      {/* 5. Security & Magic Bytes Verification Deep Dive */}
      <div id="security" className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-6">
        <div className="border-b border-slate-100 pb-4">
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
            <Icon icon="ph:shield-warning-bold" className="w-5 h-5 text-indigo-600" />
            Security Architecture & Magic Byte Inspection
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            How Playground API protects sandboxes from disguised malware, webshells, and arbitrary code execution.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
              <Icon icon="ph:binary-bold" className="w-4 h-4 text-emerald-600" />
              Binary Magic Byte Inspection
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Playground API does not rely solely on user-supplied <code className="font-mono text-indigo-600">Content-Type</code> headers or file extensions. Before saving, the backend inspects the binary buffer&apos;s leading bytes to verify authentic file signatures:
            </p>
            <div className="rounded-xl border border-slate-200 overflow-hidden text-xs">
              <table className="w-full text-left">
                <thead className="bg-slate-50 border-b border-slate-200 font-semibold text-slate-700">
                  <tr>
                    <th className="p-2.5">Type</th>
                    <th className="p-2.5">Magic Signature (Hex / ASCII)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-600 font-mono text-[11px]">
                  <tr>
                    <td className="p-2.5 font-bold text-indigo-600">JPEG / JPG</td>
                    <td className="p-2.5">FF D8 FF</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-bold text-indigo-600">PNG</td>
                    <td className="p-2.5">89 50 4E 47</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-bold text-indigo-600">GIF</td>
                    <td className="p-2.5">47 49 46 38</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-bold text-indigo-600">PDF</td>
                    <td className="p-2.5">25 50 44 46 (%PDF)</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-bold text-indigo-600">WebP</td>
                    <td className="p-2.5">RIFF .... WEBP</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
              <Icon icon="ph:prohibit-bold" className="w-4 h-4 text-rose-600" />
              Prohibited Executable Signatures
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Files containing executable headers (Windows PE <code className="font-mono text-rose-600">4D5A</code>, Linux ELF <code className="font-mono text-rose-600">7F454C46</code>, or macOS Mach-O <code className="font-mono text-rose-600">FEEDFACE</code>) disguised as images or documents are rejected immediately with <code className="font-mono text-xs text-rose-600 bg-rose-50 px-1 py-0.5 rounded">HTTP 415 PROHIBITED_FILE_TYPE</code>.
            </p>
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="text-xs font-bold text-slate-700">Blocked Script & Binary Extensions:</span>
              <p className="font-mono text-[11px] text-slate-600 leading-relaxed">
                exe, bat, cmd, sh, bash, php, phtml, js, mjs, ts, py, pyc, rb, pl, jsp, asp, aspx, vbs, dll, so, wasm, jar, html, htm, msi
              </p>
            </div>
          </div>
        </div>

        {/* Error Codes & Thresholds */}
        <div className="pt-4 border-t border-slate-100 space-y-3">
          <h3 className="text-sm font-bold text-slate-800">Validation Error Status Codes</h3>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div className="p-3 rounded-xl border border-slate-200 bg-slate-50 space-y-1">
              <span className="font-mono font-bold text-rose-600 text-xs">413 FILE_TOO_LARGE</span>
              <p className="text-[11px] text-slate-600">Triggered if single file payload exceeds 5 MB.</p>
            </div>
            <div className="p-3 rounded-xl border border-slate-200 bg-slate-50 space-y-1">
              <span className="font-mono font-bold text-rose-600 text-xs">415 PROHIBITED_TYPE</span>
              <p className="text-[11px] text-slate-600">Disguised executable or banned script extension.</p>
            </div>
            <div className="p-3 rounded-xl border border-slate-200 bg-slate-50 space-y-1">
              <span className="font-mono font-bold text-amber-600 text-xs">429 QUOTA_EXCEEDED</span>
              <p className="text-[11px] text-slate-600">Session sandbox limit reached (15 active files max).</p>
            </div>
            <div className="p-3 rounded-xl border border-slate-200 bg-slate-50 space-y-1">
              <span className="font-mono font-bold text-indigo-600 text-xs">400 TOO_MANY_FILES</span>
              <p className="text-[11px] text-slate-600">Bulk batch payload exceeded 10 items limit.</p>
            </div>
          </div>
        </div>
      </div>

      {/* 6. Production Code Recipes */}
      <div id="code-recipes" className="space-y-4 scroll-mt-20">
        <div className="space-y-1">
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
            Production Client Integration Recipes
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            Drop-in examples for browser FormData, Axios progress listeners, Python scripts, and cURL:
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-xs">
          <CodeBlock
            tabs={[
              { id: 'fetch', label: 'TypeScript / Fetch', code: CODE_RECIPES.fetchTs, language: 'typescript', icon: 'ph:code-bold' },
              { id: 'axios', label: 'Axios with Progress', code: CODE_RECIPES.axiosJs, language: 'javascript', icon: 'ph:lightning-bold' },
              { id: 'python', label: 'Python Requests', code: CODE_RECIPES.python, language: 'python', icon: 'ph:terminal-bold' },
              { id: 'curl', label: 'cURL Commands', code: CODE_RECIPES.curl, language: 'bash', icon: 'ph:command-bold' },
            ]}
            defaultTab="fetch"
          />
        </div>
      </div>

      {/* 7. Next Steps */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
        <Link
          href="/docs/media/svg-avatars"
          className="p-5 rounded-2xl border border-slate-200 bg-white hover:border-indigo-400 hover:shadow-xs transition-all group space-y-2"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">Next in Media</span>
            <Icon icon="ph:arrow-right-bold" className="w-4 h-4 text-indigo-600 group-hover:translate-x-1 transition-transform" />
          </div>
          <h3 className="text-base font-bold text-slate-900">Deterministic SVG Avatars</h3>
          <p className="text-xs text-slate-500">
            Generate crisp, zero-dependency vector avatars from user handles, names, or emails with 12 gradient palettes.
          </p>
        </Link>

        <Link
          href="/docs/media/image-thumbnails"
          className="p-5 rounded-2xl border border-slate-200 bg-white hover:border-indigo-400 hover:shadow-xs transition-all group space-y-2"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">Related</span>
            <Icon icon="ph:arrow-right-bold" className="w-4 h-4 text-indigo-600 group-hover:translate-x-1 transition-transform" />
          </div>
          <h3 className="text-base font-bold text-slate-900">Landscape Thumbnails & CDN Transforms</h3>
          <p className="text-xs text-slate-500">
            Create mesh-gradient placeholder thumbnails with custom text and aspect ratios.
          </p>
        </Link>
      </div>
    </div>
  );
}
