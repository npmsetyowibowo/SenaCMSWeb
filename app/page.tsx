import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import {
  getSettings,
  getPricingPlans,
  getPortfolioList,
  getTestimonials,
  getFaqs,
  getArticles,
  getCities,
} from '@/lib/db';
import { HeroSection } from '@/components/HeroSection';
import { ServicesSection } from '@/components/ServicesSection';
import { WhyUsSection } from '@/components/WhyUsSection';
import { PricingSection } from '@/components/PricingSection';
import { PortfolioSection } from '@/components/PortfolioSection';
import { TestimonialSection } from '@/components/TestimonialSection';
import { FaqSection } from '@/components/FaqSection';
import { ContactForm } from '@/components/ContactForm';
import {
  ArrowRight,
  BookOpen,
  Calendar,
  Clock,
  Sparkles,
  MapPin,
  CheckCircle,
} from 'lucide-react';

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  const domain = settings.site_domain || 'https://senaweb.id';
  const siteName = settings.site_name || 'SenaWeb';
  const siteTagline = settings.site_tagline || 'JASA PEMBUATAN WEBSITE';
  const title = settings.seo_home_title || `${siteName} – ${siteTagline} Profesional & Cepat No. 1`;
  const description = settings.seo_home_description || settings.site_description || 'Jasa pembuatan website profesional, modern Neumorphic, SEO-friendly, dan responsif untuk UMKM, Company Profile, dan Bisnis Indonesia.';

  return {
    title,
    description,
    alternates: {
      canonical: domain,
    },
    openGraph: {
      title,
      description,
      url: domain,
    },
  };
}

