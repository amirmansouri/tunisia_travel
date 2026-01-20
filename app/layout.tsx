import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import VisitorTracker from '@/components/VisitorTracker';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Tunisia Travel - Discover the Jewel of North Africa',
  description:
    'Explore Tunisia with our curated travel programs. From Sahara adventures to Mediterranean beaches, discover ancient ruins, vibrant medinas, and authentic Tunisian experiences.',
  keywords:
    'Tunisia, travel, tourism, Sahara, Carthage, Tunis, Djerba, Hammamet, tours, vacation',
  openGraph: {
    title: 'Tunisia Travel - Discover the Jewel of North Africa',
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
    <html lang="en">
      <body className={inter.className}>
        <VisitorTracker />
        {children}
      </body>
    </html>
  );
}
