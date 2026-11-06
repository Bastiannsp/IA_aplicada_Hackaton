This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

# Ciudadanía Clara

Ciudadanía Clara es una aplicación web responsive para comprender y verificar información pública de Chile. Permite consultar afirmaciones, revisar evidencia oficial, explorar temas ciudadanos y aprender a reconocer información engañosa.

## Funcionalidades

- Verificación de afirmaciones con fuentes oficiales chilenas.
- Resultados con estado `Respaldada`, `Contradicha`, `Engañosa` o `No verificable`.
- Enlaces directos a las fuentes mediante el botón **Ver fuente**.
- Explorar tendencias sobre elecciones, leyes laborales y economía chilena.
- Reels educativos con fuentes oficiales.
- Lecciones breves sobre evidencia y desinformación.
- Asistente para consultar extractos de documentos públicos.
- Interfaz adaptable a móvil, tablet y escritorio.

## Ejecutar localmente

Requisitos: Node.js y npm.

```bash
npm install
npm run dev
```

La aplicación estará disponible en [http://localhost:3000](http://localhost:3000).

Para validar el proyecto:

```bash
npm run lint
npm run build
```

## API de verificación

La ruta principal es:

```text
POST /api/verify/
```

Recibe una afirmación:

```json
{
	"claim": "La Ley de 40 Horas está vigente en Chile"
}
```

La aplicación usa un catálogo de evidencia oficial revisada. Las fuentes se limitan a dominios institucionales y cada resultado incluye un enlace para consultar la fuente original.

OpenRouter es opcional para ampliar el análisis. Si se configura, las variables deben estar en `.env.local` en la raíz del proyecto:

```env
OPENROUTER_API_KEY=tu_token
OPENROUTER_MODEL=deepseek/deepseek-chat
```

No subir `.env.local` ni tokens al repositorio.

La evidencia de cumplimiento ético y los puntos pendientes para la presentación están documentados en [docs/ETICA.md](docs/ETICA.md).

## Alcance actual

El proyecto está preparado como sitio web responsive. La información de demostración se enfoca en Chile y las fuentes deben mantenerse actualizadas y revisadas antes de usar la aplicación en producción.

El reconocimiento de voz para dictar afirmaciones no se incluye en la pantalla Verificar porque depende de servicios variables del navegador. La lectura por voz de Clara y el dictado del asistente de documentos siguen disponibles cuando el navegador los admite. Para una futura APK se recomienda integrar reconocimiento nativo de Android.

## Despliegue

Puede desplegarse como aplicación Next.js en servicios como Vercel. Las variables de entorno deben configurarse en el panel del servicio y nunca publicarse en Git.
