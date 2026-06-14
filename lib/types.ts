export interface RepoInfo {
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

export interface Session {
  id: string;
  repoName: string;
  title: string;
  timestamp: string;
}

export interface ToolCall {
  name: string;
  args?: string;
}

export interface Message {
  id: string;
  role: "user" | "agent";
  content: string;
  timestamp: string;
  toolCalls?: ToolCall[];
  codeBlock?: { language: string; code: string };
}
