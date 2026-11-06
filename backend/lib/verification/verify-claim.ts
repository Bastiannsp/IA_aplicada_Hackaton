import { assessClaimWithOpenRouter, OpenRouterError, type ModelAssessment } from "../ai/openrouter";
import { isSafeCuratedUrl, retrieveEvidence } from "../sources/catalog";
import type {
  VerificationResponse,
  VerificationSource,
} from "../../types/verification";

function assessFromCatalog(claim: string, evidence: ReturnType<typeof retrieveEvidence>): ModelAssessment {
  const normalizedClaim = claim.toLowerCase();
  const mentionsFortyHours = /40\s*(?:horas|h)/.test(normalizedClaim);
  const asksIfLawIsVigente = /\bley\b/.test(normalizedClaim) && /\b(vigente|en vigor)\b/.test(normalizedClaim);
  const claimsImmediateChange = /\b(ya|ahora|actualmente|hoy)\b/.test(normalizedClaim) || normalizedClaim.includes('desde 2024');
  const hasFortyHoursSource = evidence.some((source) => source.id === 'mintrab-ley-40-horas');

  if (mentionsFortyHours && asksIfLawIsVigente && hasFortyHoursSource) {
    return {
      verdict: 'RESPALDADA',
      summary: 'La Ley 21.561, conocida como Ley de 40 Horas, está vigente en Chile.',
      explanation: 'La ley está vigente, pero su reducción de jornada se aplica gradualmente: la jornada ordinaria es de 42 horas en 2026 y llegará a 40 horas en 2028.',
      citations: evidence.map((source) => ({
        sourceId: source.id,
        supports: source.id === 'mintrab-ley-40-horas' ? 'A_FAVOR' : 'CONTEXTO',
      })),
      limitations: ['La vigencia de la ley no significa que todas las personas trabajen ya 40 horas.', 'Respuesta basada exclusivamente en el catálogo oficial revisado.'],
    };
  }

  if (mentionsFortyHours && claimsImmediateChange && hasFortyHoursSource) {
    return {
      verdict: 'ENGANOSA',
      summary: 'La Ley 21.561 está vigente, pero la jornada de 40 horas se implementa gradualmente.',
      explanation: 'La jornada ordinaria se redujo a 44 horas en 2024, a 42 horas desde el 26 de abril de 2026 y llegará a 40 horas en 2028. Por eso no es correcto decir que ya rige una jornada general de 40 horas.',
      citations: evidence.map((source) => ({
        sourceId: source.id,
        supports: source.id === 'mintrab-ley-40-horas' ? 'EN_CONTRA' : 'CONTEXTO',
      })),
      limitations: ['Respuesta local basada exclusivamente en el catálogo oficial revisado.', 'Para otros casos se necesita configurar OPENROUTER_API_KEY y OPENROUTER_MODEL.'],
    };
  }

  return {
    verdict: 'NO_VERIFICABLE',
    summary: 'Encontramos fuentes oficiales relacionadas, pero no permiten confirmar o contradecir esta afirmación de forma suficiente.',
    explanation: 'Clara necesita una fuente más específica o una evaluación de modelo para establecer una conclusión responsable.',
    citations: evidence.map((source) => ({ sourceId: source.id, supports: 'CONTEXTO' })),
    limitations: ['Respuesta local basada exclusivamente en el catálogo oficial revisado.', 'La evidencia relacionada no basta para confirmar la afirmación.'],
  };
}

function noEvidenceResponse(claim: string): VerificationResponse {
  return {
    claim,
    verdict: "NO_VERIFICABLE",
    summary: "No encontramos evidencia revisada suficiente para evaluar esta afirmación.",
    reasoning:
      "Clara solo entrega una clasificación cuando puede contrastar la afirmación con fuentes incluidas y revisadas en su catálogo.",
    sources: [],
    limitations: [
      "El catálogo de fuentes puede no contener información pertinente o actualizada.",
      "La falta de evidencia en el catálogo no demuestra que la afirmación sea verdadera ni falsa.",
    ],
    human_review: true,
  };
}

export async function verifyClaim(claim: string): Promise<VerificationResponse> {
  const evidence = retrieveEvidence(claim);
  if (evidence.length === 0) return noEvidenceResponse(claim);

  let assessment: ModelAssessment;
  const isKnownFortyHoursClaim = /40\s*(?:horas|h)/i.test(claim) && evidence.some((source) => source.id === 'mintrab-ley-40-horas');
  if (isKnownFortyHoursClaim) {
    assessment = assessFromCatalog(claim, evidence);
  } else {
    try {
      assessment = await assessClaimWithOpenRouter(claim, evidence);
    } catch (error) {
      if (
        !(error instanceof OpenRouterError) ||
        (error.code !== 'NOT_CONFIGURED' && error.code !== 'INVALID_RESPONSE')
      ) throw error;
      assessment = assessFromCatalog(claim, evidence);
    }
  }
  const evidenceById = new Map(evidence.map((source) => [source.id, source]));
  const citationsById = new Map(
    assessment.citations.map((citation) => [citation.sourceId, citation.supports]),
  );

  const sources: VerificationSource[] = [];
  for (const [sourceId, supports] of citationsById) {
    const source = evidenceById.get(sourceId);
    if (!source || !isSafeCuratedUrl(source.url)) continue;

    sources.push({
      id: source.id,
      title: source.title,
      url: source.url,
      publisher: source.publisher,
      evidence: source.excerpt,
      supports,
    });
  }

  // A label without an auditable citation must never be presented as supported.
  if (sources.length === 0) return noEvidenceResponse(claim);

  const hasSupport = sources.some((source) => source.supports === "A_FAVOR");
  const hasContradiction = sources.some((source) => source.supports === "EN_CONTRA");
  if (
    (assessment.verdict === "RESPALDADA" && !hasSupport) ||
    (assessment.verdict === "CONTRADICHA" && !hasContradiction)
  ) {
    return noEvidenceResponse(claim);
  }

  const limitations = assessment.limitations.length > 0 ? assessment.limitations : [];
  return {
    claim,
    verdict: assessment.verdict,
    summary: assessment.summary || "La evidencia disponible no permite una conclusión clara.",
    reasoning: assessment.explanation || "No hay una explicación suficiente basada en las fuentes consultadas.",
    sources,
    limitations,
    human_review: true,
  };
}
