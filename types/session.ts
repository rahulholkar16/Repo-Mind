import type { PrProposal, BranchProposal } from "./chat";

export interface Session {
  id: string;
  repoName: string;
  title: string;
  timestamp: string;
}

export type SessionSummary = Session;

export interface SessionMessage {
  role: "user" | "agent";
  content: string;
  id?: string;
  prProposal?: PrProposal;
  prStatus?: "pending" | "confirmed" | "rejected";
  prResult?: { pr_url?: string; pr_number?: number };
  branchProposal?: BranchProposal;
  branchStatus?: "pending" | "confirmed" | "rejected";
  branchResult?: { branch?: string; html_url?: string };
}

export interface NewSessionResponse {
  session: { id: string; threadId: string; title: string };
}
