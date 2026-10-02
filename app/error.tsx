'use client';

import React from 'react';
import Link from 'next/link';
import { AlertTriangle, RotateCcw, Home } from 'lucide-react';

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16">
      <div className="neu-flat p-8 sm:p-12 rounded-3xl max-w-md w-full text-center border border-slate-200/80 dark:border-slate-800 space-y-4">
        <div className="w-16 h-16 rounded-2xl neu-flat flex items-center justify-center text-rose-600 mx-auto">
          <AlertTriangle className="w-8 h-8" />
        </div>
        <div className="text-3xl font-black text-slate-800 dark:text-slate-100">500</div>
        <h1 className="text-lg font-bold text-slate-800 dark:text-slate-100">
          Terjadi Gangguan Sistem
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
          {error.message || 'Maaf, terjadi kendala saat memproses permintaan Anda. Silakan coba muat ulang.'}
        </p>
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={() => reset()}
            className="w-full sm:w-auto neu-accent-btn px-5 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Coba Lagi</span>
          </button>
          <Link
            href="/"
            className="w-full sm:w-auto neu-button px-5 py-2.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center justify-center gap-1.5"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Ke Beranda</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
