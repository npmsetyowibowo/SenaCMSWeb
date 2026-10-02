'use client';

import React, { useState } from 'react';
import { Send, CheckCircle2, AlertCircle, Loader2, Sparkles, Phone, Mail, User } from 'lucide-react';
import { useToast } from './Toast';
import confetti from 'canvas-confetti';

interface ContactFormProps {
  defaultService?: string;
  cityName?: string;
  className?: string;
}

export function ContactForm({ defaultService = 'Company Profile', cityName, className = '' }: ContactFormProps) {
  const { success, error } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: defaultService,
    budget: 'Rp1.800.000 (Paket Medium)',
    message: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!formData.name.trim() || formData.name.trim().length < 2) {
      errs.name = 'Nama lengkap wajib diisi (minimal 2 karakter)';
    }
    if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errs.email = 'Format email tidak valid';
    }
    if (!formData.phone.trim() || formData.phone.replace(/[^0-9]/g, '').length < 9) {
      errs.phone = 'Nomor WhatsApp / telepon minimal 9 digit angka';
    }
    if (!formData.message.trim() || formData.message.trim().length < 10) {
      errs.message = 'Pesan konsultasi minimal 10 karakter';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      error('Mohon periksa kembali formulir Anda. Beberapa kolom belum terisi dengan benar.', 'Formulir Belum Lengkap');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          message: cityName ? `[KOTA: ${cityName}] ${formData.message}` : formData.message,
        }),
      });

      if (!res.ok) {
        throw new Error('Gagal mengirim pesan');
      }

      setSubmitted(true);
      success('Permintaan konsultasi Anda berhasil terkirim! Tim SenaWeb akan segera menghubungi Anda via WhatsApp.', 'Konsultasi Terkirim');
      try {
        confetti({
          particleCount: 80,
          spread: 60,
          origin: { y: 0.7 },
        });
      } catch {
        // ignore confetti failure
      }
      setFormData({
        name: '',
        email: '',
        phone: '',
        service: defaultService,
        budget: 'Rp1.800.000 (Paket Medium)',
        message: '',
      });
      setErrors({});
    } catch (err: any) {
      error(err.message || 'Terjadi kesalahan saat mengirim pesan. Silakan hubungi langsung via WhatsApp.', 'Gagal Mengirim');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`neu-flat p-6 sm:p-8 rounded-3xl border border-slate-200/60 dark:border-slate-800 ${className}`}>
      <div className="mb-6 text-center sm:text-left">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-100/80 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 mb-2">
          <Sparkles className="w-3.5 h-3.5" />
          {cityName ? `Konsultasi Proyek Website ${cityName}` : 'Konsultasi Gratis & Cepat'}
        </div>
        <h3 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-slate-100">
          Mulai Bangun Website Impian Anda
        </h3>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Konsultasikan kebutuhan bisnis Anda. Tim konsultan kami siap memberikan solusi dan estimasi terbaik dalam 15 menit.
        </p>
      </div>

      {submitted ? (
        <div className="text-center py-10 space-y-4">
          <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-inner">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h4 className="text-lg font-bold text-slate-800 dark:text-slate-100">Terima Kasih Banyak!</h4>
          <p className="text-sm text-slate-600 dark:text-slate-300 max-w-md mx-auto">
            Data konsultasi Anda telah diterima sistem SenaWeb. Konsultan kami akan menghubungi WhatsApp Anda segera.
          </p>
          <button
            type="button"
            onClick={() => setSubmitted(false)}
            className="neu-button px-6 py-2.5 rounded-xl text-xs sm:text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700"
          >
            Kirim Pertanyaan Lain
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Nama */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Nama Lengkap *
              </label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                <input
                  type="text"
                  placeholder="Contoh: Budi Santoso"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className={`w-full neu-pressed pl-10 pr-3.5 py-2.5 text-xs sm:text-sm rounded-xl outline-none text-slate-800 dark:text-slate-100 placeholder:text-slate-400 transition-colors ${
                    errors.name ? 'border border-rose-500' : ''
                  }`}
                />
              </div>
              {errors.name && <p className="text-[11px] text-rose-500 mt-1">{errors.name}</p>}
            </div>

            {/* Nomor Telepon / WA */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                WhatsApp / No. HP *
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                <input
                  type="tel"
                  placeholder="Contoh: 081234567890"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className={`w-full neu-pressed pl-10 pr-3.5 py-2.5 text-xs sm:text-sm rounded-xl outline-none text-slate-800 dark:text-slate-100 placeholder:text-slate-400 transition-colors ${
                    errors.phone ? 'border border-rose-500' : ''
                  }`}
                />
              </div>
              {errors.phone && <p className="text-[11px] text-rose-500 mt-1">{errors.phone}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Email */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Alamat Email *
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                <input
                  type="email"
                  placeholder="Contoh: budi@bisnis.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className={`w-full neu-pressed pl-10 pr-3.5 py-2.5 text-xs sm:text-sm rounded-xl outline-none text-slate-800 dark:text-slate-100 placeholder:text-slate-400 transition-colors ${
                    errors.email ? 'border border-rose-500' : ''
                  }`}
                />
              </div>
              {errors.email && <p className="text-[11px] text-rose-500 mt-1">{errors.email}</p>}
            </div>

            {/* Pilihan Layanan */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Kebutuhan Website
              </label>
              <select
                value={formData.service}
                onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                className="w-full neu-pressed px-3.5 py-2.5 text-xs sm:text-sm rounded-xl outline-none text-slate-800 dark:text-slate-100 bg-transparent cursor-pointer"
              >
                <option value="Company Profile" className="bg-slate-100 dark:bg-slate-800">Company Profile Perusahaan</option>
                <option value="Landing Page Promosi" className="bg-slate-100 dark:bg-slate-800">Landing Page Penjualan / UMKM</option>
                <option value="Toko Online E-Commerce" className="bg-slate-100 dark:bg-slate-800">Toko Online / E-Commerce</option>
                <option value="Website Sekolah / Kampus" className="bg-slate-100 dark:bg-slate-800">Website Sekolah / Organisasi</option>
                <option value="Website Custom Web App" className="bg-slate-100 dark:bg-slate-800">Custom Web Application</option>
                <option value="Jasa Redesign Website" className="bg-slate-100 dark:bg-slate-800">Redesign & Optimasi SEO</option>
              </select>
            </div>
          </div>

          {/* Rencana Anggaran */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Estimasi Budget
            </label>
            <div className="grid grid-cols-3 gap-2">
              {['Rp750.000 (Basic)', 'Rp1.800.000 (Medium)', 'Rp3.200.000+ (Premium)'].map((b) => (
                <button
                  type="button"
                  key={b}
                  onClick={() => setFormData({ ...formData, budget: b })}
                  className={`text-xs py-2 px-2 rounded-xl transition-all ${
                    formData.budget === b
                      ? 'neu-pressed text-blue-600 dark:text-blue-400 font-semibold border border-blue-400/50'
                      : 'neu-button text-slate-600 dark:text-slate-300'
                  }`}
                >
                  {b.split(' ')[0]}
                </button>
              ))}
            </div>
          </div>

          {/* Pesan */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Jelaskan Rencana atau Ide Website Anda *
            </label>
            <textarea
              rows={3}
              placeholder="Contoh: Kami bergerak di bidang kuliner dan butuh website katalog menu dengan fitur order ke WhatsApp dan integrasi Google Maps..."
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              className={`w-full neu-pressed p-3 text-xs sm:text-sm rounded-xl outline-none text-slate-800 dark:text-slate-100 placeholder:text-slate-400 resize-none transition-colors ${
                errors.message ? 'border border-rose-500' : ''
              }`}
            />
            {errors.message && <p className="text-[11px] text-rose-500 mt-1">{errors.message}</p>}
          </div>

          {/* Submit CTA */}
          <button
            type="submit"
            disabled={loading}
            className="w-full neu-accent-btn py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all disabled:opacity-70 cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Mengirim Permintaan...</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>Kirim Konsultasi Sekarang (Gratis)</span>
              </>
            )}
          </button>
        </form>
      )}
    </div>
  );
}
