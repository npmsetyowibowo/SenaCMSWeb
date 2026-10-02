'use client';

import React, { useState, useRef, useEffect } from 'react';
import { UploadCloud, Image as ImageIcon, Link as LinkIcon, Trash2, Check, Loader2, FolderOpen } from 'lucide-react';
import { useToast } from './Toast';

interface ThumbnailUploaderProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
}

export function ThumbnailUploader({
  value,
  onChange,
  label = 'Gambar Thumbnail Artikel',
}: ThumbnailUploaderProps) {
  const { success, error } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [mode, setMode] = useState<'upload' | 'library' | 'url'>('upload');
  const [manualUrl, setManualUrl] = useState(value);
  const [mediaList, setMediaList] = useState<any[]>([]);
  const [loadingMedia, setLoadingMedia] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  useEffect(() => {
    setManualUrl(value);
  }, [value]);

  const loadMediaLibrary = async () => {
    setLoadingMedia(true);
    try {
      const res = await fetch('/api/media');
      if (res.ok) {
        const data = await res.json();
        setMediaList(Array.isArray(data) ? data : []);
      }
    } catch {
      // ignore
    } finally {
      setLoadingMedia(false);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    await uploadFile(file);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    await uploadFile(file);
  };

  const uploadFile = async (file: File) => {
    // Validate file type
    const validMimes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'];
    if (!validMimes.includes(file.type)) {
      error('Format file tidak didukung. Harap pilih gambar JPG, PNG, atau WebP.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      error('Ukuran gambar melebihi batas maksimal 5MB.');
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('alt_text', file.name.replace(/\.[^/.]+$/, ''));

      const res = await fetch('/api/media', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Gagal mengunggah gambar');

      onChange(data.url);
      setManualUrl(data.url);
      success('Gambar thumbnail berhasil diunggah!');
    } catch (err: any) {
      error(err.message || 'Gagal mengunggah gambar');
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleApplyManualUrl = () => {
    if (!manualUrl) {
      error('Harap masukkan URL gambar');
      return;
    }
    onChange(manualUrl);
    success('URL gambar diterapkan!');
  };

  const handleRemove = () => {
    onChange('');
    setManualUrl('');
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
          {label}
        </label>
        {value && (
          <button
            type="button"
            onClick={handleRemove}
            className="text-[11px] text-rose-500 hover:text-rose-600 flex items-center gap-1 font-semibold"
          >
            <Trash2 className="w-3 h-3" />
            <span>Hapus Thumbnail</span>
          </button>
        )}
      </div>

      {/* Preview Card */}
      {value ? (
        <div className="relative aspect-video rounded-2xl overflow-hidden neu-pressed-sm border border-slate-200 dark:border-slate-700 group">
          <img src={value} alt="Thumbnail preview" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-3 py-1.5 rounded-xl bg-white text-slate-800 text-xs font-bold shadow hover:bg-slate-100 flex items-center gap-1.5"
            >
              <UploadCloud className="w-3.5 h-3.5 text-blue-600" />
              <span>Ganti File</span>
            </button>
            <button
              type="button"
              onClick={handleRemove}
              className="px-3 py-1.5 rounded-xl bg-rose-600 text-white text-xs font-bold shadow hover:bg-rose-700 flex items-center gap-1.5"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Hapus</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          {/* Mode Switcher Tabs */}
          <div className="grid grid-cols-3 gap-1 p-1 rounded-xl neu-pressed-sm text-[11px] font-semibold">
            <button
              type="button"
              onClick={() => setMode('upload')}
              className={`py-1 rounded-lg transition-colors flex items-center justify-center gap-1 ${
                mode === 'upload' ? 'neu-button text-blue-600 font-bold' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <UploadCloud className="w-3 h-3" />
              <span>Upload File</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('library');
                loadMediaLibrary();
              }}
              className={`py-1 rounded-lg transition-colors flex items-center justify-center gap-1 ${
                mode === 'library' ? 'neu-button text-blue-600 font-bold' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <FolderOpen className="w-3 h-3" />
              <span>Media Library</span>
            </button>
            <button
              type="button"
              onClick={() => setMode('url')}
              className={`py-1 rounded-lg transition-colors flex items-center justify-center gap-1 ${
                mode === 'url' ? 'neu-button text-blue-600 font-bold' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <LinkIcon className="w-3 h-3" />
              <span>Input URL</span>
            </button>
          </div>

          {/* Mode 1: Drag & Drop File Upload */}
          {mode === 'upload' && (
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`p-6 border-2 border-dashed rounded-2xl text-center cursor-pointer transition-all neu-flat-xs ${
                dragOver
                  ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-900/20 scale-[0.99]'
                  : 'border-slate-300 dark:border-slate-700 hover:border-blue-400'
              }`}
            >
              {uploading ? (
                <div className="py-2 flex flex-col items-center gap-2">
                  <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
                  <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                    Mengunggah gambar...
                  </span>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <div className="w-10 h-10 rounded-2xl neu-flat flex items-center justify-center text-blue-600">
                    <UploadCloud className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                      Klik untuk upload gambar atau drag & drop
                    </span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">
                      JPG, PNG, WebP hingga 5MB
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Mode 2: Media Library Picker */}
          {mode === 'library' && (
            <div className="p-3 rounded-2xl neu-pressed-sm space-y-2 max-h-48 overflow-y-auto">
              {loadingMedia ? (
                <div className="py-4 flex justify-center text-xs text-slate-400">
                  <Loader2 className="w-5 h-5 animate-spin text-blue-500" />
                </div>
              ) : mediaList.length === 0 ? (
                <div className="py-4 text-center text-xs text-slate-400">
                  Belum ada media di library. Silakan gunakan tab Upload File.
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-2">
                  {mediaList.map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => {
                        onChange(m.url);
                        setManualUrl(m.url);
                        success('Gambar dari library terpilih!');
                      }}
                      className="group relative aspect-video rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 hover:scale-105 transition-transform"
                    >
                      <img src={m.url} alt={m.alt_text} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-blue-600/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                        <Check className="w-4 h-4 font-bold" />
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Mode 3: Manual URL */}
          {mode === 'url' && (
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="https://images.unsplash.com/..."
                value={manualUrl}
                onChange={(e) => setManualUrl(e.target.value)}
                className="flex-1 neu-pressed px-3 py-2 text-xs rounded-xl outline-none text-slate-800 dark:text-slate-100"
              />
              <button
                type="button"
                onClick={handleApplyManualUrl}
                className="neu-button px-3 py-2 text-xs font-bold text-blue-600 rounded-xl"
              >
                Terapkan
              </button>
            </div>
          )}
        </div>
      )}

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
}
