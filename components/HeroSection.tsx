'use client';

import React from 'react';
import Link from 'next/link';
import {
  MessageCircle,
  Briefcase,
  Sparkles,
  ShieldCheck,
  Zap,
  TrendingUp,
  Star,
  CheckCircle,
} from 'lucide-react';
import { SectionBubble } from './SectionBubble';

interface HeroSectionProps {
  brandAmbassadorImage?: string;
  brandAmbassadorName?: string;
  brandAmbassadorRole?: string;
  whatsappNumber?: string;
  badgeText?: string;
}

export function HeroSection({
  brandAmbassadorImage = 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&auto=format&fit=crop&q=80',
  brandAmbassadorName = 'Clarissa Sena, S.Kom., M.M.',
  brandAmbassadorRole = 'Lead Digital Strategist & Brand Ambassador SenaWeb',
  whatsappNumber = '6281234567890',
  badgeText,
}: HeroSectionProps) {
  return (
    <section className="relative pt-8 pb-16 sm:pt-14 sm:pb-24 overflow-hidden">
      {/* Background Soft Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-blue-400/10 dark:bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Headline & CTAs */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            {/* Bubble Kecil (Matches user reference screenshot) */}
            <div>
              <SectionBubble
                icon={<Sparkles className="w-4 h-4 stroke-[2.2]" />}
                text={badgeText || 'Jasa Pembuatan Website Profesional No. 1 di Indonesia'}
              />
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 dark:text-slate-100 tracking-tight leading-[1.15]">
              Tingkatkan Omset Bisnis dengan{' '}
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Website Modern & Ramah SEO
              </span>
            </h1>

            {/* Subheading */}
            <p className="text-sm sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl mx-auto lg:mx-0">
              Solusi pembuatan website Company Profile, UMKM, Landing Page penjualan, dan E-Commerce dengan estetika Neumorphic elegan, kecepatan kilat, serta struktur SEO Google terbaik.
            </p>

            {/* Key Value Points */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2 max-w-lg mx-auto lg:mx-0">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300">
                <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Desain Kustom Eksklusif</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300">
                <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>SEO On-Page & Schema</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300">
                <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Gratis Domain & Hosting</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
              <Link
                href="/kontak"
                className="w-full sm:w-auto neu-accent-btn px-8 py-3.5 rounded-2xl font-bold text-sm sm:text-base flex items-center justify-center gap-2.5 shadow-lg tracking-wide hover:scale-105 transition-transform"
              >
                <MessageCircle className="w-5 h-5" />
                <span>Konsultasi Sekarang (Gratis)</span>
              </Link>

              <Link
                href="/portfolio"
                className="w-full sm:w-auto neu-button px-7 py-3.5 rounded-2xl font-semibold text-sm sm:text-base text-slate-700 dark:text-slate-200 flex items-center justify-center gap-2 hover:text-blue-600 transition-colors"
              >
                <Briefcase className="w-5 h-5 text-blue-500" />
                <span>Lihat Hasil Portfolio</span>
              </Link>
            </div>

            {/* Social Proof Bar */}
            <div className="pt-4 flex items-center justify-center lg:justify-start gap-4 text-xs text-slate-500 dark:text-slate-400">
              <div className="flex -space-x-2">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=60&auto=format&fit=crop&q=80"
                  alt="Client"
                  className="w-8 h-8 rounded-full border-2 border-white dark:border-slate-800 object-cover"
                />
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&auto=format&fit=crop&q=80"
                  alt="Client"
                  className="w-8 h-8 rounded-full border-2 border-white dark:border-slate-800 object-cover"
                />
                <img
                  src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=60&auto=format&fit=crop&q=80"
                  alt="Client"
                  className="w-8 h-8 rounded-full border-2 border-white dark:border-slate-800 object-cover"
                />
              </div>
              <div className="flex items-center gap-1">
                <div className="flex text-amber-400">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                  ))}
                </div>
                <span className="font-bold text-slate-700 dark:text-slate-300">4.9/5.0</span>
                <span>(150+ Ulasan Klien Puas)</span>
              </div>
            </div>
          </div>

          {/* Right Column: Visual Ambassador & Neumorphic Badge Card */}
          <div className="lg:col-span-5 relative flex justify-center">
            <div className="relative w-full max-w-md">
              {/* Main Card with Ambassador Photo */}
              <div className="neu-flat p-4 sm:p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 relative z-10">
                <div className="relative rounded-2xl overflow-hidden aspect-[4/5] neu-pressed-sm">
                  <img
                    src={brandAmbassadorImage}
                    alt={brandAmbassadorName}
                    className="w-full h-full object-cover object-top"
                  />
                  {/* Overlay Gradient on bottom */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-5 text-white">
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-blue-600 inline-block w-max mb-1">
                      Official Brand Ambassador
                    </span>
                    <h3 className="font-bold text-lg text-white leading-tight">
                      {brandAmbassadorName}
                    </h3>
                    <p className="text-xs text-slate-200 mt-0.5">
                      {brandAmbassadorRole}
                    </p>
                  </div>
                </div>
              </div>

              {/* Floating Badge 1: SEO Score */}
              <div className="absolute -top-4 -left-4 sm:-left-8 z-20 neu-flat p-3.5 rounded-2xl flex items-center gap-3 border border-slate-200/70 dark:border-slate-700 shadow-xl animate-bounce-slow">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[10px] text-slate-400 uppercase font-bold">Google Index</div>
                  <div className="text-sm font-black text-slate-800 dark:text-slate-100">98% SEO Friendly</div>
                </div>
              </div>

              {/* Floating Badge 2: Super Fast Speed */}
              <div className="absolute -bottom-6 -right-4 sm:-right-6 z-20 neu-flat p-3.5 rounded-2xl flex items-center gap-3 border border-slate-200/70 dark:border-slate-700 shadow-xl">
                <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/60 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[10px] text-slate-400 uppercase font-bold">Core Web Vitals</div>
                  <div className="text-sm font-black text-slate-800 dark:text-slate-100">0.8 Detik Loading</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
