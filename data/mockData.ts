import type { CaseItem, CivicDocument, Lesson, Reel, VerificationResult } from '@/types';

/* ⚠️ DATOS SINTÉTICOS DE DEMOSTRACIÓN. Funciona 100% offline.
   Antes de producción, reemplazar por consultas a fuentes reales (BCN, Dirección del Trabajo, etc.). */

export const verifications: VerificationResult[] = [
  {
    id: 'jornada-40h',
    claim: 'La jornada laboral de 40 horas ya rige para todos los trabajadores desde 2024.',
    keywords: ['40 horas', 'jornada', 'semana laboral', 'horas'],
    verdict: 'ENGAÑOSA',
    explanation: [
      'La Ley 40 Horas existe, pero reduce la jornada de forma gradual.',
      'En 2024 la jornada bajó a 44 horas, no a 40.',
      'Las 40 horas se alcanzan recién en 2028, según el calendario de la ley.',
    ],
    sources: [
      { id: 's1', headline: 'Ley 40 Horas: gradualidad de la reducción', institution: 'Dirección del Trabajo', excerpt: 'La jornada ordinaria se reduce de manera progresiva hasta alcanzar las 40 horas semanales.', url: 'https://www.dt.gob.cl', relation: 'En contra' },
      { id: 's2', headline: 'Texto de la ley sobre jornada de trabajo', institution: 'Biblioteca del Congreso Nacional', excerpt: 'Establece una disminución escalonada de la jornada máxima en distintos plazos.', url: 'https://www.bcn.cl/leychile', relation: 'Contexto' },
    ],
    limitations: [
      'No evalúa jornadas especiales ni convenios colectivos particulares.',
      'Las fechas exactas deben confirmarse en el texto vigente de la ley.',
    ],
  },
  {
    id: 'pgu',
    claim: 'La Pensión Garantizada Universal solo la reciben quienes nunca cotizaron.',
    keywords: ['pgu', 'pensión garantizada', 'pension garantizada', 'cotizaron', 'pensión'],
    verdict: 'CONTRADICHA',
    explanation: [
      'La PGU no exige haber estado sin cotizar.',
      'También pueden recibirla personas que sí tienen pensión, si cumplen los requisitos.',
      'Los requisitos dependen de la edad y de la situación socioeconómica del hogar.',
    ],
    sources: [
      { id: 's3', headline: 'Pensión Garantizada Universal: requisitos', institution: 'ChileAtiende', excerpt: 'Beneficio para personas mayores que cumplen requisitos de edad, residencia y focalización.', url: 'https://www.chileatiende.gob.cl', relation: 'En contra' },
      { id: 's4', headline: 'Ley que crea la PGU', institution: 'Biblioteca del Congreso Nacional', excerpt: 'Regula el beneficio sin exigir la ausencia total de cotizaciones.', url: 'https://www.bcn.cl/leychile', relation: 'En contra' },
    ],
    limitations: [
      'No calcula el monto exacto para un caso personal.',
      'Los montos se reajustan; revisa el valor vigente en la fuente oficial.',
    ],
  },
  {
    id: 'presupuesto-municipal',
    claim: 'El municipio destinará la mitad de su presupuesto 2026 a seguridad.',
    keywords: ['presupuesto', 'municipal', 'municipio', 'seguridad', 'mitad'],
    verdict: 'NO_VERIFICABLE',
    explanation: [
      'No encontramos un documento oficial que indique ese porcentaje.',
      'El presupuesto de demostración distribuye montos por programa, sin una cifra global para seguridad.',
      'Sin la fuente original, no es posible confirmar ni desmentir.',
    ],
    sources: [
      { id: 's5', headline: 'Presupuesto Municipal 2026 (demo)', institution: 'Municipalidad (documento de demostración)', excerpt: 'El documento detalla programas por área, sin un porcentaje total para seguridad.', url: 'https://www.subdere.gov.cl', relation: 'Contexto' },
    ],
    limitations: [
      'Solo se revisó el documento de demostración cargado.',
      'Puede existir información en actas o modificaciones presupuestarias no incluidas.',
    ],
  },
];

const NO_EVIDENCE: VerificationResult = {
  id: 'sin-evidencia',
  claim: '',
  keywords: [],
  verdict: 'NO_VERIFICABLE',
  explanation: [
    'No encontramos evidencia oficial para esta afirmación en la base de demostración.',
    'Eso no significa que sea verdadera ni falsa.',
    'Te recomendamos revisar fuentes institucionales directamente.',
  ],
  sources: [],
  limitations: ['Esta demo solo contiene 3 casos precargados.', 'La IA no puede verificar hechos sin fuentes oficiales.'],
};

export function findVerification(claim: string): VerificationResult {
  const q = claim.toLowerCase();
  const scored = verifications
    .map((v) => ({ v, score: v.keywords.filter((k) => q.includes(k)).length }))
    .sort((a, b) => b.score - a.score);
  const best = scored[0];
  if (best && best.score > 0) return { ...best.v, claim: claim.trim() || best.v.claim };
  return { ...NO_EVIDENCE, claim: claim.trim() };
}

