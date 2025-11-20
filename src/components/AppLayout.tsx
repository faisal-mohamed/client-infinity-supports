"use client";

import React from 'react';
import { Montserrat } from 'next/font/google';
import { usePathname } from 'next/navigation';
import { ConfirmProvider } from '@/components/ui/Confirm';
import AdminSidebar from '@/components/AdminSidebar';

const montserrat = Montserrat({ subsets: ['latin'], weight: '400', display: 'swap' });

interface AppLayoutProps {
  children: React.ReactNode;
  hideSidebarOnFormPages?: boolean;
  showUserInfo?: boolean;
  contentPadding?: 'default' | 'none' | 'custom';
  customPadding?: string;
}

export default function AppLayout({
  children,
  hideSidebarOnFormPages = true,
  showUserInfo = true,
  contentPadding = 'default',
  customPadding
}: AppLayoutProps) {
  const pathname = usePathname();
  const isFormEditOrViewPage = hideSidebarOnFormPages && (pathname.includes('/forms/edit/') || pathname.includes('/forms/view/'));

  // Determine padding classes based on contentPadding prop
  let paddingClasses = '';
  if (contentPadding === 'none') {
    paddingClasses = 'p-0';
  } else if (contentPadding === 'custom' && customPadding) {
    paddingClasses = customPadding;
  } else {
    // Default padding
    paddingClasses = isFormEditOrViewPage ? 'p-0' : 'p-8 pt-28 lg:pt-8 lg:ml-72';
  }

  return (
    <div className={`min-h-screen bg-white text-black ${montserrat.className} w-full overflow-x-hidden`}>
      <AdminSidebar hideOnFormPages={hideSidebarOnFormPages} showUserInfo={showUserInfo} />
      
      <div className="flex min-h-screen pt-16 lg:pt-0 w-full overflow-x-hidden">
        <main className={`flex-1 bg-white transition-all duration-300 ${paddingClasses} w-full max-w-full overflow-x-hidden`}>
          <ConfirmProvider>{children}</ConfirmProvider>
        </main>
      </div>
    </div>
  );
}

