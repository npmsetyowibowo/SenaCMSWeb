'use client';

import React, { useMemo, useState } from 'react';
import {
  Sparkles,
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  Smartphone,
  Monitor,
  Search,
  Gauge,
  Sliders,
  FileText,
  KeyRound,
  BookOpen,
  Link2,
  Image as ImageIcon,
} from 'lucide-react';
import { analyzeSeo, SeoAnalysisResult } from '@/lib/seo-analyzer';

interface SeoAnalyzerPanelProps {
  title: string;
  slug: string;
  content: string;
  seoTitle: string;
  seoDescription: string;
  focusKeyword: string;
  onUpdateSeoTitle: (val: string) => void;
  onUpdateSeoDescription: (val: string) => void;
  onUpdateFocusKeyword: (val: string) => void;
  onScoreCalculated?: (score: number) => void;
}

export function SeoAnalyzerPanel({
  title,
  slug,
  content,
  seoTitle,
  seoDescription,
  focusKeyword,
  onUpdateSeoTitle,
  onUpdateSeoDescription,
  onUpdateFocusKeyword,
  onScoreCalculated,
}: SeoAnalyzerPanelProps) {
  const [previewTab, setPreviewTab] = useState<'mobile' | 'desktop'>('mobile');
  const [activeListTab, setActiveListTab] = useState<'all' | 'problems' | 'improvements' | 'good'>('all');

  const analysis: SeoAnalysisResult = useMemo(() => {
    const result = analyzeSeo({
      title,
      slug,
      content,
      seoTitle,
      seoDescription,
      focusKeyword,
    });
    if (onScoreCalculated) {
      onScoreCalculated(result.score);
    }
    return result;
  }, [title, slug, content, seoTitle, seoDescription, focusKeyword, onScoreCalculated]);

  const scoreColor =
    analysis.score >= 80
      ? 'text-emerald-500 border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40'
      : analysis.score >= 50
      ? 'text-amber-500 border-amber-500 bg-amber-50 dark:bg-amber-950/40'
      : 'text-rose-500 border-rose-500 bg-rose-50 dark:bg-rose-950/40';

  const previewDisplayTitle = (seoTitle || title || 'Judul Halaman Belum Diatur').slice(0, 70);
  const previewDisplayDesc = (seoDescription || 'Deskripsi penelusuran belum diatur. Tambahkan meta description untuk menarik klik pembaca dari Google.').slice(0, 160);

  return (
    <div className="space-y-6">
      {/* Top Card: Score & Category Breakdown */}
      <div className="neu-flat p-5 sm:p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pb-6 border-b border-slate-200/70 dark:border-slate-800">
          <div className="flex items-center gap-4">
            {/* Score Ring */}
            <div className={`w-20 h-20 rounded-full border-4 flex flex-col items-center justify-center shrink-0 ${scoreColor} shadow-inner`}>
              <span className="text-2xl font-black">{analysis.score}</span>
              <span className="text-[10px] font-bold uppercase tracking-wider">/ 100</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300">
                  Realtime Yoast-Style
                </span>
                <span className="text-xs text-slate-400">Score Status:</span>
                <span
                  className={`text-xs font-bold ${
                    analysis.score >= 80 ? 'text-emerald-600' : analysis.score >= 50 ? 'text-amber-600' : 'text-rose-600'
                  }`}
                >
                  {analysis.rating}
                </span>
              </div>
              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mt-0.5">
                SenaWeb Realtime SEO Analyzer
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Skor dihitung otomatis berdasarkan 6 pilar bobot SEO on-page & keterbacaan.
              </p>
            </div>
          </div>

          {/* Quick Metrics Pills */}
          <div className="grid grid-cols-3 gap-2 w-full sm:w-auto">
            <div className="neu-pressed-sm p-2 rounded-xl text-center">
              <div className="text-[11px] text-slate-400">Kata</div>
              <div className="text-sm font-bold text-slate-800 dark:text-slate-100">{analysis.metrics.wordCount}</div>
            </div>
            <div className="neu-pressed-sm p-2 rounded-xl text-center">
              <div className="text-[11px] text-slate-400">Densitas</div>
              <div className="text-sm font-bold text-slate-800 dark:text-slate-100">{analysis.metrics.keywordDensityPercent}%</div>
            </div>
            <div className="neu-pressed-sm p-2 rounded-xl text-center">
              <div className="text-[11px] text-slate-400">Waktu Baca</div>
              <div className="text-sm font-bold text-slate-800 dark:text-slate-100">{analysis.metrics.readingTimeMinutes} mnt</div>
            </div>
          </div>
        </div>

        {/* 6 Category Progress Bars */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 pt-5">
          {/* 1. Technical (Max 20) */}
          <div className="p-3 rounded-2xl neu-flat-xs space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                <Sliders className="w-3 h-3 text-blue-500" /> Teknis
              </span>
              <span className="font-bold text-blue-600 dark:text-blue-400">{analysis.breakdown.technicalSeo}/20</span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
              <div
                className="h-full bg-blue-500 transition-all duration-300"
                style={{ width: `${(analysis.breakdown.technicalSeo / 20) * 100}%` }}
              />
            </div>
          </div>

          {/* 2. Content SEO (Max 25) */}
          <div className="p-3 rounded-2xl neu-flat-xs space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                <FileText className="w-3 h-3 text-emerald-500" /> Konten
              </span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400">{analysis.breakdown.contentSeo}/25</span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
              <div
                className="h-full bg-emerald-500 transition-all duration-300"
                style={{ width: `${(analysis.breakdown.contentSeo / 25) * 100}%` }}
              />
            </div>
          </div>

          {/* 3. Keyword (Max 20) */}
          <div className="p-3 rounded-2xl neu-flat-xs space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                <KeyRound className="w-3 h-3 text-purple-500" /> Keyword
              </span>
              <span className="font-bold text-purple-600 dark:text-purple-400">{analysis.breakdown.keywordOptimization}/20</span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
              <div
                className="h-full bg-purple-500 transition-all duration-300"
                style={{ width: `${(analysis.breakdown.keywordOptimization / 20) * 100}%` }}
              />
            </div>
          </div>

          {/* 4. Readability (Max 15) */}
          <div className="p-3 rounded-2xl neu-flat-xs space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                <BookOpen className="w-3 h-3 text-amber-500" /> Keterbacaan
              </span>
              <span className="font-bold text-amber-600 dark:text-amber-400">{analysis.breakdown.readability}/15</span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
              <div
                className="h-full bg-amber-500 transition-all duration-300"
                style={{ width: `${(analysis.breakdown.readability / 15) * 100}%` }}
              />
            </div>
          </div>

          {/* 5. Linking (Max 10) */}
          <div className="p-3 rounded-2xl neu-flat-xs space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                <Link2 className="w-3 h-3 text-cyan-500" /> Links
              </span>
              <span className="font-bold text-cyan-600 dark:text-cyan-400">{analysis.breakdown.internalLinking}/10</span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
              <div
                className="h-full bg-cyan-500 transition-all duration-300"
                style={{ width: `${(analysis.breakdown.internalLinking / 10) * 100}%` }}
              />
            </div>
          </div>

          {/* 6. Image SEO (Max 10) */}
          <div className="p-3 rounded-2xl neu-flat-xs space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                <ImageIcon className="w-3 h-3 text-pink-500" /> Gambar
              </span>
              <span className="font-bold text-pink-600 dark:text-pink-400">{analysis.breakdown.imageSeo}/10</span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
              <div
                className="h-full bg-pink-500 transition-all duration-300"
                style={{ width: `${(analysis.breakdown.imageSeo / 10) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Google Search Preview Realtime */}
      <div className="neu-flat p-5 sm:p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Search className="w-4 h-4 text-blue-500" />
            <h4 className="font-bold text-sm text-slate-800 dark:text-slate-100">
              Pratinjau Hasil Pencarian Google (SERP Preview)
            </h4>
          </div>
          <div className="flex items-center gap-1 p-1 rounded-xl neu-pressed-sm">
            <button
              type="button"
              onClick={() => setPreviewTab('mobile')}
              className={`px-2.5 py-1 text-xs rounded-lg flex items-center gap-1 font-semibold transition-all ${
                previewTab === 'mobile' ? 'neu-button text-blue-600 dark:text-blue-400' : 'text-slate-500'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" /> Mobile
            </button>
            <button
              type="button"
              onClick={() => setPreviewTab('desktop')}
              className={`px-2.5 py-1 text-xs rounded-lg flex items-center gap-1 font-semibold transition-all ${
                previewTab === 'desktop' ? 'neu-button text-blue-600 dark:text-blue-400' : 'text-slate-500'
              }`}
            >
              <Monitor className="w-3.5 h-3.5" /> Desktop
            </button>
          </div>
        </div>

        {/* Snippet Card */}
        <div className={`p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm ${
          previewTab === 'mobile' ? 'max-w-md' : 'w-full'
        }`}>
          {/* Breadcrumb row */}
          <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400 mb-1">
            <div className="w-4 h-4 rounded-full bg-blue-600 text-white text-[9px] font-bold flex items-center justify-center">
              S
            </div>
            <div className="truncate">
              <span className="font-semibold text-slate-800 dark:text-slate-200">SenaWeb</span>
              <span className="mx-1">›</span>
              <span>senaweb.id</span>
              <span className="mx-1">›</span>
              <span className="text-slate-500 truncate">{slug || 'artikel'}</span>
            </div>
          </div>

          {/* Title Link */}
          <h5 className="text-base sm:text-lg font-medium text-blue-700 dark:text-blue-400 hover:underline cursor-pointer leading-snug">
            {previewDisplayTitle}
          </h5>

          {/* Snippet text */}
          <p className="mt-1 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-normal">
            {previewDisplayDesc}
          </p>
        </div>
      </div>

      {/* Inputs: Focus Keyword, SEO Title, Meta Description */}
      <div className="grid grid-cols-1 gap-4 neu-flat p-5 sm:p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800">
        {/* Focus Keyword */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <KeyRound className="w-3.5 h-3.5 text-purple-500" /> Focus Keyword Utama
            </label>
            <span className="text-[11px] text-slate-400">
              Muncul: <strong className="text-slate-700 dark:text-slate-200">{analysis.metrics.keywordOccurrences}x</strong> ({analysis.metrics.keywordDensityPercent}%)
            </span>
          </div>
          <input
            type="text"
            placeholder="Contoh: jasa pembuatan website surabaya"
            value={focusKeyword}
            onChange={(e) => onUpdateFocusKeyword(e.target.value)}
            className="w-full neu-pressed px-3.5 py-2.5 text-xs sm:text-sm rounded-xl outline-none text-slate-800 dark:text-slate-100"
          />
        </div>

        {/* SEO Title */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              SEO Title (Judul Google)
            </label>
            <span
              className={`text-[11px] font-semibold ${
                seoTitle.length >= 40 && seoTitle.length <= 65
                  ? 'text-emerald-500'
                  : seoTitle.length > 65
                  ? 'text-rose-500'
                  : 'text-amber-500'
              }`}
            >
              {seoTitle.length} / 65 karakter
            </span>
          </div>
          <input
            type="text"
            placeholder="Ketik judul yang menarik klik dan menyertakan focus keyword..."
            value={seoTitle}
            onChange={(e) => onUpdateSeoTitle(e.target.value)}
            className="w-full neu-pressed px-3.5 py-2.5 text-xs sm:text-sm rounded-xl outline-none text-slate-800 dark:text-slate-100"
          />
          {/* Progress bar */}
          <div className="w-full h-1 rounded-full bg-slate-200 dark:bg-slate-700 mt-1.5 overflow-hidden">
            <div
              className={`h-full transition-all ${
                seoTitle.length >= 40 && seoTitle.length <= 65
                  ? 'bg-emerald-500'
                  : seoTitle.length > 65
                  ? 'bg-rose-500'
                  : 'bg-amber-400'
              }`}
              style={{ width: `${Math.min(100, (seoTitle.length / 65) * 100)}%` }}
            />
          </div>
        </div>

        {/* Meta Description */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Meta Description
            </label>
            <span
              className={`text-[11px] font-semibold ${
                seoDescription.length >= 120 && seoDescription.length <= 160
                  ? 'text-emerald-500'
                  : seoDescription.length > 160
                  ? 'text-rose-500'
                  : 'text-amber-500'
              }`}
            >
              {seoDescription.length} / 160 karakter
            </span>
          </div>
          <textarea
            rows={2}
            placeholder="Ringkasan informatif 120-160 karakter yang memuat ajakan bertindak (CTA) dan focus keyword..."
            value={seoDescription}
            onChange={(e) => onUpdateSeoDescription(e.target.value)}
            className="w-full neu-pressed p-3 text-xs sm:text-sm rounded-xl outline-none text-slate-800 dark:text-slate-100 resize-none"
          />
          {/* Progress bar */}
          <div className="w-full h-1 rounded-full bg-slate-200 dark:bg-slate-700 mt-1.5 overflow-hidden">
            <div
              className={`h-full transition-all ${
                seoDescription.length >= 120 && seoDescription.length <= 160
                  ? 'bg-emerald-500'
                  : seoDescription.length > 160
                  ? 'bg-rose-500'
                  : 'bg-amber-400'
              }`}
              style={{ width: `${Math.min(100, (seoDescription.length / 160) * 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Checklist Sections (Problems, Improvements, Good) */}
      <div className="neu-flat p-5 sm:p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="font-bold text-sm sm:text-base text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-blue-500" /> Hasil Analisis Realtime
          </h4>
          <div className="flex items-center gap-1.5 text-xs">
            <button
              type="button"
              onClick={() => setActiveListTab('all')}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                activeListTab === 'all' ? 'neu-pressed font-bold text-blue-600 dark:text-blue-400' : 'text-slate-500'
              }`}
            >
              Semua ({analysis.checks.problems.length + analysis.checks.improvements.length + analysis.checks.good.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveListTab('problems')}
              className={`px-2.5 py-1 rounded-lg flex items-center gap-1 transition-all ${
                activeListTab === 'problems' ? 'neu-pressed font-bold text-rose-600' : 'text-slate-500'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-rose-500"></span>
              Masalah ({analysis.checks.problems.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveListTab('improvements')}
              className={`px-2.5 py-1 rounded-lg flex items-center gap-1 transition-all ${
                activeListTab === 'improvements' ? 'neu-pressed font-bold text-amber-600' : 'text-slate-500'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-amber-500"></span>
              Saran ({analysis.checks.improvements.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveListTab('good')}
              className={`px-2.5 py-1 rounded-lg flex items-center gap-1 transition-all ${
                activeListTab === 'good' ? 'neu-pressed font-bold text-emerald-600' : 'text-slate-500'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              Bagus ({analysis.checks.good.length})
            </button>
          </div>
        </div>

        {/* Problems Group */}
        {(activeListTab === 'all' || activeListTab === 'problems') && analysis.checks.problems.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>Masalah Yang Perlu Diperbaiki ({analysis.checks.problems.length})</span>
            </div>
            {analysis.checks.problems.map((c) => (
              <div
                key={c.id}
                className="p-3 rounded-xl bg-rose-50/70 dark:bg-rose-950/20 border border-rose-200/70 dark:border-rose-900/40 text-xs flex items-start gap-2.5"
              >
                <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-rose-900 dark:text-rose-200">{c.title}</div>
                  <div className="text-slate-600 dark:text-slate-400 mt-0.5">{c.message}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Improvements Group */}
        {(activeListTab === 'all' || activeListTab === 'improvements') && analysis.checks.improvements.length > 0 && (
          <div className="space-y-2 pt-2">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Saran Peningkatan ({analysis.checks.improvements.length})</span>
            </div>
            {analysis.checks.improvements.map((c) => (
              <div
                key={c.id}
                className="p-3 rounded-xl bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200/70 dark:border-amber-900/40 text-xs flex items-start gap-2.5"
              >
                <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-amber-900 dark:text-amber-200">{c.title}</div>
                  <div className="text-slate-600 dark:text-slate-400 mt-0.5">{c.message}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Good Group */}
        {(activeListTab === 'all' || activeListTab === 'good') && analysis.checks.good.length > 0 && (
          <div className="space-y-2 pt-2">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Optimasi Yang Sudah Baik ({analysis.checks.good.length})</span>
            </div>
            {analysis.checks.good.map((c) => (
              <div
                key={c.id}
                className="p-3 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/20 border border-emerald-200/70 dark:border-emerald-900/40 text-xs flex items-start gap-2.5"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-emerald-900 dark:text-emerald-200">{c.title}</div>
                  <div className="text-slate-600 dark:text-slate-400 mt-0.5">{c.message}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
