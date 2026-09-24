'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Icon } from '@iconify/react';

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
    <div className="space-y-6 text-text-primary">
      {/* Top Banner Navigation Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-1.5 bg-bg-terminal border border-border-default rounded-xl">
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            type="button"
            onClick={() => setActiveTab('upload')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'upload'
                ? 'bg-bg-surface text-brand-primary shadow-xs border border-border-default font-bold'
                : 'text-text-muted hover:text-text-primary'
            }`}
          >
            <Icon icon="lucide:cloud-upload" className="w-4 h-4" />
            File Uploader & Dropzone
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab('gallery');
              fetchGallery();
            }}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'gallery'
                ? 'bg-bg-surface text-brand-primary shadow-xs border border-border-default font-bold'
                : 'text-text-muted hover:text-text-primary'
            }`}
          >
            <Icon icon="lucide:image" className="w-4 h-4" />
            Sandbox Files Gallery
            {galleryFiles.length > 0 && (
              <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-brand-primary/10 text-brand-primary font-bold border border-brand-primary/20">
                {galleryFiles.length}
              </span>
            )}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('security')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'security'
                ? 'bg-bg-surface text-brand-primary shadow-xs border border-border-default font-bold'
                : 'text-text-muted hover:text-text-primary'
            }`}
          >
            <Icon icon="lucide:shield-check" className="w-4 h-4" />
            Security Rules & Limits
          </button>
        </div>

        <div className="flex items-center gap-3 pr-2 text-xs text-text-muted">
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
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
              : statusAlert.type === 'error'
              ? 'bg-rose-500/10 border-rose-500/30 text-rose-300'
              : 'bg-brand-primary/10 border-brand-primary/30 text-brand-primary'
          }`}
        >
          {statusAlert.type === 'success' && <Icon icon="lucide:check-circle-2" className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />}
          {statusAlert.type === 'error' && <Icon icon="lucide:x-circle" className="w-4 h-4 text-rose-400 mt-0.5 shrink-0" />}
          {statusAlert.type === 'info' && <Icon icon="lucide:info" className="w-4 h-4 text-brand-primary mt-0.5 shrink-0" />}
          <div className="flex-1">{statusAlert.message}</div>
          <button
            type="button"
            onClick={() => setStatusAlert(null)}
            className="text-text-muted hover:text-text-primary cursor-pointer text-xs"
          >
            ✕
          </button>
        </div>
      )}

      {/* TAB 1: UPLOAD DROPZONE */}
      {activeTab === 'upload' && (
        <div className="space-y-6">
          {/* Controls Bar: Category & Throttle Simulation */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-bg-surface border border-border-default rounded-2xl">
            <div>
              <label className="block text-[11px] font-semibold text-text-secondary mb-1.5">
                Target Category (Folder Partitioning)
              </label>
              <div className="flex flex-wrap gap-1.5">
                {(['general', 'avatars', 'documents', 'products'] as const).map(cat => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold capitalize transition-all cursor-pointer ${
                      selectedCategory === cat
                        ? 'bg-brand-primary text-white shadow-xs font-bold'
                        : 'bg-bg-terminal border border-border-default text-text-secondary hover:text-text-primary'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-text-secondary mb-1.5">
                Upload Latency Simulation (`X-Simulate-Delay`)
              </label>
              <select
                value={simulationDelay}
                onChange={e => setSimulationDelay(parseInt(e.target.value, 10))}
                className="w-full px-3 py-1.5 bg-bg-terminal border border-border-default rounded-lg text-xs font-medium text-text-primary focus:outline-none focus:border-brand-primary cursor-pointer"
              >
                <option value={0}>Fast 4G / Local (0ms)</option>
                <option value={1000}>1000ms (1s Network Delay)</option>
                <option value={2000}>2000ms (Slow 3G Simulation)</option>
                <option value={4000}>4000ms (Heavy Network Throttle)</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-text-secondary mb-1.5">
                Error Simulation (`X-Simulate-Status`)
              </label>
              <select
                value={simulateStatus || ''}
                onChange={e => setSimulateStatus(e.target.value ? parseInt(e.target.value, 10) : null)}
                className="w-full px-3 py-1.5 bg-bg-terminal border border-border-default rounded-lg text-xs font-medium text-text-primary focus:outline-none focus:border-brand-primary cursor-pointer"
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
                ? 'border-brand-primary bg-brand-primary/10'
                : 'border-border-default hover:border-brand-primary bg-bg-surface/50'
            }`}
          >
            <input
              type="file"
              ref={fileInputRef}
              multiple
              className="hidden"
              onChange={e => handleFileSelect(e.target.files)}
            />
            <div className="w-12 h-12 rounded-2xl bg-brand-primary/10 text-brand-primary flex items-center justify-center border border-brand-primary/20">
              <Icon icon="lucide:upload-cloud" className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-bold text-text-primary">
                Click to browse or drag &amp; drop files here
              </p>
              <p className="text-xs text-text-secondary max-w-sm">
                Supports single or multi-file uploads (Images, PDFs, CSV, JSON, TXT). Single file limit: 5 MB.
              </p>
            </div>
          </div>

          {/* Queued Files Preview List */}
          {queuedFiles.length > 0 && (
            <div className="p-5 bg-bg-surface border border-border-default rounded-2xl space-y-4 shadow-sm">
              <div className="flex items-center justify-between border-b border-border-default pb-3">
                <span className="text-xs font-bold text-text-primary flex items-center gap-2">
                  <Icon icon="lucide:files" className="w-4 h-4 text-brand-primary" />
                  <span>Files Queued for Upload ({queuedFiles.length})</span>
                </span>
                <button
                  type="button"
                  onClick={() => setQueuedFiles([])}
                  className="text-[11px] text-text-muted hover:text-rose-400 transition-colors cursor-pointer"
                >
                  Clear All
                </button>
              </div>

              <div className="divide-y divide-border-subtle max-h-56 overflow-y-auto">
                {queuedFiles.map((f, idx) => (
                  <div key={idx} className="py-2.5 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2.5 truncate max-w-md">
                      <Icon
                        icon={f.type.startsWith('image/') ? 'lucide:image' : 'lucide:file-text'}
                        className="w-4 h-4 text-text-muted shrink-0"
                      />
                      <span className="font-medium text-text-primary truncate">{f.name}</span>
                      <span className="text-[11px] font-mono text-text-muted shrink-0">({formatBytes(f.size)})</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeQueuedFile(idx)}
                      className="text-text-muted hover:text-rose-400 p-1 cursor-pointer"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>

              {/* Progress Bar */}
              {isUploading && (
                <div className="space-y-1.5 pt-2">
                  <div className="flex justify-between text-[11px] font-medium text-text-secondary">
                    <span>Uploading &amp; streaming to Cloudinary CDN...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="w-full h-2 bg-bg-terminal rounded-full overflow-hidden border border-border-default">
                    <div
                      className="h-full bg-brand-primary rounded-full transition-all duration-300"
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
                className="w-full py-2.5 px-4 bg-brand-primary hover:bg-brand-primary/90 text-white rounded-xl text-xs font-semibold shadow-md shadow-brand-primary/20 flex items-center justify-center gap-2 transition-all disabled:opacity-50 cursor-pointer"
              >
                {isUploading ? (
                  <>
                    <Icon icon="lucide:refresh-cw" className="w-4 h-4 animate-spin" />
                    <span>Processing Upload...</span>
                  </>
                ) : (
                  <>
                    <Icon icon="lucide:cloud-upload" className="w-4 h-4" />
                    <span>Upload {queuedFiles.length} {queuedFiles.length === 1 ? 'File' : 'Files'} (`POST {queuedFiles.length === 1 ? '/uploads' : '/uploads/bulk'}`)</span>
                  </>
                )}
              </button>
            </div>
          )}

          {/* Itemized Upload Results Breakdown */}
          {lastResults && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-text-primary flex items-center gap-2">
                  <Icon icon="lucide:list-checks" className="w-4 h-4 text-emerald-400" />
                  <span>Itemized Upload Results Breakdown</span>
                </h3>
                {lastResults.summary && (
                  <div className="flex items-center gap-2 text-xs font-semibold">
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                      {lastResults.summary.successful} Succeeded
                    </span>
                    {lastResults.summary.failed > 0 && (
                      <span className="px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/30">
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
                        ? 'bg-emerald-500/10 border-emerald-500/30'
                        : 'bg-rose-500/10 border-rose-500/30'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2 truncate">
                        <Icon
                          icon={item.status === 'success' ? 'lucide:check-circle-2' : 'lucide:alert-octagon'}
                          className={`w-4 h-4 shrink-0 ${
                            item.status === 'success' ? 'text-emerald-400' : 'text-rose-400'
                          }`}
                        />
                        <span className="font-semibold text-xs text-text-primary truncate">
                          {item.filename}
                        </span>
                      </div>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold shrink-0 border ${
                          item.status === 'success'
                            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                            : 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                        }`}
                      >
                        {item.status === 'success' ? 'SAVED (201)' : item.code || 'REJECTED'}
                      </span>
                    </div>

                    {item.status === 'success' && item.file && (
                      <div className="space-y-2 text-xs">
                        <div className="flex items-center justify-between text-text-secondary">
                          <span>Size: {formatBytes(item.file.sizeBytes)}</span>
                          <span>Category: <code className="font-mono text-brand-primary">{item.file.category}</code></span>
                        </div>
                        {item.file.mimetype.startsWith('image/') && (
                          <div className="relative w-full h-28 rounded-lg overflow-hidden bg-bg-terminal border border-border-default flex items-center justify-center">
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
                            className="w-full px-2.5 py-1 bg-bg-terminal border border-border-default rounded font-mono text-[10px] text-text-primary truncate"
                          />
                          <button
                            type="button"
                            onClick={() => handleCopy(item.file!.secure_url, item.file!.id)}
                            className="p-1.5 bg-bg-surface hover:bg-bg-elevated border border-border-default rounded text-text-muted hover:text-text-primary cursor-pointer"
                            title="Copy Cloudinary CDN URL"
                          >
                            {copiedId === item.file.id ? (
                              <Icon icon="lucide:check" className="w-3.5 h-3.5 text-emerald-400" />
                            ) : (
                              <Icon icon="lucide:copy" className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                      </div>
                    )}

                    {item.status === 'rejected' && (
                      <div className="text-xs text-rose-300 space-y-1">
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
                  type="button"
                  onClick={() => setGalleryCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all cursor-pointer ${
                    galleryCategory === cat
                      ? 'bg-brand-primary text-white shadow-xs font-bold'
                      : 'bg-bg-terminal border border-border-default text-text-secondary hover:text-text-primary'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={fetchGallery}
              className="flex items-center gap-1 text-xs text-text-muted hover:text-text-primary cursor-pointer"
            >
              <Icon icon="lucide:refresh-cw" className="w-3.5 h-3.5" />
              Refresh
            </button>
          </div>

          {galleryFiles.length === 0 ? (
            <div className="p-8 border border-border-default rounded-2xl text-center text-text-muted text-xs space-y-2 bg-bg-surface">
              <Icon icon="lucide:image" className="w-8 h-8 mx-auto text-text-muted" />
              <p>No files uploaded in sandbox yet under category &quot;{galleryCategory}&quot;.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {galleryFiles.map(file => (
                <div
                  key={file.id}
                  className="p-4 bg-bg-surface border border-border-default rounded-2xl space-y-3 shadow-sm flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-brand-primary bg-brand-primary/10 border border-brand-primary/20 px-2 py-0.5 rounded">
                        {file.category}
                      </span>
                      <span className="text-[10px] text-text-muted font-mono">
                        {formatBytes(file.sizeBytes)}
                      </span>
                    </div>

                    {file.mimetype.startsWith('image/') ? (
                      <div className="relative w-full h-36 rounded-xl overflow-hidden bg-bg-terminal border border-border-default flex items-center justify-center group">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={file.secure_url}
                          alt={file.filename}
                          className="max-h-full max-w-full object-contain transition-transform group-hover:scale-105"
                        />
                      </div>
                    ) : (
                      <div className="w-full h-36 rounded-xl bg-bg-terminal border border-border-default flex flex-col items-center justify-center text-text-muted space-y-2">
                        <Icon icon="lucide:file-text" className="w-10 h-10 text-brand-primary" />
                        <span className="text-[11px] font-mono uppercase">{file.format || 'DOC'}</span>
                      </div>
                    )}

                    <div>
                      <div className="font-semibold text-xs text-text-primary truncate">
                        {file.filename}
                      </div>
                      <div className="font-mono text-[10px] text-text-muted truncate">
                        ID: {file.id}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-border-default">
                    <button
                      type="button"
                      onClick={() => handleCopy(file.secure_url, file.id)}
                      className="text-xs text-brand-primary hover:underline flex items-center gap-1 font-medium cursor-pointer"
                    >
                      {copiedId === file.id ? <Icon icon="lucide:check" className="w-3.5 h-3.5 text-emerald-400" /> : <Icon icon="lucide:copy" className="w-3.5 h-3.5" />}
                      Copy CDN URL
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteFile(file.id)}
                      className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1 font-medium cursor-pointer"
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
            <div className="p-5 bg-bg-surface border border-border-default rounded-2xl space-y-3">
              <div className="flex items-center gap-2">
                <Icon icon="lucide:shield-alert" className="w-5 h-5 text-rose-400" />
                <h4 className="text-sm font-bold text-text-primary">
                  Strict Prohibited File Types
                </h4>
              </div>
              <p className="text-xs text-text-secondary leading-relaxed">
                To prevent remote code execution and data extraction, all executable and script formats are banned and blocked at the magic byte layer:
              </p>
              <div className="flex flex-wrap gap-1.5 font-mono text-[11px]">
                {['.exe', '.sh', '.bat', '.cmd', '.php', '.js', '.ts', '.py', '.rb', '.jsp', '.asp', '.dll', '.so', '.wasm'].map(ext => (
                  <span key={ext} className="px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20">
                    {ext}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-5 bg-bg-surface border border-border-default rounded-2xl space-y-3">
              <div className="flex items-center gap-2">
                <Icon icon="lucide:check-circle-2" className="w-5 h-5 text-emerald-400" />
                <h4 className="text-sm font-bold text-text-primary">
                  Allowed Safe Formats &amp; Limits
                </h4>
              </div>
              <div className="space-y-2 text-xs text-text-secondary">
                <div className="flex justify-between">
                  <span>Single File Limit:</span>
                  <span className="font-bold text-text-primary font-mono">5 MB max</span>
                </div>
                <div className="flex justify-between">
                  <span>Bulk Batch Limit:</span>
                  <span className="font-bold text-text-primary font-mono">25 MB / 10 files</span>
                </div>
                <div className="flex justify-between">
                  <span>Sandbox Identity Quota:</span>
                  <span className="font-bold text-text-primary font-mono">15 active files max</span>
                </div>
                <div className="flex justify-between">
                  <span>Cloudinary Partitioning:</span>
                  <span className="font-mono text-[11px] text-brand-primary">playground_api/uploads/&lt;cat&gt;/&lt;id&gt;</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
