'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Save,
  Send,
  Loader2,
  Sparkles,
  ImageIcon,
  Tags,
  FolderOpen,
} from 'lucide-react';
import { RichTextEditor } from '@/components/RichTextEditor';
import { SeoAnalyzerPanel } from '@/components/SeoAnalyzerPanel';
import { ThumbnailUploader } from '@/components/ThumbnailUploader';
import { useToast } from '@/components/Toast';

export default function NewArticlePage() {
  const router = useRouter();
  const { success, error } = useToast();

  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [thumbnail, setThumbnail] = useState('https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800');
  const [status, setStatus] = useState<'draft' | 'published'>('draft');
  const [categoryId, setCategoryId] = useState<number>(1);
  const [selectedTagIds, setSelectedTagIds] = useState<number[]>([1, 2]);

  // SEO Fields
  const [focusKeyword, setFocusKeyword] = useState('');
  const [seoTitle, setSeoTitle] = useState('');
  const [seoDescription, setSeoDescription] = useState('');
  const [seoScore, setSeoScore] = useState(0);

  const [categories, setCategories] = useState<any[]>([]);
  const [tags, setTags] = useState<any[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch('/api/categories')
      .then((r) => r.json())
      .then((data) => setCategories(data || []))
      .catch(() => {});

    fetch('/api/tags')
      .then((r) => r.json())
      .then((data) => setTags(data || []))
      .catch(() => {});
  }, []);

  // Auto generate slug from title if user hasn't explicitly typed custom slug
  const handleTitleChange = (val: string) => {
    setTitle(val);
    const autoSlug = val
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
    setSlug(autoSlug);
    if (!seoTitle) setSeoTitle(val);
  };

  const handleSave = async (publishNow = false) => {
    if (!title.trim() || !content.trim()) {
      error('Judul dan isi konten artikel wajib diisi!');
      return;
    }

    setSaving(true);
    try {
      const finalStatus = publishNow ? 'published' : status;
      const res = await fetch('/api/articles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          slug,
          excerpt,
          content,
          thumbnail,
          status: finalStatus,
          category_id: categoryId,
          tag_ids: selectedTagIds,
          focus_keyword: focusKeyword,
          seo_title: seoTitle || title,
          seo_description: seoDescription || excerpt,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Gagal menyimpan');

      success(
        finalStatus === 'published' ? 'Artikel berhasil dipublikasikan!' : 'Draft artikel tersimpan!',
        'Sukses'
      );
      router.push('/senacms/articles');
      router.refresh();
    } catch (err: any) {
      error(err.message || 'Gagal menyimpan artikel');
    } finally {
      setSaving(false);
    }
  };

  const toggleTag = (id: number) => {
    setSelectedTagIds((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]
    );
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Top Bar Navigation & Save Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Link
            href="/senacms/articles"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-blue-600 mb-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Kembali ke Manajemen Artikel</span>
          </Link>
          <h1 className="text-2xl font-black text-slate-800 dark:text-slate-100">
            Tulis Artikel Baru & Optimasi SEO
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={saving}
            onClick={() => handleSave(false)}
            className="neu-button px-4 py-2.5 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center gap-1.5"
          >
            {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
            <span>Simpan Draft</span>
          </button>
          <button
            type="button"
            disabled={saving}
            onClick={() => handleSave(true)}
            className="neu-accent-btn px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md"
          >
            {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
            <span>Publikasikan Sekarang</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column (8 cols): Title, Excerpt, Rich Text Editor, SEO Analyzer */}
        <div className="lg:col-span-8 space-y-6">
          {/* Main Title Input */}
          <div className="neu-flat p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                Judul Artikel Utama *
              </label>
              <input
                type="text"
                placeholder="Ketik judul artikel yang menarik dan memikat pembaca..."
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                className="w-full neu-pressed px-4 py-3 text-base sm:text-lg font-bold rounded-2xl outline-none text-slate-800 dark:text-slate-100 placeholder:text-slate-400"
              />
            </div>

            {/* Slug input */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">
                URL Slug / Permalink (Otomatis & Bisa Diedit)
              </label>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400 font-mono">/blog/</span>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className="flex-1 neu-pressed px-3 py-1.5 text-xs font-mono rounded-xl outline-none text-slate-800 dark:text-slate-100"
                />
              </div>
            </div>

            {/* Excerpt */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Ringkasan Singkat (Excerpt)
              </label>
              <textarea
                rows={2}
                placeholder="Penjelasan ringkas 1-2 kalimat sebagai pengantar artikel..."
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                className="w-full neu-pressed p-3 text-xs sm:text-sm rounded-xl outline-none text-slate-800 dark:text-slate-100 resize-none"
              />
            </div>
          </div>

          {/* Content Editor */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Konten Lengkap Artikel *
              </label>
              <span className="text-[11px] text-slate-400">
                Mendukung Heading, Gambar, Tabel, List, Quote & Source Code
              </span>
            </div>
            <RichTextEditor
              value={content}
              onChange={(val) => setContent(val)}
              minHeight="400px"
            />
          </div>

          {/* Realtime SEO Analyzer Panel */}
          <div className="pt-4">
            <SeoAnalyzerPanel
              title={title}
              slug={slug}
              content={content}
              seoTitle={seoTitle}
              seoDescription={seoDescription}
              focusKeyword={focusKeyword}
              onUpdateSeoTitle={setSeoTitle}
              onUpdateSeoDescription={setSeoDescription}
              onUpdateFocusKeyword={setFocusKeyword}
              onScoreCalculated={setSeoScore}
            />
          </div>
        </div>

        {/* Right Column (4 cols): Meta settings, Category, Tags, Thumbnail */}
        <div className="lg:col-span-4 space-y-6">
          {/* Status & Publish Card */}
          <div className="neu-flat p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 space-y-4">
            <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100">
              Pengaturan Publikasi
            </h3>

            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">
                Status Artikel
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full neu-pressed px-3 py-2 text-xs rounded-xl outline-none text-slate-800 dark:text-slate-100 bg-transparent"
              >
                <option value="draft" className="bg-slate-100 dark:bg-slate-800">Draft (Tersimpan Pribadi)</option>
                <option value="published" className="bg-slate-100 dark:bg-slate-800">Published (Tampil Publik)</option>
              </select>
            </div>
          </div>

          {/* Category Card */}
          <div className="neu-flat p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 space-y-3">
            <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
              <FolderOpen className="w-4 h-4 text-blue-500" />
              <span>Kategori Artikel</span>
            </h3>

            <div className="space-y-1.5 max-h-48 overflow-y-auto">
              {categories.map((cat) => (
                <label
                  key={cat.id}
                  className="flex items-center gap-2 p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/50 cursor-pointer text-xs"
                >
                  <input
                    type="radio"
                    name="category_id"
                    checked={categoryId === cat.id}
                    onChange={() => setCategoryId(cat.id)}
                    className="accent-blue-600"
                  />
                  <span className="font-semibold text-slate-700 dark:text-slate-200">{cat.name}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Tags Card */}
          <div className="neu-flat p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 space-y-3">
            <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
              <Tags className="w-4 h-4 text-purple-500" />
              <span>Tag Artikel</span>
            </h3>

            <div className="flex flex-wrap gap-1.5">
              {tags.map((t) => {
                const isSelected = selectedTagIds.includes(t.id);
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => toggleTag(t.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                      isSelected
                        ? 'neu-pressed text-blue-600 dark:text-blue-400 font-bold border border-blue-400/50'
                        : 'neu-button text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    #{t.name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Thumbnail Image Card */}
          <div className="neu-flat p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800">
            <ThumbnailUploader
              value={thumbnail}
              onChange={setThumbnail}
              label="Gambar Thumbnail Artikel"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
