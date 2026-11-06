'use client';
import { Square } from 'lucide-react';
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
      className={`inline-flex min-h-14 items-center justify-center gap-2 rounded-2xl px-5 text-lg font-bold focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-[#C8102E] ${
        active ? 'bg-[#C8102E] text-white' : 'bg-[#0B3D91] text-white'
      } ${className}`}
    >
      {active ? <><Square className="h-5 w-5" aria-hidden /> Detener audio</> : `🔊 ${label}`}
    </button>
  );
}
