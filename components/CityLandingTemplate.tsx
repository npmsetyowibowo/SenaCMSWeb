'use client';

import React from 'react';
import Link from 'next/link';
import {
  MapPin,
  Sparkles,
  CheckCircle,
  Phone,
  MessageCircle,
  TrendingUp,
  Zap,
  ShieldCheck,
  Building,
  ArrowRight,
} from 'lucide-react';
import { ContactForm } from './ContactForm';
import { ServicesSection } from './ServicesSection';
import { WhyUsSection } from './WhyUsSection';
import { PricingSection } from './PricingSection';
import { TestimonialSection } from './TestimonialSection';
import { FaqSection } from './FaqSection';
import { SectionBubble } from './SectionBubble';
import { PricingPlan, Testimonial, FAQ } from '@/lib/db/types';

interface CityLandingTemplateProps {
  cityName: string;
  provinceName: string;
  heroTitle: string;
  heroSubtitle: string;
  badgeText?: string;
  localKeywords: string[];
  plans: PricingPlan[];
  testimonials: Testimonial[];
  faqs: FAQ[];
  customFaqs?: { question: string; answer: string }[];
  whatsappNumber?: string;
}

export function CityLandingTemplate({
  cityName,
  provinceName,
  heroTitle,
  heroSubtitle,
  badgeText,
  localKeywords,
  plans,
  testimonials,
  faqs,
  customFaqs,
  whatsappNumber = '6281234567890',
}: CityLandingTemplateProps) {
  // Localized city FAQs
  const parsedCustomFaqs: FAQ[] = customFaqs && customFaqs.length > 0
    ? customFaqs.map((cf, idx) => ({
        id: 990 + idx,
        question: cf.question,
        answer: cf.answer,
        category: 'Lokal',
        order_index: idx + 1,
        created_at: new Date().toISOString(),
      }))
    : [
        {
          id: 991,
          question: `Apakah tim SenaWeb melayani konsultasi langsung / online di ${cityName}?`,
          answer: `Tentu saja! Kami melayani klien di wilayah ${cityName} dan sekitarnya baik secara online via WhatsApp & Zoom meeting, maupun koordinasi tatap muka sesuai kesepakatan jadwal proyek.`,
          category: 'Lokal',
          order_index: 1,
          created_at: new Date().toISOString(),
        },
        {
          id: 992,
          question: `Berapa lama website bisnis di ${cityName} bisa tayang di Google?`,
          answer: `Website paket Basic dan Medium rata-rata selesai dalam 3–7 hari kerja. Proses indexing awal Google umumnya memakan waktu 24–48 jam setelah kami mendaftarkan sitemap ke Google Search Console.`,
          category: 'Lokal',
          order_index: 2,
          created_at: new Date().toISOString(),
        },
      ];

  const allCityFaqs: FAQ[] = [...parsedCustomFaqs, ...faqs];

  return (
    <div className="space-y-12">
      {/* City Hero */}
      <section className="relative pt-8 pb-16 sm:pt-14 sm:pb-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-6">
            <Link href="/" className="hover:text-blue-600">Home</Link>
            <span>/</span>
            <Link href="/#layanan" className="hover:text-blue-600">Wilayah Layanan</Link>
            <span>/</span>
            <span className="text-blue-600 dark:text-blue-400 font-bold">{cityName}</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-7 space-y-6">
              {/* City Bubble Kecil (Matches user reference screenshot) */}
              <div>
                <SectionBubble
                  icon={<MapPin className="w-4 h-4 text-rose-500" />}
                  text={badgeText || `Pusat Layanan Web Resmi Wilayah ${cityName}, ${provinceName}`}
                />
              </div>

              {/* City Targeted H1 */}
              <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-slate-100 tracking-tight leading-[1.15]">
                {heroTitle}
              </h1>

              {/* City Subtitle */}
              <p className="text-sm sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
                {heroSubtitle}
              </p>

              {/* Local Keywords Chips */}
              <div className="space-y-1.5 pt-2">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Target Keyword Penelusuran {cityName}:
                </p>
                <div className="flex flex-wrap gap-2">
                  {localKeywords.map((kw, idx) => (
                    <span
                      key={idx}
                      className="neu-flat-xs px-3 py-1 rounded-xl text-xs font-semibold text-blue-600 dark:text-blue-400"
                    >
                      #{kw}
                    </span>
                  ))}
                </div>
              </div>

              {/* CTA Row */}
              <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
                <a
                  href="#formulir-kota"
                  className="w-full sm:w-auto neu-accent-btn px-8 py-3.5 rounded-2xl font-bold text-sm sm:text-base flex items-center justify-center gap-2 tracking-wide shadow-lg"
                >
                  <MessageCircle className="w-5 h-5" />
                  <span>Konsultasi Proyek {cityName}</span>
                </a>
                <a
                  href="#paket"
                  className="w-full sm:w-auto neu-button px-7 py-3.5 rounded-2xl font-semibold text-sm sm:text-base text-slate-700 dark:text-slate-200 flex items-center justify-center gap-2"
                >
                  <span>Daftar Harga Pembuatan</span>
                </a>
              </div>
            </div>

            {/* Right Card: Quick City Consultation Form */}
            <div className="lg:col-span-5" id="formulir-kota">
              <ContactForm cityName={cityName} defaultService="Company Profile" />
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <ServicesSection />

      {/* Why Us */}
      <WhyUsSection />

      {/* Pricing */}
      <PricingSection plans={plans} whatsappNumber={whatsappNumber} />

      {/* Testimonials */}
      <TestimonialSection testimonials={testimonials} />

      {/* FAQs */}
      <FaqSection faqs={allCityFaqs} />

      {/* Final City CTA Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="neu-flat p-8 sm:p-12 rounded-3xl border border-slate-200/60 dark:border-slate-800 text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl neu-flat-sm text-blue-600 mx-auto flex items-center justify-center">
            <Building className="w-6 h-6" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-800 dark:text-slate-100">
            Siap Dominasi Pasar Online di {cityName}?
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
            Jangan biarkan calon pelanggan di {cityName} beralih ke kompetitor Anda. Segera miliki website profesional bersama tim SenaWeb.
          </p>
          <div className="pt-2 flex justify-center gap-4">
            <a
              href={`https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                `Halo SenaWeb, saya ingin membuat website untuk bisnis saya di kota ${cityName}.`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="neu-accent-btn px-8 py-3 rounded-xl font-bold text-sm flex items-center gap-2"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Hubungi CS WhatsApp {cityName}</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
