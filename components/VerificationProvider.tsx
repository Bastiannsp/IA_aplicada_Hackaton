'use client';

import { createContext, useContext, useState, type ReactNode } from 'react';
import type { VerificationResponse } from '@/backend/types/verification';

interface VerificationContextValue {
  result: VerificationResponse | null;
  setResult: (result: VerificationResponse | null) => void;
}

const VerificationContext = createContext<VerificationContextValue | null>(null);

export function VerificationProvider({ children }: { children: ReactNode }) {
  const [result, setResult] = useState<VerificationResponse | null>(null);

  return (
    <VerificationContext.Provider value={{ result, setResult }}>
      {children}
    </VerificationContext.Provider>
  );
}

export function useVerification() {
  const context = useContext(VerificationContext);
  if (!context) {
    throw new Error('useVerification debe usarse dentro de VerificationProvider.');
  }
  return context;
}
