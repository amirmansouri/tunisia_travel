import Link from 'next/link';
import { Home, ArrowLeft } from 'lucide-react';
import Header from '@/components/public/Header';
import Footer from '@/components/public/Footer';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 bg-tunisia-cream flex items-center justify-center">
        <div className="text-center px-4">
          <h1 className="text-9xl font-bold text-tunisia-red">404</h1>
          <h2 className="mt-4 text-3xl font-bold text-gray-900">
            Page Not Found
          </h2>
          <p className="mt-4 text-gray-600 max-w-md mx-auto">
            Sorry, the page you&apos;re looking for doesn&apos;t exist or has
            been moved.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/" className="btn-primary">
              <Home className="h-5 w-5 mr-2" />
              Go Home
            </Link>
            <Link href="/programs" className="btn-outline">
              <ArrowLeft className="h-5 w-5 mr-2" />
              View Programs
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
