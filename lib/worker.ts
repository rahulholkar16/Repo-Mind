import { Worker } from "bullmq";
import { redis } from "./redis.js";
import { indexRepository } from "./api.js";

const worker = new Worker(
    'indexing-queue', 
    async (job) => {
        const { repo_url } = job.data;
        console.log(`Indexing started for: ${repo_url}`);
        const result = await indexRepository(repo_url);
        console.log(`Indexing done for: ${repo_url}`);
        return result;
    },
    {
        connection: redis,
        concurrency: 1,
    }  
)

worker.on(
    "completed",
    (job) => {
        console.log(
            `Stats job ${job.id} completed`
        );
    }
);

worker.on(
    "failed",
    (job, error) => {
        console.error(
            `Stats job ${job?.id ?? "unknown"
            } failed`,
            error
        );
    }
);

console.log(
    "Stats Worker Started 🚀"
);

const shutdown = async () => {
    await worker.close();
    await redis.quit();

    process.exit(0);
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);