'use client';
import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Bookmark, Check, ChevronRight, Compass, FileText, Heart, Landmark, MessageCircle, MoreHorizontal, Newspaper, Repeat2, Search, Share, X } from 'lucide-react';
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

const TABS = ['Para ti', 'En tendencia', 'Noticias'] as const;
type ExploreTab = (typeof TABS)[number];

const CARD = 'border-b border-slate-200 bg-white px-5 py-4';

export default function ExplorarPage() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [vote, setVote] = useState<PriorVote | null>(null);
  const [query, setQuery] = useState('');
  const [activeTab, setActiveTab] = useState<ExploreTab>('Para ti');
  const selected = cases.find((c) => c.id === selectedId) ?? null;
  const visibleCases = cases.filter((c) => {
    const matchesQuery = `${c.title} ${c.type} ${c.headline}`.toLowerCase().includes(query.toLowerCase());
    const matchesTab = activeTab === 'Noticias' ? c.type === 'Noticia' : true;
    return matchesQuery && matchesTab;
  });

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
        title="Explorar"
        subtitle={selected ? 'Antes de ver la evidencia, cuéntanos qué piensas' : 'Lo más importante de la conversación pública'}
        Icon={Compass}
      />

      <div className="overflow-hidden border-x border-slate-200 bg-white">
        {!selected && (
          <>
            <div className="sticky top-0 z-10 border-b border-slate-200 bg-white/95 px-4 py-3 backdrop-blur">
              <label htmlFor="explorar-busqueda" className="sr-only">Buscar en Explorar</label>
              <div className="flex items-center gap-3 rounded-full bg-[#F5F6F8] px-4 text-slate-500">
                <Search className="h-5 w-5 shrink-0" aria-hidden />
                <input
                  id="explorar-busqueda"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Buscar temas, leyes o noticias"
                  className="min-h-11 w-full bg-transparent text-base text-[#14213D] outline-none placeholder:text-slate-500"
                />
              </div>
            </div>

            <div className="flex border-b border-slate-200" role="tablist" aria-label="Filtros de exploración">
              {TABS.map((tab) => (
                <button
                  key={tab}
                  type="button"
                  role="tab"
                  aria-selected={activeTab === tab}
                  onClick={() => setActiveTab(tab)}
                  className={`relative min-h-14 flex-1 px-2 text-base font-bold transition ${activeTab === tab ? 'text-[#0B3D91]' : 'text-slate-500'}`}
                >
                  {tab}
                  {activeTab === tab && <span className="absolute inset-x-7 bottom-0 h-1 rounded-full bg-[#C8102E]" />}
                </button>
              ))}
            </div>

            <section className="border-b border-slate-200 bg-[#F5F6F8] px-5 py-4">
              <p className="text-sm font-bold uppercase tracking-wide text-slate-500">Tendencias para ti</p>
              <div className="mt-3 grid grid-cols-2 gap-x-5 gap-y-3">
                {['#Ley40Horas', '#PGU', '#Presupuesto2026', '#FuentesOficiales'].map((topic, index) => (
                  <button key={topic} type="button" onClick={() => setQuery(topic.slice(1))} className="text-left">
                    <span className="block text-xs text-slate-500">Tendencia {index + 1}</span>
                    <span className="block text-base font-bold text-[#14213D]">{topic}</span>
                  </button>
                ))}
              </div>
            </section>

            <div className="border-b border-slate-200 px-5 py-3">
              <h2 className="text-lg font-bold">En conversación</h2>
              <p className="text-sm text-slate-600">Casos que conviene leer antes de compartir.</p>
            </div>

            <ul>
            {visibleCases.map((c) => {
              const Icon = TYPE_ICON[c.type];
              return (
                <li key={c.id}>
                  <button
                    type="button"
                    onClick={() => open(c.id)}
                    className={`${CARD} flex w-full gap-3 text-left transition hover:bg-[#F5F6F8] active:bg-slate-100`}
                  >
                    <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${TYPE_TONE[c.type]}`}>
                      <Icon className="h-5 w-5" aria-hidden />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center gap-1 text-sm text-slate-500"><strong className="text-[#14213D]">Ciudadanía Clara</strong> · {c.type}</span>
                      <span className="mt-1 block text-lg font-bold leading-snug">{c.title}</span>
                      <span className="mt-1 block text-base leading-snug text-slate-700">{c.headline}</span>
                      <span className="mt-3 flex items-center justify-between text-slate-500" aria-hidden>
                        <MessageCircle className="h-4 w-4" /><Repeat2 className="h-4 w-4" /><Heart className="h-4 w-4" /><Bookmark className="h-4 w-4" /><Share className="h-4 w-4" />
                      </span>
                    </span>
                    <MoreHorizontal className="h-5 w-5 shrink-0 text-slate-500" aria-hidden />
                  </button>
                </li>
              );
            })}
            </ul>
            {visibleCases.length === 0 && <p className="px-5 py-10 text-center text-lg text-slate-600">No encontramos casos para “{query}”.</p>}
          </>
        )}

        {selected && (
          <div className="space-y-6 px-5 pt-5">
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