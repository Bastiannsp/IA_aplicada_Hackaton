export type Verdict = 'RESPALDADA' | 'CONTRADICHA' | 'ENGAÑOSA' | 'NO_VERIFICABLE';
export type SourceRelation = 'A favor' | 'En contra' | 'Contexto';

export interface OfficialSource {
  id: string;
  headline: string;
  institution: string;
  excerpt: string;
  url: string;
  relation: SourceRelation;
}

export interface VerificationResult {
  id: string;
  claim: string;
  keywords: string[];
  verdict: Verdict;
  explanation: [string, string, string];
  sources: OfficialSource[];
  limitations: string[];
}

export interface Reel {
  id: string;
  category: string;
  verdict: Verdict;
  headline: string;
  summary: string;
  sourceLabel: string;
  sourceUrl: string;
  emoji: string;
  gradient: string; // clases Tailwind de fondo
}

export interface CaseItem {
  id: string;
  title: string;
  type: 'Proyecto de Ley' | 'Presupuesto Municipal' | 'Noticia';
  headline: string; // lo que "dice la noticia"
  resultId: string; // id de VerificationResult
}
export type PriorVote = 'Verdadero' | 'Falso' | 'No sé';

export interface Lesson {
  id: string;
  title: string;
  body: string;
  quiz: { question: string; options: string[]; correctIndex: number; feedback: string };
}

export interface CivicDocument {
  id: string;
  title: string;
  institution: string;
  qa: { keywords: string[]; answer: string; citation: { ref: string; quote: string } }[];
}
