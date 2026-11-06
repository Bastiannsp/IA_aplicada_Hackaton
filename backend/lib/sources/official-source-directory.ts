/**
 * Chilean public-source references marked "Verificado" in the team's research
 * dossier. This is a directory of possible primary sources, not claim evidence.
 * The dossier says these URLs were located; the team must still review and add
 * the exact document excerpt needed for an individual verification.
 */
export interface OfficialSourceReference {
  id: string;
  title: string;
  publisher: string;
  url: string;
  description: string;
}

export const OFFICIAL_SOURCE_DIRECTORY: readonly OfficialSourceReference[] = [
  {
    id: "bcn-leychile",
    title: "LeyChile",
    publisher: "Biblioteca del Congreso Nacional",
    url: "https://www.bcn.cl/leychile",
    description: "Leyes, Constitución, decretos y versiones históricas.",
  },
  {
    id: "bcn-constitucion-242302",
    title: "Constitución Política, texto refundido",
    publisher: "Biblioteca del Congreso Nacional",
    url: "https://www.bcn.cl/leychile/navegar?idNorma=242302",
    description: "Texto constitucional y artículos sobre instituciones y sufragio.",
  },
  {
    id: "bcn-ley-21524",
    title: "Ley 21.524, voto obligatorio",
    publisher: "Biblioteca del Congreso Nacional",
    url: "https://www.bcn.cl/leychile/navegar?i=1187324",
    description: "Reforma constitucional sobre obligatoriedad del sufragio.",
  },
  {
    id: "diario-oficial",
    title: "Diario Oficial",
    publisher: "Diario Oficial de la República de Chile",
    url: "https://www.diariooficial.interior.gob.cl",
    description: "Fechas oficiales de publicación de leyes y decretos.",
  },
  {
    id: "camara",
    title: "Cámara de Diputadas y Diputados",
    publisher: "Cámara de Diputadas y Diputados de Chile",
    url: "https://www.camara.cl",
    description: "Composición, proyectos, votaciones y comisiones.",
  },
  {
    id: "senado",
    title: "Senado",
    publisher: "Senado de la República de Chile",
    url: "https://www.senado.cl",
    description: "Composición, tramitación de proyectos y atribuciones.",
  },
  {
    id: "congreso-opendata",
    title: "Datos Abiertos del Congreso",
    publisher: "Congreso Nacional de Chile",
    url: "https://opendata.congreso.cl",
    description: "Servicios de datos XML de las cámaras y la BCN.",
  },
  {
    id: "ine",
    title: "Instituto Nacional de Estadísticas",
    publisher: "INE",
    url: "https://www.ine.gob.cl",
    description: "Censo, proyecciones de población y estadísticas oficiales.",
  },
  {
    id: "censo-2024",
    title: "Censo 2024",
    publisher: "Instituto Nacional de Estadísticas",
    url: "https://www.censo2024.cl",
    description: "Resultados censales por región y comuna y metodología.",
  },
  {
    id: "servel",
    title: "Servicio Electoral",
    publisher: "SERVEL",
    url: "https://www.servel.cl",
    description: "Resultados electorales, padrón, procesos y estadísticas.",
  },
  {
    id: "servel-resultados",
    title: "Resultados electorales",
    publisher: "SERVEL",
    url: "https://elecciones.servel.cl",
    description: "Portal de resultados electorales.",
  },
  {
    id: "mintrab-40-horas",
    title: "Implementación de la Ley 40 Horas",
    publisher: "Ministerio del Trabajo y Previsión Social",
    url: "https://www.mintrab.gob.cl/40horas/implementacion/",
    description: "Orientación oficial sobre gradualidad y calendario de implementación.",
  },
  {
    id: "direccion-del-trabajo",
    title: "Dirección del Trabajo",
    publisher: "Dirección del Trabajo",
    url: "https://www.dt.gob.cl",
    description: "Dictámenes e interpretación administrativa de normas laborales.",
  },
  {
    id: "dipres",
    title: "Dirección de Presupuestos",
    publisher: "Ministerio de Hacienda",
    url: "https://www.dipres.gob.cl",
    description: "Ley de Presupuestos, ejecución presupuestaria y gasto público.",
  },
  {
    id: "sinim",
    title: "Sistema Nacional de Información Municipal",
    publisher: "SUBDERE",
    url: "https://www.sinim.gov.cl",
    description: "Presupuestos, ingresos, gastos e información comunal.",
  },
  {
    id: "sinim-datos",
    title: "Datos SINIM",
    publisher: "SUBDERE",
    url: "https://datos.sinim.gov.cl",
    description: "Descarga de datos municipales.",
  },
  {
    id: "datos-gob",
    title: "Datos.gob.cl",
    publisher: "Gobierno de Chile",
    url: "https://datos.gob.cl",
    description: "Catálogo central de datos abiertos de organismos públicos.",
  },
  {
    id: "consejo-transparencia",
    title: "Consejo para la Transparencia",
    publisher: "Consejo para la Transparencia",
    url: "https://www.consejotransparencia.cl",
    description: "Acceso a información pública, transparencia activa y fiscalización.",
  },
  {
    id: "contraloria",
    title: "Contraloría General de la República",
    publisher: "Contraloría General de la República",
    url: "https://www.contraloria.cl",
    description: "Dictámenes e informes de auditoría.",
  },
];
