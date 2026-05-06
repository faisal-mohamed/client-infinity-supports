"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import SignOutButton from '@/components/SignOutButton';
import { ConfirmProvider } from '@/components/ui/Confirm';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { FaTachometerAlt, FaUsers, FaFileAlt, FaCog, FaBars, FaTimes, FaClipboardCheck } from 'react-icons/fa';

const menuItems = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: FaTachometerAlt },
  { href: '/admin/clients', label: 'Clients', icon: FaUsers },
  { href: '/admin/review', label: 'Admin Review', icon: FaClipboardCheck },
  { href: '/admin/forms', label: 'Forms', icon: FaFileAlt },
  { href: '/admin/settings', label: 'Settings', icon: FaCog },
];

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const isFormEditOrViewPage = pathname.includes('/forms/edit/') || pathname.includes('/forms/view/');
  const isLoginPage = pathname === '/admin/login';
  const isRegisterPage = pathname === '/admin/register';
  const hideLayoutElements = isFormEditOrViewPage || isLoginPage || isRegisterPage;

  return (
    <div className="min-h-screen bg-gray-50/50">
      {/* Mobile top bar */}
      {!hideLayoutElements && (
        <div className="lg:hidden fixed top-0 left-0 right-0 h-14 bg-white border-b border-gray-200 flex items-center justify-between px-4 z-30">
          <div className="flex items-center gap-2.5">
            <Image src="/client_logo.png" alt="Logo" width={32} height={24} />
            <span className="font-semibold text-sm text-gray-900">Infinity Support WA</span>
          </div>
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
          >
            <FaBars className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Mobile sidebar overlay */}
      {mobileMenuOpen && !hideLayoutElements && (
        <div className="fixed inset-0 z-40 flex lg:hidden">
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} />
          <aside className="relative w-64 bg-white h-full shadow-elevated z-50 flex flex-col">
            <div className="flex items-center justify-between px-4 py-4 border-b border-gray-100">
              <div className="flex items-center gap-2.5">
                <Image src="/client_logo.png" alt="Logo" width={32} height={24} />
                <span className="font-semibold text-sm text-gray-900">Infinity Support WA</span>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 transition-colors"
              >
                <FaTimes className="w-4 h-4" />
              </button>
            </div>
            <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
              {menuItems.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-brand-50 text-brand-700'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-brand-600' : 'text-gray-400'}`} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
            <div className="p-3 border-t border-gray-100">
              <div className="p-3 rounded-lg bg-brand-50 mb-2">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-brand-100 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-brand-700" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <p className="text-sm font-semibold text-brand-700">Admin User</p>
                </div>
              </div>
              <SignOutButton />
            </div>
          </aside>
        </div>
      )}

      {/* Desktop layout */}
      <div className="flex min-h-screen pt-14 lg:pt-0">
        {/* Desktop sidebar */}
        {!hideLayoutElements && (
          <aside className="hidden lg:flex lg:w-60 flex-col fixed inset-y-0 bg-white border-r border-gray-200">
            {/* Logo */}
            <div className="h-14 flex items-center px-5 border-b border-gray-100">
              <div className="flex items-center gap-2.5">
                <Image src="/client_logo.png" alt="Logo" width={32} height={24} />
                <span className="font-semibold text-sm text-gray-900">Infinity Support WA</span>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
              {menuItems.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-brand-50 text-brand-700'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-brand-600' : 'text-gray-400'}`} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Footer */}
            <div className="p-3 border-t border-gray-100">
              <div className="p-3 rounded-lg bg-brand-50 mb-2">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-brand-100 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-brand-700" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <p className="text-sm font-semibold text-brand-700">Admin User</p>
                </div>
              </div>
              <SignOutButton />
            </div>
          </aside>
        )}

        {/* Main content */}
        <main className={`flex-1 min-w-0 transition-all duration-200 ${hideLayoutElements ? '' : 'lg:ml-60'}`}>
          <div className={hideLayoutElements ? '' : 'px-3 py-4 sm:p-6 lg:p-8'}>
            <ConfirmProvider>{children}</ConfirmProvider>
          </div>
        </main>
      </div>
    </div>
  );
}
