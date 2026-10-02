import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getTagBySlug, getArticles } from '@/lib/db';
import { Calendar, Clock, ArrowRight, ArrowLeft, Tag as TagIcon } from 'lucide-react';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const tag = await getTagBySlug(slug);
  if (!tag) return { title: 'Tag Tidak Ditemukan' };

  return {
    title: `Artikel Tag #${tag.name} | SenaWeb`,
    description: `Daftar artikel dan tips website dengan tag #${tag.name} di SenaWeb.`,
  };
}

export default async function TagPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const tag = await getTagBySlug(slug);
  if (!tag) notFound();

  const articlesRes = await getArticles({
    status: 'published',
    tagSlug: tag.slug,
  });
  const articles = articlesRes.articles;

  return (
    <div className="py-10 sm:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
      <div>
        <Link
          href="/blog"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 mb-4"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Kembali ke Semua Artikel</span>
        </Link>
        <span className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1 flex items-center gap-1">
          <TagIcon className="w-3.5 h-3.5 text-blue-500" />
          <span>Arsip Tag</span>
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-slate-100">
          #{tag.name}
        </h1>
      </div>

      {articles.length === 0 ? (
        <div className="neu-flat p-8 rounded-3xl text-center border border-slate-200/60 dark:border-slate-800">
          <p className="text-sm text-slate-500">Belum ada artikel yang bertag #{tag.name}.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {articles.map((article) => (
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
                  />
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

                  <h3 className="font-bold text-base sm:text-lg text-slate-800 dark:text-slate-100 group-hover:text-blue-600 transition-colors line-clamp-2 leading-snug">
                    <Link href={`/blog/${article.slug}`}>
                      {article.title}
                    </Link>
                  </h3>

                  <p className="mt-2 text-xs sm:text-sm text-slate-500 dark:text-slate-400 line-clamp-3 leading-relaxed">
                    {article.excerpt}
                  </p>
                </div>
              </div>

              <div className="px-6 pb-6 pt-0">
                <Link
                  href={`/blog/${article.slug}`}
                  className="neu-button py-2 px-4 rounded-xl text-xs font-semibold text-blue-600 dark:text-blue-400 flex items-center justify-between"
                >
                  <span>Baca Selengkapnya</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
