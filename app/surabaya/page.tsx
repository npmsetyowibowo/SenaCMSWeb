import React from 'react';
import type { Metadata } from 'next';
import { getPricingPlans, getTestimonials, getFaqs, getSettings, getCityBySlug } from '@/lib/db';
import { CityLandingTemplate } from '@/components/CityLandingTemplate';

export const metadata: Metadata = {
  title: 'Jasa Pembuatan Website Surabaya – No. 1 Agensi Digital',
  description: 'Jasa bikin website profesional di Surabaya dengan standar internasional, loading cepat, dan optimasi SEO Google.',
};

export default async function SurabayaPage() {
  const [plans, testimonials, faqs, settings, city] = await Promise.all([
    getPricingPlans(),
    getTestimonials(),
    getFaqs(),
    getSettings(),
    getCityBySlug('surabaya'),
  ]);

  return (
    <CityLandingTemplate
      cityName={city?.city_name || 'Surabaya'}
      provinceName={city?.province_name || 'Jawa Timur'}
      heroTitle={city?.hero_title || 'Jasa Pembuatan Website Surabaya – Solusi Digital Terbaik Perusahaan & UMKM'}
      heroSubtitle={city?.hero_subtitle || 'Tingkatkan kredibilitas bisnis Anda di Kota Pahlawan dengan website berkecepatan tinggi, desain Neumorphic eksklusif, dan integrasi WhatsApp.'}
      badgeText={city?.badge_text}
      localKeywords={city?.local_keywords || ['jasa website surabaya', 'bikin web surabaya', 'web umkm surabaya']}
      customFaqs={city?.faqs}
      plans={plans}
      testimonials={testimonials}
      faqs={faqs}
      whatsappNumber={settings.whatsapp_number}
    />
  );
}
