'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Clapperboard, Compass, GraduationCap, Home, ShieldCheck } from 'lucide-react';

const TABS = [
  { href: '/', label: 'Inicio', Icon: Home },
  { href: '/verificar', label: 'Verificar', Icon: ShieldCheck },
  { href: '/reels', label: 'Reels', Icon: Clapperboard },
  { href: '/explorar', label: 'Explorar', Icon: Compass },
  { href: '/aprender', label: 'Aprender', Icon: GraduationCap },
];

export default function BottomNav() {
  const path = usePathname();
  return (
    <nav
      aria-label="Navegación principal"
      className="fixed inset-x-0 bottom-0 z-50 px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]"
    >
      <ul className="mx-auto flex h-[4.5rem] max-w-3xl items-stretch gap-1 rounded-3xl border border-slate-200 bg-white/95 p-1.5 shadow-[0_8px_30px_rgba(20,33,61,0.18)] backdrop-blur">
        {TABS.map(({ href, label, Icon }) => {
          const active = href === '/' ? path === '/' : path.startsWith(href);
          return (
            <li key={href} className="flex-1">
              <Link
                href={href}
                aria-current={active ? 'page' : undefined}
                className={`flex h-full flex-col items-center justify-center gap-0.5 rounded-2xl text-xs font-bold transition ${
                  active ? 'bg-[#0B3D91] text-white' : 'text-slate-600'
                }`}
              >
                <Icon className="h-6 w-6" aria-hidden />
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}