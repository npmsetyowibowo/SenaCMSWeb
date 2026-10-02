'use client';

import React, { useEffect, useState } from 'react';
import {
  Settings as SettingsIcon,
  Save,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  Globe,
  MessageCircle,
  Mail,
  Phone,
  MapPin,
  Sparkles,
  Loader2,
  Image as ImageIcon,
} from 'lucide-react';
import { useToast } from '@/components/Toast';

export default function WebsiteSettingsPage() {
  const { success, error } = useToast();
  const [settings, setSettings] = useState<any>({});
  const [menuItems, setMenuItems] = useState<{ label: string; url: string }[]>([]);
  const [newMenu, setNewMenu] = useState({ label: '', url: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch('/api/settings')
      .then((r) => r.json())
      .then((data) => {
        setSettings(data || {});
        try {
          if (data.navigation_menu) {
            setMenuItems(JSON.parse(data.navigation_menu));
          } else {
            setMenuItems([
              { label: 'Home', url: '/' },
              { label: 'Layanan', url: '/#layanan' },
              { label: 'Paket Harga', url: '/#paket' },
              { label: 'Portfolio', url: '/#portfolio' },
              { label: 'Blog', url: '/blog' },
              { label: 'Tentang Kami', url: '/tentang-kami' },
              { label: 'Kontak', url: '/#kontak' },
            ]);
          }
        } catch {
          setMenuItems([]);
        }
      })
      .catch(() => error('Gagal memuat pengaturan'))
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (key: string, value: string) => {
    setSettings((prev: any) => ({ ...prev, [key]: value }));
  };

  const handleAddMenu = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMenu.label || !newMenu.url) return error('Nama label dan URL menu wajib diisi');
    setMenuItems([...menuItems, { ...newMenu }]);
    setNewMenu({ label: '', url: '' });
  };

  const handleRemoveMenu = (index: number) => {
    setMenuItems(menuItems.filter((_, i) => i !== index));
  };

  const handleMoveMenu = (index: number, direction: 'up' | 'down') => {
    const target = direction === 'up' ? index - 1 : index + 1;
    if (target < 0 || target >= menuItems.length) return;
    const updated = [...menuItems];
    const temp = updated[index];
    updated[index] = updated[target];
    updated[target] = temp;
    setMenuItems(updated);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...settings,
        navigation_menu: JSON.stringify(menuItems),
      };

      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error('Gagal menyimpan');
      success('Pengaturan website & menu navigasi berhasil diperbarui!');
    } catch (err: any) {
      error(err.message || 'Gagal menyimpan');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="py-24 flex justify-center text-xs text-slate-400">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl pb-16">
      <div>
        <h1 className="text-2xl font-black text-slate-800 dark:text-slate-100 flex items-center gap-2">
          <SettingsIcon className="w-6 h-6 text-blue-600" />
          <span>Pengaturan Website & Identitas Brand</span>
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Ubah nama brand, logo, favicon icon, brand ambassador, menu navigasi, nomor WhatsApp, dan kontak resmi kapan saja.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        {/* Brand & Favicon */}
        <div className="neu-flat p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 space-y-4">
          <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-blue-500" />
            <span>Identitas Brand, Logo & Favicon</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Nama Brand / Perusahaan *
              </label>
              <input
                type="text"
                value={settings.site_name || 'SenaWeb'}
                onChange={(e) => handleChange('site_name', e.target.value)}
                className="w-full neu-pressed px-3.5 py-2.5 text-xs sm:text-sm rounded-xl outline-none text-slate-800 dark:text-slate-100"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Tagline Resmi *
              </label>
              <input
                type="text"
                value={settings.site_tagline || 'JASA PEMBUATAN WEBSITE'}
                onChange={(e) => handleChange('site_tagline', e.target.value)}
                className="w-full neu-pressed px-3.5 py-2.5 text-xs sm:text-sm rounded-xl outline-none text-slate-800 dark:text-slate-100 uppercase"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                URL Logo Header (PNG/SVG)
              </label>
              <input
                type="text"
                value={settings.site_logo || ''}
                onChange={(e) => handleChange('site_logo', e.target.value)}
                className="w-full neu-pressed px-3.5 py-2.5 text-xs sm:text-sm rounded-xl outline-none text-slate-800 dark:text-slate-100"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                URL Favicon Tab Browser (Icon) *
              </label>
              <input
                type="text"
                value={settings.site_favicon || ''}
                onChange={(e) => handleChange('site_favicon', e.target.value)}
                className="w-full neu-pressed px-3.5 py-2.5 text-xs sm:text-sm rounded-xl outline-none text-slate-800 dark:text-slate-100"
              />
              <p className="text-[11px] text-slate-400 mt-1">Otomatis ditampilkan pada tab browser pengguna.</p>
            </div>
          </div>
        </div>

        {/* Brand Ambassador Section */}
        <div className="neu-flat p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 space-y-4">
          <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <ImageIcon className="w-4 h-4 text-purple-500" />
            <span>Foto & Profil Brand Ambassador</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Nama Brand Ambassador
              </label>
              <input
                type="text"
                value={settings.brand_ambassador_name || 'Clarissa Sena, S.Kom., M.M.'}
                onChange={(e) => handleChange('brand_ambassador_name', e.target.value)}
                className="w-full neu-pressed px-3.5 py-2.5 text-xs sm:text-sm rounded-xl outline-none text-slate-800 dark:text-slate-100"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Peran / Jabatan
              </label>
              <input
                type="text"
                value={settings.brand_ambassador_role || 'Lead Digital Strategist & Brand Ambassador SenaWeb'}
                onChange={(e) => handleChange('brand_ambassador_role', e.target.value)}
                className="w-full neu-pressed px-3.5 py-2.5 text-xs sm:text-sm rounded-xl outline-none text-slate-800 dark:text-slate-100"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                URL Foto Portrait Ambassador
              </label>
              <input
                type="text"
                value={settings.brand_ambassador_image || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800'}
                onChange={(e) => handleChange('brand_ambassador_image', e.target.value)}
                className="w-full neu-pressed px-3.5 py-2.5 text-xs sm:text-sm rounded-xl outline-none text-slate-800 dark:text-slate-100"
              />
            </div>
          </div>
        </div>

        {/* Navigation Menu Editor (Requirement 1) */}
        <div className="neu-flat p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <Globe className="w-4 h-4 text-emerald-500" />
              <span>Pengelola Menu Navigasi (Edit, Tambah, Hapus & Urutkan Menu)</span>
            </h3>
            <span className="text-xs text-slate-400">Total: {menuItems.length} menu</span>
          </div>

          {/* Existing Menu Items */}
          <div className="space-y-2">
            {menuItems.map((item, idx) => (
              <div
                key={idx}
                className="neu-pressed-sm p-3 rounded-2xl flex items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-center gap-3 flex-1">
                  <span className="w-6 h-6 rounded-lg bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-300 font-bold flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>
                  <input
                    type="text"
                    value={item.label}
                    onChange={(e) => {
                      const updated = [...menuItems];
                      updated[idx].label = e.target.value;
                      setMenuItems(updated);
                    }}
                    className="neu-pressed px-2.5 py-1 rounded-lg text-xs font-semibold text-slate-800 dark:text-slate-100 outline-none w-36"
                  />
                  <input
                    type="text"
                    value={item.url}
                    onChange={(e) => {
                      const updated = [...menuItems];
                      updated[idx].url = e.target.value;
                      setMenuItems(updated);
                    }}
                    className="neu-pressed px-2.5 py-1 rounded-lg text-xs font-mono text-slate-600 dark:text-slate-300 outline-none flex-1"
                  />
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    type="button"
                    disabled={idx === 0}
                    onClick={() => handleMoveMenu(idx, 'up')}
                    className="neu-button p-1.5 rounded-lg text-slate-600 disabled:opacity-30"
                    title="Geser Ke Atas"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    disabled={idx === menuItems.length - 1}
                    onClick={() => handleMoveMenu(idx, 'down')}
                    className="neu-button p-1.5 rounded-lg text-slate-600 disabled:opacity-30"
                    title="Geser Ke Bawah"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRemoveMenu(idx)}
                    className="neu-button p-1.5 rounded-lg text-rose-600 hover:text-rose-700"
                    title="Hapus Menu"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Add Menu Form */}
          <div className="neu-flat p-4 rounded-2xl border border-slate-200/60 dark:border-slate-800 flex flex-col sm:flex-row items-center gap-2 pt-3">
            <input
              type="text"
              placeholder="Label Menu Baru (Contoh: Promo)"
              value={newMenu.label}
              onChange={(e) => setNewMenu({ ...newMenu, label: e.target.value })}
              className="neu-pressed px-3 py-2 text-xs rounded-xl outline-none flex-1 w-full text-slate-800 dark:text-slate-100"
            />
            <input
              type="text"
              placeholder="URL (Contoh: /promo atau #promo)"
              value={newMenu.url}
              onChange={(e) => setNewMenu({ ...newMenu, url: e.target.value })}
              className="neu-pressed px-3 py-2 text-xs rounded-xl outline-none flex-1 w-full text-slate-800 dark:text-slate-100 font-mono"
            />
            <button
              type="button"
              onClick={handleAddMenu}
              className="neu-accent-btn px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1 shrink-0 w-full sm:w-auto justify-center"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Tambah Menu</span>
            </button>
          </div>
        </div>

        {/* WhatsApp & Contact Info */}
        <div className="neu-flat p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 space-y-4">
          <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <MessageCircle className="w-4 h-4 text-emerald-500" />
            <span>Integrasi WhatsApp & Kontak Resmi</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Nomor WhatsApp Resmi (Format: 628xxx) *
              </label>
              <input
                type="text"
                placeholder="6281234567890"
                value={settings.whatsapp_number || '6281234567890'}
                onChange={(e) => handleChange('whatsapp_number', e.target.value)}
                className="w-full neu-pressed px-3.5 py-2.5 text-xs sm:text-sm rounded-xl outline-none text-slate-800 dark:text-slate-100 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Email Dukungan Resmi *
              </label>
              <input
                type="email"
                placeholder="halo@senaweb.id"
                value={settings.contact_email || 'halo@senaweb.id'}
                onChange={(e) => handleChange('contact_email', e.target.value)}
                className="w-full neu-pressed px-3.5 py-2.5 text-xs sm:text-sm rounded-xl outline-none text-slate-800 dark:text-slate-100"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Template Pesan Otomatis WhatsApp Widget
            </label>
            <input
              type="text"
              value={settings.whatsapp_default_message || 'Halo SenaWeb, saya tertarik untuk konsultasi pembuatan website bisnis saya.'}
              onChange={(e) => handleChange('whatsapp_default_message', e.target.value)}
              className="w-full neu-pressed px-3.5 py-2.5 text-xs sm:text-sm rounded-xl outline-none text-slate-800 dark:text-slate-100"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Alamat Kantor Fisik
            </label>
            <input
              type="text"
              value={settings.contact_address || 'Gedung Cyber One Lt. 4, Jl. Kemakmuran Digital No. 88, Indonesia'}
              onChange={(e) => handleChange('contact_address', e.target.value)}
              className="w-full neu-pressed px-3.5 py-2.5 text-xs sm:text-sm rounded-xl outline-none text-slate-800 dark:text-slate-100"
            />
          </div>
        </div>

        {/* Bubble Kecil & Sub-Judul Badges Section (Requirement 5) */}
        <div className="neu-flat p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-200/60 dark:border-slate-800 pb-3">
            <Sparkles className="w-4 h-4 text-blue-500" />
            <div>
              <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100">
                Pengaturan Bubble Kecil & Sub-Judul (Badges)
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Kustomisasi teks bubble kecil (badge lonjong) yang menjadi judul kecil di setiap seksi website.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Bubble Hero Header (Beranda)
              </label>
              <input
                type="text"
                value={settings.hero_badge_text ?? 'Jasa Pembuatan Website Profesional No. 1 di Indonesia'}
                onChange={(e) => handleChange('hero_badge_text', e.target.value)}
                placeholder="Jasa Pembuatan Website Profesional No. 1 di Indonesia"
                className="w-full neu-pressed px-3 py-2 text-xs rounded-xl outline-none text-slate-800 dark:text-slate-100"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Bubble Seksi Layanan
              </label>
              <input
                type="text"
                value={settings.services_badge_text ?? 'LAYANAN UNGGULAN'}
                onChange={(e) => handleChange('services_badge_text', e.target.value)}
                placeholder="LAYANAN UNGGULAN"
                className="w-full neu-pressed px-3 py-2 text-xs rounded-xl outline-none text-slate-800 dark:text-slate-100"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Bubble Seksi Paket Harga
              </label>
              <input
                type="text"
                value={settings.pricing_badge_text ?? 'PILIHAN PAKET INVESTASI'}
                onChange={(e) => handleChange('pricing_badge_text', e.target.value)}
                placeholder="PILIHAN PAKET INVESTASI"
                className="w-full neu-pressed px-3 py-2 text-xs rounded-xl outline-none text-slate-800 dark:text-slate-100"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Bubble Seksi Portfolio
              </label>
              <input
                type="text"
                value={settings.portfolio_badge_text ?? 'KARYA & HASIL KERJA KAMI'}
                onChange={(e) => handleChange('portfolio_badge_text', e.target.value)}
                placeholder="KARYA & HASIL KERJA KAMI"
                className="w-full neu-pressed px-3 py-2 text-xs rounded-xl outline-none text-slate-800 dark:text-slate-100"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Bubble Seksi Keunggulan (Why Us)
              </label>
              <input
                type="text"
                value={settings.whyus_badge_text ?? 'KENAPA MEMILIH SENAWEB'}
                onChange={(e) => handleChange('whyus_badge_text', e.target.value)}
                placeholder="KENAPA MEMILIH SENAWEB"
                className="w-full neu-pressed px-3 py-2 text-xs rounded-xl outline-none text-slate-800 dark:text-slate-100"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Bubble Seksi Testimoni
              </label>
              <input
                type="text"
                value={settings.testimonials_badge_text ?? 'KATA KLIEN KAMI'}
                onChange={(e) => handleChange('testimonials_badge_text', e.target.value)}
                placeholder="KATA KLIEN KAMI"
                className="w-full neu-pressed px-3 py-2 text-xs rounded-xl outline-none text-slate-800 dark:text-slate-100"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Bubble Seksi FAQ
              </label>
              <input
                type="text"
                value={settings.faq_badge_text ?? 'PERTANYAAN UMUM (FAQ)'}
                onChange={(e) => handleChange('faq_badge_text', e.target.value)}
                placeholder="PERTANYAAN UMUM (FAQ)"
                className="w-full neu-pressed px-3 py-2 text-xs rounded-xl outline-none text-slate-800 dark:text-slate-100"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Bubble Seksi Kontak
              </label>
              <input
                type="text"
                value={settings.contact_badge_text ?? 'KONSULTASI GRATIS'}
                onChange={(e) => handleChange('contact_badge_text', e.target.value)}
                placeholder="KONSULTASI GRATIS"
                className="w-full neu-pressed px-3 py-2 text-xs rounded-xl outline-none text-slate-800 dark:text-slate-100"
              />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="neu-accent-btn px-8 py-3.5 rounded-2xl font-bold text-xs sm:text-sm flex items-center gap-2 shadow-xl"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>Simpan Seluruh Pengaturan Website</span>
          </button>
        </div>
      </form>
    </div>
  );
}
