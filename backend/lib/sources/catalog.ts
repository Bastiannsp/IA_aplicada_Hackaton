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

// Initial reviewed records, cross-checked against the exact official documents.
// Keep excerpts short and update them when the underlying page changes.
export const VERIFICATION_SOURCE_CATALOG: readonly CuratedSource[] = [
  {
    id: "bcn-ley-21524-voto-obligatorio",
    title: "Ley 21.524, restablece el voto obligatorio",
    publisher: "Biblioteca del Congreso Nacional (LeyChile)",
    url: "https://www.bcn.cl/leychile/navegar?i=1187324",
    excerpt:
      "El sufragio será obligatorio para los electores en todas las elecciones y plebiscitos, salvo en las elecciones primarias.",
    keywords: ["voto", "sufragio", "obligatorio", "elecciones", "plebiscitos", "voluntario", "Ley 21.524"],
  },
  {
    id: "mintrab-ley-40-horas",
    title: "Implementación de la Ley 21.561, jornada de 40 horas",
    publisher: "Ministerio del Trabajo y Previsión Social",
    url: "https://www.mintrab.gob.cl/40horas-implementacion/",
    excerpt:
      "La Ley 21.561 está vigente y se aplica gradualmente: en 2024 la jornada ordinaria bajó a 44 horas, desde el 26 de abril de 2026 bajó a 42 horas y en 2028 llegará a 40 horas semanales.",
    keywords: ["40 horas", "jornada", "laboral", "semanales", "gradual", "vigente", "rige", "2024", "2026", "42", "2028", "Ley 21.561"],
  },
  {
    id: "dt-dictamenes-ley-40-horas",
    title: "Dictámenes sobre la Ley 21.561",
    publisher: "Dirección del Trabajo",
    url: "https://www.dt.gob.cl/portal/1626/w3-propertyname-2556.html",
    excerpt:
      "La Dirección del Trabajo publica dictámenes sobre la Ley 21.561, que modifica el Código del Trabajo para reducir gradualmente la jornada laboral.",
    keywords: ["40 horas", "ley", "21.561", "jornada", "trabajo", "dictámenes", "vigente", "reducción"],
  },
  {
    id: "ine-censo-2024-resultados",
    title: "Primeros resultados del Censo 2024",
    publisher: "Instituto Nacional de Estadísticas (INE)",
    url: "https://www.ine.gob.cl/sala-de-prensa/prensa/general/noticia/2025/03/27/primeros-resultados-del-censo-2024-18.480.432-personas-fueron-censadas-en-chile-manteni%C3%A9ndose-la-tendencia-de-envejecimiento-de-la-poblaci%C3%B3n",
    excerpt:
      "Un total de 18.480.432 personas fueron censadas en Chile durante el Censo de Población y Vivienda.",
    keywords: ["censo", "2024", "población", "personas", "habitantes", "mujeres", "hombres", "INE", "Chile"],
  },
];

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
    ?.filter((word) => (word.length > 2 || /^\d{2,4}$/.test(word)) && !STOP_WORDS.has(word)) ?? [];
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
    .filter(({ matchedKeywords }) => matchedKeywords.length >= 2)
    .sort((left, right) => right.matchedKeywords.length - left.matchedKeywords.length)
    .slice(0, limit)
    .map(({ source, matchedKeywords }) => ({ ...source, matchedKeywords }));
}

export function isSourceRelation(value: unknown): value is SourceRelation {
  return value === "A_FAVOR" || value === "EN_CONTRA" || value === "CONTEXTO";
}
