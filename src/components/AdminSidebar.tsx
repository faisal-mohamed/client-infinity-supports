"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { FaTachometerAlt, FaUsers, FaFileAlt, FaCog, FaBars, FaTimes, FaUserTie, FaClipboardList } from 'react-icons/fa';
import SignOutButton from '@/components/SignOutButton';

const accent = '#f43f5e';
const white = '#fff';

const menuItems = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: FaTachometerAlt },
  { href: '/admin/clients', label: 'Clients', icon: FaUsers },
  { href: '/admin/forms', label: 'Client Forms', icon: FaFileAlt },
  { href: '/admin/staff', label: 'Staff', icon: FaUserTie },
  { href: '/admin/staff-forms', label: 'Staff Forms', icon: FaClipboardList },
  { href: '/admin/settings', label: 'Settings', icon: FaCog }
];

interface AdminSidebarProps {
  hideOnFormPages?: boolean;
  showUserInfo?: boolean;
}

export default function AdminSidebar({ hideOnFormPages = true, showUserInfo = true }: AdminSidebarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const isFormEditOrViewPage = hideOnFormPages && (pathname.includes('/forms/edit/') || pathname.includes('/forms/view/'));

  const SidebarContent = ({ isMobile = false }: { isMobile?: boolean }) => {
    const handleLinkClick = () => {
      if (isMobile) {
        setMobileMenuOpen(false);
      }
    };

    return (
      <>
        <div className={`flex items-center ${isMobile ? 'justify-between' : 'justify-center'} px-4 ${isMobile ? 'py-4 border-b border-slate-700' : 'h-20 bg-slate-800 border-b border-slate-700'}`}>
          <div className="flex items-center gap-2">
            <Image src="/client_logo.png" alt="Client Logo" width={isMobile ? 40 : 70} height={isMobile ? 30 : 40} style={{ height: 'auto' }} />
            <span className="font-semibold text-sm" style={{ color: white }}>Infinity Support WA</span>
          </div>
          {isMobile && (
            <button onClick={() => setMobileMenuOpen(false)} aria-label="Close menu" title="Close menu">
              <FaTimes className="w-5 h-5 text-white" />
            </button>
          )}
        </div>
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            const IconComponent = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={handleLinkClick}
                className={`group flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition duration-200 ${
                  isActive
                    ? `bg-slate-800 text-white border border-[${accent}]`
                    : 'text-slate-300 hover:text-white hover:bg-slate-800 hover:border hover:border-slate-700'
                }`}
              >
                <div className="text-white w-5 h-5 flex items-center justify-center">
                  <IconComponent className="w-5 h-5 text-white" />
                </div>
                <span className="truncate">{item.label}</span>
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-slate-700 bg-slate-800">
          {showUserInfo && (
            <div className="p-3 rounded-lg mb-3" style={{ backgroundColor: accent }}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                </div>
                <p className="text-white font-semibold text-sm">Admin User</p>
              </div>
            </div>
          )}
          <SignOutButton />
        </div>
      </>
    );
  };

  return (
    <>
      {/* Mobile Header */}
      {!isFormEditOrViewPage && (
        <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-slate-900 text-white flex items-center justify-between px-4 shadow z-30">
          <div className="flex items-center gap-3">
            <Image src="/client_logo.png" alt="Logo" width={40} height={30} style={{ height: 'auto' }} />
            <span className="font-semibold text-sm" style={{ color: white }}>Infinity Support WA</span>
          </div>
          <button onClick={() => setMobileMenuOpen(true)} aria-label="Open menu" title="Open menu">
            <FaBars className="w-6 h-6 text-white" />
          </button>
        </div>
      )}

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && !isFormEditOrViewPage && (
        <div className="fixed inset-0 z-40 flex lg:hidden">
          <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setMobileMenuOpen(false)} />
          <aside className="relative w-64 bg-slate-900 text-white h-full shadow-xl z-50 flex flex-col">
            <SidebarContent isMobile={true} />
          </aside>
        </div>
      )}

      {/* Desktop Sidebar */}
      {!isFormEditOrViewPage && (
        <aside className="hidden lg:flex lg:w-72 flex-col fixed inset-y-0 bg-slate-900 text-white border-r border-slate-800 shadow-xl">
          <SidebarContent isMobile={false} />
        </aside>
      )}
    </>
  );
}

