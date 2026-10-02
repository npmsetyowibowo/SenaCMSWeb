'use client';

import React, { useEffect, useState, useRef } from 'react';
import {
  Image as ImageIcon,
  Upload,
  Search,
  Copy,
  Trash2,
  ExternalLink,
  Loader2,
  CheckCircle,
  FileCheck,
  Sparkles,
} from 'lucide-react';
import { useToast } from '@/components/Toast';

export default function MediaLibraryPage() {
  const { success, error } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [mediaList, setMediaList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [search, setSearch] = useState('');
  const [urlInput, setUrlInput] = useState('');
  const [altTextInput, setAltTextInput] = useState('');
  const [previewItem, setPreviewItem] = useState<any>(null);

  const fetchMedia = async () => {
    try {
      const res = await fetch('/api/media');
      const data = await res.json();
      setMediaList(data || []);
    } catch {
      error('Gagal memuat galeri media');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedia();
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('alt_text', altTextInput || file.name);

      const res = await fetch('/api/media', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Upload gagal');

      success('File gambar berhasil diunggah!');
      setAltTextInput('');
      if (fileInputRef.current) fileInputRef.current.value = '';
      fetchMedia();
    } catch (err: any) {
      error(err.message || 'Gagal mengunggah file');
    } finally {
      setUploading(false);
    }
  };

  const handleAddByUrl = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlInput.trim()) return error('Masukkan URL gambar');

    setUploading(true);
    try {
      const res = await fetch('/api/media', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: urlInput,
          alt_text: altTextInput || 'Gambar Media SenaWeb',
          name: 'external-image.jpg',
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Gagal menyimpan URL');

      success('URL gambar berhasil ditambahkan ke library!');
      setUrlInput('');
      setAltTextInput('');
      fetchMedia();
    } catch (err: any) {
      error(err.message || 'Gagal menambahkan URL');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Yakin ingin menghapus media ini?')) return;
    try {
      const res = await fetch(`/api/media/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Gagal');
      success('Media berhasil dihapus');
      setMediaList(mediaList.filter((m) => m.id !== id));
      if (previewItem?.id === id) setPreviewItem(null);
    } catch (err: any) {
      error(err.message || 'Gagal menghapus');
    }
  };

  const copyToClipboard = (url: string) => {
    const fullUrl = url.startsWith('http') ? url : `${window.location.origin}${url}`;
    navigator.clipboard.writeText(fullUrl);
    success('URL gambar berhasil disalin ke clipboard!', 'Tersalin');
  };

  const filteredMedia = mediaList.filter(
    (m) =>
      m.filename.toLowerCase().includes(search.toLowerCase()) ||
      m.alt_text.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-slate-800 dark:text-slate-100 flex items-center gap-2">
          <ImageIcon className="w-6 h-6 text-pink-600" />
          <span>Media Library & Pengelola Gambar</span>
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Upload file gambar, salin URL untuk artikel, kelola alt text SEO, dan preview resolusi gambar.
        </p>
      </div>

      {/* Upload Zone & URL Adder */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Direct File Upload */}
        <div className="lg:col-span-6 neu-flat p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 flex flex-col justify-between space-y-4">
          <div>
            <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100 mb-1 flex items-center gap-1.5">
              <Upload className="w-4 h-4 text-blue-500" />
              <span>Unggah File Gambar Baru</span>
            </h3>
            <p className="text-xs text-slate-500">Mendukung format JPG, PNG, WebP, SVG (Maks. 5MB)</p>
          </div>

          <div
            onClick={() => fileInputRef.current?.click()}
            className="neu-pressed p-6 rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-700 text-center cursor-pointer hover:border-blue-500 transition-colors"
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/svg+xml,image/gif"
              onChange={handleFileUpload}
              className="hidden"
            />
            {uploading ? (
              <div className="flex flex-col items-center gap-2 text-xs text-blue-500">
                <Loader2 className="w-8 h-8 animate-spin" />
                <span>Mengunggah gambar...</span>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2 text-slate-500">
                <Upload className="w-8 h-8 text-blue-500" />
                <span className="text-xs font-semibold">Klik untuk memilih file dari komputer</span>
              </div>
            )}
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
              Alt Text SEO Gambar (Opsional)
            </label>
            <input
              type="text"
              placeholder="Contoh: Logo SenaWeb Jasa Pembuatan Website"
              value={altTextInput}
              onChange={(e) => setAltTextInput(e.target.value)}
              className="w-full neu-pressed px-3 py-1.5 text-xs rounded-xl outline-none text-slate-800 dark:text-slate-100"
            />
          </div>
        </div>

        {/* Add via External URL */}
        <div className="lg:col-span-6 neu-flat p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 flex flex-col justify-between space-y-4">
          <div>
            <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100 mb-1 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-purple-500" />
              <span>Simpan Gambar dari URL / Unsplash</span>
            </h3>
            <p className="text-xs text-slate-500">Daftarkan URL gambar eksternal ke library tanpa upload file lokal.</p>
          </div>

          <form onSubmit={handleAddByUrl} className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                URL Gambar Lengkap *
              </label>
              <input
                type="text"
                placeholder="https://images.unsplash.com/photo-..."
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                className="w-full neu-pressed px-3 py-2 text-xs rounded-xl outline-none text-slate-800 dark:text-slate-100"
              />
            </div>

            <button
              type="submit"
              disabled={uploading}
              className="w-full neu-accent-btn py-2 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5"
            >
              {uploading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <PlusCircleIcon className="w-3.5 h-3.5" />}
              <span>Simpan ke Library</span>
            </button>
          </form>

          <p className="text-[11px] text-slate-400">
            Tip: Gunakan gambar beresolusi tinggi dengan lisensi bebas royalti untuk hasil visual terbaik.
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="neu-flat p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 flex items-center justify-between gap-4">
        <div className="relative w-full max-w-sm">
          <Search className="w-4 h-4 absolute left-3.5 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Cari file media berdasarkan nama atau alt text..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full neu-pressed pl-10 pr-4 py-2 text-xs rounded-xl outline-none text-slate-800 dark:text-slate-100"
          />
        </div>
        <div className="text-xs text-slate-500 shrink-0">
          Total: <strong className="text-slate-800 dark:text-slate-100">{filteredMedia.length}</strong> media
        </div>
      </div>

      {/* Media Grid */}
      {loading ? (
        <div className="py-16 flex justify-center text-xs text-slate-400">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        </div>
      ) : filteredMedia.length === 0 ? (
        <div className="neu-flat p-12 rounded-3xl text-center border border-slate-200/80 dark:border-slate-800 text-xs text-slate-400">
          Belum ada media gambar yang ditemukan. Silakan upload gambar pertama Anda di atas.
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {filteredMedia.map((m) => (
            <div
              key={m.id}
              className="neu-flat rounded-2xl overflow-hidden border border-slate-200/60 dark:border-slate-800 flex flex-col justify-between group hover:-translate-y-1 transition-all"
            >
              <div
                onClick={() => setPreviewItem(m)}
                className="aspect-square relative overflow-hidden bg-slate-100 dark:bg-slate-800 cursor-pointer"
              >
                <img src={m.url} alt={m.alt_text} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
              </div>

              <div className="p-2.5 space-y-1.5">
                <div className="font-bold text-[11px] text-slate-800 dark:text-slate-200 truncate" title={m.filename}>
                  {m.filename}
                </div>
                <div className="text-[10px] text-slate-400 flex items-center justify-between">
                  <span>{m.mime_type.split('/')[1]?.toUpperCase()}</span>
                  <span>{Math.round((m.size_bytes || 0) / 1024)} KB</span>
                </div>

                <div className="flex items-center justify-between gap-1 pt-1 border-t border-slate-200/60 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => copyToClipboard(m.url)}
                    className="neu-button p-1.5 rounded-lg text-blue-600 hover:text-blue-700 text-[10px] flex items-center gap-1 font-semibold flex-1 justify-center"
                    title="Salin URL"
                  >
                    <Copy className="w-3 h-3" />
                    <span>Salin</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(m.id)}
                    className="neu-button p-1.5 rounded-lg text-rose-600 hover:text-rose-700"
                    title="Hapus"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Preview Modal */}
      {previewItem && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="neu-flat p-6 rounded-3xl max-w-lg w-full border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-sm text-slate-800 dark:text-slate-100 truncate max-w-xs">
                {previewItem.filename}
              </h4>
              <button
                type="button"
                onClick={() => setPreviewItem(null)}
                className="neu-button px-2.5 py-1 rounded-lg text-xs"
              >
                Tutup
              </button>
            </div>

            <div className="aspect-video relative rounded-2xl overflow-hidden neu-pressed-sm">
              <img src={previewItem.url} alt={previewItem.alt_text} className="w-full h-full object-contain bg-slate-900/50" />
            </div>

            <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
              <div>
                <span className="font-semibold text-slate-400">Alt Text SEO:</span> {previewItem.alt_text}
              </div>
              <div>
                <span className="font-semibold text-slate-400">URL Target:</span>{' '}
                <span className="font-mono text-[11px] break-all">{previewItem.url}</span>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => copyToClipboard(previewItem.url)}
                className="neu-accent-btn px-4 py-2 text-xs font-bold rounded-xl flex items-center gap-1.5"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Salin URL Lengkap</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function PlusCircleIcon({ className }: { className?: string }) {
  return <Upload className={className} />;
}
