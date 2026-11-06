'use client';
import { ExternalLink, Play } from 'lucide-react';
import ListenButton from '@/components/ListenButton';
import VerdictBadge from '@/components/VerdictBadge';
import { reels } from '@/data/mockData';

export default function ReelsPage() {
  return (
    <div className="mx-auto h-[calc(100dvh-4.5rem)] w-full max-w-6xl snap-y snap-mandatory overscroll-y-contain overflow-y-scroll bg-black [scrollbar-width:none]" aria-label="Noticias verificadas en formato corto">
      {reels.map((r) => (
        <article key={r.id} className={`relative flex h-[calc(100dvh-4.5rem)] snap-always snap-start touch-pan-y flex-col justify-between bg-gradient-to-b ${r.gradient} text-white`}>
          <header className="flex items-center justify-between gap-2 p-4">
            <span className="rounded-full bg-white/20 px-3 py-1 text-base font-bold">{r.category}</span>
            <VerdictBadge verdict={r.verdict} />
          </header>

          {/* Reproductor simulado */}
          <div className="flex flex-1 flex-col items-center justify-center gap-4" aria-hidden>
            <span className="text-[7rem] leading-none">{r.emoji}</span>
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-white/25"><Play className="h-8 w-8 fill-white" /></span>
          </div>

          <footer className="mx-auto w-full max-w-4xl space-y-3 bg-gradient-to-t from-black/85 to-transparent p-5 pt-16 sm:px-8 lg:px-12">
            <h2 className="text-3xl font-bold leading-tight">{r.headline}</h2>
            <p className="line-clamp-2 text-lg text-white/90">{r.summary}</p>
            <div className="flex flex-wrap items-center gap-3">
              <ListenButton text={`${r.headline}. ${r.summary}`} id={r.id} label="Escuchar Noticia" />
              <a href={r.sourceUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-lg font-bold underline">
                Fuente oficial: {r.sourceLabel} <ExternalLink className="h-5 w-5" aria-hidden />
              </a>
            </div>
          </footer>
        </article>
      ))}
    </div>
  );
}
