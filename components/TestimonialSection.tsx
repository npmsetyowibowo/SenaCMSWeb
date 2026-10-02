'use client';

import React from 'react';
import { Star, Quote, Sparkles, Building2, UserCheck } from 'lucide-react';
import { Testimonial } from '@/lib/db/types';
import { SectionBubble } from './SectionBubble';

interface TestimonialSectionProps {
  testimonials: Testimonial[];
  badgeText?: string;
}

export function TestimonialSection({ testimonials, badgeText }: TestimonialSectionProps) {
  if (!testimonials || testimonials.length === 0) {
    return null;
  }

  return (
    <section className="py-16 sm:py-24 relative overflow-hidden" id="testimoni">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="mb-4">
            <SectionBubble
              icon={<Star className="w-5 h-5 stroke-[2.2]" />}
              text={badgeText || 'KISAH SUKSES & KATA KLIEN KAMI'}
            />
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-800 tracking-tight">
            Dipercaya Ratusan Pebisnis & Lembaga di Indonesia
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-500">
            Lihat apa kata para pemilik bisnis, direktur perusahaan, dan kepala sekolah yang telah bertransformasi digital bersama SenaWeb.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {testimonials.map((item) => (
            <div
              key={item.id}
              className="neu-flat p-6 sm:p-7 rounded-3xl flex flex-col justify-between border border-slate-200/50 dark:border-slate-800 hover:-translate-y-1.5 transition-all duration-300 relative group"
            >
              <div>
                {/* Quote Icon & Stars */}
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-2xl neu-flat-sm flex items-center justify-center text-blue-600 dark:text-blue-400">
                    <Quote className="w-5 h-5" />
                  </div>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, idx) => (
                      <Star
                        key={idx}
                        className={`w-4 h-4 ${
                          idx < item.rating
                            ? 'text-amber-400 fill-amber-400'
                            : 'text-slate-300 dark:text-slate-600'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* Content */}
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed italic mb-6">
                  &ldquo;{item.content}&rdquo;
                </p>
              </div>

              {/* Author Info */}
              <div className="pt-4 border-t border-slate-200/60 dark:border-slate-800/80 flex items-center gap-3">
                <img
                  src={item.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'}
                  alt={item.name}
                  className="w-11 h-11 rounded-full object-cover neu-flat-xs border-2 border-white dark:border-slate-700"
                />
                <div className="overflow-hidden">
                  <h4 className="font-semibold text-sm text-slate-800 dark:text-slate-100 truncate">
                    {item.name}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 truncate flex items-center gap-1">
                    <Building2 className="w-3 h-3 text-slate-400 shrink-0" />
                    <span>{item.role} - {item.company}</span>
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Trust Badges */}
        <div className="mt-12 pt-8 border-t border-slate-200/60 dark:border-slate-800/80 flex flex-wrap items-center justify-center gap-6 sm:gap-12 text-slate-500 dark:text-slate-400 text-xs sm:text-sm">
          <div className="flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-emerald-500" />
            <span className="font-semibold text-slate-700 dark:text-slate-200">100+ Proyek Selesai</span>
          </div>
          <div className="flex items-center gap-2">
            <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
            <span className="font-semibold text-slate-700 dark:text-slate-200">4.9/5.0 Rating Klien</span>
          </div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-blue-500" />
            <span className="font-semibold text-slate-700 dark:text-slate-200">Garansi Layanan & Support</span>
          </div>
        </div>
      </div>
    </section>
  );
}
