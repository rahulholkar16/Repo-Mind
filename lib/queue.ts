import { Queue } from "bullmq";
import { redisConnection } from "./redis";

export const repoIndexQueue = new Queue("repo-index-queue", {
  connection: redisConnection,
});

export interface RepoIndexJobData {
  repo_url: string;
}

export interface RepoIndexJobResult {
  message: string;
  repo_full_name: string;
  total_chunks: number;
}
