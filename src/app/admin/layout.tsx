import React from 'react';
import { Inter } from 'next/font/google';
import { Providers } from './providers';

const inter = Inter({ subsets: ['latin'] });

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Providers>
      <div className={`min-h-screen bg-gray-50 ${inter.className}`}>
        {children}
      </div>
    </Providers>
  );
}
