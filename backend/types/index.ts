export interface Claim {
  id: string;
  texto: string;
  tema: string;
  contexto: string;
  estado_demo: 'RESPALDADA' | 'CONTRADICHA' | 'ENGAÑOSA' | 'NO_VERIFICABLE';
  created_at: string;
}

export interface Document {
  id: string;
  titulo: string;
  institucion: string;
  URL_oficial: string;
  texto_extracto: string;
  fecha: string;
}

export interface Question {
  id: string;
  enunciado: string;
  alternativas: string[];
  respuesta_correcta: number; // Índice base 0
  explicacion: string;
}

export interface Lesson {
  id: string;
  titulo: string;
  objetivo: string;
  contenido: string;
  orden: number;
  preguntas: Question[];
}

export type { CivicAskRequest, CivicAskResponse } from './verification';
