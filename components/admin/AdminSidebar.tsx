'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  MapPin,
  LayoutDashboard,
  Map,
  Users,
  Globe,
  LogOut,
  Menu,
  X,
  Monitor,
} from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

const navigation = [
  { name: 'Programs', href: '/admin/programs', icon: Map },
  { name: 'Reservations', href: '/admin/reservations', icon: Users },
  { name: 'Visitors', href: '/admin/visitors', icon: Globe },
  { name: 'Monitor', href: '/admin/monitor', icon: Monitor },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/auth', { method: 'DELETE' });
      router.push('/admin');
      router.refresh();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const NavContent = () => (
    <>
      {/* Logo */}
      <div className="flex items-center space-x-2 mb-8 px-2">
        <MapPin className="h-8 w-8 text-tunisia-red" />
        <span className="text-xl font-bold text-gray-900">
          Arivo<span className="text-tunisia-red">Travel</span>
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1">
        {navigation.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => setMobileMenuOpen(false)}
              className={cn(
                'flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors',
                isActive
                  ? 'bg-tunisia-red text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              )}
            >
              <item.icon className="h-5 w-5" />
              <span className="font-medium">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="pt-4 border-t">
        <button
          onClick={handleLogout}
          className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 w-full transition-colors"
        >
          <LogOut className="h-5 w-5" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 bg-white border-b z-40 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <MapPin className="h-7 w-7 text-tunisia-red" />
            <span className="text-lg font-bold">Admin</span>
          </div>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-gray-600"
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {mobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <aside
        className={cn(
          'lg:hidden fixed top-0 left-0 bottom-0 w-72 bg-white z-50 transform transition-transform duration-300',
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex flex-col h-full p-4 pt-6">
          <NavContent />
        </div>
      </aside>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 lg:left-0 bg-white border-r">
        <div className="flex flex-col h-full p-4 pt-6">
          <NavContent />
        </div>
      </aside>
    </>
  );
}
