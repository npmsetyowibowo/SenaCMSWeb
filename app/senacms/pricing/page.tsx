'use client';

import React, { useEffect, useState } from 'react';
import { DollarSign, Plus, Edit, Trash2, Loader2, Sparkles, Check } from 'lucide-react';
import { useToast } from '@/components/Toast';

export default function PricingAdminPage() {
  const { success, error } = useToast();
  const [plans, setPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    price: 'Rp750.000',
    price_numeric: 750000,
    period: 'Sekali Bayar',
    description: '',
    features: '',
    is_popular: false,
    cta_text: 'Pilih Paket Ini',
  });

  const fetchPlans = async () => {
    try {
      const res = await fetch('/api/pricing');
      const data = await res.json();
      setPlans(data || []);
    } catch {
      error('Gagal memuat paket harga');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  const handleEdit = (p: any) => {
    setEditingId(p.id);
    setFormData({
      name: p.name,
      price: p.price,
      price_numeric: p.price_numeric,
      period: p.period || 'Sekali Bayar',
      description: p.description || '',
      features: Array.isArray(p.features) ? p.features.join('\n') : p.features || '',
      is_popular: Boolean(p.is_popular),
      cta_text: p.cta_text || 'Pilih Paket',
    });
  };

  const handleReset = () => {
    setEditingId(null);
    setFormData({
      name: '',
      price: 'Rp750.000',
      price_numeric: 750000,
      period: 'Sekali Bayar',
      description: '',
      features: '',
      is_popular: false,
      cta_text: 'Pilih Paket Ini',
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.price) return error('Nama paket dan harga wajib diisi');

    setSaving(true);
    try {
      const payload = {
        ...formData,
        features: formData.features.split('\n').map((s) => s.trim()).filter(Boolean),
      };

      if (editingId) {
        const res = await fetch(`/api/pricing/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error('Gagal update paket harga');
        success('Paket harga berhasil diperbarui');
      } else {
        const res = await fetch('/api/pricing', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error('Gagal menambah paket harga');
        success('Paket harga baru berhasil ditambahkan');
      }
      handleReset();
      fetchPlans();
    } catch (err: any) {
      error(err.message || 'Gagal menyimpan');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Yakin ingin menghapus paket harga ini?')) return;
    try {
      const res = await fetch(`/api/pricing/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Gagal');
      success('Paket harga berhasil dihapus');
      fetchPlans();
    } catch (err: any) {
      error(err.message || 'Gagal menghapus');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-800 dark:text-slate-100 flex items-center gap-2">
          <DollarSign className="w-6 h-6 text-emerald-600" />
          <span>Pengaturan Paket & Harga Layanan</span>
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Ubah harga paket (Basic, Medium, Premium), fitur yang ditawarkan, dan badge terpopuler secara fleksibel tanpa perlu coding ulang.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Form Add / Edit */}
        <div className="lg:col-span-5 neu-flat p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 space-y-4">
          <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100">
            {editingId ? 'Edit Paket Harga' : 'Tambah Paket Harga Baru'}
          </h3>

          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Nama Paket *
              </label>
              <input
                type="text"
                placeholder="Contoh: Paket Basic / UMKM"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full neu-pressed px-3 py-2 text-xs rounded-xl outline-none text-slate-800 dark:text-slate-100"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Format Harga *
                </label>
                <input
                  type="text"
                  placeholder="Rp750.000"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="w-full neu-pressed px-3 py-2 text-xs rounded-xl outline-none text-slate-800 dark:text-slate-100"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Angka Urut
                </label>
                <input
                  type="number"
                  placeholder="750000"
                  value={formData.price_numeric}
                  onChange={(e) => setFormData({ ...formData, price_numeric: parseInt(e.target.value, 10) || 0 })}
                  className="w-full neu-pressed px-3 py-2 text-xs rounded-xl outline-none text-slate-800 dark:text-slate-100"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Keterangan Periode
              </label>
              <input
                type="text"
                placeholder="Sekali Bayar (Tanpa Biaya Bulanan)"
                value={formData.period}
                onChange={(e) => setFormData({ ...formData, period: e.target.value })}
                className="w-full neu-pressed px-3 py-2 text-xs rounded-xl outline-none text-slate-800 dark:text-slate-100"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Deskripsi Singkat Target Pengguna
              </label>
              <input
                type="text"
                placeholder="Cocok untuk UMKM pemula, landing page promosi..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full neu-pressed px-3 py-2 text-xs rounded-xl outline-none text-slate-800 dark:text-slate-100"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Daftar Fasilitas / Fitur (Satu baris per fitur)
              </label>
              <textarea
                rows={5}
                placeholder="Landing Page 1 Halaman Responsif&#10;Domain .my.id Gratis 1 Tahun&#10;Hosting SSD Super Cepat&#10;Integrasi WhatsApp Direct"
                value={formData.features}
                onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                className="w-full neu-pressed p-3 text-xs rounded-xl outline-none text-slate-800 dark:text-slate-100 font-mono resize-none leading-relaxed"
              />
            </div>

            <div className="flex items-center gap-2">
              <label className="flex items-center gap-2 text-xs cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={formData.is_popular}
                  onChange={(e) => setFormData({ ...formData, is_popular: e.target.checked })}
                  className="rounded w-4 h-4 accent-blue-600"
                />
                <span className="font-semibold text-slate-700 dark:text-slate-300">
                  Tandai Sebagai Paket Terpopuler (Featured Highlight)
                </span>
              </label>
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
                <span>{editingId ? 'Simpan Perubahan' : 'Tambah Paket'}</span>
              </button>
            </div>
          </form>
        </div>

        {/* List of Pricing Plans */}
        <div className="lg:col-span-7 space-y-4">
          <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100">
            Daftar Paket Aktif ({plans.length})
          </h3>

          {loading ? (
            <div className="py-12 flex justify-center text-xs text-slate-400">
              <Loader2 className="w-6 h-6 animate-spin text-emerald-500" />
            </div>
          ) : (
            <div className="space-y-4">
              {plans.map((p) => (
                <div
                  key={p.id}
                  className={`neu-flat p-5 rounded-3xl border flex flex-col justify-between gap-4 ${
                    p.is_popular
                      ? 'border-blue-500 dark:border-blue-400 shadow-md'
                      : 'border-slate-200/70 dark:border-slate-800'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/60 dark:border-slate-800 pb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-base text-slate-800 dark:text-slate-100">{p.name}</h4>
                        {p.is_popular && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">
                            Paling Populer
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">{p.description}</p>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="text-lg font-black text-slate-900 dark:text-slate-100">{p.price}</div>
                      <div className="text-[10px] text-slate-400">{p.period}</div>
                    </div>
                  </div>

                  {/* Features preview */}
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs text-slate-600 dark:text-slate-300">
                    {p.features?.map((f: string, idx: number) => (
                      <li key={idx} className="flex items-center gap-1.5">
                        <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                        <span className="truncate">{f}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200/60 dark:border-slate-800">
                    <button
                      type="button"
                      onClick={() => handleEdit(p)}
                      className="neu-button px-3 py-1.5 rounded-xl text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
                    >
                      <Edit className="w-3.5 h-3.5" />
                      <span>Edit Paket</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(p.id)}
                      className="neu-button px-3 py-1.5 rounded-xl text-xs font-semibold text-rose-600 hover:text-rose-700 flex items-center gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Hapus</span>
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
