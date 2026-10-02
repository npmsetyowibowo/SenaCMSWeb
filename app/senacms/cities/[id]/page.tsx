'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Save,
  Plus,
  Trash2,
  MapPin,
  HelpCircle,
  Sparkles,
  Loader2,
  Globe,
  Tag,
  ExternalLink,
  ArrowUp,
  ArrowDown,
} from 'lucide-react';
import { useToast } from '@/components/Toast';

interface CityFaqItem {
  id?: number;
  question: string;
  answer: string;
}

export default function EditCityPage() {
  const params = useParams();
  const cityId = params.id as string;
  const router = useRouter();
  const { success, error } = useToast();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [cityName, setCityName] = useState('');
  const [provinceName, setProvinceName] = useState('');
  const [slug, setSlug] = useState('');
  const [badgeText, setBadgeText] = useState('');
  const [heroTitle, setHeroTitle] = useState('');
  const [heroSubtitle, setHeroSubtitle] = useState('');
  const [localKeywords, setLocalKeywords] = useState('');
  const [status, setStatus] = useState<'published' | 'draft'>('published');
  const [metaTitle, setMetaTitle] = useState('');
  const [metaDescription, setMetaDescription] = useState('');

  // Editable FAQs khusus kota
  const [faqs, setFaqs] = useState<CityFaqItem[]>([]);
  const [newFaqQuestion, setNewFaqQuestion] = useState('');
  const [newFaqAnswer, setNewFaqAnswer] = useState('');
  const [generatingKeywords, setGeneratingKeywords] = useState(false);

  const handleAiSuggestKeywords = async () => {
    if (!cityName.trim()) {
      error('Silakan isi Nama Kota terlebih dahulu sebelum meminta saran AI');
      return;
    }
    setGeneratingKeywords(true);
    try {
      const res = await fetch('/api/gemini/suggest-keywords', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cityName, provinceName }),
      });
      const data = await res.json();
      if (data.keywords) {
        setLocalKeywords(data.keywords);
        success('Keyword SEO lokal berhasil dibuat oleh AI!');
      } else {
        throw new Error(data.error || 'Gagal menghasilkan keyword');
      }
    } catch (err: any) {
      error(err.message || 'Gagal menyarankan keyword');
    } finally {
      setGeneratingKeywords(false);
    }
  };

  useEffect(() => {
    fetch(`/api/cities/${cityId}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.error) throw new Error(data.error);
        setCityName(data.city_name || '');
        setProvinceName(data.province_name || '');
        setSlug(data.slug || '');
        setBadgeText(data.badge_text || '');
        setHeroTitle(data.hero_title || '');
        setHeroSubtitle(data.hero_subtitle || '');
        setLocalKeywords(Array.isArray(data.local_keywords) ? data.local_keywords.join(', ') : '');
        setFaqs(Array.isArray(data.faqs) ? data.faqs : []);
        setStatus(data.status || 'published');
        setMetaTitle(data.meta_title || '');
        setMetaDescription(data.meta_description || '');
      })
      .catch((err) => error(err.message || 'Gagal memuat kota'))
      .finally(() => setLoading(false));
  }, [cityId]);

  const handleAddFaq = () => {
    if (!newFaqQuestion.trim() || !newFaqAnswer.trim()) {
      error('Pertanyaan dan jawaban FAQ wajib diisi');
      return;
    }
    setFaqs([...faqs, { question: newFaqQuestion.trim(), answer: newFaqAnswer.trim() }]);
    setNewFaqQuestion('');
    setNewFaqAnswer('');
  };

  const handleRemoveFaq = (index: number) => {
    setFaqs(faqs.filter((_, i) => i !== index));
  };

  const handleUpdateFaq = (index: number, field: 'question' | 'answer', value: string) => {
    const updated = [...faqs];
    updated[index][field] = value;
    setFaqs(updated);
  };

  const handleMoveFaq = (index: number, direction: 'up' | 'down') => {
    const target = direction === 'up' ? index - 1 : index + 1;
    if (target < 0 || target >= faqs.length) return;
    const updated = [...faqs];
    const temp = updated[index];
    updated[index] = updated[target];
    updated[target] = temp;
    setFaqs(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cityName.trim() || !provinceName.trim()) {
      error('Nama kota dan nama provinsi wajib diisi');
      return;
    }

    setSaving(true);
    try {
      const keywordsArray = localKeywords
        .split(',')
        .map((k) => k.trim())
        .filter(Boolean);

      const payload = {
        city_name: cityName.trim(),
        province_name: provinceName.trim(),
        slug: slug.trim() || cityName.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        badge_text: badgeText.trim(),
        hero_title: heroTitle.trim(),
        hero_subtitle: heroSubtitle.trim(),
        local_keywords: keywordsArray,
        faqs,
        status,
        meta_title: metaTitle.trim(),
        meta_description: metaDescription.trim(),
      };

      const res = await fetch(`/api/cities/${cityId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Gagal memperbarui');

      success(`Halaman kota ${cityName} berhasil diperbarui!`);
      router.push('/senacms/cities');
      router.refresh();
    } catch (err: any) {
      error(err.message || 'Gagal menyimpan');
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
    <div className="space-y-6 pb-20 max-w-5xl">
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Link
            href="/senacms/cities"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-blue-600 mb-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Kembali ke Manajemen Kota Layanan</span>
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-black text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <MapPin className="w-6 h-6 text-rose-500" />
              <span>Edit Kota Layanan: {cityName}</span>
            </h1>
            <a
              href={`/${slug}`}
              target="_blank"
              rel="noreferrer"
              className="neu-button px-3 py-1 rounded-xl text-xs font-semibold text-blue-600 flex items-center gap-1"
              title="Lihat Pratinjau Live"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Lihat Halaman</span>
            </a>
          </div>
        </div>

        <button
          type="button"
          disabled={saving}
          onClick={handleSubmit}
          className="neu-accent-btn px-6 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          <span>Simpan Perubahan</span>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Identitas Wilayah */}
        <div className="neu-flat p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 space-y-5">
          <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100 flex items-center gap-2 border-b border-slate-200/60 dark:border-slate-800 pb-3">
            <MapPin className="w-4 h-4 text-rose-500" />
            <span>Identitas Wilayah Kota Layanan</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Nama Kota / Kabupaten *
              </label>
              <input
                type="text"
                value={cityName}
                onChange={(e) => setCityName(e.target.value)}
                className="w-full neu-pressed px-3.5 py-2.5 text-xs rounded-xl outline-none text-slate-800 dark:text-slate-100 font-semibold"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Nama Provinsi *
              </label>
              <input
                type="text"
                value={provinceName}
                onChange={(e) => setProvinceName(e.target.value)}
                className="w-full neu-pressed px-3.5 py-2.5 text-xs rounded-xl outline-none text-slate-800 dark:text-slate-100"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                URL Slug (Aktif di: /{slug})
              </label>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="w-full neu-pressed px-3.5 py-2.5 text-xs rounded-xl outline-none text-slate-800 dark:text-slate-100 font-mono"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Status Publikasi
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full neu-pressed px-3.5 py-2.5 text-xs rounded-xl outline-none text-slate-800 dark:text-slate-100 bg-transparent"
              >
                <option value="published" className="bg-slate-100 dark:bg-slate-800">Published (Langsung Aktif)</option>
                <option value="draft" className="bg-slate-100 dark:bg-slate-800">Draft (Tersimpan Sementara)</option>
              </select>
            </div>
          </div>

          {/* EDIT BUBBLE KECIL / JUDUL KECIL (REQUIREMENT 5) */}
          <div className="p-4 rounded-2xl neu-flat-xs border border-blue-200/60 dark:border-blue-900/40 bg-blue-50/20 dark:bg-blue-950/20 space-y-2">
            <label className="block text-xs font-bold text-blue-700 dark:text-blue-300 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-blue-500" />
              <span>Bagian Bubble Kecil (Judul Badge Atas Halaman)</span>
            </label>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Teks ini tampil di dalam kapsul/bubble kecil tepat di atas judul H1 halaman kota.
            </p>
            <input
              type="text"
              placeholder="Contoh: Pusat Layanan Web Resmi Wilayah Sidoarjo, Jawa Timur"
              value={badgeText}
              onChange={(e) => setBadgeText(e.target.value)}
              className="w-full neu-pressed px-3.5 py-2.5 text-xs rounded-xl outline-none text-slate-800 dark:text-slate-100 font-semibold"
            />
          </div>
        </div>

        {/* Hero Headline & Subtitle */}
        <div className="neu-flat p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 space-y-5">
          <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100 flex items-center gap-2 border-b border-slate-200/60 dark:border-slate-800 pb-3">
            <Globe className="w-4 h-4 text-blue-500" />
            <span>Konten Hero & Keyword Lokal</span>
          </h3>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Judul Utama Hero (H1)
            </label>
            <input
              type="text"
              value={heroTitle}
              onChange={(e) => setHeroTitle(e.target.value)}
              className="w-full neu-pressed px-3.5 py-2.5 text-xs rounded-xl outline-none text-slate-800 dark:text-slate-100 font-bold"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Sub-Judul Hero
            </label>
            <textarea
              rows={3}
              value={heroSubtitle}
              onChange={(e) => setHeroSubtitle(e.target.value)}
              className="w-full neu-pressed p-3 text-xs rounded-xl outline-none text-slate-800 dark:text-slate-100"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-slate-700 flex items-center gap-1">
                <Tag className="w-3.5 h-3.5 text-purple-500" />
                <span>Target Keyword Lokal (Pisahkan dengan koma)</span>
              </label>
              <button
                type="button"
                disabled={generatingKeywords}
                onClick={handleAiSuggestKeywords}
                className="neu-button px-3 py-1 rounded-xl text-[11px] font-bold text-purple-600 hover:text-purple-700 flex items-center gap-1.5 shadow-sm transition-all"
                title="Saran keyword SEO lokal cerdas dengan AI berdasarkan Kota & Provinsi"
              >
                {generatingKeywords ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-purple-500" />
                ) : (
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                )}
                <span>{generatingKeywords ? 'Generating AI...' : 'Saran Keyword AI'}</span>
              </button>
            </div>
            <div className="relative">
              <input
                type="text"
                value={localKeywords}
                onChange={(e) => setLocalKeywords(e.target.value)}
                className="w-full neu-pressed px-3.5 py-2.5 text-xs rounded-xl outline-none text-slate-800"
              />
            </div>
          </div>
        </div>

        {/* EDIT FAQ KOTA LAYANAN (REQUIREMENT 2) */}
        <div className="neu-flat p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/60 dark:border-slate-800 pb-3">
            <div>
              <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100 flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-purple-500" />
                <span>Edit FAQ Khusus Wilayah Kota Ini</span>
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                Ubah, tambah, atau hapus pertanyaan & jawaban FAQ khusus kota ini secara realtime.
              </p>
            </div>
            <span className="text-xs font-bold px-2.5 py-1 rounded-lg neu-pressed-sm text-purple-600">
              {faqs.length} FAQ Aktif
            </span>
          </div>

          {/* List Existing FAQs */}
          <div className="space-y-3">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="p-4 rounded-2xl neu-pressed-sm border border-slate-200/70 dark:border-slate-800 space-y-2.5"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] font-bold text-purple-600 dark:text-purple-400">
                    Q{index + 1}:
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      disabled={index === 0}
                      onClick={() => handleMoveFaq(index, 'up')}
                      className="p-1 rounded-lg hover:text-blue-600 disabled:opacity-30"
                      title="Geser ke Atas"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      disabled={index === faqs.length - 1}
                      onClick={() => handleMoveFaq(index, 'down')}
                      className="p-1 rounded-lg hover:text-blue-600 disabled:opacity-30"
                      title="Geser ke Bawah"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRemoveFaq(index)}
                      className="p-1 rounded-lg text-rose-500 hover:text-rose-700"
                      title="Hapus FAQ"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <input
                  type="text"
                  value={faq.question}
                  onChange={(e) => handleUpdateFaq(index, 'question', e.target.value)}
                  placeholder="Tulis pertanyaan..."
                  className="w-full neu-flat-xs px-3 py-2 text-xs font-semibold rounded-xl outline-none text-slate-800 dark:text-slate-100"
                />

                <textarea
                  rows={2}
                  value={faq.answer}
                  onChange={(e) => handleUpdateFaq(index, 'answer', e.target.value)}
                  placeholder="Tulis jawaban..."
                  className="w-full neu-flat-xs p-3 text-xs rounded-xl outline-none text-slate-700 dark:text-slate-300"
                />
              </div>
            ))}
          </div>

          {/* Add New FAQ Item */}
          <div className="neu-flat p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 space-y-3 bg-slate-50/50 dark:bg-slate-900/30">
            <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
              <Plus className="w-3.5 h-3.5 text-blue-500" />
              <span>Tambah Pertanyaan FAQ Baru</span>
            </h4>
            <input
              type="text"
              placeholder="Tulis pertanyaan baru untuk kota ini..."
              value={newFaqQuestion}
              onChange={(e) => setNewFaqQuestion(e.target.value)}
              className="w-full neu-pressed px-3 py-2 text-xs rounded-xl outline-none text-slate-800 dark:text-slate-100"
            />
            <textarea
              rows={2}
              placeholder="Tulis jawaban lengkap..."
              value={newFaqAnswer}
              onChange={(e) => setNewFaqAnswer(e.target.value)}
              className="w-full neu-pressed p-3 text-xs rounded-xl outline-none text-slate-800 dark:text-slate-100"
            />
            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleAddFaq}
                className="neu-button px-4 py-2 text-xs font-bold text-blue-600 hover:text-blue-700 rounded-xl flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Tambahkan ke Daftar FAQ</span>
              </button>
            </div>
          </div>
        </div>

        {/* SEO Meta Card */}
        <div className="neu-flat p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 space-y-4">
          <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100 border-b border-slate-200/60 dark:border-slate-800 pb-3">
            Pengaturan Meta Tag & SEO
          </h3>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              SEO Meta Title
            </label>
            <input
              type="text"
              value={metaTitle}
              onChange={(e) => setMetaTitle(e.target.value)}
              className="w-full neu-pressed px-3.5 py-2.5 text-xs rounded-xl outline-none text-slate-800 dark:text-slate-100"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              SEO Meta Description
            </label>
            <textarea
              rows={2}
              value={metaDescription}
              onChange={(e) => setMetaDescription(e.target.value)}
              className="w-full neu-pressed p-3 text-xs rounded-xl outline-none text-slate-800 dark:text-slate-100"
            />
          </div>
        </div>

        {/* Bottom Submit Button */}
        <div className="flex justify-end gap-3 pt-4">
          <Link
            href="/senacms/cities"
            className="neu-button px-5 py-2.5 text-xs font-semibold rounded-xl text-slate-600"
          >
            Batal
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="neu-accent-btn px-8 py-3 rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>Simpan Perubahan Halaman Kota</span>
          </button>
        </div>
      </form>
    </div>
  );
}
