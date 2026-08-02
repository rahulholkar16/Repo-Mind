import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/get-current-user";
import { db } from "@/lib/prisma";

/**
 * POST /api/sessions/new
 * Creates a new ChatSession under an existing (already-connected) repo —
 * this is what backs the "New Chat" button.
 */
export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { repoId } = await req.json();
  if (!repoId) {
    return NextResponse.json({ error: "repoId is required." }, { status: 400 });
  }

  // Ownership check — a repoId belonging to someone else must 404, not 200.
  const repo = await db.repo.findFirst({ where: { id: repoId, userId: user.id } });
  if (!repo) {
    return NextResponse.json({ error: "Repo not found." }, { status: 404 });
  }

  const chatSession = await db.chatSession.create({
    data: { repoId: repo.id, title: "New conversation" },
  });

  return NextResponse.json({
    session: { id: chatSession.id, threadId: chatSession.threadId, title: chatSession.title },
  });
}
