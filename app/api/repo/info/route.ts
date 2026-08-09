import { getAuthToken } from "@/lib/get-auth-token";

const AI_SERVICE_URL = process.env.AI_SERVICE_URL || "http://0.0.0.0:8000";

export async function POST(req: Request) {
  const token = await getAuthToken();
  if (!token) {
    return new Response(JSON.stringify({ detail: "Not authenticated" }), { status: 401 });
  }

  const body = await req.text();

  const upstream = await fetch(`${AI_SERVICE_URL}/api/repo/info`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body,
  });

  const data = await upstream.text();
  return new Response(data, {
    status: upstream.status,
    headers: { "Content-Type": "application/json" },
  });
}
