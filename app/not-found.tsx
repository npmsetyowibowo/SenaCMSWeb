import React from 'react';
import Link from 'next/link';
import { FileQuestion, Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16">
      <div className="neu-flat p-8 sm:p-12 rounded-3xl max-w-md w-full text-center border border-slate-200/80 dark:border-slate-800 space-y-4">
        <div className="w-16 h-16 rounded-2xl neu-flat flex items-center justify-center text-blue-600 dark:text-blue-400 mx-auto">
          <FileQuestion className="w-8 h-8" />
        </div>
        <div className="text-4xl font-black text-slate-800 dark:text-slate-100">404</div>
        <h1 className="text-lg font-bold text-slate-800 dark:text-slate-100">
          Halaman Tidak Ditemukan
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
          Mohon maaf, halaman atau artikel yang Anda cari tidak tersedia, telah dipindahkan, atau alamat URL salah ketik.
        </p>
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/"
            className="w-full sm:w-auto neu-accent-btn px-5 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Ke Beranda</span>
          </Link>
          <Link
            href="/blog"
            className="w-full sm:w-auto neu-button px-5 py-2.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center justify-center gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Lihat Blog</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
