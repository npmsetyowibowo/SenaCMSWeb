'use client';

import React, { useEffect, useState } from 'react';
import { Briefcase, Plus, Edit, Trash2, ExternalLink, Loader2 } from 'lucide-react';
import { useToast } from '@/components/Toast';

export default function PortfolioAdminPage() {
  const { success, error } = useToast();
  const [portfolioList, setPortfolioList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    category: 'Company Profile',
    client: '',
    thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800',
    url: '',
    description: '',
    tech_stack: 'Next.js, Tailwind CSS, PostgreSQL',
    is_featured: true,
  });

  const fetchPortfolio = async () => {
    try {
      const res = await fetch('/api/portfolio');
      const data = await res.json();
      setPortfolioList(data || []);
    } catch {
      error('Gagal memuat portofolio');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPortfolio();
  }, []);

  const handleEdit = (p: any) => {
    setEditingId(p.id);
    setFormData({
      title: p.title,
      slug: p.slug,
      category: p.category,
      client: p.client || '',
      thumbnail: p.thumbnail || '',
      url: p.url || '',
      description: p.description || '',
      tech_stack: Array.isArray(p.tech_stack) ? p.tech_stack.join(', ') : p.tech_stack || '',
      is_featured: p.is_featured,
    });
  };

  const handleReset = () => {
    setEditingId(null);
    setFormData({
      title: '',
      slug: '',
      category: 'Company Profile',
      client: '',
      thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800',
      url: '',
      description: '',
      tech_stack: 'Next.js, Tailwind CSS, PostgreSQL',
      is_featured: true,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.category) return error('Judul dan kategori wajib diisi');

    setSaving(true);
    try {
      if (editingId) {
        const res = await fetch(`/api/portfolio/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
        if (!res.ok) throw new Error('Gagal update portofolio');
        success('Portofolio berhasil diperbarui');
      } else {
        const res = await fetch('/api/portfolio', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
        if (!res.ok) throw new Error('Gagal menambah portofolio');
        success('Portofolio baru berhasil ditambahkan');
      }
      handleReset();
      fetchPortfolio();
    } catch (err: any) {
      error(err.message || 'Gagal menyimpan');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Yakin ingin menghapus portofolio ini?')) return;
    try {
      const res = await fetch(`/api/portfolio/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Gagal');
      success('Portofolio berhasil dihapus');
      fetchPortfolio();
    } catch (err: any) {
      error(err.message || 'Gagal menghapus');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-800 dark:text-slate-100 flex items-center gap-2">
          <Briefcase className="w-6 h-6 text-blue-600" />
          <span>Manajemen Portofolio Klien</span>
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Tampilkan proyek website terbaik untuk meyakinkan calon klien.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Form Add / Edit */}
        <div className="lg:col-span-4 neu-flat p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 space-y-4">
          <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100">
            {editingId ? 'Edit Portofolio' : 'Tambah Portofolio Baru'}
          </h3>

          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Judul Proyek *
              </label>
              <input
                type="text"
                placeholder="Contoh: PT Bintang Logistik Nusantara"
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
                Kategori Proyek
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full neu-pressed px-3 py-2 text-xs rounded-xl outline-none text-slate-800 dark:text-slate-100 bg-transparent"
              >
                <option value="Company Profile" className="bg-slate-100 dark:bg-slate-800">Company Profile</option>
                <option value="E-Commerce" className="bg-slate-100 dark:bg-slate-800">E-Commerce & UMKM</option>
                <option value="Sekolah & Institusi" className="bg-slate-100 dark:bg-slate-800">Sekolah & Institusi</option>
                <option value="Landing Page" className="bg-slate-100 dark:bg-slate-800">Landing Page</option>
                <option value="Custom Web App" className="bg-slate-100 dark:bg-slate-800">Custom Web App</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Nama Klien / Perusahaan
              </label>
              <input
                type="text"
                placeholder="PT Bintang Logistik"
                value={formData.client}
                onChange={(e) => setFormData({ ...formData, client: e.target.value })}
                className="w-full neu-pressed px-3 py-2 text-xs rounded-xl outline-none text-slate-800 dark:text-slate-100"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                URL Thumbnail Gambar
              </label>
              <input
                type="text"
                value={formData.thumbnail}
                onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
                className="w-full neu-pressed px-3 py-2 text-xs rounded-xl outline-none text-slate-800 dark:text-slate-100"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Live URL Demo
              </label>
              <input
                type="text"
                placeholder="https://demo-..."
                value={formData.url}
                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                className="w-full neu-pressed px-3 py-2 text-xs rounded-xl outline-none text-slate-800 dark:text-slate-100"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Tech Stack (Pisahkan dengan koma)
              </label>
              <input
                type="text"
                placeholder="Next.js, Tailwind, Postgres"
                value={formData.tech_stack}
                onChange={(e) => setFormData({ ...formData, tech_stack: e.target.value })}
                className="w-full neu-pressed px-3 py-2 text-xs rounded-xl outline-none text-slate-800 dark:text-slate-100"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Deskripsi Singkat
              </label>
              <textarea
                rows={3}
                placeholder="Jelaskan fitur utama dan hasil yang dicapai..."
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
                <span>{editingId ? 'Simpan Perubahan' : 'Tambah Portofolio'}</span>
              </button>
            </div>
          </form>
        </div>

        {/* List of Portfolio */}
        <div className="lg:col-span-8 neu-flat rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6">
          <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100 mb-4">
            Daftar Portofolio ({portfolioList.length})
          </h3>

          {loading ? (
            <div className="py-12 flex justify-center text-xs text-slate-400">
              <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
            </div>
          ) : (
            <div className="space-y-4">
              {portfolioList.map((p) => (
                <div
                  key={p.id}
                  className="p-4 rounded-2xl neu-flat-xs border border-slate-200/60 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={p.thumbnail || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=100'}
                      alt={p.title}
                      className="w-16 h-12 rounded-xl object-cover neu-flat-xs shrink-0"
                    />
                    <div>
                      <div className="text-[10px] font-bold text-blue-600 uppercase">
                        {p.category} &bull; {p.client}
                      </div>
                      <div className="font-bold text-sm text-slate-800 dark:text-slate-100">
                        {p.title}
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                        {p.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 self-end sm:self-auto shrink-0">
                    {p.url && (
                      <a
                        href={p.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="neu-button p-2 rounded-xl text-slate-600 hover:text-blue-600"
                        title="Buka Demo"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                    <button
                      type="button"
                      onClick={() => handleEdit(p)}
                      className="neu-button p-2 rounded-xl text-blue-600 hover:text-blue-700"
                      title="Edit"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(p.id)}
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
