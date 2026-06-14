import { useState } from "react";
import { Plus, Sun, Moon, X } from "lucide-react";
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

import { cloneRepository, indexRepository, getTechStack, getArchitecture, getRepositoryTree } from "@/lib/api";

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

      // 1. Fetch real metadata from GitHub API (with fallback if rate-limited or offline)
      let repoData: RepoInfo = {
        owner,
        name,
        language: "TypeScript",
        stars: 1200,
        description: "GitHub repository analyzed by RepoBrain",
      };

      try {
        const ghRes = await fetch(`https://api.github.com/repos/${owner}/${name}`);
        if (ghRes.ok) {
          const ghJson = await ghRes.json();
          repoData = {
            owner: ghJson.owner?.login || owner,
            name: ghJson.name || name,
            language: ghJson.language || "TypeScript",
            stars: ghJson.stargazers_count || 0,
            description: ghJson.description || "No description provided.",
          };
        }
      } catch (e) {
        console.warn("Could not fetch github metadata, using fallbacks:", e);
      }

      // 2. Clone and Index the repository in the backend AI services
      await cloneRepository(repoUrl);
      const indexRes = await indexRepository(repoUrl);

      if (indexRes && typeof indexRes.indexed_chunks === "number") {
        repoData.indexedChunks = indexRes.indexed_chunks;
      }

      // 3. Fetch Tech Stack, Architecture, and File Tree reports
      try {
        const tsRes = await getTechStack(repoUrl);
        repoData.techStack = tsRes.answer;
      } catch (e) {
        console.error("Failed to fetch tech stack:", e);
      }

      try {
        const archRes = await getArchitecture(repoUrl);
        repoData.architecture = archRes;
      } catch (e) {
        console.error("Failed to fetch architecture:", e);
      }

      try {
        const treeRes = await getRepositoryTree(repoUrl);
        repoData.fileTree = treeRes.tree;
      } catch (e) {
        console.error("Failed to fetch file tree:", e);
      }

      onConnect(repoData);
    } catch (err: any) {
      alert(err.message || "Failed to connect to the repository. Make sure the AI backend is running on http://localhost:8000");
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
