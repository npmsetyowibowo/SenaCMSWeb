'use client';

import React, { useEffect, useState } from 'react';
import { FolderOpen, Plus, Edit, Trash2, Loader2, Sparkles } from 'lucide-react';
import { useToast } from '@/components/Toast';

export default function CategoriesPage() {
  const { success, error } = useToast();
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({ name: '', slug: '', description: '', color: '#2563eb' });
  const [saving, setSaving] = useState(false);

  const fetchCats = async () => {
    try {
      const res = await fetch('/api/categories');
      const data = await res.json();
      setCategories(data || []);
    } catch {
      error('Gagal memuat kategori');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCats();
  }, []);

  const handleEdit = (cat: any) => {
    setEditingId(cat.id);
    setFormData({
      name: cat.name,
      slug: cat.slug,
      description: cat.description || '',
      color: cat.color || '#2563eb',
    });
  };

  const handleReset = () => {
    setEditingId(null);
    setFormData({ name: '', slug: '', description: '', color: '#2563eb' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return error('Nama kategori wajib diisi');

    setSaving(true);
    try {
      if (editingId) {
        const res = await fetch(`/api/categories/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
        if (!res.ok) throw new Error('Gagal update');
        success('Kategori berhasil diperbarui');
      } else {
        const res = await fetch('/api/categories', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
        if (!res.ok) throw new Error('Gagal menambah');
        success('Kategori baru berhasil ditambahkan');
      }
      handleReset();
      fetchCats();
    } catch (err: any) {
      error(err.message || 'Gagal menyimpan');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Yakin ingin menghapus kategori ini?')) return;
    try {
      const res = await fetch(`/api/categories/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Gagal');
      success('Kategori dihapus');
      fetchCats();
    } catch (err: any) {
      error(err.message || 'Gagal menghapus');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-800 dark:text-slate-100 flex items-center gap-2">
          <FolderOpen className="w-6 h-6 text-blue-600" />
          <span>Manajemen Kategori Artikel</span>
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Kelompokkan artikel blog ke dalam kategori topik terstruktur.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Form Add / Edit */}
        <div className="lg:col-span-4 neu-flat p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 space-y-4">
          <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100">
            {editingId ? 'Edit Kategori' : 'Tambah Kategori Baru'}
          </h3>

          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Nama Kategori *
              </label>
              <input
                type="text"
                placeholder="Contoh: Web Development"
                value={formData.name}
                onChange={(e) => {
                  const name = e.target.value;
                  setFormData({
                    ...formData,
                    name,
                    slug: formData.slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
                  });
                }}
                className="w-full neu-pressed px-3 py-2 text-xs rounded-xl outline-none text-slate-800 dark:text-slate-100"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Slug URL
              </label>
              <input
                type="text"
                placeholder="web-development"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                className="w-full neu-pressed px-3 py-2 text-xs font-mono rounded-xl outline-none text-slate-800 dark:text-slate-100"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Warna Label
              </label>
              <input
                type="color"
                value={formData.color}
                onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                className="w-full h-9 rounded-xl outline-none cursor-pointer"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Deskripsi
              </label>
              <textarea
                rows={3}
                placeholder="Penjelasan singkat mengenai kategori ini..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full neu-pressed p-3 text-xs rounded-xl outline-none text-slate-800 dark:text-slate-100 resize-none"
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
                <span>{editingId ? 'Simpan Perubahan' : 'Tambah Kategori'}</span>
              </button>
            </div>
          </form>
        </div>

        {/* List of Categories */}
        <div className="lg:col-span-8 neu-flat rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 overflow-hidden">
          <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100 mb-4">
            Daftar Kategori ({categories.length})
          </h3>

          {loading ? (
            <div className="py-12 flex justify-center text-xs text-slate-400">
              <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
            </div>
          ) : (
            <div className="space-y-3">
              {categories.map((c) => (
                <div
                  key={c.id}
                  className="p-4 rounded-2xl neu-flat-xs border border-slate-200/50 dark:border-slate-800 flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className="w-4 h-4 rounded-full shrink-0 shadow-sm"
                      style={{ backgroundColor: c.color || '#2563eb' }}
                    />
                    <div>
                      <div className="font-bold text-sm text-slate-800 dark:text-slate-100">
                        {c.name}
                      </div>
                      <div className="text-[11px] text-slate-400 font-mono">
                        /category/{c.slug} &bull; {c.article_count || 0} artikel
                      </div>
                      {c.description && (
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-1">
                          {c.description}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleEdit(c)}
                      className="neu-button p-2 rounded-xl text-blue-600 hover:text-blue-700"
                      title="Edit"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(c.id)}
                      className="neu-button p-2 rounded-xl text-rose-600 hover:text-rose-700"
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
