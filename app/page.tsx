'use client';
import Link from 'next/link';
import { Clapperboard, Compass, FileText, ShieldCheck } from 'lucide-react';
import ListenButton from '@/components/ListenButton';

const SUMMARY =
  'Bienvenido a Ciudadanía Clara. Aquí puedes verificar afirmaciones, ver noticias breves con fuentes oficiales, explorar casos y preguntar sobre documentos públicos. Esta herramienta apoya tu evaluación y no reemplaza tu criterio.';

const CARDS = [
  { href: '/verificar', label: 'Verificar afirmación', Icon: ShieldCheck, tone: 'bg-[#0B3D91] text-white' },
  { href: '/reels', label: 'Reels verificados', Icon: Clapperboard, tone: 'bg-white text-[#14213D] border-2 border-[#0B3D91]' },
  { href: '/explorar', label: 'Explorar casos', Icon: Compass, tone: 'bg-white text-[#14213D] border-2 border-[#0B3D91]' },
  { href: '/documentos', label: 'Asistente de documentos públicos', Icon: FileText, tone: 'bg-[#0B3D91] text-white' },
];

export default function Home() {
  return (
    <div className="px-5 pt-8">
      <header>
        <h1 className="text-4xl font-bold leading-tight">Ciudadanía Clara</h1>
        <p className="mt-2 text-xl text-slate-700">Verifica, entiende y aprende con fuentes claras</p>
      </header>

      <ListenButton text={SUMMARY} id="home" label="Escuchar resumen por voz" className="mt-6 w-full" />

      <ul className="mt-6 grid grid-cols-2 gap-4">
        {CARDS.map(({ href, label, Icon, tone }) => (
          <li key={href}>
            <Link href={href} className={`flex aspect-square flex-col justify-between rounded-3xl p-4 text-lg font-bold leading-snug focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-[#C8102E] ${tone}`}>
              <Icon className="h-10 w-10" aria-hidden />
              {label}
            </Link>
          </li>
        ))}
      </ul>

      <aside className="mt-8 rounded-2xl border-l-8 border-[#C8102E] bg-white p-4 text-base">
        <strong>IA responsable.</strong> Esta herramienta apoya la evaluación de información. No reemplaza el criterio humano ni emite veredictos absolutos.
      </aside>
    </div>
  );
}
