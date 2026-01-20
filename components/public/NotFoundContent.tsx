'use client';

import Link from 'next/link';
import { Home, ArrowLeft } from 'lucide-react';
import { useLanguage } from '@/lib/i18n';

export default function NotFoundContent() {
  const { t } = useLanguage();

  return (
    <main className="flex-1 bg-tunisia-cream flex items-center justify-center">
      <div className="text-center px-4">
        <h1 className="text-9xl font-bold text-tunisia-red">404</h1>
        <h2 className="mt-4 text-3xl font-bold text-gray-900">
          {t.notFound.title}
        </h2>
        <p className="mt-4 text-gray-600 max-w-md mx-auto">
          {t.notFound.description}
        </p>
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/" className="btn-primary">
            <Home className="h-5 w-5 mr-2" />
            {t.notFound.goHome}
          </Link>
          <Link href="/programs" className="btn-outline">
            <ArrowLeft className="h-5 w-5 mr-2" />
            {t.notFound.viewPrograms}
          </Link>
        </div>
      </div>
    </main>
  );
}
