'use client';

import React from 'react';
import {
  Building2,
  Store,
  Compass,
  ShoppingCart,
  GraduationCap,
  Users,
  Briefcase,
  Code2,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { SectionBubble } from './SectionBubble';

interface ServicesSectionProps {
  badgeText?: string;
}

export function ServicesSection({ badgeText }: ServicesSectionProps) {
  const services = [
    {
      icon: Building2,
      title: 'Website Company Profile',
      tagline: 'Membangun Kredibilitas Korporasi',
      desc: 'Website representasi profesional perusahaan untuk memikat investor, mitra bisnis, dan klien skala enterprise.',
      features: ['Halaman Profil & Visi Misi', 'Katalog Layanan / Produk', 'Email Bisnis Domain Sendiri'],
    },
    {
      icon: Store,
      title: 'Website Bisnis & UMKM',
      tagline: 'Meningkatkan Omset Online',
      desc: 'Website dirancang khusus agar produk UMKM Anda tampil berkelas dan langsung terhubung dengan pemesanan WhatsApp.',
      features: ['Katalog Menu & Produk', 'Direct Order WhatsApp', 'Google Maps Lokasi Usaha'],
    },
    {
      icon: Compass,
      title: 'High-Converting Landing Page',
      tagline: 'Fokus Konversi Penjualan',
      desc: 'Halaman promosi khusus produk tertentu dengan copywriting persuasif, testimoni pembeli, dan formulir pendaftaran cepat.',
      features: ['Struktur Copywriting AIDA', 'Integrasi Facebook Pixel/TikTok', 'Loading Kurang Dari 1 Detik'],
    },
    {
      icon: ShoppingCart,
      title: 'Toko Online (E-Commerce)',
      tagline: 'Jual Produk Otomatis 24 Jam',
      desc: 'Toko online lengkap dengan keranjang belanja, kalkulator ongkos kirim otomatis, manajemen pesanan, dan laporan penjualan.',
      features: ['Payment Gateway Otomatis', 'Kalkulasi Ongkir Ekspedisi', 'Manajemen Stok & Kupon'],
    },
    {
      icon: GraduationCap,
      title: 'Website Sekolah & Kampus',
      tagline: 'Portal Pendidikan & PPDB Online',
      desc: 'Sistem portal terpadu untuk sekolah (SD, SMP, SMA/SMK, Universitas) dilengkapi pendaftaran siswa baru dan galeri kegiatan.',
      features: ['Sistem PPDB Online', 'Pengumuman & Kelulusan Siswa', 'E-Rapor & Berita Kampus'],
    },
    {
      icon: Users,
      title: 'Website Lembaga & Organisasi',
      tagline: 'Komunikasi Publik Transparan',
      desc: 'Website resmi untuk yayasan, organisasi kemasyarakatan, asosiasi profesi, atau partai dengan fitur keanggotaan dan donasi.',
      features: ['Direktori Anggota / Pengurus', 'Laporan Keuangan & Berita', 'Formulir Pendaftaran Relawan'],
    },
    {
      icon: Briefcase,
      title: 'Website Portfolio Personal',
      tagline: 'Personal Branding Profesional',
      desc: 'Tampilkan hasil karya terbaik Anda bagi dokter, arsitek, fotografer, pengacara, desainer, dan konsultan profesional.',
      features: ['Galeri Visual Resolusi Tinggi', 'Testimoni Klien & Riwayat Karier', 'Formulir Booking Konsultasi'],
    },
    {
      icon: Code2,
      title: 'Custom Web Application',
      tagline: 'Solusi Sistem Kustom Spesifik',
      desc: 'Aplikasi berbasis web yang disesuaikan dengan alur kerja bisnis unik Anda (ERP, CRM, sistem inventaris, atau sistem reservasi).',
      features: ['Arsitektur Next.js & Postgres', 'Role Permission Kustom', 'API Integrasi Pihak Ketiga'],
    },
  ];

  return (
    <section className="py-16 sm:py-24 relative" id="layanan">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="mb-4">
            <SectionBubble
              icon={<Briefcase className="w-5 h-5 stroke-[2.2]" />}
              text={badgeText || 'LAYANAN UNGGULAN KAMI'}
            />
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-800 tracking-tight">
            Layanan Jasa Pembuatan Website Terbaik
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-500 dark:text-slate-400">
            Apapun skala dan industri bisnis Anda, kami menyediakan solusi website yang disesuaikan untuk mencapai target digital Anda.
          </p>
        </div>

        {/* Services 8 Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((srv, idx) => {
            const Icon = srv.icon;
            return (
              <div
                key={idx}
                className="neu-flat p-6 rounded-3xl flex flex-col justify-between border border-slate-200/50 dark:border-slate-800 hover:-translate-y-2 transition-all duration-300 group"
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl neu-flat-sm flex items-center justify-center text-blue-600 dark:text-blue-400 mb-5 group-hover:scale-110 transition-transform">
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider block mb-1">
                    {srv.tagline}
                  </span>
                  <h3 className="text-base sm:text-lg font-bold text-slate-800 dark:text-slate-100 mb-2 leading-snug">
                    {srv.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-4">
                    {srv.desc}
                  </p>

                  <ul className="space-y-1.5 pt-3 border-t border-slate-200/60 dark:border-slate-800/80 mb-6">
                    {srv.features.map((feat, fIdx) => (
                      <li key={fIdx} className="text-[11px] text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
                        <span className="w-1 h-1 rounded-full bg-blue-500"></span>
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <a
                  href="#kontak"
                  className="neu-button py-2 px-3 rounded-xl text-xs font-semibold text-blue-600 dark:text-blue-400 flex items-center justify-between group-hover:neu-pressed transition-all"
                >
                  <span>Konsultasi Layanan</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
