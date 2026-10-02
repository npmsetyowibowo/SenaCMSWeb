'use client';

import React, { useState } from 'react';
import { ChevronDown, HelpCircle, Sparkles } from 'lucide-react';
import { FAQ } from '@/lib/db/types';
import { SectionBubble } from './SectionBubble';

interface FaqSectionProps {
  faqs: FAQ[];
  badgeText?: string;
}

export function FaqSection({ faqs, badgeText }: FaqSectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section className="py-16 sm:py-24 relative" id="faq">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="mb-4">
            <SectionBubble
              icon={<HelpCircle className="w-5 h-5 stroke-[2.2]" />}
              text={badgeText || 'Pertanyaan yang Sering Diajukan'}
            />
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-800 tracking-tight">
            Frequently Asked Questions (FAQ)
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-500">
            Temukan jawaban cepat seputar proses, biaya, keamanan, dan pengelolaan website di SenaWeb.
          </p>
        </div>

        {/* Accordion List */}
        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={faq.id || idx}
                className={`rounded-2xl transition-all duration-300 overflow-hidden border ${
                  isOpen
                    ? 'neu-pressed border-blue-400/40 dark:border-blue-500/40 bg-white/40 dark:bg-slate-900/40'
                    : 'neu-flat border-slate-200/60 dark:border-slate-800'
                }`}
              >
                <button
                  onClick={() => toggle(idx)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-sm sm:text-base text-slate-800 dark:text-slate-100 cursor-pointer"
                  aria-expanded={isOpen}
                >
                  <span className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-lg neu-flat-xs text-blue-600 dark:text-blue-400 text-xs flex items-center justify-center font-extrabold shrink-0">
                      {idx + 1}
                    </span>
                    <span>{faq.question}</span>
                  </span>
                  <div
                    className={`w-8 h-8 rounded-xl neu-button flex items-center justify-center shrink-0 transition-transform duration-300 ${
                      isOpen ? 'rotate-180 text-blue-600' : 'text-slate-400'
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-200/40 dark:border-slate-800/40">
                    <p className="pl-9">{faq.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Quick Help Box */}
        <div className="mt-10 p-6 rounded-3xl neu-flat text-center border border-slate-200/60 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-left">
            <h4 className="font-bold text-sm text-slate-800 dark:text-slate-100">
              Masih punya pertanyaan yang belum terjawab?
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Konsultan kami selalu siap membantu Anda langsung via chat WhatsApp.
            </p>
          </div>
          <a
            href="#kontak"
            className="neu-button px-5 py-2.5 rounded-xl text-xs font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 shrink-0"
          >
            Konsultasi Sekarang
          </a>
        </div>
      </div>
    </section>
  );
}
