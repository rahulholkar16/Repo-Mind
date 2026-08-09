import { getAuthToken } from "@/lib/get-auth-token";

const AI_SERVICE_URL = process.env.AI_SERVICE_URL || "http://0.0.0.0:8000";

export async function POST(req: Request) {
  const token = await getAuthToken();
  if (!token) {
    return new Response(JSON.stringify({ detail: "Not authenticated" }), { status: 401 });
  }

  const body = await req.text();

  const upstream = await fetch(`${AI_SERVICE_URL}/agent/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "text/event-stream",
      "Authorization": `Bearer ${token}`,
    },
    body,
  });

  return new Response(upstream.body, {
    status: upstream.status,
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      "X-Accel-Buffering": "no",
    },
  });
}
