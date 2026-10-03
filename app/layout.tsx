import type { Metadata } from 'next';
import './globals.css';
import { getSettings } from '@/lib/db';
import { ToastProvider } from '@/components/Toast';
import { PublicLayoutChrome } from '@/components/PublicLayoutChrome';

// Settings and public content are managed from the CMS, so always render with fresh DB data.
export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  const siteName = settings.site_name || 'SenaWeb';
  const siteTagline = settings.site_tagline || 'JASA PEMBUATAN WEBSITE';
  const description = settings.site_description || 'Jasa pembuatan website profesional, modern Neumorphic, SEO-friendly, dan responsif untuk UMKM, Company Profile, dan Bisnis Indonesia.';
  const domain = settings.site_domain || 'https://senaweb.id';
  const favicon = settings.site_favicon || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=64&auto=format&fit=crop&q=80';
  const rawLogo = settings.site_logo || favicon;
  const logoUrl = rawLogo.startsWith('http://') || rawLogo.startsWith('https://')
    ? rawLogo
    : new URL(rawLogo, domain).toString();

  return {
    metadataBase: new URL(domain),
    title: {
      default: `${siteName} – ${siteTagline} Profesional & Cepat No. 1`,
      template: `%s | ${siteName}`,
    },
    description,
    keywords: [
      'jasa pembuatan website',
      'jasa web surabaya',
      'jasa web sidoarjo',
      'jasa web solo',
      'jasa web purwokerto',
      'jasa web lumajang',
      'pembuatan website profesional',
      'bikin web umkm',
      'jasa landing page',
    ],
    icons: {
      icon: favicon,
      shortcut: favicon,
      apple: favicon,
    },
    openGraph: {
      title: `${siteName} – ${siteTagline}`,
      description,
      url: domain,
      siteName,
      locale: 'id_ID',
      type: 'website',
      images: [
        {
          url: logoUrl,
          alt: `${siteName} logo`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${siteName} – ${siteTagline}`,
      description,
      creator: '@senaweb_id',
      images: [logoUrl],
    },
  };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getSettings();
  const siteName = settings.site_name || 'SenaWeb';
  const siteTagline = settings.site_tagline || 'JASA PEMBUATAN WEBSITE';
  const siteLogo = settings.site_logo;
  const whatsappNumber = settings.whatsapp_number || '6281234567890';
  const brandAmbassadorName = settings.brand_ambassador_name || 'Clarissa Sena (SenaWeb)';

  let menuItems = [];
  try {
    if (settings.navigation_menu) {
      menuItems = JSON.parse(settings.navigation_menu);
    }
  } catch {
    menuItems = [];
  }

  // Schema.org WebSite & Organization structured data
  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': 'https://senaweb.id/#organization',
        name: siteName,
        url: 'https://senaweb.id',
        logo: siteLogo || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200',
        sameAs: [
          settings.instagram_url || 'https://instagram.com/senaweb.id',
          settings.facebook_url || 'https://facebook.com/senaweb.id',
          settings.linkedin_url || 'https://linkedin.com/company/senaweb',
        ],
        contactPoint: {
          '@type': 'ContactPoint',
          telephone: `+${whatsappNumber}`,
          contactType: 'customer service',
          areaServed: 'ID',
          availableLanguage: ['Indonesian', 'English'],
        },
      },
      {
        '@type': 'WebSite',
        '@id': 'https://senaweb.id/#website',
        url: 'https://senaweb.id',
        name: siteName,
        publisher: { '@id': 'https://senaweb.id/#organization' },
        inLanguage: 'id-ID',
      },
    ],
  };

  return (
    <html lang="id" className="scroll-smooth" suppressHydrationWarning>
      <head>
        <meta name="google-site-verification" content="gT1Q4bS1_Q22UphxLmDwJGY-VnkMML7h_j027NzZ-RM"/>
        <meta name="color-scheme" content="light" />
        <script
          dangerouslySetInnerHTML={{
            __html: `document.documentElement.classList.remove('dark');document.documentElement.style.colorScheme='light';try{localStorage.removeItem('sena_theme')}catch(e){}`,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </head>
      <body className="min-h-screen flex flex-col antialiased">
        <ToastProvider>
          <PublicLayoutChrome
            siteName={siteName}
            siteTagline={siteTagline}
            siteLogo={siteLogo}
            siteDescription={settings.site_description}
            whatsappNumber={whatsappNumber}
            brandAmbassadorName={brandAmbassadorName}
            menuItems={menuItems}
            contactEmail={settings.contact_email}
            contactPhone={settings.contact_phone}
            contactAddress={settings.contact_address}
          >
            {children}
          </PublicLayoutChrome>
        </ToastProvider>
      </body>
    </html>
  );
}
