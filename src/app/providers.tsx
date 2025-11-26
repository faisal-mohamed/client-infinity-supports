'use client';

import { SessionProvider } from 'next-auth/react';
import { ToastProvider } from '@/components/ui/Toast';
import { ConfirmProvider } from '@/components/ui/Confirm';
import ChunkLoadErrorHandler from '@/components/ChunkLoadErrorHandler';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ToastProvider>
        <ConfirmProvider>
          <ChunkLoadErrorHandler />
          {children}
        </ConfirmProvider>
      </ToastProvider>
    </SessionProvider>
  );
}
