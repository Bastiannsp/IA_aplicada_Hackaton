'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Mic, Search } from 'lucide-react';
import { useVoice } from '@/hooks/useVoice';

type Phase = 'form' | 'loading';

export default function VerificarPage() {
  const router = useRouter();
  const { listen, listening, sttSupported } = useVoice();
  const [claim, setClaim] = useState('');
  const [phase, setPhase] = useState<Phase>('form');

  const submit = () => {
    if (!claim.trim()) return;
    setPhase('loading');
    // Simula la búsqueda de evidencia (la lógica real iría a una API)
    setTimeout(() => router.push(`/verificar/resultado?q=${encodeURIComponent(claim.trim())}`), 1800);
  };

  if (phase === 'loading') {
    return (
      <div role="status" aria-live="polite" className="flex min-h-[70dvh] flex-col items-center justify-center gap-5 px-6 text-center">
        <Loader2 className="h-14 w-14 animate-spin text-[#0B3D91]" aria-hidden />
        <p className="text-2xl font-bold">Buscando evidencia en fuentes oficiales...</p>
      </div>
    );
  }

  return (
    <div className="px-5 pt-8">
      <h1 className="text-3xl font-bold">Verificar afirmación</h1>
      <label htmlFor="claim" className="mt-4 block text-lg text-slate-700">¿Qué quieres comprobar?</label>
      <textarea
        id="claim" value={claim} onChange={(e) => setClaim(e.target.value)} rows={6}
        placeholder="Pega o escribe una afirmación a verificar..."
        className="mt-2 w-full rounded-2xl border-2 border-slate-400 bg-white p-4 text-xl focus:border-[#0B3D91] focus:outline-none"
      />
      <p className="mt-2 text-sm text-slate-600">Prueba con: “La jornada de 40 horas ya rige desde 2024”.</p>

      <div className="mt-5 flex flex-col gap-3">
        <button onClick={submit} disabled={!claim.trim()}
          className="flex min-h-14 items-center justify-center gap-2 rounded-2xl bg-[#0B3D91] px-5 text-xl font-bold text-white disabled:bg-slate-400">
          <Search className="h-6 w-6" aria-hidden /> Comprobar con IA
        </button>
        {sttSupported && (
          <button onClick={() => listen((t) => setClaim((c) => (c ? c + ' ' : '') + t))} aria-pressed={listening}
            className={`flex min-h-14 items-center justify-center gap-2 rounded-2xl border-2 px-5 text-xl font-bold ${listening ? 'border-[#C8102E] bg-[#C8102E] text-white' : 'border-[#0B3D91] bg-white text-[#0B3D91]'}`}>
            <Mic className="h-6 w-6" aria-hidden /> {listening ? 'Escuchando… toca para parar' : '🎙️ Dictar afirmación'}
          </button>
        )}
      </div>
    </div>
  );
}
