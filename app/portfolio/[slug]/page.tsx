import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getPortfolioBySlug, getSettings } from '@/lib/db';
import { ArrowLeft, ArrowUpRight, Building2, Check, Sparkles, MessageCircle } from 'lucide-react';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const item = await getPortfolioBySlug(slug);
  if (!item) return { title: 'Portofolio Tidak Ditemukan' };

  return {
    title: `${item.title} – Portofolio SenaWeb`,
    description: item.description,
  };
}

export default async function PortfolioDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const item = await getPortfolioBySlug(slug);
  if (!item) notFound();

  const settings = await getSettings();
  const whatsappNumber = settings.whatsapp_number || '6281234567890';

  return (
    <div className="py-12 sm:py-16 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
      <div>
        <Link
          href="/#portfolio"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 mb-4"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Kembali ke Portofolio</span>
        </Link>
        <span className="block text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-1">
          {item.category} • {item.client}
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
          {item.title}
        </h1>
      </div>

      <div className="neu-flat rounded-3xl overflow-hidden aspect-[16/9] border border-slate-200/80 dark:border-slate-800">
        <img
          src={item.thumbnail || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&auto=format&fit=crop&q=80'}
          alt={item.title}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-8 neu-flat p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 space-y-4">
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">
            Tentang Proyek Ini
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
            {item.description}
          </p>
          <div className="pt-4 border-t border-slate-200/80 dark:border-slate-800">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Teknologi & Fitur Utama:
            </h3>
            <div className="flex flex-wrap gap-2">
              {item.tech_stack?.map((t, idx) => (
                <span
                  key={idx}
                  className="neu-flat-xs px-3 py-1 rounded-xl text-xs font-semibold text-blue-600 dark:text-blue-400"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 neu-flat p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 space-y-4 text-center">
          <h3 className="font-bold text-base text-slate-800 dark:text-slate-100">
            Tertarik dengan Website Serupa?
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Dapatkan website dengan fitur dan keindahan desain seperti portofolio ini.
          </p>
          {item.url && (
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full neu-button py-2.5 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center justify-center gap-1.5"
            >
              <span>Kunjungi Live Demo</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          )}
          <a
            href={`https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
              `Halo SenaWeb, saya suka portofolio "${item.title}". Bisakah saya konsultasi untuk proyek serupa?`
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full neu-accent-btn py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span>Pesan Desain Serupa</span>
          </a>
        </div>
      </div>
    </div>
  );
}
