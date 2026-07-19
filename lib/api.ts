import type { ToolCall } from "./types";

// const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://ai-services-1zfs.onrender.com";
const API_BASE = "http://0.0.0.0:8000";
const WORKER_API_URL = "http://host.docker.internal:8000"
// V2 backend reads directly from the GitHub API — there is no clone step.
// repo_full_name ("owner/repo") is derived on the backend from the URL,
// so the frontend only ever needs to send the plain GitHub URL.

export interface RepoRequest {
  repo_url: string;
}

export interface AgentRequest {
  repo_url: string;
  question: string;
  thread_id: string;
  repo_id: string;
}

export interface RepoInfoResponse {
  owner: string;
  name: string;
  language: string;
  stars: number;
  description: string;
}

export interface FileNode {
  name: string;
  type: "dir" | "file";
  ext?: string;
  children?: FileNode[];
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

export interface AgentChatResponse {
  answer: string;
  codeBlock?: { language: string; code: string };
  toolCalls?: ToolCall[];
  thread_id: string;
}

async function handle<T>(res: Response, errorMessage: string): Promise<T> {
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(body?.detail || errorMessage);
  }
  return res.json();
}

/**
 * Fetch basic repo metadata (owner, name, language, stars, description).
 * Call this right after the user pastes a GitHub URL.
 */
export async function getRepoInfo(repoUrl: string): Promise<RepoInfoResponse> {
  const res = await fetch(`${API_BASE}/api/repo/info`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ repo_url: repoUrl }),
  });
  return handle(res, "Failed to fetch repository info");
}

/**
 * Index a GitHub repository into Pinecone for semantic search.
 * Call this once per repo before chatting (agent tools rely on it).
 */
export async function indexRepository(repoUrl: string): Promise<IndexRepoResponse> {
  const res = await fetch(`${WORKER_API_URL}/api/repo/index`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ repo_url: repoUrl }),
  });
  return handle(res, "Failed to index repository");
}

/**
 * Get the file/folder tree of a repo (for the file-tree side panel).
 */
export async function getRepositoryTree(repoUrl: string): Promise<RepoTreeResponse> {
  const res = await fetch(`${API_BASE}/api/repo/tree`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ repo_url: repoUrl }),
  });
  return handle(res, "Failed to fetch repository tree");
}

/**
 * Ask the RepoBrain agent a question about a repo.
 * threadId keeps conversation memory across turns (Postgres-backed).
 * repoId is your app's internal repo id (e.g. Prisma record id).
 */
export async function askAgent(
  repoUrl: string,
  question: string,
  threadId: string,
  repoId: string
): Promise<AgentChatResponse> {
  const res = await fetch(`${API_BASE}/agent/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      repo_url: repoUrl,
      question,
      thread_id: threadId,
      repo_id: repoId,
    }),
  });
  return handle(res, "Failed to chat with agent");
}
