import { indexRepository } from "@/lib/api";
import type { IndexRepoResponse, IndexingJobData } from "@/types";

export const processIndexing = async (
    data: IndexingJobData,
): Promise<IndexRepoResponse> => {
    console.log(`Indexing started for: ${data.repo_url}`);
    const result = await indexRepository(data.repo_url);
    console.log(`Indexing done for: ${data.repo_url}`);
    return result;
};
