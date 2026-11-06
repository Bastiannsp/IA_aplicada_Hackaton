'use client';
import { Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { ExternalLink, Lightbulb, ShieldCheck } from 'lucide-react';
import ListenButton from '@/components/ListenButton';
import PageHeader from '@/components/PageHeader';
import VerdictBadge from '@/components/VerdictBadge';
import { findVerification } from '@/data/mockData';
import type { SourceRelation } from '@/types';

const REL: Record<SourceRelation, string> = {
  'A favor': 'bg-emerald-100 text-emerald-900',
  'En contra': 'bg-red-100 text-red-900',
  Contexto: 'bg-slate-200 text-slate-800',
};

const CARD = 'rounded-3xl border border-slate-200 bg-white p-5 shadow-md';

function Resultado() {
  const q = useSearchParams().get('q') ?? '';
  const r = findVerification(q);
  const audio = `Afirmación evaluada: ${r.claim}. Veredicto: ${r.verdict.replace('_', ' ')}. ${r.explanation.join(' ')} Limitaciones: ${r.limitations.join(' ')} Recuerda: la decisión final es humana.`;

  return (
    <div>
      <PageHeader title="Resultado" subtitle="Esto dicen las fuentes oficiales" Icon={ShieldCheck} />

      <div className="space-y-6 px-5 pt-5">
        <section className={CARD}>
          <h2 className="text-base font-bold text-slate-600">Afirmación evaluada</h2>
          <p className="mt-1 text-xl">“{r.claim || 'Sin texto'}”</p>
        </section>

        <ListenButton text={audio} id="resultado" label="Escuchar análisis completo" className="w-full" />

        <section aria-live="polite" className={CARD}>
          <h2 className="text-base font-bold text-slate-600">Evaluación orientativa</h2>
          <div className="mt-2"><VerdictBadge verdict={r.verdict} large /></div>
          <h2 className="mt-5 text-2xl font-bold">Explicación</h2>
          <ol className="mt-3 space-y-3">
            {r.explanation.map((l, i) => (
              <li key={i} className="flex gap-3 text-xl">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#0B3D91] text-base font-bold text-white">
                  {i + 1}
                </span>
                <span>{l}</span>
              </li>
            ))}
          </ol>
        </section>

        <section>
          <h2 className="text-2xl font-bold">Fuentes oficiales</h2>
          {r.sources.length === 0 && (
            <p className="mt-2 text-lg text-slate-700">No encontramos fuentes oficiales para esta afirmación.</p>
          )}
          <ul className="mt-3 space-y-3">
            {r.sources.map((s) => (
              <li key={s.id} className={CARD}>
                <span className={`rounded-full px-3 py-1 text-sm font-bold ${REL[s.relation]}`}>{s.relation}</span>
                <h3 className="mt-3 text-xl font-bold">{s.headline}</h3>
                <p className="text-base text-slate-600">{s.institution}</p>
                <blockquote className="mt-3 rounded-2xl border-l-4 border-[#0B3D91] bg-[#F5F6F8] p-3 text-lg italic">
                  {s.excerpt}
                </blockquote>
                <a
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-flex min-h-14 items-center gap-1 text-lg font-bold text-[#0B3D91] underline"
                >
                  Ver fuente <ExternalLink className="h-5 w-5" aria-hidden />
                </a>
              </li>
            ))}
          </ul>
        </section>

        <section className={CARD}>
          <h2 className="text-2xl font-bold">Limitaciones de la evidencia</h2>
          <ul className="mt-2 list-disc space-y-1 pl-6 text-lg">
            {r.limitations.map((l, i) => <li key={i}>{l}</li>)}
          </ul>
        </section>

        <p role="note" className="flex items-start gap-3 rounded-3xl bg-amber-100 p-4 text-lg font-bold text-amber-950">
          <Lightbulb className="mt-0.5 h-6 w-6 shrink-0" aria-hidden />
          Recuerda: La decisión final es humana.
        </p>

        <Link
          href="/verificar"
          className="flex min-h-14 items-center justify-center rounded-full border-2 border-[#0B3D91] bg-white text-xl font-bold text-[#0B3D91]"
        >
          Verificar otra afirmación
        </Link>
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<p className="p-6 text-xl">Cargando…</p>}>
      <Resultado />
    </Suspense>
  );
}