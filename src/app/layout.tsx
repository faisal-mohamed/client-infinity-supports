import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';


import { Lexend } from 'next/font/google';
const lexend = Lexend({ subsets: ['latin'], variable: '--font-lexend' });

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Infinity Support Portal',
  description: 'NDIS form management system for Infinity Support Services',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={lexend.className}>{children}</body>
    </html>
  );
}
