import { indexingQueue } from "@/lib/queue";
import { NextRequest, NextResponse } from "next/server";

export async function POST (req: NextRequest) {
    const { repo_url } = await req.json();

    if (!repo_url) return NextResponse.json({ 
        error: "Repo Url missing."
    }, { status: 400 });

    const job = await indexingQueue.add("index-repo", { repo_url });

    return NextResponse.json({ jobId: job.id, status: "queued" });
}