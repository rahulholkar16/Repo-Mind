import { create } from "zustand";
import type { ToolCall, DashboardState } from "@/types";

export const useDashboardStore = create<DashboardState>((set, get) => ({
  connectedRepo: null,
  setConnectedRepo: (repo) => set({ connectedRepo: repo }),

  // Seeded once on mount by dashboard-page (crypto.randomUUID needs a
  // browser context, so we don't generate it at module-eval time).
  activeSession: "",
  setActiveSession: (id) => set({ activeSession: id }),

  sessions: [],
  addSession: (session) => set((state) => ({ sessions: [session, ...state.sessions] })),
  // Replaces the whole list — used to hydrate from the DB-backed
  // /api/sessions route on load, so history survives a page refresh.
  // Sessions added locally (addSession) that the DB doesn't know about yet
  // (no message sent in them yet) are kept so a brand-new chat doesn't
  // disappear from the sidebar before its first message.
  setSessions: (fetched) =>
    set((state) => {
      const fetchedIds = new Set(fetched.map((s) => s.id));
      const localOnly = state.sessions.filter((s) => !fetchedIds.has(s.id));
      return { sessions: [...localOnly, ...fetched] };
    }),
  renameSession: (id, title) =>
    set((state) => ({
      sessions: state.sessions.map((s) => (s.id === id ? { ...s, title } : s)),
    })),

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
