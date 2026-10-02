import React from 'react';
import type { Metadata } from 'next';
import { getPricingPlans, getTestimonials, getFaqs, getSettings, getCityBySlug } from '@/lib/db';
import { CityLandingTemplate } from '@/components/CityLandingTemplate';

export const metadata: Metadata = {
  title: 'Jasa Pembuatan Website Solo Surakarta – Elegan & Siap Bersaing',
  description: 'Jasa pembuatan website terbaik di Solo Surakarta untuk UMKM, batik, wisata, dan company profile bisnis modern.',
};

export default async function SoloPage() {
  const [plans, testimonials, faqs, settings, city] = await Promise.all([
    getPricingPlans(),
    getTestimonials(),
    getFaqs(),
    getSettings(),
    getCityBySlug('solo'),
  ]);

  return (
    <CityLandingTemplate
      cityName={city?.city_name || 'Solo'}
      provinceName={city?.province_name || 'Jawa Tengah'}
      heroTitle={city?.hero_title || 'Jasa Pembuatan Website Solo (Surakarta) – Eksklusif & Siap Go Digital'}
      heroSubtitle={city?.hero_subtitle || 'Wujudkan website elegan untuk batik, kerajinan, kuliner, UMKM, dan korporasi di Solo Raya dengan teknologi modern dan optimasi SEO lokal.'}
      badgeText={city?.badge_text}
      localKeywords={city?.local_keywords || ['jasa website solo', 'bikin web solo surakarta', 'web umkm solo raya']}
      customFaqs={city?.faqs}
      plans={plans}
      testimonials={testimonials}
      faqs={faqs}
      whatsappNumber={settings.whatsapp_number}
    />
  );
}
