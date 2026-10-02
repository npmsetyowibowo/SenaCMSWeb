import React from 'react';
import type { Metadata } from 'next';
import { getPricingPlans, getTestimonials, getFaqs, getSettings, getCityBySlug } from '@/lib/db';
import { CityLandingTemplate } from '@/components/CityLandingTemplate';

export const metadata: Metadata = {
  title: 'Jasa Pembuatan Website Sidoarjo – Profesional, Murah & Bergaransi',
  description: 'Jasa pembuatan website profesional di Sidoarjo untuk industri, UMKM, dan toko online. Desain responsif Neumorphic, cepat, dan siap menduduki halaman satu Google.',
  keywords: [
    'jasa pembuatan website sidoarjo',
    'jasa web sidoarjo',
    'bikin web sidoarjo',
    'web umkm sidoarjo',
    'jasa seo sidoarjo',
    'company profile sidoarjo',
  ],
  openGraph: {
    title: 'Jasa Pembuatan Website Sidoarjo – SenaWeb',
    description: 'Solusi website terbaik untuk memajukan bisnis dan industri di wilayah Sidoarjo dan sekitarnya.',
  },
};

export default async function SidoarjoPage() {
  const [plans, testimonials, faqs, settings, city] = await Promise.all([
    getPricingPlans(),
    getTestimonials(),
    getFaqs(),
    getSettings(),
    getCityBySlug('sidoarjo'),
  ]);

  return (
    <CityLandingTemplate
      cityName={city?.city_name || 'Sidoarjo'}
      provinceName={city?.province_name || 'Jawa Timur'}
      heroTitle={city?.hero_title || 'Jasa Pembuatan Website Sidoarjo – Profesional & Siap Ranking 1 Google'}
      heroSubtitle={city?.hero_subtitle || 'Bantu pertumbuhan usaha industri, manufaktur, perdagangan, dan UMKM di Sidoarjo dengan website modern yang teroptimasi SEO lokal dan direct WhatsApp.'}
      badgeText={city?.badge_text}
      localKeywords={city?.local_keywords || [
        'jasa website sidoarjo',
        'bikin web sidoarjo',
        'web umkm sidoarjo',
        'company profile sidoarjo',
        'jasa web waru gempol',
      ]}
      customFaqs={city?.faqs}
      plans={plans}
      testimonials={testimonials}
      faqs={faqs}
      whatsappNumber={settings.whatsapp_number}
    />
  );
}
