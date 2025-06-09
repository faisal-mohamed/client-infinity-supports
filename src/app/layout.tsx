import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';


import { Lexend , Montserrat} from 'next/font/google';
import { Providers } from './providers';
const lexend = Lexend({ subsets: ['latin'], variable: '--font-lexend' });

const inter = Inter({ subsets: ['latin'] });

const Monst = Montserrat({subsets: ['latin']})

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
      <body className={Monst.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
