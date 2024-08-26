import { Metadata } from 'next';
import { headers } from 'next/headers';
import * as React from 'react';
import { cookieToInitialState } from 'wagmi';

import '@/styles/globals.css';
import '@/styles/colors.css';

import { config } from '@/lib/wagmi';

import Footer from '@/components/layout/footer/components';
import Header from '@/components/layout/header/components';

import { siteConfig } from '@/constant/config';
import AppKitProvider from '@/contexts/wagmiProvider';

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.title,
    template: `%s | ${siteConfig.title}`,
  },
  description: siteConfig.description,
  robots: { index: true, follow: true },
  icons: {
    icon: '/favicon/favicon.ico',
    shortcut: '/favicon/favicon-16x16.png',
    apple: '/favicon/apple-touch-icon.png',
  },
  manifest: `/favicon/site.webmanifest`,
  openGraph: {
    url: siteConfig.url,
    title: siteConfig.title,
    description: siteConfig.description,
    siteName: siteConfig.title,
    images: [`${siteConfig.url}/images/og.jpg`],
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.title,
    description: siteConfig.description,
    images: [`${siteConfig.url}/images/og.jpg`],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const initialState = cookieToInitialState(config, headers().get('cookie'));

  return (
    <html>
      <body className='bg-dark text-light flex min-h-screen flex-col'>
        <AppKitProvider initialState={initialState}>
          <Header />
          {children}
          <Footer />
        </AppKitProvider>
      </body>
    </html>
  );
}
