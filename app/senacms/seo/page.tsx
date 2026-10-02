'use client';

import React, { useEffect, useState } from 'react';
import {
  Search,
  Save,
  Sparkles,
  Loader2,
  Globe,
  CheckCircle2,
  FileText,
  Briefcase,
  DollarSign,
  Layers,
  BookOpen,
  Phone,
  Eye,
  Info,
} from 'lucide-react';
import { useToast } from '@/components/Toast';

export default function SeoSettingsPage() {
  const { success, error } = useToast();
  const [settings, setSettings] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'static_pages' | 'global'>('static_pages');
  const [selectedPage, setSelectedPage] = useState<'home' | 'layanan' | 'paket' | 'portfolio' | 'blog' | 'kontak'>('home');

  useEffect(() => {
    fetch('/api/settings')
      .then((r) => r.json())
      .then((data) => {
        setSettings(data || {});
      })
      .catch(() => error('Gagal memuat pengaturan SEO'))
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (key: string, value: string) => {
    setSettings((prev: any) => ({ ...prev, [key]: value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });
      if (!res.ok) throw new Error('Gagal menyimpan');
      success('Pengaturan SEO berhasil diperbarui!');
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

  const domain = settings.site_domain || 'https://senaweb.id';

  const staticPagesConfig = [
    {
      id: 'home',
      name: 'Beranda / Home',
      path: '/',
      icon: Globe,
      titleKey: 'seo_home_title',
      descKey: 'seo_home_description',
      defaultTitle: `${settings.site_name || 'SenaWeb'} – ${settings.site_tagline || 'JASA PEMBUATAN WEBSITE'} Profesional & Cepat No. 1`,
      defaultDesc: settings.site_description || 'Jasa pembuatan website profesional, modern Neumorphic, SEO-friendly, dan responsif untuk UMKM, Company Profile, dan Bisnis Indonesia.',
    },
    {
      id: 'layanan',
      name: 'Layanan',
      path: '/layanan',
      icon: Briefcase,
      titleKey: 'seo_layanan_title',
      descKey: 'seo_layanan_description',
      defaultTitle: 'Layanan Pembuatan Website – Solusi Digital Terlengkap SenaWeb',
      defaultDesc: 'Jasa pembuatan website Company Profile, E-Commerce, UMKM, Landing Page, Sekolah, Organisasi, dan Custom Web Application dengan teknologi Next.js dan SEO optimal.',
    },
    {
      id: 'paket',
      name: 'Paket Harga',
      path: '/paket',
      icon: DollarSign,
      titleKey: 'seo_paket_title',
      descKey: 'seo_paket_description',
      defaultTitle: 'Paket Harga Jasa Pembuatan Website – Murah & Transparan SenaWeb',
      defaultDesc: 'Daftar harga paket pembuatan website SenaWeb: Paket Basic Rp750.000, Medium Rp1.800.000, Premium Rp3.200.000. Gratis domain, hosting, dan SSL.',
    },
    {
      id: 'portfolio',
      name: 'Portfolio',
      path: '/portfolio',
      icon: Layers,
      titleKey: 'seo_portfolio_title',
      descKey: 'seo_portfolio_description',
      defaultTitle: 'Portfolio Hasil Pembuatan Website – Studi Kasus & Karya Nyata SenaWeb',
      defaultDesc: 'Lihat koleksi portfolio website terbaik yang telah kami kerjakan untuk company profile, toko online e-commerce, UMKM, dan institusi pendidikan di Indonesia.',
    },
    {
      id: 'blog',
      name: 'Blog Index',
      path: '/blog',
      icon: BookOpen,
      titleKey: 'seo_blog_title',
      descKey: 'seo_blog_description',
      defaultTitle: 'Blog & Wawasan Digital – Tutorial, SEO & Tips Bisnis Web',
      defaultDesc: 'Kumpulan artikel seputar strategi pembuatan website profesional, optimasi SEO Google, tren desain Neumorphism, dan kiat sukses bisnis digital.',
    },
    {
      id: 'kontak',
      name: 'Kontak',
      path: '/kontak',
      icon: Phone,
      titleKey: 'seo_kontak_title',
      descKey: 'seo_kontak_description',
      defaultTitle: 'Hubungi Kami – Konsultasi Jasa Pembuatan Website SenaWeb',
      defaultDesc: 'Konsultasikan rencana pembuatan website bisnis Anda bersama tim ahli SenaWeb. Tersedia konsultasi online WhatsApp dan janji temu.',
    },
  ];

  const currentPage = staticPagesConfig.find((p) => p.id === selectedPage) || staticPagesConfig[0];
  const currentTitle = settings[currentPage.titleKey] || currentPage.defaultTitle;
  const currentDesc = settings[currentPage.descKey] || currentPage.defaultDesc;

  return (
    <div className="space-y-6 max-w-4xl pb-16">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800 flex items-center gap-2">
            <Search className="w-6 h-6 text-blue-600" />
            <span>Pengaturan SEO & Meta Tags</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Optimalkan meta title dan meta description pada setiap halaman statis untuk mendominasi Google SERP.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="neu-flat p-1 rounded-2xl flex items-center gap-1 border border-slate-200/80">
          <button
            type="button"
            onClick={() => setActiveTab('static_pages')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'static_pages'
                ? 'neu-pressed text-blue-600 border border-blue-400/40 font-extrabold'
                : 'text-slate-600 hover:text-blue-600'
            }`}
          >
            Halaman Statis
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('global')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'global'
                ? 'neu-pressed text-blue-600 border border-blue-400/40 font-extrabold'
                : 'text-slate-600 hover:text-blue-600'
            }`}
          >
            Global & Verifikasi
          </button>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* TAB 1: EDIT SETIAP HALAMAN STATIS */}
        {activeTab === 'static_pages' && (
          <div className="space-y-6">
            {/* Page Selector Tabs */}
            <div className="flex flex-wrap items-center gap-2 neu-flat p-2 rounded-2xl border border-slate-200/80">
              {staticPagesConfig.map((page) => {
                const Icon = page.icon;
                const isSelected = selectedPage === page.id;
                return (
                  <button
                    key={page.id}
                    type="button"
                    onClick={() => setSelectedPage(page.id as any)}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                      isSelected
                        ? 'neu-pressed text-blue-600 border border-blue-400/40 font-black'
                        : 'text-slate-600 hover:text-blue-600 hover:bg-slate-100/40'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{page.name}</span>
                  </button>
                );
              })}
            </div>

            {/* Editor Card for Selected Static Page */}
            <div className="neu-flat p-6 sm:p-8 rounded-3xl border border-slate-200/80 space-y-6">
              <div className="flex items-center justify-between border-b border-slate-200/60 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl neu-flat flex items-center justify-center text-blue-600">
                    <currentPage.icon className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-sm text-slate-800">
                      SEO Halaman: {currentPage.name}
                    </h3>
                    <span className="text-[11px] font-mono text-slate-400">
                      Path URL: {currentPage.path}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    handleChange(currentPage.titleKey, currentPage.defaultTitle);
                    handleChange(currentPage.descKey, currentPage.defaultDesc);
                    success(`Reset ke template default untuk halaman ${currentPage.name}`);
                  }}
                  className="neu-button px-3 py-1 rounded-xl text-[11px] font-semibold text-slate-500 hover:text-blue-600"
                  title="Kembalikan ke judul & deskripsi bawaan"
                >
                  Reset Default
                </button>
              </div>

              {/* Meta Title */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-slate-700">
                    Meta Title (Judul Tab & Hasil Pencarian Google)
                  </label>
                  <span
                    className={`text-[11px] font-semibold ${
                      currentTitle.length > 65
                        ? 'text-amber-600'
                        : currentTitle.length < 30
                        ? 'text-slate-400'
                        : 'text-emerald-600 font-bold'
                    }`}
                  >
                    {currentTitle.length} / 60 karakter
                  </span>
                </div>
                <input
                  type="text"
                  placeholder={currentPage.defaultTitle}
                  value={settings[currentPage.titleKey] ?? ''}
                  onChange={(e) => handleChange(currentPage.titleKey, e.target.value)}
                  className="w-full neu-pressed px-3.5 py-2.5 text-xs sm:text-sm rounded-xl outline-none text-slate-800 font-semibold"
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  Direkomendasikan antara 50–60 karakter agar tidak terpotong oleh Google.
                </p>
              </div>

              {/* Meta Description */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-slate-700">
                    Meta Description (Ringkasan Cuplikan Snippet Google)
                  </label>
                  <span
                    className={`text-[11px] font-semibold ${
                      currentDesc.length > 165
                        ? 'text-amber-600'
                        : currentDesc.length < 100
                        ? 'text-slate-400'
                        : 'text-emerald-600 font-bold'
                    }`}
                  >
                    {currentDesc.length} / 160 karakter
                  </span>
                </div>
                <textarea
                  rows={3}
                  placeholder={currentPage.defaultDesc}
                  value={settings[currentPage.descKey] ?? ''}
                  onChange={(e) => handleChange(currentPage.descKey, e.target.value)}
                  className="w-full neu-pressed p-3 text-xs sm:text-sm rounded-xl outline-none text-slate-800 resize-none leading-relaxed"
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  Direkomendasikan antara 130–160 karakter yang memuat ajakan bertindak (CTA).
                </p>
              </div>

              {/* Google Search Result Preview */}
              <div className="p-4 sm:p-5 rounded-2xl neu-flat-xs border border-blue-200/60 bg-blue-50/20 space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-blue-700 mb-2">
                  <Eye className="w-3.5 h-3.5" />
                  <span>Pratinjau Snippet Google (Live Search Preview)</span>
                </div>

                <div className="neu-flat p-4 rounded-xl border border-slate-200/80 bg-white space-y-1">
                  <div className="text-[11px] text-slate-500 font-sans flex items-center gap-1">
                    <span className="font-semibold text-slate-700">{domain.replace(/^https?:\/\//, '')}</span>
                    <span>›</span>
                    <span className="text-slate-500">{currentPage.path.replace('/', '') || 'beranda'}</span>
                  </div>
                  <h4 className="text-blue-700 font-semibold text-sm sm:text-base hover:underline cursor-pointer leading-snug line-clamp-1">
                    {currentTitle || currentPage.defaultTitle}
                  </h4>
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {currentDesc || currentPage.defaultDesc}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: GLOBAL & VERIFIKASI */}
        {activeTab === 'global' && (
          <div className="space-y-6">
            {/* Core Domain */}
            <div className="neu-flat p-6 rounded-3xl border border-slate-200/80 space-y-4">
              <h3 className="font-bold text-sm text-slate-800 flex items-center gap-2">
                <Globe className="w-4 h-4 text-blue-500" />
                <span>Domain Utama & URL Resmi</span>
              </h3>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Canonical Base URL *
                </label>
                <input
                  type="text"
                  placeholder="https://senaweb.id"
                  value={settings.site_domain || 'https://senaweb.id'}
                  onChange={(e) => handleChange('site_domain', e.target.value)}
                  className="w-full neu-pressed px-3.5 py-2.5 text-xs sm:text-sm rounded-xl outline-none text-slate-800 font-mono"
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  Digunakan untuk sitemap.xml, robots.txt, dan canonical URL setiap halaman.
                </p>
              </div>
            </div>

            {/* Social Share Cards */}
            <div className="neu-flat p-6 rounded-3xl border border-slate-200/80 space-y-4">
              <h3 className="font-bold text-sm text-slate-800 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-500" />
                <span>OpenGraph & Twitter Social Card Image</span>
              </h3>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Default OpenGraph Banner URL (Ukuran ideal: 1200x630 px)
                </label>
                <input
                  type="text"
                  value={settings.og_image || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200'}
                  onChange={(e) => handleChange('og_image', e.target.value)}
                  className="w-full neu-pressed px-3.5 py-2.5 text-xs sm:text-sm rounded-xl outline-none text-slate-800"
                />
              </div>
            </div>

            {/* Google Verification */}
            <div className="neu-flat p-6 rounded-3xl border border-slate-200/80 space-y-4">
              <h3 className="font-bold text-sm text-slate-800">
                Verifikasi Mesin Pencari & Analytics
              </h3>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Kode Verifikasi Google Search Console (google-site-verification)
                </label>
                <input
                  type="text"
                  placeholder="Contoh: v-Q...ABC123xyz"
                  value={settings.google_verification_code || ''}
                  onChange={(e) => handleChange('google_verification_code', e.target.value)}
                  className="w-full neu-pressed px-3.5 py-2.5 text-xs sm:text-sm rounded-xl outline-none text-slate-800 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Google Analytics ID (GA4)
                </label>
                <input
                  type="text"
                  placeholder="G-XXXXXXXXXX"
                  value={settings.google_analytics_id || ''}
                  onChange={(e) => handleChange('google_analytics_id', e.target.value)}
                  className="w-full neu-pressed px-3.5 py-2.5 text-xs sm:text-sm rounded-xl outline-none text-slate-800 font-mono"
                />
              </div>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={saving}
            className="neu-accent-btn px-8 py-3.5 rounded-2xl font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg cursor-pointer"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>Simpan Seluruh Pengaturan SEO</span>
          </button>
        </div>
      </form>
    </div>
  );
}
