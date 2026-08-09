import { indexRepository } from "@/lib/api";
import type { IndexRepoResponse, IndexingJobData } from "@/types";

export const processIndexing = async (
    data: IndexingJobData,
): Promise<IndexRepoResponse> => {
    console.log(`Indexing started for: ${data.repo_url}${data.force ? " (force re-index)" : ""}`);
    const result = await indexRepository(data.repo_url, data.token, data.force ?? false);
    console.log(`Indexing done for: ${data.repo_url}`);
    return result;
};
