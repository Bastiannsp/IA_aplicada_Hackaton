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
    <nav aria-label="Navegación principal" className="fixed inset-x-0 bottom-0 z-50 border-t border-slate-300 bg-white pb-[env(safe-area-inset-bottom)]">
      <ul className="mx-auto flex h-[4.5rem] max-w-3xl">
        {TABS.map(({ href, label, Icon }) => {
          const active = href === '/' ? path === '/' : path.startsWith(href);
          return (
            <li key={href} className="flex-1">
              <Link href={href} aria-current={active ? 'page' : undefined}
                className={`flex h-full flex-col items-center justify-center gap-1 text-xs font-bold ${active ? 'text-[#0B3D91]' : 'text-slate-600'}`}>
                <span className={`rounded-full px-5 py-1 ${active ? 'bg-[#0B3D91]/10' : ''}`}><Icon className="h-6 w-6" aria-hidden /></span>
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
