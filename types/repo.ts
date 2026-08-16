export interface FileNode {
  name: string;
  type: "dir" | "file";
  ext?: string;
  children?: FileNode[];
}

export interface RepoInfo {
  id?: string;
  owner: string;
  name: string;
  language: string;
  stars: number;
  description: string;
  indexedChunks?: number;
  techStack?: {
    frontend?: string;
    backend?: string;
    database?: string;
    orm?: string;
    authentication?: string;
    state_management?: string;
    styling?: string;
    deployment?: string;
  };
  architecture?: {
    project_overview: string;
    architecture: string;
    modules: string[];
    data_flow: string;
    authentication_flow: string;
    database_flow: string;
    api_flow: string;
  };
  fileTree?: any;
}

export interface RepoRequest {
  repo_url: string;
}

export interface RepoInfoResponse {
  owner: string;
  name: string;
  language: string;
  stars: number;
  description: string;
  default_branch: string;
}

export interface RepoTreeResponse {
  repo_full_name: string;
  tree: FileNode[];
}

export interface IndexRepoResponse {
  message: string;
  repo_full_name: string;
  total_chunks: number;
}

export interface ConnectRepoResponse {
  repo: { id: string; owner: string; name: string };
  session: { id: string; threadId: string; title: string };
}

export interface RepoBranch {
  name: string;
  isDefault: boolean;
}

export interface RepoBranchesResponse {
  branches: RepoBranch[];
  defaultBranch: string;
  repoInfo: RepoInfoResponse;
}
