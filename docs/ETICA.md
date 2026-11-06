# Evidencia ética de Ciudadanía Clara

Documento de apoyo para el checklist ético de la Hackathon de IA Aplicada.

## 1. Transparencia

- [x] Inicio muestra que Clara es una asistente de inteligencia artificial.
- [x] La pantalla de resultado distingue las fuentes y extractos oficiales de la síntesis generada por Clara.
- [x] La app muestra el estado de las fuentes y el botón **Ver fuente**.
- [x] El README declara el modelo opcional, las herramientas, los datos de demostración y los límites conocidos.
- [ ] Completar antes de la presentación: registrar qué venía en la plantilla base y qué aportó cada integrante.

## 2. No discriminación

- [x] La app no solicita género, origen, jornada, RUT, dirección ni otros datos personales para verificar.
- [x] El lenguaje visible evita estereotipos y no promete resultados.
- [ ] Ejecutar y registrar dos pruebas con grupos distintos, por ejemplo:
  - Persona mayor con baja alfabetización digital: texto grande, instrucciones simples y lectura por voz.
  - Persona migrante o de zona rural: afirmación en español simple y fuentes oficiales accesibles.
- [ ] Comparar los resultados de esas pruebas y registrar cambios.

## 3. Protección de datos

- [x] La demo usa datos sintéticos o fuentes públicas.
- [x] No solicita RUT, dirección, claves ni datos bancarios.
- [x] Las fuentes oficiales aparecen enlazadas.
- [x] `.env.local` está excluido por `.gitignore`.
- [ ] Revisar antes de la demo que no aparezcan tokens en capturas, presentación o logs.

## 4. Dignidad de la persona

- [x] Clara orienta y no reemplaza el criterio humano.
- [x] La interfaz muestra que el resultado es orientativo.
- [x] La persona puede cancelar una verificación en curso.
- [x] No se entregan diagnósticos, beneficios ni sanciones.

## 5. Supervisión humana

- [x] Los resultados muestran que la decisión final es humana.
- [x] La respuesta incluye `human_review: true`.
- [x] La app no ejecuta acciones con consecuencias sobre una persona.
- [ ] Definir quién revisa un resultado durante la demo y qué decisión toma después.

## 6. Discernimiento comunitario

- [ ] Registrar el checkpoint 1, sus observaciones y cambios.
- [ ] Registrar el checkpoint 2, sus observaciones y cambios.
- [x] Documentar dos posibles malos usos:
  1. Usar Clara para propaganda partidista. Medida: la API rechaza consultas de propaganda, apoyo electoral o personas en cargos públicos.
  2. Presentar un resultado `NO_VERIFICABLE` como si fuera falso. Medida: la interfaz separa evidencia, limitaciones y decisión humana.

## 7. Desafío D3: Democracia

- [x] Las verificaciones con evidencia citan fuentes oficiales y muestran **Ver fuente**.
- [x] La evidencia sale de un catálogo chileno revisado, no de enlaces inventados por el modelo.
- [x] La API valida HTTPS y dominios oficiales antes de devolver una fuente.
- [x] La API rechaza consultas partidistas o sobre personas en cargos públicos.
- [x] La demo usa documentos públicos y datos de demostración.
- [ ] Explicar en la presentación que la versión actual no busca todo internet en tiempo real.

## Límites conocidos

- El catálogo de evidencia debe mantenerse actualizado por el equipo.
- OpenRouter puede tardar o fallar; existe un fallback local para casos conocidos.
- La versión web no incluye dictado en Verificar porque el reconocimiento de voz del navegador no es confiable en todos los entornos.
- La aplicación no reemplaza la revisión humana ni constituye una decisión oficial.
