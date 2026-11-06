import { POST as verifyPost } from "@/backend/app/api/verify/route";

// Next.js discovers Route Handlers only inside the root app/ directory.
export const runtime = "nodejs";

export async function POST(request: Request): Promise<Response> {
  return verifyPost(request);
}
