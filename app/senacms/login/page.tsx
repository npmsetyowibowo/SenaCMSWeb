'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ShieldCheck, Lock, User, ArrowRight, Loader2, Sparkles, AlertCircle } from 'lucide-react';
import { useToast } from '@/components/Toast';

export default function AdminLoginPage() {
  const router = useRouter();
  const { success, error } = useToast();
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin');
  const [loading, setLoading] = useState(false);
  const [errMessage, setErrMessage] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrMessage('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Login gagal');
      }

      success(`Selamat datang kembali, ${data.user.full_name}!`, 'Login Berhasil');
      router.push('/senacms/dashboard');
      router.refresh();
    } catch (err: any) {
      setErrMessage(err.message || 'Username atau password tidak cocok');
      error(err.message || 'Login gagal', 'Autentikasi Ditolak');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="neu-flat p-8 sm:p-10 rounded-3xl border border-slate-200/80 dark:border-slate-800 space-y-6">
          {/* Logo & Header */}
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-2xl neu-flat flex items-center justify-center text-blue-600 dark:text-blue-400 mx-auto shadow-sm">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <h1 className="text-2xl font-black text-slate-800 dark:text-slate-100 tracking-tight">
              SenaCMS Portal
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Sistem Manajemen Konten Resmi <strong>SenaWeb</strong>
            </p>
          </div>

          {/* Dev Demo Notice */}
          <div className="p-3.5 rounded-2xl neu-pressed-sm border border-blue-200/60 dark:border-blue-900/40 text-xs text-slate-600 dark:text-slate-300 space-y-1">
            <div className="font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Development Credentials</span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Username: <strong className="text-slate-700 dark:text-slate-200">admin</strong> &bull; Password:{' '}
              <strong className="text-slate-700 dark:text-slate-200">admin</strong>
            </p>
          </div>

          {errMessage && (
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-xs text-rose-600 dark:text-rose-400 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errMessage}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Username Administrator
              </label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="admin"
                  className="w-full neu-pressed pl-10 pr-3.5 py-3 text-xs sm:text-sm rounded-xl outline-none text-slate-800 dark:text-slate-100"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Kata Sandi
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full neu-pressed pl-10 pr-3.5 py-3 text-xs sm:text-sm rounded-xl outline-none text-slate-800 dark:text-slate-100"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full neu-accent-btn py-3.5 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all disabled:opacity-60 cursor-pointer shadow-md mt-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Memverifikasi Sesi...</span>
                </>
              ) : (
                <>
                  <span>Masuk ke Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="text-center pt-2">
            <Link
              href="/"
              className="text-xs font-semibold text-slate-500 hover:text-blue-600 transition-colors"
            >
              &larr; Kembali ke Website Publik
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
