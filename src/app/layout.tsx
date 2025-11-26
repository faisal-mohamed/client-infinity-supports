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
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Handle chunk load errors globally
              (function() {
                const originalFetch = window.fetch;
                let chunkErrorHandled = false;

                // Intercept fetch to detect chunk load failures
                window.fetch = function(...args) {
                  return originalFetch.apply(this, args).catch((error) => {
                    const url = args[0]?.toString() || '';
                    if (url.includes('/_next/static/chunks/') || url.includes('.js')) {
                      if (!chunkErrorHandled) {
                        chunkErrorHandled = true;
                        // Dispatch custom event for React component to handle
                        window.dispatchEvent(new CustomEvent('chunkloaderror', {
                          detail: { url, error: error.message }
                        }));
                      }
                    }
                    throw error;
                  });
                };

              // Handle script load errors
              window.addEventListener('error', function(event) {
                if (event.target && (event.target.tagName === 'SCRIPT' || event.target.tagName === 'LINK')) {
                  const src = event.target.src || event.target.href || '';
                  if (src.includes('/_next/static/chunks/') || src.includes('.js') || src.includes('.css')) {
                    if (!chunkErrorHandled) {
                      chunkErrorHandled = true;
                      window.dispatchEvent(new CustomEvent('chunkloaderror', {
                        detail: { url: src, error: event.message }
                      }));
                    }
                  }
                }
              }, true);

              // Handle unhandled promise rejections (chunk errors often come as promise rejections)
              window.addEventListener('unhandledrejection', function(event) {
                const error = event.reason?.toString() || event.reason?.message || '';
                if (error.includes('ChunkLoadError') || 
                    error.includes('Loading chunk') || 
                    error.includes('Failed to fetch') ||
                    error.includes('timeout')) {
                  if (!chunkErrorHandled) {
                    chunkErrorHandled = true;
                    window.dispatchEvent(new CustomEvent('chunkloaderror', {
                      detail: { error: error }
                    }));
                  }
                }
              });
            })();
            `,
          }}
        />
      </head>
      <body className={Monst.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
