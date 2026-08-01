import { create } from "zustand";
import type { RepoInfo, Session, ToolCall } from "@/lib/types";

interface DashboardState {
  // ── Connected repository ──
  connectedRepo: RepoInfo | null;
  setConnectedRepo: (repo: RepoInfo | null) => void;

  // ── Chat sessions ──
  activeSession: string;
  setActiveSession: (id: string) => void;
  sessions: Session[];
  addSession: (session: Session) => void;

  // ── Live agent activity (tool calls for the in-progress / most recent turn) ──
  liveTools: ToolCall[];
  pushToolStatus: (name: string, status: "calling" | "done") => void;
  resetLiveTools: () => void;
}

export const useDashboardStore = create<DashboardState>((set, get) => ({
  connectedRepo: null,
  setConnectedRepo: (repo) => set({ connectedRepo: repo }),

  // Seeded once on mount by dashboard-page (crypto.randomUUID needs a
  // browser context, so we don't generate it at module-eval time).
  activeSession: "",
  setActiveSession: (id) => set({ activeSession: id }),

  sessions: [],
  addSession: (session) => set((state) => ({ sessions: [session, ...state.sessions] })),

  liveTools: [],
  pushToolStatus: (name, status) => {
    const existing = get().liveTools;
    const idx = existing.findIndex((t) => t.name === name);
    const updated: ToolCall = { name, args: status === "calling" ? "running..." : "done" };

    if (idx === -1) {
      set({ liveTools: [...existing, updated] });
    } else {
      const next = [...existing];
      next[idx] = updated;
      set({ liveTools: next });
    }
  },
  resetLiveTools: () => set({ liveTools: [] }),
}));
