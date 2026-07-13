import { indexingQueue } from "@/lib/queue";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const jobId = req.nextUrl.searchParams.get("jobId");

    if (!jobId) return NextResponse.json({
        error: "jobId is missing."
    }, { status: 400 });

    const job = await indexingQueue.getJob(jobId);
    if (!job) return NextResponse.json({ error: "Job not found" }, { status: 404 });

    const state = job.getState();

    return NextResponse.json({
        state,
        result: job.returnvalue ?? null,
        failedReason: job.failedReason ?? null,
    });
}