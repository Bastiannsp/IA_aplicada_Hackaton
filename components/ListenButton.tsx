'use client';
import { Square, Volume2 } from 'lucide-react';
import { useVoice } from '@/hooks/useVoice';

interface Props { text: string; id: string; label?: string; className?: string }

export default function ListenButton({ text, id, label = 'Escuchar', className = '' }: Props) {
  const { toggle, speakingId, ttsSupported } = useVoice();
  const active = speakingId === id;
  if (!ttsSupported) return null;
  return (
    <button
      type="button"
      onClick={() => toggle(text, id)}
      aria-pressed={active}
      className={`inline-flex min-h-14 items-center justify-center gap-2 rounded-full px-6 text-lg font-bold text-white shadow-md transition active:scale-[0.98] ${
        active ? 'bg-[#C8102E]' : 'bg-[#0B3D91]'
      } ${className}`}
    >
      {active ? (
        <><Square className="h-5 w-5" aria-hidden /> Detener audio</>
      ) : (
        <><Volume2 className="h-6 w-6" aria-hidden /> {label}</>
      )}
    </button>
  );
}