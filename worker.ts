import { Worker } from "bullmq";
import { redisConnection } from "./lib/redis";
import { indexRepository } from "./lib/api";
import type { RepoIndexJobData, RepoIndexJobResult } from "./lib/queue";

const worker = new Worker<RepoIndexJobData, RepoIndexJobResult>(
  "repo-index-queue",
  async (job) => {
    const { repo_url } = job.data;
    console.log(`[worker] indexing ${repo_url} (job ${job.id})`);
    const result = await indexRepository(repo_url);
    return result;
  },
  { connection: redisConnection }
);

worker.on("completed", (job) => {
  console.log(`[worker] ✅ job ${job.id} completed`, job.returnvalue);
});

worker.on("failed", (job, err) => {
  console.error(`[worker] ❌ job ${job?.id} failed:`, err.message);
});

console.log("Repo index worker started, listening on 'repo-index-queue'...");
