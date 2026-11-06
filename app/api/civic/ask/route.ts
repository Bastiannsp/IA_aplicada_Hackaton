import { documents } from '@/backend/lib/database/mockData';
import type { CivicAskRequest, CivicAskResponse } from '@/backend/types/verification';

const STOP_WORDS = new Set(['para', 'por', 'con', 'una', 'uno', 'que', 'como', 'desde', 'sobre', 'esta', 'este', 'las', 'los', 'del', 'sus', 'un', 'es', 'en', 'de', 'y', 'a']);

function tokenize(value: string): Set<string> {
  return new Set(
    value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
      .match(/[a-z0-9]+/g)?.filter((word) => word.length > 2 && !STOP_WORDS.has(word)) ?? [],
  );
}

export async function POST(request: Request): Promise<Response> {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: 'El cuerpo debe ser JSON válido.' }, { status: 400 });
  }

  if (
    typeof body !== 'object' || body === null ||
    !('documentId' in body) || typeof body.documentId !== 'string' ||
    !('question' in body) || typeof body.question !== 'string'
  ) {
    return Response.json({ error: 'Envía documentId y question como texto.' }, { status: 400 });
  }

  const { documentId, question } = body as CivicAskRequest;
  if (!question.trim() || question.length > 1_000) {
    return Response.json({ error: 'La pregunta debe tener entre 1 y 1.000 caracteres.' }, { status: 400 });
  }

  const document = documents.find((item) => item.id === documentId);
  if (!document) {
    return Response.json({ error: 'Documento público no encontrado.' }, { status: 404 });
  }

  const questionTerms = tokenize(question);
  const excerptTerms = tokenize(document.texto_extracto);
  const overlapCount = [...questionTerms].filter((term) => excerptTerms.has(term)).length;
  const hasOverlap = overlapCount >= 2;
  const response: CivicAskResponse = {
    answer: hasOverlap
      ? 'Encontré este extracto del documento. Revísalo para responder tu pregunta; no se generó una conclusión fuera del texto disponible.'
      : 'No encontré un pasaje coincidente en el extracto disponible. Consulta el documento oficial completo.',
    documentTitle: document.titulo,
    officialUrl: document.URL_oficial,
    evidence: hasOverlap ? document.texto_extracto : null,
    foundInDocument: hasOverlap,
  };

  return Response.json(response, { headers: { 'Cache-Control': 'no-store' } });
}
