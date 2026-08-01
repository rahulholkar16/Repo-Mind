"use client";

import { useState } from "react";
import { Plus, Sun, Moon, X } from "lucide-react";
import { toast } from "sonner";
import { RepoBrainMark } from "@/shared/components/RepoBrainMark";
import { Button } from "@/shared/components/ui/button";
import { Separator } from "@/shared/components/ui/separator";
import type { RepoInfo } from "@/lib/types";
import { RepoConnect } from "./sidebar/repo-connect";
import { SessionHistory } from "./sidebar/session-history";
import { useDashboardStore } from "@/modules/dashboard/store/use-dashboard-store";
import { getRepoInfo, indexRepository, getRepositoryTree } from "@/lib/api";
import pollIndexJob from "@/modules/dashboard/utils/poll-index-job";

interface LeftSidebarProps {
  isDark: boolean;
  setIsDark: (v: boolean) => void;
  isMobile?: boolean;
  isTablet?: boolean;
  onClose?: () => void;
}

export function LeftSidebar({ isDark, setIsDark, isMobile = false, isTablet = false, onClose }: LeftSidebarProps) {
  const connectedRepo    = useDashboardStore((s) => s.connectedRepo);
  const setConnectedRepo = useDashboardStore((s) => s.setConnectedRepo);
  const activeSession    = useDashboardStore((s) => s.activeSession);
  const setActiveSession = useDashboardStore((s) => s.setActiveSession);
  const sessions         = useDashboardStore((s) => s.sessions);
  const addSession       = useDashboardStore((s) => s.addSession);
  const resetLiveTools   = useDashboardStore((s) => s.resetLiveTools);

  const [urlInput,   setUrlInput]   = useState("");
  const [connecting, setConnecting] = useState(false);

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

      // 2. Fetch the file tree for the right panel
      try {
        const treeRes = await getRepositoryTree(repoUrl);
        repoData.fileTree = treeRes.tree;
      } catch (e) {
        console.error("Failed to fetch file tree:", e);
      }

      // 3. Index the repository (RepoBrain V2 reads files via the GitHub
      //    API directly — there is no separate clone step)
      const enqueRes = await fetch("/api/index-repo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ repo_url: repoUrl })
      });

      if (!enqueRes.ok) {
          throw new Error("Failed to queue repository indexing");
      }

      const { jobId } = await enqueRes.json();
      const indexRes = await pollIndexJob(jobId);
      if (indexRes && typeof indexRes.total_chunks === "number") {
          repoData.indexedChunks = indexRes.total_chunks;
      }

      setConnectedRepo(repoData);
      // Force a fresh conversation thread whenever a (new) repo is connected —
      // otherwise the agent keeps the old repo's messages/tool results in
      // context and answers about the wrong repository.
      resetLiveTools();
      const newId = crypto.randomUUID();
      addSession({ id: newId, repoName: `${owner}/${name}`, title: "New conversation", timestamp: "Now" });
      setActiveSession(newId);
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
    resetLiveTools();
    const newId = crypto.randomUUID();
    addSession({
      id: newId,
      repoName: connectedRepo ? `${connectedRepo.owner}/${connectedRepo.name}` : "No repo",
      title: "New conversation",
      timestamp: "Now",
    });
    setActiveSession(newId);
    onClose?.();
  }

  return (
    <div
      className="w-full h-full flex flex-col overflow-hidden font-sans"
      style={{
        background: "var(--rb-glass-bg-sidebar)",
        backdropFilter: "var(--rb-glass-backdrop-sidebar)",
        WebkitBackdropFilter: "var(--rb-glass-backdrop-sidebar)",
        borderRight: isMobile ? "none" : "1px solid var(--rb-glass-border-sidebar)",
        boxShadow: isMobile ? "4px 0 32px rgba(0,0,0,0.4)" : "none",
      }}
    >
      <div className={`relative flex-shrink-0 border-b border-border ${isMobile ? "px-[18px] pt-4 pb-3.5" : "px-5 pt-5 pb-4"}`}>
        <div className="flex items-center gap-2.5">
          <div className="flex-shrink-0 flex items-center">
            <RepoBrainMark size={34} isDark={isDark} />
          </div>
          <div>
            <div className={`font-mono ${isTablet ? "text-[13px]" : "text-[15px]"} font-semibold text-primary tracking-tight leading-none`}>
              RepoBrain
            </div>
            <div className="font-mono text-[10px] text-muted-foreground mt-0.5">
              AI Repo Analysis
            </div>
          </div>
        </div>

        {isMobile && onClose && (
          <Button
            variant="outline"
            size="icon"
            onClick={onClose}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 w-8 h-8"
          >
            <X size={15} />
          </Button>
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
        sessions={connectedRepo ? sessions.filter(s => s.repoName === `${connectedRepo.owner}/${connectedRepo.name}`) : []}
        activeSession={activeSession}
        setActiveSession={setActiveSession}
        onClose={onClose}
        isMobile={isMobile}
      />

      <div className={`flex-shrink-0 border-t border-border flex flex-col gap-2 px-3.5 ${isMobile ? "pt-3 pb-6" : "pt-3 pb-[18px]"}`}>
        <Button
          onClick={handleNewChat}
          className="w-full rounded-full text-white gap-1.5 hover:opacity-90 transition-opacity"
          style={{ background: "var(--rb-cta-gradient)" }}
        >
          <Plus size={14} /> New Chat
        </Button>

        <Separator />

        <Button
          variant="outline"
          onClick={() => setIsDark(!isDark)}
          className="w-full font-mono text-[11px] gap-1.5 hover:border-primary hover:text-primary"
        >
          {isDark ? <Sun size={12} /> : <Moon size={12} />}
          {isDark ? "Switch to Light" : "Switch to Dark"}
        </Button>
      </div>
    </div>
  );
}
