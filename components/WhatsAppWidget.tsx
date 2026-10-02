'use client';

import React, { useState } from 'react';
import { MessageCircle, X, Send, Sparkles, CheckCheck } from 'lucide-react';

interface WhatsAppWidgetProps {
  phoneNumber?: string;
  defaultMessage?: string;
  brandAmbassadorName?: string;
}

export function WhatsAppWidget({
  phoneNumber = '6281234567890',
  defaultMessage = 'Halo SenaWeb, saya tertarik untuk konsultasi pembuatan website bisnis saya.',
  brandAmbassadorName = 'Clarissa Sena (SenaWeb)',
}: WhatsAppWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [userText, setUserText] = useState('');

  const quickTopics = [
    'Tanya Paket Basic (Rp750.000)',
    'Konsultasi Company Profile',
    'Pembuatan Website Toko Online',
    'Website Sekolah / Lembaga',
  ];

  const handleSend = (textToSend?: string) => {
    const message = textToSend || userText || defaultMessage;
    const cleanNumber = phoneNumber.replace(/[^0-9]/g, '');
    const url = `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Chat Box */}
      {isOpen && (
        <div className="mb-3 w-[340px] sm:w-[380px] rounded-2xl neu-flat overflow-hidden border border-slate-200/80 dark:border-slate-800 transition-all duration-300 animate-in fade-in slide-in-from-bottom-5">
          {/* Header */}
          <div className="bg-gradient-to-r from-emerald-600 to-teal-700 p-4 text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center font-bold text-lg border border-white/30 overflow-hidden">
                  <span className="text-white">SW</span>
                </div>
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 border-2 border-emerald-700 rounded-full"></span>
              </div>
              <div>
                <h4 className="font-semibold text-sm leading-tight">{brandAmbassadorName}</h4>
                <p className="text-xs text-emerald-100 flex items-center gap-1">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-300 animate-pulse"></span>
                  Siap Melayani Konsultasi
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="w-8 h-8 rounded-full bg-black/10 hover:bg-black/20 flex items-center justify-center transition-colors text-white"
              aria-label="Tutup chat WhatsApp"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Chat Body */}
          <div className="p-4 bg-slate-50/70 dark:bg-slate-900/60 max-h-[320px] overflow-y-auto space-y-3">
            <div className="flex items-start gap-2.5 max-w-[88%]">
              <div className="p-3.5 rounded-2xl rounded-tl-sm bg-white dark:bg-slate-800 shadow-sm border border-slate-100 dark:border-slate-700/60 text-xs sm:text-sm text-slate-800 dark:text-slate-200">
                <p className="font-medium text-emerald-600 dark:text-emerald-400 mb-1 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" /> SenaWeb Official
                </p>
                Halo! Selamat datang di <strong>SenaWeb</strong>. Ada yang bisa kami bantu terkait pembuatan website bisnis atau UMKM Anda hari ini?
                <div className="mt-1 text-[10px] text-slate-400 flex items-center justify-end gap-1">
                  <span>Baru saja</span>
                  <CheckCheck className="w-3.5 h-3.5 text-blue-500" />
                </div>
              </div>
            </div>

            {/* Quick Topic Chips */}
            <div className="pt-2">
              <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 mb-2">Pilih topik cepat:</p>
              <div className="flex flex-wrap gap-1.5">
                {quickTopics.map((topic, i) => (
                  <button
                    key={i}
                    onClick={() => handleSend(`Halo SenaWeb, saya ingin ${topic}`)}
                    className="text-xs px-2.5 py-1.5 rounded-lg neu-button text-slate-700 dark:text-slate-200 hover:text-emerald-600 dark:hover:text-emerald-400 text-left"
                  >
                    {topic}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Chat Input Footer */}
          <div className="p-3 bg-white dark:bg-slate-800/90 border-t border-slate-100 dark:border-slate-700/60">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={userText}
                onChange={(e) => setUserText(e.target.value)}
                placeholder="Tulis pesan konsultasi..."
                className="flex-1 neu-pressed px-3 py-2 text-xs sm:text-sm rounded-xl outline-none text-slate-800 dark:text-slate-200 placeholder:text-slate-400"
              />
              <button
                type="submit"
                className="neu-accent-btn w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                aria-label="Kirim ke WhatsApp"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
            <p className="text-[10px] text-center text-slate-400 mt-2">
              Terhubung langsung ke WhatsApp Resmi SenaWeb
            </p>
          </div>
        </div>
      )}

      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative group flex items-center gap-2 px-4 py-3 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-medium shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95"
        aria-label="Konsultasi via WhatsApp"
      >
        <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-rose-500 rounded-full border-2 border-white animate-pulse"></span>
        <div className="w-6 h-6 flex items-center justify-center">
          {isOpen ? <X className="w-5 h-5" /> : <MessageCircle className="w-5 h-5 fill-white" />}
        </div>
        <span className="hidden sm:inline-block text-sm font-semibold tracking-wide">
          {isOpen ? 'Tutup Chat' : 'Konsultasi WhatsApp'}
        </span>
      </button>
    </div>
  );
}
