import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
import { getArticles, getCategories, getTags, getPortfolioList, getPages, getSettings, getCities } from '@/lib/db';

export async function GET() {
  const [settings, articlesRes, categories, tags, portfolio, pages, cities] = await Promise.all([
    getSettings(),
    getArticles({ status: 'published' }),
    getCategories(),
    getTags(),
    getPortfolioList(),
    getPages(),
    getCities(),
  ]);

  const domain = settings.site_domain || 'https://senaweb.id';
  const now = new Date().toISOString();

  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

  // 1. Core Pages
  const corePages = [
    { path: '', priority: '1.0', freq: 'daily' },
    { path: '/portfolio', priority: '0.9', freq: 'weekly' },
    { path: '/layanan', priority: '0.9', freq: 'weekly' },
    { path: '/paket', priority: '0.9', freq: 'weekly' },
    { path: '/kontak', priority: '0.8', freq: 'monthly' },
    { path: '/blog', priority: '0.9', freq: 'daily' },
  ];

  for (const cp of corePages) {
    xml += `  <url>\n    <loc>${domain}${cp.path}</loc>\n    <lastmod>${now}</lastmod>\n    <changefreq>${cp.freq}</changefreq>\n    <priority>${cp.priority}</priority>\n  </url>\n`;
  }

  // 2. Published City Landing Pages
  for (const city of cities) {
    if (city.status === 'published') {
      xml += `  <url>\n    <loc>${domain}/${city.slug}</loc>\n    <lastmod>${new Date(city.updated_at || now).toISOString()}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.9</priority>\n  </url>\n`;
    }
  }

  // 3. Published Articles
  for (const art of articlesRes.articles) {
    const artDate = art.updated_at || art.created_at || now;
    xml += `  <url>\n    <loc>${domain}/blog/${art.slug}</loc>\n    <lastmod>${new Date(artDate).toISOString()}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.8</priority>\n  </url>\n`;
  }

  // 4. Categories
  for (const cat of categories) {
    xml += `  <url>\n    <loc>${domain}/category/${cat.slug}</loc>\n    <changefreq>weekly</changefreq>\n    <priority>0.7</priority>\n  </url>\n`;
  }

  // 5. Tags
  for (const tag of tags) {
    xml += `  <url>\n    <loc>${domain}/tag/${tag.slug}</loc>\n    <changefreq>weekly</changefreq>\n    <priority>0.6</priority>\n  </url>\n`;
  }

  // 6. Portfolio Items
  for (const p of portfolio) {
    xml += `  <url>\n    <loc>${domain}/portfolio/${p.slug}</loc>\n    <changefreq>monthly</changefreq>\n    <priority>0.7</priority>\n  </url>\n`;
  }

  // 7. Published Custom Pages (excluding admin / private)
  for (const page of pages) {
    if (page.status === 'published') {
      xml += `  <url>\n    <loc>${domain}/${page.slug}</loc>\n    <lastmod>${new Date(page.updated_at || now).toISOString()}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.6</priority>\n  </url>\n`;
    }
  }

  xml += `</urlset>`;

  return new NextResponse(xml, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}
