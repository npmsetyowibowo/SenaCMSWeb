import React from 'react';
import Link from 'next/link';
import { getCurrentUser } from '@/lib/auth';
import { redirect } from 'next/navigation';
import {
  getArticles,
  getPortfolioList,
  getTestimonials,
  getInquiries,
  getMediaList,
  getTrafficStats,
} from '@/lib/db';
import {
  FileText,
  Briefcase,
  Star,
  Inbox,
  Users,
  Eye,
  TrendingUp,
  Smartphone,
  Monitor,
  Tablet,
  PlusCircle,
  ArrowRight,
  Sparkles,
  MessageCircle,
  CheckCircle,
  Clock,
} from 'lucide-react';

export default async function AdminDashboardPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect('/senacms/login');
  }

  const [articlesRes, portfolio, testimonials, inquiries, media, trafficStats] = await Promise.all([
    getArticles(),
    getPortfolioList(),
    getTestimonials(),
    getInquiries(),
    getMediaList(),
    getTrafficStats(),
  ]);

  const totalArticles = articlesRes.total;
  const publishedArticles = articlesRes.articles.filter((a) => a.status === 'published').length;
  const draftArticles = articlesRes.articles.filter((a) => a.status === 'draft').length;
  const unreadInquiries = inquiries.filter((i) => i.status === 'unread').length;

  const maxViewsInWeek = Math.max(1, ...trafficStats.dailyStats.map((d) => d.views));

  return (
    <div className="space-y-8 pb-12">
      {/* Welcome Banner */}
      <div className="neu-flat p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 neu-flat-xs mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>SenaCMS v2.5 Active</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 dark:text-slate-100">
            Halo, {user.full_name}! 👋
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Selamat datang di pusat kendali website SenaWeb. Kelola artikel, portofolio, harga paket, dan pantau traffic pengunjung secara realtime.
          </p>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <Link
            href="/senacms/articles/new"
            className="neu-accent-btn px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Tulis Artikel Baru</span>
          </Link>
          <Link
            href="/senacms/inquiries"
            className="neu-button px-4 py-2.5 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center gap-1.5"
          >
            <Inbox className="w-4 h-4 text-emerald-500" />
            <span>Konsultasi ({unreadInquiries} Baru)</span>
          </Link>
        </div>
      </div>

      {/* 6 Key Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {/* Total Pageviews */}
        <div className="neu-flat p-4 sm:p-5 rounded-2xl border border-slate-200/60 dark:border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Total Views</span>
            <Eye className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-slate-800 dark:text-slate-100">
            {trafficStats.totalPageviews}
          </div>
          <div className="text-[10px] text-emerald-600 font-bold flex items-center gap-0.5">
            <TrendingUp className="w-3 h-3" /> Realtime Tracker
          </div>
        </div>

        {/* Unique Visitors */}
        <div className="neu-flat p-4 sm:p-5 rounded-2xl border border-slate-200/60 dark:border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Pengunjung Unik</span>
            <Users className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-slate-800 dark:text-slate-100">
            {trafficStats.uniqueVisitors}
          </div>
          <div className="text-[10px] text-slate-400">Unique IP Hash</div>
        </div>

        {/* Artikel Terbit */}
        <div className="neu-flat p-4 sm:p-5 rounded-2xl border border-slate-200/60 dark:border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Artikel Terbit</span>
            <FileText className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-slate-800 dark:text-slate-100">
            {publishedArticles}
          </div>
          <div className="text-[10px] text-slate-400">{draftArticles} Draft tersimpan</div>
        </div>

        {/* Portofolio */}
        <div className="neu-flat p-4 sm:p-5 rounded-2xl border border-slate-200/60 dark:border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Portofolio</span>
            <Briefcase className="w-4 h-4 text-purple-500" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-slate-800 dark:text-slate-100">
            {portfolio.length}
          </div>
          <div className="text-[10px] text-slate-400">Proyek ditampilkan</div>
        </div>

        {/* Testimoni */}
        <div className="neu-flat p-4 sm:p-5 rounded-2xl border border-slate-200/60 dark:border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Testimoni</span>
            <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-slate-800 dark:text-slate-100">
            {testimonials.length}
          </div>
          <div className="text-[10px] text-slate-400">Rating 4.9/5.0</div>
        </div>

        {/* Leads Konsultasi */}
        <div className="neu-flat p-4 sm:p-5 rounded-2xl border border-slate-200/60 dark:border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Leads Masuk</span>
            <Inbox className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-slate-800 dark:text-slate-100">
            {inquiries.length}
          </div>
          <div className="text-[10px] text-rose-500 font-bold">{unreadInquiries} Belum dibaca</div>
        </div>
      </div>

      {/* Realtime Traffic Analytics Chart (Requirement 5) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left 8 Cols: 7-Day Chart */}
        <div className="lg:col-span-8 neu-flat p-6 sm:p-7 rounded-3xl border border-slate-200/80 dark:border-slate-800 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-1">
                <TrendingUp className="w-4 h-4" />
                <span>Traffic Track Realtime</span>
              </div>
              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">
                Statistik Kunjungan 7 Hari Terakhir
              </h3>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-md bg-blue-500 inline-block"></span>
                <span className="text-slate-600 dark:text-slate-300">Pageviews</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-md bg-indigo-400 inline-block"></span>
                <span className="text-slate-600 dark:text-slate-300">Unique Visitors</span>
              </div>
            </div>
          </div>

          {/* SVG/Bar Visual Chart */}
          <div className="pt-4">
            <div className="h-56 flex items-end justify-between gap-2 sm:gap-4 border-b border-slate-200/80 dark:border-slate-800 pb-3">
              {trafficStats.dailyStats.map((day, idx) => {
                const heightPercent = Math.max(12, Math.round((day.views / maxViewsInWeek) * 100));
                const visitorPercent = Math.max(8, Math.round((day.visitors / maxViewsInWeek) * 100));

                const dateFormatted = new Date(day.date).toLocaleDateString('id-ID', {
                  weekday: 'short',
                  day: 'numeric',
                });

                return (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                    {/* Tooltip on hover */}
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity text-[10px] font-bold p-1 rounded bg-slate-900 text-white shadow-md text-center pointer-events-none mb-1">
                      {day.views} views • {day.visitors} visit
                    </div>

                    <div className="w-full flex items-end justify-center gap-1 h-44">
                      {/* Views bar */}
                      <div
                        className="w-1/2 max-w-[28px] rounded-t-lg bg-gradient-to-t from-blue-600 to-blue-400 shadow-sm transition-all group-hover:brightness-110"
                        style={{ height: `${heightPercent}%` }}
                      />
                      {/* Visitors bar */}
                      <div
                        className="w-1/2 max-w-[28px] rounded-t-lg bg-gradient-to-t from-indigo-500 to-indigo-300 shadow-sm transition-all group-hover:brightness-110"
                        style={{ height: `${visitorPercent}%` }}
                      />
                    </div>

                    <span className="text-[10px] text-slate-400 font-medium whitespace-nowrap">
                      {dateFormatted}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Top Visited Pages */}
          <div className="pt-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              Halaman Paling Banyak Dikunjungi:
            </h4>
            <div className="space-y-2">
              {trafficStats.topPages.map((p, idx) => (
                <div
                  key={idx}
                  className="neu-pressed-sm p-3 rounded-xl flex items-center justify-between text-xs"
                >
                  <span className="font-semibold text-slate-700 dark:text-slate-200 truncate max-w-sm">
                    {p.path}
                  </span>
                  <span className="font-bold text-blue-600 dark:text-blue-400 shrink-0">
                    {p.count} Tayangan
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right 4 Cols: Device Breakdown & Quick Links */}
        <div className="lg:col-span-4 space-y-6">
          {/* Device Distribution Card */}
          <div className="neu-flat p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 space-y-4">
            <h4 className="font-bold text-sm text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-emerald-500" />
              <span>Perangkat Pengunjung</span>
            </h4>

            <div className="space-y-3">
              {/* Desktop */}
              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                    <Monitor className="w-3.5 h-3.5 text-blue-500" /> Desktop
                  </span>
                  <span className="font-bold text-slate-800 dark:text-slate-100">
                    {trafficStats.deviceCounts.desktop}
                  </span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                  <div
                    className="h-full bg-blue-500"
                    style={{
                      width: `${
                        trafficStats.totalPageviews > 0
                          ? (trafficStats.deviceCounts.desktop / trafficStats.totalPageviews) * 100
                          : 50
                      }%`,
                    }}
                  />
                </div>
              </div>

              {/* Mobile */}
              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                    <Smartphone className="w-3.5 h-3.5 text-emerald-500" /> Smartphone
                  </span>
                  <span className="font-bold text-slate-800 dark:text-slate-100">
                    {trafficStats.deviceCounts.mobile}
                  </span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                  <div
                    className="h-full bg-emerald-500"
                    style={{
                      width: `${
                        trafficStats.totalPageviews > 0
                          ? (trafficStats.deviceCounts.mobile / trafficStats.totalPageviews) * 100
                          : 40
                      }%`,
                    }}
                  />
                </div>
              </div>

              {/* Tablet */}
              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                    <Tablet className="w-3.5 h-3.5 text-purple-500" /> Tablet
                  </span>
                  <span className="font-bold text-slate-800 dark:text-slate-100">
                    {trafficStats.deviceCounts.tablet}
                  </span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                  <div
                    className="h-full bg-purple-500"
                    style={{
                      width: `${
                        trafficStats.totalPageviews > 0
                          ? (trafficStats.deviceCounts.tablet / trafficStats.totalPageviews) * 100
                          : 10
                      }%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Quick Management Shortcuts */}
          <div className="neu-flat p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 space-y-3">
            <h4 className="font-bold text-sm text-slate-800 dark:text-slate-100">
              Pintasan Pengelolaan
            </h4>
            <div className="grid grid-cols-1 gap-2 text-xs">
              <Link
                href="/senacms/articles/new"
                className="neu-button p-3 rounded-xl flex items-center justify-between text-slate-700 dark:text-slate-300 hover:text-blue-600 font-semibold"
              >
                <span>Tulis Artikel Baru (SEO Yoast)</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <Link
                href="/senacms/media"
                className="neu-button p-3 rounded-xl flex items-center justify-between text-slate-700 dark:text-slate-300 hover:text-blue-600 font-semibold"
              >
                <span>Upload Media / Logo Baru</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <Link
                href="/senacms/pricing"
                className="neu-button p-3 rounded-xl flex items-center justify-between text-slate-700 dark:text-slate-300 hover:text-blue-600 font-semibold"
              >
                <span>Atur Harga & Paket Layanan</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <Link
                href="/senacms/settings"
                className="neu-button p-3 rounded-xl flex items-center justify-between text-slate-700 dark:text-slate-300 hover:text-blue-600 font-semibold"
              >
                <span>Edit Navigasi Menu & Favicon</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Leads / Inquiries */}
      <div className="neu-flat p-6 sm:p-7 rounded-3xl border border-slate-200/80 dark:border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <Inbox className="w-4 h-4 text-emerald-500" />
              <span>Konsultasi & Prospek Masuk Terbaru</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Pesan yang masuk dari formulir homepage & landing page kota.
            </p>
          </div>
          <Link
            href="/senacms/inquiries"
            className="neu-button px-3.5 py-1.5 rounded-xl text-xs font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700"
          >
            Lihat Semua Leads ({inquiries.length})
          </Link>
        </div>

        {inquiries.length === 0 ? (
          <p className="text-xs text-slate-400 py-4 text-center">Belum ada formulir konsultasi yang masuk.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-xs text-left">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase font-semibold">
                  <th className="py-2.5 px-3">Nama</th>
                  <th className="py-2.5 px-3">WhatsApp / Telepon</th>
                  <th className="py-2.5 px-3">Layanan</th>
                  <th className="py-2.5 px-3">Budget</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3 text-right">Aksi Cepat</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/60 dark:divide-slate-800/60 text-slate-700 dark:text-slate-200">
                {inquiries.slice(0, 5).map((inq) => (
                  <tr key={inq.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                    <td className="py-3 px-3 font-semibold">{inq.name}</td>
                    <td className="py-3 px-3">{inq.phone}</td>
                    <td className="py-3 px-3">{inq.service}</td>
                    <td className="py-3 px-3">{inq.budget || '-'}</td>
                    <td className="py-3 px-3">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          inq.status === 'unread'
                            ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                            : inq.status === 'contacted'
                            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                            : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                        }`}
                      >
                        {inq.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <a
                        href={`https://wa.me/${inq.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                          `Halo Bpk/Ibu ${inq.name}, saya dari SenaWeb ingin menindaklanjuti pesan konsultasi Anda mengenai ${inq.service}.`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="neu-button px-2.5 py-1 rounded-lg text-emerald-600 hover:text-emerald-700 inline-flex items-center gap-1 font-bold text-[11px]"
                      >
                        <MessageCircle className="w-3 h-3" />
                        <span>Balas WA</span>
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
