'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  FileText,
  PlusCircle,
  Search,
  Edit,
  Trash2,
  Eye,
  Sparkles,
  Loader2,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';
import { useToast } from '@/components/Toast';

export default function ArticlesListPage() {
  const { success, error } = useToast();
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchArticles = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/articles?search=${encodeURIComponent(search)}${statusFilter !== 'all' ? `&status=${statusFilter}` : ''}`);
      const data = await res.json();
      setArticles(data.articles || []);
    } catch {
      error('Gagal memuat artikel');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, [statusFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchArticles();
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/articles/${deleteId}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Gagal menghapus');
      success('Artikel berhasil dihapus');
      setArticles(articles.filter((a) => a.id !== deleteId));
      setDeleteId(null);
    } catch (err: any) {
      error(err.message || 'Gagal menghapus');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <FileText className="w-6 h-6 text-blue-600" />
            <span>Manajemen Artikel & SEO</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Buat, edit, dan analisis optimasi SEO artikel blog secara realtime.
          </p>
        </div>

        <Link
          href="/senacms/articles/new"
          className="neu-accent-btn px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Tulis Artikel Baru</span>
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="neu-flat p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search */}
        <form onSubmit={handleSearchSubmit} className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Cari judul artikel..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full neu-pressed pl-10 pr-4 py-2 text-xs rounded-xl outline-none text-slate-800 dark:text-slate-100 placeholder:text-slate-400"
          />
        </form>

        {/* Status Filters */}
        <div className="flex items-center gap-1.5 w-full md:w-auto">
          {['all', 'published', 'draft'].map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition-all ${
                statusFilter === s
                  ? 'neu-pressed text-blue-600 dark:text-blue-400 font-bold'
                  : 'neu-button text-slate-600 dark:text-slate-300'
              }`}
            >
              {s === 'all' ? 'Semua' : s === 'published' ? 'Terbit' : 'Draft'}
            </button>
          ))}
        </div>
      </div>

      {/* Table Listing */}
      <div className="neu-flat rounded-2xl border border-slate-200/80 dark:border-slate-800 overflow-hidden">
        {loading ? (
          <div className="py-12 flex flex-col items-center justify-center gap-2 text-slate-400 text-xs">
            <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
            <span>Memuat daftar artikel...</span>
          </div>
        ) : articles.length === 0 ? (
          <div className="py-12 text-center text-slate-400 text-xs">
            Belum ada artikel yang cocok dengan pencarian Anda.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-xs text-left">
              <thead>
                <tr className="border-b border-slate-200/80 dark:border-slate-800 text-slate-400 uppercase font-semibold">
                  <th className="py-3 px-4">Artikel</th>
                  <th className="py-3 px-4">Kategori</th>
                  <th className="py-3 px-4">Focus Keyword</th>
                  <th className="py-3 px-4">Skor SEO</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Views</th>
                  <th className="py-3 px-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/60 dark:divide-slate-800/60 text-slate-700 dark:text-slate-200">
                {articles.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={item.thumbnail || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=100'}
                          alt={item.title}
                          className="w-10 h-10 rounded-lg object-cover neu-flat-xs shrink-0"
                        />
                        <div className="max-w-xs">
                          <div className="font-bold text-slate-800 dark:text-slate-100 line-clamp-1">
                            {item.title}
                          </div>
                          <div className="text-[11px] text-slate-400 truncate">
                            /{item.slug}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-md neu-flat-xs text-[11px] font-semibold text-blue-600 dark:text-blue-400">
                        {item.category?.name || 'Umum'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-500 font-mono text-[11px]">
                      {item.focus_keyword || '-'}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center gap-1 font-bold px-2 py-0.5 rounded-full text-[10px] ${
                          (item.seo_score || 0) >= 80
                            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                            : (item.seo_score || 0) >= 50
                            ? 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                            : 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                        }`}
                      >
                        <Sparkles className="w-2.5 h-2.5" />
                        {item.seo_score || 0}/100
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          item.status === 'published'
                            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                            : 'bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-500">{item.views || 0}</td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {item.status === 'published' && (
                          <Link
                            href={`/blog/${item.slug}`}
                            target="_blank"
                            className="neu-button p-1.5 rounded-lg text-slate-600 hover:text-blue-600"
                            title="Lihat di Web Publik"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </Link>
                        )}
                        <Link
                          href={`/senacms/articles/${item.id}`}
                          className="neu-button p-1.5 rounded-lg text-blue-600 hover:text-blue-700"
                          title="Edit Artikel"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </Link>
                        <button
                          type="button"
                          onClick={() => setDeleteId(item.id)}
                          className="neu-button p-1.5 rounded-lg text-rose-600 hover:text-rose-700"
                          title="Hapus Artikel"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="neu-flat p-6 rounded-2xl max-w-sm w-full border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="w-10 h-10 rounded-full bg-rose-100 dark:bg-rose-950/60 text-rose-600 flex items-center justify-center mx-auto">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div className="text-center">
              <h4 className="font-bold text-base text-slate-800 dark:text-slate-100">
                Konfirmasi Hapus Artikel
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Apakah Anda yakin ingin menghapus artikel ini? Tindakan ini tidak dapat dibatalkan.
              </p>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDeleteId(null)}
                className="neu-button px-4 py-2 text-xs rounded-xl"
              >
                Batal
              </button>
              <button
                type="button"
                disabled={deleting}
                onClick={confirmDelete}
                className="neu-accent-btn px-4 py-2 text-xs rounded-xl font-bold bg-rose-600 text-white flex items-center gap-1.5"
              >
                {deleting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                <span>Ya, Hapus</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
