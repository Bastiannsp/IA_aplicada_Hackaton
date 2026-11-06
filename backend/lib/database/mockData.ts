import type { Claim, Document, Lesson } from '../../types';

export const claims: Claim[] = [
  {
    id: "claim-1",
    texto: "El Censo 2024 contó 18.480.432 personas en Chile.",
    tema: "Demografía",
    contexto: "Primeros resultados del Censo 2024 (INE).",
    estado_demo: "RESPALDADA",
    created_at: "2026-11-06T12:00:00Z"
  },
  {
    id: "claim-2",
    texto: "En Chile el voto es voluntario.",
    tema: "Elecciones",
    contexto: "Reforma constitucional Ley 21.524.",
    estado_demo: "CONTRADICHA",
    created_at: "2026-11-06T12:00:00Z"
  },
  {
    id: "claim-3",
    texto: "¡YA ES LEY! Desde 2024 Chile trabaja 40 horas. Si tu jefe te pide más, denuncia.",
    tema: "Laboral",
    contexto: "Gradualidad de la Ley 21.561.",
    estado_demo: "ENGAÑOSA",
    created_at: "2026-11-06T12:00:00Z"
  },
  {
    id: "claim-4",
    texto: "El Congreso tiene 155 diputados y 50 senadores.",
    tema: "Instituciones",
    contexto: "Composición del Congreso tras la Ley 20.840.",
    estado_demo: "RESPALDADA",
    created_at: "2026-11-06T12:00:00Z"
  },
  {
    id: "claim-5",
    texto: "Los jóvenes chilenos ya no creen en la democracia.",
    tema: "Opinión Pública",
    contexto: "Afirmación vaga sin métrica ni año delimitado.",
    estado_demo: "NO_VERIFICABLE",
    created_at: "2026-11-06T12:00:00Z"
  }
];

export const documents: Document[] = [
  {
    id: "doc-1",
    titulo: "Ley 21.524 - Restablece el voto obligatorio",
    institucion: "Biblioteca del Congreso Nacional (BCN)",
    URL_oficial: "https://www.bcn.cl/leychile/navegar?i=1187324",
    texto_extracto: "Sustitúyese en el artículo 15 de la Constitución Política de la República la expresión 'secreto y voluntario' por 'y secreto'. El sufragio será obligatorio para los electores en todas las elecciones y plebiscitos, salvo en las elecciones primarias.",
    fecha: "2023-01-04"
  },
  {
    id: "doc-2",
    titulo: "Ley 21.561 - Reducción de la jornada laboral a 40 horas",
    institucion: "Ministerio del Trabajo y Previsión Social",
    URL_oficial: "https://www.mintrab.gob.cl/40horas-implementacion/",
    texto_extracto: "Modifícase la jornada de trabajo ordinaria de 45 a 40 horas semanales. Su implementación es gradual: 44 horas al primer año (2024), 42 horas al tercer año (2026) y 40 horas al quinto año (2028).",
    fecha: "2023-04-26"
  },
  {
    id: "doc-3",
    titulo: "Resultados Oficiales Censo de Población y Vivienda 2024",
    institucion: "Instituto Nacional de Estadísticas (INE)",
    URL_oficial: "https://www.ine.gob.cl/sala-de-prensa/prensa/general/noticia/2025/03/27/primeros-resultados-del-censo-2024-18.480.432-personas-fueron-censadas-en-chile-manteni%C3%A9ndose-la-tendencia-de-envejecimiento-de-la-poblaci%C3%B3n",
    texto_extracto: "Entre marzo y julio de 2024 se censaron 18.480.432 personas en el territorio nacional. El 51,5% corresponde a mujeres y el 48,5% a hombres.",
    fecha: "2025-03-27"
  }
];

export const lessons: Lesson[] = [
  {
    id: "lesson-1",
    titulo: "Jerarquía de Fuentes y Evidencia",
    objetivo: "Aprender a distinguir entre fuentes primarias oficiales y fuentes secundarias de información.",
    contenido: "Las fuentes primarias son publicaciones oficiales emittedas por organismos del Estado (ej. LeyChile, Diario Oficial, INE). Las fuentes secundarias o de prensa sirven para localizar la fuente original, pero no constituyen prueba definitiva por sí solas.",
    orden: 1,
    preguntas: [
      {
        id: "q1",
        enunciado: "¿Cuál de las siguientes es una fuente primaria oficial para verificar una norma legal en Chile?",
        alternativas: [
          "Un hilo de discusión en redes sociales",
          "Un reportaje de televisión",
          "La base de datos de LeyChile (Biblioteca del Congreso Nacional)",
          "Una entrada editada en Wikipedia"
        ],
        respuesta_correcta: 2,
        explicacion: "LeyChile es el portal oficial de la Biblioteca del Congreso Nacional que contiene el texto actualizado y refundido de las leyes promulgadas en el país."
      }
    ]
  },
  {
    id: "lesson-2",
    titulo: "Diferencia entre Afirmación Engañosa y Contradicha",
    objetivo: "Reconocer cuándo una afirmación es falsa vs. cuándo omite datos decisivos de contexto.",
    contenido: "Una afirmación CONTRADICHA choca directamente con un hecho oficial. Una afirmación ENGAÑOSA puede incluir datos ciertos, pero omite gradualidades, fechas de vigencia o metodologías, llevando a conclusiones equivocadas.",
    orden: 2,
    preguntas: [
      {
        id: "q2",
        enunciado: "Si una noticia dice '¡Ya se trabajan 40 horas!', ¿por qué se clasifica como ENGAÑOSA?",
        alternativas: [
          "Porque la ley nunca existió",
          "Porque omite que la ley se aplica de forma gradual hasta el 2028",
          "Porque solo aplica a empleadores públicos",
          "Porque el Censo 2024 la derogó"
        ],
        respuesta_correcta: 1,
        explicacion: "Es engañosa porque omite la gradualidad de la ley (44h en 2024, 42h en 2026 y 40h en 2028)."
      }
    ]
  }
];
