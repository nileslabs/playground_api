'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Icon } from '@iconify/react';
import Link from 'next/link';

interface UploadedFileItem {
  id: string;
  filename: string;
  mimetype: string;
  sizeBytes: number;
  category: string;
  url: string;
  secure_url: string;
  public_id: string;
  format?: string;
  dimensions?: { width: number; height: number } | null;
  description?: string | null;
  created_at: string;
}

interface UploadResultItem {
  filename: string;
  status: 'success' | 'rejected';
  file?: UploadedFileItem;
  code?: string;
  error?: string;
}

export function LiveUploadStudio() {
  const [activeTab, setActiveTab] = useState<'upload' | 'gallery' | 'security'>('upload');
  const [selectedCategory, setSelectedCategory] = useState<'avatars' | 'documents' | 'products' | 'general'>('general');
  const [galleryCategory, setGalleryCategory] = useState<string>('all');
  const [simulationDelay, setSimulationDelay] = useState<number>(0);
  const [simulateStatus, setSimulateStatus] = useState<number | null>(null);

  // Drag & Drop State
  const [isDragging, setIsDragging] = useState(false);
  const [queuedFiles, setQueuedFiles] = useState<File[]>([]);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Result state
  const [lastResults, setLastResults] = useState<{
    summary?: { total: number; successful: number; failed: number };
    results: UploadResultItem[];
  } | null>(null);
  const [galleryFiles, setGalleryFiles] = useState<UploadedFileItem[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [statusAlert, setStatusAlert] = useState<{ type: 'success' | 'error' | 'info'; message: string } | null>(null);

  const fetchGallery = useCallback(async () => {
    try {
      const url = galleryCategory === 'all'
        ? '/api/v1/uploads'
        : `/api/v1/uploads?category=${galleryCategory}`;
      const res = await fetch(url);
      if (res.ok) {
        const json = await res.json();
        setGalleryFiles(Array.isArray(json.data) ? json.data : []);
      }
    } catch {
      // ignore
    }
  }, [galleryCategory]);

  useEffect(() => {
    fetchGallery();
  }, [fetchGallery]);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleFileSelect = (files: FileList | null) => {
    if (!files) return;
    const array = Array.from(files);
    setQueuedFiles(prev => [...prev, ...array].slice(0, 10)); // Max 10 in batch
    setStatusAlert(null);
  };

  const removeQueuedFile = (index: number) => {
    setQueuedFiles(prev => prev.filter((_, i) => i !== index));
  };

  // Perform multi-file upload with XMLHttpRequest for live byte-level progress reporting
  const handleUploadSubmit = async () => {
    if (queuedFiles.length === 0) return;
    setIsUploading(true);
    setUploadProgress(0);
    setStatusAlert(null);
    setLastResults(null);

    const formData = new FormData();
    if (queuedFiles.length === 1) {
      formData.append('file', queuedFiles[0]);
    } else {
      queuedFiles.forEach(f => formData.append('files', f));
    }
    formData.append('category', selectedCategory);

    const isSingle = queuedFiles.length === 1;
    const endpoint = isSingle ? '/api/v1/uploads' : '/api/v1/uploads/bulk';

    try {
      const xhr = new XMLHttpRequest();
      xhr.open('POST', endpoint);

      // Add simulation headers if configured
      if (simulationDelay > 0) {
        xhr.setRequestHeader('X-Simulate-Delay', String(simulationDelay));
      }
      if (simulateStatus) {
        xhr.setRequestHeader('X-Simulate-Status', String(simulateStatus));
      }

      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const percent = Math.round((event.loaded / event.total) * 100);
          setUploadProgress(percent);
        }
      };

      xhr.onload = () => {
        setIsUploading(false);
        setUploadProgress(100);

        try {
          const response = JSON.parse(xhr.responseText);

          if (isSingle) {
            if (xhr.status === 201 && response.file) {
              setLastResults({
                summary: { total: 1, successful: 1, failed: 0 },
                results: [
                  { filename: queuedFiles[0].name, status: 'success', file: response.file }
                ]
              });
              setStatusAlert({
                type: 'success',
                message: `Successfully uploaded ${queuedFiles[0].name} to Cloudinary CDN!`
              });
              setQueuedFiles([]);
              fetchGallery();
            } else {
              setLastResults({
                summary: { total: 1, successful: 0, failed: 1 },
                results: [
                  {
                    filename: queuedFiles[0].name,
                    status: 'rejected',
                    code: response.code || 'UPLOAD_FAILED',
                    error: response.error || 'Upload was rejected.'
                  }
                ]
              });
              setStatusAlert({
                type: 'error',
                message: response.error || 'Upload failed.'
              });
            }
          } else {
            // Bulk upload response
            if (response.results) {
              setLastResults(response);
              const { successful, failed } = response.summary || { successful: 0, failed: 0 };
              if (failed === 0) {
                setStatusAlert({
                  type: 'success',
                  message: `All ${successful} files uploaded successfully!`
                });
              } else if (successful > 0) {
                setStatusAlert({
                  type: 'info',
                  message: `Batch processed: ${successful} saved, ${failed} rejected (see breakdown below).`
                });
              } else {
                setStatusAlert({
                  type: 'error',
                  message: `All ${failed} files in batch were rejected.`
                });
              }
              setQueuedFiles([]);
              fetchGallery();
            } else {
              setStatusAlert({
                type: 'error',
                message: response.error || 'Bulk upload failed.'
              });
            }
          }
        } catch (err: any) {
          setStatusAlert({ type: 'error', message: `Response error: ${err.message}` });
        }
      };

      xhr.onerror = () => {
        setIsUploading(false);
        setStatusAlert({ type: 'error', message: 'Network connection error during upload.' });
      };

      xhr.send(formData);
    } catch (err: any) {
      setIsUploading(false);
      setStatusAlert({ type: 'error', message: err.message });
    }
  };

  const handleDeleteFile = async (id: string) => {
    try {
      const res = await fetch(`/api/v1/uploads/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setStatusAlert({ type: 'success', message: 'File deleted from sandbox and Cloudinary.' });
        fetchGallery();
      }
    } catch {
      // ignore
    }
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-6">
      {/* Top Banner Navigation Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-1.5 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl">
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            onClick={() => setActiveTab('upload')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'upload'
                ? 'bg-white dark:bg-zinc-800 text-brand-600 dark:text-brand-400 shadow-sm border border-zinc-200/80 dark:border-zinc-700/80'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
            }`}
          >
            <Icon icon="lucide:cloud-upload" className="w-4 h-4" />
            File Uploader & Dropzone
          </button>
          <button
            onClick={() => {
              setActiveTab('gallery');
              fetchGallery();
            }}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'gallery'
                ? 'bg-white dark:bg-zinc-800 text-brand-600 dark:text-brand-400 shadow-sm border border-zinc-200/80 dark:border-zinc-700/80'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
            }`}
          >
            <Icon icon="lucide:image" className="w-4 h-4" />
            Sandbox Files Gallery
            {galleryFiles.length > 0 && (
              <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-brand-500/10 text-brand-600 dark:text-brand-400 font-bold">
                {galleryFiles.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('security')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'security'
                ? 'bg-white dark:bg-zinc-800 text-brand-600 dark:text-brand-400 shadow-sm border border-zinc-200/80 dark:border-zinc-700/80'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
            }`}
          >
            <Icon icon="lucide:shield-check" className="w-4 h-4" />
            Security Rules & Limits
          </button>
        </div>

        <div className="flex items-center gap-3 pr-2 text-xs text-zinc-500">
          <span className="flex items-center gap-1 font-mono text-[11px]">
            <Icon icon="lucide:hard-drive" className="w-3.5 h-3.5" />
            Max 5MB / File • 15 Files Quota
          </span>
        </div>
      </div>

      {/* Status Alert Banner */}
      {statusAlert && (
        <div
          className={`flex items-start gap-3 p-4 rounded-xl border text-xs font-medium transition-all ${
            statusAlert.type === 'success'
              ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-500/30 text-emerald-800 dark:text-emerald-300'
              : statusAlert.type === 'error'
              ? 'bg-rose-50 dark:bg-rose-950/30 border-rose-500/30 text-rose-800 dark:text-rose-300'
              : 'bg-blue-50 dark:bg-blue-950/30 border-blue-500/30 text-blue-800 dark:text-blue-300'
          }`}
        >
          {statusAlert.type === 'success' && <Icon icon="lucide:check-circle-2" className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />}
          {statusAlert.type === 'error' && <Icon icon="lucide:x-circle" className="w-4 h-4 text-rose-600 mt-0.5 shrink-0" />}
          {statusAlert.type === 'info' && <Icon icon="lucide:info" className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />}
          <div className="flex-1">{statusAlert.message}</div>
          <button
            onClick={() => setStatusAlert(null)}
            className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
          >
            ✕
          </button>
        </div>
      )}

      {/* TAB 1: UPLOAD DROPZONE */}
      {activeTab === 'upload' && (
        <div className="space-y-6">
          {/* Controls Bar: Category & Throttle Simulation */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl">
            <div>
              <label className="block text-[11px] font-semibold text-zinc-600 dark:text-zinc-400 mb-1.5">
                Target Category (Folder Partitioning)
              </label>
              <div className="flex flex-wrap gap-1.5">
                {(['general', 'avatars', 'documents', 'products'] as const).map(cat => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold capitalize transition-all ${
                      selectedCategory === cat
                        ? 'bg-brand-600 text-white shadow-sm'
                        : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-zinc-600 dark:text-zinc-400 mb-1.5">
                Upload Latency Simulation (`X-Simulate-Delay`)
              </label>
              <select
                value={simulationDelay}
                onChange={e => setSimulationDelay(parseInt(e.target.value, 10))}
                className="w-full px-3 py-1.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-xs font-medium focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                <option value={0}>Fast 4G / Local (0ms)</option>
                <option value={1000}>1000ms (1s Network Delay)</option>
                <option value={2000}>2000ms (Slow 3G Simulation)</option>
                <option value={4000}>4000ms (Heavy Network Throttle)</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-zinc-600 dark:text-zinc-400 mb-1.5">
                Error Simulation (`X-Simulate-Status`)
              </label>
              <select
                value={simulateStatus || ''}
                onChange={e => setSimulateStatus(e.target.value ? parseInt(e.target.value, 10) : null)}
                className="w-full px-3 py-1.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-xs font-medium focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                <option value="">None (Standard 201/200 OK)</option>
                <option value={413}>413 (Payload Too Large Error)</option>
                <option value={415}>415 (Unsupported Media Type Error)</option>
                <option value={500}>500 (Server Cloud Error)</option>
              </select>
            </div>
          </div>

          {/* Drag and Drop Zone */}
          <div
            onDragOver={e => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={e => {
              e.preventDefault();
              setIsDragging(false);
              handleFileSelect(e.dataTransfer.files);
            }}
            onClick={() => fileInputRef.current?.click()}
            className={`p-8 border-2 border-dashed rounded-2xl cursor-pointer transition-all flex flex-col items-center justify-center text-center space-y-3 ${
              isDragging
                ? 'border-brand-500 bg-brand-500/10'
                : 'border-zinc-300 dark:border-zinc-700 hover:border-brand-500 dark:hover:border-brand-500 bg-zinc-50/50 dark:bg-zinc-900/30'
            }`}
          >
            <input
              type="file"
              ref={fileInputRef}
              multiple
              className="hidden"
              onChange={e => handleFileSelect(e.target.files)}
            />
            <div className="w-12 h-12 rounded-2xl bg-brand-500/10 text-brand-600 dark:text-brand-400 flex items-center justify-center">
              <Icon icon="lucide:upload-cloud" className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                Click to browse or drag & drop files here
              </p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-sm">
                Supports single or multi-file uploads (Images, PDFs, CSV, JSON, TXT). Single file limit: 5 MB.
              </p>
            </div>
          </div>

          {/* Queued Files Preview List */}
          {queuedFiles.length > 0 && (
            <div className="p-5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl space-y-4 shadow-sm">
              <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-3">
                <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                  <Icon icon="lucide:files" className="w-4 h-4 text-brand-500" />
                  Files Queued for Upload ({queuedFiles.length})
                </span>
                <button
                  type="button"
                  onClick={() => setQueuedFiles([])}
                  className="text-[11px] text-zinc-400 hover:text-rose-500 transition-colors"
                >
                  Clear All
                </button>
              </div>

              <div className="divide-y divide-zinc-100 dark:divide-zinc-800 max-h-56 overflow-y-auto">
                {queuedFiles.map((f, idx) => (
                  <div key={idx} className="py-2.5 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2.5 truncate max-w-md">
                      <Icon
                        icon={f.type.startsWith('image/') ? 'lucide:image' : 'lucide:file-text'}
                        className="w-4 h-4 text-zinc-400 shrink-0"
                      />
                      <span className="font-medium text-zinc-800 dark:text-zinc-200 truncate">{f.name}</span>
                      <span className="text-[11px] font-mono text-zinc-400 shrink-0">({formatBytes(f.size)})</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeQueuedFile(idx)}
                      className="text-zinc-400 hover:text-rose-500 p-1"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>

              {/* Progress Bar */}
              {isUploading && (
                <div className="space-y-1.5 pt-2">
                  <div className="flex justify-between text-[11px] font-medium text-zinc-600 dark:text-zinc-400">
                    <span>Uploading & streaming to Cloudinary CDN...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="w-full h-2 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-brand-600 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Upload Dispatch Button */}
              <button
                type="button"
                onClick={handleUploadSubmit}
                disabled={isUploading}
                className="w-full py-2.5 px-4 bg-brand-600 hover:bg-brand-500 text-white rounded-xl text-xs font-semibold shadow-md shadow-brand-500/20 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
              >
                {isUploading ? (
                  <>
                    <Icon icon="lucide:refresh-cw" className="w-4 h-4 animate-spin" />
                    Processing Upload...
                  </>
                ) : (
                  <>
                    <Icon icon="lucide:cloud-upload" className="w-4 h-4" />
                    Upload {queuedFiles.length} {queuedFiles.length === 1 ? 'File' : 'Files'} (`POST {queuedFiles.length === 1 ? '/uploads' : '/uploads/bulk'}`)
                  </>
                )}
              </button>
            </div>
          )}

          {/* Itemized Upload Results Breakdown */}
          {lastResults && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                  <Icon icon="lucide:list-checks" className="w-4 h-4 text-emerald-500" />
                  Itemized Upload Results Breakdown
                </h3>
                {lastResults.summary && (
                  <div className="flex items-center gap-2 text-xs font-semibold">
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                      {lastResults.summary.successful} Succeeded
                    </span>
                    {lastResults.summary.failed > 0 && (
                      <span className="px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
                        {lastResults.summary.failed} Rejected
                      </span>
                    )}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {lastResults.results.map((item, idx) => (
                  <div
                    key={idx}
                    className={`p-4 rounded-xl border space-y-2.5 transition-all ${
                      item.status === 'success'
                        ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-500/30'
                        : 'bg-rose-50/50 dark:bg-rose-950/20 border-rose-500/30'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2 truncate">
                        <Icon
                          icon={item.status === 'success' ? 'lucide:check-circle-2' : 'lucide:alert-octagon'}
                          className={`w-4 h-4 shrink-0 ${
                            item.status === 'success' ? 'text-emerald-600' : 'text-rose-600'
                          }`}
                        />
                        <span className="font-semibold text-xs text-zinc-900 dark:text-zinc-100 truncate">
                          {item.filename}
                        </span>
                      </div>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold shrink-0 ${
                          item.status === 'success'
                            ? 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300'
                            : 'bg-rose-500/20 text-rose-700 dark:text-rose-300'
                        }`}
                      >
                        {item.status === 'success' ? 'SAVED (201)' : item.code || 'REJECTED'}
                      </span>
                    </div>

                    {item.status === 'success' && item.file && (
                      <div className="space-y-2 text-xs">
                        <div className="flex items-center justify-between text-zinc-500">
                          <span>Size: {formatBytes(item.file.sizeBytes)}</span>
                          <span>Category: <code className="font-mono">{item.file.category}</code></span>
                        </div>
                        {item.file.mimetype.startsWith('image/') && (
                          <div className="relative w-full h-28 rounded-lg overflow-hidden bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 flex items-center justify-center">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={item.file.secure_url}
                              alt={item.file.filename}
                              className="max-h-full max-w-full object-contain"
                            />
                          </div>
                        )}
                        <div className="flex items-center gap-2 pt-1">
                          <input
                            type="text"
                            readOnly
                            value={item.file.secure_url}
                            className="w-full px-2.5 py-1 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded font-mono text-[10px] truncate"
                          />
                          <button
                            type="button"
                            onClick={() => handleCopy(item.file!.secure_url, item.file!.id)}
                            className="p-1.5 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 rounded text-zinc-600 dark:text-zinc-300"
                            title="Copy Cloudinary CDN URL"
                          >
                            {copiedId === item.file.id ? (
                              <Icon icon="lucide:check" className="w-3.5 h-3.5 text-emerald-500" />
                            ) : (
                              <Icon icon="lucide:copy" className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                      </div>
                    )}

                    {item.status === 'rejected' && (
                      <div className="text-xs text-rose-700 dark:text-rose-300 space-y-1">
                        <p>{item.error}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: SANDBOX GALLERY */}
      {activeTab === 'gallery' && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-1.5">
              {['all', 'avatars', 'documents', 'products', 'general'].map(cat => (
                <button
                  key={cat}
                  onClick={() => setGalleryCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
                    galleryCategory === cat
                      ? 'bg-brand-600 text-white shadow-sm'
                      : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <button
              onClick={fetchGallery}
              className="flex items-center gap-1 text-xs text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200"
            >
              <Icon icon="lucide:refresh-cw" className="w-3.5 h-3.5" />
              Refresh
            </button>
          </div>

          {galleryFiles.length === 0 ? (
            <div className="p-8 border border-zinc-200 dark:border-zinc-800 rounded-2xl text-center text-zinc-400 text-xs space-y-2">
              <Icon icon="lucide:image" className="w-8 h-8 mx-auto text-zinc-300 dark:text-zinc-700" />
              <p>No files uploaded in sandbox yet under category &quot;{galleryCategory}&quot;.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {galleryFiles.map(file => (
                <div
                  key={file.id}
                  className="p-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl space-y-3 shadow-sm flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400 bg-brand-500/10 px-2 py-0.5 rounded">
                        {file.category}
                      </span>
                      <span className="text-[10px] text-zinc-400 font-mono">
                        {formatBytes(file.sizeBytes)}
                      </span>
                    </div>

                    {file.mimetype.startsWith('image/') ? (
                      <div className="relative w-full h-36 rounded-xl overflow-hidden bg-zinc-900/40 border border-zinc-100 dark:border-zinc-800 flex items-center justify-center group">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={file.secure_url}
                          alt={file.filename}
                          className="max-h-full max-w-full object-contain transition-transform group-hover:scale-105"
                        />
                      </div>
                    ) : (
                      <div className="w-full h-36 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-100 dark:border-zinc-800 flex flex-col items-center justify-center text-zinc-400 space-y-2">
                        <Icon icon="lucide:file-text" className="w-10 h-10 text-brand-500" />
                        <span className="text-[11px] font-mono uppercase">{file.format || 'DOC'}</span>
                      </div>
                    )}

                    <div>
                      <div className="font-semibold text-xs text-zinc-900 dark:text-zinc-100 truncate">
                        {file.filename}
                      </div>
                      <div className="font-mono text-[10px] text-zinc-400 truncate">
                        ID: {file.id}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-zinc-100 dark:border-zinc-800">
                    <button
                      type="button"
                      onClick={() => handleCopy(file.secure_url, file.id)}
                      className="text-xs text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1 font-medium"
                    >
                      {copiedId === file.id ? <Icon icon="lucide:check" className="w-3.5 h-3.5 text-emerald-500" /> : <Icon icon="lucide:copy" className="w-3.5 h-3.5" />}
                      Copy CDN URL
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteFile(file.id)}
                      className="text-xs text-rose-500 hover:text-rose-700 flex items-center gap-1 font-medium"
                    >
                      <Icon icon="lucide:trash-2" className="w-3.5 h-3.5" />
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: SECURITY & RULES */}
      {activeTab === 'security' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl space-y-3">
              <div className="flex items-center gap-2">
                <Icon icon="lucide:shield-alert" className="w-5 h-5 text-rose-500" />
                <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                  Strict Prohibited File Types
                </h4>
              </div>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                To prevent remote code execution and data extraction, all executable and script formats are banned and blocked at the magic byte layer:
              </p>
              <div className="flex flex-wrap gap-1.5 font-mono text-[11px]">
                {['.exe', '.sh', '.bat', '.cmd', '.php', '.js', '.ts', '.py', '.rb', '.jsp', '.asp', '.dll', '.so', '.wasm'].map(ext => (
                  <span key={ext} className="px-2 py-0.5 rounded bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
                    {ext}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl space-y-3">
              <div className="flex items-center gap-2">
                <Icon icon="lucide:check-circle-2" className="w-5 h-5 text-emerald-500" />
                <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                  Allowed Safe Formats & Limits
                </h4>
              </div>
              <div className="space-y-2 text-xs text-zinc-600 dark:text-zinc-400">
                <div className="flex justify-between">
                  <span>Single File Limit:</span>
                  <span className="font-bold text-zinc-900 dark:text-zinc-100 font-mono">5 MB max</span>
                </div>
                <div className="flex justify-between">
                  <span>Bulk Batch Limit:</span>
                  <span className="font-bold text-zinc-900 dark:text-zinc-100 font-mono">25 MB / 10 files</span>
                </div>
                <div className="flex justify-between">
                  <span>Sandbox Identity Quota:</span>
                  <span className="font-bold text-zinc-900 dark:text-zinc-100 font-mono">15 active files max</span>
                </div>
                <div className="flex justify-between">
                  <span>Cloudinary Partitioning:</span>
                  <span className="font-mono text-[11px]">playground_api/uploads/&lt;cat&gt;/&lt;id&gt;</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
