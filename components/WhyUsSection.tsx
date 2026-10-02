'use client';

import React from 'react';
import {
  Smartphone,
  Search,
  Zap,
  Palette,
  MessageCircle,
  Share2,
  ShieldAlert,
  Headphones,
  Wrench,
  CheckCircle2,
} from 'lucide-react';
import { SectionBubble } from './SectionBubble';

interface WhyUsSectionProps {
  badgeText?: string;
}

export function WhyUsSection({ badgeText }: WhyUsSectionProps) {
  const advantages = [
    {
      icon: Smartphone,
      title: '100% Responsif & Mobile First',
      desc: 'Tampilan otomatis menyesuaikan dengan sempurna di smartphone Android/iPhone, iPad/Tablet, hingga layar laptop & monitor ultra-wide.',
    },
    {
      icon: Search,
      title: 'SEO Friendly & Terstruktur',
      desc: 'Dilengkapi sitemap otomatis, robots.txt dinamis, meta tag OpenGraph, serta Schema.org JSON-LD agar cepat diindeks Google.',
    },
    {
      icon: Zap,
      title: 'Kecepatan Loading Kilat',
      desc: 'Optimasi gambar otomatis WebP, arsitektur Next.js terbaru, dan kompresi aset yang memastikan Core Web Vitals selalu berpredikat hijau.',
    },
    {
      icon: Palette,
      title: 'Desain Kustom Neumorphic',
      desc: 'Bukan template murahan hasil copy-paste. Kami merancang desain modern dengan estetika soft UI yang elegan dan berkarakter unik.',
    },
    {
      icon: MessageCircle,
      title: 'Integrasi WhatsApp Direct',
      desc: 'Tombol WhatsApp mengambang dan formulir konsultasi otomatis yang mengarahkan pengunjung menjadi prospek penjualan nyata.',
    },
    {
      icon: Share2,
      title: 'Sinkronisasi Media Sosial',
      desc: 'Tautan langsung ke Instagram, TikTok, LinkedIn, dan kartu cuplikan sosial otomatis yang cantik saat link website dibagikan.',
    },
    {
      icon: ShieldAlert,
      title: 'Keamanan Tingkat Tinggi',
      desc: 'Perlindungan SSL gratis selamanya, sanitasi input dari XSS/SQL Injection, enkripsi data, dan proteksi dari serangan brute force.',
    },
    {
      icon: Headphones,
      title: 'Konsultasi & Support Cepat',
      desc: 'Tim dukungan teknis siap mendampingi Anda via WhatsApp kapan pun Anda membutuhkan arahan atau bantuan pengoperasian website.',
    },
    {
      icon: Wrench,
      title: 'Layanan Maintenance Rutin',
      desc: 'Pembaruan keamanan berkala, pencadangan (backup) otomatis database, dan pemantauan performa server tanpa pusing memikirkan teknis.',
    },
  ];

  return (
    <section className="py-16 sm:py-24 relative bg-[#eef2f6]/40 dark:bg-[#121824]/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="mb-4">
            <SectionBubble
              icon={<CheckCircle2 className="w-5 h-5 stroke-[2.2]" />}
              text={badgeText || '9 KEUNGGULAN UTAMA SENAWEB'}
            />
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-800 tracking-tight">
            9 Keunggulan Website Buatan SenaWeb
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-500">
            Kami mengutamakan kualitas rekayasa piranti lunak, estetika antarmuka, dan efektivitas bisnis jangka panjang untuk setiap klien kami.
          </p>
        </div>

        {/* 9 Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {advantages.map((adv, idx) => {
            const Icon = adv.icon;
            return (
              <div
                key={idx}
                className="neu-flat p-6 sm:p-7 rounded-3xl border border-slate-200/50 dark:border-slate-800 flex items-start gap-4 hover:-translate-y-1 transition-transform duration-200"
              >
                <div className="w-12 h-12 rounded-2xl neu-flat-sm flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-800 dark:text-slate-100 mb-1.5">
                    {adv.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                    {adv.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
