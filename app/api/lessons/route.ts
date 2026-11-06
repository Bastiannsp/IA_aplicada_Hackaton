import { lessons } from '@/backend/lib/database/mockData';

export async function GET(): Promise<Response> {
  const lessonsSummary = lessons.map(({ id, titulo, objetivo, orden }) => ({
    id,
    titulo,
    objetivo,
    orden,
  }));

  return Response.json(lessonsSummary);
}
