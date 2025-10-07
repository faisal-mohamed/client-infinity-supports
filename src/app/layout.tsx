import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';


import { Lexend , Montserrat} from 'next/font/google';
import { Providers } from './providers';
const lexend = Lexend({ subsets: ['latin'], variable: '--font-lexend' });

const inter = Inter({ subsets: ['latin'] });

const Monst = Montserrat({
  subsets: ['latin'],
  display: 'swap',
  preload: true,
  fallback: ['system-ui', 'arial']
})

export const metadata: Metadata = {
  title: 'Infinity Support Portal',
  description: 'NDIS form management system for Infinity Support Services',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <style dangerouslySetInnerHTML={{
          __html: `
            body { 
              font-family: ${Monst.style.fontFamily}, system-ui, -apple-system, sans-serif;
            }
          `
        }} />
      </head>
      <body className={Monst.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
