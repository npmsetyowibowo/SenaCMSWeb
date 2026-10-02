'use client';

import React, { useEffect, useState } from 'react';
import { UserCheck, Lock, Save, Loader2, ShieldAlert, Sparkles } from 'lucide-react';
import { useToast } from '@/components/Toast';

export default function UsersAdminPage() {
  const { success, error } = useToast();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    avatar_url: '',
    current_password: '',
    new_password: '',
    confirm_password: '',
  });

  const fetchProfile = async () => {
    try {
      const res = await fetch('/api/users');
      const data = await res.json();
      setProfile(data);
      setFormData((prev) => ({
        ...prev,
        full_name: data.full_name || '',
        email: data.email || '',
        avatar_url: data.avatar_url || '',
      }));
    } catch {
      error('Gagal memuat profil');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.new_password) {
      if (formData.new_password !== formData.confirm_password) {
        return error('Konfirmasi password baru tidak cocok');
      }
      if (!formData.current_password) {
        return error('Password saat ini wajib diisi');
      }
    }

    setSaving(true);
    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Gagal update');

      success('Profil dan kata sandi berhasil diperbarui!');
      setFormData((prev) => ({
        ...prev,
        current_password: '',
        new_password: '',
        confirm_password: '',
      }));
      fetchProfile();
    } catch (err: any) {
      error(err.message || 'Gagal update profil');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="py-24 flex justify-center text-xs text-slate-400">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl pb-16">
      <div>
        <h1 className="text-2xl font-black text-slate-800 dark:text-slate-100 flex items-center gap-2">
          <UserCheck className="w-6 h-6 text-blue-600" />
          <span>Pengaturan Akun & Ganti Password Admin</span>
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Ubah nama administrator, email, foto profil, dan ganti kata sandi default agar website aman.
        </p>
      </div>

      {/* Production Warning Notice */}
      <div className="neu-flat p-4 rounded-2xl border border-amber-200/80 dark:border-amber-900/40 bg-amber-50/50 dark:bg-amber-950/20 text-xs flex items-start gap-3 text-amber-800 dark:text-amber-200">
        <ShieldAlert className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
        <div>
          <div className="font-bold">Keamanan Kredensial Produksi:</div>
          <p className="text-[11px] text-amber-700/80 dark:text-amber-300/80 mt-0.5">
            Kredensial development bawaan adalah <strong>admin / admin</strong>. Sangat disarankan untuk segera mengganti kata sandi sebelum website dideploy ke domain publik production.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="neu-flat p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 space-y-6">
        {/* Profile Details */}
        <div className="space-y-4">
          <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100 border-b border-slate-200/60 dark:border-slate-800 pb-2">
            Informasi Profil Administrator
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Username (Tetap)
              </label>
              <input
                type="text"
                disabled
                value={profile?.username || 'admin'}
                className="w-full neu-pressed-sm px-3.5 py-2.5 text-xs rounded-xl outline-none text-slate-400 font-mono bg-slate-100 dark:bg-slate-800 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Nama Lengkap
              </label>
              <input
                type="text"
                value={formData.full_name}
                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                className="w-full neu-pressed px-3.5 py-2.5 text-xs rounded-xl outline-none text-slate-800 dark:text-slate-100"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Email Administrator
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full neu-pressed px-3.5 py-2.5 text-xs rounded-xl outline-none text-slate-800 dark:text-slate-100"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                URL Avatar Profil
              </label>
              <input
                type="text"
                value={formData.avatar_url}
                onChange={(e) => setFormData({ ...formData, avatar_url: e.target.value })}
                className="w-full neu-pressed px-3.5 py-2.5 text-xs rounded-xl outline-none text-slate-800 dark:text-slate-100"
              />
            </div>
          </div>
        </div>

        {/* Password Changing */}
        <div className="space-y-4 pt-4 border-t border-slate-200/60 dark:border-slate-800">
          <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <Lock className="w-4 h-4 text-blue-500" />
            <span>Ganti Kata Sandi (Password)</span>
          </h3>
          <p className="text-xs text-slate-400">
            Biarkan kosong jika tidak ingin mengubah kata sandi saat ini.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Password Saat Ini
              </label>
              <input
                type="password"
                placeholder="Password lama"
                value={formData.current_password}
                onChange={(e) => setFormData({ ...formData, current_password: e.target.value })}
                className="w-full neu-pressed px-3.5 py-2.5 text-xs rounded-xl outline-none text-slate-800 dark:text-slate-100"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Password Baru
              </label>
              <input
                type="password"
                placeholder="Minimal 5 karakter"
                value={formData.new_password}
                onChange={(e) => setFormData({ ...formData, new_password: e.target.value })}
                className="w-full neu-pressed px-3.5 py-2.5 text-xs rounded-xl outline-none text-slate-800 dark:text-slate-100"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Konfirmasi Password Baru
              </label>
              <input
                type="password"
                placeholder="Ulangi password baru"
                value={formData.confirm_password}
                onChange={(e) => setFormData({ ...formData, confirm_password: e.target.value })}
                className="w-full neu-pressed px-3.5 py-2.5 text-xs rounded-xl outline-none text-slate-800 dark:text-slate-100"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={saving}
            className="neu-accent-btn px-6 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-1.5 shadow-md"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>Simpan Perubahan Akun</span>
          </button>
        </div>
      </form>
    </div>
  );
}
