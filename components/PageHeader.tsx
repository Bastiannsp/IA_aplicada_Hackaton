import type { LucideIcon } from 'lucide-react';

interface Props {
  title: string;
  subtitle?: string;
  Icon?: LucideIcon;
  children?: React.ReactNode;
}

export default function PageHeader({ title, subtitle, Icon, children }: Props) {
  return (
    <header className="relative overflow-hidden rounded-b-[2rem] bg-linear-to-br from-[#0B3D91] to-[#1F63D1] px-5 pb-8 pt-8 text-white">
      <span aria-hidden className="pointer-events-none absolute -right-10 -top-12 h-44 w-44 rounded-full bg-white/10" />
      <span aria-hidden className="pointer-events-none absolute -bottom-16 left-8 h-36 w-36 rounded-full bg-[#C8102E]/30" />
      <div className="relative flex items-start gap-4">
        {Icon && (
          <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/15">
            <Icon className="h-8 w-8" aria-hidden />
          </span>
        )}
        <div>
          <h1 className="text-3xl font-bold leading-tight">{title}</h1>
          {subtitle && <p className="mt-1 text-lg text-blue-100">{subtitle}</p>}
        </div>
      </div>
      {children && <div className="relative mt-4">{children}</div>}
    </header>
  );
}