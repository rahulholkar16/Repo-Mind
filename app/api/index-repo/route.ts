import { indexingQueue } from "@/modules/dashboard/queue/queue";
import { getAuthToken } from "@/lib/get-auth-token";
import { NextRequest, NextResponse } from "next/server";

export async function POST (req: NextRequest) {
    const token = await getAuthToken();
    if (!token) {
        return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { repo_url, force } = await req.json();

    if (!repo_url) return NextResponse.json({ 
        error: "Repo Url missing."
    }, { status: 400 });

    const job = await indexingQueue.add("index-repo", { repo_url, force: !!force, token });

    return NextResponse.json({ jobId: job.id, status: "queued" });
}