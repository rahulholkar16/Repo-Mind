import type { ToolCall } from "./types";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export interface RepoRequest {
  repo_url: string;
}

export interface AgentRequest {
  repo_url: string;
  question: string;
  session_id: string;
}

export interface TechStackResponse {
  answer: {
    frontend?: string;
    backend?: string;
    database?: string;
    orm?: string;
    authentication?: string;
    state_management?: string;
    styling?: string;
    deployment?: string;
  };
}

export interface ArchitectureResponse {
  project_overview: string;
  architecture: string;
  modules: string[];
  data_flow: string;
  authentication_flow: string;
  database_flow: string;
  api_flow: string;
}

export interface AgentChatResponse {
  answer: string;
  codeBlock?: { language: string; code: string };
  toolCalls?: ToolCall[];
}

export async function cloneRepository(repoUrl: string) {
  const res = await fetch(`${API_BASE}/repositiory/clone`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ repo_url: repoUrl }),
  });
  if (!res.ok) throw new Error("Failed to clone repository");
  return res.json();
}

export async function indexRepository(repoUrl: string) {
  const res = await fetch(`${API_BASE}/repositiory/index`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ repo_url: repoUrl }),
  });
  if (!res.ok) throw new Error("Failed to index repository");
  return res.json();
}

export async function getTechStack(repoUrl: string): Promise<TechStackResponse> {
  const res = await fetch(`${API_BASE}/tech_stack`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ repo_url: repoUrl }),
  });
  if (!res.ok) throw new Error("Failed to get tech stack");
  return res.json();
}

export async function getArchitecture(repoUrl: string): Promise<ArchitectureResponse> {
  const res = await fetch(`${API_BASE}/repository/architecture`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ repo_url: repoUrl }),
  });
  if (!res.ok) throw new Error("Failed to get architecture");
  return res.json();
}

export async function askAgent(repoUrl: string, question: string, sessionId: string): Promise<AgentChatResponse> {
  const res = await fetch(`${API_BASE}/agent/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ repo_url: repoUrl, question, session_id: sessionId }),
  });
  if (!res.ok) throw new Error("Failed to chat with agent");
  return res.json();
}

export async function getRepositoryTree(repoUrl: string) {
  const res = await fetch(`${API_BASE}/repositiory/tree`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ repo_url: repoUrl }),
  });
  if (!res.ok) throw new Error("Failed to fetch repository tree");
  return res.json();
}
