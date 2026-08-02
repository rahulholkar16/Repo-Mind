import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/get-current-user";
import { getThreadMessagesForUser } from "@/lib/sessions-repo";

/**
 * GET /api/sessions/messages?threadId=...
 * Returns the full chat history for one session — only if that session's
 * repo belongs to the requesting user.
 */
export async function GET(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const threadId = req.nextUrl.searchParams.get("threadId");
  if (!threadId) {
    return NextResponse.json({ error: "threadId is missing." }, { status: 400 });
  }

  try {
    const messages = await getThreadMessagesForUser(user.id, threadId);
    return NextResponse.json({ messages });
  } catch (err) {
    console.error("Failed to load session messages:", err);
    return NextResponse.json({ error: "Failed to load session messages" }, { status: 500 });
  }
}
