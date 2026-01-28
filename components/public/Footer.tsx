'use client';

import Link from 'next/link';
import { MapPin, Mail, Phone } from 'lucide-react';
import { useLanguage } from '@/lib/i18n';

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <MapPin className="h-8 w-8 text-tunisia-red" />
              <span className="text-xl font-bold text-white">
                Yalla<span className="text-tunisia-red">Habibi</span>
              </span>
            </Link>
            <p className="text-gray-400 mb-4 max-w-md">
              {t.footer.description}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">{t.footer.quickLinks}</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  {t.footer.home}
                </Link>
              </li>
              <li>
                <Link
                  href="/programs"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  {t.footer.allPrograms}
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  {t.footer.contactUs}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4">{t.footer.contactUs}</h3>
            <ul className="space-y-3">
              <li className="flex items-center space-x-2">
                <Mail className="h-5 w-5 text-tunisia-sand" />
                <a href="mailto:yallahabibi.voyage@gmail.com" className="text-gray-400 hover:text-white transition-colors">yallahabibi.voyage@gmail.com</a>
              </li>
              <li className="flex items-center space-x-2">
                <Phone className="h-5 w-5 text-tunisia-sand" />
                <a href="https://wa.me/21627419167" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">+216 27 419 167</a>
              </li>
              <li className="flex items-start space-x-2">
                <MapPin className="h-5 w-5 text-tunisia-sand mt-0.5" />
                <span className="text-gray-400">
                  Hammamet, Tunisia
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} Yalla Habibi. {t.footer.copyright}
          </p>
          <p className="text-gray-500 text-sm mt-2 md:mt-0">
            {t.footer.madeWith}
          </p>
        </div>
      </div>
    </footer>
  );
}
