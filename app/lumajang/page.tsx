import React from 'react';
import type { Metadata } from 'next';
import { getPricingPlans, getTestimonials, getFaqs, getSettings, getCityBySlug } from '@/lib/db';
import { CityLandingTemplate } from '@/components/CityLandingTemplate';

export const metadata: Metadata = {
  title: 'Jasa Pembuatan Website Lumajang – Solusi Go Digital UMKM',
  description: 'Bikin website terjangkau dan berkualitas di Lumajang. Desain elegan, cepat, dan terdaftar di Google.',
};

export default async function LumajangPage() {
  const [plans, testimonials, faqs, settings, city] = await Promise.all([
    getPricingPlans(),
    getTestimonials(),
    getFaqs(),
    getSettings(),
    getCityBySlug('lumajang'),
  ]);

  return (
    <CityLandingTemplate
      cityName={city?.city_name || 'Lumajang'}
      provinceName={city?.province_name || 'Jawa Timur'}
      heroTitle={city?.hero_title || 'Jasa Pembuatan Website Lumajang – Murah, Profesional & Bergaransi'}
      heroSubtitle={city?.hero_subtitle || 'Kembangkan potensi wisata, perkebunan, kuliner, dan UMKM Lumajang ke pasar digital nasional dengan website cepat dan ramah Google.'}
      badgeText={city?.badge_text}
      localKeywords={city?.local_keywords || ['jasa website lumajang', 'bikin web lumajang', 'web umkm lumajang']}
      customFaqs={city?.faqs}
      plans={plans}
      testimonials={testimonials}
      faqs={faqs}
      whatsappNumber={settings.whatsapp_number}
    />
  );
}
