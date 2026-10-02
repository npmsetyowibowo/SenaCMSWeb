'use client';

import React, { useEffect, useState } from 'react';
import { Inbox, MessageCircle, CheckCircle, Trash2, Loader2, Phone, Mail, Clock } from 'lucide-react';
import { useToast } from '@/components/Toast';

export default function InquiriesAdminPage() {
  const { success, error } = useToast();
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  const fetchInquiries = async () => {
    try {
      const res = await fetch('/api/inquiries');
      const data = await res.json();
      setInquiries(data || []);
    } catch {
      error('Gagal memuat konsultasi');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInquiries();
  }, []);

  const updateStatus = async (id: number, status: string) => {
    try {
      const res = await fetch(`/api/inquiries/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error('Gagal update status');
      success(`Status diperbarui menjadi: ${status}`);
      setInquiries(inquiries.map((i) => (i.id === id ? { ...i, status } : i)));
    } catch (err: any) {
      error(err.message || 'Gagal update status');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Hapus data pesan konsultasi ini?')) return;
    try {
      const res = await fetch(`/api/inquiries/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Gagal menghapus');
      success('Pesan konsultasi dihapus');
      setInquiries(inquiries.filter((i) => i.id !== id));
    } catch (err: any) {
      error(err.message || 'Gagal');
    }
  };

  const filtered = inquiries.filter((i) => {
    if (filter === 'all') return true;
    return i.status === filter;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <Inbox className="w-6 h-6 text-emerald-600" />
            <span>Pesan Masuk & Prospek Konsultasi</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Daftar calon klien yang mengirimkan formulir dari website publik atau landing page kota.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 self-start sm:self-auto">
          {['all', 'unread', 'read', 'contacted'].map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setFilter(s)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition-all ${
                filter === s
                  ? 'neu-pressed text-blue-600 dark:text-blue-400 font-bold'
                  : 'neu-button text-slate-600 dark:text-slate-300'
              }`}
            >
              {s === 'all' ? `Semua (${inquiries.length})` : s}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="py-16 flex justify-center text-xs text-slate-400">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="neu-flat p-12 rounded-3xl text-center border border-slate-200/80 dark:border-slate-800 text-xs text-slate-400">
          Tidak ada pesan konsultasi dalam kategori ini.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filtered.map((item) => (
            <div
              key={item.id}
              className={`neu-flat p-6 rounded-3xl border flex flex-col justify-between space-y-4 ${
                item.status === 'unread'
                  ? 'border-emerald-500/80 shadow-md'
                  : 'border-slate-200/70 dark:border-slate-800'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-bold text-base text-slate-800 dark:text-slate-100">{item.name}</h3>
                    <div className="flex items-center gap-3 text-xs text-slate-400 mt-0.5">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(item.created_at).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                      <span>•</span>
                      <span className="font-semibold text-blue-600 dark:text-blue-400">
                        {item.service}
                      </span>
                    </div>
                  </div>

                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                      item.status === 'unread'
                        ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300 animate-pulse'
                        : item.status === 'contacted'
                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                        : 'bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                    }`}
                  >
                    {item.status}
                  </span>
                </div>

                <div className="neu-pressed-sm p-3.5 rounded-2xl text-xs space-y-1.5">
                  <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                    <Phone className="w-3.5 h-3.5 text-emerald-500" />
                    <span className="font-semibold">{item.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                    <Mail className="w-3.5 h-3.5 text-blue-500" />
                    <span>{item.email}</span>
                  </div>
                  {item.budget && (
                    <div className="text-[11px] text-slate-500">
                      Estimasi Budget: <strong className="text-slate-700 dark:text-slate-200">{item.budget}</strong>
                    </div>
                  )}
                </div>

                <div className="text-xs text-slate-600 dark:text-slate-300 bg-white/40 dark:bg-slate-900/30 p-3 rounded-xl border border-slate-200/50 dark:border-slate-800 leading-relaxed">
                  <span className="font-semibold text-slate-400 block text-[10px] uppercase mb-0.5">Pesan Klien:</span>
                  {item.message}
                </div>
              </div>

              {/* Actions Footer */}
              <div className="flex items-center justify-between gap-2 pt-3 border-t border-slate-200/60 dark:border-slate-800">
                <div className="flex items-center gap-1.5">
                  {item.status !== 'contacted' && (
                    <button
                      type="button"
                      onClick={() => updateStatus(item.id, 'contacted')}
                      className="neu-button px-2.5 py-1.5 rounded-lg text-xs font-semibold text-emerald-600 hover:text-emerald-700"
                    >
                      Tandai Sudah Dihubungi
                    </button>
                  )}
                  {item.status === 'unread' && (
                    <button
                      type="button"
                      onClick={() => updateStatus(item.id, 'read')}
                      className="neu-button px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-600"
                    >
                      Tandai Dibaca
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-1.5">
                  <a
                    href={`https://wa.me/${item.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                      `Halo Bpk/Ibu ${item.name}, kami dari SenaWeb ingin mengonfirmasi konsultasi pembuatan website Anda mengenai "${item.service}".`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="neu-accent-btn px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 bg-emerald-600"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>Chat WhatsApp</span>
                  </a>
                  <button
                    type="button"
                    onClick={() => handleDelete(item.id)}
                    className="neu-button p-2 rounded-xl text-rose-600 hover:text-rose-700"
                    title="Hapus"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
