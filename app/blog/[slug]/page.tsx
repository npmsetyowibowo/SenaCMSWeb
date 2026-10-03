import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import {
  getArticleBySlug,
  getRelatedArticles,
  getArticles,
  getSettings,
} from '@/lib/db';
import { RelatedPosts } from '@/components/RelatedPosts';
import { ArticleViewTracker } from '@/components/ArticleViewTracker';
import {
  Calendar,
  Clock,
  Eye,
  User,
  Share2,
  Bookmark,
  ArrowLeft,
  ArrowRight,
  ListTree,
  ChevronRight,
  MessageCircle,
  Copy,
} from 'lucide-react';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug, true);
  if (!article) {
    return {
      title: 'Artikel Tidak Ditemukan',
    };
  }

  const settings = await getSettings();
  const domain = settings.site_domain || 'https://senaweb.id';
  const url = `${domain}/blog/${article.slug}`;

  return {
    title: article.seo_title || article.title,
    description: article.seo_description || article.excerpt,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: article.seo_title || article.title,
      description: article.seo_description || article.excerpt,
      url,
      type: 'article',
      publishedTime: article.published_at || article.created_at,
      authors: [article.author?.full_name || 'SenaWeb Editorial'],
      images: [
        {
          url: article.thumbnail || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200',
          width: 1200,
          height: 630,
          alt: article.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: article.seo_title || article.title,
      description: article.seo_description || article.excerpt,
      images: [article.thumbnail || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200'],
    },
  };
}

export default async function BlogDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug, true);

  if (!article) {
    notFound();
  }

  const [related, allArticlesRes, settings] = await Promise.all([
    getRelatedArticles(article.id, article.category_id, 3),
    getArticles({ status: 'published', limit: 50 }),
    getSettings(),
  ]);

  const domain = settings.site_domain || 'https://senaweb.id';
  const articleUrl = `${domain}/blog/${article.slug}`;

  // Find previous and next articles
  const allArticles = allArticlesRes.articles;
  const currentIndex = allArticles.findIndex((a) => a.id === article.id);
  const prevArticle = currentIndex > 0 ? allArticles[currentIndex - 1] : null;
  const nextArticle = currentIndex < allArticles.length - 1 ? allArticles[currentIndex + 1] : null;

  // Extract Table of Contents from H2 & H3
  const headingRegex = /<(h[23])[^>]*>(.*?)<\/\1>/gi;
  const toc: { level: string; text: string; id: string }[] = [];
  let match;
  let processedContent = article.content;

  let headingCounter = 1;
  while ((match = headingRegex.exec(article.content)) !== null) {
    const level = match[1];
    const text = match[2].replace(/<[^>]+>/g, '').trim();
    const anchorId = `section-${headingCounter++}`;
    toc.push({ level, text, id: anchorId });
  }

  // Inject anchor IDs into headings in content
  let headingReplaceCount = 1;
  processedContent = processedContent.replace(/<(h[23])([^>]*)>(.*?)<\/\1>/gi, (_, tag, attrs, inner) => {
    const id = `section-${headingReplaceCount++}`;
    return `<${tag} id="${id}" ${attrs}>${inner}</${tag}>`;
  });

  // Schema.org Article Structured Data
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': articleUrl,
    },
    headline: article.seo_title || article.title,
    description: article.seo_description || article.excerpt,
    image: article.thumbnail,
    author: {
      '@type': 'Person',
      name: article.author?.full_name || 'Clarissa Sena',
    },
    publisher: {
      '@type': 'Organization',
      name: 'SenaWeb',
      logo: {
        '@type': 'ImageObject',
        url: settings.site_logo || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200',
      },
    },
    datePublished: article.published_at || article.created_at,
    dateModified: article.updated_at || article.created_at,
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: domain,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Blog',
        item: `${domain}/blog`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: article.title,
        item: articleUrl,
      },
    ],
  };

  return (
    <article className="py-10 sm:py-16 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      <ArticleViewTracker articleId={article.id} />
      {/* Structured Data Script */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-6 flex-wrap">
        <Link href="/" className="hover:text-blue-600 transition-colors">
          Home
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link href="/blog" className="hover:text-blue-600 transition-colors">
          Blog
        </Link>
        {article.category && (
          <>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link
              href={`/blog?category=${article.category.slug}`}
              className="hover:text-blue-600 transition-colors font-medium text-slate-700 dark:text-slate-300"
            >
              {article.category.name}
            </Link>
          </>
        )}
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-slate-400 truncate max-w-xs">{article.title}</span>
      </nav>

      {/* Header Info */}
      <header className="space-y-4 mb-8">
        {article.category && (
          <span className="inline-block px-3.5 py-1 rounded-xl bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 text-xs font-bold uppercase tracking-wider neu-flat-xs">
            {article.category.name}
          </span>
        )}

        <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight leading-[1.2]">
          {article.title}
        </h1>

        <p className="text-sm sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
          {article.excerpt}
        </p>

        {/* Metadata row */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-200/80 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-3">
            <img
              src={article.author?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&auto=format&fit=crop&q=80'}
              alt={article.author?.full_name || 'Admin'}
              className="w-10 h-10 rounded-full object-cover border-2 border-white dark:border-slate-700 neu-flat-xs"
            />
            <div>
              <div className="font-semibold text-slate-800 dark:text-slate-200">
                {article.author?.full_name || 'Clarissa Sena (SenaWeb)'}
              </div>
              <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-0.5">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {new Date(article.created_at).toLocaleDateString('id-ID', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {article.reading_time || 4} mnt baca
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Eye className="w-3 h-3" />
                  {article.views || 1}x dilihat
                </span>
              </div>
            </div>
          </div>

          {/* Social Share Buttons */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold mr-1">Bagikan:</span>
            <a
              href={`https://api.whatsapp.com/send?text=${encodeURIComponent(`${article.title} - ${articleUrl}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="neu-button p-2 rounded-xl text-emerald-600 hover:text-emerald-500"
              title="Bagikan ke WhatsApp"
            >
              <MessageCircle className="w-4 h-4" />
            </a>
            <a
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(article.title)}&url=${encodeURIComponent(articleUrl)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="neu-button p-2 rounded-xl text-blue-500 hover:text-blue-400"
              title="Bagikan ke Twitter / X"
            >
              <Share2 className="w-4 h-4" />
            </a>
          </div>
        </div>
      </header>

      {/* Featured Thumbnail */}
      <div className="neu-flat rounded-3xl overflow-hidden aspect-[16/9] mb-10 neu-pressed-sm">
        <img
          src={article.thumbnail || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&auto=format&fit=crop&q=80'}
          alt={article.title}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Main Article Content */}
        <div className="lg:col-span-8">
          {/* Table of Contents (TOC) Box */}
          {toc.length >= 2 && (
            <div className="neu-flat p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 mb-8">
              <div className="flex items-center gap-2 font-bold text-sm text-slate-800 dark:text-slate-100 mb-3">
                <ListTree className="w-4 h-4 text-blue-500" />
                <span>Daftar Isi Artikel (TOC)</span>
              </div>
              <ul className="space-y-1.5 text-xs">
                {toc.map((item, idx) => (
                  <li
                    key={idx}
                    className={`${item.level === 'h3' ? 'pl-4 text-slate-500 dark:text-slate-400' : 'font-semibold text-slate-700 dark:text-slate-300'}`}
                  >
                    <a
                      href={`#${item.id}`}
                      className="hover:text-blue-600 transition-colors flex items-center gap-1.5"
                    >
                      <span className="text-[10px] text-blue-500">•</span>
                      <span>{item.text}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Rendered HTML Content */}
          <div
            className="prose dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 text-sm sm:text-base leading-relaxed space-y-4"
            dangerouslySetInnerHTML={{ __html: processedContent }}
          />

          {/* Tags list */}
          {article.tags && article.tags.length > 0 && (
            <div className="mt-10 pt-6 border-t border-slate-200/80 dark:border-slate-800 flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold text-slate-400">Tag Terkait:</span>
              {article.tags.map((t) => (
                <Link
                  key={t.id}
                  href={`/blog?tag=${t.slug}`}
                  className="neu-button px-3 py-1 rounded-xl text-xs text-slate-600 dark:text-slate-300 hover:text-blue-600"
                >
                  #{t.name}
                </Link>
              ))}
            </div>
          )}

          {/* Previous & Next Post Navigation */}
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {prevArticle ? (
              <Link
                href={`/blog/${prevArticle.slug}`}
                className="neu-button p-4 rounded-2xl flex flex-col justify-between group"
              >
                <span className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
                  <ArrowLeft className="w-3 h-3" /> Artikel Sebelumnya
                </span>
                <span className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 group-hover:text-blue-600 transition-colors line-clamp-2 mt-1">
                  {prevArticle.title}
                </span>
              </Link>
            ) : (
              <div />
            )}

            {nextArticle ? (
              <Link
                href={`/blog/${nextArticle.slug}`}
                className="neu-button p-4 rounded-2xl flex flex-col justify-between items-end text-right group"
              >
                <span className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
                  Artikel Selanjutnya <ArrowRight className="w-3 h-3" />
                </span>
                <span className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 group-hover:text-blue-600 transition-colors line-clamp-2 mt-1">
                  {nextArticle.title}
                </span>
              </Link>
            ) : (
              <div />
            )}
          </div>
        </div>

        {/* Right Sidebar: Author & Consultation Banner */}
        <aside className="lg:col-span-4 space-y-6">
          {/* Author Card */}
          <div className="neu-flat p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 text-center space-y-3">
            <img
              src={article.author?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
              alt={article.author?.full_name || 'Admin'}
              className="w-16 h-16 rounded-full mx-auto object-cover neu-flat-xs border-2 border-white dark:border-slate-700"
            />
            <h4 className="font-bold text-sm text-slate-800 dark:text-slate-100">
              {article.author?.full_name || 'Clarissa Sena, S.Kom.'}
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Konsultan transformasi digital dan spesialis SEO teknis di SenaWeb dengan pengalaman membangun ratusan website UMKM & korporasi di Indonesia.
            </p>
          </div>

          {/* CTA Banner */}
          <div className="neu-flat p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-gradient-to-br from-blue-50/50 to-indigo-50/50 dark:from-slate-900/60 dark:to-slate-800/60 text-center space-y-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
              Butuh Website Seperti Ini?
            </span>
            <h4 className="font-extrabold text-base text-slate-800 dark:text-slate-100 leading-snug">
              Buat Website Profesional Bisnis Anda Bersama SenaWeb
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Dapatkan website modern, cepat, dan siap mendatangkan omset mulai Rp750.000 sekali bayar.
            </p>
            <a
              href={`https://wa.me/${(settings.whatsapp_number || '6281234567890').replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                `Halo SenaWeb, saya membaca artikel "${article.title}" dan tertarik konsultasi pembuatan website.`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full neu-accent-btn py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Konsultasi Gratis via WhatsApp</span>
            </a>
          </div>
        </aside>
      </div>

      {/* Requirement 6: Related Posts Component */}
      <RelatedPosts
        articles={related}
        currentCategoryName={article.category?.name}
      />
    </article>
  );
}
