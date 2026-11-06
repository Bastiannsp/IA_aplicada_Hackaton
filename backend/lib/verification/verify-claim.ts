import { assessClaimWithOpenRouter } from "../ai/openrouter";
import { isSafeCuratedUrl, retrieveEvidence } from "../sources/catalog";
import type {
  VerificationResponse,
  VerificationSource,
} from "../../types/verification";

function noEvidenceResponse(claim: string): VerificationResponse {
  return {
    claim,
    verdict: "NO_VERIFICABLE",
    summary: "No encontramos evidencia revisada suficiente para evaluar esta afirmación.",
    reasoning:
      "ClarAI solo entrega una clasificación cuando puede contrastar la afirmación con fuentes incluidas y revisadas en su catálogo.",
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

  const assessment = await assessClaimWithOpenRouter(claim, evidence);
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
