import { useState } from "react";
import { Plus, Sun, Moon, X } from "lucide-react";
import { toast } from "sonner";
import { RepoBrainMark } from "@/components/RepoBrainMark";
import type { RepoInfo, Session  } from "@/lib/types";
import { RepoConnect } from "./sidebar/repo-connect";
import { SessionHistory } from "./sidebar/session-history";

interface LeftSidebarProps {
  connectedRepo: RepoInfo | null;
  onConnect: (repo: RepoInfo) => void;
  activeSession: string;
  setActiveSession: (id: string) => void;
  isDark: boolean;
  setIsDark: (v: boolean) => void;
  isMobile?: boolean;
  isTablet?: boolean;
  onClose?: () => void;
}

import { getRepoInfo, indexRepository, getRepositoryTree } from "@/lib/api";

const INITIAL_SESSIONS: Session[] = [];

export function LeftSidebar({ connectedRepo, onConnect, activeSession, setActiveSession, isDark, setIsDark, isMobile = false, isTablet = false, onClose }: LeftSidebarProps) {
  const [urlInput,   setUrlInput]   = useState("");
  const [connecting, setConnecting] = useState(false);
  const [sessions,   setSessions]   = useState<Session[]>(INITIAL_SESSIONS);

  async function handleConnect() {
    if (connecting || !urlInput.trim()) return;
    setConnecting(true);

    try {
      // Normalize URL and extract owner/repo
      let cleaned = urlInput.trim()
        .replace(/^https?:\/\/github\.com\//, "")
        .replace(/^github\.com\//, "");
      // Remove trailing slash or .git
      cleaned = cleaned.replace(/\.git$/, "").replace(/\/$/, "");

      const parts = cleaned.split("/");
      if (parts.length < 2) {
        throw new Error("Invalid repository path. Use format: owner/name");
      }
      const owner = parts[0];
      const name = parts[1];
      const repoUrl = `https://github.com/${owner}/${name}`;

      // 1. Fetch repo metadata via our backend (uses a GitHub token, avoids
      //    the frontend hitting GitHub's public rate limit directly)
      let repoData: RepoInfo = {
        owner,
        name,
        language: "Unknown",
        stars: 0,
        description: "",
      };

      try {
        const info = await getRepoInfo(repoUrl);
        repoData = { ...repoData, ...info };
      } catch (e) {
        console.warn("Could not fetch repo info, using fallbacks:", e);
      }

      // 2. Index the repository (RepoBrain V2 reads files via the GitHub
      //    API directly — there is no separate clone step)
      const indexRes = await indexRepository(repoUrl);
      if (indexRes && typeof indexRes.total_chunks === "number") {
        repoData.indexedChunks = indexRes.total_chunks;
      }

      // 3. Fetch the file tree for the right panel
      try {
        const treeRes = await getRepositoryTree(repoUrl);
        repoData.fileTree = treeRes.tree;
      } catch (e) {
        console.error("Failed to fetch file tree:", e);
      }

      onConnect(repoData);
    } catch (err: unknown) {
      const message =
        err instanceof Error && err.message
          ? err.message
          : "Failed to connect to the repository. Make sure the AI backend is running on http://localhost:8000";
      toast.error(message);
    } finally {
      setConnecting(false);
    }
  }

  function handleNewChat() {
    const newId = String(Date.now());
    setSessions(prev => [
      { id: newId, repoName: connectedRepo ? `${connectedRepo.owner}/${connectedRepo.name}` : "No repo", title: "New conversation", timestamp: "Now" },
      ...prev,
    ]);
    setActiveSession(newId);
    onClose?.();
  }

  return (
    <div style={{
      width: "100%", height: "100%", display: "flex", flexDirection: "column", overflow: "hidden",
      background: "var(--rb-glass-bg-sidebar)",
      backdropFilter: "var(--rb-glass-backdrop-sidebar)",
      WebkitBackdropFilter: "var(--rb-glass-backdrop-sidebar)",
      borderRight: isMobile ? "none" : "1px solid var(--rb-glass-border-sidebar)",
      fontFamily: "'Inter', sans-serif",
      boxShadow: isMobile ? "4px 0 32px rgba(0,0,0,0.4)" : "none",
    }}>

      <div style={{ padding: isMobile ? "16px 18px 14px" : "20px 20px 16px", borderBottom: "1px solid var(--border)", position: "relative", flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ flexShrink: 0, display: "flex", alignItems: "center" }}>
            <RepoBrainMark size={34} isDark={isDark} />
          </div>
          <div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: isTablet ? 13 : 15, fontWeight: 600, color: "var(--primary)", letterSpacing: "-0.02em", lineHeight: 1 }}>
              RepoBrain
            </div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: "var(--muted-foreground)", marginTop: 2 }}>
              AI Repo Analysis
            </div>
          </div>
        </div>

        {isMobile && onClose && (
          <button
            onClick={onClose}
            style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", width: 32, height: 32, borderRadius: 8, border: "1px solid var(--border)", background: "transparent", color: "var(--muted-foreground)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
          >
            <X size={15} />
          </button>
        )}
      </div>

      <RepoConnect
        urlInput={urlInput}
        setUrlInput={setUrlInput}
        connecting={connecting}
        onConnect={handleConnect}
        connectedRepo={connectedRepo}
        isTablet={isTablet}
      />

      <SessionHistory
        sessions={sessions}
        activeSession={activeSession}
        setActiveSession={setActiveSession}
        onClose={onClose}
        isMobile={isMobile}
      />

      <div style={{ padding: isMobile ? "12px 14px 24px" : "12px 14px 18px", borderTop: "1px solid var(--border)", display: "flex", flexDirection: "column", gap: 8, flexShrink: 0 }}>
        <button
          onClick={handleNewChat}
          style={{
            width: "100%", padding: "11px 0", borderRadius: 999,
            background: "var(--rb-cta-gradient)", color: "#fff",
            border: "none", fontFamily: "'Inter', sans-serif", fontSize: 13, fontWeight: 600,
            cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
          }}
          onMouseEnter={e => (e.currentTarget.style.opacity = "0.88")}
          onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
        >
          <Plus size={14} /> New Chat
        </button>

        <button
          onClick={() => setIsDark(!isDark)}
          style={{
            width: "100%", padding: "9px 0", borderRadius: 8,
            background: "transparent", color: "var(--muted-foreground)",
            border: "1px solid var(--border)", fontFamily: "'JetBrains Mono', monospace", fontSize: 11,
            cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
            transition: "all 0.15s",
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--primary)"; e.currentTarget.style.color = "var(--primary)"; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.color = "var(--muted-foreground)"; }}
        >
          {isDark ? <Sun size={12} /> : <Moon size={12} />}
          {isDark ? "Switch to Light" : "Switch to Dark"}
        </button>
      </div>
    </div>
  );
}
