import { AlertTriangle, CheckCircle2, HelpCircle, XCircle } from 'lucide-react';
import type { Verdict } from '@/types';

const STYLES: Record<Verdict, { label: string; cls: string; Icon: typeof XCircle }> = {
  RESPALDADA: { label: 'Respaldada', cls: 'bg-emerald-100 text-emerald-900 border-emerald-700', Icon: CheckCircle2 },
  CONTRADICHA: { label: 'Contradicha', cls: 'bg-red-100 text-red-900 border-red-700', Icon: XCircle },
  ENGAÑOSA: { label: 'Engañosa', cls: 'bg-amber-100 text-amber-900 border-amber-700', Icon: AlertTriangle },
  NO_VERIFICABLE: { label: 'No verificable', cls: 'bg-slate-100 text-slate-800 border-slate-600', Icon: HelpCircle },
};

export default function VerdictBadge({ verdict, large = false }: { verdict: Verdict; large?: boolean }) {
  const { label, cls, Icon } = STYLES[verdict];
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border-2 font-bold ${cls} ${large ? 'px-4 py-2 text-lg' : 'px-3 py-1 text-sm'}`}>
      <Icon className={large ? 'h-6 w-6' : 'h-4 w-4'} aria-hidden /> {label}
    </span>
  );
}
