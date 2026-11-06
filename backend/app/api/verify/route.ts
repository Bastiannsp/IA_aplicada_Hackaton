import { OpenRouterError } from "../../../lib/ai/openrouter";
import { verifyClaim } from "../../../lib/verification/verify-claim";
import type { ApiErrorResponse, VerifyRequest } from "../../../types/verification";

export const runtime = "nodejs";

const MAX_CLAIM_LENGTH = 2_000;
const MIN_CLAIM_LENGTH = 10;
const MAX_REQUEST_BYTES = 16_384;
const POLITICAL_QUERY_PATTERN = /\b(vota|votar|apoya|apoyar|elige|elegir|campaña|propaganda|partidista|partido político|presidente|presidenta|diputado|diputada|senador|senadora|alcalde|alcaldesa|ministro|ministra|candidato|candidata)\b/i;

function apiError(status: number, code: string, message: string): Response {
  const body: ApiErrorResponse = { error: { code, message } };
  return Response.json(body, { status });
}

export async function POST(request: Request): Promise<Response> {
  const contentLength = Number(request.headers.get("content-length"));
  if (Number.isFinite(contentLength) && contentLength > MAX_REQUEST_BYTES) {
    return apiError(413, "REQUEST_TOO_LARGE", "El cuerpo de la solicitud supera el límite permitido.");
  }

  let rawBody: string;
  try {
    if (!request.body) {
      return apiError(400, "INVALID_JSON", "El cuerpo de la solicitud debe ser JSON válido.");
    }

    const reader = request.body.getReader();
    const chunks: Uint8Array[] = [];
    let totalBytes = 0;
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      totalBytes += value.byteLength;
      if (totalBytes > MAX_REQUEST_BYTES) {
        await reader.cancel();
        return apiError(413, "REQUEST_TOO_LARGE", "El cuerpo de la solicitud supera el límite permitido.");
      }
      chunks.push(value);
    }

    const bytes = new Uint8Array(totalBytes);
    let offset = 0;
    for (const chunk of chunks) {
      bytes.set(chunk, offset);
      offset += chunk.byteLength;
    }
    rawBody = new TextDecoder("utf-8", { fatal: true }).decode(bytes);
  } catch {
    return apiError(400, "INVALID_JSON", "El cuerpo de la solicitud debe ser JSON válido.");
  }

  let body: unknown;
  try {
    body = JSON.parse(rawBody);
  } catch {
    return apiError(400, "INVALID_JSON", "El cuerpo de la solicitud debe ser JSON válido.");
  }

  if (
    typeof body !== "object" ||
    body === null ||
    !("claim" in body) ||
    typeof body.claim !== "string"
  ) {
    return apiError(400, "INVALID_CLAIM", "Envía una afirmación de texto en el campo claim.");
  }

  const claim = (body as VerifyRequest).claim.trim();
  if (claim.length < MIN_CLAIM_LENGTH) {
    return apiError(400, "CLAIM_TOO_SHORT", `La afirmación debe tener al menos ${MIN_CLAIM_LENGTH} caracteres.`);
  }
  if (claim.length > MAX_CLAIM_LENGTH) {
    return apiError(413, "CLAIM_TOO_LONG", `La afirmación no puede superar ${MAX_CLAIM_LENGTH} caracteres.`);
  }
  if (POLITICAL_QUERY_PATTERN.test(claim)) {
    return apiError(422, "POLITICAL_QUERY_NOT_SUPPORTED", "Clara no genera propaganda ni evalúa consultas sobre personas en cargos públicos. Puedes consultar leyes, políticas públicas y fuentes oficiales sin pedir apoyo político.");
  }

  try {
    const result = await verifyClaim(claim);
    return Response.json(result, {
      status: 200,
      headers: { "Cache-Control": "no-store" },
    });
  } catch (error) {
    if (error instanceof OpenRouterError) {
      if (error.code === "NOT_CONFIGURED") {
        return apiError(503, "AI_NOT_CONFIGURED", "El servicio de análisis aún no está configurado.");
      }
      if (error.code === "TIMEOUT") {
        return apiError(504, "AI_TIMEOUT", "El análisis tardó demasiado. Intenta nuevamente.");
      }
      if (error.code === "INVALID_RESPONSE") {
        return apiError(502, "AI_INVALID_RESPONSE", "El servicio de análisis devolvió una respuesta que no se pudo validar.");
      }
      if (error.status === 429) {
        return apiError(503, "AI_RATE_LIMITED", "El servicio de análisis alcanzó su límite temporal. Intenta más tarde.");
      }
      return apiError(502, "AI_PROVIDER_ERROR", "No fue posible completar el análisis en este momento.");
    }

    return apiError(500, "INTERNAL_ERROR", "Ocurrió un error interno al analizar la afirmación.");
  }
}
