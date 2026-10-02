import React from 'react';
import type { Metadata } from 'next';
import { getPortfolioList, getSettings } from '@/lib/db';
import { PortfolioClientView } from './PortfolioClientView';

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  const title = settings.seo_portfolio_title || 'Portfolio Hasil Pembuatan Website – Studi Kasus & Karya Nyata SenaWeb';
  const description = settings.seo_portfolio_description || 'Lihat koleksi portfolio website terbaik yang telah kami kerjakan untuk company profile, toko online e-commerce, UMKM, dan institusi pendidikan di Indonesia.';

  return {
    title,
    description,
    openGraph: {
      title,
      description,
    },
  };
}

export default async function PortfolioPage() {
  const [portfolioList, settings] = await Promise.all([
    getPortfolioList(),
    getSettings(),
  ]);

  return (
    <PortfolioClientView
      initialPortfolio={portfolioList}
      whatsappNumber={settings.whatsapp_number || '6281234567890'}
    />
  );
}
