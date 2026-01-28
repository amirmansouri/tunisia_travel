import { Metadata } from 'next';
import Header from '@/components/public/Header';
import Footer from '@/components/public/Footer';
import Gallery from '@/components/public/Gallery';

export const metadata: Metadata = {
  title: 'Galerie Photos | Yalla Habibi',
  description: 'Découvrez les plus belles destinations de la Tunisie à travers notre galerie photos. Hammamet, Tamaghza et bien plus encore.',
  openGraph: {
    title: 'Galerie Photos | Yalla Habibi',
    description: 'Découvrez les plus belles destinations de la Tunisie à travers notre galerie photos.',
  },
};

export default function GalleryPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-tunisia-red via-tunisia-red to-tunisia-sand py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Galerie Photos
            </h1>
            <p className="text-white/90 text-lg max-w-2xl mx-auto">
              Laissez-vous inspirer par la beauté de la Tunisie
            </p>
          </div>
        </section>

        {/* Gallery Component */}
        <Gallery />
      </main>

      <Footer />
    </div>
  );
}
