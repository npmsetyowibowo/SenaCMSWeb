'use client';

import React, { useEffect, useState } from 'react';
import { Tag as TagIcon, Plus, Edit, Trash2, Loader2 } from 'lucide-react';
import { useToast } from '@/components/Toast';

export default function TagsPage() {
  const { success, error } = useToast();
  const [tags, setTags] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [saving, setSaving] = useState(false);

  const fetchTags = async () => {
    try {
      const res = await fetch('/api/tags');
      const data = await res.json();
      setTags(data || []);
    } catch {
      error('Gagal memuat tags');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTags();
  }, []);

  const handleEdit = (t: any) => {
    setEditingId(t.id);
    setName(t.name);
    setSlug(t.slug);
  };

  const handleReset = () => {
    setEditingId(null);
    setName('');
    setSlug('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return error('Nama tag wajib diisi');

    setSaving(true);
    try {
      if (editingId) {
        const res = await fetch(`/api/tags/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, slug }),
        });
        if (!res.ok) throw new Error('Gagal update tag');
        success('Tag berhasil diperbarui');
      } else {
        const res = await fetch('/api/tags', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, slug }),
        });
        if (!res.ok) throw new Error('Gagal menambah tag');
        success('Tag baru berhasil ditambahkan');
      }
      handleReset();
      fetchTags();
    } catch (err: any) {
      error(err.message || 'Gagal menyimpan');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Yakin ingin menghapus tag ini?')) return;
    try {
      const res = await fetch(`/api/tags/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Gagal');
      success('Tag berhasil dihapus');
      fetchTags();
    } catch (err: any) {
      error(err.message || 'Gagal menghapus');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-800 dark:text-slate-100 flex items-center gap-2">
          <TagIcon className="w-6 h-6 text-purple-600" />
          <span>Manajemen Tag Artikel</span>
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Kelola label kata kunci untuk pengelompokan artikel blog.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Form Add / Edit */}
        <div className="lg:col-span-4 neu-flat p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 space-y-4">
          <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100">
            {editingId ? 'Edit Tag' : 'Tambah Tag Baru'}
          </h3>

          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Nama Tag *
              </label>
              <input
                type="text"
                placeholder="Contoh: Next.js"
                value={name}
                onChange={(e) => {
                  const val = e.target.value;
                  setName(val);
                  if (!slug) setSlug(val.toLowerCase().replace(/[^a-z0-9]+/g, '-'));
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
                placeholder="nextjs"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="w-full neu-pressed px-3 py-2 text-xs font-mono rounded-xl outline-none text-slate-800 dark:text-slate-100"
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
                <span>{editingId ? 'Simpan Perubahan' : 'Tambah Tag'}</span>
              </button>
            </div>
          </form>
        </div>

        {/* List of Tags */}
        <div className="lg:col-span-8 neu-flat rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6">
          <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100 mb-4">
            Daftar Tag ({tags.length})
          </h3>

          {loading ? (
            <div className="py-12 flex justify-center text-xs text-slate-400">
              <Loader2 className="w-6 h-6 animate-spin text-purple-500" />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {tags.map((t) => (
                <div
                  key={t.id}
                  className="p-3.5 rounded-2xl neu-flat-xs border border-slate-200/50 dark:border-slate-800 flex items-center justify-between gap-3"
                >
                  <div>
                    <div className="font-bold text-sm text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
                      <TagIcon className="w-3 h-3 text-purple-500" />
                      <span>{t.name}</span>
                    </div>
                    <div className="text-[11px] text-slate-400 font-mono">
                      /tag/{t.slug} &bull; {t.article_count || 0} artikel
                    </div>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleEdit(t)}
                      className="neu-button p-1.5 rounded-lg text-blue-600 hover:text-blue-700"
                      title="Edit"
                    >
                      <Edit className="w-3 h-3" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(t.id)}
                      className="neu-button p-1.5 rounded-lg text-rose-600 hover:text-rose-700"
                      title="Hapus"
                    >
                      <Trash2 className="w-3 h-3" />
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
