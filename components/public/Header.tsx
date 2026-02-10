'use client';

import Link from 'next/link';
import { useState, useRef, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Menu, X, MapPin } from 'lucide-react';
import { useLanguage } from '@/lib/i18n';
import { LiveEvent } from '@/types/database';
import LanguageSwitcher from './LanguageSwitcher';
import LiveEventsButton from './LiveEventsButton';
import LiveEventsPanel from './LiveEventsPanel';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [eventsOpen, setEventsOpen] = useState(false);
  const [liveEvents, setLiveEvents] = useState<LiveEvent[]>([]);
  const { t } = useLanguage();
  const router = useRouter();
  const tapCountRef = useRef(0);
  const tapTimerRef = useRef<NodeJS.Timeout | null>(null);

  const fetchEvents = useCallback(async () => {
    try {
      const res = await fetch('/api/events');
      if (res.ok) {
        const data = await res.json();
        setLiveEvents(Array.isArray(data) ? data : []);
      }
    } catch {
      // Silently fail
    }
  }, []);

  useEffect(() => {
    fetchEvents();
    const interval = setInterval(fetchEvents, 30000);
    return () => clearInterval(interval);
  }, [fetchEvents]);

  const handleLogoTap = (e: React.MouseEvent) => {
    e.preventDefault();
    tapCountRef.current += 1;

    if (tapTimerRef.current) {
      clearTimeout(tapTimerRef.current);
    }

    if (tapCountRef.current >= 7) {
      tapCountRef.current = 0;
      router.push('/admin');
      return;
    }

    // Navigate to home after delay if no more taps
    tapTimerRef.current = setTimeout(() => {
      if (tapCountRef.current > 0 && tapCountRef.current < 7) {
        router.push('/');
      }
      tapCountRef.current = 0;
    }, 500);
  };

  return (
    <>
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo - tap 7 times for admin */}
            <div
              className="flex items-center space-x-2 cursor-pointer"
              onClick={handleLogoTap}
            >
              <MapPin className="h-8 w-8 text-tunisia-red" />
              <span className="text-xl font-bold text-gray-900">
                Yalla<span className="text-tunisia-red">Habibi</span>
              </span>
            </div>

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
              <Link
                href="/tournaments"
                className="text-gray-700 hover:text-tunisia-red transition-colors font-medium"
              >
                {t.tournament?.tournaments || 'Tournaments'}
              </Link>
              <LiveEventsButton
                hasEvents={liveEvents.length > 0}
                isOpen={eventsOpen}
                onToggle={() => setEventsOpen(!eventsOpen)}
              />
              <LanguageSwitcher />
              <Link href="/programs" className="btn-primary">
                {t.nav.bookNow}
              </Link>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center space-x-2">
              <LiveEventsButton
                hasEvents={liveEvents.length > 0}
                isOpen={eventsOpen}
                onToggle={() => setEventsOpen(!eventsOpen)}
              />
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
                  href="/tournaments"
                  className="text-gray-700 hover:text-tunisia-red transition-colors font-medium px-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {t.tournament?.tournaments || 'Tournaments'}
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

      {/* Live Events Modal */}
      <LiveEventsPanel
        isOpen={eventsOpen}
        onClose={() => setEventsOpen(false)}
        events={liveEvents}
      />
    </>
  );
}
