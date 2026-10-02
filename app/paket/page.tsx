import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Sparkles, CheckCircle, MessageCircle, ShieldCheck, Zap } from 'lucide-react';
import { getPricingPlans, getSettings, getFaqs } from '@/lib/db';
import { FaqSection } from '@/components/FaqSection';

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  const title = settings.seo_paket_title || 'Paket Harga Jasa Pembuatan Website – Murah & Transparan SenaWeb';
  const description = settings.seo_paket_description || 'Daftar harga paket pembuatan website SenaWeb: Paket Basic Rp750.000, Medium Rp1.800.000, Premium Rp3.200.000. Gratis domain, hosting, dan SSL.';

  return {
    title,
    description,
    openGraph: {
      title,
      description,
    },
  };
}

export default async function PaketPage() {
  const [plans, settings, faqs] = await Promise.all([
    getPricingPlans(),
    getSettings(),
    getFaqs(),
  ]);

  const whatsappNumber = settings.whatsapp_number || '6281234567890';

  return (
    <div className="py-12 sm:py-20 space-y-16">
      {/* Header */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full neu-flat-xs text-xs sm:text-sm font-semibold text-blue-700 dark:text-blue-300">
          <Sparkles className="w-4 h-4 text-blue-600 animate-spin-slow" />
          <span>PILIHAN PAKET INVESTASI TRANSPARAN</span>
        </div>

        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
          Investasi Terjangkau dengan{' '}
          <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Kualitas Premium
          </span>
        </h1>

        <p className="text-sm sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
          Seluruh paket sudah termasuk gratis domain, hosting berkecepatan tinggi, sertifikat SSL, dan garansi maintenance purna jual.
        </p>
      </section>

      {/* Pricing Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {plans.map((plan) => {
            const isMedium = plan.name.toLowerCase().includes('medium');
            return (
              <div
                key={plan.id}
                className={`neu-flat p-8 rounded-3xl border flex flex-col justify-between relative transition-all ${
                  isMedium
                    ? 'border-blue-500/80 shadow-2xl scale-105 z-10'
                    : 'border-slate-200/80 dark:border-slate-800'
                }`}
              >
                {isMedium && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                    <span className="neu-accent-btn px-4 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider shadow">
                      Paling Direkomendasikan
                    </span>
                  </div>
                )}

                <div className="space-y-6">
                  <div>
                    <h3 className="font-extrabold text-xl text-slate-900 dark:text-slate-100">
                      {plan.name}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      {plan.description}
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl neu-pressed-sm border border-slate-200/60 dark:border-slate-800">
                    <div className="text-3xl font-black text-blue-600 dark:text-blue-400">
                      {plan.price}
                    </div>
                    <span className="text-xs text-slate-400 font-semibold">{plan.period}</span>
                  </div>

                  <div className="space-y-2.5">
                    <div className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                      Fasilitas Termasuk:
                    </div>
                    {plan.features.map((feat, fIdx) => (
                      <div key={fIdx} className="flex items-start gap-2.5 text-xs text-slate-600 dark:text-slate-300">
                        <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-8">
                  <a
                    href={`https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                      `Halo SenaWeb, saya ingin memesan website: ${plan.name} (${plan.price}). Bisa dibantu prosesnya?`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`w-full py-3.5 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 transition-transform hover:scale-[1.02] shadow-md ${
                      isMedium ? 'neu-accent-btn' : 'neu-button text-blue-600'
                    }`}
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>{plan.cta_text || 'Pilih Paket Ini'}</span>
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* FAQs */}
      <FaqSection faqs={faqs} />
    </div>
  );
}
