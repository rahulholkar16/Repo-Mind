import { indexRepository } from "@/lib/api";
import type { IndexRepoResponse } from "@/lib/api";

export interface IndexingJobData {
    repo_url: string;
}

export const processIndexing = async (
    data: IndexingJobData,
): Promise<IndexRepoResponse> => {
    console.log(`Indexing started for: ${data.repo_url}`);
    const result = await indexRepository(data.repo_url);
    console.log(`Indexing done for: ${data.repo_url}`);
    return result;
};
