import { NextRequest, NextResponse } from "next/server";
import { repoIndexQueue } from "@/lib/queue";

export async function POST(req: NextRequest) {
  const { repo_url } = await req.json();

  if (!repo_url) {
    return NextResponse.json({ error: "repo_url is required" }, { status: 400 });
  }

  const job = await repoIndexQueue.add(
    "index-repo",
    { repo_url },
    {
      attempts: 3,
      backoff: { type: "exponential", delay: 5000 },
      removeOnComplete: true,
      removeOnFail: false,
    }
  );

  return NextResponse.json({ jobId: job.id, status: "queued" });
}
