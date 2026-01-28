import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import VisitorTracker from '@/components/VisitorTracker';
import { LanguageProvider } from '@/lib/i18n';
import { FavoritesProvider } from '@/lib/favorites';
import WhatsAppButton from '@/components/public/WhatsAppButton';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Yalla Habibi - Discover the Jewel of North Africa',
  description:
    'Explore Tunisia with our curated travel programs. From Sahara adventures to Mediterranean beaches, discover ancient ruins, vibrant medinas, and authentic Tunisian experiences.',
  keywords:
    'Tunisia, travel, tourism, Sahara, Carthage, Tunis, Djerba, Hammamet, tours, vacation, Yalla Habibi',
  manifest: '/manifest.json',
  themeColor: '#dc2626',
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Yalla Habibi',
  },
  openGraph: {
    title: 'Yalla Habibi - Discover the Jewel of North Africa',
    description:
      'Explore Tunisia with our curated travel programs. Sahara adventures, Mediterranean beaches, and authentic experiences.',
    type: 'website',
    locale: 'en_US',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* PWA */}
        <link rel="apple-touch-icon" href="/icon-192.png" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        {/* Google AdSense */}
        <meta name="google-adsense-account" content="ca-pub-5498625393510379" />
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5498625393510379"
          crossOrigin="anonymous"
        />
      </head>
      <body className={inter.className}>
        <LanguageProvider>
          <FavoritesProvider>
            <VisitorTracker />
            {children}
            <WhatsAppButton phoneNumber="+21612345678" />
          </FavoritesProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
