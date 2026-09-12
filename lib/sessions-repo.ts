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

  const result: SessionMessage[] = [];

  for (const m of session.messages) {
    if (m.role === "user" || m.role === "assistant") {
      result.push({ id: m.id, role: m.role === "user" ? "user" : "agent", content: m.content });
      continue;
    }

    if (m.role !== "tool") continue;

    // toolCalls is untyped JSON from the DB — narrow it defensively.
    const toolCalls = Array.isArray(m.toolCalls) ? m.toolCalls : [];
    const entry = toolCalls[0] as Record<string, unknown> | undefined;
    if (!entry) continue;

    if (entry.name === "propose_pull_request" && entry.pr_proposal) {
      result.push({
        id: m.id,
        role: "agent",
        content: "",
        prProposal: entry.pr_proposal as SessionMessage["prProposal"],
        prStatus: "pending",
      });
      continue;
    }

    if (entry.name === "pr_status") {
      // Resolve the most recent still-pending proposal bubble.
      const pending = [...result].reverse().find((sm) => sm.prProposal && sm.prStatus === "pending");
      if (pending) {
        pending.prStatus = entry.status === "confirmed" ? "confirmed" : "rejected";
        if (entry.status === "confirmed") {
          pending.prResult = { pr_url: entry.pr_url as string | undefined, pr_number: entry.pr_number as number | undefined };
        }
      }
    }
  }

  return result;
}
