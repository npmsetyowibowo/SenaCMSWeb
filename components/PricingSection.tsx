'use client';

import React from 'react';
import { Check, Sparkles, MessageCircle, ArrowRight, DollarSign } from 'lucide-react';
import { PricingPlan } from '@/lib/db/types';
import { SectionBubble } from './SectionBubble';

interface PricingSectionProps {
  plans: PricingPlan[];
  whatsappNumber?: string;
  badgeText?: string;
}

export function PricingSection({ plans, whatsappNumber = '6281234567890', badgeText }: PricingSectionProps) {
  const defaultPlans: PricingPlan[] = [
    {
      id: 1,
      name: 'Paket Basic',
      price: 'Rp750.000',
      price_numeric: 750000,
      period: 'Sekali Bayar',
      description: 'Cocok untuk UMKM pemula, landing page promosi, portofolio pribadi, atau bisnis kuliner.',
      features: [
        'Landing Page 1 Halaman Responsif',
        'Domain .my.id / .biz.id Gratis 1 Tahun',
        'Hosting SSD Super Cepat',
        'Integrasi Tombol WhatsApp Direct',
        'SEO Basic Setup Google',
        'Garansi & Panduan Penggunaan',
      ],
      is_popular: false,
      cta_text: 'Pilih Paket Basic',
      created_at: new Date().toISOString(),
    },
    {
      id: 2,
      name: 'Paket Medium',
      price: 'Rp1.800.000',
      price_numeric: 1800000,
      period: 'Sekali Bayar',
      description: 'Pilihan paling populer untuk Company Profile, klinik, instansi, atau bisnis berkembang.',
      features: [
        'Hingga 5 Halaman Dinamis',
        'Domain .COM / .ID Gratis 1 Tahun',
        'Cloud Hosting Unlimited Bandwidth',
        'Desain Modern Neumorphic Eksklusif',
        'Sistem Blog & Artikel Terintegrasi',
        'SEO On-Page & Schema Markup Lengkap',
        'Email Bisnis Profesional (info@domain.com)',
        'Dukungan Maintenance 3 Bulan',
      ],
      is_popular: true,
      cta_text: 'Pilih Paket Medium',
      created_at: new Date().toISOString(),
    },
    {
      id: 3,
      name: 'Paket Premium',
      price: 'Rp3.200.000',
      price_numeric: 3200000,
      period: 'Sekali Bayar',
      description: 'Solusi lengkap bisnis korporasi, toko online katalog lengkap, atau website custom sekolah.',
      features: [
        'Hingga 10+ Halaman Kustom',
        'Domain .COM / .CO.ID Gratis 1 Tahun',
        'Dedicated Server Hosting Turbo Speed',
        'Dashboard CMS Admin SenaWeb Mandiri',
        'Fitur E-Commerce / Katalog / Booking',
        'Realtime SEO Analyzer Terpasang',
        'Google Analytics & Traffic Tracker',
        'Garansi Keamanan & Backup Berkala',
        'Dukungan VIP & Maintenance 6 Bulan',
      ],
      is_popular: false,
      cta_text: 'Pilih Paket Premium',
      created_at: new Date().toISOString(),
    },
  ];

  const items = plans && plans.length > 0 ? plans : defaultPlans;

  return (
    <section className="py-16 sm:py-24 relative" id="paket">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="mb-4">
            <SectionBubble
              icon={<DollarSign className="w-5 h-5 stroke-[2.2]" />}
              text={badgeText || 'PILIHAN PAKET INVESTASI TRANSPARAN'}
            />
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-800 tracking-tight">
            Paket Biaya Jasa Pembuatan Website
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-500">
            Investasi cerdas sekali bayar untuk aset digital berharga Anda. Sudah termasuk domain resmi, hosting cloud, dan bimbingan sampai bisa.
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {items.map((plan) => {
            const isPop = plan.is_popular;
            return (
              <div
                key={plan.id}
                className={`rounded-3xl p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 relative ${
                  isPop
                    ? 'neu-flat border-2 border-blue-500 dark:border-blue-400 scale-100 lg:-translate-y-2 shadow-2xl'
                    : 'neu-flat border border-slate-200/60 dark:border-slate-800'
                }`}
              >
                {/* Popular Pill */}
                {isPop && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-xs uppercase tracking-wider shadow-md flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    <span>Paling Diminati</span>
                  </div>
                )}

                <div>
                  <div className="mb-4">
                    <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">{plan.name}</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 min-h-[34px]">
                      {plan.description}
                    </p>
                  </div>

                  {/* Price */}
                  <div className="p-4 rounded-2xl neu-pressed-sm mb-6">
                    <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100">
                      {plan.price}
                    </div>
                    <span className="text-[11px] font-semibold text-slate-400">
                      {plan.period || 'Sekali Bayar (Tanpa Biaya Bulanan)'}
                    </span>
                  </div>

                  {/* Features */}
                  <div className="space-y-3 mb-8">
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Fasilitas yang Anda dapatkan:
                    </p>
                    <ul className="space-y-2.5">
                      {plan.features.map((feat, idx) => (
                        <li key={idx} className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 flex items-start gap-2.5">
                          <div className="w-4 h-4 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                            <Check className="w-3 h-3" />
                          </div>
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* CTA */}
                <div>
                  <a
                    href={`https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                      `Halo SenaWeb, saya tertarik untuk memesan ${plan.name} (${plan.price}). Mohon info langkah selanjutnya.`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`w-full py-3 px-4 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all ${
                      isPop
                        ? 'neu-accent-btn text-white shadow-lg'
                        : 'neu-button text-slate-800 dark:text-slate-100 hover:text-blue-600'
                    }`}
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>{plan.cta_text || 'Pesan Paket Ini'}</span>
                  </a>
                  <p className="text-[10px] text-center text-slate-400 mt-2">
                    Proses Cepat & Garansi Revisi
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
