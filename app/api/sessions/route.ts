import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/get-current-user";
import { listSessionsForUser } from "@/lib/sessions-repo";

/**
 * GET /api/sessions
 * Lists the CURRENT USER's chat sessions only (via Prisma: ChatSession →
 * Repo → userId). Requires an authenticated session cookie.
 */
export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  try {
    const sessions = await listSessionsForUser(user.id);
    return NextResponse.json({ sessions });
  } catch (err) {
    console.error("Failed to list sessions:", err);
    return NextResponse.json({ error: "Failed to load session history" }, { status: 500 });
  }
}
