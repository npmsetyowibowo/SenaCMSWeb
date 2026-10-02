'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Briefcase,
  Search,
  ExternalLink,
  Sparkles,
  ArrowRight,
  Filter,
  CheckCircle,
  MessageCircle,
} from 'lucide-react';
import { Portfolio } from '@/lib/db/types';

interface PortfolioClientViewProps {
  initialPortfolio: Portfolio[];
  whatsappNumber?: string;
}

export function PortfolioClientView({
  initialPortfolio,
  whatsappNumber = '6281234567890',
}: PortfolioClientViewProps) {
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  const [search, setSearch] = useState('');

  // Extract categories dynamically
  const categories = ['Semua', ...Array.from(new Set(initialPortfolio.map((p) => p.category)))];

  const filtered = initialPortfolio.filter((item) => {
    const matchesCategory = selectedCategory === 'Semua' || item.category === selectedCategory;
    const q = search.toLowerCase();
    const matchesSearch =
      item.title.toLowerCase().includes(q) ||
      item.client.toLowerCase().includes(q) ||
      item.description.toLowerCase().includes(q) ||
      item.tech_stack.some((t) => t.toLowerCase().includes(q));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="py-12 sm:py-20 space-y-16">
      {/* Hero Header */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
        {/* Bubble Kecil */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full neu-flat-xs text-xs sm:text-sm font-semibold text-blue-700 dark:text-blue-300">
          <Sparkles className="w-4 h-4 text-blue-600 animate-spin-slow" />
          <span>KARYA & STUDI KASUS PROYEK NYATA</span>
        </div>

        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
          Portfolio Pembuatan Website{' '}
          <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Terbaik Kami
          </span>
        </h1>

        <p className="text-sm sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
          Koleksi proyek website profesional yang telah kami bangun dengan estetika Neumorphic modern, performa tinggi, dan optimasi SEO terdepan.
        </p>

        {/* Filter and Search Toolbar */}
        <div className="pt-6 max-w-3xl mx-auto flex flex-col sm:flex-row items-center gap-4 justify-between">
          {/* Category Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 neu-flat-xs p-1.5 rounded-2xl w-full sm:w-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  selectedCategory === cat
                    ? 'neu-pressed text-blue-600 dark:text-blue-400 font-extrabold border border-blue-400/40'
                    : 'text-slate-600 dark:text-slate-300 hover:text-blue-600'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari proyek atau teknologi..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full neu-pressed pl-9 pr-4 py-2 text-xs rounded-xl outline-none text-slate-800 dark:text-slate-100"
            />
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {filtered.length === 0 ? (
          <div className="neu-flat p-12 rounded-3xl text-center border border-slate-200/80 dark:border-slate-800 space-y-3">
            <div className="w-12 h-12 rounded-2xl neu-flat flex items-center justify-center text-slate-400 mx-auto">
              <Briefcase className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-sm text-slate-800 dark:text-slate-200">
              Tidak ada proyek yang sesuai dengan kriteria
            </h3>
            <p className="text-xs text-slate-500">
              Coba ganti filter kategori atau kata kunci pencarian Anda.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map((item) => (
              <div
                key={item.id}
                className="neu-flat rounded-3xl overflow-hidden border border-slate-200/80 dark:border-slate-800 flex flex-col justify-between group hover:scale-[1.01] transition-transform"
              >
                <div>
                  {/* Thumbnail Banner */}
                  <div className="relative aspect-[16/10] overflow-hidden bg-slate-200 dark:bg-slate-800">
                    <img
                      src={item.thumbnail}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="px-3 py-1 rounded-full neu-flat-xs text-[10px] font-extrabold uppercase tracking-wider text-blue-700 dark:text-blue-300 bg-[#eef2f6]/90 dark:bg-[#121824]/90 backdrop-blur-sm">
                        {item.category}
                      </span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-6 space-y-3">
                    <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      Klien: {item.client}
                    </div>

                    <h3 className="font-black text-lg text-slate-900 dark:text-slate-100 group-hover:text-blue-600 transition-colors">
                      {item.title}
                    </h3>

                    <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-3 leading-relaxed">
                      {item.description}
                    </p>

                    {/* Tech Stack Chips */}
                    <div className="pt-2 flex flex-wrap gap-1.5">
                      {item.tech_stack.map((t, idx) => (
                        <span
                          key={idx}
                          className="neu-pressed-sm px-2.5 py-0.5 rounded-lg text-[10px] font-semibold text-slate-600 dark:text-slate-300"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="p-6 pt-0 border-t border-slate-200/60 dark:border-slate-800/80 mt-4 flex items-center justify-between gap-3">
                  <Link
                    href={`/portfolio/${item.slug}`}
                    className="neu-button px-3.5 py-2 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 hover:text-blue-600 flex items-center gap-1.5"
                  >
                    <span>Detail Studi Kasus</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>

                  {item.url && (
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="neu-button p-2 rounded-xl text-blue-600 hover:text-blue-700"
                      title="Kunjungi Website Langsung"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Bottom CTA Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="neu-flat p-8 sm:p-14 rounded-3xl border border-slate-200/80 dark:border-slate-800 text-center space-y-5">
          <div className="w-12 h-12 rounded-2xl neu-flat flex items-center justify-center text-blue-600 mx-auto">
            <Sparkles className="w-6 h-6" />
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-slate-100">
            Ingin Website Bisnis Anda Masuk Portfolio Kami?
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-xl mx-auto">
            Wujudkan website profesional berkecepatan kilat dan ramah SEO bersama tim SenaWeb. Konsultasi kebutuhan web Anda sekarang secara gratis.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href={`https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                'Halo SenaWeb, saya telah melihat portfolio Anda dan ingin konsultasi pembuatan website bisnis saya.'
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="neu-accent-btn px-8 py-3.5 rounded-2xl font-bold text-sm flex items-center gap-2 shadow-lg"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Konsultasi Proyek Sekarang</span>
            </a>
            <Link
              href="/paket"
              className="neu-button px-7 py-3.5 rounded-2xl text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-200"
            >
              Lihat Paket Harga
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
