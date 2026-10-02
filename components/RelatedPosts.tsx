'use client';

import React from 'react';
import Link from 'next/link';
import { Clock, Calendar, ArrowRight, BookOpen } from 'lucide-react';
import { ArticleWithRelations } from '@/lib/db';

interface RelatedPostsProps {
  articles: ArticleWithRelations[];
  currentCategoryName?: string;
}

export function RelatedPosts({ articles, currentCategoryName }: RelatedPostsProps) {
  if (!articles || articles.length === 0) {
    return null;
  }

  return (
    <div className="mt-14 pt-10 border-t border-slate-200 dark:border-slate-800">
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400 mb-1">
            <BookOpen className="w-4 h-4" />
            <span>Artikel Terkait</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-slate-100">
            {currentCategoryName ? `Rekomendasi Seputar ${currentCategoryName}` : 'Artikel Terkait Lainnya'}
          </h3>
        </div>
        <Link
          href="/blog"
          className="text-xs sm:text-sm font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 flex items-center gap-1 group"
        >
          <span>Lihat Semua</span>
          <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {articles.slice(0, 3).map((item) => (
          <article
            key={item.id}
            className="neu-flat rounded-2xl overflow-hidden flex flex-col justify-between border border-slate-200/50 dark:border-slate-800 hover:-translate-y-1.5 transition-all duration-300 group"
          >
            <div>
              {/* Thumbnail */}
              <Link href={`/blog/${item.slug}`} className="block relative aspect-video overflow-hidden">
                <img
                  src={item.thumbnail || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&auto=format&fit=crop&q=80'}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                {item.category && (
                  <span className="absolute top-3 left-3 px-2.5 py-1 text-[11px] font-semibold rounded-lg bg-black/60 backdrop-blur-md text-white">
                    {item.category.name}
                  </span>
                )}
              </Link>

              {/* Title & Excerpt */}
              <div className="p-4 sm:p-5">
                <div className="flex items-center gap-3 text-[11px] text-slate-400 mb-2">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {new Date(item.created_at).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {item.reading_time || 3} mnt baca
                  </span>
                </div>
                <h4 className="font-bold text-sm sm:text-base text-slate-800 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2 leading-snug">
                  <Link href={`/blog/${item.slug}`}>
                    {item.title}
                  </Link>
                </h4>
                <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                  {item.excerpt}
                </p>
              </div>
            </div>

            {/* Read more footer */}
            <div className="px-4 pb-4 sm:px-5 sm:pb-5 pt-0">
              <Link
                href={`/blog/${item.slug}`}
                className="text-xs font-semibold text-blue-600 dark:text-blue-400 flex items-center gap-1 hover:gap-1.5 transition-all"
              >
                <span>Baca Selengkapnya</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
