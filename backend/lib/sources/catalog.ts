import type { SourceRelation } from "../../types/verification";
import { OFFICIAL_SOURCE_DIRECTORY } from "./official-source-directory";

/**
 * Add only sources reviewed by the team. Evidence excerpts must be copied from
 * the linked source and kept short enough to audit. The model never supplies
 * titles, URLs, publishers, or quotations for the API response.
 */
export interface CuratedSource {
  id: string;
  title: string;
  publisher: string;
  url: string;
  excerpt: string;
  keywords: readonly string[];
}

export interface RetrievedEvidence extends CuratedSource {
  matchedKeywords: string[];
}

// Deliberately empty: no source material was included in the repository that
// could be safely promoted to evidence without team review.
export const VERIFICATION_SOURCE_CATALOG: readonly CuratedSource[] = [];

const OFFICIAL_HOSTS = new Set(
  OFFICIAL_SOURCE_DIRECTORY.map((source) => new URL(source.url).hostname.toLowerCase()),
);

const STOP_WORDS = new Set([
  "para", "por", "con", "una", "uno", "unas", "unos", "que", "como",
  "esta", "este", "estos", "estas", "desde", "sobre", "entre", "cuando",
  "donde", "porque", "segun", "hasta", "tiene", "tienen", "ser", "estar",
  "fue", "son", "del", "los", "las", "el", "la", "de", "en", "y", "o",
  "a", "un", "es", "se", "al", "su", "sus", "ha", "han", "hay",
]);

function tokenize(value: string): string[] {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .match(/[a-z0-9]+/g)
    ?.filter((word) => word.length > 2 && !STOP_WORDS.has(word)) ?? [];
}

/** Accept only auditable public HTTPS URLs from the trusted, code-reviewed catalog. */
export function isSafeCuratedUrl(value: string): boolean {
  try {
    const url = new URL(value);
    const hostname = url.hostname.toLowerCase();

    if (
      url.protocol !== "https:" ||
      url.username.length > 0 ||
      url.password.length > 0 ||
      (url.port.length > 0 && url.port !== "443") ||
      hostname.length === 0 ||
      hostname.startsWith("[") ||
      hostname === "localhost" ||
      hostname.endsWith(".localhost") ||
      hostname.endsWith(".local") ||
      hostname.endsWith(".internal") ||
      /^\d{1,3}(\.\d{1,3}){3}$/.test(hostname) ||
      ![...OFFICIAL_HOSTS].some(
        (officialHost) => hostname === officialHost || hostname.endsWith(`.${officialHost}`),
      )
    ) {
      return false;
    }

    return true;
  } catch {
    return false;
  }
}

function isUsableSource(source: CuratedSource): boolean {
  return Boolean(
    source.id.trim() &&
      source.title.trim() &&
      source.publisher.trim() &&
      source.excerpt.trim() &&
      source.excerpt.length <= 4_000 &&
      source.keywords.length > 0 &&
      isSafeCuratedUrl(source.url),
  );
}

/**
 * Retrieve only reviewed excerpts whose metadata overlaps the claim. This is
 * intentionally a small lexical MVP, not open-web search or proof of truth.
 */
export function retrieveEvidence(
  claim: string,
  limit = 5,
): RetrievedEvidence[] {
  const claimTerms = new Set(tokenize(claim));
  if (claimTerms.size === 0) return [];

  const seenIds = new Set<string>();
  return VERIFICATION_SOURCE_CATALOG
    .filter((source) => {
      if (seenIds.has(source.id) || !isUsableSource(source)) return false;
      seenIds.add(source.id);
      return true;
    })
    .map((source) => {
      const indexedTerms = new Set([
        ...tokenize(source.title),
        ...tokenize(source.publisher),
        ...tokenize(source.excerpt),
        ...source.keywords.flatMap(tokenize),
      ]);
      const matchedKeywords = [...claimTerms].filter((term) => indexedTerms.has(term));
      return { source, matchedKeywords };
    })
    .filter(({ matchedKeywords }) => matchedKeywords.length > 0)
    .sort((left, right) => right.matchedKeywords.length - left.matchedKeywords.length)
    .slice(0, limit)
    .map(({ source, matchedKeywords }) => ({ ...source, matchedKeywords }));
}

export function isSourceRelation(value: unknown): value is SourceRelation {
  return value === "A_FAVOR" || value === "EN_CONTRA" || value === "CONTEXTO";
}
