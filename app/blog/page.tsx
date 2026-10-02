import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { getArticles, getCategories, getTags, getSettings } from '@/lib/db';
import {
  Search,
  BookOpen,
  Calendar,
  Clock,
  ArrowRight,
  Sparkles,
  Tag,
  FolderOpen,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  const title = settings.seo_blog_title || 'Blog & Wawasan Digital – Tutorial, SEO & Tips Bisnis Web';
  const description = settings.seo_blog_description || 'Kumpulan artikel seputar strategi pembuatan website profesional, optimasi SEO Google, tren desain Neumorphism, dan kiat sukses bisnis digital.';

  return {
    title,
    description,
    openGraph: {
      title,
      description,
    },
  };
}

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string; tag?: string; page?: string }>;
}) {
  const params = await searchParams;
  const q = params.q || '';
  const categorySlug = params.category || '';
  const tagSlug = params.tag || '';
  const currentPage = parseInt(params.page || '1', 10);
  const pageSize = 6;
  const offset = (currentPage - 1) * pageSize;

  const [categories, tags, articlesRes] = await Promise.all([
    getCategories(),
    getTags(),
    getArticles({
      status: 'published',
      search: q,
      tagSlug: tagSlug || undefined,
      limit: pageSize,
      offset,
    }),
  ]);

  let articles = articlesRes.articles;
  let total = articlesRes.total;

  // Filter by category if param exists
  if (categorySlug) {
    const selectedCat = categories.find((c) => c.slug === categorySlug);
    if (selectedCat) {
      const filteredRes = await getArticles({
        status: 'published',
        categoryId: selectedCat.id,
        search: q,
        tagSlug: tagSlug || undefined,
        limit: pageSize,
        offset,
      });
      articles = filteredRes.articles;
      total = filteredRes.total;
    }
  }

  const totalPages = Math.ceil(total / pageSize);
  const featuredArticle = articles.length > 0 && currentPage === 1 && !q && !categorySlug && !tagSlug ? articles[0] : null;
  const gridArticles = featuredArticle ? articles.slice(1) : articles;

  return (
    <div className="py-10 sm:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      {/* Blog Hero Header */}
      <div className="text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 neu-flat-xs mb-3">
          <BookOpen className="w-3.5 h-3.5" />
          <span>Pusat Edukasi & Tren Web Digital</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
          Blog SenaWeb & Wawasan Bisnis
        </h1>
        <p className="mt-3 text-sm sm:text-base text-slate-500 dark:text-slate-400">
          Trik praktis mendatangkan pelanggan dari Google, panduan arsitektur website modern, dan studi kasus digitalisasi UMKM Indonesia.
        </p>

        {/* Search Bar */}
        <form method="GET" action="/blog" className="mt-6 max-w-xl mx-auto flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
            <input
              type="text"
              name="q"
              defaultValue={q}
              placeholder="Cari artikel seputar SEO, Next.js, UMKM..."
              className="w-full neu-pressed pl-10 pr-4 py-3 text-xs sm:text-sm rounded-2xl outline-none text-slate-800 dark:text-slate-100 placeholder:text-slate-400"
            />
          </div>
          <button
            type="submit"
            className="neu-accent-btn px-5 py-3 rounded-2xl text-xs sm:text-sm font-semibold tracking-wide shrink-0"
          >
            Cari Artikel
          </button>
        </form>
      </div>

      {/* Category Pills Bar */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        <Link
          href="/blog"
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
            !categorySlug && !tagSlug
              ? 'neu-pressed text-blue-600 dark:text-blue-400 font-bold border border-blue-400/40'
              : 'neu-button text-slate-600 dark:text-slate-300 hover:text-blue-600'
          }`}
        >
          Semua Topik ({total})
        </Link>
        {categories.map((cat) => (
          <Link
            key={cat.id}
            href={`/blog?category=${cat.slug}`}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
              categorySlug === cat.slug
                ? 'neu-pressed text-blue-600 dark:text-blue-400 font-bold border border-blue-400/40'
                : 'neu-button text-slate-600 dark:text-slate-300 hover:text-blue-600'
            }`}
          >
            {cat.name} ({cat.article_count})
          </Link>
        ))}
      </div>

      {/* Featured Article Banner (on first page default) */}
      {featuredArticle && (
        <div className="neu-flat rounded-3xl overflow-hidden border border-slate-200/60 dark:border-slate-800 p-6 sm:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <Link
              href={`/blog/${featuredArticle.slug}`}
              className="lg:col-span-7 block relative aspect-[16/10] rounded-2xl overflow-hidden neu-pressed-sm group"
            >
              <img
                src={featuredArticle.thumbnail || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1000&auto=format&fit=crop&q=80'}
                alt={featuredArticle.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <span className="absolute top-4 left-4 px-3 py-1 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-bold flex items-center gap-1 shadow-md">
                <Sparkles className="w-3.5 h-3.5" /> Artikel Utama Pilihan
              </span>
            </Link>

            <div className="lg:col-span-5 space-y-4">
              <div className="flex items-center gap-3 text-xs text-slate-400">
                {featuredArticle.category && (
                  <span className="px-2.5 py-0.5 rounded-lg bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 font-bold">
                    {featuredArticle.category.name}
                  </span>
                )}
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" /> {featuredArticle.reading_time || 4} mnt baca
                </span>
              </div>

              <h2 className="text-xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 leading-tight hover:text-blue-600 transition-colors">
                <Link href={`/blog/${featuredArticle.slug}`}>
                  {featuredArticle.title}
                </Link>
              </h2>

              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-3">
                {featuredArticle.excerpt}
              </p>

              <div className="pt-2 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <img
                    src={featuredArticle.author?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&auto=format&fit=crop&q=80'}
                    alt={featuredArticle.author?.full_name || 'Admin'}
                    className="w-8 h-8 rounded-full object-cover border border-white dark:border-slate-700"
                  />
                  <div className="text-xs">
                    <div className="font-semibold text-slate-800 dark:text-slate-200">
                      {featuredArticle.author?.full_name || 'SenaWeb Editorial'}
                    </div>
                    <div className="text-slate-400">
                      {new Date(featuredArticle.created_at).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </div>
                  </div>
                </div>

                <Link
                  href={`/blog/${featuredArticle.slug}`}
                  className="neu-button px-4 py-2 rounded-xl text-xs font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1.5"
                >
                  <span>Baca Artikel</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Grid of Articles */}
      {gridArticles.length === 0 && !featuredArticle ? (
        <div className="text-center py-16 neu-flat rounded-3xl border border-slate-200/60 dark:border-slate-800 p-8 space-y-4">
          <BookOpen className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">
            Tidak Ada Artikel Ditemukan
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
            Coba kata kunci lain atau pilih kategori topik yang berbeda.
          </p>
          <Link
            href="/blog"
            className="neu-button inline-flex items-center px-4 py-2 rounded-xl text-xs font-semibold text-blue-600"
          >
            Reset Filter
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {gridArticles.map((article) => (
            <article
              key={article.id}
              className="neu-flat rounded-3xl overflow-hidden flex flex-col justify-between border border-slate-200/50 dark:border-slate-800 hover:-translate-y-2 transition-all duration-300 group"
            >
              <div>
                <Link href={`/blog/${article.slug}`} className="block relative aspect-[16/10] overflow-hidden">
                  <img
                    src={article.thumbnail || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&auto=format&fit=crop&q=80'}
                    alt={article.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  {article.category && (
                    <span className="absolute top-3 left-3 px-3 py-1 rounded-xl bg-black/60 backdrop-blur-md text-white text-[11px] font-semibold">
                      {article.category.name}
                    </span>
                  )}
                </Link>

                <div className="p-6">
                  <div className="flex items-center gap-3 text-xs text-slate-400 mb-2">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(article.created_at).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {article.reading_time || 3} mnt baca
                    </span>
                  </div>

                  <h3 className="font-bold text-base sm:text-lg text-slate-800 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2 leading-snug">
                    <Link href={`/blog/${article.slug}`}>
                      {article.title}
                    </Link>
                  </h3>

                  <p className="mt-2 text-xs sm:text-sm text-slate-500 dark:text-slate-400 line-clamp-3 leading-relaxed">
                    {article.excerpt}
                  </p>
                </div>
              </div>

              <div className="px-6 pb-6 pt-0 flex items-center justify-between border-t border-slate-200/50 dark:border-slate-800/60 pt-4">
                <div className="text-xs text-slate-400">
                  By {article.author?.full_name || 'Admin'}
                </div>
                <Link
                  href={`/blog/${article.slug}`}
                  className="neu-button py-1.5 px-3 rounded-xl text-xs font-semibold text-blue-600 dark:text-blue-400 flex items-center gap-1"
                >
                  <span>Baca</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-6">
          {currentPage > 1 && (
            <Link
              href={`/blog?page=${currentPage - 1}${categorySlug ? `&category=${categorySlug}` : ''}${q ? `&q=${q}` : ''}`}
              className="neu-button p-2.5 rounded-xl text-slate-700 dark:text-slate-300"
            >
              <ChevronLeft className="w-4 h-4" />
            </Link>
          )}

          {Array.from({ length: totalPages }).map((_, idx) => {
            const pageNum = idx + 1;
            const isCurrent = pageNum === currentPage;
            return (
              <Link
                key={pageNum}
                href={`/blog?page=${pageNum}${categorySlug ? `&category=${categorySlug}` : ''}${q ? `&q=${q}` : ''}`}
                className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold transition-all ${
                  isCurrent
                    ? 'neu-pressed text-blue-600 dark:text-blue-400 border border-blue-400/50'
                    : 'neu-button text-slate-600 dark:text-slate-300'
                }`}
              >
                {pageNum}
              </Link>
            );
          })}

          {currentPage < totalPages && (
            <Link
              href={`/blog?page=${currentPage + 1}${categorySlug ? `&category=${categorySlug}` : ''}${q ? `&q=${q}` : ''}`}
              className="neu-button p-2.5 rounded-xl text-slate-700 dark:text-slate-300"
            >
              <ChevronRight className="w-4 h-4" />
            </Link>
          )}
        </div>
      )}

      {/* Tag Cloud Footer */}
      {tags.length > 0 && (
        <div className="neu-flat p-6 rounded-3xl border border-slate-200/60 dark:border-slate-800 text-center">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center justify-center gap-1.5">
            <Tag className="w-3.5 h-3.5" />
            <span>Jelajahi Berdasarkan Tag Populer</span>
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {tags.map((t) => (
              <Link
                key={t.id}
                href={`/blog?tag=${t.slug}`}
                className={`text-xs px-3 py-1.5 rounded-xl font-medium ${
                  tagSlug === t.slug
                    ? 'neu-pressed text-blue-600 dark:text-blue-400 font-bold'
                    : 'neu-button text-slate-600 dark:text-slate-400 hover:text-blue-600'
                }`}
              >
                #{t.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
