import { claims } from '@/backend/lib/database/mockData';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
): Promise<Response> {
  const { id } = await params;
  const claim = claims.find((item) => item.id === id);

  if (!claim) {
    return Response.json({ error: 'Afirmación no encontrada' }, { status: 404 });
  }

  return Response.json(claim);
}
