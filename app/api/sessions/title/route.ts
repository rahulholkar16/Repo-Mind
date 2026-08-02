import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/get-current-user";
import { renameSessionForUser } from "@/lib/sessions-repo";

/**
 * PATCH /api/sessions/title
 * Renames a session — used to auto-title a chat from its first message,
 * the same way ChatGPT/Claude do it.
 */
export async function PATCH(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { threadId, title } = await req.json();
  if (!threadId || !title) {
    return NextResponse.json({ error: "threadId and title are required." }, { status: 400 });
  }

  const trimmedTitle = String(title).trim().slice(0, 80);
  if (!trimmedTitle) {
    return NextResponse.json({ error: "title cannot be empty." }, { status: 400 });
  }

  try {
    const updated = await renameSessionForUser(user.id, threadId, trimmedTitle);
    if (!updated) {
      return NextResponse.json({ error: "Session not found." }, { status: 404 });
    }
    return NextResponse.json({ title: trimmedTitle });
  } catch (err) {
    console.error("Failed to rename session:", err);
    return NextResponse.json({ error: "Failed to rename session" }, { status: 500 });
  }
}
