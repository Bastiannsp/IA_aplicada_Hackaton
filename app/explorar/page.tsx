'use client';
import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Check, ChevronRight, Compass, FileText, Landmark, Newspaper, X } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import { cases } from '@/data/mockData';
import type { CaseItem, PriorVote } from '@/types';

const TYPE_ICON: Record<CaseItem['type'], LucideIcon> = {
  'Proyecto de Ley': FileText,
  'Presupuesto Municipal': Landmark,
  Noticia: Newspaper,
};

const TYPE_TONE: Record<CaseItem['type'], string> = {
  'Proyecto de Ley': 'bg-[#0B3D91]/10 text-[#0B3D91]',
  'Presupuesto Municipal': 'bg-[#C8102E]/10 text-[#C8102E]',
  Noticia: 'bg-slate-200 text-slate-800',
};

const VOTES: { value: PriorVote; Icon: LucideIcon }[] = [
  { value: 'Verdadero', Icon: Check },
  { value: 'Falso', Icon: X },
  { value: 'No sé', Icon: Compass },
];

const CARD = 'rounded-3xl border border-slate-200 bg-white p-5 shadow-md';

export default function ExplorarPage() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [vote, setVote] = useState<PriorVote | null>(null);
  const selected = cases.find((c) => c.id === selectedId) ?? null;

  function open(id: string) {
    setSelectedId(id);
    setVote(null);
    window.scrollTo(0, 0);
  }

  function back() {
    setSelectedId(null);
    setVote(null);
    window.scrollTo(0, 0);
  }

  return (
    <div>
      <PageHeader
        title="Explorar casos"
        subtitle={selected ? 'Antes de ver la evidencia, cuéntanos qué piensas' : 'Elige un caso y compara tu opinión con las fuentes oficiales'}
        Icon={Compass}
      />

      <div className="px-5 pt-5">
        {!selected && (
          <ul className="space-y-4">
            {cases.map((c) => {
              const Icon = TYPE_ICON[c.type];
              return (
                <li key={c.id}>
                  <button
                    type="button"
                    onClick={() => open(c.id)}
                    className={`${CARD} flex min-h-14 w-full items-center gap-4 text-left transition active:scale-[0.98]`}
                  >
                    <span className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl ${TYPE_TONE[c.type]}`}>
                      <Icon className="h-7 w-7" aria-hidden />
                    </span>
                    <span className="flex-1">
                      <span className="block text-sm font-bold text-slate-600">{c.type}</span>
                      <span className="block text-xl font-bold leading-snug">{c.title}</span>
                    </span>
                    <ChevronRight className="h-6 w-6 shrink-0 text-slate-500" aria-hidden />
                  </button>
                </li>
              );
            })}
          </ul>
        )}

        {selected && (
          <div className="space-y-6">
            <button
              type="button"
              onClick={back}
              className="inline-flex min-h-14 items-center gap-2 text-lg font-bold text-[#0B3D91]"
            >
              <ArrowLeft className="h-6 w-6" aria-hidden /> Volver a los casos
            </button>

            <section className={CARD}>
              <span className={`rounded-full px-3 py-1 text-sm font-bold ${TYPE_TONE[selected.type]}`}>
                {selected.type}
              </span>
              <h2 className="mt-3 text-2xl font-bold">{selected.title}</h2>
              <p className="mt-3 text-base font-bold text-slate-600">Esto dice la noticia</p>
              <blockquote className="mt-1 rounded-2xl border-l-4 border-[#C8102E] bg-[#F5F6F8] p-3 text-xl italic">
                “{selected.headline}”
              </blockquote>
            </section>

            <section className={CARD}>
              <h2 id="voto-previo" className="text-2xl font-bold">¿Tú qué crees que dice esta noticia?</h2>
              <div role="group" aria-labelledby="voto-previo" className="mt-4 grid grid-cols-3 gap-3">
                {VOTES.map(({ value, Icon }) => {
                  const active = vote === value;
                  return (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setVote(value)}
                      aria-pressed={active}
                      className={`relative flex min-h-24 flex-col items-center justify-center gap-1 rounded-2xl border-2 px-1 text-lg font-bold transition active:scale-[0.98] ${
                        active
                          ? 'border-[#0B3D91] bg-[#0B3D91] text-white'
                          : 'border-slate-300 bg-white text-[#14213D]'
                      }`}
                    >
                      {active && (
                        <span className="absolute right-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-white text-[#0B3D91]">
                          <Check className="h-4 w-4" aria-hidden />
                        </span>
                      )}
                      <Icon className="h-7 w-7" aria-hidden />
                      {value}
                    </button>
                  );
                })}
              </div>

              <p aria-live="polite" className="mt-3 min-h-7 text-lg font-bold text-[#0B3D91]">
                {vote ? `Anotamos tu opinión previa: ${vote}.` : ''}
              </p>
              <p className="mt-1 text-base text-slate-700">
                Tu voto es tu opinión previa, no altera la evidencia oficial.
              </p>
            </section>

            <Link
              href={`/verificar/resultado?q=${encodeURIComponent(selected.headline)}`}
              className="flex min-h-14 items-center justify-center gap-2 rounded-full bg-[#C8102E] px-6 text-xl font-bold text-white shadow-md transition active:scale-[0.98]"
            >
              Ver Evidencia y Fuentes <ChevronRight className="h-6 w-6" aria-hidden />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}