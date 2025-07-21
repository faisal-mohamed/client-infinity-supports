"use client";
import React, { useState } from 'react';
import { Montserrat } from 'next/font/google';
import Link from 'next/link';
import SignOutButton from '@/components/SignOutButton';
import { ConfirmProvider } from '@/components/ui/Confirm';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

const montserrat = Montserrat({ subsets: ['latin'], weight: '400', display: 'swap' });

// Define menu items outside the component
const menuItems = [
  {
    href: '/admin/dashboard',
    label: 'Dashboard',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 transition-transform group-hover:scale-110" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
  },
  {
    href: '/admin/clients',
    label: 'Clients',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 transition-transform group-hover:scale-110" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    ),
  },
  {
    href: '/admin/forms',
    label: 'Forms',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 transition-transform group-hover:scale-110" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
  },
  // {
  //   href: '/admin/reports',
  //   label: 'Reports',
  //   icon: (
  //     <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 transition-transform group-hover:scale-110" fill="none" viewBox="0 0 24 24" stroke="currentColor">
  //       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  //     </svg>
  //   ),
  // },
  // {
  //   href: '/admin/contracts',
  //   label: 'Contracts',
  //   icon: (
  //     <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 transition-transform group-hover:scale-110" fill="none" viewBox="0 0 24 24" stroke="currentColor">
  //       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  //     </svg>
  //   ),
  // },
  {
    href: '/admin/settings',
    label: 'Settings',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 transition-transform group-hover:scale-110" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
];

export default function AdminClientsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  
  // Check if current route is form edit or view page
  const isFormEditOrViewPage = pathname.includes('/forms/edit/') || pathname.includes('/forms/view/');

  return (
    <div className={`min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 ${montserrat.className}`}>
      <div className="flex min-h-screen">
        {/* Enhanced Sidebar for desktop - hide on form edit/view pages */}
        {!isFormEditOrViewPage && (
          <aside className="hidden lg:flex lg:w-72 flex-col fixed inset-y-0 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white shadow-2xl z-20 border-r border-slate-700">
            {/* Enhanced Header */}
            <div className="h-20 flex items-center justify-center border-b border-slate-700 bg-gradient-to-r from-indigo-600 to-purple-600 shadow-lg">
              <div className="flex flex-col items-center space-y-2 p-4">
                <div className="relative">
                  <Image
                    src={'/client_logo.png'}
                    alt='Client Logo'
                    width={80}
                    height={45}
                    className="drop-shadow-lg"
                  />
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse shadow-lg"></div>
                </div>
                <span className="text-sm font-bold text-white tracking-wide">Infinity Support WA</span>
              </div>
            </div>
            
            {/* Enhanced Navigation */}
            <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto sidebar-scroll">
              {menuItems.map((item, index) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`group flex items-center px-4 py-4 rounded-xl transition-all duration-300 transform hover:scale-105 relative overflow-hidden
                    ${item.href === '/admin/dashboard'
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 shadow-lg border border-indigo-400 font-bold text-white'
                      : 'hover:bg-gradient-to-r hover:from-slate-700 hover:to-slate-600 text-gray-300 hover:text-white hover:shadow-lg'
                    }`}
                  style={{
                    animationDelay: `${index * 50}ms`,
                    animation: 'fadeInLeft 0.6s ease-out forwards'
                  }}
                >
                  {/* Active indicator */}
                  {item.href === '/admin/dashboard' && (
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-white rounded-r-full shadow-lg"></div>
                  )}
                  
                  {/* Icon with enhanced styling */}
                  <div className={`p-2 rounded-lg mr-4 transition-all duration-300 ${
                    item.href === '/admin/dashboard'
                      ? 'bg-white bg-opacity-20 shadow-md'
                      : 'group-hover:bg-white group-hover:bg-opacity-10'
                  }`}>
                    {React.cloneElement(item.icon, {
                      className: `h-5 w-5 transition-all duration-300 ${
                        item.href === '/admin/dashboard' 
                          ? 'text-white' 
                          : 'text-gray-400 group-hover:text-white group-hover:scale-110'
                      }`
                    })}
                  </div>
                  
                  <span className="font-semibold tracking-wide">{item.label}</span>
                  
                  {/* Hover effect overlay */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-10 transition-opacity duration-300 transform -skew-x-12"></div>
                </Link>
              ))}
            </nav>
            
            {/* Enhanced Footer */}
            <div className="p-6 border-t border-slate-700 bg-gradient-to-r from-slate-800 to-slate-700">
              <div className="mb-4 p-3 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl shadow-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-white font-semibold text-sm">Admin User</p>
                    {/* <p className="text-indigo-200 text-xs">System Administrator</p> */}
                  </div>
                </div>
              </div>
              <SignOutButton />
            </div>
          </aside>
        )}

        {/* Enhanced Topbar for mobile - hide on form edit/view pages */}
        {!isFormEditOrViewPage && (
          <div className="lg:hidden bg-gradient-to-r from-slate-900 to-slate-800 text-white h-20 w-full fixed top-0 z-30 flex items-center justify-between px-6 shadow-2xl border-b border-slate-700">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
                  <span className="text-white text-lg font-bold">IS</span>
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse shadow-lg"></div>
              </div>
              <div>
                <span className="text-xl font-bold text-white">Infinity Support</span>
                <p className="text-xs text-gray-300">Admin Portal</p>
              </div>
            </div>
            <button
              className="p-3 rounded-xl bg-white bg-opacity-10 hover:bg-opacity-20 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 transform hover:scale-105"
              aria-label="Open menu"
              onClick={() => setMobileMenuOpen(true)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        )}

        {/* Enhanced Mobile menu drawer - hide on form edit/view pages */}
        {!isFormEditOrViewPage && mobileMenuOpen && (
          <div className="fixed inset-0 z-40 flex">
            {/* Enhanced Overlay */}
            <div
              className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm transition-opacity duration-300"
              onClick={() => setMobileMenuOpen(false)}
              aria-hidden="true"
            />
            {/* Enhanced Drawer */}
            <aside className="relative w-80 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white shadow-2xl flex flex-col h-full animate-slide-in-left z-50 border-r border-slate-700">
              {/* Enhanced Header */}
              <div className="h-20 flex items-center justify-between border-b border-slate-700 px-6 bg-gradient-to-r from-indigo-600 to-purple-600 shadow-lg">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Image
                      src={'/client_logo.png'}
                      alt='Client Logo'
                      width={70}
                      height={40}
                      className="drop-shadow-lg"
                    />
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse shadow-lg"></div>
                  </div>
                  <div>
                    <span className="text-lg font-bold text-white">Infinity Support WA</span>
                    <p className="text-xs text-indigo-200">Admin Portal</p>
                  </div>
                </div>
                <button
                  className="p-2 rounded-xl bg-white bg-opacity-20 hover:bg-opacity-30 transition-all duration-200 focus:outline-none transform hover:scale-105"
                  aria-label="Close menu"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              {/* Enhanced Navigation */}
              <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto sidebar-scroll">
                {menuItems.map((item, index) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`group flex items-center px-4 py-4 rounded-xl transition-all duration-300 transform hover:scale-105 relative overflow-hidden
                      ${item.href === '/admin/dashboard'
                        ? 'bg-gradient-to-r from-indigo-600 to-purple-600 shadow-lg border border-indigo-400 font-bold text-white'
                        : 'hover:bg-gradient-to-r hover:from-slate-700 hover:to-slate-600 text-gray-300 hover:text-white hover:shadow-lg'
                      }`}
                    onClick={() => setMobileMenuOpen(false)}
                    style={{
                      animationDelay: `${index * 50}ms`,
                      animation: 'fadeInLeft 0.6s ease-out forwards'
                    }}
                  >
                    {/* Active indicator */}
                    {item.href === '/admin/dashboard' && (
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-white rounded-r-full shadow-lg"></div>
                    )}
                    
                    {/* Icon with enhanced styling */}
                    <div className={`p-2 rounded-lg mr-4 transition-all duration-300 ${
                      item.href === '/admin/dashboard'
                        ? 'bg-white bg-opacity-20 shadow-md'
                        : 'group-hover:bg-white group-hover:bg-opacity-10'
                    }`}>
                      {React.cloneElement(item.icon, {
                        className: `h-5 w-5 transition-all duration-300 ${
                          item.href === '/admin/dashboard' 
                            ? 'text-white' 
                            : 'text-gray-400 group-hover:text-white group-hover:scale-110'
                        }`
                      })}
                    </div>
                    
                    <span className="font-semibold tracking-wide">{item.label}</span>
                    
                    {/* Hover effect overlay */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-10 transition-opacity duration-300 transform -skew-x-12"></div>
                  </Link>
                ))}
              </nav>
              
              {/* Enhanced Footer */}
              <div className="p-6 border-t border-slate-700 bg-gradient-to-r from-slate-800 to-slate-700">
                <div className="mb-4 p-3 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl shadow-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-white font-semibold text-sm">Admin User</p>
                      {/* <p className="text-indigo-200 text-xs">System Administrator</p> */}
                    </div>
                  </div>
                </div>
                <SignOutButton />
              </div>
            </aside>
          </div>
        )}

        {/* Enhanced Main content - adjust margin based on sidebar visibility */}
        <main className={`flex-1 transition-all duration-300 ${
          isFormEditOrViewPage 
            ? 'p-0' // Full width for form pages
            : 'p-8 pt-28 lg:pt-8 lg:ml-72' // Enhanced layout with wider sidebar
        }`}>
          <ConfirmProvider>{children}</ConfirmProvider>
        </main>
      </div>
      {/* Enhanced Animations */}
      <style jsx global>{`
        @keyframes slide-in-left {
          from { 
            transform: translateX(-100%); 
            opacity: 0;
          }
          to { 
            transform: translateX(0); 
            opacity: 1;
          }
        }
        
        @keyframes fadeInLeft {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        .animate-slide-in-left {
          animation: slide-in-left 0.4s cubic-bezier(0.4,0,0.2,1) both;
        }
        
        /* Custom scrollbar for sidebar */
        .sidebar-scroll::-webkit-scrollbar {
          width: 4px;
        }
        
        .sidebar-scroll::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 2px;
        }
        
        .sidebar-scroll::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.3);
          border-radius: 2px;
        }
        
        .sidebar-scroll::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.5);
        }
      `}</style>
    </div>
  );
}
