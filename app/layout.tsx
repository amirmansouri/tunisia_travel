import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import VisitorTracker from '@/components/VisitorTracker';
import { LanguageProvider } from '@/lib/i18n';
import { FavoritesProvider } from '@/lib/favorites';
import WhatsAppButton from '@/components/public/WhatsAppButton';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Arivo Travel - Discover the Jewel of North Africa',
  description:
    'Explore Tunisia with our curated travel programs. From Sahara adventures to Mediterranean beaches, discover ancient ruins, vibrant medinas, and authentic Tunisian experiences.',
  keywords:
    'Tunisia, travel, tourism, Sahara, Carthage, Tunis, Djerba, Hammamet, tours, vacation, Arivo',
  openGraph: {
    title: 'Arivo Travel - Discover the Jewel of North Africa',
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
        {/* Google AdSense */}
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
