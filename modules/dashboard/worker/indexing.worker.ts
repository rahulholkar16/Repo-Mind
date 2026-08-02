import "dotenv/config";

import { Worker } from "bullmq";
import { redis } from "@/lib/redis";
import { INDEXING_QUEUE_NAME } from "../constant";
import { processIndexing } from "../services/indexing.service";
import type { IndexingJobData } from "@/types";

const worker = new Worker<IndexingJobData>(
    INDEXING_QUEUE_NAME,
    async (job) => {
        return processIndexing(job.data);
    },
    {
        connection: redis,
        concurrency: Number(process.env.INDEXING_WORKER_CONCURRENCY ?? 1),
    },
);

worker.on("completed", (job) => {
    console.log(`Indexing job ${job.id} completed`);
});

worker.on("failed", (job, error) => {
    console.error(`Indexing job ${job?.id ?? "unknown"} failed`, error);
});

const shutdown = async () => {
    await worker.close();
    await redis.quit();
    process.exit(0);
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

console.log(`Indexing worker listening on ${INDEXING_QUEUE_NAME}`);