export const reels: Reel[] = [
  { id: 'r1', category: 'Trabajo', verdict: 'ENGAÑOSA', emoji: '⏱️', gradient: 'from-[#0B3D91] to-[#14213D]',
    headline: 'Las 40 horas llegan en etapas, no de golpe',
    summary: 'La reducción de jornada es gradual: 44 horas en 2024 y 40 horas recién en 2028.',
    sourceLabel: 'Dirección del Trabajo', sourceUrl: 'https://www.dt.gob.cl' },
  { id: 'r2', category: 'Pensiones', verdict: 'CONTRADICHA', emoji: '👵', gradient: 'from-[#7A1022] to-[#14213D]',
    headline: 'La PGU no es solo para quienes no cotizaron',
    summary: 'Personas con pensión también pueden recibirla si cumplen los requisitos de la ley.',
    sourceLabel: 'ChileAtiende', sourceUrl: 'https://www.chileatiende.gob.cl' },
  { id: 'r3', category: 'Municipal', verdict: 'NO_VERIFICABLE', emoji: '🏛️', gradient: 'from-[#2F4858] to-[#14213D]',
    headline: '¿Mitad del presupuesto en seguridad? No hay datos',
    summary: 'El documento oficial de demostración no confirma ese porcentaje. Pide la fuente original.',
    sourceLabel: 'Presupuesto Municipal (demo)', sourceUrl: 'https://www.subdere.gov.cl' },
];

export const cases: CaseItem[] = [
  { id: 'c1', title: 'Ley 40 Horas', type: 'Proyecto de Ley', headline: 'Ya trabajamos 40 horas en todo Chile desde 2024.', resultId: 'jornada-40h' },
  { id: 'c2', title: 'Pensión Garantizada Universal', type: 'Noticia', headline: 'La PGU solo es para quienes nunca cotizaron.', resultId: 'pgu' },
  { id: 'c3', title: 'Presupuesto municipal 2026', type: 'Presupuesto Municipal', headline: 'La mitad del presupuesto irá a seguridad.', resultId: 'presupuesto-municipal' },
];

export const lessons: Lesson[] = [
  { id: 'l1', title: 'Cómo detectar un titular engañoso',
    body: 'Un titular engañoso suele exagerar, omitir fechas o mezclar hechos con opiniones. Antes de compartir, lee la noticia completa, revisa la fecha y busca quién lo afirma.',
    quiz: { question: '¿Qué es lo primero que conviene hacer ante un titular que te indigna?', options: ['Compartirlo rápido', 'Leer la noticia completa y revisar la fecha', 'Comentar sin leer', 'Confiar si tiene muchos likes'], correctIndex: 1, feedback: 'Los titulares buscan emoción. El contexto completo y la fecha cambian el sentido.' } },
  { id: 'l2', title: 'Identificar fuentes oficiales',
    body: 'Una fuente oficial pertenece a una institución pública: ministerios, la Biblioteca del Congreso, municipalidades. Revisa que la dirección web termine en .cl o .gob.cl y que cite el documento original.',
    quiz: { question: '¿Cuál es una fuente oficial?', options: ['Una cadena de WhatsApp', 'Un sitio .gob.cl de un ministerio', 'Una captura sin fecha', 'Un video anónimo'], correctIndex: 1, feedback: 'Los sitios gob.cl pertenecen a instituciones del Estado y publican documentos verificables.' } },
  { id: 'l3', title: 'Leer una ley sin perderse',
    body: 'Las leyes se ordenan en artículos. Busca primero el título, luego el artículo que responde tu duda y fíjate en artículos transitorios: ahí suelen estar los plazos.',
    quiz: { question: '¿Dónde suelen estar los plazos de entrada en vigencia?', options: ['En el título', 'En los artículos transitorios', 'En la firma', 'No existen'], correctIndex: 1, feedback: 'Los artículos transitorios regulan plazos y gradualidad, como en la Ley 40 Horas.' } },
];

export const documents: CivicDocument[] = [
  { id: 'd1', title: 'Ley de Presupuesto Municipal 2026 (demo)', institution: 'Municipalidad (texto de demostración)',
    qa: [
      { keywords: ['seguridad', 'cámaras', 'patrulla'], answer: 'Se destinan fondos a seguridad ciudadana, pero el documento no indica que sea la mitad del presupuesto.', citation: { ref: 'Art. 4°, p. 3', quote: 'Se asignan recursos al programa de seguridad ciudadana conforme al detalle del anexo I.' } },
      { keywords: ['áreas verdes', 'plaza', 'parque'], answer: 'Hay una partida para mantención de áreas verdes y plazas.', citation: { ref: 'Art. 6°, p. 4', quote: 'Se financiará la mantención de áreas verdes y espacios públicos comunales.' } },
      { keywords: ['aprobar', 'concejo', 'quién'], answer: 'El presupuesto debe ser aprobado por el Concejo Municipal.', citation: { ref: 'Art. 1°, p. 1', quote: 'El presente presupuesto será sometido a la aprobación del Concejo Municipal.' } },
    ] },
  { id: 'd2', title: 'Proyecto de Ley X – Jornada laboral (demo)', institution: 'Congreso Nacional (texto de demostración)',
    qa: [
      { keywords: ['40', 'horas', 'cuándo', 'plazo'], answer: 'La jornada baja por etapas y llega a 40 horas en 2028.', citation: { ref: 'Art. 1° transitorio, p. 7', quote: 'La reducción de jornada se aplicará de forma gradual en los plazos que se indican.' } },
      { keywords: ['sueldo', 'salario', 'rebaja'], answer: 'El texto indica que la reducción de jornada no puede significar una rebaja de remuneraciones.', citation: { ref: 'Art. 2°, p. 2', quote: 'La disminución de la jornada no afectará las remuneraciones pactadas.' } },
    ] },
];
