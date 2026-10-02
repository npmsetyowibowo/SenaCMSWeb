'use client';

import React, { useEffect, useState } from 'react';
import { FileCode, Plus, Edit, Trash2, ExternalLink, Loader2, Sparkles } from 'lucide-react';
import { useToast } from '@/components/Toast';
import { RichTextEditor } from '@/components/RichTextEditor';

export default function PagesAdminPage() {
  const { success, error } = useToast();
  const [pages, setPages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    content: '',
    excerpt: '',
    status: 'published',
    seo_title: '',
    seo_description: '',
  });

  const fetchPages = async () => {
    try {
      const res = await fetch('/api/pages');
      const data = await res.json();
      setPages(data || []);
    } catch {
      error('Gagal memuat halaman');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPages();
  }, []);

  const handleEdit = (p: any) => {
    setEditingId(p.id);
    setFormData({
      title: p.title,
      slug: p.slug,
      content: p.content,
      excerpt: p.excerpt || '',
      status: p.status || 'published',
      seo_title: p.seo_title || '',
      seo_description: p.seo_description || '',
    });
  };

  const handleReset = () => {
    setEditingId(null);
    setFormData({
      title: '',
      slug: '',
      content: '',
      excerpt: '',
      status: 'published',
      seo_title: '',
      seo_description: '',
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.content) return error('Judul dan konten halaman wajib diisi');

    setSaving(true);
    try {
      if (editingId) {
        const res = await fetch(`/api/pages/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
        if (!res.ok) throw new Error('Gagal update halaman');
        success('Halaman berhasil diperbarui');
      } else {
        const res = await fetch('/api/pages', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
        if (!res.ok) throw new Error('Gagal menambah halaman');
        success('Halaman baru berhasil ditambahkan');
      }
      handleReset();
      fetchPages();
    } catch (err: any) {
      error(err.message || 'Gagal menyimpan');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Yakin ingin menghapus halaman ini?')) return;
    try {
      const res = await fetch(`/api/pages/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Gagal');
      success('Halaman berhasil dihapus');
      fetchPages();
    } catch (err: any) {
      error(err.message || 'Gagal menghapus');
    }
  };

  return (
    <div className="space-y-6 pb-12">
      <div>
        <h1 className="text-2xl font-black text-slate-800 dark:text-slate-100 flex items-center gap-2">
          <FileCode className="w-6 h-6 text-blue-600" />
          <span>Manajemen Halaman Kustom (Pages)</span>
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Buat halaman statis seperti Tentang Kami, Syarat & Ketentuan, atau halaman khusus promosi.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Form Add / Edit */}
        <div className="lg:col-span-7 neu-flat p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 space-y-4">
          <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100">
            {editingId ? 'Edit Halaman' : 'Tambah Halaman Baru'}
          </h3>

          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Judul Halaman *
              </label>
              <input
                type="text"
                placeholder="Contoh: Tentang Kami / Layanan Tambahan"
                value={formData.title}
                onChange={(e) => {
                  const title = e.target.value;
                  setFormData({
                    ...formData,
                    title,
                    slug: formData.slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
                  });
                }}
                className="w-full neu-pressed px-3 py-2 text-xs rounded-xl outline-none text-slate-800 dark:text-slate-100"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Permalink / Slug URL
              </label>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400 font-mono">senaweb.id/</span>
                <input
                  type="text"
                  placeholder="tentang-kami"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  className="flex-1 neu-pressed px-3 py-1.5 text-xs font-mono rounded-xl outline-none text-slate-800 dark:text-slate-100"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Ringkasan / Excerpt
              </label>
              <input
                type="text"
                placeholder="Deskripsi singkat isi halaman..."
                value={formData.excerpt}
                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                className="w-full neu-pressed px-3 py-2 text-xs rounded-xl outline-none text-slate-800 dark:text-slate-100"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Isi Lengkap Konten Halaman *
              </label>
              <RichTextEditor
                value={formData.content}
                onChange={(content) => setFormData({ ...formData, content })}
                minHeight="260px"
              />
            </div>

            <div className="flex items-center gap-2 pt-2">
              {editingId && (
                <button
                  type="button"
                  onClick={handleReset}
                  className="neu-button px-4 py-2 text-xs rounded-xl"
                >
                  Batal
                </button>
              )}
              <button
                type="submit"
                disabled={saving}
                className="flex-1 neu-accent-btn py-2 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5"
              >
                {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Plus className="w-3.5 h-3.5" />}
                <span>{editingId ? 'Simpan Perubahan Halaman' : 'Tambah Halaman'}</span>
              </button>
            </div>
          </form>
        </div>

        {/* List of Pages */}
        <div className="lg:col-span-5 neu-flat rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 space-y-4">
          <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100">
            Daftar Halaman ({pages.length})
          </h3>

          {loading ? (
            <div className="py-12 flex justify-center text-xs text-slate-400">
              <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
            </div>
          ) : (
            <div className="space-y-3">
              {pages.map((p) => (
                <div
                  key={p.id}
                  className="p-4 rounded-2xl neu-flat-xs border border-slate-200/60 dark:border-slate-800 flex items-start justify-between gap-3"
                >
                  <div>
                    <h4 className="font-bold text-sm text-slate-800 dark:text-slate-100">
                      {p.title}
                    </h4>
                    <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                      /{p.slug}
                    </div>
                    {p.excerpt && (
                      <p className="text-xs text-slate-500 mt-1 line-clamp-1">
                        {p.excerpt}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <a
                      href={`/${p.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="neu-button p-1.5 rounded-lg text-slate-600 hover:text-blue-600"
                      title="Buka Halaman"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                    <button
                      type="button"
                      onClick={() => handleEdit(p)}
                      className="neu-button p-1.5 rounded-lg text-blue-600 hover:text-blue-700"
                      title="Edit"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(p.id)}
                      className="neu-button p-1.5 rounded-lg text-rose-600 hover:text-rose-700"
                      title="Hapus"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
