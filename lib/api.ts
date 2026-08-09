import type {
  RepoInfoResponse,
  RepoTreeResponse,
  IndexRepoResponse,
  AgentChatResponse,
  SessionSummary,
  SessionMessage,
  ConnectRepoResponse,
  NewSessionResponse,
  StreamHandlers,
} from "@/types";

// const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://ai-services-1zfs.onrender.com";
const WORKER_AI_SERVICE_URL = process.env.WORKER_AI_SERVICE_URL || "http://0.0.0.0:8000"; // used only by the worker (Docker container, no Next.js request context there)


async function handle<T>(res: Response, errorMessage: string): Promise<T> {
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    console.log("API error response:", res.status, body);
    throw new Error(body?.detail || errorMessage);
  }
  return res.json();
}

/**
 * Fetch basic repo metadata (owner, name, language, stars, description).
 * Call this right after the user pastes a GitHub URL.
 * Goes through our own /api/repo/info proxy route (attaches JWT server-side).
 */
export async function getRepoInfo(repoUrl: string): Promise<RepoInfoResponse> {
  const res = await fetch(`/api/repo/info`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ repo_url: repoUrl }),
  });
  return handle(res, "Failed to fetch repository info");
}

/**
 * Index a GitHub repository into Pinecone for semantic search.
 * Called from the BullMQ worker (no browser/cookie context there), so it
 * takes an already-captured JWT and calls ai-services directly.
 */
export async function indexRepository(repoUrl: string, token: string, force = false): Promise<IndexRepoResponse> {
  const res = await fetch(`${WORKER_AI_SERVICE_URL}/api/repo/index`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify({ repo_url: repoUrl, force }),
  });
  return handle(res, "Failed to index repository");
}

/**
 * Get the file/folder tree of a repo (for the file-tree side panel).
 * Goes through our own /api/repo/tree proxy route (attaches JWT server-side).
 */
export async function getRepositoryTree(repoUrl: string): Promise<RepoTreeResponse> {
  const res = await fetch(`/api/repo/tree`, {
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
 * Goes through our own /api/agent/chat proxy route (attaches JWT server-side) —
 * user identity now comes from the verified JWT, not the request body.
 */
export async function askAgent(
  repoUrl: string,
  question: string,
  threadId: string,
  repoId: string
): Promise<AgentChatResponse> {
  const res = await fetch(`/api/agent/chat`, {
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

/**
 * List every persisted chat session for the CURRENT user, read via Prisma
 * (ChatSession → Repo → userId). Served by a Next.js API route
 * (app/api/sessions) — no FastAPI involved.
 */
export async function getSessions(): Promise<SessionSummary[]> {
  const res = await fetch("/api/sessions");
  const data = await handle<{ sessions: SessionSummary[] }>(res, "Failed to load session history");
  return data.sessions;
}

/**
 * Fetch the full past message history for one session/thread so it can be
 * restored into the chat window when the user clicks it in the sidebar.
 */
export async function getSessionMessages(threadId: string): Promise<SessionMessage[]> {
  const res = await fetch(`/api/sessions/messages?threadId=${encodeURIComponent(threadId)}`);
  const data = await handle<{ messages: SessionMessage[] }>(res, "Failed to load session messages");
  return data.messages;
}

/**
 * Persists the connected repo (and its first chat session) to Postgres via
 * Prisma, scoped to the logged-in user. Call this once repo info / tree /
 * indexing have all succeeded.
 */
export async function connectRepoRecord(params: {
  repoUrl: string;
  owner: string;
  name: string;
  language?: string;
  stars?: number;
  description?: string;
  githubId?: string;
  isPrivate?: boolean;
  defaultBranch?: string;
}): Promise<ConnectRepoResponse> {
  const res = await fetch("/api/repos", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
  });
  return handle(res, "Failed to save connected repo");
}

/** Creates a new ChatSession row under an already-connected repo. */
export async function createNewSession(repoId: string): Promise<NewSessionResponse> {
  const res = await fetch("/api/sessions/new", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ repoId }),
  });
  return handle(res, "Failed to start a new chat session");
}

/**
 * Renames a session — used to auto-title a chat from its first message,
 * the same way ChatGPT/Claude do it. Fire-and-forget from the UI's
 * perspective; callers can ignore the resolved value.
 */
export async function renameSession(threadId: string, title: string): Promise<void> {
  const res = await fetch("/api/sessions/title", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ threadId, title }),
  });
  await handle(res, "Failed to rename session");
}

export async function streamAgent(
  repoUrl: string,
  question: string,
  threadId: string,
  repoId: string,
  handlers: StreamHandlers,
  signal?: AbortSignal
): Promise<void> {
  const res = await fetch(`/api/agent/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "text/event-stream",
    },
    body: JSON.stringify({
      repo_url: repoUrl,
      question,
      thread_id: threadId,
      repo_id: repoId,
    }),
    signal,
  });

  if (!res.ok || !res.body) {
    const body = await res.json().catch(() => null);
    throw new Error(body?.detail || `Stream request failed (${res.status})`);
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  const processFrame = (frame: string) => {
    let eventType = "message";
    const dataLines: string[] = [];

    for (const rawLine of frame.split("\n")) {
      const line = rawLine.trimEnd();
      if (line.startsWith("event:")) {
        eventType = line.slice("event:".length).trim();
      } else if (line.startsWith("data:")) {
        dataLines.push(line.slice("data:".length).replace(/^ /, ""));
      }
    }

    if (dataLines.length === 0) return;
    const data = dataLines.join("\n");

    if (eventType === "error") {
      handlers.onError(data);
    } else if (eventType === "done") {
      handlers.onDone();
    } else if (eventType === "tool_call") {
      handlers.onToolCall(data);
    } else if (eventType === "tool_result") {
      handlers.onToolResult(data);
    } else {
      handlers.onChunk(data);
    }
  };

  try {
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true }).replace(/\r\n/g, "\n");

      let sepIndex: number;
      while ((sepIndex = buffer.indexOf("\n\n")) !== -1) {
        const frame = buffer.slice(0, sepIndex);
        buffer = buffer.slice(sepIndex + 2);
        if (frame.trim()) processFrame(frame);
      }
    }
    if (buffer.trim()) processFrame(buffer);
  } finally {
    reader.releaseLock();
  }
}
