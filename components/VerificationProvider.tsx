'use client';

import { createContext, useContext, useSyncExternalStore, type ReactNode } from 'react';
import type { VerificationResponse } from '@/backend/types/verification';

interface VerificationContextValue {
  result: VerificationResponse | null;
  setResult: (result: VerificationResponse | null) => void;
}

const VerificationContext = createContext<VerificationContextValue | null>(null);
const STORAGE_KEY = 'ciudadania-clara:last-verification';
const subscribers = new Set<() => void>();

function subscribe(callback: () => void) {
  subscribers.add(callback);
  return () => subscribers.delete(callback);
}

function getSnapshot() {
  return typeof window === 'undefined' ? null : window.sessionStorage.getItem(STORAGE_KEY);
}

function getServerSnapshot() {
  return null;
}

function readResult(snapshot: string | null): VerificationResponse | null {
  if (!snapshot) return null;
  try {
    return JSON.parse(snapshot) as VerificationResponse;
  } catch {
    return null;
  }
}

export function VerificationProvider({ children }: { children: ReactNode }) {
  const snapshot = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const result = readResult(snapshot);

  function setResult(nextResult: VerificationResponse | null) {
    if (typeof window !== 'undefined') {
      if (nextResult) window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(nextResult));
      else window.sessionStorage.removeItem(STORAGE_KEY);
    }
    subscribers.forEach((callback) => callback());
  }

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
