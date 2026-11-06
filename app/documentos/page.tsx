'use client';
import { useState } from 'react';
import { Mic, Search } from 'lucide-react';
import ListenButton from '@/components/ListenButton';
import { documents } from '@/data/mockData';
import { useVoice } from '@/hooks/useVoice';

interface Answer { answer: string; ref: string; quote: string; found: boolean }

export default function DocumentosPage() {
  const { listen, listening, sttSupported } = useVoice();
  const [docId, setDocId] = useState(documents[0].id);
  const [question, setQuestion] = useState('');
  const [result, setResult] = useState<Answer | null>(null);

  const ask = () => {
    const doc = documents.find((d) => d.id === docId)!;
    const q = question.toLowerCase();
    const hit = doc.qa.find((x) => x.keywords.some((k) => q.includes(k)));
    setResult(hit
      ? { answer: hit.answer, ref: hit.citation.ref, quote: hit.citation.quote, found: true }
      : { answer: 'No encontré una respuesta clara en este documento. Prueba con otras palabras o revisa el texto completo.', ref: '', quote: '', found: false });
  };

  return (
    <div className="px-5 pt-8">
      <h1 className="text-3xl font-bold">Asistente de documentos</h1>

      <label htmlFor="doc" className="mt-4 block text-lg text-slate-700">Documento</label>
      <select id="doc" value={docId} onChange={(e) => { setDocId(e.target.value); setResult(null); }}
        className="mt-1 min-h-14 w-full rounded-2xl border-2 border-slate-400 bg-white px-3 text-lg">
        {documents.map((d) => <option key={d.id} value={d.id}>{d.title}</option>)}
      </select>

      <label htmlFor="q" className="mt-4 block text-lg text-slate-700">Tu pregunta</label>
      <div className="mt-1 flex gap-2">
        <input id="q" value={question} onChange={(e) => setQuestion(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && ask()}
          placeholder="Ej: ¿Cuánto va a seguridad?" className="min-h-14 flex-1 rounded-2xl border-2 border-slate-400 bg-white px-4 text-lg focus:border-[#0B3D91] focus:outline-none" />
        {sttSupported && (
          <button onClick={() => listen(setQuestion)} aria-label="Dictar pregunta" aria-pressed={listening}
            className={`flex h-14 w-14 items-center justify-center rounded-2xl ${listening ? 'bg-[#C8102E] text-white' : 'border-2 border-[#0B3D91] bg-white text-[#0B3D91]'}`}>
            <Mic className="h-6 w-6" aria-hidden />
          </button>
        )}
      </div>
      <button onClick={ask} disabled={!question.trim()} className="mt-3 flex min-h-14 w-full items-center justify-center gap-2 rounded-2xl bg-[#0B3D91] text-xl font-bold text-white disabled:bg-slate-400">
        <Search className="h-6 w-6" aria-hidden /> Preguntar al documento
      </button>

      {result && (
        <section aria-live="polite" className="mt-6 space-y-4">
          <div className="rounded-2xl bg-white p-4 text-xl">{result.answer}</div>
          {result.found && (
            <blockquote className="rounded-2xl border-l-8 border-[#0B3D91] bg-white p-4">
              <p className="text-base font-bold text-slate-600">Cita original · {result.ref}</p>
              <p className="mt-1 text-lg italic">“{result.quote}”</p>
            </blockquote>
          )}
          <ListenButton text={`${result.answer} ${result.found ? `Fuente: ${result.ref}.` : ''}`} id="doc-answer" label="Escuchar respuesta" className="w-full" />
        </section>
      )}
      <p className="mt-6 text-sm text-slate-600">Textos de demostración. Esta herramienta no reemplaza el criterio humano.</p>
    </div>
  );
}
