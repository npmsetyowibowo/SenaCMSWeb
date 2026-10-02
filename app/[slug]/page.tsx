import React from 'react';
import type { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import { getPageBySlug, getCityBySlug, getPricingPlans, getTestimonials, getFaqs, getSettings } from '@/lib/db';
import { ArrowLeft } from 'lucide-react';
import { CityLandingTemplate } from '@/components/CityLandingTemplate';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  if (slug === 'senacms') {
    return { title: 'SenaCMS Admin Login' };
  }
  const settings = await getSettings();
  const domain = settings.site_domain || 'https://senaweb.id';

  // Check if it is a City landing page
  const city = await getCityBySlug(slug);
  if (city && city.status === 'published') {
    return {
      title: city.meta_title || `${city.hero_title} | SenaWeb`,
      description: city.meta_description || city.hero_subtitle,
      keywords: city.local_keywords || [],
      alternates: {
        canonical: `${domain}/${city.slug}`,
      },
      openGraph: {
        title: city.meta_title || city.hero_title,
        description: city.meta_description || city.hero_subtitle,
        url: `${domain}/${city.slug}`,
      },
    };
  }

  // Check if it is a custom page
  const page = await getPageBySlug(slug);
  if (!page || page.status !== 'published') {
    return { title: 'Halaman Tidak Ditemukan' };
  }

  return {
    title: page.seo_title || page.title,
    description: page.seo_description || page.excerpt,
    alternates: {
      canonical: `${domain}/${page.slug}`,
    },
    openGraph: {
      title: page.seo_title || page.title,
      description: page.seo_description || page.excerpt,
      url: `${domain}/${page.slug}`,
    },
  };
}

export default async function DynamicCustomPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  if (slug === 'senacms') {
    redirect('/senacms/login');
  }

  // 1. First check if slug belongs to a Kota Layanan
  const city = await getCityBySlug(slug);
  if (city && city.status === 'published') {
    const [plans, testimonials, faqs, settings] = await Promise.all([
      getPricingPlans(),
      getTestimonials(),
      getFaqs(),
      getSettings(),
    ]);

    return (
      <CityLandingTemplate
        cityName={city.city_name}
        provinceName={city.province_name}
        heroTitle={city.hero_title}
        heroSubtitle={city.hero_subtitle}
        badgeText={city.badge_text}
        localKeywords={city.local_keywords || []}
        customFaqs={city.faqs}
        plans={plans}
        testimonials={testimonials}
        faqs={faqs}
        whatsappNumber={settings.whatsapp_number}
      />
    );
  }

  // 2. Otherwise check custom standard page
  const page = await getPageBySlug(slug);
  if (!page || page.status !== 'published') {
    notFound();
  }

  return (
    <div className="py-12 sm:py-18 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      <div>
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 mb-4"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Kembali ke Beranda</span>
        </Link>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
          {page.title}
        </h1>
        {page.excerpt && (
          <p className="mt-3 text-base text-slate-500 dark:text-slate-400 leading-relaxed">
            {page.excerpt}
          </p>
        )}
      </div>

      <div className="neu-flat p-6 sm:p-10 rounded-3xl border border-slate-200/80 dark:border-slate-800">
        <div
          className="prose dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 leading-relaxed space-y-4 text-sm sm:text-base"
          dangerouslySetInnerHTML={{ __html: page.content }}
        />
      </div>
    </div>
  );
}
