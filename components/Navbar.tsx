'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Globe, Sparkles, MessageCircle, ArrowRight } from 'lucide-react';

interface NavItem {
  label: string;
  url: string;
}

interface NavbarProps {
  siteName?: string;
  siteTagline?: string;
  siteLogo?: string;
  menuItems?: NavItem[];
  whatsappNumber?: string;
}

export function Navbar({
  siteName = 'SenaWeb',
  siteTagline = 'JASA PEMBUATAN WEBSITE',
  siteLogo,
  menuItems,
  whatsappNumber = '6281234567890',
}: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  const defaultMenus: NavItem[] = [
    { label: 'Home', url: '/' },
    { label: 'Layanan', url: '/layanan' },
    { label: 'Paket Harga', url: '/paket' },
    { label: 'Portfolio', url: '/portfolio' },
    { label: 'Blog', url: '/blog' },
    { label: 'Tentang Kami', url: '/tentang-kami' },
    { label: 'Kontak', url: '/kontak' },
  ];

  const rawItems = menuItems && menuItems.length > 0 ? menuItems : defaultMenus;
  const items = rawItems.map((item) => {
    if (item.url === '/#portfolio' || item.url === '#portfolio') return { ...item, url: '/portfolio' };
    if (item.url === '/#layanan' || item.url === '#layanan') return { ...item, url: '/layanan' };
    if (item.url === '/#paket' || item.url === '#paket') return { ...item, url: '/paket' };
    if (item.url === '/#kontak' || item.url === '#kontak') return { ...item, url: '/kontak' };
    return item;
  });

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  return (
    <header
      className={`sticky top-0 z-40 transition-all duration-300 ${
        scrolled
          ? 'bg-[#eef2f6]/90 dark:bg-[#121824]/90 backdrop-blur-md shadow-md py-3'
          : 'bg-[#eef2f6] dark:bg-[#121824] py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo & Brand Identity */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-2xl neu-flat flex items-center justify-center text-blue-600 dark:text-blue-400 font-extrabold text-xl group-hover:scale-105 transition-transform overflow-hidden">
              {siteLogo ? (
                <img src={siteLogo} alt={siteName} className="w-full h-full object-cover" />
              ) : (
                <span>SW</span>
              )}
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-lg sm:text-xl tracking-tight text-slate-800 dark:text-slate-100 flex items-center gap-1">
                {siteName}
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
              </span>
              <span className="text-[9px] sm:text-[10px] tracking-wider uppercase font-bold text-blue-600 dark:text-blue-400">
                {siteTagline}
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 neu-flat-xs p-1.5 rounded-2xl">
            {items.map((item, idx) => {
              const isActive = pathname === item.url || (item.url !== '/' && pathname.startsWith(item.url));
              return (
                <Link
                  key={idx}
                  href={item.url}
                  className={`px-3.5 py-1.5 text-xs font-semibold rounded-xl transition-all ${
                    isActive
                      ? 'neu-pressed text-blue-600 dark:text-blue-400 font-bold'
                      : 'text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden sm:flex items-center gap-3">
            {/* Primary CTA */}
            <a
              href={`https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}?text=Halo%20SenaWeb,%20saya%20ingin%20konsultasi%20website%20bisnis`}
              target="_blank"
              rel="noopener noreferrer"
              className="neu-accent-btn px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 tracking-wide shadow-md"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>Konsultasi Gratis</span>
            </a>
          </div>

          {/* Mobile Hamburger Button */}
          <div className="flex sm:hidden items-center gap-2">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="neu-button w-10 h-10 rounded-xl flex items-center justify-center text-slate-700"
              aria-label="Toggle navigation menu"
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isOpen && (
          <div className="lg:hidden mt-4 pb-4 pt-2 border-t border-slate-200/80 animate-in fade-in slide-in-from-top-2">
            <nav className="flex flex-col gap-2">
              {items.map((item, idx) => (
                <Link
                  key={idx}
                  href={item.url}
                  className="px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-700 hover:text-blue-600 neu-flat-xs flex items-center justify-between"
                >
                  <span>{item.label}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                </Link>
              ))}

              <div className="pt-2 flex flex-col gap-2">
                <a
                  href={`https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}?text=Halo%20SenaWeb,%20saya%20ingin%20konsultasi%20website%20bisnis`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full neu-accent-btn py-2.5 rounded-xl text-xs font-bold text-center flex items-center justify-center gap-1.5 text-white"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Konsultasi WhatsApp Sekarang</span>
                </a>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
