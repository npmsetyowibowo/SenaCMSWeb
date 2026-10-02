'use client';

import React, { useEffect, useState } from 'react';
import { HelpCircle, Plus, Edit, Trash2, Loader2 } from 'lucide-react';
import { useToast } from '@/components/Toast';

export default function FaqAdminPage() {
  const { success, error } = useToast();
  const [faqs, setFaqs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    question: '',
    answer: '',
    category: 'Umum',
    order_index: 1,
  });

  const fetchFaqs = async () => {
    try {
      const res = await fetch('/api/faq');
      const data = await res.json();
      setFaqs(data || []);
    } catch {
      error('Gagal memuat FAQ');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFaqs();
  }, []);

  const handleEdit = (f: any) => {
    setEditingId(f.id);
    setFormData({
      question: f.question,
      answer: f.answer,
      category: f.category || 'Umum',
      order_index: f.order_index || 1,
    });
  };

  const handleReset = () => {
    setEditingId(null);
    setFormData({
      question: '',
      answer: '',
      category: 'Umum',
      order_index: faqs.length + 1,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.question || !formData.answer) return error('Pertanyaan dan jawaban wajib diisi');

    setSaving(true);
    try {
      if (editingId) {
        const res = await fetch(`/api/faq/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
        if (!res.ok) throw new Error('Gagal update FAQ');
        success('FAQ berhasil diperbarui');
      } else {
        const res = await fetch('/api/faq', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
        if (!res.ok) throw new Error('Gagal menambah FAQ');
        success('FAQ baru berhasil ditambahkan');
      }
      handleReset();
      fetchFaqs();
    } catch (err: any) {
      error(err.message || 'Gagal menyimpan');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Yakin ingin menghapus pertanyaan FAQ ini?')) return;
    try {
      const res = await fetch(`/api/faq/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Gagal');
      success('FAQ berhasil dihapus');
      fetchFaqs();
    } catch (err: any) {
      error(err.message || 'Gagal menghapus');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-800 dark:text-slate-100 flex items-center gap-2">
          <HelpCircle className="w-6 h-6 text-amber-500" />
          <span>Manajemen Tanya Jawab (FAQ)</span>
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Kelola daftar pertanyaan yang sering diajukan untuk meningkatkan konversi dan keyakinan calon klien.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Form Add / Edit */}
        <div className="lg:col-span-5 neu-flat p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 space-y-4">
          <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100">
            {editingId ? 'Edit FAQ' : 'Tambah FAQ Baru'}
          </h3>

          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Pertanyaan *
              </label>
              <input
                type="text"
                placeholder="Contoh: Berapa lama pembuatan website?"
                value={formData.question}
                onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                className="w-full neu-pressed px-3 py-2 text-xs rounded-xl outline-none text-slate-800 dark:text-slate-100"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Kategori
                </label>
                <input
                  type="text"
                  placeholder="Umum / Biaya / SEO"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full neu-pressed px-3 py-2 text-xs rounded-xl outline-none text-slate-800 dark:text-slate-100"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Nomor Urut Tampil
                </label>
                <input
                  type="number"
                  value={formData.order_index}
                  onChange={(e) => setFormData({ ...formData, order_index: parseInt(e.target.value, 10) || 1 })}
                  className="w-full neu-pressed px-3 py-2 text-xs rounded-xl outline-none text-slate-800 dark:text-slate-100"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Jawaban Lengkap *
              </label>
              <textarea
                rows={4}
                placeholder="Jelaskan jawaban secara ringkas, jelas, dan meyakinkan..."
                value={formData.answer}
                onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
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
                <span>{editingId ? 'Simpan Perubahan' : 'Tambah Pertanyaan'}</span>
              </button>
            </div>
          </form>
        </div>

        {/* List of FAQs */}
        <div className="lg:col-span-7 neu-flat rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 space-y-4">
          <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100">
            Daftar Pertanyaan ({faqs.length})
          </h3>

          {loading ? (
            <div className="py-12 flex justify-center text-xs text-slate-400">
              <Loader2 className="w-6 h-6 animate-spin text-amber-500" />
            </div>
          ) : (
            <div className="space-y-3">
              {faqs.map((f, idx) => (
                <div
                  key={f.id}
                  className="p-4 rounded-2xl neu-flat-xs border border-slate-200/60 dark:border-slate-800 flex items-start justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-[10px] font-bold text-amber-600 dark:text-amber-400 uppercase">
                      <span>Urutan #{f.order_index || idx + 1}</span>
                      <span>&bull;</span>
                      <span>{f.category}</span>
                    </div>
                    <h4 className="font-bold text-sm text-slate-800 dark:text-slate-100">
                      {f.question}
                    </h4>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mt-1">
                      {f.answer}
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleEdit(f)}
                      className="neu-button p-2 rounded-xl text-blue-600 hover:text-blue-700"
                      title="Edit"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(f.id)}
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
