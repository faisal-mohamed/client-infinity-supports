"use client";

import React, { createContext, useContext, useState, useCallback } from 'react';

interface PIIMaskingContextValue {
  isMasked: boolean;
  revealPII: () => void;
  hidePII: () => void;
  togglePII: () => void;
  revealedAt: Date | null;
}

const PIIMaskingContext = createContext<PIIMaskingContextValue>({
  isMasked: true,
  revealPII: () => {},
  hidePII: () => {},
  togglePII: () => {},
  revealedAt: null,
});

export function usePIIMasking() {
  return useContext(PIIMaskingContext);
}

interface PIIMaskingProviderProps {
  children: React.ReactNode;
  clientId: number;
  formId: number;
  assignmentId: number;
  adminName?: string;
}

export function PIIMaskingProvider({
  children,
  clientId,
  formId,
  assignmentId,
  adminName,
}: PIIMaskingProviderProps) {
  const [isMasked, setIsMasked] = useState(true);
  const [revealedAt, setRevealedAt] = useState<Date | null>(null);

  const logAccess = useCallback(async (action: 'reveal' | 'hide') => {
    try {
      await fetch('/api/admin/pii-access-log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientId,
          formId,
          assignmentId,
          action,
          timestamp: new Date().toISOString(),
        }),
      });
    } catch {
      // Non-blocking — audit log failure should not break UI
      console.error('[PII Audit] Failed to log access');
    }
  }, [clientId, formId, assignmentId]);

  const revealPII = useCallback(() => {
    setIsMasked(false);
    setRevealedAt(new Date());
    logAccess('reveal');
  }, [logAccess]);

  const hidePII = useCallback(() => {
    setIsMasked(true);
    setRevealedAt(null);
    logAccess('hide');
  }, [logAccess]);

  const togglePII = useCallback(() => {
    if (isMasked) {
      revealPII();
    } else {
      hidePII();
    }
  }, [isMasked, revealPII, hidePII]);

  return (
    <PIIMaskingContext.Provider value={{ isMasked, revealPII, hidePII, togglePII, revealedAt }}>
      {children}
    </PIIMaskingContext.Provider>
  );
}
