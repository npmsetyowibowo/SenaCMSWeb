import React from 'react';
import type { Metadata } from 'next';
import { Sparkles, MapPin, Phone, Mail, Clock, MessageCircle } from 'lucide-react';
import { getSettings } from '@/lib/db';
import { ContactForm } from '@/components/ContactForm';

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  const title = settings.seo_kontak_title || 'Hubungi Kami – Konsultasi Jasa Pembuatan Website SenaWeb';
  const description = settings.seo_kontak_description || 'Konsultasikan rencana pembuatan website bisnis Anda bersama tim ahli SenaWeb. Tersedia konsultasi online WhatsApp dan janji temu.';

  return {
    title,
    description,
    openGraph: {
      title,
      description,
    },
  };
}

export default async function KontakPage() {
  const settings = await getSettings();
  const whatsappNumber = settings.whatsapp_number || '6281234567890';
  const email = settings.contact_email || 'halo@senaweb.id';
  const phone = settings.contact_phone || '+62 812-3456-7890';
  const address = settings.contact_address || 'Gedung Cyber One Lt. 4, Jl. Kemakmuran Digital No. 88, Indonesia';

  return (
    <div className="py-12 sm:py-20 space-y-16">
      {/* Header */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full neu-flat-xs text-xs sm:text-sm font-semibold text-blue-700 dark:text-blue-300">
          <Sparkles className="w-4 h-4 text-blue-600 animate-spin-slow" />
          <span>KONSULTASI & LAYANAN PELANGGAN</span>
        </div>

        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
          Mari Bicarakan Ide &{' '}
          <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Kebutuhan Website Anda
          </span>
        </h1>

        <p className="text-sm sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
          Tim developer dan konsultan digital SenaWeb siap membantu Anda memilih teknologi, merancang struktur web, dan mencapai tujuan bisnis Anda.
        </p>
      </section>

      {/* Main Grid: Info + Contact Form */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Column: Contact Cards */}
          <div className="lg:col-span-5 space-y-5">
            <div className="neu-flat p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 space-y-4">
              <h3 className="font-extrabold text-base text-slate-900 dark:text-slate-100">
                Informasi Kontak Resmi
              </h3>

              <div className="space-y-4 text-xs">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl neu-flat flex items-center justify-center text-blue-600 shrink-0">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-800 dark:text-slate-200 block">Kantor Operasional</span>
                    <span className="text-slate-500 leading-relaxed block mt-0.5">{address}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl neu-flat flex items-center justify-center text-emerald-600 shrink-0">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-800 dark:text-slate-200 block">WhatsApp / Telepon</span>
                    <span className="text-slate-500 block mt-0.5">{phone}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl neu-flat flex items-center justify-center text-indigo-600 shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-800 dark:text-slate-200 block">Email Bisnis</span>
                    <span className="text-slate-500 block mt-0.5">{email}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl neu-flat flex items-center justify-center text-amber-600 shrink-0">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-800 dark:text-slate-200 block">Jam Operasional</span>
                    <span className="text-slate-500 block mt-0.5">Senin – Sabtu: 08:30 – 21:00 WIB</span>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <a
                  href={`https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                    'Halo SenaWeb, saya ingin konsultasi langsung via WhatsApp.'
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full neu-accent-btn py-3 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 shadow"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Chat Langsung via WhatsApp</span>
                </a>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Contact Form */}
          <div className="lg:col-span-7 neu-flat p-6 sm:p-10 rounded-3xl border border-slate-200/80 dark:border-slate-800">
            <h3 className="font-black text-xl text-slate-900 dark:text-slate-100 mb-2">
              Kirim Pesan & Konsultasi Gratis
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
              Isi formulir di bawah ini. Tim kami akan menghubungi Anda kembali dalam kurun waktu maksimal 2 jam.
            </p>
            <ContactForm />
          </div>
        </div>
      </section>
    </div>
  );
}
