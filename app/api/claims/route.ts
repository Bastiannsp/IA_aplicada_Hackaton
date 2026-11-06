import { claims } from '@/backend/lib/database/mockData';

export async function GET(): Promise<Response> {
  return Response.json(claims);
}
