'use client';

import { useEffect, useState } from 'react';
import { Mic, Search } from 'lucide-react';
import ListenButton from '@/components/ListenButton';
import { useVoice } from '@/hooks/useVoice';

interface PublicDocument {
  id: string;
  titulo: string;
  institucion: string;
  URL_oficial: string;
  texto_extracto: string;
}

interface Answer {
  answer: string;
  documentTitle: string;
  officialUrl: string;
  evidence: string | null;
  foundInDocument: boolean;
}

export default function DocumentosPage() {
  const { listen, listening, sttSupported } = useVoice();
  const [documents, setDocuments] = useState<PublicDocument[]>([]);
  const [docId, setDocId] = useState('');
  const [question, setQuestion] = useState('');
  const [result, setResult] = useState<Answer | null>(null);
  const [loadingDocuments, setLoadingDocuments] = useState(true);
  const [asking, setAsking] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    fetch('/api/documents', { cache: 'no-store' })
      .then(async (response) => {
        if (!response.ok) throw new Error('No fue posible cargar los documentos.');
        return response.json() as Promise<PublicDocument[]>;
      })
      .then((items) => {
        if (!active) return;
        setDocuments(items);
        setDocId(items[0]?.id ?? '');
      })
      .catch((loadError) => {
        if (active) setError(loadError instanceof Error ? loadError.message : 'Error al cargar documentos.');
      })
      .finally(() => {
        if (active) setLoadingDocuments(false);
      });

    return () => { active = false; };
  }, []);

  const ask = async () => {
    if (!question.trim() || !docId || asking) return;
    setAsking(true);
    setError('');
    setResult(null);

    try {
      const response = await fetch('/api/civic/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ documentId: docId, question: question.trim() }),
      });
      const payload: unknown = await response.json().catch(() => null);
      if (!response.ok) {
        const message = typeof payload === 'object' && payload !== null && 'error' in payload && typeof payload.error === 'string'
          ? payload.error
          : 'No fue posible consultar el documento.';
        throw new Error(message);
      }
      setResult(payload as Answer);
    } catch (askError) {
      setError(askError instanceof Error ? askError.message : 'Ocurrió un error inesperado.');
    } finally {
      setAsking(false);
    }
  };

  const selectedDocument = documents.find((document) => document.id === docId);

  return (
    <div className="px-5 pt-8">
      <h1 className="text-3xl font-bold">Asistente de documentos</h1>

      <label htmlFor="doc" className="mt-4 block text-lg text-slate-700">Documento</label>
      <select
        id="doc"
        value={docId}
        onChange={(event) => { setDocId(event.target.value); setResult(null); }}
        disabled={loadingDocuments || documents.length === 0}
        className="mt-1 min-h-14 w-full rounded-2xl border-2 border-slate-400 bg-white px-3 text-lg"
      >
        {documents.map((document) => <option key={document.id} value={document.id}>{document.titulo}</option>)}
      </select>

      <label htmlFor="q" className="mt-4 block text-lg text-slate-700">Tu pregunta</label>
      <div className="mt-1 flex gap-2">
        <input
          id="q"
          value={question}
          onChange={(event) => setQuestion(event.target.value)}
          onKeyDown={(event) => event.key === 'Enter' && void ask()}
          placeholder="Ej: ¿Qué dice sobre las horas semanales?"
          className="min-h-14 flex-1 rounded-2xl border-2 border-slate-400 bg-white px-4 text-lg focus:border-[#0B3D91] focus:outline-none"
        />
        {sttSupported && (
          <button onClick={() => listen(setQuestion)} aria-label="Dictar pregunta" aria-pressed={listening}
            className={`flex h-14 w-14 items-center justify-center rounded-2xl ${listening ? 'bg-[#C8102E] text-white' : 'border-2 border-[#0B3D91] bg-white text-[#0B3D91]'}`}>
            <Mic className="h-6 w-6" aria-hidden />
          </button>
        )}
      </div>
      <button onClick={() => void ask()} disabled={!question.trim() || !docId || asking || loadingDocuments}
        className="mt-3 flex min-h-14 w-full items-center justify-center gap-2 rounded-2xl bg-[#0B3D91] text-xl font-bold text-white disabled:bg-slate-400">
        <Search className="h-6 w-6" aria-hidden /> {asking ? 'Buscando en el extracto…' : 'Preguntar al documento'}
      </button>

      {error && <p role="alert" className="mt-4 rounded-xl bg-red-100 p-3 text-base font-semibold text-red-900">{error}</p>}

      {result && (
        <section aria-live="polite" className="mt-6 space-y-4">
          <div className="rounded-2xl bg-white p-4 text-xl">{result.answer}</div>
          {result.foundInDocument && result.evidence && (
            <blockquote className="rounded-2xl border-l-8 border-[#0B3D91] bg-white p-4">
              <p className="text-base font-bold text-slate-600">Extracto · {result.documentTitle}</p>
              <p className="mt-1 text-lg italic">“{result.evidence}”</p>
            </blockquote>
          )}
          <a href={result.officialUrl} target="_blank" rel="noopener noreferrer"
            className="inline-flex min-h-12 items-center text-lg font-bold text-[#0B3D91] underline">
            Abrir documento oficial
          </a>
          <ListenButton text={`${result.answer}${result.evidence ? ` ${result.evidence}` : ''}`} id="doc-answer" label="Escuchar respuesta" className="w-full" />
        </section>
      )}

      {selectedDocument && <p className="mt-6 text-sm text-slate-600">Se consulta el extracto de demostración de {selectedDocument.institucion}; para más contexto, revisa el documento oficial.</p>}
      {!selectedDocument && !loadingDocuments && <p className="mt-6 text-sm text-slate-600">No hay documentos disponibles.</p>}
    </div>
  );
}
