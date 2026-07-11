import { NextRequest, NextResponse } from "next/server";
import { repoIndexQueue } from "@/lib/queue";

export async function GET(req: NextRequest) {
  const jobId = req.nextUrl.searchParams.get("jobId");
  if (!jobId) {
    return NextResponse.json({ error: "jobId is required" }, { status: 400 });
  }

  const job = await repoIndexQueue.getJob(jobId);
  if (!job) {
    return NextResponse.json({ error: "Job not found" }, { status: 404 });
  }

  const state = await job.getState(); // "waiting" | "active" | "completed" | "failed" | ...
  const failedReason = job.failedReason ?? null;

  return NextResponse.json({
    id: job.id,
    state,
    result: job.returnvalue ?? null,
    failedReason,
  });
}
