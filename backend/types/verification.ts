export const VERDICTS = [
  "RESPALDADA",
  "CONTRADICHA",
  "ENGANOSA",
  "NO_VERIFICABLE",
] as const;

export type VerificationVerdict = (typeof VERDICTS)[number];

export const SOURCE_RELATIONS = ["A_FAVOR", "EN_CONTRA", "CONTEXTO"] as const;

export type SourceRelation = (typeof SOURCE_RELATIONS)[number];

export interface VerifyRequest {
  claim: string;
}

export interface VerificationSource {
  id: string;
  title: string;
  url: string;
  publisher: string;
  evidence: string;
  supports: SourceRelation;
}

export interface VerificationResponse {
  claim: string;
  verdict: VerificationVerdict;
  summary: string;
  reasoning: string;
  sources: VerificationSource[];
  limitations: string[];
  human_review: true;
}

export interface ApiErrorResponse {
  error: {
    code: string;
    message: string;
  };
}
