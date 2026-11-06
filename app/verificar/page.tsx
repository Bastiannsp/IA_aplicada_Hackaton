'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Search } from 'lucide-react';
import { useVerification } from '@/components/VerificationProvider';

type Phase = 'form' | 'loading';

export default function VerificarPage() {
  const router = useRouter();
  const { setResult } = useVerification();
  const [claim, setClaim] = useState('');
  const [phase, setPhase] = useState<Phase>('form');
  const [error, setError] = useState('');

  const submit = async () => {
    const normalizedClaim = claim.trim();
    if (!normalizedClaim || phase === 'loading') return;
    setError('');
    setPhase('loading');
    try {
      const response = await fetch('/api/verify/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ claim: normalizedClaim }),
      });
      const payload: unknown = await response.json().catch(() => null);

      if (!response.ok) {
        const message =
          typeof payload === 'object' && payload !== null && 'error' in payload &&
          typeof payload.error === 'object' && payload.error !== null &&
          'message' in payload.error && typeof payload.error.message === 'string'
            ? payload.error.message
            : 'No fue posible analizar la afirmación. Intenta nuevamente.';
        throw new Error(message);
      }

      if (
        typeof payload !== 'object' || payload === null ||
        !('verdict' in payload) || !('sources' in payload) || !('claim' in payload)
      ) {
        throw new Error('El servicio devolvió una respuesta que no se pudo validar.');
      }

      setResult(payload as import('@/backend/types/verification').VerificationResponse);
      router.push('/verificar/resultado');
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Ocurrió un error inesperado.');
      setPhase('form');
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-5 pt-8 sm:px-8 lg:px-12">
      <h1 className="text-3xl font-bold">Verificar afirmación</h1>
      <label htmlFor="claim" className="mt-4 block text-lg text-slate-700">¿Qué quieres comprobar?</label>
      <textarea
        id="claim" value={claim} onChange={(e) => setClaim(e.target.value)} rows={6}
        placeholder="Pega o escribe una afirmación a verificar..."
        className="mt-2 w-full rounded-2xl border-2 border-slate-400 bg-white p-4 text-xl focus:border-[#0B3D91] focus:outline-none"
      />
      <p className="mt-2 text-sm text-slate-600">Prueba con: “La jornada de 40 horas ya rige desde 2024”.</p>
      {error && <p role="alert" className="mt-3 rounded-xl bg-red-100 p-3 text-base font-semibold text-red-900">{error}</p>}

      <div className="mt-5 flex flex-col gap-3">
        <button type="button" onClick={submit} disabled={!claim.trim() || phase === 'loading'}
          className="flex min-h-14 items-center justify-center gap-2 rounded-2xl bg-[#0B3D91] px-5 text-xl font-bold text-white disabled:bg-slate-400">
          {phase === 'loading' ? <Loader2 className="h-6 w-6 animate-spin" aria-hidden /> : <Search className="h-6 w-6" aria-hidden />}
          {phase === 'loading' ? 'Clara está verificando...' : 'Comprobar con Clara'}
        </button>
        {phase === 'loading' && <p role="status" aria-live="polite" className="text-center text-base font-bold text-[#0B3D91]">Contrastando la afirmación con fuentes revisadas...</p>}
      </div>
    </div>
  );
}