export default async function HomePage() {
  const [settings, plans, portfolio, testimonials, faqs, articlesRes, cities] = await Promise.all([
    getSettings(),
    getPricingPlans(),
    getPortfolioList(),
    getTestimonials(),
    getFaqs(),
    getArticles({ status: 'published', limit: 3 }),
    getCities(),
  ]);

  const recentArticles = articlesRes.articles;
  const activeCities = cities.filter((c) => c.status === 'published');

  return (
    <div className="space-y-6 sm:space-y-12">
      {/* Hero Section */}
      <HeroSection
        brandAmbassadorImage={settings.brand_ambassador_image}
        brandAmbassadorName={settings.brand_ambassador_name}
        brandAmbassadorRole={settings.brand_ambassador_role}
        whatsappNumber={settings.whatsapp_number}
        badgeText={settings.hero_badge_text}
      />

      {/* Services Section */}
      <ServicesSection badgeText={settings.services_badge_text} />

      {/* Why Us Section */}
      <WhyUsSection badgeText={settings.whyus_badge_text} />

      {/* Pricing Section (Fetched from DB) */}
      <PricingSection plans={plans} whatsappNumber={settings.whatsapp_number} badgeText={settings.pricing_badge_text} />

      {/* Portfolio Showcase Section (Fetched from DB) */}
      <PortfolioSection portfolioList={portfolio} badgeText={settings.portfolio_badge_text} />

      {/* Testimonials Section (Fetched from DB) */}
      <TestimonialSection testimonials={testimonials} badgeText={settings.testimonials_badge_text} />

      {/* City Hub Banner (SEO Booster for 5 Cities) */}
      <section className="py-12 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="neu-flat p-8 sm:p-10 rounded-3xl border border-slate-200/60 dark:border-slate-800">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 mb-2">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>Jangkauan Wilayah Khusus</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-slate-100">
                  Layanan Pembuatan Website di Kota Anda
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                  Kami memiliki halaman khusus dan optimasi SEO lokal untuk kota-kota strategis di Jawa Timur & Jawa Tengah.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {activeCities.map((city) => (
                <Link
                  key={city.id}
                  href={`/${city.slug}`}
                  className="neu-button p-4 rounded-2xl flex flex-col justify-between group hover:scale-[1.02] transition-all"
                >
                  <div>
                    <div className="w-8 h-8 rounded-xl neu-flat-xs flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold text-xs mb-2">
                      <MapPin className="w-4 h-4 text-rose-500" />
                    </div>
                    <h4 className="font-bold text-sm text-slate-800 dark:text-slate-100 group-hover:text-blue-600 transition-colors">
                      {city.city_name}
                    </h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-snug line-clamp-2">
                      {city.badge_text || `Layanan Website Resmi ${city.city_name}`}
                    </p>
                  </div>
                  <div className="mt-4 pt-2 border-t border-slate-200/50 dark:border-slate-800 flex items-center justify-between text-xs font-semibold text-blue-600 dark:text-blue-400">
                    <span>Lihat Halaman</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Recent Blog Section */}
      {recentArticles.length > 0 && (
        <section className="py-16 relative" id="blog-terbaru">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 neu-flat-xs mb-3">
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Wawasan Digital Terkini</span>
                </div>
                <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-800 dark:text-slate-100 tracking-tight">
                  Artikel & Tips Bisnis Online
                </h2>
                <p className="mt-2 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                  Pelajari strategi digitalisasi, optimasi SEO Google, dan teknologi web modern langsung dari para praktisi.
                </p>
              </div>
              <Link
                href="/blog"
                className="neu-button px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-blue-600 dark:text-blue-400 flex items-center gap-1.5 self-start sm:self-auto hover:text-blue-700"
              >
                <span>Kunjungi Blog Lengkap</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {recentArticles.map((article) => (
                <article
                  key={article.id}
                  className="neu-flat rounded-3xl overflow-hidden flex flex-col justify-between border border-slate-200/50 dark:border-slate-800 hover:-translate-y-2 transition-all duration-300 group"
                >
                  <div>
                    <Link href={`/blog/${article.slug}`} className="block relative aspect-[16/10] overflow-hidden">
                      <img
                        src={article.thumbnail || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&auto=format&fit=crop&q=80'}
                        alt={article.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                      />
                      {article.category && (
                        <span className="absolute top-3 left-3 px-3 py-1 rounded-xl bg-black/60 backdrop-blur-md text-white text-[11px] font-semibold">
                          {article.category.name}
                        </span>
                      )}
                    </Link>

                    <div className="p-6">
                      <div className="flex items-center gap-3 text-xs text-slate-400 mb-2">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          {new Date(article.created_at).toLocaleDateString('id-ID', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          {article.reading_time || 3} mnt baca
                        </span>
                      </div>

                      <h3 className="font-bold text-base sm:text-lg text-slate-800 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2 leading-snug">
                        <Link href={`/blog/${article.slug}`}>
                          {article.title}
                        </Link>
                      </h3>

                      <p className="mt-2 text-xs sm:text-sm text-slate-500 dark:text-slate-400 line-clamp-3 leading-relaxed">
                        {article.excerpt}
                      </p>
                    </div>
                  </div>

                  <div className="px-6 pb-6 pt-0">
                    <Link
                      href={`/blog/${article.slug}`}
                      className="neu-button py-2 px-4 rounded-xl text-xs font-semibold text-blue-600 dark:text-blue-400 flex items-center justify-between group-hover:neu-pressed transition-all"
                    >
                      <span>Baca Selengkapnya</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* FAQs Section (Fetched from DB) */}
      <FaqSection faqs={faqs} badgeText={settings.faq_badge_text} />

      {/* Main Homepage Contact Section */}
      <section className="py-16 sm:py-24 relative" id="kontak">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Info Column */}
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 neu-flat-xs">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Konsultasi Proyek Gratis</span>
              </div>
              <h2 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-slate-100 tracking-tight leading-tight">
                Mari Bicarakan Ide & Kebutuhan Website Anda
              </h2>
              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                Kirimkan rincian kebutuhan Anda melalui formulir di samping atau hubungi WhatsApp kami langsung. Tim SenaWeb siap memberikan solusi terbaik sesuai anggaran bisnis Anda.
              </p>

              {/* Guarantees */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                    <CheckCircle className="w-4 h-4" />
                  </div>
                  <span className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Estimasi Biaya Transparan Tanpa Biaya Tersembunyi
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                    <CheckCircle className="w-4 h-4" />
                  </div>
                  <span className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Waktu Pengerjaan Tepat Waktu Sesuai Kontrak
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                    <CheckCircle className="w-4 h-4" />
                  </div>
                  <span className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Panduan & Training Pengoperasian Sampai Bisa
                  </span>
                </div>
              </div>
            </div>

            {/* Right Contact Form Column */}
            <div className="lg:col-span-6">
              <ContactForm defaultService="Company Profile" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
