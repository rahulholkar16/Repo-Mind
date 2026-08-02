import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/get-current-user";
import { db } from "@/lib/prisma";

/**
 * POST /api/repos
 * Called right after a repo is successfully connected/indexed on the
 * client. Upserts a Repo row for the current user (one user can now
 * connect many repos — githubId is only unique per-user, not globally) and
 * creates the first ChatSession for it.
 */
export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const body = await req.json();
  const { repoUrl, owner, name, language, stars, description, githubId, isPrivate, defaultBranch } = body;

  if (!repoUrl || !owner || !name) {
    return NextResponse.json({ error: "repoUrl, owner and name are required." }, { status: 400 });
  }

  // The ai-services /api/repo/info endpoint doesn't currently return
  // GitHub's numeric repo id, so we fall back to "owner/name" — still
  // unique per user, which is all @@unique([userId, githubId]) needs.
  const resolvedGithubId: string = githubId || `${owner}/${name}`;

  try {
    const repo = await db.repo.upsert({
      where: { userId_githubId: { userId: user.id, githubId: resolvedGithubId } },
      update: {
        repoUrl,
        owner,
        name,
        languages: language ? [language] : [],
        stars: stars ?? 0,
        description: description ?? null,
        isPrivate: isPrivate ?? false,
        defaultBranch: defaultBranch ?? "main",
        lastUsedAt: new Date(),
      },
      create: {
        userId: user.id,
        repoUrl,
        owner,
        name,
        languages: language ? [language] : [],
        stars: stars ?? 0,
        description: description ?? null,
        githubId: resolvedGithubId,
        isPrivate: isPrivate ?? false,
        defaultBranch: defaultBranch ?? "main",
      },
    });

    const chatSession = await db.chatSession.create({
      data: { repoId: repo.id, title: "New conversation" },
    });

    return NextResponse.json({
      repo: { id: repo.id, owner: repo.owner, name: repo.name },
      session: { id: chatSession.id, threadId: chatSession.threadId, title: chatSession.title },
    });
  } catch (err) {
    console.error("Failed to connect repo:", err);
    return NextResponse.json({ error: "Failed to save repo" }, { status: 500 });
  }
}
