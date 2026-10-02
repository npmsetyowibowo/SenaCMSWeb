'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  MapPin,
  Plus,
  Search,
  ExternalLink,
  Edit3,
  Trash2,
  HelpCircle,
  Sparkles,
  Loader2,
  Globe,
  Tag,
} from 'lucide-react';
import { useToast } from '@/components/Toast';

export default function CitiesManagementPage() {
  const { success, error } = useToast();
  const [cities, setCities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchCities = async () => {
    try {
      const res = await fetch('/api/cities');
      if (res.ok) {
        const data = await res.json();
        setCities(Array.isArray(data) ? data : []);
      }
    } catch {
      error('Gagal memuat data kota layanan');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCities();
  }, []);

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/cities/${deleteId}`, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Gagal menghapus');
      success('Halaman kota layanan berhasil dihapus!');
      setDeleteId(null);
      fetchCities();
    } catch (err: any) {
      error(err.message || 'Gagal menghapus');
    } finally {
      setDeleting(false);
    }
  };

  const filtered = cities.filter((c) => {
    const q = search.toLowerCase();
    return (
      c.city_name?.toLowerCase().includes(q) ||
      c.province_name?.toLowerCase().includes(q) ||
      c.slug?.toLowerCase().includes(q) ||
      c.hero_title?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6 pb-16">
      {/* Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <MapPin className="w-6 h-6 text-rose-500" />
            <span>Manajemen Halaman Khusus Kota Layanan</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Kelola landing page SEO per kota, edit bubble judul kecil, dan kustomisasi FAQ khusus setiap kota.
          </p>
        </div>

        <Link
          href="/senacms/cities/new"
          className="neu-accent-btn px-4 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Kota Layanan Baru</span>
        </Link>
      </div>

      {/* Search & Info Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari nama kota, provinsi, atau slug..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full neu-pressed pl-9 pr-4 py-2 text-xs rounded-xl outline-none text-slate-800 dark:text-slate-100"
          />
        </div>

        <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">
          Total: <span className="text-blue-600 font-bold">{filtered.length}</span> Kota Layanan Aktif
        </div>
      </div>

      {/* Cities Table / Grid */}
      {loading ? (
        <div className="py-24 flex justify-center text-xs text-slate-400">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="neu-flat p-12 rounded-3xl text-center border border-slate-200/80 dark:border-slate-800 space-y-3">
          <div className="w-12 h-12 rounded-2xl neu-flat flex items-center justify-center text-slate-400 mx-auto">
            <MapPin className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-sm text-slate-800 dark:text-slate-200">
            Belum ada kota layanan yang sesuai
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Mulai tambahkan halaman kota seperti Surabaya, Sidoarjo, Malang, Bandung untuk mendominasi ranking pencarian Google lokal!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((city) => {
            const faqCount = Array.isArray(city.faqs) ? city.faqs.length : 0;
            return (
              <div
                key={city.id}
                className="neu-flat p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 flex flex-col justify-between space-y-4 hover:border-blue-300 dark:hover:border-blue-900 transition-colors"
              >
                <div className="space-y-3">
                  {/* Top Badges */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg neu-pressed-sm text-[11px] font-bold text-blue-600 dark:text-blue-400">
                      <MapPin className="w-3 h-3 text-rose-500" />
                      {city.city_name}, {city.province_name}
                    </span>

                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        city.status === 'published'
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                          : 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300'
                      }`}
                    >
                      {city.status === 'published' ? 'Published' : 'Draft'}
                    </span>
                  </div>

                  {/* Hero Title */}
                  <div>
                    <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100 line-clamp-2">
                      {city.hero_title}
                    </h3>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 mt-1">
                      {city.hero_subtitle}
                    </p>
                  </div>

                  {/* Bubble Kecil / Judul Kecil Badge */}
                  <div className="p-2.5 rounded-xl neu-pressed-sm bg-slate-50/50 dark:bg-slate-900/40 border border-slate-200/60 dark:border-slate-800">
                    <div className="text-[10px] text-slate-400 font-semibold mb-0.5 flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-blue-500" />
                      <span>Bubble Kecil (Judul Atas):</span>
                    </div>
                    <div className="text-xs font-semibold text-slate-700 dark:text-slate-200 truncate">
                      {city.badge_text || `Pusat Layanan Web Resmi Wilayah ${city.city_name}`}
                    </div>
                  </div>

                  {/* Metadata Chips: FAQ & URL */}
                  <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400">
                    <span className="flex items-center gap-1">
                      <HelpCircle className="w-3.5 h-3.5 text-purple-500" />
                      <strong className="text-slate-700 dark:text-slate-200">{faqCount}</strong> FAQ Khusus
                    </span>
                    <span>•</span>
                    <span className="font-mono text-[10px] text-blue-600 dark:text-blue-400">
                      /{city.slug}
                    </span>
                  </div>
                </div>

                {/* Bottom Action Buttons */}
                <div className="pt-3 border-t border-slate-200/70 dark:border-slate-800 flex items-center justify-between gap-2">
                  <a
                    href={`/${city.slug}`}
                    target="_blank"
                    rel="noreferrer"
                    className="neu-button px-2.5 py-1.5 rounded-xl text-[11px] font-semibold text-slate-600 dark:text-slate-300 hover:text-blue-600 flex items-center gap-1"
                    title="Lihat Pratinjau Live"
                  >
                    <ExternalLink className="w-3 h-3" />
                    <span>Lihat Live</span>
                  </a>

                  <div className="flex items-center gap-1.5">
                    <Link
                      href={`/senacms/cities/${city.id}`}
                      className="neu-button px-3 py-1.5 rounded-xl text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Edit & FAQ</span>
                    </Link>

                    <button
                      type="button"
                      onClick={() => setDeleteId(city.id)}
                      className="neu-button p-1.5 rounded-xl text-rose-500 hover:text-rose-700"
                      title="Hapus Halaman Kota"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteId !== null && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="neu-flat p-6 rounded-2xl max-w-sm w-full border border-slate-200 dark:border-slate-800 space-y-4">
            <h4 className="font-bold text-base text-slate-800 dark:text-slate-100">
              Konfirmasi Hapus Kota Layanan
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Apakah Anda yakin ingin menghapus halaman kota ini? Halaman publik terkait tidak akan lagi dapat diakses.
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDeleteId(null)}
                className="neu-button px-4 py-2 text-xs font-bold rounded-xl"
              >
                Batal
              </button>
              <button
                type="button"
                disabled={deleting}
                onClick={handleDelete}
                className="neu-button px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl flex items-center gap-1"
              >
                {deleting && <Loader2 className="w-3 h-3 animate-spin" />}
                <span>Hapus</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
