import Link from 'next/link';
import { MapPin, Mail, Phone } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <MapPin className="h-8 w-8 text-tunisia-red" />
              <span className="text-xl font-bold text-white">
                Tunisia<span className="text-tunisia-red">Travel</span>
              </span>
            </Link>
            <p className="text-gray-400 mb-4 max-w-md">
              Discover the magic of Tunisia with our expertly crafted travel
              programs. From ancient ruins to Sahara adventures, we bring you
              authentic experiences that last a lifetime.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/programs"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  All Programs
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-center space-x-2">
                <Mail className="h-5 w-5 text-tunisia-sand" />
                <a href="mailto:amirmansouri@engineer.com" className="text-gray-400 hover:text-white transition-colors">amirmansouri@engineer.com</a>
              </li>
              <li className="flex items-center space-x-2">
                <Phone className="h-5 w-5 text-tunisia-sand" />
                <a href="https://wa.me/21627069149" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">+216 27 069 149</a>
              </li>
              <li className="flex items-start space-x-2">
                <MapPin className="h-5 w-5 text-tunisia-sand mt-0.5" />
                <span className="text-gray-400">
                  Foussana
                  <br />
                  Kasserine, Tunisia
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} Tunisia Travel. All rights
            reserved.
          </p>
          <p className="text-gray-500 text-sm mt-2 md:mt-0">
            Made with love in Tunisia
          </p>
        </div>
      </div>
    </footer>
  );
}
