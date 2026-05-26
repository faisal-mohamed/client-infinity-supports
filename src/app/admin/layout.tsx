"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import SignOutButton from '@/components/SignOutButton';
import { ConfirmProvider } from '@/components/ui/Confirm';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { FaTachometerAlt, FaUsers, FaFileAlt, FaCog, FaBars, FaTimes, FaClipboardCheck, FaCreditCard } from 'react-icons/fa';

const menuItems = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: FaTachometerAlt },
  { href: '/admin/clients', label: 'Clients', icon: FaUsers },
  { href: '/admin/review', label: 'Admin Review', icon: FaClipboardCheck },
  { href: '/admin/forms', label: 'Forms', icon: FaFileAlt },
  { href: '/admin/billing', label: 'Billing', icon: FaCreditCard },
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
    <div className="min-h-screen bg-azure-50/30">
      {/* Mobile top bar */}
      {!hideLayoutElements && (
        <div className="lg:hidden fixed top-0 left-0 right-0 h-14 bg-white border-b border-azure-100 flex items-center justify-between px-4 z-30 shadow-soft">
          <div className="flex items-center gap-2.5">
            <Image src="/client_logo.png" alt="Logo" width={32} height={24} />
            <span className="font-bold text-sm text-azure-700">Infinity Support WA</span>
          </div>
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="p-2 rounded-lg text-azure-400 hover:bg-azure-50 transition-colors"
          >
            <FaBars className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Mobile sidebar overlay */}
      {mobileMenuOpen && !hideLayoutElements && (
        <div className="fixed inset-0 z-40 flex lg:hidden">
          <div className="fixed inset-0 bg-azure-900/40 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} />
          <aside className="relative w-72 bg-white h-full shadow-elevated z-50 flex flex-col">
            <div className="flex items-center justify-between px-5 py-4 border-b border-azure-100">
              <div className="flex items-center gap-2.5">
                <Image src="/client_logo.png" alt="Logo" width={32} height={24} />
                <span className="font-bold text-sm text-azure-700">Infinity Support WA</span>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-1.5 rounded-lg text-azure-300 hover:bg-azure-50 transition-colors"
              >
                <FaTimes className="w-4 h-4" />
              </button>
            </div>
            <nav className="flex-1 px-3 py-5 space-y-1 overflow-y-auto">
              {menuItems.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? 'bg-azure-700 text-white shadow-soft'
                        : 'text-azure-500 hover:bg-azure-50 hover:text-azure-700'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-gold-400' : 'text-azure-300'}`} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
            <div className="p-4 border-t border-azure-100">
              <div className="p-3 rounded-xl bg-azure-50 mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-azure-700 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-gold-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <p className="text-sm font-semibold text-azure-700">Admin User</p>
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
          <aside className="hidden lg:flex lg:w-64 flex-col fixed inset-y-0 bg-white border-r border-azure-100">
            {/* Logo */}
            <div className="h-16 flex items-center px-6 border-b border-azure-100">
              <div className="flex items-center gap-3">
                <Image src="/client_logo.png" alt="Logo" width={36} height={28} />
                <div>
                  <span className="font-bold text-sm text-azure-700 block leading-tight">Infinity Support</span>
                  <span className="text-[10px] text-gold-600 font-medium tracking-wider uppercase">Western Australia</span>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-3 py-5 space-y-1 overflow-y-auto">
              {menuItems.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? 'bg-azure-700 text-white shadow-soft'
                        : 'text-azure-500 hover:bg-azure-50 hover:text-azure-700'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-gold-400' : 'text-azure-300'}`} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Footer */}
            <div className="p-4 border-t border-azure-100">
              <div className="p-3 rounded-xl bg-azure-50 mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-azure-700 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-gold-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <p className="text-sm font-semibold text-azure-700">Admin User</p>
                </div>
              </div>
              <SignOutButton />
            </div>
          </aside>
        )}

        {/* Main content */}
        <main className={`flex-1 min-w-0 transition-all duration-200 ${hideLayoutElements ? '' : 'lg:ml-64'}`}>
          <div className={hideLayoutElements ? '' : 'px-4 py-5 sm:p-6 lg:p-8'}>
            <ConfirmProvider>{children}</ConfirmProvider>
          </div>
        </main>
      </div>
    </div>
  );
}
