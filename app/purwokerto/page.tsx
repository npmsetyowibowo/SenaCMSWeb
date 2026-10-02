import React from 'react';
import type { Metadata } from 'next';
import { getPricingPlans, getTestimonials, getFaqs, getSettings, getCityBySlug } from '@/lib/db';
import { CityLandingTemplate } from '@/components/CityLandingTemplate';

export const metadata: Metadata = {
  title: 'Jasa Pembuatan Website Purwokerto – Banyumas Digital Solution',
  description: 'Jasa pembuatan website profesional di Purwokerto & Banyumas. Desain modern, responsive, dan SEO optimal.',
};

export default async function PurwokertoPage() {
  const [plans, testimonials, faqs, settings, city] = await Promise.all([
    getPricingPlans(),
    getTestimonials(),
    getFaqs(),
    getSettings(),
    getCityBySlug('purwokerto'),
  ]);

  return (
    <CityLandingTemplate
      cityName={city?.city_name || 'Purwokerto'}
      provinceName={city?.province_name || 'Jawa Tengah'}
      heroTitle={city?.hero_title || 'Jasa Pembuatan Website Purwokerto & Banyumas – Terpercaya & SEO Friendly'}
      heroSubtitle={city?.hero_subtitle || 'Hadirkan identitas digital modern bagi pelaku bisnis, kuliner, pendidikan, dan jasa di Purwokerto dengan website elegan dan responsif.'}
      badgeText={city?.badge_text}
      localKeywords={city?.local_keywords || ['jasa website purwokerto', 'bikin web purwokerto', 'jasa web banyumas']}
      customFaqs={city?.faqs}
      plans={plans}
      testimonials={testimonials}
      faqs={faqs}
      whatsappNumber={settings.whatsapp_number}
    />
  );
}
