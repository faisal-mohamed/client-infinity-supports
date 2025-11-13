"use client";

import React, { useState } from 'react';
import { Montserrat } from 'next/font/google';
import Link from 'next/link';
import SignOutButton from '@/components/SignOutButton';
import { ConfirmProvider } from '@/components/ui/Confirm';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { FaTachometerAlt, FaUsers, FaFileAlt, FaCog, FaBars, FaTimes, FaUserTie, FaClipboardList } from 'react-icons/fa';

const montserrat = Montserrat({ subsets: ['latin'], weight: '400', display: 'swap' });

const accent = '#f43f5e';
const white = '#fff';

const menuItems = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: <FaTachometerAlt className="w-5 h-5 text-white" /> },
  { href: '/admin/clients', label: 'Clients', icon: <FaUsers className="w-5 h-5 text-white" /> },
  { href: '/admin/forms', label: 'Client Forms', icon: <FaFileAlt className="w-5 h-5 text-white" /> },
  { href: '/admin/staff', label: 'Staff', icon: <FaUserTie className="w-5 h-5 text-white" /> },
  { href: '/admin/staff-forms', label: 'Staff Forms', icon: <FaClipboardList className="w-5 h-5 text-white" /> },
  { href: '/admin/settings', label: 'Settings', icon: <FaCog className="w-5 h-5 text-white" /> }
];

export default function StaffLayout({ children }: { children: React.ReactNode }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className={`min-h-screen bg-white text-black ${montserrat.className}`}>
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-slate-900 text-white flex items-center justify-between px-4 shadow z-30">
        <div className="flex items-center gap-3">
          <Image src="/client_logo.png" alt="Logo" width={40} height={30} style={{ height: 'auto' }} />
          <span className="font-semibold text-sm" style={{ color: white }}>Infinity Support WA</span>
        </div>
        <button onClick={() => setMobileMenuOpen(true)} aria-label="Open menu" title="Open menu">
          <FaBars className="w-6 h-6 text-white" />
        </button>
      </div>

      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 flex lg:hidden">
          <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setMobileMenuOpen(false)} />
          <aside className="relative w-64 bg-slate-900 text-white h-full shadow-xl z-50 flex flex-col">
            <div className="flex items-center justify-between px-4 py-4 border-b border-slate-700">
              <div className="flex items-center gap-2">
                <Image src="/client_logo.png" alt="Client Logo" width={40} height={30} style={{ height: 'auto' }} />
                <span className="font-semibold text-sm" style={{ color: white }}>Infinity Support WA</span>
              </div>
              <button onClick={() => setMobileMenuOpen(false)} aria-label="Close menu" title="Close menu">
                <FaTimes className="w-5 h-5 text-white" />
              </button>
            </div>
            <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
              {menuItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`group flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition duration-200 ${
                      isActive
                        ? `bg-slate-800 text-white border border-[${accent}]`
                        : 'text-slate-300 hover:text-white hover:bg-slate-800 hover:border hover:border-slate-700'
                    }`}
                  >
                    <div className="text-white w-5 h-5 flex items-center justify-center">
                      {item.icon}
                    </div>
                    <span className="truncate">{item.label}</span>
                  </Link>
                );
              })}
            </nav>
            <div className="p-4 border-t border-slate-700 bg-slate-800">
              <SignOutButton />
            </div>
          </aside>
        </div>
      )}

      <div className="flex min-h-screen pt-16 lg:pt-0">
        <aside className="hidden lg:flex lg:w-72 flex-col fixed inset-y-0 bg-slate-900 text-white border-r border-slate-800 shadow-xl">
          <div className="h-20 flex items-center justify-center bg-slate-800 border-b border-slate-700">
            <div className="flex flex-col items-center">
              <Image src="/client_logo.png" alt="Client Logo" width={70} height={40} style={{ height: 'auto' }} />
              <span className="text-sm font-semibold" style={{ color: white }}>Infinity Support WA</span>
            </div>
          </div>
          <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
            {menuItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`group flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition duration-200 ${
                    isActive
                      ? `bg-slate-800 text-white border border-[${accent}]`
                      : 'text-slate-300 hover:text-white hover:bg-slate-800 hover:border hover:border-slate-700'
                  }`}
                >
                  <div className="text-white w-5 h-5 flex items-center justify-center">
                    {item.icon}
                  </div>
                  <span className="truncate">{item.label}</span>
                </Link>
              );
            })}
          </nav>
          <div className="p-4 border-t border-slate-700 bg-slate-800">
            <SignOutButton />
          </div>
        </aside>

        <main className={`flex-1 bg-white transition-all duration-300 p-8 lg:ml-72`}>
          <ConfirmProvider>{children}</ConfirmProvider>
        </main>
      </div>
    </div>
  );
}


