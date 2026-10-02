'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { WhatsAppWidget } from './WhatsAppWidget';

interface NavItem {
  label: string;
  url: string;
}

interface PublicLayoutChromeProps {
  children: React.ReactNode;
  siteName: string;
  siteTagline: string;
  siteLogo?: string;
  siteDescription?: string;
  whatsappNumber: string;
  brandAmbassadorName?: string;
  menuItems: NavItem[];
  contactEmail?: string;
  contactPhone?: string;
  contactAddress?: string;
}

export function PublicLayoutChrome({
  children,
  siteName,
  siteTagline,
  siteLogo,
  siteDescription,
  whatsappNumber,
  brandAmbassadorName,
  menuItems,
  contactEmail,
  contactPhone,
  contactAddress,
}: PublicLayoutChromeProps) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/senacms');

  // Suppress public website navigation, footer, and floating widgets on Admin Panel
  if (isAdmin) {
    return <main className="flex-1 w-full">{children}</main>;
  }

  return (
    <>
      <Navbar
        siteName={siteName}
        siteTagline={siteTagline}
        siteLogo={siteLogo}
        menuItems={menuItems}
        whatsappNumber={whatsappNumber}
      />
      <main className="flex-1">{children}</main>
      <Footer
        siteName={siteName}
        siteTagline={siteTagline}
        siteDescription={siteDescription}
        whatsappNumber={whatsappNumber}
        contactEmail={contactEmail}
        contactPhone={contactPhone}
        contactAddress={contactAddress}
      />
      <WhatsAppWidget
        phoneNumber={whatsappNumber}
        defaultMessage="Halo SenaWeb, saya tertarik untuk konsultasi pembuatan website bisnis saya."
        brandAmbassadorName={brandAmbassadorName}
      />
    </>
  );
}
