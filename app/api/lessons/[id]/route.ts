import { lessons } from '@/backend/lib/database/mockData';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
): Promise<Response> {
  const { id } = await params;
  const lesson = lessons.find((item) => item.id === id);

  if (!lesson) {
    return Response.json({ error: 'Lección no encontrada' }, { status: 404 });
  }

  return Response.json(lesson);
}
