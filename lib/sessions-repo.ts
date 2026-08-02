import { db } from "./prisma";
import type { SessionSummary, SessionMessage } from "@/types";

export async function listSessionsForUser(userId: string): Promise<SessionSummary[]> {
  const sessions = await db.chatSession.findMany({
    where: { repo: { userId } },
    include: { repo: true },
    orderBy: { updatedAt: "desc" },
  });

  return sessions.map((s) => ({
    id: s.threadId,
    repoName: `${s.repo.owner}/${s.repo.name}`,
    title: s.title,
    timestamp: s.updatedAt.toISOString(),
  }));
}

export async function renameSessionForUser(
  userId: string,
  threadId: string,
  title: string
): Promise<boolean> {
  const result = await db.chatSession.updateMany({
    where: { threadId, repo: { userId } },
    data: { title },
  });
  return result.count > 0;
}

export async function getThreadMessagesForUser(
  userId: string,
  threadId: string
): Promise<SessionMessage[]> {
  const session = await db.chatSession.findFirst({
    where: { threadId, repo: { userId } },
    include: { messages: { orderBy: { createdAt: "asc" } } },
  });

  if (!session) return [];

  return session.messages
    .filter((m) => m.role === "user" || m.role === "assistant")
    .map((m) => ({
      id: m.id,
      role: m.role === "user" ? "user" : "agent",
      content: m.content,
    }));
}
