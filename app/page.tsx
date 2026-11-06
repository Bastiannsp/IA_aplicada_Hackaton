'use client';
import Link from 'next/link';
import { ChevronRight, Clapperboard, Compass, FileText, GraduationCap, ShieldCheck } from 'lucide-react';
import ListenButton from '@/components/ListenButton';
import PageHeader from '@/components/PageHeader';

const SUMMARY =
  'Bienvenido a Ciudadanía Clara. Aquí puedes verificar afirmaciones, ver noticias breves con fuentes oficiales, explorar casos y preguntar sobre documentos públicos. Esta herramienta apoya tu evaluación y no reemplaza tu criterio.';

const BLUE = 'bg-[#0B3D91]/10 text-[#0B3D91]';
const RED = 'bg-[#C8102E]/10 text-[#C8102E]';

const CARDS = [
  { href: '/reels', label: 'Reels verificados', desc: 'Noticias breves con fuente', Icon: Clapperboard, tone: BLUE },
  { href: '/explorar', label: 'Explorar casos', desc: 'Compara tu opinión', Icon: Compass, tone: RED },
  { href: '/aprender', label: 'Aprender', desc: 'Lecciones y preguntas', Icon: GraduationCap, tone: RED },
  { href: '/documentos', label: 'Asistente de documentos', desc: 'Pregunta y obtén citas', Icon: FileText, tone: BLUE },
];

export default function Home() {
  return (
    <div>
      <PageHeader title="Ciudadanía Clara" subtitle="Verifica, entiende y aprende con fuentes claras" />

      <div className="mx-auto max-w-5xl space-y-4 px-5 pt-5 sm:px-8 lg:px-12">
        <aside className="rounded-2xl border border-[#C8102E]/40 bg-red-50 px-3 py-2 text-sm leading-snug text-red-950 shadow-sm">
          <strong className="text-[#C8102E]">Uso responsable de Clara.</strong> Clara es una asistente de
          inteligencia artificial: apoya la evaluación de información, pero no reemplaza el criterio humano ni emite veredictos absolutos.
        </aside>

        <ListenButton text={SUMMARY} id="home" label="Escuchar resumen por voz" className="w-full" />

        <Link
          href="/verificar"
          className="flex min-h-28 items-center gap-4 rounded-3xl bg-linear-to-br from-[#14213D] to-[#0B3D91] p-5 text-white shadow-lg transition active:scale-[0.98]"
        >
          <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/15">
            <ShieldCheck className="h-8 w-8" aria-hidden />
          </span>
          <span className="flex-1">
            <span className="block text-2xl font-bold leading-tight">Verificar afirmación</span>
            <span className="block text-base text-blue-100">Escribe o dicta lo que escuchaste</span>
          </span>
          <ChevronRight className="h-7 w-7 shrink-0" aria-hidden />
        </Link>

        <ul className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {CARDS.map(({ href, label, desc, Icon, tone }) => (
            <li key={href}>
              <Link
                href={href}
                className="flex h-full min-h-40 flex-col justify-between rounded-3xl border border-slate-200 bg-white p-4 shadow-md transition active:scale-[0.98]"
              >
                <span className={`flex h-12 w-12 items-center justify-center rounded-2xl ${tone}`}>
                  <Icon className="h-7 w-7" aria-hidden />
                </span>
                <span>
                  <span className="block text-lg font-bold leading-snug">{label}</span>
                  <span className="block text-sm text-slate-600">{desc}</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>

      </div>
    </div>
  );
}