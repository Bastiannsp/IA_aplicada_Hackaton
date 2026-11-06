'use client';
import { Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { ExternalLink } from 'lucide-react';
import ListenButton from '@/components/ListenButton';
import VerdictBadge from '@/components/VerdictBadge';
import { findVerification } from '@/data/mockData';
import type { SourceRelation } from '@/types';

const REL: Record<SourceRelation, string> = {
  'A favor': 'bg-emerald-100 text-emerald-900',
  'En contra': 'bg-red-100 text-red-900',
  Contexto: 'bg-slate-200 text-slate-800',
};

function Resultado() {
  const q = useSearchParams().get('q') ?? '';
  const r = findVerification(q);
  const audio = `Afirmación evaluada: ${r.claim}. Veredicto: ${r.verdict.replace('_', ' ')}. ${r.explanation.join(' ')} Limitaciones: ${r.limitations.join(' ')} Recuerda: la decisión final es humana.`;

  return (
    <div className="px-5 pt-8">
      <section className="rounded-2xl border-2 border-slate-300 bg-white p-4">
        <h2 className="text-base font-bold text-slate-600">Afirmación evaluada</h2>
        <p className="mt-1 text-xl">“{r.claim || 'Sin texto'}”</p>
      </section>

      <ListenButton text={audio} id="resultado" label="Escuchar análisis completo" className="mt-4 w-full" />

      <div className="mt-5"><VerdictBadge verdict={r.verdict} large /></div>

      <section className="mt-6">
        <h2 className="text-2xl font-bold">Explicación</h2>
        <div className="mt-2 space-y-2 text-xl">{r.explanation.map((l, i) => <p key={i}>{l}</p>)}</div>
      </section>

      <section className="mt-6">
        <h2 className="text-2xl font-bold">Fuentes oficiales</h2>
        {r.sources.length === 0 && <p className="mt-2 text-lg text-slate-700">No encontramos fuentes oficiales para esta afirmación.</p>}
        <ul className="mt-3 space-y-3">
          {r.sources.map((s) => (
            <li key={s.id} className="rounded-2xl border-2 border-slate-300 bg-white p-4">
              <span className={`rounded-full px-3 py-1 text-sm font-bold ${REL[s.relation]}`}>{s.relation}</span>
              <h3 className="mt-2 text-xl font-bold">{s.headline}</h3>
              <p className="text-base text-slate-600">{s.institution}</p>
              <blockquote className="mt-2 border-l-4 border-[#0B3D91] pl-3 text-lg italic">{s.excerpt}</blockquote>
              <a href={s.url} target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex items-center gap-1 text-lg font-bold text-[#0B3D91] underline">
                Ver fuente <ExternalLink className="h-5 w-5" aria-hidden />
              </a>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-6">
        <h2 className="text-2xl font-bold">Limitaciones de la evidencia</h2>
        <ul className="mt-2 list-disc space-y-1 pl-6 text-lg">{r.limitations.map((l, i) => <li key={i}>{l}</li>)}</ul>
      </section>

      <p role="note" className="mt-6 rounded-2xl bg-amber-100 p-4 text-lg font-bold text-amber-950">💡 Recuerda: La decisión final es humana.</p>
      <Link href="/verificar" className="mt-5 block min-h-14 rounded-2xl border-2 border-[#0B3D91] py-3 text-center text-xl font-bold text-[#0B3D91]">Verificar otra afirmación</Link>
    </div>
  );
}

export default function Page() {
  return <Suspense fallback={<p className="p-6 text-xl">Cargando…</p>}><Resultado /></Suspense>;
}
