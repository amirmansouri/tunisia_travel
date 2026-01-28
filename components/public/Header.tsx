'use client';

import Link from 'next/link';
import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Menu, X, MapPin } from 'lucide-react';
import { useLanguage } from '@/lib/i18n';
import LanguageSwitcher from './LanguageSwitcher';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { t } = useLanguage();
  const router = useRouter();
  const tapCountRef = useRef(0);
  const tapTimerRef = useRef<NodeJS.Timeout | null>(null);

  const handleLogoTap = () => {
    tapCountRef.current += 1;

    if (tapTimerRef.current) {
      clearTimeout(tapTimerRef.current);
    }

    if (tapCountRef.current >= 5) {
      tapCountRef.current = 0;
      router.push('/admin');
      return;
    }

    tapTimerRef.current = setTimeout(() => {
      tapCountRef.current = 0;
    }, 2000);
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo - tap 5 times for admin */}
          <Link href="/" className="flex items-center space-x-2" onClick={handleLogoTap}>
            <MapPin className="h-8 w-8 text-tunisia-red" />
            <span className="text-xl font-bold text-gray-900">
              Yalla<span className="text-tunisia-red">Habibi</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link
              href="/"
              className="text-gray-700 hover:text-tunisia-red transition-colors font-medium"
            >
              {t.nav.home}
            </Link>
            <Link
              href="/programs"
              className="text-gray-700 hover:text-tunisia-red transition-colors font-medium"
            >
              {t.nav.programs}
            </Link>
            <LanguageSwitcher />
            <Link href="/programs" className="btn-primary">
              {t.nav.bookNow}
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            <LanguageSwitcher />
            <button
              type="button"
              className="p-2 text-gray-700"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <div className="flex flex-col space-y-4">
              <Link
                href="/"
                className="text-gray-700 hover:text-tunisia-red transition-colors font-medium px-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t.nav.home}
              </Link>
              <Link
                href="/programs"
                className="text-gray-700 hover:text-tunisia-red transition-colors font-medium px-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t.nav.programs}
              </Link>
              <Link
                href="/programs"
                className="btn-primary text-center"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t.nav.bookNow}
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
