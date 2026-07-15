import { IndexRepoResponse } from "./api";

async function pollIndexJob (jobId: string): Promise<IndexRepoResponse> {
    while (true) {
        const res = await fetch (`/api/index-repo/status?jobId=${jobId}`);
        if (!res.ok) throw new Error("Failed to check indexing status");

        const data = await res.json();
        console.log(data.state);
        if (data.state === "completed") {
            return data.result;
        }

        if (data.state === "failed") {
            throw new Error(data.failedReason || "Repository indexing failed");
        }

        await new Promise((r) => setTimeout(r, 3000));
    }
}

export default pollIndexJob;