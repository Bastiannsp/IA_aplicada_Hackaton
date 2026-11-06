# Backend de verificación

Este directorio contiene los tipos y servicios de verificación. El frontend Next.js
está en la raíz, por lo que el Route Handler accesible vive en
`../app/api/verify/route.ts` y delega en `backend/app/api/verify/route.ts`. La lógica
del backend permanece en este directorio; el MVP no requiere un servidor separado
ni dependencias adicionales.

## Configuración del servidor

Copia las variables de `.env.example` al archivo `.env.local` de la raíz de Next.js.
`OPENROUTER_API_KEY` debe existir solo en el servidor. El modelo configurado por
defecto es `nvidia/nemotron-3-ultra-550b-a55b:free`; se puede cambiar por otro slug
compatible con herramientas de OpenRouter. La integración usa una llamada de
herramienta con esquema validado, ya que esta variante gratuita no admite
`response_format`. Se comunica con OpenRouter mediante `fetch`, sin SDK ni
dependencias nuevas.

## Catálogo de evidencia

`lib/sources/official-source-directory.ts` contiene los enlaces institucionales
marcados como verificados en el expediente del equipo. El directorio es una lista
de fuentes posibles, no evidencia de una afirmación. Las sugerencias del expediente
que se indicaban como pendientes de abrir no se incorporaron.

`lib/sources/catalog.ts` contiene tres extractos iniciales revisados del BCN,
Ministerio del Trabajo e INE. Antes de ampliar el catálogo, agrega registros
revisados con `id`, título, institución, URL HTTPS del documento oficial, extracto
trazable y palabras clave. No agregues enlaces sugeridos por el modelo. Solo los
extractos del catálogo pueden aparecer como evidencia en la respuesta.

La recuperación inicial compara palabras clave entre la afirmación y los metadatos
y extractos del catálogo. No realiza búsquedas web abiertas ni demuestra por sí
sola que una fuente sea pertinente; el catálogo requiere revisión humana. Si no
encuentra coincidencias, la ruta responde `NO_VERIFICABLE` sin consultar al modelo.

## Contrato

`POST /api/verify` recibe `{ "claim": "..." }`. La respuesta exitosa contiene
`claim`, `verdict`, `summary`, `reasoning`, `sources`, `limitations` y
`human_review`. Los estados permitidos son `RESPALDADA`, `CONTRADICHA`,
`ENGANOSA` y `NO_VERIFICABLE`. Una cita solo se devuelve si su `sourceId` coincide
con una fuente recuperada del catálogo; URL, institución y extracto salen del
registro, no del texto generado por el modelo.

Los errores usan `{ "error": { "code": "...", "message": "..." } }` y no
incluyen la clave, trazas ni mensajes internos del proveedor. Las solicitudes no
se persisten y las respuestas exitosas llevan `Cache-Control: no-store`.
