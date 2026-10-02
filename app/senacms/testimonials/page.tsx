'use client';

import React, { useEffect, useState } from 'react';
import { Star, Plus, Edit, Trash2, Loader2, Quote } from 'lucide-react';
import { useToast } from '@/components/Toast';

export default function TestimonialsAdminPage() {
  const { success, error } = useToast();
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    role: '',
    company: '',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120',
    content: '',
    rating: 5,
    is_featured: true,
  });

  const fetchTestimonials = async () => {
    try {
      const res = await fetch('/api/testimonials');
      const data = await res.json();
      setTestimonials(data || []);
    } catch {
      error('Gagal memuat testimoni');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const handleEdit = (t: any) => {
    setEditingId(t.id);
    setFormData({
      name: t.name,
      role: t.role || '',
      company: t.company || '',
      avatar: t.avatar || '',
      content: t.content,
      rating: t.rating || 5,
      is_featured: t.is_featured,
    });
  };

  const handleReset = () => {
    setEditingId(null);
    setFormData({
      name: '',
      role: '',
      company: '',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120',
      content: '',
      rating: 5,
      is_featured: true,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.content) return error('Nama dan ulasan testimonial wajib diisi');

    setSaving(true);
    try {
      if (editingId) {
        const res = await fetch(`/api/testimonials/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
        if (!res.ok) throw new Error('Gagal update testimoni');
        success('Testimoni berhasil diperbarui');
      } else {
        const res = await fetch('/api/testimonials', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
        if (!res.ok) throw new Error('Gagal menambah testimoni');
        success('Testimoni baru berhasil ditambahkan');
      }
      handleReset();
      fetchTestimonials();
    } catch (err: any) {
      error(err.message || 'Gagal menyimpan');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Yakin ingin menghapus testimoni ini?')) return;
    try {
      const res = await fetch(`/api/testimonials/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Gagal');
      success('Testimoni berhasil dihapus');
      fetchTestimonials();
    } catch (err: any) {
      error(err.message || 'Gagal menghapus');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-800 dark:text-slate-100 flex items-center gap-2">
          <Star className="w-6 h-6 text-amber-500 fill-amber-500" />
          <span>Manajemen Testimoni Klien</span>
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Kelola ulasan pembeli dan klien yang ditampilkan di homepage dan landing page kota.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Form Add / Edit */}
        <div className="lg:col-span-4 neu-flat p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 space-y-4">
          <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100">
            {editingId ? 'Edit Testimoni' : 'Tambah Testimoni Baru'}
          </h3>

          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Nama Klien *
              </label>
              <input
                type="text"
                placeholder="Contoh: Hendra Gunawan"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full neu-pressed px-3 py-2 text-xs rounded-xl outline-none text-slate-800 dark:text-slate-100"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Jabatan / Profesi
              </label>
              <input
                type="text"
                placeholder="Direktur Operasional"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="w-full neu-pressed px-3 py-2 text-xs rounded-xl outline-none text-slate-800 dark:text-slate-100"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Nama Perusahaan / Bisnis
              </label>
              <input
                type="text"
                placeholder="PT Bintang Logistik Nusantara"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                className="w-full neu-pressed px-3 py-2 text-xs rounded-xl outline-none text-slate-800 dark:text-slate-100"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Foto Avatar URL
              </label>
              <input
                type="text"
                value={formData.avatar}
                onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
                className="w-full neu-pressed px-3 py-2 text-xs rounded-xl outline-none text-slate-800 dark:text-slate-100"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Rating Bintang (1 - 5)
              </label>
              <select
                value={formData.rating}
                onChange={(e) => setFormData({ ...formData, rating: parseInt(e.target.value, 10) })}
                className="w-full neu-pressed px-3 py-2 text-xs rounded-xl outline-none text-slate-800 dark:text-slate-100 bg-transparent"
              >
                <option value={5} className="bg-slate-100 dark:bg-slate-800">5 Bintang (Sangat Puas)</option>
                <option value={4} className="bg-slate-100 dark:bg-slate-800">4 Bintang (Puas)</option>
                <option value={3} className="bg-slate-100 dark:bg-slate-800">3 Bintang (Cukup)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Isi Ulasan Testimoni *
              </label>
              <textarea
                rows={3}
                placeholder="Ceritakan pengalaman kepuasan hasil pembuatan website..."
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
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
                <span>{editingId ? 'Simpan Perubahan' : 'Tambah Testimoni'}</span>
              </button>
            </div>
          </form>
        </div>

        {/* List of Testimonials */}
        <div className="lg:col-span-8 neu-flat rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6">
          <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100 mb-4">
            Daftar Testimoni ({testimonials.length})
          </h3>

          {loading ? (
            <div className="py-12 flex justify-center text-xs text-slate-400">
              <Loader2 className="w-6 h-6 animate-spin text-amber-500" />
            </div>
          ) : (
            <div className="space-y-4">
              {testimonials.map((t) => (
                <div
                  key={t.id}
                  className="p-4 rounded-2xl neu-flat-xs border border-slate-200/60 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div className="flex items-start gap-3">
                    <img
                      src={t.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                      alt={t.name}
                      className="w-12 h-12 rounded-full object-cover neu-flat-xs shrink-0 mt-1"
                    />
                    <div>
                      <div className="flex items-center gap-1 mb-1">
                        {Array.from({ length: t.rating || 5 }).map((_, i) => (
                          <Star key={i} className="w-3 h-3 text-amber-400 fill-amber-400" />
                        ))}
                      </div>
                      <div className="font-bold text-sm text-slate-800 dark:text-slate-100">
                        {t.name}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        {t.role} &bull; {t.company}
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-300 italic mt-1 line-clamp-2">
                        &ldquo;{t.content}&rdquo;
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 self-end sm:self-auto shrink-0">
                    <button
                      type="button"
                      onClick={() => handleEdit(t)}
                      className="neu-button p-2 rounded-xl text-blue-600 hover:text-blue-700"
                      title="Edit"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(t.id)}
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
