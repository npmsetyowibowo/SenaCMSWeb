'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ExternalLink, Sparkles, Layers, ArrowUpRight, Briefcase } from 'lucide-react';
import { Portfolio } from '@/lib/db/types';
import { SectionBubble } from './SectionBubble';

interface PortfolioSectionProps {
  portfolioList: Portfolio[];
  badgeText?: string;
}

export function PortfolioSection({ portfolioList, badgeText }: PortfolioSectionProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');

  const categories = ['Semua', ...Array.from(new Set(portfolioList.map((p) => p.category)))];

  const filtered =
    selectedCategory === 'Semua'
      ? portfolioList
      : portfolioList.filter((p) => p.category === selectedCategory);

  return (
    <section className="py-16 sm:py-24 relative bg-[#eef2f6]/40" id="portfolio">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="mb-4">
            <SectionBubble
              icon={<Briefcase className="w-5 h-5 stroke-[2.2]" />}
              text={badgeText || 'KARYA & HASIL KERJA KAMI'}
            />
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-800 tracking-tight">
            Hasil Karya Nyata Untuk Klien Kami
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-500">
            Kombinasi desain antarmuka modern, interaktivitas halus, dan performa tinggi yang telah membantu klien kami bertumbuh pesat.
          </p>
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
          {categories.map((cat, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                selectedCategory === cat
                  ? 'neu-pressed text-blue-600 dark:text-blue-400 font-bold border border-blue-400/40'
                  : 'neu-button text-slate-600 dark:text-slate-300 hover:text-blue-600'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Portfolio Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="neu-flat rounded-3xl overflow-hidden flex flex-col justify-between border border-slate-200/50 dark:border-slate-800 hover:-translate-y-2 transition-all duration-300 group"
            >
              <div>
                {/* Image Showcase */}
                <div className="relative aspect-[16/10] overflow-hidden bg-slate-100 dark:bg-slate-800">
                  <img
                    src={item.thumbnail || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=80'}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="px-3 py-1 rounded-xl bg-black/60 backdrop-blur-md text-white text-[11px] font-semibold">
                      {item.category}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 mb-1">
                    {item.client}
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-slate-800 dark:text-slate-100 mb-2 leading-snug group-hover:text-blue-600 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-3 mb-4">
                    {item.description}
                  </p>

                  {/* Tech stack badges */}
                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {item.tech_stack?.map((tech, tIdx) => (
                      <span
                        key={tIdx}
                        className="text-[10px] font-semibold px-2 py-0.5 rounded-lg bg-slate-200/70 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Link */}
              <div className="px-6 pb-6 pt-0">
                <a
                  href={item.url || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full neu-button py-2.5 px-4 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 flex items-center justify-center gap-1.5 hover:text-blue-600 transition-colors"
                >
                  <span>Kunjungi Live Demo</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
