import type { RepoInfo } from "./repo";
import type { Session } from "./session";
import type { ToolCall } from "./chat";

export interface DashboardState {
  // ── Connected repository ──
  connectedRepo: RepoInfo | null;
  setConnectedRepo: (repo: RepoInfo | null) => void;

  // ── Branch selected for the currently connecting/connected repo ──
  selectedBranch: string | null;
  setSelectedBranch: (branch: string | null) => void;

  // ── Chat sessions ──
  activeSession: string;
  setActiveSession: (id: string) => void;
  sessions: Session[];
  addSession: (session: Session) => void;
  setSessions: (sessions: Session[]) => void;
  renameSession: (id: string, title: string) => void;

  // ── Live agent activity (tool calls for the in-progress / most recent turn) ──
  liveTools: ToolCall[];
  pushToolStatus: (name: string, status: "calling" | "done") => void;
  resetLiveTools: () => void;
}
