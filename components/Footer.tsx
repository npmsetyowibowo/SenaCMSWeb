'use client';

import React from 'react';
import Link from 'next/link';
import { Globe, MapPin, Mail, Phone, MessageCircle, ShieldCheck, Heart, ArrowUp } from 'lucide-react';

interface FooterProps {
  siteName?: string;
  siteTagline?: string;
  siteDescription?: string;
  whatsappNumber?: string;
  contactEmail?: string;
  contactPhone?: string;
  contactAddress?: string;
}

export function Footer({
  siteName = 'SenaWeb',
  siteTagline = 'JASA PEMBUATAN WEBSITE',
  siteDescription = 'Jasa pembuatan website profesional, modern Neumorphic, SEO-friendly, dan responsif untuk UMKM, Company Profile, dan Bisnis Indonesia.',
  whatsappNumber = '6281234567890',
  contactEmail = 'halo@senaweb.id',
  contactPhone = '+62 812-3456-7890',
  contactAddress = 'Gedung Cyber One Lt. 4, Jl. Kemakmuran Digital No. 88, Indonesia',
}: FooterProps) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cities = [
    { name: 'Sidoarjo', href: '/sidoarjo', keyword: 'Jasa Web Sidoarjo' },
    { name: 'Lumajang', href: '/lumajang', keyword: 'Jasa Web Lumajang' },
    { name: 'Surabaya', href: '/surabaya', keyword: 'Jasa Web Surabaya' },
    { name: 'Purwokerto', href: '/purwokerto', keyword: 'Jasa Web Purwokerto' },
    { name: 'Solo', href: '/solo', keyword: 'Jasa Web Solo' },
  ];

  const services = [
    { name: 'Website Company Profile', href: '/#layanan' },
    { name: 'Website UMKM & Toko Online', href: '/#layanan' },
    { name: 'Landing Page Promosi Tinggi', href: '/#layanan' },
    { name: 'Website Sekolah & Pendidikan', href: '/#layanan' },
    { name: 'Custom Web Application', href: '/#layanan' },
    { name: 'Jasa Optimasi SEO & Redesign', href: '/#layanan' },
  ];

  return (
    <footer className="mt-20 border-t border-slate-200/80 dark:border-slate-800 bg-[#eef2f6]/70 dark:bg-[#121824]/70 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand Info */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl neu-flat flex items-center justify-center text-blue-600 font-extrabold text-xl">
                <span>SW</span>
              </div>
              <div>
                <span className="font-extrabold text-xl tracking-tight text-slate-800 dark:text-slate-100">
                  {siteName}
                </span>
                <span className="block text-[9px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest">
                  {siteTagline}
                </span>
              </div>
            </Link>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              {siteDescription}
            </p>
            <div className="pt-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                Fast Response CS WhatsApp 24/7
              </span>
            </div>
          </div>

          {/* Layanan */}
          <div>
            <h4 className="font-bold text-sm text-slate-800 dark:text-slate-100 uppercase tracking-wider mb-4">
              Layanan Utama
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              {services.map((s, idx) => (
                <li key={idx}>
                  <Link href={s.href} className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                    {s.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Area Layanan Kota (Local SEO Hub) */}
          <div>
            <h4 className="font-bold text-sm text-slate-800 dark:text-slate-100 uppercase tracking-wider mb-4 flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-rose-500" />
              <span>Wilayah Layanan Unggulan</span>
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              {cities.map((city, idx) => (
                <li key={idx}>
                  <Link
                    href={city.href}
                    className="hover:text-blue-600 dark:hover:text-blue-400 flex items-center justify-between py-1 group"
                  >
                    <span>{city.keyword}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full neu-flat-xs text-blue-600 dark:text-blue-400 group-hover:scale-105 transition-transform">
                      {city.name}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Kontak Resmi */}
          <div className="space-y-3">
            <h4 className="font-bold text-sm text-slate-800 dark:text-slate-100 uppercase tracking-wider mb-4">
              Hubungi Kami
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 flex items-start gap-2">
              <MapPin className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
              <span>{contactAddress}</span>
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2">
              <Mail className="w-4 h-4 text-blue-500 shrink-0" />
              <span>{contactEmail}</span>
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2">
              <Phone className="w-4 h-4 text-blue-500 shrink-0" />
              <span>{contactPhone}</span>
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2">
              <MessageCircle className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>WhatsApp: +{whatsappNumber}</span>
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-slate-200/70 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
          <div>
            © {new Date().getFullYear()} <strong>{siteName}</strong> – {siteTagline}. Hak Cipta Dilindungi Undang-Undang.
          </div>

          <div className="flex items-center gap-4">
            <Link href="/sitemap.xml" className="hover:text-blue-600" target="_blank">
              Sitemap.xml
            </Link>
            <Link href="/robots.txt" className="hover:text-blue-600" target="_blank">
              Robots.txt
            </Link>
            <Link href="/kebijakan-privasi" className="hover:text-blue-600">
              Kebijakan Privasi
            </Link>
            <button
              onClick={scrollToTop}
              className="neu-button p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:text-blue-600"
              aria-label="Kembali ke atas"
              title="Kembali ke atas"
            >
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
