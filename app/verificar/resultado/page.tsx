'use client';

import Link from 'next/link';
import { ExternalLink, Lightbulb, ShieldCheck } from 'lucide-react';
import ListenButton from '@/components/ListenButton';
import PageHeader from '@/components/PageHeader';
import VerdictBadge from '@/components/VerdictBadge';
import { useVerification } from '@/components/VerificationProvider';
import type { SourceRelation, Verdict } from '@/types';

const REL: Record<SourceRelation, string> = {
  'A favor': 'bg-emerald-100 text-emerald-900',
  'En contra': 'bg-red-100 text-red-900',
  Contexto: 'bg-slate-200 text-slate-800',
};

const CARD = 'rounded-3xl border border-slate-200 bg-white p-5 shadow-md';

export default function ResultadoPage() {
  const { result } = useVerification();

  if (!result) {
    return (
      <div>
        <PageHeader title="Resultado" subtitle="No hay un análisis disponible en esta sesión" Icon={ShieldCheck} />
        <div className="mx-auto max-w-4xl space-y-4 px-5 pt-5 sm:px-8 lg:px-12">
          <p className={CARD}>Envía una afirmación desde el formulario para iniciar una verificación.</p>
          <Link href="/verificar" className="flex min-h-14 items-center justify-center rounded-full bg-[#0B3D91] text-xl font-bold text-white">
            Verificar una afirmación
          </Link>
        </div>
      </div>
    );
  }

  const verdict: Verdict = result.verdict === 'ENGANOSA' ? 'ENGAÑOSA' : result.verdict;
  const hasReviewedEvidence = result.sources.length > 0;
  const explanation = [result.summary, result.reasoning].filter(Boolean);
  const audio = `Afirmación evaluada: ${result.claim}. Veredicto: ${verdict.replace('_', ' ')}. ${explanation.join(' ')} Limitaciones: ${result.limitations.join(' ')} Recuerda: la decisión final es humana.`;

  return (
    <div>
      <PageHeader title="Resultado" subtitle="Evaluación basada en extractos revisados" Icon={ShieldCheck} />

      <div className="mx-auto max-w-5xl space-y-6 px-5 pt-5 sm:px-8 lg:px-12">
        <section className={CARD}>
          <h2 className="text-base font-bold text-slate-600">Afirmación evaluada</h2>
          <p className="mt-1 text-xl">“{result.claim || 'Sin texto'}”</p>
        </section>

        <section
          aria-live="polite"
          className={`rounded-2xl border-2 p-4 ${hasReviewedEvidence ? 'border-emerald-600 bg-emerald-50 text-emerald-950' : 'border-slate-400 bg-slate-100 text-slate-800'}`}
        >
          <h2 className="text-base font-bold">Estado de las fuentes</h2>
          <p className="mt-1 text-lg font-bold">
            {hasReviewedEvidence ? 'Verificable: encontramos evidencia oficial revisada.' : 'No verificable: no encontramos información oficial suficiente.'}
          </p>
        </section>

        <ListenButton text={audio} id="resultado" label="Escuchar análisis completo" className="w-full" />

        <section aria-live="polite" className={CARD}>
          <h2 className="text-base font-bold text-slate-600">Evaluación orientativa</h2>
          <div className="mt-2"><VerdictBadge verdict={verdict} large /></div>
          <h2 className="mt-5 text-2xl font-bold">Explicación</h2>
          <ol className="mt-3 space-y-3">
            {explanation.map((line, index) => (
              <li key={index} className="flex gap-3 text-xl">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#0B3D91] text-base font-bold text-white">
                  {index + 1}
                </span>
                <span>{line}</span>
              </li>
            ))}
          </ol>
        </section>

        <section>
          <h2 className="text-2xl font-bold">Extractos de fuentes revisadas</h2>
          {result.sources.length === 0 && (
            <p className="mt-2 text-lg text-slate-700">No se encontraron extractos suficientes. El resultado se mantiene como no verificable.</p>
          )}
          <ul className="mt-3 space-y-3">
            {result.sources.map((source) => {
              const relation: SourceRelation = source.supports === 'A_FAVOR'
                ? 'A favor'
                : source.supports === 'EN_CONTRA' ? 'En contra' : 'Contexto';

              return (
                <li key={source.id} className={CARD}>
                  <span className={`rounded-full px-3 py-1 text-sm font-bold ${REL[relation]}`}>{relation}</span>
                  <h3 className="mt-3 text-xl font-bold">{source.title}</h3>
                  <p className="text-base text-slate-600">{source.publisher}</p>
                  <blockquote className="mt-3 rounded-2xl border-l-4 border-[#0B3D91] bg-[#F5F6F8] p-3 text-lg italic">
                    {source.evidence}
                  </blockquote>
                  <a
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 inline-flex min-h-14 items-center gap-1 text-lg font-bold text-[#0B3D91] underline"
                  >
                    Ver fuente <ExternalLink className="h-5 w-5" aria-hidden />
                  </a>
                </li>
              );
            })}
          </ul>
        </section>

        <section className={CARD}>
          <h2 className="text-2xl font-bold">Limitaciones de la evidencia</h2>
          <ul className="mt-2 list-disc space-y-1 pl-6 text-lg">
            {result.limitations.map((limitation, index) => <li key={index}>{limitation}</li>)}
          </ul>
        </section>

        <p role="note" className="flex items-start gap-3 rounded-3xl bg-amber-100 p-4 text-lg font-bold text-amber-950">
          <Lightbulb className="mt-0.5 h-6 w-6 shrink-0" aria-hidden />
          Recuerda: la decisión final es humana.
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
