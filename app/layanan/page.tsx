import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import {
  Globe,
  Briefcase,
  ShoppingBag,
  Store,
  GraduationCap,
  Users,
  Code2,
  Sparkles,
  ArrowRight,
  CheckCircle,
  MessageCircle,
} from 'lucide-react';
import { getSettings, getPricingPlans } from '@/lib/db';

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  const title = settings.seo_layanan_title || 'Layanan Pembuatan Website – Solusi Digital Terlengkap SenaWeb';
  const description = settings.seo_layanan_description || 'Jasa pembuatan website Company Profile, E-Commerce, UMKM, Landing Page, Sekolah, Organisasi, dan Custom Web Application dengan teknologi Next.js dan SEO optimal.';

  return {
    title,
    description,
    openGraph: {
      title,
      description,
    },
  };
}

export default async function LayananPage() {
  const [settings, plans] = await Promise.all([
    getSettings(),
    getPricingPlans(),
  ]);

  const whatsappNumber = settings.whatsapp_number || '6281234567890';

  const services = [
    {
      title: 'Company Profile Perusahaan',
      description: 'Website resmi korporasi untuk memperkuat branding kredibel, presentasi legalitas, profil direksi, portofolio proyek, dan katalog layanan skala enterprise.',
      icon: Briefcase,
      badge: 'Paling Populer',
      features: ['Profil Perusahaan & Legalitas', 'Katalog Layanan & Portfolio', 'Multi-Bahasa (ID/EN)', 'Keamanan SSL & Backup Terjadwal'],
    },
    {
      title: 'Website UMKM & Kuliner',
      description: 'Solusi website praktis dan ekonomis bagi pelaku usaha mikro dan menengah. Dilengkapi integrasi katalog menu dan pemesanan otomatis langsung ke WhatsApp.',
      icon: Store,
      badge: 'Solusi UMKM',
      features: ['Katalog Menu / Produk', 'Tombol WhatsApp Cepat', 'Integrasi Google Maps Lokasi', 'Desain Ramah Smartphone'],
    },
    {
      title: 'High-Converting Landing Page',
      description: 'Halaman promosi penjualan dengan copywriting persuasif dan struktur CTA terarah untuk memaksimalkan konversi iklan Google Ads, TikTok Ads, dan Meta Ads.',
      icon: Sparkles,
      badge: 'Tinggi Konversi',
      features: ['Fast Loading (<1.5 detik)', 'Struktur Copywriting AIDA', 'Integrasi Pixel & Google Tag', 'Formulir Lead Langsung WhatsApp'],
    },
    {
      title: 'Toko Online E-Commerce',
      description: 'Sistem belanja online lengkap dengan manajemen katalog produk, hitung ongkos kirim ekspedisi otomatis, dan notifikasi pemesanan instan.',
      icon: ShoppingBag,
      badge: 'Fitur Lengkap',
      features: ['Katalog Kategori & Varian', 'Kalkulator Ongkos Kirim Otomatis', 'Keranjang Belanja Interaktif', 'Dashboard Pengelolaan Produk'],
    },
    {
      title: 'Sekolah & Institusi Pendidikan',
      description: 'Portal informasi resmi untuk SD, SMP, SMA, SMK, dan Kampus dengan fitur PPDB Online, publikasi pengumuman nilai, dan galeri prestasi siswa.',
      icon: GraduationCap,
      badge: 'Pendidikan',
      features: ['Modul PPDB / Pendaftaran Online', 'Berita & Pengumuman Sekolah', 'Galeri Kegiatan & Prestasi', 'Data Guru & Tenaga Pendidik'],
    },
    {
      title: 'Yayasan & Organisasi',
      description: 'Website transparan dan informatif untuk organisasi masyarakat, komunitas, LSM, dan lembaga keagamaan dengan pelaporan kegiatan dan publikasi donasi.',
      icon: Users,
      badge: 'Sosial & Komunitas',
      features: ['Profil Kepengurusan Organisasi', 'Laporan Program & Kegiatan', 'Informasi Rekening Donasi', 'Arsip Dokumen Publik'],
    },
    {
      title: 'Portfolio Personal & Kreator',
      description: 'Showcase karya visual elegan bagi desainer, fotografer, arsitek, konsultan, dan profesional yang ingin menarik klien premium bernilai tinggi.',
      icon: Globe,
      badge: 'Personal Branding',
      features: ['Galeri Grid High-Definition', 'Curriculum Vitae (CV) Online', 'Testimoni Klien & Rekomendasi', 'Tombol Unduh Portofolio PDF'],
    },
    {
      title: 'Custom Website & Web Application',
      description: 'Pengembangan sistem web kustom sesuai proses bisnis unik Anda (ERP, booking system, membership, inventory management, atau integrasi API pihak ketiga).',
      icon: Code2,
      badge: 'Solusi Kustom',
      features: ['Arsitektur Next.js & PostgreSQL', 'Integrasi API Pihak Ketiga', 'Role-Based Access Control (RBAC)', 'Skalabilitas Cloud Terjamin'],
    },
  ];

  return (
    <div className="py-12 sm:py-20 space-y-16">
      {/* Header */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full neu-flat-xs text-xs sm:text-sm font-semibold text-blue-700 dark:text-blue-300">
          <Sparkles className="w-4 h-4 text-blue-600 animate-spin-slow" />
          <span>LAYANAN SPESIALIS PEMBUATAN WEBSITE</span>
        </div>

        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
          Solusi Website Tepat Untuk{' '}
          <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Setiap Kebutuhan Bisnis
          </span>
        </h1>

        <p className="text-sm sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
          Semua website dirancang khusus dengan teknologi Next.js terkini, ramah mesin pencari Google, dan berestetika Neumorphic modern.
        </p>
      </section>

      {/* Services Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="neu-flat p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 flex flex-col justify-between space-y-4 hover:scale-[1.02] transition-transform"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-2xl neu-flat flex items-center justify-center text-blue-600 dark:text-blue-400">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300">
                      {item.badge}
                    </span>
                  </div>

                  <h3 className="font-extrabold text-base text-slate-900 dark:text-slate-100">
                    {item.title}
                  </h3>

                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {item.description}
                  </p>

                  <div className="space-y-1.5 pt-2">
                    {item.features.map((f, fIdx) => (
                      <div key={fIdx} className="flex items-center gap-2 text-[11px] text-slate-700 dark:text-slate-300">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                        <span>{f}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-200/60 dark:border-slate-800">
                  <a
                    href={`https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                      `Halo SenaWeb, saya tertarik untuk membuat website jenis: ${item.title}. Bisa konsultasi?`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full neu-button py-2 rounded-xl text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center justify-center gap-1.5"
                  >
                    <span>Konsultasikan Jenis Ini</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="neu-flat p-8 sm:p-12 rounded-3xl border border-slate-200/80 dark:border-slate-800 text-center space-y-4">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100">
            Bingung Menentukan Jenis Website yang Pas?
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
            Tim konsultan SenaWeb siap memberikan rekomendasi struktur, fitur, dan estimasi biaya terbaik untuk industri Anda.
          </p>
          <div className="pt-2 flex justify-center gap-3">
            <Link
              href="/paket"
              className="neu-accent-btn px-6 py-3 rounded-xl text-xs font-bold flex items-center gap-2 shadow"
            >
              <span>Lihat Paket Harga Kami</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
