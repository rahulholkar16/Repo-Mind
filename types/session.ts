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
}

export interface NewSessionResponse {
  session: { id: string; threadId: string; title: string };
}
