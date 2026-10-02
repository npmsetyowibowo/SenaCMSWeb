'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  FileText,
  FolderOpen,
  Tag,
  Image as ImageIcon,
  Briefcase,
  Star,
  DollarSign,
  HelpCircle,
  Inbox,
  FileCode,
  MapPin,
  Search,
  Settings,
  UserCheck,
  LogOut,
  ExternalLink,
  ShieldCheck,
  Menu,
  X,
} from 'lucide-react';
import { useToast } from '@/components/Toast';

interface AdminHeaderProps {
  user: any;
}

export function AdminHeader({ user }: AdminHeaderProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { success } = useToast();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // If on login page, don't show admin nav
  if (pathname === '/senacms/login') {
    return null;
  }

  const navLinks = [
    { label: 'Dashboard', href: '/senacms/dashboard', icon: LayoutDashboard },
    { label: 'Artikel & SEO', href: '/senacms/articles', icon: FileText },
    { label: 'Kategori', href: '/senacms/categories', icon: FolderOpen },
    { label: 'Tag', href: '/senacms/tags', icon: Tag },
    { label: 'Media Library', href: '/senacms/media', icon: ImageIcon },
    { label: 'Portofolio', href: '/senacms/portfolio', icon: Briefcase },
    { label: 'Testimoni', href: '/senacms/testimonials', icon: Star },
    { label: 'Paket Harga', href: '/senacms/pricing', icon: DollarSign },
    { label: 'FAQ', href: '/senacms/faq', icon: HelpCircle },
    { label: 'Konsultasi Leads', href: '/senacms/inquiries', icon: Inbox },
    { label: 'Halaman', href: '/senacms/pages', icon: FileCode },
    { label: 'Kota Layanan', href: '/senacms/cities', icon: MapPin },
    { label: 'SEO Global', href: '/senacms/seo', icon: Search },
    { label: 'Pengaturan', href: '/senacms/settings', icon: Settings },
    { label: 'Akun & Password', href: '/senacms/users', icon: UserCheck },
  ];

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      success('Sesi berhasil diakhiri.', 'Logout Berhasil');
      router.push('/senacms/login');
      router.refresh();
    } catch {
      router.push('/senacms/login');
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-[#eef2f6]/95 dark:bg-[#121824]/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800">
      {/* Top Banner Row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/senacms/dashboard" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl neu-flat flex items-center justify-center text-blue-600 dark:text-blue-400 font-black text-lg">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="font-extrabold text-base tracking-tight text-slate-800 dark:text-slate-100">
                SenaCMS
              </span>
              <span className="hidden sm:inline-block text-[10px] ml-1.5 px-2 py-0.5 rounded-md bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 font-bold uppercase">
                Admin Panel
              </span>
            </div>
          </Link>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            href="/"
            target="_blank"
            className="neu-button px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-600 hover:text-blue-600 flex items-center gap-1.5"
            title="Buka Website Publik"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Lihat Web Publik</span>
          </Link>

          {/* User info */}
          <div className="hidden sm:flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-slate-800">
            <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center neu-flat-xs">
              {user?.full_name ? user.full_name[0] : 'A'}
            </div>
            <div className="text-left text-xs leading-tight">
              <div className="font-bold text-slate-800 dark:text-slate-200">
                {user?.full_name || 'Admin'}
              </div>
              <div className="text-[10px] text-slate-400">Administrator</div>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="neu-button p-2 rounded-xl text-rose-600 hover:text-rose-700 flex items-center gap-1.5 text-xs font-bold"
            title="Keluar dari SenaCMS"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden md:inline">Logout</span>
          </button>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden neu-button p-2 rounded-xl text-slate-700 dark:text-slate-300"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Desktop Horizontal Navigation Tabs */}
      <div className="hidden lg:block border-t border-slate-200/60 dark:border-slate-800/80 bg-white/40 dark:bg-slate-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-1 overflow-x-auto py-2 scrollbar-none">
            {navLinks.map((link, idx) => {
              const Icon = link.icon;
              const isActive = pathname === link.href || (link.href !== '/senacms/dashboard' && pathname.startsWith(link.href));
              return (
                <Link
                  key={idx}
                  href={link.href}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                    isActive
                      ? 'neu-pressed text-blue-600 dark:text-blue-400 font-bold border border-blue-400/40'
                      : 'text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200/80 dark:border-slate-800 p-4 bg-[#eef2f6] dark:bg-[#121824] animate-in fade-in">
          <div className="grid grid-cols-2 gap-2">
            {navLinks.map((link, idx) => {
              const Icon = link.icon;
              const isActive = pathname === link.href || (link.href !== '/senacms/dashboard' && pathname.startsWith(link.href));
              return (
                <Link
                  key={idx}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`p-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
                    isActive
                      ? 'neu-pressed text-blue-600 font-bold'
                      : 'neu-button text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <Icon className="w-4 h-4 text-blue-500" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
}
